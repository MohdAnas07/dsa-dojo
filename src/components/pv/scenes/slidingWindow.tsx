import type { Mode, PatternViz, Step } from "../types";
import { nums, int } from "../types";
import { Table } from "../prims";
import { ArrayView, Calc, cells, between, type AS } from "./_kit";

const fixed: Mode<AS> = {
  id: "fixed", label: "Fixed size k", task: "Largest sum of k consecutive numbers: slide the window instead of re-adding it.",
  fields: [{ key: "a", label: "array", wide: true }, { key: "k", label: "k" }],
  presets: [{ label: "k = 3", values: { a: "2, 1, 5, 1, 3, 2, 7, 1", k: "3" } }, { label: "Negatives", values: { a: "4, -1, 6, 2, -3, 8, 1", k: "2" } }, { label: "k = 4", values: { a: "1, 9, 2, 8, 3, 7, 4, 6, 5", k: "4" } }],
  code: `function maxSumK(nums, k) {
  let sum = 0, best = -Infinity;                //#init
  for (let r = 0; r < nums.length; r++) {       //#loop
    sum += nums[r];                             //#add
    if (r >= k) sum -= nums[r - k];             //#drop
    if (r >= k - 1) best = Math.max(best, sum); //#best
  }
  return best;                                  //#ret
}`,
  legend: [["sky", "window"], ["accent", "entering"], ["bad", "leaving"], ["good", "best window"]],
  counters: [["iterations", ["ITER"]], ["expands", ["WINDOW_EXPAND"]], ["shrinks", ["WINDOW_SHRINK"]], ["best updates", ["WRITE"]]],
  complexity: { time: "O(n)", space: "O(1)", why: "Each number enters the window once (sum +=) and leaves once (sum -=). Re-adding k numbers for every window would be O(n·k)." },
  run(v) {
    const a = nums(v.a), k = int(v.k, "k", 1, a.length), out: Step<AS>[] = [];
    let sum = 0, best = -Infinity, bl = -1, pl = 0, pr = -1;
    const B = () => best === -Infinity ? "–" : best;
    const pic = (l: number, r: number, o: { enter?: number; leave?: number; moved?: boolean; top?: AS["top"] } = {}): AS => ({
      top: o.top,
      stats: [["window sum", sum], ["size", Math.max(0, r - Math.max(0, l) + 1) + " / " + k, "sky"], ["best", B(), "good"]],
      rows: [{ cells: cells(a, i => i === o.enter ? "cmp" : i === o.leave ? "bad" : between(i, l, r) ? "win" : undefined), ptrs: [...(r >= 0 ? [{ name: "L", at: Math.max(0, l), tone: "sky" as const, from: o.moved ? pl : undefined }, { name: "R", at: r, tone: "sky" as const, from: o.moved && pr >= 0 ? pr : undefined }] : [])], ranges: [...(r >= 0 ? [{ from: Math.max(0, l), to: r, tone: "sky" as const, label: "window" }] : []), ...(bl >= 0 ? [{ from: bl, to: bl + k - 1, tone: "good" as const }] : [])] }],
    });
    const insp = (l: number, r: number, next: string): [string, string | number][] => [["window start (L)", r >= 0 ? Math.max(0, l) : "–"], ["window end (R)", r >= 0 ? r : "–"], ["elements", r >= 0 ? "[" + a.slice(Math.max(0, l), r + 1).join(", ") + "]" : "[]"], ["window sum", sum], ["window size", r >= 0 ? r - Math.max(0, l) + 1 : 0], ["best", B()], ["next", next]];
    out.push({ ev: "INIT", s: pic(0, -1), at: "init", what: `Find the best sum of **${k}** neighbours.`, why: `Re-adding ${k} numbers for every window repeats work: neighbouring windows share ${k - 1} numbers.`, next: "Grow the first window one number at a time.", brief: "sum = 0, best = −∞.", inspect: insp(0, -1, "add nums[0]") });
    for (let r = 0; r < a.length; r++) {
      const l = r - k + 1;
      sum += a[r];
      out.push({ ev: ["ITER", "WINDOW_EXPAND"], s: pic(Math.max(0, r - k), r, { enter: r, moved: true }), at: "add", what: `**${a[r]}** enters on the right. sum = ${sum - a[r]} + ${a[r]} = **${sum}**.`, why: r < k ? `The first window isn't full yet (${r + 1} of ${k}).` : `For a moment the window holds ${k + 1} numbers.`, next: r >= k ? `Remove nums[${r - k}] = ${a[r - k]} from the left.` : r === k - 1 ? "The window is full: compare with best." : "Keep growing.", brief: `sum += ${a[r]} → ${sum}.`, inspect: insp(Math.max(0, r - k), r, r >= k ? `drop nums[${r - k}]` : r === k - 1 ? "compare with best" : "grow") });
      pl = Math.max(0, r - k); pr = r;
      if (r >= k) {
        sum -= a[r - k];
        out.push({ ev: "WINDOW_SHRINK", s: pic(l, r, { leave: r - k, moved: true, top: <Calc op="−" parts={[sum + a[r - k], a[r - k]]} result={sum} /> }), at: "drop", eval: true, decision: { cond: "r >= k", values: `${r} >= ${k}`, result: true, action: `sum -= nums[${r - k}]` }, what: `**${a[r - k]}** leaves on the left. sum = **${sum}**.`, why: `The window must stay exactly ${k} wide. Two operations per slide instead of re-adding ${k}.`, next: "Compare the window with the best so far.", brief: `sum -= ${a[r - k]} → ${sum}.`, inspect: insp(l, r, "compare with best") });
        pl = l;
      }
      if (r >= k - 1) {
        const prev = best, better = sum > best;
        if (better) { best = sum; bl = l; }
        out.push({ ev: better ? ["COMPARE", "WRITE"] : "COMPARE", s: pic(l, r), at: "best", eval: better, tone: better ? "find" : undefined, decision: { cond: "sum > best", values: `${sum} > ${prev === -Infinity ? "−∞" : prev}`, result: better, action: better ? `best = ${sum}` : "keep best" }, what: `Window [${l}..${r}] = [${a.slice(l, r + 1).join(", ")}] sums to **${sum}**.`, why: better ? "That beats every window so far." : `Not better than ${best}.`, next: r < a.length - 1 ? "Slide one step right." : "That was the last window.", brief: better ? `best = ${best}.` : `best stays ${best}.`, inspect: insp(l, r, r < a.length - 1 ? "slide right" : "return best"),
          quiz: r >= k ? { q: `Window sum = ${sum}, best so far = ${prev === -Infinity ? "−∞" : prev}. What happens?`, options: [`Update best to ${sum}`, `Keep best at ${prev === -Infinity ? "−∞" : prev}`, "Shrink the window"], answer: better ? 0 : 1, why: better ? `${sum} > ${prev}, so this window is the best so far.` : `${sum} ≤ ${prev}: an earlier window was at least as good.` } : undefined });
      }
    }
    out.push({ ev: "FOUND_RESULT", s: { rows: [{ cells: cells(a, i => between(i, bl, bl + k - 1) ? "ok" : "dim"), ranges: [{ from: bl, to: bl + k - 1, tone: "good", label: "best window" }] }], stats: [["best", best, "good"]] }, at: "ret", tone: "ok", what: `The best sum of ${k} in a row is **${best}**: [${a.slice(bl, bl + k).join(", ")}] at indexes ${bl}..${bl + k - 1}.`, why: "Every window was checked, each in O(1).", next: "Return best.", brief: `return ${best}. O(n) time, O(1) space.`, inspect: [["best", best], ["window", `${bl}..${bl + k - 1}`]] });
    return out;
  },
  View: ArrayView,
};

