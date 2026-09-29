import { NextResponse } from "next/server";
import { LANG, LANGUAGES, isLangId } from "@/lib/languages";

/**
 * POST /api/execute  { language, code, stdin? }  →  { stdout, stderr, exitCode, signal, compileOutput, timeMs }
 * GET  /api/execute                              →  { configured, languages }
 *
 * Forwards code to a Piston server (https://github.com/engineer-man/piston) at PISTON_URL.
 * Piston runs each submission in an isolated sandbox with CPU, memory and time limits.
 * Never run user code directly on this web server.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PISTON_URL = process.env.PISTON_URL?.replace(/\/+$/, "");
const PISTON_TOKEN = process.env.PISTON_TOKEN;
const MAX_CODE = 64 * 1024;
const MAX_STDIN = 4 * 1024 * 1024;
const RUN_TIMEOUT_MS = Number(process.env.RUN_TIMEOUT_MS || 10000);
const RATE_LIMIT = Number(process.env.RATE_LIMIT_PER_MINUTE || 30);

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

export async function GET() {
  return NextResponse.json({
    configured: Boolean(PISTON_URL),
    languages: LANGUAGES.filter(l => l.runtime === "server").map(l => l.id)
  });
}

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
  const started = Date.now();
  try {
    const res = await fetch(`${PISTON_URL}/api/v2/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(PISTON_TOKEN ? { Authorization: PISTON_TOKEN } : {}) },
      body: JSON.stringify({
        language: p.language, version: p.version, files: [{ name: p.file, content: code }], stdin,
        run_timeout: RUN_TIMEOUT_MS, compile_timeout: 10000, run_memory_limit: 256 * 1024 * 1024
      }),
      signal: AbortSignal.timeout(RUN_TIMEOUT_MS + 15000)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json({ error: data.message || `Execution server error (${res.status}).` }, { status: 502 });
    const compileFailed = data.compile && data.compile.code !== 0;
    return NextResponse.json({
      stdout: data.run?.stdout ?? "",
      stderr: data.run?.stderr ?? "",
      exitCode: compileFailed ? data.compile.code : data.run?.code ?? null,
      signal: data.run?.signal ?? null,
      compileOutput: compileFailed ? (data.compile.stderr || data.compile.output || "Compilation failed") : null,
      timeMs: Date.now() - started
    });
  } catch (e) {
    const timeout = (e as Error).name === "TimeoutError";
    return NextResponse.json({ error: timeout ? "The execution server did not respond in time." : "Could not reach the execution server." }, { status: 504 });
  }
}
