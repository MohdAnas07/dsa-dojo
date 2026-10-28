import type { Mode, PatternViz, Step } from "../types";
import { nums, int } from "../types";
import { Table, type Arc } from "../prims";
import { ArrayView, Calc, cells, between, type AS } from "./_kit";

const query: Mode<AS> = {
  id: "range", label: "Range sums", task: "Build running totals once, then answer any range sum with one subtraction.",
  fields: [{ key: "a", label: "nums", wide: true }, { key: "q", label: "queries", placeholder: "2-5, 0-3" }],
  presets: [{ label: "Two queries", values: { a: "3, 1, 4, 1, 5, 9, 2, 6", q: "2-5, 0-3" } }, { label: "Negatives", values: { a: "5, -2, 7, -4, 3, 1", q: "1-3, 3-5" } }, { label: "Whole array", values: { a: "2, 4, 6, 8", q: "0-3, 1-1" } }],
  code: `function buildPrefix(nums) {
  const pre = [0];                          //#init
  for (let i = 0; i < nums.length; i++)     //#loop
    pre.push(pre[i] + nums[i]);             //#push
  return pre;
}
// sum of nums[i..j], any range, in O(1)
const rangeSum = (pre, i, j) =>
  pre[j + 1] - pre[i];                      //#query`,
  legend: [["sky", "the range"], ["accent", "being added"], ["good", "pre[j + 1]"], ["bad", "pre[i] (subtracted)"], ["vio", "built"]],
  counters: [["prefix writes", ["WRITE"]], ["queries answered", ["FOUND_RESULT"]]],
  complexity: { time: "O(n) build, O(1) per query", space: "O(n)", why: "Building touches each number once. After that, a query is two array reads and a subtraction, no matter how long the range. Without it, each query loops over the range: O(n) each." },
  run(v) {
    const a = nums(v.a, "nums", 12), out: Step<AS>[] = [];
    const qs = String(v.q || "").split(",").map(s => s.trim()).filter(Boolean).map(s => {
      const m = s.match(/^(\d+)\s*(?:-|\.\.|to)\s*(\d+)$/); if (!m) throw new Error(`Write queries like "1-3, 0-5" (got "${s}").`);
      const i = +m[1], j = +m[2]; if (i > j || j >= a.length) throw new Error(`Query ${s} must be i-j with 0 ≤ i ≤ j ≤ ${a.length - 1}.`); return [i, j] as const;
    }).slice(0, 4);
    if (!qs.length) throw new Error('Add at least one query, like "1-3".');
    const pre: (number | null)[] = [0, ...a.map(() => null)];
    const pic = (nst: (i: number) => string | undefined, pst: (i: number) => string | undefined, o: { ranges?: AS["rows"][0]["ranges"]; top?: AS["top"]; arcs?: Arc[] } = {}): AS => ({
      top: o.top,
      rows: [
        { label: "nums", cells: cells(a, nst), ranges: o.ranges },
        { label: "pre", cells: pre.map((x, i) => ({ v: x ?? "?", st: x === null ? "ghost" : pst(i) ?? "mem" })), arcs: o.arcs },
      ],
    });
    const insp = (next: string, extra: [string, string | number][] = []): [string, string | number][] => [...extra, ["pre", "[" + pre.map(x => x ?? "?").join(", ") + "]"], ["next", next]];
    out.push({ ev: "INIT", s: pic(() => undefined, i => i === 0 ? "cur" : undefined), at: "init", what: "`pre[k]` will hold the sum of the first k numbers. **pre[0] = 0**: the sum of no numbers.", why: "With that extra 0, every range, including ones starting at index 0, becomes a simple subtraction.", next: "Fill pre left to right.", brief: "pre = [0]; pre[k] = nums[0] + … + nums[k − 1].", inspect: insp("pre[1] = pre[0] + nums[0]") });
    for (let i = 0; i < a.length; i++) {
      pre[i + 1] = pre[i]! + a[i];
      out.push({ ev: "WRITE", s: pic(k => k === i ? "cmp" : k < i ? "mem" : undefined, k => k === i + 1 ? "ok" : k === i ? "cmp" : undefined, { top: <Calc parts={[`pre[${i}] ${pre[i]}`, `nums[${i}] ${a[i]}`]} result={pre[i + 1]} />, arcs: [{ from: i, to: i + 1, tone: "good" }] }), at: "push", what: `pre[${i + 1}] = pre[${i}] + nums[${i}] = ${pre[i]} + ${a[i]} = **${pre[i + 1]}**.`, why: "Each total reuses the previous one, so building is one pass.", next: i < a.length - 1 ? `Compute pre[${i + 2}].` : "The prefix array is complete.", brief: `pre[${i + 1}] = ${pre[i + 1]}.`, inspect: insp(i < a.length - 1 ? `pre[${i + 2}]` : "answer queries", [["i", i], ["pre[i]", pre[i]!], ["nums[i]", a[i]]]) });
    }
    for (const [i, j] of qs) {
      const ans = pre[j + 1]! - pre[i]!;
      out.push({ ev: "COMPARE", s: pic(k => between(k, i, j) ? "win" : undefined, () => undefined, { ranges: [{ from: i, to: j, tone: "sky", label: `nums[${i}..${j}]` }] }), at: "query", what: `Query: the sum of nums[${i}..${j}].`, why: `A loop would add ${j - i + 1} numbers.`, next: `Use pre[${j + 1}] − pre[${i}].`, brief: `sum(${i}, ${j}) = pre[${j + 1}] − pre[${i}].`, inspect: insp("subtract", [["i", i], ["j", j]]),
        quiz: { q: `Which two prefix values give the sum of nums[${i}..${j}]?`, options: [`pre[${j + 1}] − pre[${i}]`, `pre[${j}] − pre[${i}]`, `pre[${j + 1}] − pre[${i + 1}]`], answer: 0, why: `pre[${j + 1}] covers indexes 0..${j}; pre[${i}] covers 0..${i - 1}. Their difference leaves exactly ${i}..${j}.` } });
      out.push({ ev: "FOUND_RESULT", s: pic(k => between(k, i, j) ? "win" : "dim", k => k === j + 1 ? "ok" : k === i ? "bad" : undefined, { ranges: [{ from: i, to: j, tone: "sky", label: `nums[${i}..${j}]` }], top: <Calc op="−" parts={[`pre[${j + 1}] ${pre[j + 1]}`, `pre[${i}] ${pre[i]}`]} result={ans} /> }), at: "query", tone: "find", what: `${pre[j + 1]} − ${pre[i]} = **${ans}**.`, why: `pre[${j + 1}] is everything up to index ${j}; pre[${i}] is everything before index ${i}. The overlap cancels, leaving the range.`, next: "Next query, still O(1).", brief: `= ${ans}.`, inspect: insp("next query", [["i", i], ["j", j], ["pre[j + 1]", pre[j + 1]!], ["pre[i]", pre[i]!], ["result", ans]]) });
    }
    return out;
  },
  View: ArrayView,
};

