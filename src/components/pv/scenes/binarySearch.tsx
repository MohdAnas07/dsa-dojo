import type { Mode, PatternViz, Step } from "../types";
import { nums, int } from "../types";
import type { Ptr } from "../prims";
import { ArrayView, cells, between, type AS } from "./_kit";

const find: Mode<AS> = {
  id: "find", label: "Find target", task: "Halve the search space every step by checking the middle.",
  fields: [{ key: "a", label: "sorted", wide: true }, { key: "t", label: "target" }],
  presets: [{ label: "Found", values: { a: "2, 5, 8, 12, 16, 23, 38, 56, 72, 91", t: "23" } }, { label: "Missing", values: { a: "2, 5, 8, 12, 16, 23, 38, 56, 72, 91", t: "40" } }, { label: "First item", values: { a: "1, 3, 5, 7, 9, 11, 13", t: "1" } }],
  code: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;          //#init
  while (lo <= hi) {                         //#loop
    const mid = Math.floor((lo + hi) / 2);   //#mid
    if (nums[mid] === target) return mid;    //#found
    if (nums[mid] < target) lo = mid + 1;    //#right
    else hi = mid - 1;                       //#left
  }
  return -1;                                 //#none
}`,
  legend: [["sky", "search space"], ["accent", "middle (being compared)"], ["mute", "eliminated"], ["good", "found"]],
  counters: [["iterations", ["ITER"]], ["comparisons", ["COMPARE"]], ["boundary moves", ["POINTER_MOVE"]]],
  complexity: { time: "O(log n)", space: "O(1)", why: "Each comparison throws away half of what's left: n → n/2 → n/4 … → 1 takes about log₂ n steps. 1,000,000 items need only ~20 checks." },
  run(v) {
    const a = nums(v.a, "sorted").sort((x, y) => x - y), t = int(v.t, "target"), out: Step<AS>[] = [];
    let lo = 0, hi = a.length - 1, plo = 0, phi = hi, it = 0;
    const pic = (m: number, o: { found?: boolean; moved?: boolean } = {}): AS => {
      const ptrs: Ptr[] = [{ name: "lo", at: lo, tone: "sky", from: o.moved ? plo : undefined }, { name: "hi", at: hi, tone: "sky", from: o.moved ? phi : undefined }];
      if (m >= 0) ptrs.push({ name: "mid", at: m, tone: "accent", below: true });
      return { stats: [["target", t], ["left to search", Math.max(0, hi - lo + 1), "sky"]], rows: [{ cells: cells(a, i => o.found && i === m ? "ok" : i === m ? "cmp" : between(i, lo, hi) ? undefined : "dim"), ptrs, ranges: [{ from: lo, to: hi, tone: o.found ? "good" : "sky", label: `search space (${Math.max(0, hi - lo + 1)})` }] }] };
    };
    const insp = (m: number | null, next: string, extra: [string, string | number][] = []): [string, string | number][] => [["lo", lo], ["hi", hi], ["mid", m ?? "–"], ["nums[mid]", m !== null && m >= 0 ? a[m] : "–"], ["target", t], ...extra, ["next", next]];
    out.push({ ev: "INIT", s: pic(-1), at: "init", what: `The target, if present, is somewhere in **[${lo}..${hi}]**: ${a.length} candidates.`, why: "The array is sorted, so one comparison with the middle tells us which half can't contain the target.", next: "Pick the middle.", brief: `lo = 0, hi = ${hi}.`, inspect: insp(null, "compute mid") });
    while (lo <= hi) {
      const m = Math.floor((lo + hi) / 2); it++;
      out.push({ ev: "ITER", s: pic(m), at: "mid", what: `mid = ⌊(${lo} + ${hi}) / 2⌋ = **${m}**, holding ${a[m]}.`, why: "Checking the middle splits the remaining range into two equal halves.", next: `Compare ${a[m]} with ${t}.`, brief: `mid = ${m} (${a[m]}).`, inspect: insp(m, "compare") });
      if (a[m] === t) { out.push({ ev: ["COMPARE", "FOUND_RESULT"], s: pic(m, { found: true }), at: "found", eval: true, tone: "ok", decision: { cond: "nums[mid] === target", values: `${a[m]} === ${t}`, result: true, action: `return ${m}` }, what: `**${a[m]} = ${t}**. Found at index ${m}.`, why: `${it} check${it > 1 ? "s" : ""}; a left-to-right scan would need ${m + 1}.`, next: "Done.", brief: `return ${m} after ${it} iterations. O(log n).`, inspect: insp(m, `return ${m}`) }); return out; }
      const goRight = a[m] < t;
      out.push({ ev: "COMPARE", s: pic(m), at: goRight ? "right" : ["found", "right"], eval: goRight, decision: { cond: "nums[mid] < target", values: `${a[m]} < ${t}`, result: goRight, action: goRight ? `lo = ${m + 1} (drop the left half)` : `hi = ${m - 1} (drop the right half)` },
        what: `${a[m]} ${goRight ? "<" : ">"} ${t}.`, why: goRight ? `Everything at or left of mid is ≤ ${a[m]}, so it's too small: the target can only be to the right.` : `Everything at or right of mid is ≥ ${a[m]}, so it's too big: the target can only be to the left.`, next: goRight ? `Discard [${lo}..${m}] by setting lo = ${m + 1}.` : `Discard [${m}..${hi}] by setting hi = ${m - 1}.`, brief: goRight ? `${a[m]} < ${t} ⇒ lo = ${m + 1}.` : `${a[m]} > ${t} ⇒ hi = ${m - 1}.`, inspect: insp(m, goRight ? "move lo" : "move hi"),
        quiz: { q: `nums[mid] = ${a[m]}, target = ${t}. Which half do we keep?`, options: [`Right half: lo = ${m + 1}`, `Left half: hi = ${m - 1}`, `Return ${m}`], answer: goRight ? 0 : 1, why: goRight ? `${a[m]} is smaller than ${t}, so the target must be to the right.` : `${a[m]} is bigger than ${t}, so the target must be to the left.` } });
      plo = lo; phi = hi;
      const gone = goRight ? m - lo + 1 : hi - m + 1;
      if (goRight) lo = m + 1; else hi = m - 1;
      out.push({ ev: "POINTER_MOVE", s: pic(-1, { moved: true }), at: goRight ? "right" : "left", what: goRight ? `lo: ${plo} → **${lo}**. ${gone} value${gone > 1 ? "s" : ""} eliminated.` : `hi: ${phi} → **${hi}**. ${gone} value${gone > 1 ? "s" : ""} eliminated.`, why: `${Math.max(0, hi - lo + 1)} candidate${hi - lo + 1 === 1 ? "" : "s"} left.`, next: lo <= hi ? "Check the loop condition and pick a new middle." : "lo has passed hi: nothing left.", brief: goRight ? `lo = ${lo}.` : `hi = ${hi}.`, inspect: insp(null, lo <= hi ? "compute mid" : "exit loop") });
    }
    out.push({ ev: "NOT_FOUND", s: pic(-1), at: "none", tone: "bad", eval: false, decision: { cond: "lo <= hi", values: `${lo} <= ${hi}`, result: false, action: "return -1" }, what: `lo (${lo}) passed hi (${hi}): the range is empty, so **${t} isn't in the array**.`, why: `Only ${it} checks for ${a.length} values (log₂ ${a.length} ≈ ${Math.ceil(Math.log2(a.length + 1))}).`, next: "Return -1.", brief: "return -1. O(log n) time, O(1) space.", inspect: insp(null, "return -1") });
    return out;
  },
  View: ArrayView,
};

