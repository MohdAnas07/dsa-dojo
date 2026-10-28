import type { Mode, PatternViz, Step } from "../types";
import { nums, int } from "../types";
import { Net, Stat, Table, type NNode, type NEdge } from "../prims";

/* The full decision tree is recorded first, then laid out (leaves left to right, parents centred over
   children). Each step only reveals the nodes created so far, so the tree grows as the recursion runs. */
interface TNode { id: number; parent: number; depth: number; label: string; edge: string; kind: "node" | "leaf" | "pruned" | "hit" }
interface BS { nodes: { id: number; x: number; y: number; label: string; st?: string }[]; edges: { a: number; b: number; label: string; st?: string }[]; w: number; h: number; path: number[]; results: string[]; hotResult?: number; stats: [string, string | number, ("good" | "sky" | "vio" | "accent" | "bad")?][]; title: string }

function layoutTree(tree: TNode[], gapX: number, gapY: number) {
  const kids = new Map<number, number[]>(); tree.forEach(t => { if (t.parent >= 0) (kids.get(t.parent) || kids.set(t.parent, []).get(t.parent)!).push(t.id); });
  const x = new Map<number, number>(); let leaf = 0;
  const place = (id: number): number => { const ch = kids.get(id) || []; if (!ch.length) { x.set(id, leaf++ * gapX); return x.get(id)!; } const xs = ch.map(place); x.set(id, (xs[0] + xs[xs.length - 1]) / 2); return x.get(id)!; };
  place(0);
  const maxD = Math.max(...tree.map(t => t.depth));
  return { x, w: Math.max(1, leaf - 1) * gapX + 60, h: maxD * gapY + 60, ox: 30, oy: 28, gapY };
}

function View({ s }: { s: BS }) {
  const nodes: NNode[] = s.nodes.map(n => ({ id: n.id, x: n.x, y: n.y, v: n.label, st: n.st, r: 19 }));
  const edges: NEdge[] = s.edges.map(e => ({ a: e.a, b: e.b, label: e.label, st: e.st, dir: false }));
  return (
    <div className="pv-scene">
      <div className="pv-stats">{s.stats.map(([l, v, t]) => <Stat key={l} label={l} value={v} tone={t} />)}</div>
      <div className="pv-side-by-side">
        <Net nodes={nodes} edges={edges} w={s.w} h={s.h} r={19} />
        <Table title={s.title} rows={s.results.map((r, i) => [`#${i + 1}`, r])} hot={s.hotResult !== undefined ? [s.hotResult] : []} w={130} empty="none yet" />
      </div>
    </div>
  );
}

function player(tree: TNode[], gapX: number, gapY: number) {
  const L = layoutTree(tree, gapX, gapY);
  return (visible: number, cur: number, results: string[], o: { hot?: number; stats: BS["stats"]; title: string }): BS => {
    const vis = tree.slice(0, visible);
    const path: number[] = []; for (let k = cur; k >= 0; k = tree[k].parent) path.push(k);
    const on = new Set(path);
    return {
      nodes: vis.map(t => ({ id: t.id, x: L.ox + L.x.get(t.id)!, y: L.oy + t.depth * L.gapY, label: t.label, st: t.id === cur ? (t.kind === "pruned" ? "bad" : t.kind === "hit" ? "ok" : "cur") : t.kind === "pruned" ? "bad" : t.kind === "hit" ? "ok" : on.has(t.id) ? "mem" : "dim" })),
      edges: vis.filter(t => t.parent >= 0).map(t => ({ a: t.parent, b: t.id, label: t.edge, st: on.has(t.id) ? "cur" : t.kind === "pruned" ? "bad" : "dim" })),
      w: L.w, h: L.h, path, results: [...results], hotResult: o.hot, stats: o.stats, title: o.title,
    };
  };
}

