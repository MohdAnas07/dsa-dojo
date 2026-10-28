import type { Mode, PatternViz, Step } from "../types";
import { nums } from "../types";
import type { Ptr, Range } from "../prims";
import { ArrayView, type AS } from "./_kit";

type It = { x: number; id: number };
const toCells = (a: It[], st: (i: number) => string | undefined, mx: number, mn: number) => a.map((c, i) => ({ v: c.x, id: c.id, h: 0.22 + 0.78 * ((c.x - mn) / (mx - mn || 1)), st: st(i) }));

const insertion: Mode<AS> = {
  id: "insert", label: "Insertion sort", task: "Grow a sorted prefix: take the next value and slide it left past every bigger value.",
  fields: [{ key: "a", label: "array", wide: true }],
  presets: [{ label: "Random", values: { a: "5, 2, 9, 1, 6, 3" } }, { label: "Nearly sorted", values: { a: "1, 2, 4, 3, 5, 6" } }, { label: "Reversed", values: { a: "6, 5, 4, 3, 2, 1" } }],
  code: `function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {      //#loop
    const key = a[i];                       //#key
    let j = i - 1;
    while (j >= 0 && a[j] > key) {          //#cmp
      a[j + 1] = a[j]; j--;                 //#shift
    }
    a[j + 1] = key;                         //#place
  }
  return a;
}`,
  legend: [["sky", "key being inserted"], ["accent", "compared with key"], ["good", "sorted prefix"]],
  counters: [["passes", ["ITER"]], ["comparisons", ["COMPARE"]], ["shifts", ["SWAP"]]],
  complexity: { time: "O(n²) worst, O(n) nearly sorted", space: "O(1)", why: "Each key may slide past everything before it (reversed input: 1 + 2 + … + (n−1) shifts). On nearly sorted data each key barely moves, so it's close to O(n): a big reason it's used for small or almost-sorted arrays." },
  run(v) {
    const raw = nums(v.a, "array", 10), a: It[] = raw.map((x, id) => ({ x, id })), mx = Math.max(...raw), mn = Math.min(...raw), out: Step<AS>[] = [];
    const pic = (sortedTo: number, key?: number, cmp?: number, j?: number): AS => {
      const ranges: Range[] = [{ from: 0, to: sortedTo, tone: "good", label: "sorted" }];
      const ptrs: Ptr[] = key !== undefined ? [{ name: "key", at: key, tone: "sky", below: true }] : [];
      if (j !== undefined && j >= 0) ptrs.push({ name: "j", at: j, tone: "accent" });
      return { rows: [{ bars: true, barMax: 150, size: 46, cells: toCells(a, i => i === key ? "cur" : i === cmp ? "cmp" : i <= sortedTo ? "ok" : undefined, mx, mn), ranges, ptrs }] };
    };
    const arr = () => "[" + a.map(c => c.x).join(", ") + "]";
    out.push({ ev: "INIT", s: pic(0), at: "loop", what: "A single value is already a sorted list.", why: "So the prefix [0..0] is sorted; we grow it one value at a time.", next: "Insert a[1].", brief: "prefix [0..0] sorted.", inspect: [["i", 1], ["a", arr()], ["next", "take key a[1]"]] });
    for (let i = 1; i < a.length; i++) {
      const key = a[i].x; let k = i;
      out.push({ ev: "ITER", s: pic(i - 1, k), at: "key", what: `key = a[${i}] = **${key}**.`, why: `Everything left of it (indexes 0..${i - 1}) is sorted.`, next: `Compare with a[${i - 1}] = ${a[i - 1].x}.`, brief: `key = ${key}.`, inspect: [["i", i], ["key", key], ["j", i - 1], ["a", arr()], ["next", "compare"]] });
      while (k > 0) {
        const bigger = a[k - 1].x > key;
        out.push({ ev: "COMPARE", s: pic(i - 1, k, k - 1, k - 1), at: "cmp", eval: bigger, decision: { cond: "a[j] > key", values: `${a[k - 1].x} > ${key}`, result: bigger, action: bigger ? `shift ${a[k - 1].x} right` : `place key at ${k}` }, what: `Compare a[${k - 1}] = ${a[k - 1].x} with key ${key}.`, why: bigger ? `${a[k - 1].x} is bigger, so it belongs after the key.` : `${a[k - 1].x} ≤ ${key}, and everything left of it is smaller still.`, next: bigger ? `Shift ${a[k - 1].x} one place right.` : `Put ${key} at index ${k}.`, brief: bigger ? `${a[k - 1].x} > ${key} ⇒ shift.` : `${a[k - 1].x} ≤ ${key} ⇒ stop.`, inspect: [["i", i], ["key", key], ["j", k - 1], ["a", arr()], ["next", bigger ? "shift" : "place"]],
          quiz: { q: `key = ${key}, a[j] = ${a[k - 1].x}. What happens?`, options: [`Shift ${a[k - 1].x} right`, `Stop: place ${key} at index ${k}`], answer: bigger ? 0 : 1, why: bigger ? "Bigger values move right to make room." : "We found the first value that isn't bigger, so the key goes right after it." } });
        if (!bigger) break;
        [a[k - 1], a[k]] = [a[k], a[k - 1]]; k--;
        out.push({ ev: "SWAP", s: pic(i, k, k + 1), at: "shift", what: `${a[k + 1].x} shifts right; the key's slot moves to index ${k}.`, why: "Same as a[j + 1] = a[j]; the key is held aside until its spot is found.", next: k > 0 ? "Compare with the next value to the left." : "Reached the front.", brief: `shift; j = ${k - 1}.`, inspect: [["i", i], ["key", key], ["j", k - 1], ["a", arr()], ["next", k > 0 ? "compare" : "place"]] });
      }
      out.push({ ev: "WRITE", s: pic(i), at: "place", what: `Place ${key} at index ${k}. The prefix [0..${i}] is sorted.`, why: k === i ? "It was already in the right place: no shifts." : `It slid past ${i - k} bigger value${i - k > 1 ? "s" : ""}.`, next: i < a.length - 1 ? `Insert a[${i + 1}].` : "Done.", brief: `a[${k}] = ${key}.`, inspect: [["i", i], ["a", arr()], ["next", i < a.length - 1 ? "next key" : "return"]] });
    }
    out.push({ ev: "DONE", s: { rows: [{ bars: true, barMax: 150, size: 46, cells: toCells(a, () => "ok", mx, mn) }] }, at: "loop", tone: "ok", what: `Sorted: **${arr()}**.`, why: "Each pass made the sorted prefix one longer.", next: "Return a.", brief: "sorted. O(n²) worst case.", inspect: [["a", arr()], ["next", "done"]] });
    return out;
  },
  View: ArrayView,
};

