import { NextResponse } from "next/server";
import { LANG, LANGUAGES, isLangId, type LangId } from "@/lib/languages";

/**
 * POST /api/execute  { language, code, stdin? }  →  { stdout, stderr, exitCode, signal, status, message, compileOutput, timeMs }
 * GET  /api/execute                              →  { configured, languages, available }
 *
 * Forwards code to a Piston server (https://github.com/engineer-man/piston) at PISTON_URL.
 * Piston runs each submission in an isolated sandbox with CPU, memory and time limits.
 * Never run user code directly on this web server.
 *
 * The limits sent here must not exceed the server's PISTON_RUN_TIMEOUT / PISTON_COMPILE_TIMEOUT etc.
 * (see docker-compose.piston.yml), otherwise Piston rejects the request with HTTP 400.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PISTON_URL = process.env.PISTON_URL?.replace(/\/+$/, "");
const PISTON_TOKEN = process.env.PISTON_TOKEN;
const MAX_CODE = 64 * 1024;
const MAX_STDIN = 4 * 1024 * 1024;
const RUN_TIMEOUT_MS = Number(process.env.RUN_TIMEOUT_MS || 10000);
const COMPILE_TIMEOUT_MS = Number(process.env.COMPILE_TIMEOUT_MS || 15000);
const RATE_LIMIT = Number(process.env.RATE_LIMIT_PER_MINUTE || 30);
const headers = { "Content-Type": "application/json", ...(PISTON_TOKEN ? { Authorization: PISTON_TOKEN } : {}) };

// Simple per-IP rate limit (per server instance). Use Redis/Upstash for multi-instance deployments.
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 60_000);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > RATE_LIMIT;
}

// Which languages are actually installed on the Piston server (cached briefly, so newly installed ones show up quickly).
let runtimesCache: { at: number; ids: LangId[] | null } = { at: 0, ids: null };
async function installedLanguages(): Promise<LangId[] | null> {
  if (!PISTON_URL) return null;
  if (Date.now() - runtimesCache.at < 10_000) return runtimesCache.ids;
  let ids: LangId[] | null = null;
  try {
    const res = await fetch(`${PISTON_URL}/api/v2/runtimes`, { headers, signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const rts = (await res.json()) as { language: string; aliases?: string[] }[];
      const names = new Set(rts.flatMap(r => [r.language, ...(r.aliases || [])]));
      ids = LANGUAGES.filter(l => l.runtime === "server" && names.has(l.piston!.language)).map(l => l.id);
    }
  } catch { /* server unreachable */ }
  runtimesCache = { at: Date.now(), ids };
  return ids;
}

export async function GET() {
  return NextResponse.json({
    configured: Boolean(PISTON_URL),
    languages: LANGUAGES.filter(l => l.runtime === "server").map(l => l.id),
    /** null = unknown (server not configured or unreachable) */
    available: await installedLanguages()
  });
}

const STATUS_TEXT: Record<string, string> = {
  TO: "Time limit exceeded.",
  OL: "Too much output (stdout limit exceeded).",
  EL: "Too much error output (stderr limit exceeded).",
  SG: "Your program was killed by a signal (often: out of memory).",
  XX: "The execution server had an internal error."
};

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return NextResponse.json({ error: "Too many runs. Wait a minute and try again." }, { status: 429 });

  let body: { language?: unknown; code?: unknown; stdin?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  const { language, code, stdin = "" } = body;
  if (!isLangId(language) || LANG[language].runtime !== "server") return NextResponse.json({ error: "Unsupported language." }, { status: 400 });
  if (typeof code !== "string" || !code.trim()) return NextResponse.json({ error: "Code is empty." }, { status: 400 });
  if (code.length > MAX_CODE) return NextResponse.json({ error: "Code is too long (max 64 KB)." }, { status: 413 });
  if (typeof stdin !== "string" || stdin.length > MAX_STDIN) return NextResponse.json({ error: "Input is too large." }, { status: 413 });
  if (!PISTON_URL) {
    return NextResponse.json({ error: `${LANG[language].label} needs a code-execution server. Set PISTON_URL (see README → "Enable other languages").` }, { status: 503 });
  }

  const p = LANG[language].piston!;
  const compileMs = COMPILE_TIMEOUT_MS;
  const started = Date.now();
  try {
    const res = await fetch(`${PISTON_URL}/api/v2/execute`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        language: p.language, version: p.version, files: [{ name: p.file, content: code }], stdin,
        run_timeout: RUN_TIMEOUT_MS, run_cpu_time: RUN_TIMEOUT_MS,
        compile_timeout: compileMs, compile_cpu_time: compileMs,
        run_memory_limit: 512 * 1024 * 1024
      }),
      signal: AbortSignal.timeout(RUN_TIMEOUT_MS + compileMs + 15000)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg: string = data.message || `Execution server error (${res.status}).`;
      if (/runtime is unknown/.test(msg)) {
        runtimesCache.at = 0;
        return NextResponse.json({ error: `${LANG[language].label} isn't installed on the execution server yet. Install it with: npm run piston:install (package "${p.pkg}").` }, { status: 502 });
      }
      return NextResponse.json({ error: msg }, { status: 502 });
    }
    const compileFailed = data.compile && (data.compile.code !== 0 || data.compile.status);
    const stage = compileFailed ? data.compile : data.run;
    const status: string | null = stage?.status ?? null;
    return NextResponse.json({
      stdout: data.run?.stdout ?? "",
      stderr: data.run?.stderr ?? "",
      exitCode: stage?.code ?? null,
      signal: stage?.signal ?? null,
      status,
      message: status ? (status === "TO" && compileFailed ? "Compilation took too long." : STATUS_TEXT[status] || stage?.message || null) : null,
      compileOutput: compileFailed ? (data.compile.stderr || data.compile.output || (data.compile.status === "TO" ? "Compilation took too long." : "Compilation failed")) : null,
      timeMs: Date.now() - started
    });
  } catch (e) {
    const timeout = (e as Error).name === "TimeoutError";
    return NextResponse.json({ error: timeout ? "The execution server did not respond in time." : "Could not reach the execution server. Is Piston running? (npm run piston:up)" }, { status: 504 });
  }
}