const subsets: Mode<BS> = {
  id: "subsets", label: "All subsets", task: "At each number, branch twice: take it or skip it. Every leaf is one subset.",
  fields: [{ key: "a", label: "nums" }],
  presets: [{ label: "[1, 2, 3]", values: { a: "1, 2, 3" } }, { label: "[a, b]", values: { a: "4, 7" } }, { label: "4 items", values: { a: "1, 2, 3, 4" } }],
  code: `function subsets(nums) {
  const res = [], cur = [];
  function bt(i) {
    if (i === nums.length) {                 //#base
      res.push([...cur]); return;            //#record
    }
    cur.push(nums[i]); bt(i + 1);            //#take
    cur.pop();                               //#undo
    bt(i + 1);                               //#skip
  }
  bt(0);                                     //#start
  return res;
}`,
  legend: [["sky", "current call"], ["vio", "current path (choices so far)"], ["good", "complete subset"], ["mute", "already explored"]],
  counters: [["calls", ["PUSH"]], ["undo (backtrack)", ["POP"]], ["subsets", ["FOUND_RESULT"]]],
  complexity: { time: "O(n · 2ⁿ)", space: "O(n)", why: "Each of the n numbers is taken or skipped: 2ⁿ leaves, and copying each subset costs up to n. The recursion only ever holds one path (depth n) at a time." },
  run(v) {
    const a = nums(v.a, "nums", 4), out: Step<BS>[] = [];
    const tree: TNode[] = [{ id: 0, parent: -1, depth: 0, label: "∅", edge: "", kind: "node" }];
    const events: { kind: "enter" | "leaf" | "undo"; id: number; cur: number[]; i: number }[] = [];
    const cur: number[] = [];
    const bt = (i: number, id: number) => {
      if (i === a.length) { tree[id].kind = "hit"; events.push({ kind: "leaf", id, cur: [...cur], i }); return; }
      const t = tree.push({ id: tree.length, parent: id, depth: i + 1, label: [...cur, a[i]].join(a.some(x => x > 9) ? "," : "") || "∅", edge: `+${a[i]}`, kind: "node" }) - 1;
      cur.push(a[i]); events.push({ kind: "enter", id: t, cur: [...cur], i }); bt(i + 1, t);
      cur.pop(); events.push({ kind: "undo", id, cur: [...cur], i });
      const k = tree.push({ id: tree.length, parent: id, depth: i + 1, label: cur.join(a.some(x => x > 9) ? "," : "") || "∅", edge: `−${a[i]}`, kind: "node" }) - 1;
      events.push({ kind: "enter", id: k, cur: [...cur], i }); bt(i + 1, k);
    };
    bt(0, 0);
    const draw = player(tree, a.length >= 4 ? 44 : 62, 70), results: string[] = [];
    let visible = 1;
    const fmt = (c: number[]) => "[" + c.join(", ") + "]";
    const stats = (c: number[]): BS["stats"] => [["current", fmt(c), "vio"], ["subsets", results.length, "good"]];
    out.push({ ev: "INIT", s: draw(1, 0, results, { stats: stats([]), title: "subsets" }), at: "start", what: "Start with an empty choice list at the root.", why: `Each level of the tree decides one number: ${a.join(", ")}. Take it (left edge, +) or skip it (right edge, −).`, next: `Decide about ${a[0]}.`, brief: "bt(0), cur = [].", inspect: [["i", 0], ["cur", "[]"], ["results", 0], ["next", `take ${a[0]}`]] });
    for (const e of events) {
      if (e.kind === "enter") {
        visible = Math.max(visible, e.id + 1);
        const t = tree[e.id], took = t.edge.startsWith("+");
        out.push({ ev: took ? ["PUSH", "WRITE"] : "PUSH", s: draw(visible, e.id, results, { stats: stats(e.cur), title: "subsets" }), at: took ? "take" : "skip", what: took ? `**Take** ${a[e.i]}: cur = ${fmt(e.cur)}.` : `**Skip** ${a[e.i]}: cur stays ${fmt(e.cur)}.`, why: took ? "Explore everything that includes it first." : "Now explore everything without it.", next: e.i + 1 === a.length ? "All numbers decided: record the subset." : `Decide about ${a[e.i + 1]}.`, brief: took ? `take ${a[e.i]} → ${fmt(e.cur)}.` : `skip ${a[e.i]} → ${fmt(e.cur)}.`, inspect: [["i", e.i + 1], ["cur", fmt(e.cur)], ["results", results.length], ["next", e.i + 1 === a.length ? "record" : `take ${a[e.i + 1]}`]] });
      } else if (e.kind === "leaf") {
        results.push(fmt(e.cur));
        out.push({ ev: ["COMPARE", "FOUND_RESULT"], s: draw(visible, e.id, results, { stats: stats(e.cur), title: "subsets", hot: results.length - 1 }), at: ["base", "record"], eval: true, tone: "find", decision: { cond: "i === nums.length", values: `${e.i} === ${a.length}`, result: true, action: `record ${fmt(e.cur)}` }, what: `Every number decided: record **${fmt(e.cur)}**.`, why: "A leaf is one complete subset. We copy cur, since we'll keep changing it.", next: "Return and undo the last choice.", brief: `record ${fmt(e.cur)}.`, inspect: [["i", e.i], ["cur", fmt(e.cur)], ["results", results.length], ["next", "return"]] });
      } else {
        out.push({ ev: "POP", s: draw(visible, e.id, results, { stats: stats(e.cur), title: "subsets" }), at: "undo", what: `Back at this node: **undo** taking ${a[e.i]}. cur = ${fmt(e.cur)}.`, why: "That's the backtrack step: restore the state so the other branch starts clean.", next: `Now try skipping ${a[e.i]}.`, brief: `pop ${a[e.i]}.`, inspect: [["i", e.i], ["cur", fmt(e.cur)], ["results", results.length], ["next", `skip ${a[e.i]}`]],
          quiz: e.i === 0 || results.length === 1 ? { q: `We just finished every subset that includes ${a[e.i]}. What must happen before exploring the "skip" branch?`, options: [`Remove ${a[e.i]} from cur (undo)`, "Clear all results", "Nothing"], answer: 0, why: "cur is shared by every call. Without undoing, the skip branch would still contain the number." } : undefined });
      }
    }
    out.push({ ev: "DONE", s: draw(visible, 0, results, { stats: stats([]), title: "subsets" }), at: "start", tone: "ok", what: `All **${results.length}** subsets found (2^${a.length}).`, why: "Each path from the root to a leaf is one set of take/skip choices.", next: "Return res.", brief: `${results.length} subsets. O(n·2ⁿ).`, inspect: [["results", results.length], ["next", "done"]] });
    return out;
  },
  View,
};

