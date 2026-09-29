/**
 * Build step: runs every code sample and every reference solution against its tests,
 * and stores the results in src/generated/expected.json.
 * - "Expected output" shown under code samples is the real output of that code.
 * - Judge expected answers come from the reference solutions, so adding a test = adding an input.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import vm from "node:vm";
import { LESSONS } from "../src/content/lessons";
import { PROBLEMS } from "../src/content/problems";
import { JUDGE } from "../src/content/judge";
import { TOPICS, PATTERNS } from "../src/content/roadmap";
import { HARNESS_SRC, judgeCheck, judgeHash, judgeNorm } from "../src/lib/judge-core";
import { fmt } from "../src/lib/fmt";

const errors: string[] = [];
function run(code: string, key: string): string {
  const logs: string[] = [];
  const log = (...a: unknown[]) => logs.push(a.map(x => fmt(x)).join(" "));
  try { new Function("console", code)({ log, info: log, warn: log, error: log }); }
  catch (e) { errors.push(`${key}: ${(e as Error).message}`); }
  return logs.join("\n");
}
const samples: Record<string, string> = {};
for (const [slug, l] of Object.entries(LESSONS)) {
  if (!TOPICS.find(t => t.slug === slug)) errors.push(`lesson ${slug} is not in TOPICS`);
  samples[`lesson.${slug}.code`] = run(l.code.c, slug + ".code");
  if (l.brute) samples[`lesson.${slug}.brute`] = run(l.brute.c, slug + ".brute");
  l.examples.forEach((e, i) => (samples[`lesson.${slug}.ex.${i}`] = run(e.c, `${slug}.ex${i}`)));
  if (l.examples.length < 3) errors.push(`${slug}: needs at least 3 examples`);
  for (const list of Object.values(l.iq)) for (const q of list) if (/^[a-z0-9-]+$/.test(q) && !PROBLEMS.find(p => p.id === q)) errors.push(`${slug}: unknown problem id ${q}`);
}
for (const p of PROBLEMS) {
  samples[`problem.${p.id}`] = run(p.c, p.id);
  if (!PATTERNS.find(x => x.id === p.pat)) errors.push(`${p.id}: unknown pattern ${p.pat}`);
  if (!TOPICS.find(x => x.slug === p.topic)) errors.push(`${p.id}: unknown topic ${p.topic}`);
}

vm.runInThisContext(HARNESS_SRC + ";globalThis.__runCase = __runCase;");
const runCase = (globalThis as unknown as { __runCase: (fn: unknown, spec: unknown, args: unknown[]) => unknown }).__runCase;
const noop = { log() {}, info() {}, warn() {}, error() {} };
const judge: Record<string, { cases: unknown[]; hidden: unknown[] }> = {};
for (const p of PROBLEMS) {
  const spec = JUDGE[p.id];
  if (!spec) { errors.push(`${p.id}: no judge spec`); continue; }
  let ref: unknown;
  try { ref = new Function("console", p.c + "\n;return " + (spec.ref || spec.fn) + ";")(noop); } catch (e) { errors.push(`${p.id} ref: ${(e as Error).message}`); continue; }
  const one = (c: unknown, where: string) => {
    const args = (c as { gen?: string }).gen ? eval("(" + (c as { gen: string }).gen + ")")() : c;
    try {
      const out = runCase(ref, spec, args);
      const j = JSON.stringify(out);
      if (j.length > 3000) return { __hash: judgeHash(JSON.stringify(judgeNorm(spec.cmp, JSON.parse(j)))) };
      const parsed = JSON.parse(j);
      if (!judgeCheck(spec.cmp, parsed, out)) errors.push(`${p.id}: self-check failed`);
      return parsed;
    } catch (e) { errors.push(`${p.id} ${where}: ${(e as Error).message}`); return null; }
  };
  judge[p.id] = { cases: spec.cases.map((c, i) => one(c, "case" + i)), hidden: spec.hidden.map((c, i) => one(c, "hidden" + i)) };
}
if (errors.length) { console.error("Content check failed:\n" + errors.join("\n")); process.exit(1); }
mkdirSync("src/generated", { recursive: true });
writeFileSync("src/generated/expected.json", JSON.stringify({ samples, judge }));
console.log(`✓ ${Object.keys(samples).length} code samples, ${Object.keys(judge).length} judged problems`);
