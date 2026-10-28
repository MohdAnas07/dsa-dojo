/**
 * Checks src/content/statements: every entry belongs to a real problem, has a description,
 * at most one explanation per visible example, and a walkthrough. Also reports coverage.
 * Usage: npx tsx scripts/verify/statements.ts [--strict]   (--strict fails if any problem lacks a statement)
 */
import { PROBLEMS } from "../../src/content/problems";
import { JUDGE } from "../../src/content/judge";
import { STATEMENTS } from "../../src/content/statements";

const ids = new Set(PROBLEMS.map(p => p.id));
const errors: string[] = [];
for (const [id, st] of Object.entries(STATEMENTS)) {
  if (!ids.has(id)) { errors.push(`${id}: no problem with this id`); continue; }
  const n = JUDGE[id].cases.length;
  if (!st.body?.length || st.body.some(p => !p.trim())) errors.push(`${id}: empty description`);
  if (st.why && st.why.length > n) errors.push(`${id}: ${st.why.length} explanations but only ${n} examples`);
  if (!st.walk?.length) errors.push(`${id}: missing walkthrough`);
  if (!st.cons?.length) errors.push(`${id}: missing constraints`);
  const text = [...st.body, ...(st.why || []).filter(Boolean) as string[], ...(st.walk || []), ...(st.cons || [])].join(" ");
  if ((text.match(/`/g) || []).length % 2) errors.push(`${id}: unbalanced backticks`);
}
const missing = PROBLEMS.filter(p => !STATEMENTS[p.id]).map(p => p.id);
const fewEx = PROBLEMS.filter(p => JUDGE[p.id].cases.length < 2).map(p => p.id);
console.log(`Statements: ${PROBLEMS.length - missing.length}/${PROBLEMS.length} problems`);
if (fewEx.length) console.log(`Problems with fewer than 2 examples (${fewEx.length}): ${fewEx.join(", ")}`);
if (errors.length) { console.error("\n" + errors.join("\n")); process.exit(1); }
if (process.argv.includes("--strict") && missing.length) { console.error(`Missing statements: ${missing.join(", ")}`); process.exit(1); }
console.log("statements OK");