const unique: Mode<AS> = {
  id: "var", label: "Variable size", task: "Longest substring without repeating characters: grow right, jump left past a repeat.",
  fields: [{ key: "s", label: "string", wide: true }],
  presets: [{ label: "abcabcbb", values: { s: "abcabcbb" } }, { label: "pwwkew", values: { s: "pwwkew" } }, { label: "abba", values: { s: "abba" } }, { label: "dvdf", values: { s: "dvdfabdk" } }],
  code: `function longestUnique(s) {
  const last = new Map();                  //#init
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {     //#loop
    const c = s[r];
    if (last.has(c) && last.get(c) >= l)   //#check
      l = last.get(c) + 1;                 //#jump
    last.set(c, r);                        //#set
    best = Math.max(best, r - l + 1);      //#best
  }
  return best;                             //#ret
}`,
  legend: [["sky", "window (no repeats)"], ["accent", "new character"], ["bad", "the repeat"], ["vio", "stored in the map"], ["good", "longest"]],
  counters: [["iterations", ["ITER"]], ["map lookups", ["HASH_LOOKUP"]], ["map writes", ["HASH_INSERT"]], ["window jumps", ["WINDOW_SHRINK"]]],
  complexity: { time: "O(n)", space: "O(k)", why: "R visits each character once and L only moves forward (it jumps, never goes back), so the work is linear. The map holds at most one entry per distinct character (k)." },
  run(v) {
    const s = [...String(v.s ?? "").trim()];
    if (!s.length) throw new Error("Type a string.");
    if (s.length > 14) throw new Error("Use at most 14 characters so everything fits.");
    const out: Step<AS>[] = [], last = new Map<string, number>();
    let l = 0, best = 0, bl = 0, pl = 0, pr = -1;
    const disp = s.map(c => c === " " ? "␣" : c);
    const pic = (r: number, st: (i: number) => string | undefined, o: { hot?: string; moved?: boolean } = {}): AS => ({
      stats: [["length", Math.max(0, r - l + 1)], ["best", best, "good"]],
      rows: [{ cells: cells(disp, st), ptrs: r >= 0 ? [{ name: "L", at: l, tone: "sky", from: o.moved ? pl : undefined }, { name: "R", at: r, tone: "sky", from: o.moved && pr >= 0 ? pr : undefined }] : [], ranges: r >= l ? [{ from: l, to: r, tone: "sky", label: `"${s.slice(l, r + 1).join("")}"` }] : [] }],
      side: <Table title="last seen (map)" rows={[...last.entries()].map(([c, i]) => [`'${c}'`, i])} hot={o.hot !== undefined && last.has(o.hot) ? [[...last.keys()].indexOf(o.hot)] : []} w={124} />,
    });
    const insp = (r: number, next: string, extra: [string, string | number][] = []): [string, string | number][] => [["window start (L)", l], ["window end (R)", r >= 0 ? r : "–"], ["window", r >= l ? `"${s.slice(l, r + 1).join("")}"` : '""'], ["window size", Math.max(0, r - l + 1)], ["best", best], ...extra, ["next", next]];
    out.push({ ev: "INIT", s: pic(-1, () => undefined), at: "init", what: "The window `s[l..r]` never contains a repeated character.", why: "A map remembers the **last index** of each character, so a repeat can be found in O(1).", next: "Move R across the string.", brief: "last = {}, l = 0, best = 0.", inspect: insp(-1, "read s[0]") });
    for (let r = 0; r < s.length; r++) {
      const c = s[r], seen = last.has(c), j = last.get(c), inWin = seen && j! >= l;
      const base = (i: number) => i === r ? "cmp" : between(i, l, r - 1) ? "win" : i < l ? "dim" : undefined;
      out.push({ ev: ["ITER", "HASH_LOOKUP"], s: pic(r, i => inWin && i === j ? "bad" : base(i), { hot: c, moved: true }), at: "check", eval: inWin, decision: { cond: "last.has(c) && last.get(c) >= l", values: seen ? `has '${c}' → ${j} >= ${l}` : `has '${c}' → miss`, result: inWin, action: inWin ? `jump l to ${j! + 1}` : "keep l" },
        what: `R reads **'${c}'** at index ${r}. Look it up in the map: ${seen ? `**hit**, last seen at ${j}.` : "**miss**, never seen."}`,
        why: inWin ? `Index ${j} is inside the window (≥ L = ${l}), so adding '${c}' would repeat it.` : seen ? `Index ${j} is left of L (${l}): that old '${c}' is no longer in the window.` : "A new character can't cause a repeat.",
        next: inWin ? `Jump L to ${j! + 1}, just past the old '${c}'.` : `Store '${c}' → ${r} and measure the window.`,
        brief: inWin ? `'${c}' seen at ${j} ≥ l ⇒ l = ${j! + 1}.` : seen ? `'${c}' seen at ${j} < l ⇒ ignore.` : `'${c}' new.`, inspect: insp(r, inWin ? `jump L to ${j! + 1}` : "store and measure", [["c", `'${c}'`], ["lookup", seen ? `hit (${j})` : "miss"]]),
        quiz: seen ? { q: `'${c}' was last seen at index ${j}, and L = ${l}. What should L do?`, options: [`Jump L to ${j! + 1}`, "Stay where it is", `Move L one step to ${l + 1}`], answer: inWin ? 0 : 1, why: inWin ? `The old '${c}' (index ${j}) is inside the window, so L must move past it in one jump.` : `The old '${c}' is already outside the window (left of L), so it doesn't matter.` } : undefined });
      pl = l; pr = r;
      if (inWin) { l = j! + 1; out.push({ ev: "WINDOW_SHRINK", s: pic(r, base, { hot: c, moved: true }), at: "jump", what: `L jumps from ${pl} to **${l}**.`, why: `Everything up to the old '${c}' is dropped at once, no step-by-step shrinking.`, next: `Store '${c}' → ${r}.`, brief: `l = ${l}.`, inspect: insp(r, `store '${c}' → ${r}`) }); pl = l; }
      last.set(c, r);
      const len = r - l + 1, prev = best, better = len > best; if (better) { best = len; bl = l; }
      out.push({ ev: better ? ["HASH_INSERT", "WINDOW_EXPAND", "WRITE"] : ["HASH_INSERT", "WINDOW_EXPAND"], s: pic(r, i => between(i, l, r) ? "win" : i < l ? "dim" : undefined, { hot: c }), at: ["set", "best"], eval: better, tone: better ? "find" : undefined, decision: { cond: "r - l + 1 > best", values: `${len} > ${prev}`, result: better, action: better ? `best = ${len}` : "keep best" }, what: `${seen ? "Update" : "Insert"} '${c}' → ${r} in the map. Window "${s.slice(l, r + 1).join("")}" has length **${len}**.`, why: better ? "Longest window so far." : `Best is still ${best}.`, next: r < s.length - 1 ? "Move R to the next character." : "That was the last character.", brief: better ? `best = ${best}.` : `len ${len} ≤ ${best}.`, inspect: insp(r, r < s.length - 1 ? "read next character" : "return best") });
    }
    out.push({ ev: "FOUND_RESULT", s: { rows: [{ cells: cells(disp, i => between(i, bl, bl + best - 1) ? "ok" : "dim"), ranges: [{ from: bl, to: bl + best - 1, tone: "good", label: `"${s.slice(bl, bl + best).join("")}"` }] }], stats: [["best", best, "good"]] }, at: "ret", tone: "ok", what: `Longest substring without repeats: **"${s.slice(bl, bl + best).join("")}"**, length ${best}.`, why: "R and L only ever moved forward.", next: "Return best.", brief: `return ${best}. O(n) time, O(k) space.`, inspect: [["best", best], ["substring", `"${s.slice(bl, bl + best).join("")}"`]] });
    return out;
  },
  View: ArrayView,
};

export const slidingWindowViz: PatternViz = { title: "Sliding Window", modes: [fixed, unique] };
