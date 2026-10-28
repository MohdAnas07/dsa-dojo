/**
 * Build step: records a step-by-step trace of every problem's reference solution on the statement's
 * examples, for the "Visualize the solution" player. Output: public/traces/<id>.json (one small file per
 * problem, fetched only when a learner opens it).
 * The instrumented solution must give exactly the judge's expected answer, or the problem is reported.
 */
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import vm from "node:vm";
import { PROBLEMS } from "../src/content/problems";
import { JUDGE } from "../src/content/judge";
import { HARNESS_SRC, judgeHash, judgeNorm } from "../src/lib/judge-core";
import expected from "../src/generated/expected.json";
import { displayCode, instrument } from "./trace/instrument";
import { makeRecorder } from "./trace/recorder";

const CAP = 400, MAX_EXAMPLES = 3;
const strict = process.argv.includes("--strict");
const only = process.argv.find(a => a.startsWith("--only="))?.slice(7);
vm.runInThisContext(HARNESS_SRC + ";globalThis.__runCase = __runCase;");
const runCase = (globalThis as unknown as { __runCase: (fn: unknown, spec: unknown, args: unknown[]) => unknown }).__runCase;
const EXP = (expected as { judge: Record<string, { cases: unknown[] }> }).judge;
const noop = { log() {}, info() {}, warn() {}, error() {} };

rmSync("public/traces", { recursive: true, force: true });
mkdirSync("public/traces", { recursive: true });
const problems: string[] = [];
let total = 0, bytes = 0, truncatedCount = 0;
const t0 = Date.now();
for (const p of PROBLEMS) {
  if (only && p.id !== only) continue;
  const spec = JUDGE[p.id], entry = spec.ref || spec.fn;
  try {
    const code = displayCode(p.c, entry);
    const { js, meta } = instrument(code);
    const examples = [];
    for (let i = 0; i < Math.min(MAX_EXAMPLES, spec.cases.length); i++) {
      const rec = makeRecorder(CAP);
      const fn = new Function("__t", "__k", "__c", "__r", "__enter", "__exit", "console", js + "\n;return " + entry + ";")(rec.api.__t, rec.api.__k, rec.api.__c, rec.api.__r, rec.api.__enter, rec.api.__exit, noop);
      const args = JSON.parse(JSON.stringify(spec.cases[i]));
      const out = runCase(fn, spec, args);
      const want = EXP[p.id].cases[i];
      const got = JSON.parse(JSON.stringify(out ?? null));
      const same = want && typeof want === "object" && "__hash" in (want as object)
        ? (want as { __hash: string }).__hash === judgeHash(JSON.stringify(judgeNorm(spec.cmp, got)))
        : JSON.stringify(judgeNorm(spec.cmp, got)) === JSON.stringify(judgeNorm(spec.cmp, want));
      if (!same) throw new Error(`example ${i + 1}: traced run gave ${JSON.stringify(got).slice(0, 80)}, expected ${JSON.stringify(want).slice(0, 80)}`);
      const { steps, truncated } = rec.result();
      if (truncated) truncatedCount++;
      total += steps.length;
      const input = spec.design ? [["operations", (spec.cases[i] as unknown[])[0]], ["arguments", (spec.cases[i] as unknown[])[1]]] : spec.params.map(([n], k) => [n, (spec.cases[i] as unknown[])[k]]);
      examples.push({ input, output: got, steps, truncated });
    }
    const file = JSON.stringify({ id: p.id, entry, ...meta, examples });
    bytes += file.length;
    writeFileSync(`public/traces/${p.id}.json`, file);
    problems.push(p.id);
  } catch (e) {
    const msg = `${p.id}: ${(e as Error).message}`;
    if (strict) { console.error("✗ " + msg); process.exitCode = 1; } else console.warn("⚠ trace skipped, " + msg);
  }
}
mkdirSync("src/generated", { recursive: true });
writeFileSync("src/generated/traces.json", JSON.stringify(problems));
console.log(`✓ traced ${problems.length}/${only ? 1 : PROBLEMS.length} problems, ${total} steps, ${(bytes / 1e6).toFixed(1)} MB, ${truncatedCount} example(s) cut at ${CAP} steps, ${Date.now() - t0} ms`);