const quick: Mode<AS> = {
  id: "quick", label: "Quick sort", task: "Pick a pivot, partition smaller values to its left, then sort each side the same way.",
  fields: [{ key: "a", label: "array", wide: true }],
  presets: [{ label: "Random", values: { a: "7, 2, 9, 4, 1, 8, 3, 6" } }, { label: "Duplicates", values: { a: "5, 3, 5, 1, 5, 2" } }, { label: "Sorted (worst)", values: { a: "1, 2, 3, 4, 5, 6" } }],
  code: `function quickSort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return;                          //#base
  const pivot = a[hi]; let p = lo;               //#pivot
  for (let j = lo; j < hi; j++)                  //#scan
    if (a[j] < pivot) {                          //#cmp
      [a[j], a[p]] = [a[p], a[j]]; p++;          //#swap
    }
  [a[p], a[hi]] = [a[hi], a[p]];                 //#place
  quickSort(a, lo, p - 1);                       //#left
  quickSort(a, p + 1, hi);                       //#right
}`,
  legend: [["vio", "pivot"], ["accent", "a[j] being compared"], ["sky", "range [lo..hi]"], ["good", "pivot in its final place"]],
  counters: [["partitions", ["ITER"]], ["comparisons", ["COMPARE"]], ["swaps", ["SWAP"]]],
  complexity: { time: "O(n log n) average, O(n²) worst", space: "O(log n) average", why: "A good pivot splits the range roughly in half, so there are about log n levels of partitioning, each O(n). A pivot that's always the max or min (like the last element of a sorted array) gives n levels: O(n²). Random pivots make that very unlikely." },
  run(v) {
    const raw = nums(v.a, "array", 10), a: It[] = raw.map((x, id) => ({ x, id })), mx = Math.max(...raw), mn = Math.min(...raw), out: Step<AS>[] = [];
    const done = new Set<number>();
    const pic = (lo: number, hi: number, o: { piv?: number; j?: number; p?: number; cmp?: number } = {}): AS => {
      const ptrs: Ptr[] = []; if (o.p !== undefined) ptrs.push({ name: "p", at: o.p, tone: "vio", below: true }); if (o.j !== undefined) ptrs.push({ name: "j", at: o.j, tone: "accent" });
      const ranges: Range[] = lo <= hi ? [{ from: lo, to: hi, tone: "sky", label: `[${lo}..${hi}]` }] : [];
      if (o.p !== undefined && o.p > lo) ranges.push({ from: lo, to: o.p - 1, tone: "good" });
      return { rows: [{ bars: true, barMax: 150, size: 44, cells: toCells(a, i => done.has(a[i].id) ? "ok" : i === o.piv ? "mem" : i === o.cmp ? "cmp" : i < lo || i > hi ? "dim" : undefined, mx, mn), ptrs, ranges }] };
    };
    const arr = () => "[" + a.map(c => c.x).join(", ") + "]";
    const qs = (lo: number, hi: number, depth: number) => {
      if (lo >= hi) { if (lo === hi) done.add(a[lo].id); if (lo <= hi) out.push({ ev: "COMPARE", s: pic(lo, hi), at: "base", eval: true, decision: { cond: "lo >= hi", values: `${lo} >= ${hi}`, result: true, action: "return (nothing to sort)" }, what: lo === hi ? `Range [${lo}..${hi}] has one value: already sorted.` : "Empty range.", why: "That's the base case of the recursion.", next: "Return.", brief: "base case.", inspect: [["lo", lo], ["hi", hi], ["depth", depth], ["a", arr()], ["next", "return"]] }); return; }
      const pivot = a[hi].x; let p = lo;
      out.push({ ev: "ITER", s: pic(lo, hi, { piv: hi, p }), at: "pivot", what: `Sort [${lo}..${hi}]. Pivot = last value, **${pivot}**.`, why: `Goal: everything < ${pivot} ends up left of it, everything else right of it.`, next: "Scan with j; p marks where the next small value goes.", brief: `pivot ${pivot}, p = ${lo}.`, inspect: [["lo", lo], ["hi", hi], ["pivot", pivot], ["p", p], ["depth", depth], ["a", arr()], ["next", "scan"]] });
      for (let j = lo; j < hi; j++) {
        const small = a[j].x < pivot;
        out.push({ ev: "COMPARE", s: pic(lo, hi, { piv: hi, j, p, cmp: j }), at: "cmp", eval: small, decision: { cond: "a[j] < pivot", values: `${a[j].x} < ${pivot}`, result: small, action: small ? (j === p ? "it's already in place; p++" : `swap a[${j}] ↔ a[${p}], p++`) : "leave it on the right side" }, what: `a[${j}] = ${a[j].x} vs pivot ${pivot}.`, why: small ? "It belongs in the left part." : "It belongs in the right part; leave it.", next: small ? `Move it to index ${p}.` : "Next j.", brief: small ? `${a[j].x} < ${pivot} ⇒ to p=${p}.` : `${a[j].x} ≥ ${pivot}.`, inspect: [["lo", lo], ["hi", hi], ["pivot", pivot], ["j", j], ["p", p], ["a", arr()], ["next", small ? "swap" : "next j"]],
          quiz: depth === 0 && j < lo + 3 ? { q: `pivot = ${pivot}, a[j] = ${a[j].x}. Where does it go?`, options: ["Left part (swap to p)", "Right part (leave it)"], answer: small ? 0 : 1, why: small ? `${a[j].x} < ${pivot}.` : `${a[j].x} ≥ ${pivot}.` } : undefined });
        if (small) { [a[j], a[p]] = [a[p], a[j]]; p++; out.push({ ev: "SWAP", s: pic(lo, hi, { piv: hi, j, p }), at: "swap", what: `Swapped into index ${p - 1}; p → ${p}.`, why: `[${lo}..${p - 1}] now holds only values < ${pivot}.`, next: "Next j.", brief: `p = ${p}.`, inspect: [["lo", lo], ["hi", hi], ["pivot", pivot], ["j", j], ["p", p], ["a", arr()], ["next", "next j"]] }); }
      }
      [a[p], a[hi]] = [a[hi], a[p]]; done.add(a[p].id);
      out.push({ ev: "SWAP", s: pic(lo, hi, { p }), at: "place", tone: "find", what: `Put the pivot at index **${p}**: it's in its final sorted place.`, why: `Everything left is < ${pivot}, everything right is ≥ ${pivot}.`, next: `Sort the left part [${lo}..${p - 1}], then the right part [${p + 1}..${hi}].`, brief: `pivot → ${p}.`, inspect: [["lo", lo], ["hi", hi], ["pivot", pivot], ["p", p], ["a", arr()], ["next", "recurse left"]] });
      qs(lo, p - 1, depth + 1); qs(p + 1, hi, depth + 1);
    };
    out.push({ ev: "INIT", s: pic(0, a.length - 1), at: "base", what: "Sort the whole array [0.." + (a.length - 1) + "].", why: "Quick sort does its work before recursing: partitioning puts one value (the pivot) exactly where it belongs.", next: "Partition.", brief: "quickSort(0, n − 1).", inspect: [["a", arr()], ["next", "partition"]] });
    qs(0, a.length - 1, 0);
    out.push({ ev: "DONE", s: { rows: [{ bars: true, barMax: 150, size: 44, cells: toCells(a, () => "ok", mx, mn) }] }, at: "right", tone: "ok", what: `Sorted: **${arr()}**.`, why: "Every value was placed by being a pivot or by being alone in its range.", next: "Done.", brief: "sorted in place.", inspect: [["a", arr()], ["next", "done"]] });
    return out;
  },
  View: ArrayView,
};

export const sortingViz: PatternViz = { title: "Sorting", modes: [insertion, quick] };