const lower: Mode<AS> = {
  id: "lower", label: "First position", task: "Lower bound: the first index whose value is ≥ target (handles duplicates and insert positions).",
  fields: [{ key: "a", label: "sorted", wide: true }, { key: "t", label: "target" }],
  presets: [{ label: "Duplicates", values: { a: "1, 3, 5, 5, 5, 5, 8, 9, 12", t: "5" } }, { label: "Insert position", values: { a: "1, 3, 5, 6, 9, 11", t: "7" } }, { label: "Past the end", values: { a: "2, 4, 6, 8", t: "10" } }],
  code: `function lowerBound(nums, target) {
  let lo = 0, hi = nums.length;              //#init
  while (lo < hi) {                          //#loop
    const mid = (lo + hi) >> 1;              //#mid
    if (nums[mid] < target) lo = mid + 1;    //#right
    else hi = mid;                           //#left
  }
  return lo;                                 //#ret
}`,
  legend: [["sky", "answer is in [lo..hi]"], ["accent", "middle"], ["good", "first value ≥ target"]],
  counters: [["iterations", ["ITER"]], ["comparisons", ["COMPARE"]], ["boundary moves", ["POINTER_MOVE"]]],
  complexity: { time: "O(log n)", space: "O(1)", why: "Same halving as plain binary search. It never stops early on a match: it keeps narrowing until lo = hi, which is exactly the first position." },
  run(v) {
    const a = nums(v.a, "sorted").sort((x, y) => x - y), t = int(v.t, "target"), out: Step<AS>[] = [];
    const ext: (number | string)[] = [...a, "end"];
    let lo = 0, hi = a.length, plo = 0, phi = hi;
    const pic = (m: number, o: { done?: boolean; moved?: boolean } = {}): AS => {
      const ptrs: Ptr[] = [{ name: "lo", at: lo, tone: "sky", from: o.moved ? plo : undefined }, { name: "hi", at: hi, tone: "sky", from: o.moved ? phi : undefined }];
      if (m >= 0) ptrs.push({ name: "mid", at: m, tone: "accent", below: true });
      return { stats: [["target", t], ["lo", lo, "sky"], ["hi", hi, "sky"]], rows: [{ cells: cells(ext, i => o.done && i === lo ? "ok" : i === a.length ? (between(i, lo, hi) ? "ghost" : "ghost dim") : i === m ? "cmp" : between(i, lo, hi) ? undefined : "dim"), ptrs, ranges: [{ from: lo, to: hi, tone: o.done ? "good" : "sky", label: o.done ? "answer" : "answer in [lo..hi]" }] }] };
    };
    const insp = (m: number | null, next: string): [string, string | number][] => [["lo", lo], ["hi", hi], ["mid", m ?? "–"], ["nums[mid]", m !== null ? a[m] : "–"], ["target", t], ["next", next]];
    out.push({ ev: "INIT", s: pic(-1), at: "init", what: `hi starts at **${a.length}**, one past the end.`, why: `If every value is smaller than ${t}, the answer is "the end", so that position must be possible too.`, next: "Pick the middle.", brief: `lo = 0, hi = ${a.length} (exclusive).`, inspect: insp(null, "compute mid") });
    while (lo < hi) {
      const m = (lo + hi) >> 1, small = a[m] < t;
      out.push({ ev: ["ITER", "COMPARE"], s: pic(m), at: "right", eval: small, decision: { cond: "nums[mid] < target", values: `${a[m]} < ${t}`, result: small, action: small ? `lo = ${m + 1}` : `hi = ${m} (keep mid)` }, what: `mid = ${m}, nums[mid] = ${a[m]}.`, why: small ? `${a[m]} < ${t}: mid and everything before it are too small.` : `${a[m]} ≥ ${t}: mid **could** be the first such value, so it must stay in range. That's why it's hi = mid, not mid − 1.`, next: small ? `lo = ${m + 1}.` : `hi = ${m}.`, brief: small ? `${a[m]} < ${t} ⇒ lo = ${m + 1}.` : `${a[m]} ≥ ${t} ⇒ hi = ${m}.`, inspect: insp(m, small ? "move lo" : "move hi"),
        quiz: { q: `nums[mid] = ${a[m]}, target = ${t}. What happens to the range?`, options: [`lo = ${m + 1}`, `hi = ${m}`, `hi = ${m - 1}`], answer: small ? 0 : 1, why: small ? `${a[m]} is too small, so the first ≥ ${t} is after mid.` : `${a[m]} ≥ ${t} might be the answer itself, so keep it: hi = mid (hi = mid − 1 could skip the answer).` } });
      plo = lo; phi = hi;
      if (small) lo = m + 1; else hi = m;
      out.push({ ev: "POINTER_MOVE", s: pic(-1, { moved: true }), at: small ? "right" : "left", what: small ? `lo → **${lo}**.` : `hi → **${hi}**.`, why: `The answer is in [${lo}..${hi}].`, next: lo < hi ? "Pick a new middle." : "lo = hi: the range has one position left.", brief: `[${lo}..${hi}].`, inspect: insp(null, lo < hi ? "compute mid" : "return lo") });
    }
    out.push({ ev: "FOUND_RESULT", s: pic(-1, { done: true }), at: "ret", tone: "ok", what: lo < a.length ? `lo = hi = **${lo}**: nums[${lo}] = ${a[lo]} is the first value ≥ ${t}.${a[lo] === t ? ` That's the first ${t}.` : ` ${t} isn't present; it would be inserted here.`}` : `lo = hi = **${lo}**: every value is smaller than ${t}, so the answer is the end.`, why: "The range shrank to exactly one position.", next: `Return ${lo}.`, brief: `return ${lo}. O(log n).`, inspect: insp(null, `return ${lo}`) });
    return out;
  },
  View: ArrayView,
};

