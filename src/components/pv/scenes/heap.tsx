import type { Mode, PatternViz, Step } from "../types";
import { nums, int } from "../types";
import { Net, Row, Stat, type NNode, type NEdge } from "../prims";

interface HS { stream: number[]; at: number; out: number[]; heap: { id: number; v: number }[]; hot: number[]; bad?: number; ok?: boolean; k: number; label?: string }

const W = 380;
const slot = (i: number) => { const lv = Math.floor(Math.log2(i + 1)), pos = i - (2 ** lv - 1), cnt = 2 ** lv; return { x: ((pos + 0.5) * W) / cnt, y: 30 + lv * 68 }; };

function HeapView({ s }: { s: HS }) {
  const n = s.heap.length, levels = Math.max(1, Math.floor(Math.log2(Math.max(1, n))) + 1);
  const nodes: NNode[] = s.heap.map((h, i) => ({ id: h.id, ...slot(i), v: h.v, st: s.hot.includes(i) ? "cmp" : i === 0 && s.ok ? "ok" : "mem", sub: i === 0 ? "top" : undefined }));
  if (s.bad !== undefined) nodes.push({ id: "gone", ...slot(0), y: 30, x: W + 40, v: s.bad, st: "bad", sub: "removed" });
  const edges: NEdge[] = [];
  for (let i = 1; i < n; i++) { const a = slot((i - 1) >> 1), b = slot(i); edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, st: s.hot.includes(i) && s.hot.includes((i - 1) >> 1) ? "on" : undefined }); }
  return (
    <div className="pv-scene">
      <div className="pv-stats"><Stat label="k" value={s.k} /><Stat label="heap size" value={n} tone="sky" /><Stat label="k-th largest so far" value={n === s.k ? s.heap[0].v : n > s.k ? "pop first" : "–"} tone="good" /></div>
      <Row label="stream" size={38} gap={6} cells={s.stream.map((x, i) => ({ v: x, st: i === s.at ? "cur" : i < s.at ? (s.out.includes(i) ? "dim" : "mem") : undefined }))} ptrs={s.at >= 0 && s.at < s.stream.length ? [{ name: "x", at: s.at, tone: "sky" }] : []} idx={false} />
      <Net nodes={nodes} edges={edges} w={W + (s.bad !== undefined ? 80 : 0)} h={30 + (levels - 1) * 68 + 44} r={21} />
      <Row label="array" size={38} gap={6} cells={s.heap.map((h, i) => ({ v: h.v, id: h.id, st: s.hot.includes(i) ? "cmp" : "mem" }))} />
    </div>
  );
}

