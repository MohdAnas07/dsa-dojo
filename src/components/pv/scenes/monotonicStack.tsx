import type { Mode, PatternViz, Step } from "../types";
import { nums } from "../types";
import { Stack, type Arc } from "../prims";
import { ArrayView, type AS } from "./_kit";

function make(kind: "days" | "nge"): Mode<AS> {
  const days = kind === "days", V = days ? "temps" : "nums", unit = days ? "°" : "";
  const better = days ? "warmer" : "bigger";
  return {
    id: kind, label: days ? "Daily temperatures" : "Next greater element",
    task: days ? "For each day, how many days until a warmer one? Unanswered days wait on a stack." : "For each number, the first bigger number to its right (or -1).",
    fields: [{ key: "a", label: V, wide: true }],
    presets: days
      ? [{ label: "Classic", values: { a: "73, 74, 75, 71, 69, 72, 76, 73" } }, { label: "Cooling then hot", values: { a: "30, 29, 27, 26, 35, 25" } }, { label: "Zig-zag", values: { a: "60, 55, 62, 50, 58, 54, 65, 52" } }]
      : [{ label: "Mixed", values: { a: "4, 5, 2, 10, 8, 1, 7, 9" } }, { label: "Falling", values: { a: "9, 7, 5, 3, 8" } }, { label: "Equal values", values: { a: "3, 3, 1, 3, 4" } }],
    code: `function ${days ? "dailyTemperatures" : "nextGreater"}(${V}) {
  const ans = new Array(${V}.length).fill(${days ? 0 : -1});   //#init
  const stack = []; // indexes still waiting; values decrease
  for (let i = 0; i < ${V}.length; i++) {        //#loop
    while (stack.length && ${V}[i] > ${V}[stack.at(-1)]) { //#check
      const j = stack.pop();                     //#pop
      ans[j] = ${days ? "i - j" : `${V}[i]`};${days ? "                            " : "                         "}//#ans
    }
    stack.push(i);                               //#push
  }
  return ans;                                    //#ret
}`,
    legend: [["sky", "today (i)"], ["accent", "comparing with the stack top"], ["vio", "waiting on the stack"], ["good", "answered"]],
    counters: [["iterations", ["ITER"]], ["comparisons", ["COMPARE"]], ["pushes", ["PUSH"]], ["pops", ["POP"]]],
    complexity: { time: "O(n)", space: "O(n)", why: "Every index is pushed exactly once and popped at most once, so the inner while loop runs at most n times in total, not n times per day. The stack can hold up to n indexes (e.g. a falling sequence)." },
    run(v) {
      const a = nums(v.a, V, 10), n = a.length, out: Step<AS>[] = [];
      const lo = Math.min(...a), hi = Math.max(...a), H = (x: number) => 0.25 + 0.75 * ((x - lo) / (hi - lo || 1));
      const ans: (number | null)[] = a.map(() => null), stack: number[] = [];
      const fill = days ? 0 : -1;
      const pic = (i: number, o: { arcs?: Arc[]; hot?: number; top?: number; moved?: boolean } = {}): AS => ({
        rows: [
          { label: V, bars: true, barMax: 150, size: 46, cells: a.map((x, k) => ({ v: x + unit, h: H(x), st: k === i ? "cur" : k === o.top ? "cmp" : k === o.hot ? "ok" : stack.includes(k) ? "mem" : ans[k] !== null ? "ok" : k > i ? "dim" : undefined })), ptrs: i >= 0 && i < n ? [{ name: "i", at: i, tone: "sky", below: true, from: o.moved && i > 0 ? i - 1 : undefined }] : [], arcs: o.arcs },
          { label: "answer", size: 46, cells: ans.map((x, k) => ({ v: x === null ? (k <= i ? "…" : "") : x, st: x === null ? "ghost" : k === o.hot ? "ok" : undefined })), idx: false },
        ],
        side: <Stack title="stack (index)" items={stack.map(k => ({ id: k, v: `${k}`, sub: `${a[k]}${unit}`, st: k === o.top ? "cmp" : k === o.hot ? "ok" : "mem" }))} min={Math.min(6, n)} w={112} />,
      });
      const insp = (i: number, next: string, extra: [string, string | number][] = []): [string, string | number][] => [["i", i < 0 || i >= n ? "–" : i], [`${V}[i]`, i >= 0 && i < n ? a[i] : "–"], ["stack (bottom→top)", "[" + stack.join(", ") + "]"], ["top value", stack.length ? a[stack.at(-1)!] : "–"], ...extra, ["answer", "[" + ans.map(x => x ?? "?").join(", ") + "]"], ["next", next]];
      out.push({ ev: "INIT", s: pic(-1), at: "init", what: `Answers start unknown. The stack will hold the days still **waiting** for a ${better} value.`, why: `The waiting values always decrease from bottom to top: if a ${better} value had arrived, it would have answered them already.`, next: `Visit index 0.`, brief: `stack of unresolved indexes, values decreasing.`, inspect: insp(-1, "visit index 0") });
      for (let i = 0; i < n; i++) {
        out.push({ ev: "ITER", s: pic(i, { moved: true }), at: "loop", what: `Today: index ${i}, value **${a[i]}${unit}**.`, why: stack.length ? `Indexes ${stack.join(", ")} are still waiting.` : "Nobody is waiting yet.", next: stack.length ? `Compare ${a[i]} with the top of the stack (${a[stack.at(-1)!]}).` : "Nothing to compare: push it.", brief: `i = ${i}, value ${a[i]}.`, inspect: insp(i, stack.length ? "compare with top" : "push") });
        const arcs: Arc[] = [];
        while (stack.length) {
          const j = stack.at(-1)!, gt = a[i] > a[j];
          out.push({ ev: "COMPARE", s: pic(i, { arcs: [...arcs], top: j }), at: "check", eval: gt, decision: { cond: `${V}[i] > ${V}[top]`, values: `${a[i]} > ${a[j]}`, result: gt, action: gt ? `pop ${j} and answer it` : `stop, push ${i}` },
            what: `Compare today's ${a[i]}${unit} with the top: index ${j} (${a[j]}${unit}).`, why: gt ? `${a[i]} > ${a[j]}: index ${j} has found its ${better} value.` : `${a[i]} ≤ ${a[j]}: not ${better}. Everything below the top is even ${days ? "warmer" : "bigger"}, so stop.`,
            next: gt ? `Pop ${j}; answer[${j}] = ${days ? `${i} − ${j} = ${i - j}` : a[i]}.` : `Push ${i} onto the stack.`, brief: gt ? `${a[i]} > ${a[j]} ⇒ pop ${j}.` : `${a[i]} ≤ ${a[j]} ⇒ stop.`, inspect: insp(i, gt ? `pop ${j}` : `push ${i}`, [["comparison", `${a[i]} ${gt ? ">" : "≤"} ${a[j]}`]]),
            quiz: { q: `Today is ${a[i]}${unit}; the top of the stack is ${a[j]}${unit} (index ${j}). What happens?`, options: [`Pop ${j} and answer it`, `Push ${i} on top`, "Clear the whole stack"], answer: gt ? 0 : 1, why: gt ? `${a[i]} is ${better} than ${a[j]}, so index ${j} stops waiting.` : `${a[i]} isn't ${better} than ${a[j]}, so nothing more can be answered today; ${i} starts waiting too.` } });
          if (!gt) break;
          stack.pop(); ans[j] = days ? i - j : a[i];
          arcs.push({ from: j, to: i, tone: "good", label: days ? `+${i - j}` : `${a[i]}` });
          out.push({ ev: ["POP", "WRITE"], s: pic(i, { arcs: [...arcs], hot: j }), at: ["pop", "ans"], tone: "find", what: `Pop ${j}. answer[${j}] = **${ans[j]}**${days ? ` (${i - j} day${i - j > 1 ? "s" : ""} later)` : ""}.`, why: `Index ${j} won't need to be looked at again.`, next: stack.length ? "Compare with the new top." : `The stack is empty: push ${i}.`, brief: `ans[${j}] = ${ans[j]}.`, inspect: insp(i, stack.length ? "compare with top" : `push ${i}`) });
        }
        stack.push(i);
        out.push({ ev: "PUSH", s: pic(i, { arcs: [...arcs] }), at: "push", what: `Push index ${i} (${a[i]}${unit}).`, why: `It now waits for something ${better} than ${a[i]}${unit}.`, next: i < n - 1 ? "Next day." : "No more days.", brief: `push ${i}.`, inspect: insp(i, i < n - 1 ? "next index" : "finish") });
      }
      const left = [...stack];
      for (const k of left) ans[k] = fill;
      stack.length = 0;
      out.push({ ev: "DONE", s: pic(n), at: "ret", tone: "ok", what: left.length ? `Indexes ${left.join(", ")} never found a ${better} value, so they keep **${fill}**.` : `Every index was answered.`, why: `${n} pushes and ${n - left.length} pops in total.`, next: "Return the answers.", brief: `return [${ans.join(", ")}]. O(n) time, O(n) space.`, inspect: insp(n, "done") });
      return out;
    },
    View: ArrayView,
  };
}

export const monotonicStackViz: PatternViz = { title: "Monotonic Stack", modes: [make("days"), make("nge")] };