const combo: Mode<BS> = {
  id: "combo", label: "Combination sum (pruning)", task: "Numbers can repeat. Sorting lets us stop a branch the moment the sum would pass the target.",
  fields: [{ key: "a", label: "candidates" }, { key: "t", label: "target" }],
  presets: [{ label: "[2,3,6,7] → 7", values: { a: "2, 3, 6, 7", t: "7" } }, { label: "[2,3,5] → 8", values: { a: "2, 3, 5", t: "8" } }, { label: "[3,4] → 6", values: { a: "3, 4", t: "6" } }],
  code: `function combinationSum(cands, target) {
  cands.sort((a, b) => a - b);
  const res = [], cur = [];
  function bt(start, remain) {
    if (remain === 0) { res.push([...cur]); return; } //#hit
    for (let i = start; i < cands.length; i++) {
      if (cands[i] > remain) break;          //#prune
      cur.push(cands[i]);                    //#choose
      bt(i, remain - cands[i]);              //#recurse
      cur.pop();                             //#undo
    }
  }
  bt(0, target);                             //#start
  return res;
}`,
  legend: [["sky", "current call (remaining)"], ["vio", "current path"], ["good", "remaining = 0: a combination"], ["bad", "pruned: too big"]],
  counters: [["calls", ["PUSH"]], ["pruned branches", ["NOT_FOUND"]], ["combinations", ["FOUND_RESULT"]]],
  complexity: { time: "exponential", space: "O(target / min)", why: "The number of combinations can grow exponentially, so no algorithm is polynomial in general. Pruning (sorted + break) cuts every branch whose next number already overshoots, which removes most of the tree in practice. Recursion depth is at most target ÷ smallest candidate." },
  run(v) {
    const a = [...new Set(nums(v.a, "candidates", 4))].sort((x, y) => x - y), T = int(v.t, "target", 1, 12), out: Step<BS>[] = [];
    if (a.some(x => x <= 0)) throw new Error("Candidates must be positive.");
    const tree: TNode[] = [{ id: 0, parent: -1, depth: 0, label: String(T), edge: "", kind: "node" }];
    type E = { kind: "enter" | "hit" | "prune" | "undo"; id: number; cur: number[]; val?: number; remain: number };
    const events: E[] = [], cur: number[] = [];
    const bt = (start: number, remain: number, id: number) => {
      if (remain === 0) { tree[id].kind = "hit"; events.push({ kind: "hit", id, cur: [...cur], remain }); return; }
      for (let i = start; i < a.length; i++) {
        if (a[i] > remain) { const p = tree.push({ id: tree.length, parent: id, depth: tree[id].depth + 1, label: "✗", edge: `+${a[i]}`, kind: "pruned" }) - 1; events.push({ kind: "prune", id: p, cur: [...cur], val: a[i], remain }); break; }
        cur.push(a[i]);
        const c = tree.push({ id: tree.length, parent: id, depth: tree[id].depth + 1, label: String(remain - a[i]), edge: `+${a[i]}`, kind: "node" }) - 1;
        events.push({ kind: "enter", id: c, cur: [...cur], val: a[i], remain: remain - a[i] });
        bt(i, remain - a[i], c);
        cur.pop(); events.push({ kind: "undo", id, cur: [...cur], val: a[i], remain });
        if (tree.length > 40) throw new Error("That input makes a very large tree. Try a smaller target or fewer candidates.");
      }
    };
    bt(0, T, 0);
    const draw = player(tree, 52, 66), results: string[] = [];
    let visible = 1;
    const fmt = (c: number[]) => "[" + c.join(", ") + "]";
    const stats = (c: number[], r: number): BS["stats"] => [["path", fmt(c), "vio"], ["remaining", r, "sky"], ["found", results.length, "good"]];
    out.push({ ev: "INIT", s: draw(1, 0, results, { stats: stats([], T), title: "combinations" }), at: "start", what: `Each node shows how much is **still needed**. Start at ${T}.`, why: "Children only use candidates at or after the current one, so [2, 3] and [3, 2] aren't both generated.", next: `Try adding ${a[0]}.`, brief: `bt(0, ${T}).`, inspect: [["remain", T], ["cur", "[]"], ["next", `try ${a[0]}`]] });
    for (const e of events) {
      if (e.kind === "enter") { visible = Math.max(visible, e.id + 1); out.push({ ev: "PUSH", s: draw(visible, e.id, results, { stats: stats(e.cur, e.remain), title: "combinations" }), at: ["choose", "recurse"], what: `Add **${e.val}**: path ${fmt(e.cur)}, still need ${e.remain}.`, why: "Go deeper with the same or larger candidates.", next: e.remain === 0 ? "That's exactly the target." : "Keep adding.", brief: `+${e.val} → need ${e.remain}.`, inspect: [["remain", e.remain], ["cur", fmt(e.cur)], ["next", e.remain === 0 ? "record" : "try candidates"]] }); }
      else if (e.kind === "hit") { results.push(fmt(e.cur)); out.push({ ev: "FOUND_RESULT", s: draw(visible, e.id, results, { stats: stats(e.cur, 0), title: "combinations", hot: results.length - 1 }), at: "hit", eval: true, tone: "find", decision: { cond: "remain === 0", values: "0 === 0", result: true, action: `record ${fmt(e.cur)}` }, what: `Remaining is 0: **${fmt(e.cur)}** sums to ${T}.`, why: "Record a copy, then backtrack to look for more.", next: "Return and undo.", brief: `found ${fmt(e.cur)}.`, inspect: [["remain", 0], ["cur", fmt(e.cur)], ["next", "return"]] }); }
      else if (e.kind === "prune") { visible = Math.max(visible, e.id + 1); out.push({ ev: ["COMPARE", "NOT_FOUND"], s: draw(visible, e.id, results, { stats: stats(e.cur, e.remain), title: "combinations" }), at: "prune", eval: true, tone: "bad", decision: { cond: "cands[i] > remain", values: `${e.val} > ${e.remain}`, result: true, action: "break: prune this and every larger candidate" }, what: `${e.val} is more than the ${e.remain} still needed.`, why: "The candidates are sorted, so every later one is even bigger. Stop the loop here instead of trying them.", next: "Backtrack.", brief: `${e.val} > ${e.remain} ⇒ prune.`, inspect: [["remain", e.remain], ["cur", fmt(e.cur)], ["next", "break"]],
        quiz: { q: `Still need ${e.remain}; the next candidate is ${e.val}. What should the loop do?`, options: ["Break: no later candidate can fit", `Skip ${e.val} and try the next one`, `Add ${e.val} anyway`], answer: 0, why: `Sorted candidates mean everything after ${e.val} is ≥ ${e.val} > ${e.remain}.` } }); }
      else out.push({ ev: "POP", s: draw(visible, e.id, results, { stats: stats(e.cur, e.remain), title: "combinations" }), at: "undo", what: `Undo ${e.val}: path back to ${fmt(e.cur)}, need ${e.remain}.`, why: "Backtrack so the next candidate starts from a clean path.", next: "Try the next candidate.", brief: `pop ${e.val}.`, inspect: [["remain", e.remain], ["cur", fmt(e.cur)], ["next", "next candidate"]] });
    }
    out.push({ ev: "DONE", s: draw(visible, 0, results, { stats: stats([], T), title: "combinations" }), at: "start", tone: results.length ? "ok" : "bad", what: results.length ? `Found **${results.length}** combination${results.length > 1 ? "s" : ""}: ${results.join(", ")}.` : `No combination sums to ${T}.`, why: "Red ✗ nodes are branches that pruning cut off.", next: "Return res.", brief: `${results.length} found.`, inspect: [["results", results.length], ["next", "done"]] });
    return out;
  },
  View,
};

export const backtrackingViz: PatternViz = { title: "Backtracking", modes: [subsets, combo] };