const koko: Mode<AS> = {
  id: "answer", label: "Search on the answer", task: "Koko eating bananas: binary search the speed, not the array.",
  fields: [{ key: "p", label: "piles", wide: true }, { key: "h", label: "hours" }],
  presets: [{ label: "h = 8", values: { p: "3, 6, 7, 11", h: "8" } }, { label: "h = 5", values: { p: "8, 4, 9, 2", h: "5" } }, { label: "h = 6", values: { p: "12, 3, 10, 5", h: "6" } }],
  code: `function minEatingSpeed(piles, h) {
  let lo = 1, hi = Math.max(...piles);                         //#init
  while (lo < hi) {                                            //#loop
    const k = (lo + hi) >> 1;                                  //#mid
    const hours = piles.reduce((t, p) => t + Math.ceil(p / k), 0); //#hours
    if (hours <= h) hi = k;                                    //#ok
    else lo = k + 1;                                           //#slow
  }
  return lo;                                                   //#ret
}`,
  legend: [["sky", "speeds still possible"], ["accent", "speed being tested"], ["good", "fast enough"], ["bad", "too slow"]],
  counters: [["speeds tested", ["ITER"]], ["comparisons", ["COMPARE"]]],
  complexity: { time: "O(n log m)", space: "O(1)", why: "m = biggest pile. Binary search tries about log₂ m speeds, and each try sums over n piles. Trying every speed would be O(n·m)." },
  run(v) {
    const p = nums(v.p, "piles", 8), h = int(v.h, "hours", 1, 100);
    if (p.some(x => x <= 0 || !Number.isInteger(x))) throw new Error("Piles must be positive whole numbers.");
    const mx = Math.max(...p); if (mx > 16) throw new Error("Keep piles at 16 or less so every speed fits on screen.");
    if (h < p.length) throw new Error(`With ${p.length} piles you need at least ${p.length} hours.`);
    const speeds = Array.from({ length: mx }, (_, i) => i + 1), verdict: Record<number, "ok" | "bad"> = {}, hrs: Record<number, number> = {};
    const out: Step<AS>[] = [];
    let lo = 1, hi = mx, plo = 1, phi = mx;
    const pic = (k: number, o: { done?: boolean; moved?: boolean } = {}): AS => ({
      stats: [["hours allowed", h], ["speed k", k > 0 ? k : "–", "accent"], ["hours needed", k > 0 ? hrs[k] : "–", k > 0 ? (hrs[k] <= h ? "good" : "bad") : "accent"]],
      rows: [
        { label: "piles", cells: cells(p), idx: false, size: 44 },
        { label: "speed", size: 40, gap: 6, idx: false, cells: speeds.map(s => ({ v: s, st: o.done && s === lo ? "ok" : s === k ? "cmp" : verdict[s] === "ok" ? "ok" : verdict[s] === "bad" ? "bad" : s < lo || s > hi ? "dim" : undefined, sub: hrs[s] !== undefined ? hrs[s] + "h" : "" })), ptrs: [{ name: "lo", at: lo - 1, tone: "sky", from: o.moved ? plo - 1 : undefined }, { name: "hi", at: hi - 1, tone: "sky", from: o.moved ? phi - 1 : undefined }], ranges: [{ from: lo - 1, to: hi - 1, tone: o.done ? "good" : "sky", label: o.done ? "slowest that works" : "answer is in here" }] },
      ],
    });
    const insp = (k: number | null, next: string): [string, string | number][] => [["lo", lo], ["hi", hi], ["k", k ?? "–"], ["hours(k)", k ? hrs[k] : "–"], ["h", h], ["next", next]];
    out.push({ ev: "INIT", s: pic(-1), at: "init", what: `Every speed from **1** to the biggest pile (**${mx}**) is a candidate.`, why: "Faster always means fewer hours. So the speeds line up as \"too slow … too slow, fast enough … fast enough\": a sorted yes/no line we can binary search.", next: "Test the middle speed.", brief: `answer space [1..${mx}], monotone predicate hours(k) ≤ h.`, inspect: insp(null, "test middle speed") });
    while (lo < hi) {
      const k = (lo + hi) >> 1;
      hrs[k] = p.reduce((t, x) => t + Math.ceil(x / k), 0);
      const ok = hrs[k] <= h;
      out.push({ ev: ["ITER", "COMPARE"], s: pic(k), at: ["hours", "ok"], eval: ok, decision: { cond: "hours <= h", values: `${hrs[k]} <= ${h}`, result: ok, action: ok ? `hi = ${k} (try slower)` : `lo = ${k + 1} (go faster)` }, what: `At k = ${k}: ${p.map(x => `⌈${x}/${k}⌉`).join(" + ")} = **${hrs[k]} hours**.`, why: ok ? `${hrs[k]} ≤ ${h}: speed ${k} works, so every faster speed works too.` : `${hrs[k]} > ${h}: too slow, and every slower speed is too.`, next: ok ? `Look for something slower: hi = ${k}.` : `Go faster: lo = ${k + 1}.`, brief: ok ? `hours(${k}) = ${hrs[k]} ≤ ${h} ⇒ hi = ${k}.` : `hours(${k}) = ${hrs[k]} > ${h} ⇒ lo = ${k + 1}.`, inspect: insp(k, ok ? "move hi" : "move lo"),
        quiz: { q: `At speed ${k} Koko needs ${hrs[k]} hours; she has ${h}. What next?`, options: [`hi = ${k}: try slower speeds`, `lo = ${k + 1}: try faster speeds`], answer: ok ? 0 : 1, why: ok ? "She finishes in time, so the minimum is k or slower." : "She doesn't finish, so she must eat faster." } });
      plo = lo; phi = hi;
      if (ok) { for (let s = k; s <= mx; s++) verdict[s] = verdict[s] || "ok"; hi = k; } else { for (let s = 1; s <= k; s++) verdict[s] = verdict[s] || "bad"; lo = k + 1; }
      out.push({ ev: "POINTER_MOVE", s: pic(-1, { moved: true }), at: ok ? "ok" : "slow", what: ok ? `hi → **${hi}**.` : `lo → **${lo}**.`, why: `Speeds ${lo}..${hi} are still possible.`, next: lo < hi ? "Test the new middle." : "Only one speed is left.", brief: `[${lo}..${hi}].`, inspect: insp(null, lo < hi ? "test middle" : "return lo") });
    }
    hrs[lo] = hrs[lo] ?? p.reduce((t, x) => t + Math.ceil(x / lo), 0);
    out.push({ ev: "FOUND_RESULT", s: pic(-1, { done: true }), at: "ret", tone: "ok", what: `The minimum speed is **${lo}** bananas per hour (${hrs[lo]} hours).`, why: `Tested ${Object.keys(hrs).length} speeds instead of all ${mx}.`, next: `Return ${lo}.`, brief: `return ${lo}. O(n log m).`, inspect: insp(lo, `return ${lo}`) });
    return out;
  },
  View: ArrayView,
};

export const binarySearchViz: PatternViz = { title: "Binary Search", modes: [find, lower, koko] };