const countK: Mode<AS> = {
  id: "k", label: "Subarray sum = k", task: "Count subarrays summing to k, even with negative numbers, using prefix sums in a map.",
  fields: [{ key: "a", label: "nums", wide: true }, { key: "k", label: "k" }],
  presets: [{ label: "k = 3", values: { a: "1, 2, 1, -1, 2, 1, 3", k: "3" } }, { label: "With zeros", values: { a: "3, 0, 0, 3, -3, 3", k: "3" } }, { label: "k = 0", values: { a: "1, -1, 2, -2, 0", k: "0" } }],
  code: `function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]);          //#init
  let sum = 0, count = 0;
  for (let r = 0; r < nums.length; r++) {  //#loop
    sum += nums[r];                        //#add
    count += seen.get(sum - k) || 0;       //#look
    seen.set(sum, (seen.get(sum) || 0) + 1); //#store
  }
  return count;                            //#ret
}`,
  legend: [["sky", "current number"], ["good", "subarrays ending here that sum to k"], ["vio", "already processed"]],
  counters: [["iterations", ["ITER"]], ["map lookups", ["HASH_LOOKUP"]], ["map writes", ["HASH_INSERT"]], ["subarrays found", ["FOUND_RESULT"]]],
  complexity: { time: "O(n)", space: "O(n)", why: "One pass, with an O(1) map lookup per number. Checking all subarrays would be O(n²). A sliding window can't do this when numbers can be negative, but prefix sums can." },
  run(v) {
    const a = nums(v.a, "nums", 12), k = int(v.k, "k"), out: Step<AS>[] = [];
    const seen = new Map<number, number>([[0, 1]]), pres = [0];
    let sum = 0, count = 0;
    const pic = (r: number, hits: number[], hot?: number): AS => ({
      stats: [["running sum", sum], ["looking for", r >= 0 && r < a.length ? sum - k : "–", "accent"], ["count", count, "good"]],
      rows: [{ label: "nums", cells: cells(a, i => i === r ? "cur" : i > r ? "dim" : hits.length && between(i, Math.min(...hits), r) ? "win" : "mem", i => ({ sub: i <= r ? `Σ${pres[i + 1]}` : "" })), ranges: hits.map((s, n) => ({ from: s, to: r, tone: "good" as const, label: n === 0 ? `sums to ${k}` : undefined })) }],
      side: <Table title="prefix sum → times seen" rows={[...seen.entries()].map(([s, c]) => [s, "×" + c])} hot={hot !== undefined && seen.has(hot) ? [[...seen.keys()].indexOf(hot)] : []} w={150} />,
    });
    const insp = (r: number, next: string, extra: [string, string | number][] = []): [string, string | number][] => [["r", r < 0 ? "–" : r], ["sum", sum], ...extra, ["count", count], ["map", [...seen.entries()].map(([s, c]) => `${s}:${c}`).join(" ")], ["next", next]];
    out.push({ ev: "INIT", s: pic(-1, []), at: "init", what: "A subarray (j..r] sums to k exactly when **sum(r) − sum(j) = k**, i.e. when some earlier running sum equals `sum − k`.", why: "So we count running sums in a map. It starts with {0: 1} for the empty prefix, so subarrays starting at index 0 are counted too.", next: "Walk through the numbers.", brief: "count prefixes; answer += seen[sum − k].", inspect: insp(-1, "add nums[0]") });
    for (let r = 0; r < a.length; r++) {
      sum += a[r]; pres.push(sum);
      out.push({ ev: "ITER", s: pic(r, []), at: "add", what: `Add ${a[r]}: running sum = **${sum}**.`, why: "Σ under each box is the running sum after it.", next: `Look up ${sum} − ${k} = ${sum - k}.`, brief: `sum = ${sum}.`, inspect: insp(r, `lookup ${sum - k}`) });
      const need = sum - k, c = seen.get(need) || 0;
      const hits = pres.slice(0, r + 1).map((p, j) => (p === need ? j : -1)).filter(j => j >= 0);
      count += c;
      out.push({ ev: c ? ["HASH_LOOKUP", ...Array<"FOUND_RESULT">(c).fill("FOUND_RESULT")] : "HASH_LOOKUP", s: pic(r, hits, seen.has(need) ? need : undefined), at: "look", eval: c > 0, tone: c ? "find" : undefined, decision: { cond: "seen.has(sum - k)", values: `seen(${need}) = ${c}`, result: c > 0, action: c ? `count += ${c}` : "count unchanged" },
        what: c ? `${need} was seen **${c}×**: ${c} subarray${c > 1 ? "s" : ""} ending at index ${r} sum to ${k}.` : `${need} was never seen: no subarray ending here sums to ${k}.`, why: c ? `Each earlier point where the running sum was ${need} starts a subarray worth ${sum} − ${need} = ${k}.` : `We'd need an earlier running sum of ${need}.`, next: `Record running sum ${sum}.`, brief: `count += seen[${need}] = ${c} → ${count}.`, inspect: insp(r, `store ${sum}`, [["sum − k", need], ["found here", c]]),
        quiz: { q: `Running sum = ${sum}, k = ${k}. The map has ${[...seen.entries()].map(([s, x]) => `${s}(×${x})`).join(", ")}. How many subarrays end here?`, options: Array.from(new Set([c, c + 1, Math.max(0, c - 1), 0])).sort((x, y) => x - y).slice(0, 3).map(String), answer: Array.from(new Set([c, c + 1, Math.max(0, c - 1), 0])).sort((x, y) => x - y).slice(0, 3).indexOf(c), why: `Look up sum − k = ${need}: it appears ${c} time${c === 1 ? "" : "s"}.` } });
      seen.set(sum, (seen.get(sum) || 0) + 1);
      out.push({ ev: "HASH_INSERT", s: pic(r, [], sum), at: "store", what: `Running sum ${sum} has now been seen ×${seen.get(sum)}.`, why: "Later numbers will look this up.", next: r < a.length - 1 ? "Next number." : "Done.", brief: `seen[${sum}]++.`, inspect: insp(r, r < a.length - 1 ? "next" : "return count") });
    }
    out.push({ ev: "DONE", s: pic(a.length, []), at: "ret", tone: "ok", what: `**${count}** subarray${count === 1 ? "" : "s"} sum to ${k}.`, why: "One pass and one map.", next: "Return count.", brief: `return ${count}. O(n) time, O(n) space.`, inspect: insp(a.length, "done") });
    return out;
  },
  View: ArrayView,
};

export const prefixSumViz: PatternViz = { title: "Prefix Sum", modes: [query, countK] };
