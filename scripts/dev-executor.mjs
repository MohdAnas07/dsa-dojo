/**
 * LOCAL DEVELOPMENT ONLY — a tiny stand-in for the Piston API.
 *
 * It runs code directly on your machine with NO sandbox, so never expose it to the internet
 * or use it in production. It only listens on 127.0.0.1.
 *
 * Usage:  node scripts/dev-executor.mjs        (then set PISTON_URL=http://127.0.0.1:2000 in .env.local)
 * Supports: python (python3), javascript/typescript (node), c++ (g++), c (gcc), java (javac/java), go (go run) — whichever are installed.
 */
import http from "node:http";
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const PORT = Number(process.env.PORT || 2000);
const RUNNERS = {
  python: f => [["python3", [f]]],
  javascript: f => [["node", [f]]],
  typescript: f => [["node", ["--experimental-strip-types", f]]],
  "c++": (f, d) => [["g++", ["-O2", "-o", path.join(d, "a.out"), f]], [path.join(d, "a.out"), []]],
  c: (f, d) => [["gcc", ["-O2", "-o", path.join(d, "a.out"), f]], [path.join(d, "a.out"), []]],
  java: (f, d) => [["javac", [f]], ["java", ["-cp", d, "Main"]]],
  go: f => [["go", ["run", f]]]
};
function exec(cmd, args, stdin, timeout, cwd) {
  return new Promise(resolve => {
    let stdout = "", stderr = "", signal = null;
    const p = spawn(cmd, args, { cwd });
    const t = setTimeout(() => { signal = "SIGKILL"; p.kill("SIGKILL"); }, timeout);
    p.stdout.on("data", d => { if (stdout.length < 5e6) stdout += d; });
    p.stderr.on("data", d => { if (stderr.length < 1e6) stderr += d; });
    p.on("error", e => { clearTimeout(t); resolve({ stdout, stderr: String(e.message), code: 127, signal }); });
    p.on("close", code => { clearTimeout(t); resolve({ stdout, stderr, code, signal, output: stdout + stderr }); });
    p.stdin.on("error", () => {});
    p.stdin.end(stdin || "");
  });
}
http.createServer(async (req, res) => {
  const send = (code, obj) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(obj)); };
  if (req.method === "GET" && req.url === "/api/v2/runtimes") return send(200, Object.keys(RUNNERS).map(l => ({ language: l, version: "local" })));
  if (req.method !== "POST" || req.url !== "/api/v2/execute") return send(404, { message: "Not found" });
  let body = ""; for await (const c of req) body += c;
  let job; try { job = JSON.parse(body); } catch { return send(400, { message: "Bad JSON" }); }
  const runner = RUNNERS[job.language];
  if (!runner) return send(400, { message: `runtime is unknown: ${job.language}` });
  const dir = mkdtempSync(path.join(tmpdir(), "dojo-"));
  try {
    const file = path.join(dir, job.files?.[0]?.name || "main.txt");
    writeFileSync(file, job.files?.[0]?.content || "");
    const steps = runner(file, dir);
    let compile;
    if (steps.length > 1) {
      compile = await exec(steps[0][0], steps[0][1], "", job.compile_timeout || 10000, dir);
      if (compile.code !== 0) return send(200, { language: job.language, version: "local", compile, run: { stdout: "", stderr: "", code: null, signal: null } });
    }
    const [cmd, args] = steps[steps.length - 1];
    const run = await exec(cmd, args, job.stdin, Math.min(job.run_timeout || 3000, 15000), dir);
    send(200, { language: job.language, version: "local", ...(compile ? { compile } : {}), run });
  } finally { rmSync(dir, { recursive: true, force: true }); }
}).listen(PORT, "127.0.0.1", () => console.log(`Dev executor (NOT sandboxed) on http://127.0.0.1:${PORT}`));
