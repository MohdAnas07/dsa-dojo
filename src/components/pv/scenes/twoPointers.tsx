import type { Mode, PatternViz, Step } from "../types";
import { nums, int } from "../types";
import type { Ptr } from "../prims";
import { ArrayView, Calc, cells, type AS } from "./_kit";

const MOVE_OPTS = ["Move **L** right (l++)", "Move **R** left (r--)", "Return `[l, r]`"];

const pairSum: Mode<AS> = {
  id: "pair", label: "Pair sum", task: "Find two numbers in a sorted array that add up to a target.",
  fields: [{ key: "a", label: "sorted", wide: true }, { key: "t", label: "target" }],
  presets: [{ label: "Found", values: { a: "1, 3, 4, 6, 8, 11", t: "10" } }, { label: "Not found", values: { a: "2, 4, 5, 9, 12", t: "8" } }, { label: "Negatives", values: { a: "-6, -2, 0, 3, 7, 10", t: "1" } }, { label: "Duplicates", values: { a: "1, 2, 2, 3, 5, 5, 9", t: "10" } }],
  code: `function pairSum(nums, target) {
  let l = 0, r = nums.length - 1;          //#init
  while (l < r) {                          //#loop
    const sum = nums[l] + nums[r];         //#sum
    if (sum === target) return [l, r];     //#found
    if (sum < target) l++;                 //#left
    else r--;                              //#right
  }
  return [-1, -1];                         //#none
}`,
  legend: [["sky", "pointers L and R"], ["accent", "being compared"], ["mute", "ruled out (crossed through)"], ["good", "the pair"]],
  counters: [["iterations", ["ITER"]], ["comparisons", ["COMPARE"]], ["pointer moves", ["POINTER_MOVE"]]],
  complexity: { time: "O(n)", space: "O(1)", why: "Every iteration either finishes or moves one pointer inward, ruling out one value for good. L and R can only meet once, so there are at most n − 1 iterations. Only two indexes are stored, no extra arrays." },
  run(v) {
    const raw = nums(v.a, "sorted"), t = int(v.t, "target");
    if (raw.length < 2) throw new Error("Enter at least two numbers so there is a pair to find.");
    const a = [...raw].sort((x, y) => x - y);
    const sortedNote = raw.some((x, i) => x !== a[i]) ? " (I sorted your input first: this pattern needs a sorted array.)" : "";
    const out: Step<AS>[] = [];
    let l = 0, r = a.length - 1, pl = 0, pr = r;
    const ptrs = (moved: boolean): Ptr[] => [{ name: "L", at: l, tone: "sky", from: moved ? pl : undefined }, { name: "R", at: r, tone: "sky", from: moved ? pr : undefined }];
    const pic = (o: { cmp?: boolean; found?: boolean; moved?: boolean; calc?: boolean } = {}): AS => ({
      top: o.calc || o.found ? <Calc parts={[a[l], a[r]]} result={a[l] + a[r]} vs={t} vsLabel={`target ${t}`} /> : <div className="pv-calc"><span className="op">target</span><span className="res">{t}</span></div>,
      rows: [{ cells: cells(a, i => o.found && (i === l || i === r) ? "ok" : i < l || i > r ? "dim" : o.cmp && (i === l || i === r) ? "cmp" : undefined), ptrs: ptrs(!!o.moved), ranges: [{ from: l, to: r, tone: o.found ? "good" : "mute", label: o.found ? "pair found" : `still possible (${r - l + 1})` }] }],
    });
    const insp = (sum: number | null, cmp: string, next: string): [string, string | number][] => [["L", `index ${l} · value ${a[l]}`], ["R", `index ${r} · value ${a[r]}`], ["sum", sum ?? "–"], ["target", t], ["comparison", cmp], ["next", next]];
    out.push({ ev: "INIT", s: pic(), at: "init", what: `Place **L** on the smallest value (${a[0]}) and **R** on the largest (${a[r]}).${sortedNote}`, why: "Because the array is sorted, moving L right can only increase the sum and moving R left can only decrease it. That gives us a way to steer.", next: "Add the two values and compare with the target.", brief: `l = 0, r = ${r}; sorted ⇒ l++ raises sum, r-- lowers it.`, inspect: insp(null, "–", "compute sum") });
    let it = 0;
    while (l < r) {
      it++;
      const sum = a[l] + a[r];
      out.push({ ev: ["ITER", "COMPARE"], s: pic({ cmp: true, calc: true }), at: "sum", what: `Iteration ${it}: compare indexes **${l}** and **${r}**. ${a[l]} + ${a[r]} = **${sum}**.`, why: `\`l < r\` (${l} < ${r}), so there is still at least one pair to check.`, next: `Check whether ${sum} equals the target ${t}.`, brief: `sum = nums[${l}] + nums[${r}] = ${sum}.`, inspect: insp(sum, `${sum} vs ${t}`, "check sum === target") });
      if (sum === t) {
        out.push({ ev: "COMPARE", s: pic({ cmp: true, calc: true }), at: "found", eval: true, decision: { cond: "sum === target", values: `${sum} === ${t}`, result: true, action: `return [${l}, ${r}]` }, what: `${sum} equals the target.`, why: "These two values add up exactly to what we want.", next: `Return the indexes **[${l}, ${r}]**.`, brief: `${sum} === ${t} → return [${l}, ${r}].`, inspect: insp(sum, `${sum} = ${t}`, `return [${l}, ${r}]`),
          quiz: { q: `sum = ${sum}, target = ${t}. What happens next?`, options: MOVE_OPTS, answer: 2, why: `The sum matches the target exactly, so we return [${l}, ${r}] right away.` } });
        pl = l; pr = r;
        out.push({ ev: "FOUND_RESULT", s: pic({ found: true }), at: "found", tone: "ok", what: `Found it: **${a[l]} + ${a[r]} = ${t}** at indexes **[${l}, ${r}]**.`, why: `It took ${it} comparison${it > 1 ? "s" : ""}. Checking every pair would take up to ${a.length * (a.length - 1) / 2}.`, next: "Done.", brief: `Return [${l}, ${r}] after ${it} iteration${it > 1 ? "s" : ""}: O(n) time, O(1) space.`, inspect: insp(sum, `${sum} = ${t}`, "done") });
        return out;
      }
      out.push({ ev: "COMPARE", s: pic({ cmp: true, calc: true }), at: "found", eval: false, decision: { cond: "sum === target", values: `${sum} === ${t}`, result: false, action: "not a match yet" }, what: `${sum} is not ${t}.`, why: `The pair (${a[l]}, ${a[r]}) is not the answer.`, next: `Decide which pointer to move: is ${sum} too small or too big?`, brief: `${sum} ≠ ${t}.`, inspect: insp(sum, `${sum} ≠ ${t}`, "check sum < target") });
      const small = sum < t;
      out.push({ ev: "COMPARE", s: pic({ cmp: true, calc: true }), at: "left", eval: small, decision: { cond: "sum < target", values: `${sum} < ${t}`, result: small, action: small ? "l++ (move L right)" : "else: r-- (move R left)" },
        what: small ? `${sum} is **smaller** than ${t}.` : `${sum} is **bigger** than ${t}.`,
        why: small ? `We need a bigger sum. Even paired with the largest value left (${a[r]}), **${a[l]}** is too small, so ${a[l]} can never be in the answer.` : `We need a smaller sum. Even paired with the smallest value left (${a[l]}), **${a[r]}** is too big, so ${a[r]} can never be in the answer.`,
        next: small ? `Move **L** right to index ${l + 1} (value ${a[l + 1]}).` : `Move **R** left to index ${r - 1} (value ${a[r - 1]}).`,
        brief: small ? `${sum} < ${t} ⇒ nums[${l}] too small for any partner ⇒ l++.` : `${sum} > ${t} ⇒ nums[${r}] too big for any partner ⇒ r--.`,
        inspect: insp(sum, small ? `${sum} < ${t}` : `${sum} > ${t}`, small ? "move L right" : "move R left"),
        quiz: { q: `sum = ${sum}, target = ${t}. What should happen next?`, options: MOVE_OPTS, answer: small ? 0 : 1, why: small ? `${sum} < ${t}: the sum must grow. Only moving L right (to a bigger value) can do that.` : `${sum} > ${t}: the sum must shrink. Only moving R left (to a smaller value) can do that.` } });
      pl = l; pr = r;
      if (small) l++; else r--;
      out.push({ ev: "POINTER_MOVE", s: pic({ moved: true }), at: small ? "left" : "right", what: small ? `L moves from index ${pl} to **${l}**. ${a[pl]} is crossed out.` : `R moves from index ${pr} to **${r}**. ${a[pr]} is crossed out.`, why: `One value is ruled out for good. ${r - l + 1} candidate${r - l + 1 === 1 ? "" : "s"} left.`, next: l < r ? "Loop again: compute the new sum." : "L and R have met, so the loop ends.", brief: small ? `l: ${pl} → ${l}.` : `r: ${pr} → ${r}.`, inspect: insp(null, "–", l < r ? "compute sum" : "loop ends") });
    }
    out.push({ ev: "NOT_FOUND", s: pic(), at: "none", tone: "bad", eval: false, decision: { cond: "l < r", values: `${l} < ${r}`, result: false, action: "exit loop, return [-1, -1]" }, what: `L and R met at index ${l}: no pair adds up to ${t}.`, why: `Every value was ruled out one at a time, in ${it} iteration${it === 1 ? "" : "s"}.`, next: "Return **[-1, -1]**.", brief: `l === r ⇒ no pair; return [-1, -1]. O(n) time, O(1) space.`, inspect: insp(null, "–", "return [-1, -1]") });
    return out;
  },
  View: ArrayView,
};