const topK: Mode<HS> = {
  id: "topk", label: "K-th largest", task: "Keep a min-heap of size k: its top is always the k-th largest seen so far.",
  fields: [{ key: "a", label: "stream", wide: true }, { key: "k", label: "k" }],
  presets: [{ label: "k = 3", values: { a: "5, 2, 9, 1, 7, 3, 8, 6", k: "3" } }, { label: "k = 4", values: { a: "10, 4, 15, 7, 20, 3, 12, 9, 18", k: "4" } }, { label: "k = 2", values: { a: "3, 1, 4, 1, 5, 9, 2", k: "2" } }],
  code: `// min-heap in an array: parent of i is (i - 1) >> 1
function push(h, x) {
  h.push(x);                                    //#append
  let i = h.length - 1;
  while (i > 0 && h[(i - 1) >> 1] > h[i]) {     //#upcheck
    const p = (i - 1) >> 1;
    [h[i], h[p]] = [h[p], h[i]]; i = p;         //#up
  }
}
function pop(h) {
  const top = h[0], last = h.pop();             //#take
  if (h.length) { h[0] = last; siftDown(h, 0); } //#down
  return top;
}
function kthLargest(nums, k) {
  const h = [];
  for (const x of nums) {                       //#loop
    push(h, x);                                 //#push
    if (h.length > k) pop(h);                   //#pop
  }
  return h[0];                                  //#ret
}`,
  legend: [["sky", "incoming number"], ["accent", "being compared / swapped"], ["vio", "stored in the heap"], ["bad", "evicted"], ["good", "answer (top)"]],
  counters: [["numbers read", ["ITER"]], ["comparisons", ["COMPARE"]], ["swaps", ["SWAP"]], ["pushes", ["PUSH"]], ["pops", ["POP"]]],
  complexity: { time: "O(n log k)", space: "O(k)", why: "The heap never holds more than k + 1 values, so its height is about log k. Each push sifts up and each pop sifts down along one path: O(log k) per number. Sorting everything would be O(n log n) and need all n values in memory." },
  run(v) {
    const a = nums(v.a, "stream", 12), k = int(v.k, "k", 1, Math.min(7, a.length)), out: Step<HS>[] = [];
    const h: { id: number; v: number }[] = [], evicted: number[] = [];
    const snap = (at: number, hot: number[], extra: Partial<HS> = {}): HS => ({ stream: a, at, out: [...evicted], heap: h.map(x => ({ ...x })), hot, k, ...extra });
    const arr = () => "[" + h.map(x => x.v).join(", ") + "]";
    const insp = (x: number | null, next: string, extra: [string, string | number][] = []): [string, string | number][] => [["x", x ?? "–"], ["heap (array)", arr()], ["size", h.length], ["k", k], ["top", h.length ? h[0].v : "–"], ...extra, ["next", next]];
    out.push({ ev: "INIT", s: snap(-1, []), at: "loop", what: `Keep only the **${k} largest** values seen so far, in a min-heap.`, why: `In a min-heap the smallest value sits on top. If the heap holds the ${k} largest, its smallest one, the top, is exactly the ${k}-th largest.`, next: "Read the first number.", brief: `min-heap of size ≤ ${k}; answer = top.`, inspect: insp(null, "push nums[0]") });
    a.forEach((x, idx) => {
      h.push({ id: idx, v: x }); let i = h.length - 1;
      out.push({ ev: ["ITER", "PUSH"], s: snap(idx, [i]), at: ["push", "append"], what: `Push **${x}**: put it in the next free spot (index ${i} of the array, the bottom of the tree).`, why: "Appending keeps the tree complete; then we fix the order by sifting up.", next: i > 0 ? `Compare with its parent ${h[(i - 1) >> 1].v}.` : "It's the only value, nothing to fix.", brief: `push ${x} at ${i}.`, inspect: insp(x, i > 0 ? "sift up" : "check size") });
      while (i > 0) {
        const p = (i - 1) >> 1, sw = h[p].v > h[i].v;
        out.push({ ev: "COMPARE", s: snap(idx, [i, p]), at: "upcheck", eval: sw, decision: { cond: "parent > child", values: `${h[p].v} > ${h[i].v}`, result: sw, action: sw ? "swap them" : "stop: heap order holds" }, what: `Compare ${h[i].v} with its parent ${h[p].v}.`, why: sw ? "A min-heap needs every parent ≤ its children. This parent is bigger." : "Parent ≤ child: the heap is in order.", next: sw ? "Swap child and parent." : "Done sifting up.", brief: sw ? `${h[p].v} > ${h[i].v} ⇒ swap.` : `${h[p].v} ≤ ${h[i].v} ⇒ stop.`, inspect: insp(x, sw ? "swap" : "check size", [["i", i], ["parent", p]]),
          quiz: { q: `Child ${h[i].v}, parent ${h[p].v}. In a min-heap, what happens?`, options: ["Swap them", "Leave them"], answer: sw ? 0 : 1, why: sw ? "The smaller value must be above." : "The parent is already smaller or equal." } });
        if (!sw) break;
        [h[i], h[p]] = [h[p], h[i]]; i = p;
        out.push({ ev: "SWAP", s: snap(idx, [i]), at: "up", what: `${x} moves up to index ${i}.`, why: "Watch the same value move in the tree and in the array.", next: i > 0 ? "Compare with the new parent." : "It reached the top.", brief: `swap → index ${i}.`, inspect: insp(x, i > 0 ? "sift up" : "check size") });
      }
      const over = h.length > k;
      out.push({ ev: "COMPARE", s: snap(idx, over ? [0] : []), at: "pop", eval: over, decision: { cond: "h.length > k", values: `${h.length} > ${k}`, result: over, action: over ? `pop the smallest (${h[0].v})` : "keep everything" }, what: over ? `The heap holds ${h.length} values, one more than k.` : `The heap holds ${h.length} of ${k}.`, why: over ? `The smallest of them (**${h[0].v}**) can't be among the ${k} largest.` : "Not full yet.", next: over ? `Pop ${h[0].v}.` : idx < a.length - 1 ? "Read the next number." : "Read the answer.", brief: over ? `size ${h.length} > ${k} ⇒ pop.` : `size ${h.length} ≤ ${k}.`, inspect: insp(x, over ? "pop" : "next"),
        quiz: over ? { q: `The heap has ${h.length} values and k = ${k}. Which one is removed?`, options: [`${h[0].v} (the top / smallest)`, `${x} (the newest)`, `${Math.max(...h.map(e => e.v))} (the largest)`], answer: 0, why: `We keep the ${k} largest, so the smallest one goes, and in a min-heap that's the top.` } : undefined });
      if (over) {
        const top = h[0];
        evicted.push(top.id);
        const last = h.pop()!;
        if (h.length) h[0] = last;
        out.push({ ev: "POP", s: snap(idx, [0], { bad: top.v }), at: "take", what: `Remove ${top.v}. Move the last value (${last.v}) to the root.`, why: "That keeps the tree complete; now sift it down to restore the order.", next: "Sift down.", brief: `pop ${top.v}.`, inspect: insp(x, "sift down", [["removed", top.v]]) });
        let j = 0;
        for (;;) {
          const l = 2 * j + 1, r = l + 1; let m = j;
          if (l < h.length && h[l].v < h[m].v) m = l;
          if (r < h.length && h[r].v < h[m].v) m = r;
          if (m === j) break;
          out.push({ ev: ["COMPARE", "SWAP"], s: snap(idx, [j, m], { bad: top.v }), at: "down", decision: { cond: "node > smaller child", values: `${h[j].v} > ${h[m].v}`, result: true, action: "swap down" }, what: `${h[j].v} is bigger than its smaller child ${h[m].v}. Swap them.`, why: "Always swap with the smaller child, so the new parent is ≤ both children.", next: "Keep sifting down.", brief: `swap ${h[j].v} ↔ ${h[m].v}.`, inspect: insp(x, "sift down", [["removed", top.v]]) });
          [h[j], h[m]] = [h[m], h[j]]; j = m;
        }
      }
      out.push({ ev: "DONE", s: snap(idx, [], { ok: h.length >= k }), at: "loop", tone: h.length >= k ? "find" : undefined, what: h.length >= k ? `After ${idx + 1} numbers, the heap holds the ${k} largest. The top **${h[0].v}** is the ${k}-th largest.` : `${h.length} of ${k} values so far.`, why: "The heap is in order again.", next: idx < a.length - 1 ? "Read the next number." : "That was the last number.", brief: h.length >= k ? `kth = ${h[0].v}.` : `size ${h.length}.`, inspect: insp(x, idx < a.length - 1 ? "next" : "return top") });
    });
    out.push({ ev: "FOUND_RESULT", s: snap(a.length, [], { ok: true }), at: "ret", tone: "ok", what: `The ${k}-th largest is **${h[0].v}**.`, why: `Memory stayed at ${k} values even though ${a.length} streamed past.`, next: "Return the top.", brief: `return ${h[0].v}. O(n log k) time, O(k) space.`, inspect: insp(null, "done") });
    return out;
  },
  View: HeapView,
};

export const heapViz: PatternViz = { title: "Heap / Top K", modes: [topK] };
