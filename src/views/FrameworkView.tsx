"use client";
import CodeBlock from "@/components/CodeBlock";
import { PROB } from "@/lib/data";
import expected from "@/generated/expected.json";

const OUT = expected.samples as Record<string, string>;
const STEPS: [string, string][] = [
  ["Understand the problem", "Read twice. Restate it in one sentence. Ask about constraints: size of n, negatives, duplicates, empty input, sorted or not."],
  ["Write examples", "Make a small normal example and one edge case. Solve them by hand; this is where the idea usually appears."],
  ["Identify input / output", "Exact types: array of numbers → index pair? count? boolean? Modify in place or return new?"],
  ["Think brute force", "Say the simplest correct approach out loud, even if slow. It proves you understand the problem."],
  ["Analyze its complexity", "O(n²)? Compare with constraints: n = 10⁵ means O(n²) = 10¹⁰ operations, too slow."],
  ["Find the pattern", "Which clue words appear? Contiguous → window. Sorted → two pointers / binary search. Seen before → hash map."],
  ["Optimize", "What repeated work does brute force do? Remember it (hash map), skip it (pointers), or reuse it (window, prefix sum, DP)."],
  ["Code", "Clean names, small helper functions. Talk while you type."],
  ["Test edge cases", "Walk through your example line by line. Then: empty, one element, all equal, negatives, very large."],
  ["Analyze final complexity", "State time and space with a reason: \"Each element enters and leaves the window once, so O(n).\""]
];
const W1: [string, string][] = [["1. Understand", "Find two different indexes whose values add to target. One answer guaranteed."], ["2. Examples", "[2, 7, 11, 15], 9 → [0, 1]. Edge: [3, 3], 6 → [0, 1] (same value, different index)."], ["3. Input/Output", "Array of numbers + number → array of two indexes."], ["4. Brute force", "Check every pair i < j."], ["5. Complexity", "O(n²) time. For n = 10⁴ that's 10⁸ checks, borderline."], ["6. Pattern", "\"Have I seen the partner before?\" → Hashing."], ["7. Optimize", "For each x, look up target − x in a Map of value → index. O(1) per lookup."], ["8. Code", "See below."], ["9. Edge cases", "Duplicates: check the map BEFORE inserting the current value."], ["10. Final", "O(n) time, O(n) space."]];
const W2: [string, string][] = [["1. Understand", "Length of the longest contiguous piece of the string with all unique characters."], ["2. Examples", "\"abcabcbb\" → 3. Edge: \"\" → 0, \"bbbb\" → 1."], ["4. Brute force", "Every substring, check uniqueness with a Set: O(n³), or O(n²) with early stop."], ["6. Pattern", "Contiguous + longest + condition → Sliding Window."], ["7. Optimize", "Grow right; when a duplicate appears inside the window, jump left past its previous index."], ["9. Edge cases", "A duplicate that's already outside the window must not move left backwards: check lastIndex ≥ left."], ["10. Final", "O(n) time, O(k) space for the alphabet."]];
const Table = ({ rows }: { rows: [string, string][] }) => <div className="card tw" style={{ padding: "6px 8px" }}><table className="t"><tbody>{rows.map(([a, b]) => <tr key={a}><td style={{ whiteSpace: "nowrap", fontWeight: 600 }}>{a}</td><td className="muted">{b}</td></tr>)}</tbody></table></div>;

export default function FrameworkView() {
  return (
    <div className="stack">
      <span className="eyebrow">Problem-solving framework</span><h1>How to solve any DSA problem</h1>
      <p className="lead">Interviewers grade the process as much as the answer. Follow these 10 steps every time until they&apos;re automatic.</p>
      <div className="card"><div className="flow">{STEPS.map(([t, d]) => <div key={t}><div><h3>{t}</h3><p className="muted" style={{ fontSize: 14.5, marginTop: 2 }}>{d}</p></div></div>)}</div></div>
      <h2 style={{ marginTop: 10 }}>Worked example 1: Two Sum</h2><Table rows={W1} /><CodeBlock sample={PROB["two-sum"].c} expected={OUT["problem.two-sum"]} />
      <h2 style={{ marginTop: 10 }}>Worked example 2: Longest substring without repeats</h2><Table rows={W2} /><CodeBlock sample={PROB["longest-substring"].c} expected={OUT["problem.longest-substring"]} />
      <div className="card"><h3 style={{ marginBottom: 8 }}>What to say out loud</h3><ul className="clean" style={{ fontSize: 14.5 }}><li><span>&quot;Let me make sure I understand: …&quot;</span></li><li><span>&quot;The brute force would be …, which is O(…). Given n up to …, that&apos;s too slow.&quot;</span></li><li><span>&quot;I notice the problem says contiguous and longest, which suggests a sliding window.&quot;</span></li><li><span>&quot;Let me trace through my example before I call it done.&quot;</span></li></ul></div>
    </div>
  );
}