const water: Mode<AS> = {
  id: "water", label: "Container with most water", task: "Pick two lines that hold the most water. Always move the shorter line.",
  fields: [{ key: "a", label: "heights", wide: true }],
  presets: [{ label: "Classic", values: { a: "1, 8, 6, 2, 5, 4, 8, 3, 7" } }, { label: "Valley", values: { a: "6, 2, 3, 1, 4, 7" } }, { label: "Peaks", values: { a: "2, 9, 1, 1, 9, 2" } }],
  code: `function maxArea(height) {
  let l = 0, r = height.length - 1, best = 0;          //#init
  while (l < r) {                                      //#loop
    const area = Math.min(height[l], height[r]) * (r - l); //#area
    if (area > best) best = area;                      //#best
    if (height[l] < height[r]) l++;                    //#left
    else r--;                                          //#right
  }
  return best;                                         //#ret
}`,
  legend: [["sky", "water between L and R"], ["accent", "the two lines"], ["good", "best container"], ["mute", "ruled out"]],
  counters: [["iterations", ["ITER"]], ["areas computed", ["COMPARE"]], ["pointer moves", ["POINTER_MOVE"]], ["best updates", ["WRITE"]]],
  complexity: { time: "O(n)", space: "O(1)", why: "Each iteration discards the shorter line: with it, any narrower container is at most as tall and narrower, so it can never beat the area we just measured. One line goes per iteration, so n − 1 iterations." },
  run(v) {
    const a = nums(v.a, "heights", 12);
    if (a.length < 2) throw new Error("Enter at least two heights.");
    if (a.some(x => x < 0)) throw new Error("Heights can't be negative.");
    const mx = Math.max(...a, 1), out: Step<AS>[] = [];
    let l = 0, r = a.length - 1, best = 0, bl = -1, br = -1, pl = 0, pr = r, it = 0;
    const pic = (o: { water?: boolean; moved?: boolean; final?: boolean } = {}): AS => {
      const h = Math.min(a[l], a[r]);
      return {
        stats: [["width", r - l], ["height", Math.min(a[l], a[r])], ["area", h * (r - l)], ["best", best, "good"]],
        rows: [{ bars: true, barMax: 170, size: 40, cells: a.map((x, i) => ({ v: x, h: x / mx, st: o.final ? (i === bl || i === br ? "ok" : "dim") : i === l || i === r ? "cmp" : i < l || i > r ? "dim" : undefined })), ptrs: o.final ? [] : [{ name: "L", at: l, tone: "sky", below: true, from: o.moved ? pl : undefined }, { name: "R", at: r, tone: "sky", below: true, from: o.moved ? pr : undefined }],
          ranges: o.final ? (bl >= 0 ? [{ from: bl, to: br, tone: "good", h: Math.min(a[bl], a[br]) / mx }] : []) : o.water ? [{ from: l, to: r, tone: "sky", h: h / mx }] : [] }],
      };
    };
    const insp = (next: string): [string, string | number][] => [["L", `index ${l} · height ${a[l]}`], ["R", `index ${r} · height ${a[r]}`], ["width", r - l], ["area", Math.min(a[l], a[r]) * (r - l)], ["best", best], ["next", next]];
    out.push({ ev: "INIT", s: pic({}), at: "init", what: "Start with the **widest** container: L on the first line, R on the last.", why: "Width is as large as it will ever be. From here we only get narrower, so we need taller lines to do better.", next: "Measure the water between L and R.", brief: "l = 0, r = n − 1, best = 0.", inspect: insp("measure area") });
    while (l < r) {
      it++;
      const h = Math.min(a[l], a[r]), area = h * (r - l);
      out.push({ ev: ["ITER", "COMPARE"], s: { ...pic({ water: true }), top: <Calc op="×" parts={[`min(${a[l]}, ${a[r]})`, r - l]} result={area} /> }, at: "area", what: `Water rises only to the **shorter** line: min(${a[l]}, ${a[r]}) = ${h}. Area = ${h} × ${r - l} = **${area}**.`, why: "Any water above the shorter line would spill over it.", next: `Compare ${area} with the best so far (${best}).`, brief: `area = min(${a[l]}, ${a[r]}) × ${r - l} = ${area}.`, inspect: insp("compare with best") });
      const better = area > best;
      if (better) { best = area; bl = l; br = r; }
      out.push({ ev: better ? ["COMPARE", "WRITE"] : "COMPARE", s: { ...pic({ water: true }), top: <Calc op="×" parts={[h, r - l]} result={area} /> }, at: "best", eval: better, tone: better ? "find" : undefined, decision: { cond: "area > best", values: `${area} > ${better ? "previous best" : best}`, result: better, action: better ? `best = ${area}` : "keep best" }, what: better ? `${area} is a new best.` : `${area} doesn't beat ${best}.`, why: better ? "Remember this container." : "Nothing to update.", next: `Decide which line to drop: compare ${a[l]} and ${a[r]}.`, brief: better ? `best = ${best}.` : `best stays ${best}.`, inspect: insp("pick the shorter line") });
      const moveL = a[l] < a[r];
      out.push({ ev: "COMPARE", s: pic({ water: true }), at: "left", eval: moveL, decision: { cond: "height[l] < height[r]", values: `${a[l]} < ${a[r]}`, result: moveL, action: moveL ? "l++ (drop the left line)" : "else: r-- (drop the right line)" },
        what: `The ${moveL ? "left" : "right"} line (${moveL ? a[l] : a[r]}) is ${a[l] === a[r] ? "not taller (they are equal)" : "shorter"}.`,
        why: `Keeping the shorter line, every narrower container is capped at height ${h} and narrower, so its area is ≤ ${area}. That line can't be part of a better answer.`,
        next: moveL ? `Move **L** right to index ${l + 1}.` : `Move **R** left to index ${r - 1}.`,
        brief: `${a[l]} ${moveL ? "<" : "≥"} ${a[r]} ⇒ ${moveL ? "l++" : "r--"}: the shorter line can't do better.`, inspect: insp(moveL ? "move L right" : "move R left"),
        quiz: { q: `Heights are ${a[l]} (L) and ${a[r]} (R). Which pointer should move?`, options: ["Move **L** right", "Move **R** left", "Move both inward"], answer: moveL ? 0 : 1, why: `Move the shorter line${a[l] === a[r] ? " (with equal heights either is fine; this code moves R)" : ""}. Moving the taller one can never help: the water would still be capped by the short line, and the width shrinks.` } });
      pl = l; pr = r;
      if (moveL) l++; else r--;
      out.push({ ev: "POINTER_MOVE", s: pic({ moved: true }), at: moveL ? "left" : "right", what: moveL ? `L: ${pl} → **${l}**.` : `R: ${pr} → **${r}**.`, why: "One line is ruled out for good.", next: l < r ? "Measure the new container." : "L and R met: the loop ends.", brief: moveL ? `l = ${l}.` : `r = ${r}.`, inspect: insp(l < r ? "measure area" : "return best") });
    }
    out.push({ ev: "FOUND_RESULT", s: pic({ final: true }), at: "ret", tone: "ok", what: bl >= 0 ? `The most water is **${best}**, between lines ${bl} (height ${a[bl]}) and ${br} (height ${a[br]}).` : "No container holds any water: every pair has a line of height 0, so the best is **0**.", why: `${it} iteration${it === 1 ? "" : "s"}, each ruling out one line.`, next: "Return best.", brief: `return ${best}. O(n) time, O(1) space.`, inspect: [["best", best], ["lines", bl >= 0 ? `${bl} and ${br}` : "none"]] });
    return out;
  },
  View: ArrayView,
};

