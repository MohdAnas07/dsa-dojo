/**
 * Renders every step of every solution trace (public/traces) with the real renderer and checks the
 * generated explanations: no crashes, no "undefined"/"NaN" text, valid code-line tags and quiz answers.
 * Run after scripts/generate-traces.ts.  npm run verify:traces
 */
import { readFileSync, readdirSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PROBLEMS } from "../../src/content/problems";
import { buildTraceViz } from "../../src/components/pv/trace/build";
import type { TraceFile } from "../../src/components/pv/trace/model";

const files = readdirSync("public/traces").filter(f => f.endsWith(".json"));
let fails = 0, steps = 0;
const fail = (m: string) => { fails++; if (fails <= 40) console.error("✗ " + m); };
if (files.length !== PROBLEMS.length) fail(`expected ${PROBLEMS.length} traces, found ${files.length}`);
for (const f of files) {
  const t = JSON.parse(readFileSync("public/traces/" + f, "utf8")) as TraceFile;
  const p = PROBLEMS.find(x => x.id === t.id)!;
  const viz = buildTraceViz(t, { title: p.t, tc: p.tc, sc: p.sc, approach: p.a });
  const mode = viz.modes[0], lines = mode.code.split("\n").length;
  mode.presets.forEach((pr, ei) => {
    const st = mode.run(pr.values);
    if (!st.length) fail(`${t.id} ex${ei + 1}: no steps`);
    st.forEach((s, i) => {
      steps++;
      const where = `${t.id} ex${ei + 1} step ${i + 1}`;
      const text = [s.what, s.why, s.next, s.brief, ...(s.inspect || []).map(r => String(r[1]))].join(" ");
      // Real values may be undefined/NaN; these patterns only appear when a template is fed a missing value.
      if (/\[object |line undefined|line NaN|\*\*undefined\*\*|returns \*\*undefined|undefined\(\)/.test(text)) fail(`${where}: odd text: ${text.slice(0, 160)}`);
      if (!s.what || s.what.length < 4 || !s.brief) fail(`${where}: missing explanation`);
      if (s.at && !/^L\d+$/.test(String(s.at))) fail(`${where}: bad line tag ${s.at}`);
      if (s.at && +String(s.at).slice(1) > lines) fail(`${where}: line ${s.at} beyond the code`);
      if (s.quiz && !(s.quiz.answer >= 0 && s.quiz.answer < s.quiz.options.length)) fail(`${where}: bad quiz`);
      try { renderToStaticMarkup(createElement(mode.View, { s: s.s })); }
      catch (e) { fail(`${where}: render crashed: ${(e as Error).message}`); }
    });
  });
}
console.log(`${files.length} traces, ${steps} steps rendered, ${fails} failures`);
if (fails) process.exit(1);