const reverse: Mode<AS> = {
  id: "rev", label: "Reverse in place", task: "Reverse an array without extra memory by swapping the two ends.",
  fields: [{ key: "a", label: "array", wide: true }],
  presets: [{ label: "Odd length", values: { a: "1, 2, 3, 4, 5, 6, 7" } }, { label: "Even length", values: { a: "9, 4, 7, 2, 8, 5" } }],
  code: `function reverse(arr) {
  let l = 0, r = arr.length - 1;           //#init
  while (l < r) {                          //#loop
    [arr[l], arr[r]] = [arr[r], arr[l]];   //#swap
    l++; r--;                              //#move
  }
  return arr;                              //#ret
}`,
  legend: [["accent", "being swapped"], ["good", "in its final place"]],
  counters: [["iterations", ["ITER"]], ["swaps", ["SWAP"]], ["pointer moves", ["POINTER_MOVE"]]],
  complexity: { time: "O(n)", space: "O(1)", why: "n / 2 swaps, each putting two values in their final place. The swap happens inside the same array, so no copy is needed." },
  run(v) {
    const a = nums(v.a).map((x, i) => ({ x, id: i })), out: Step<AS>[] = [];
    let l = 0, r = a.length - 1, pl = 0, pr = r, it = 0;
    const pic = (o: { cmp?: boolean; moved?: boolean } = {}): AS => ({ rows: [{ cells: a.map((c, i) => ({ v: c.x, id: c.id, st: o.cmp && (i === l || i === r) ? "cmp" : i < l || i > r ? "ok" : undefined })), ptrs: [{ name: "L", at: l, tone: "sky", from: o.moved ? pl : undefined }, { name: "R", at: r, tone: "sky", from: o.moved ? pr : undefined }] }] });
    const insp = (next: string): [string, string | number][] => [["L", `index ${l}`], ["R", `index ${r}`], ["arr", "[" + a.map(c => c.x).join(", ") + "]"], ["next", next]];
    out.push({ ev: "INIT", s: pic(), at: "init", what: "L starts at the front, R at the back.", why: "The value at L belongs where R is, and vice versa.", next: "Check that L is still left of R.", brief: "l = 0, r = n − 1.", inspect: insp("check l < r") });
    while (l < r) {
      it++;
      out.push({ ev: ["ITER", "COMPARE"], s: pic({ cmp: true }), at: "loop", eval: true, decision: { cond: "l < r", values: `${l} < ${r}`, result: true, action: "swap the two ends" }, what: `Indexes ${l} and ${r} still need swapping.`, why: "Everything outside them is already in place.", next: `Swap ${a[l].x} and ${a[r].x}.`, brief: `${l} < ${r} ⇒ swap.`, inspect: insp(`swap ${a[l].x} ↔ ${a[r].x}`) });
      [a[l], a[r]] = [a[r], a[l]];
      out.push({ ev: "SWAP", s: pic({ cmp: true }), at: "swap", what: `Swapped: ${a[l].x} is now at index ${l}, ${a[r].x} at index ${r}.`, why: "Both values are now in their final place.", next: "Move both pointers inward.", brief: `swap(${l}, ${r}).`, inspect: insp("move both pointers") });
      pl = l; pr = r; l++; r--;
      out.push({ ev: ["POINTER_MOVE", "POINTER_MOVE"], s: pic({ moved: true }), at: "move", what: `L → ${l}, R → ${r}.`, why: "The two ends are done.", next: l < r ? "Check the loop condition again." : "The pointers met or crossed, so the loop will stop.", brief: `l = ${l}, r = ${r}.`, inspect: insp("check l < r") });
    }
    out.push({ ev: "FOUND_RESULT", s: { rows: [{ cells: a.map(c => ({ v: c.x, id: c.id, st: "ok" })) }] }, at: "ret", tone: "ok", eval: false, decision: { cond: "l < r", values: `${l} < ${r}`, result: false, action: "exit loop" }, what: `Reversed with **${it}** swap${it === 1 ? "" : "s"}.`, why: a.length % 2 ? "The middle value stays where it is." : "Every value was swapped once.", next: "Return the same array, now reversed.", brief: `${it} swaps; O(n) time, O(1) space.`, inspect: insp("done") });
    return out;
  },
  View: ArrayView,
};

export const twoPointersViz: PatternViz = { title: "Two Pointers", modes: [pairSum, water, reverse] };
