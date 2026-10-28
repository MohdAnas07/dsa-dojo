import type { Mode, PatternViz, Step } from "../types";
import { Net, Stack, Grid, Stat, type NNode, type NEdge } from "../prims";
import { parseGraph, layout, parseGrid } from "./_graph";

interface DS { pos: [string, number, number][]; w: number; h: number; edges: [string, string, string?][]; nst: Record<string, string>; order: Record<string, number>; stack: string[]; directed: boolean; stats: [string, string | number, ("good" | "sky" | "vio" | "accent" | "bad")?][]; stackTitle: string }
function GraphView({ s }: { s: DS }) {
  const nodes: NNode[] = s.pos.map(([id, x, y]) => ({ id, x, y, v: id, st: s.nst[id], badge: s.order[id] }));
  const edges: NEdge[] = s.edges.map(([a, b, st]) => ({ a, b, st, dir: s.directed }));
  return (
    <div className="pv-scene">
      <div className="pv-stats">{s.stats.map(([l, v, t]) => <Stat key={l} label={l} value={v} tone={t} />)}</div>
      <div className="pv-side-by-side">
        <Net nodes={nodes} edges={edges} w={s.w} h={s.h} r={21} />
        <Stack title={s.stackTitle} items={s.stack.map((u, k) => ({ id: u + k, v: `${s.directed ? "dfs" : "visit"}(${u})`, st: k === s.stack.length - 1 ? "cur" : "mem" }))} min={4} w={120} />
      </div>
    </div>
  );
}
const ek = (a: string, b: string, directed: boolean) => (directed || a < b ? a + "|" + b : b + "|" + a);

const traverse: Mode<DS> = {
  id: "graph", label: "Traversal + backtracking", task: "DFS goes as deep as it can, then backs up to the last node with an unexplored neighbour.",
  fields: [{ key: "e", label: "edges", wide: true }, { key: "s", label: "start" }],
  presets: [{ label: "Tree-like", values: { e: "A-B, A-C, B-D, B-E, C-F, E-G", s: "A" } }, { label: "With cycles", values: { e: "A-B, A-C, B-C, B-D, C-E, D-E, D-F", s: "A" } }, { label: "Line", values: { e: "1-2, 2-3, 3-4, 1-5", s: "1" } }],
  code: `function dfs(graph, start) {
  const seen = new Set(), order = [];
  function visit(u) {                       //#call
    seen.add(u); order.push(u);             //#mark
    for (const v of graph[u]) {             //#for
      if (seen.has(v)) continue;            //#seen
      visit(v);                             //#recurse
    }
  }                                         //#ret
  visit(start);                             //#start
  return order;
}`,
  legend: [["sky", "current call (top of stack)"], ["vio", "waiting on the call stack"], ["accent", "neighbour being checked"], ["good", "finished (returned)"]],
  counters: [["calls", ["PUSH"]], ["returns (backtracks)", ["POP"]], ["edges checked", ["COMPARE"]]],
  complexity: { time: "O(V + E)", space: "O(V)", why: "Each node is visited once and each edge checked from both ends. The recursion can get as deep as the longest path, up to V calls on the stack." },
  run(v) {
    const g = parseGraph(v.e), s0 = String(v.s ?? "").trim();
    if (!g.adj.has(s0)) throw new Error(`Start "${s0}" isn't in the graph. Pick one of ${g.nodes.join(", ")}.`);
    const L = layout(g, s0), out: Step<DS>[] = [];
    const nst: Record<string, string> = {}, order: Record<string, number> = {}, est: Record<string, string> = {}, stack: string[] = [];
    let n = 0;
    const snap = (o: { v?: string; on?: string } = {}): DS => {
      const top = stack.at(-1);
      return { pos: g.nodes.map(x => [x, L.pos.get(x)!.x, L.pos.get(x)!.y]), w: L.w, h: L.h, directed: false, stackTitle: "call stack",
        edges: g.edges.map(([a, b]) => [a, b, ek(a, b, false) === o.on ? "on" : est[ek(a, b, false)]]),
        nst: { ...nst, ...Object.fromEntries(stack.map(x => [x, "mem"])), ...(top ? { [top]: "cur" } : {}), ...(o.v ? { [o.v]: "cmp" } : {}) }, order: { ...order }, stack: [...stack],
        stats: [["visited", n], ["stack depth", stack.length, "vio"]] };
    };
    const insp = (next: string, extra: [string, string | number][] = []): [string, string | number][] => [["u (current call)", stack.at(-1) ?? "–"], ...extra, ["call stack", "[" + stack.join(" → ") + "]"], ["visit order", Object.keys(order).join(", ")], ["next", next]];
    out.push({ ev: "INIT", s: snap(), at: "start", what: `Call **visit(${s0})**.`, why: "DFS uses the call stack (recursion) to remember where to come back to.", next: `Mark ${s0} as seen.`, brief: `visit(${s0}).`, inspect: insp(`visit(${s0})`) });
    const visit = (u: string, from?: string) => {
      stack.push(u); order[u] = ++n;
      out.push({ ev: ["PUSH", "VISIT_NODE"], s: snap(), at: ["call", "mark"], what: `Enter **visit(${u})**. It's visit #${n}.${from ? ` We came from ${from}.` : ""}`, why: `Mark ${u} as seen so we never enter it twice (cycles would loop forever).`, next: g.adj.get(u)!.length ? `Look at ${u}'s neighbours: ${g.adj.get(u)!.join(", ")}.` : "No neighbours.", brief: `visit ${u} (#${n}), depth ${stack.length}.`, inspect: insp("loop over neighbours") });
      for (const w of g.adj.get(u)!) {
        const seen = w in order;
        out.push({ ev: "COMPARE", s: snap({ v: w, on: ek(u, w, false) }), at: "seen", eval: seen, decision: { cond: "seen.has(v)", values: `seen.has(${w})`, result: seen, action: seen ? "skip it" : `go deeper: visit(${w})` },
          what: `${u} looks at neighbour **${w}**: ${seen ? "already seen." : "not seen yet."}`, why: seen ? `${w} was visited (#${order[w]}) ${stack.includes(w) ? "and is still on the call stack" : "already"}.` : "DFS dives in immediately, before looking at the rest of " + u + "'s neighbours.", next: seen ? "Skip it; next neighbour." : `Call visit(${w}).`, brief: seen ? `${w} seen ⇒ skip.` : `recurse into ${w}.`, inspect: insp(seen ? "next neighbour" : `visit(${w})`, [["v", w]]),
          quiz: { q: `In visit(${u}), neighbour ${w} is ${seen ? "already seen" : "unseen"}. What does DFS do?`, options: [`Call visit(${w}) right now`, `Skip ${w}`, `Add ${w} to a queue for later`], answer: seen ? 1 : 0, why: seen ? "Seen nodes are never entered twice." : "DFS goes deep first: it follows the new neighbour immediately and comes back later." } });
        if (seen) continue;
        est[ek(u, w, false)] = "ok";
        visit(w, u);
      }
      stack.pop(); nst[u] = "ok";
      const back = stack.at(-1);
      out.push({ ev: "POP", s: snap({ on: back ? ek(back, u, false) : undefined }), at: "ret", what: `visit(${u}) is done: every neighbour is explored. **Return**${back ? ` to visit(${back})` : ""}.`, why: back ? `That's backtracking: ${back} may still have unexplored neighbours.` : "The first call has returned.", next: back ? `Continue ${back}'s neighbour loop.` : "DFS is complete.", brief: back ? `return to ${back}.` : "done.", inspect: insp(back ? `resume visit(${back})` : "return order") });
    };
    visit(s0);
    const un = g.nodes.filter(x => !(x in order)); for (const x of un) nst[x] = "dim";
    out.push({ ev: "FOUND_RESULT", s: snap(), tone: "ok", at: "start", what: `Visit order: **${Object.keys(order).join(" → ")}**.${un.length ? ` ${un.join(", ")} can't be reached from ${s0}.` : ""}`, why: "The green edges are the DFS tree: each was used to enter a new node.", next: "Return order.", brief: `O(V + E). Order: ${Object.keys(order).join(", ")}.`, inspect: insp("done") });
    return out;
  },
  View: GraphView,
};

const cycle: Mode<DS> = {
  id: "cycle", label: "Cycle in a directed graph", task: "Three states: unvisited, on the current path, finished. An edge back to the current path is a cycle.",
  fields: [{ key: "e", label: "edges (A>B)", wide: true }],
  presets: [{ label: "Has cycle", values: { e: "A>B, B>C, C>D, D>B, A>E" } }, { label: "DAG (no cycle)", values: { e: "A>B, A>C, B>D, C>D, D>E" } }, { label: "Courses", values: { e: "1>2, 2>3, 1>3, 3>4, 4>2" } }],
  code: `function hasCycle(graph) {
  const state = {}; // 1 = on current path, 2 = finished
  function dfs(u) {
    state[u] = 1;                            //#enter
    for (const v of graph[u]) {              //#for
      if (state[v] === 1) return true;       //#back
      if (!state[v] && dfs(v)) return true;  //#recurse
    }
    state[u] = 2;                            //#exit
    return false;
  }
  return nodes.some(u => !state[u] && dfs(u)); //#start
}`,
  legend: [["sky", "current call"], ["vio", "on the current path (state 1)"], ["good", "finished (state 2)"], ["bad", "back edge = cycle"]],
  counters: [["calls", ["PUSH"]], ["edges checked", ["COMPARE"]], ["finished", ["POP"]]],
  complexity: { time: "O(V + E)", space: "O(V)", why: "Each node is entered once and each directed edge checked once. \"Finished\" nodes are never re-entered, because nothing reachable from them can lead back to the current path." },
  run(v) {
    const g = parseGraph(v.e, true), out: Step<DS>[] = [];
    const roots = g.nodes.filter(n => !g.edges.some(([, b]) => b === n));
    const L = layout({ ...g, adj: new Map(g.nodes.map(n => [n, [...g.adj.get(n)!, ...g.edges.filter(([, b]) => b === n).map(([a]) => a)]])) }, roots[0] ?? g.nodes[0]);
    const state: Record<string, number> = {}, est: Record<string, string> = {}, stack: string[] = [], order: Record<string, number> = {};
    let n = 0, found = false;
    const snap = (o: { v?: string; on?: string; bad?: string } = {}): DS => {
      const nst: Record<string, string> = {};
      for (const [k, s] of Object.entries(state)) nst[k] = s === 1 ? "mem" : "ok";
      const top = stack.at(-1); if (top) nst[top] = "cur";
      if (o.v) nst[o.v] = o.bad ? "bad" : "cmp";
      return { pos: g.nodes.map(x => [x, L.pos.get(x)!.x, L.pos.get(x)!.y]), w: L.w, h: L.h, directed: true, stackTitle: "current path",
        edges: g.edges.map(([a, b]) => [a, b, a + "|" + b === o.bad ? "bad" : a + "|" + b === o.on ? "on" : est[a + "|" + b]]), nst, order: { ...order }, stack: [...stack],
        stats: [["on path", stack.length, "vio"], ["finished", Object.values(state).filter(x => x === 2).length, "good"], ["cycle", found ? "yes" : "not yet", found ? "bad" : "sky"]] };
    };
    const insp = (next: string, extra: [string, string | number][] = []): [string, string | number][] => [["u", stack.at(-1) ?? "–"], ...extra, ["path (state 1)", stack.join(" → ") || "–"], ["finished (state 2)", Object.keys(state).filter(k => state[k] === 2).join(", ") || "–"], ["next", next]];
    out.push({ ev: "INIT", s: snap(), at: "start", what: "Every node starts unvisited.", why: "A cycle exists exactly when DFS finds an edge pointing back to a node that is **still on the current path**.", next: `Start DFS from ${g.nodes[0]}.`, brief: "colour nodes: 0 new, 1 on path, 2 done.", inspect: insp("start dfs") });
    const dfs = (u: string): boolean => {
      state[u] = 1; stack.push(u); order[u] = ++n;
      out.push({ ev: ["PUSH", "VISIT_NODE"], s: snap(), at: "enter", what: `Enter **${u}**: state 1 (on the current path ${stack.join(" → ")}).`, why: "While u is on the path, reaching it again means we went in a circle.", next: g.adj.get(u)!.length ? `Follow ${u}'s edges: ${g.adj.get(u)!.join(", ")}.` : "No outgoing edges.", brief: `enter ${u}.`, inspect: insp("check edges") });
      for (const w of g.adj.get(u)!) {
        const st = state[w] ?? 0;
        if (st === 1) {
          found = true;
          out.push({ ev: ["COMPARE", "FOUND_RESULT"], s: snap({ v: w, bad: u + "|" + w }), at: "back", eval: true, tone: "bad", decision: { cond: "state[v] === 1", values: `state[${w}] = 1`, result: true, action: "cycle! return true" }, what: `Edge ${u} → **${w}**, and ${w} is on the current path.`, why: `So ${stack.slice(stack.indexOf(w)).join(" → ")} → ${w} is a cycle.`, next: "Return true all the way up.", brief: `back edge ${u}→${w} ⇒ cycle.`, inspect: insp("return true", [["v", w], ["state[v]", 1]]),
            quiz: { q: `Edge ${u} → ${w}, and ${w} is still on the current path. What does that mean?`, options: ["There's a cycle", `Just skip ${w}`, `Visit ${w} again`], answer: 0, why: `We can walk from ${w} down to ${u} along the path, and the edge ${u} → ${w} closes the loop.` } });
          return true;
        }
        out.push({ ev: "COMPARE", s: snap({ v: w, on: u + "|" + w }), at: st === 2 ? "recurse" : "back", eval: st === 2 ? false : false, decision: { cond: st === 2 ? "!state[v]" : "state[v] === 1", values: `state[${w}] = ${st}`, result: false, action: st === 2 ? "skip: already finished" : `go deeper into ${w}` }, what: `Edge ${u} → **${w}**: ${st === 2 ? "already finished (state 2)." : "unvisited."}`, why: st === 2 ? `${w} and everything it reaches were fully explored with no cycle, and ${w} isn't on our path.` : "Not on the path, so no cycle here yet.", next: st === 2 ? "Skip it." : `dfs(${w}).`, brief: st === 2 ? `${w} done ⇒ skip.` : `recurse ${w}.`, inspect: insp(st === 2 ? "next edge" : `dfs(${w})`, [["v", w], ["state[v]", st]]),
          quiz: st === 2 ? { q: `${w} is finished (state 2). Is ${u} → ${w} a cycle?`, options: ["Yes", "No, skip it"], answer: 1, why: `${w} is no longer on the current path, so this edge can't close a loop.` } : undefined });
        if (st === 2) continue;
        est[u + "|" + w] = "ok";
        if (dfs(w)) return true;
      }
      state[u] = 2; stack.pop();
      out.push({ ev: "POP", s: snap(), at: "exit", what: `${u} is **finished** (state 2).`, why: "Nothing reachable from it leads back to the path.", next: stack.length ? `Back to ${stack.at(-1)}.` : "Try the next unvisited node.", brief: `${u} done.`, inspect: insp(stack.length ? `resume ${stack.at(-1)}` : "next start") });
      return false;
    };
    for (const u of g.nodes) { if (state[u]) continue; if (dfs(u)) break; }
    if (!found) out.push({ ev: "NOT_FOUND", s: snap(), at: "start", tone: "ok", what: "Every node finished without a back edge: **no cycle**.", why: "So the nodes can be put in a valid order (a topological order exists).", next: "Return false.", brief: "return false. O(V + E).", inspect: insp("done") });
    else out.push({ ev: "DONE", s: snap(), at: "start", tone: "bad", what: "**Cycle found**: return true.", why: "In a course schedule, this would mean some courses depend on each other in a loop and can't all be finished.", next: "Done.", brief: "return true. O(V + E).", inspect: insp("done") });
    return out;
  },
  View: GraphView,
};

interface IS { grid: string[][]; mark: (number | null)[][]; cur?: [number, number]; scan?: [number, number]; stack: string[]; count: number; hot?: [number, number] }
function IslandView({ s }: { s: IS }) {
  return (
    <div className="pv-scene">
      <div className="pv-stats"><Stat label="islands" value={s.count} tone="good" /><Stat label="recursion depth" value={s.stack.length} tone="vio" /></div>
      <div className="pv-side-by-side">
        <Grid size={46} rows={s.grid.map((row, r) => row.map((c, k) => {
          const cur = s.cur && s.cur[0] === r && s.cur[1] === k, scan = s.scan && s.scan[0] === r && s.scan[1] === k, hot = s.hot && s.hot[0] === r && s.hot[1] === k;
          return { v: c === "0" ? "" : s.mark[r][k] !== null ? `#${s.mark[r][k]}` : "1", st: cur ? "cur" : hot ? "cmp" : c === "0" ? (scan ? "cmp" : "water") : s.mark[r][k] !== null ? (s.stack.includes(r + "," + k) ? "mem" : "ok") : scan ? "cmp" : "land" };
        }))} />
        <Stack title="call stack" items={s.stack.map((c, k) => ({ id: c + ":" + k, v: `fill(${c})`, st: k === s.stack.length - 1 ? "cur" : "mem" }))} min={4} w={124} />
      </div>
    </div>
  );
}

const islands: Mode<IS> = {
  id: "islands", label: "Count islands (grid)", task: "Scan the grid; each new piece of land starts a DFS that sinks its whole island.",
  fields: [{ key: "g", label: "grid", wide: true, placeholder: "1 1 0 / 0 1 0 / 1 0 1" }],
  presets: [{ label: "3 islands", values: { g: "1 1 0 0 / 1 0 0 1 / 0 0 1 1 / 1 0 0 0" } }, { label: "One big", values: { g: "1 1 1 / 0 1 0 / 1 1 1" } }, { label: "Diagonals", values: { g: "1 0 1 / 0 1 0 / 1 0 1" } }],
  code: `function numIslands(grid) {
  let count = 0;
  const fill = (r, c) => {
    if (grid[r]?.[c] !== "1") return;       //#check
    grid[r][c] = "#";                        //#mark
    fill(r + 1, c); fill(r - 1, c);          //#recurse
    fill(r, c + 1); fill(r, c - 1);
  };
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (grid[r][c] === "1") { count++; fill(r, c); } //#scan
  return count;                              //#ret
}`,
  legend: [["good", "land"], ["accent", "being scanned / checked"], ["sky", "current fill call"], ["vio", "on the call stack"]],
  counters: [["cells scanned", ["ITER"]], ["fill calls", ["PUSH"]], ["islands", ["FOUND_RESULT"]]],
  complexity: { time: "O(rows × cols)", space: "O(rows × cols)", why: "Each cell is scanned once and filled at most once (filling marks it, so it's never entered again). In the worst case (all land) the recursion goes as deep as the number of cells." },
  run(v) {
    const grid = parseGrid(v.g, "01", 5, 6), R = grid.length, C = grid[0].length, out: Step<IS>[] = [];
    const mark: (number | null)[][] = grid.map(r => r.map(() => null)), stack: string[] = [];
    let count = 0;
    const snap = (o: Partial<IS> = {}): IS => ({ grid, mark: mark.map(r => [...r]), stack: [...stack], count, ...o });
    const insp = (next: string, extra: [string, string | number][] = []): [string, string | number][] => [...extra, ["islands", count], ["depth", stack.length], ["next", next]];
    out.push({ ev: "INIT", s: snap(), at: "scan", what: "Scan the grid row by row.", why: "Every time we find land that isn't part of a known island, it must be a new island.", next: "Check (0, 0).", brief: "count = 0.", inspect: insp("scan") });
    const fill = (r: number, c: number, depth: number) => {
      stack.push(r + "," + c); mark[r][c] = count;
      out.push({ ev: ["PUSH", "VISIT_NODE"], s: snap({ cur: [r, c] }), at: "mark", what: `fill(${r}, ${c}): mark it as part of island #${count}.`, why: "Marking means it will never be counted or entered again.", next: "Try the 4 neighbours: down, up, right, left.", brief: `mark (${r},${c}).`, inspect: insp("neighbours", [["cell", `(${r}, ${c})`]]) });
      for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
        if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
        const land = grid[nr][nc] === "1" && mark[nr][nc] === null;
        if (!land) continue;
        out.push({ ev: "COMPARE", s: snap({ cur: [r, c], hot: [nr, nc] }), at: "check", eval: true, decision: { cond: 'grid[r][c] === "1"', values: `(${nr}, ${nc}) is unmarked land`, result: true, action: `fill(${nr}, ${nc})` }, what: `Neighbour (${nr}, ${nc}) is unmarked land.`, why: "It touches this island, so it belongs to it.", next: `Go deeper: fill(${nr}, ${nc}).`, brief: `recurse (${nr},${nc}).`, inspect: insp("recurse", [["cell", `(${r}, ${c})`], ["neighbour", `(${nr}, ${nc})`]]) });
        fill(nr, nc, depth + 1);
      }
      stack.pop();
      out.push({ ev: "POP", s: snap({ cur: stack.length ? (stack.at(-1)!.split(",").map(Number) as [number, number]) : undefined }), at: "recurse", what: `fill(${r}, ${c}) returns: no unmarked land around it.`, why: stack.length ? "Backtrack to the previous cell to try its remaining neighbours." : `Island #${count} is completely marked.`, next: stack.length ? "Continue there." : "Resume scanning.", brief: stack.length ? "backtrack." : `island #${count} done.`, inspect: insp(stack.length ? "backtrack" : "scan") });
    };
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const isNew = grid[r][c] === "1" && mark[r][c] === null;
      if (grid[r][c] === "1" && !isNew) continue;
      out.push({ ev: isNew ? ["ITER", "COMPARE"] : "ITER", s: snap({ scan: [r, c] }), at: "scan", eval: isNew, decision: { cond: 'grid[r][c] === "1"', values: `(${r}, ${c}) = ${grid[r][c] === "1" ? "unmarked land" : "water"}`, result: isNew, action: isNew ? `count = ${count + 1}, fill(${r}, ${c})` : "move on" }, what: `Scan (${r}, ${c}): ${isNew ? "**unmarked land**." : "water."}`, why: isNew ? "Land we haven't marked can't belong to an earlier island." : "Nothing to do.", next: isNew ? `Start island #${count + 1}.` : "Next cell.", brief: isNew ? `new island at (${r},${c}).` : `(${r},${c}) water.`, inspect: insp(isNew ? "fill" : "scan", [["cell", `(${r}, ${c})`]]),
        quiz: isNew && count > 0 ? { q: `(${r}, ${c}) is land that hasn't been marked. Is it a new island?`, options: ["Yes: count it and fill it", "No: it belongs to an earlier island"], answer: 0, why: "If it were connected to an earlier island, that island's fill would already have marked it." } : undefined });
      if (!isNew) continue;
      count++;
      out.push({ ev: "FOUND_RESULT", s: snap({ scan: [r, c] }), at: "scan", tone: "find", what: `Island **#${count}** found.`, why: "Now sink the whole island so its other cells aren't counted again.", next: `fill(${r}, ${c}).`, brief: `count = ${count}.`, inspect: insp("fill") });
      fill(r, c, 1);
    }
    out.push({ ev: "DONE", s: snap(), at: "ret", tone: "ok", what: `There ${count === 1 ? "is **1 island**" : `are **${count} islands**`}.`, why: "Each island was counted exactly once: at its first cell in scan order.", next: "Return count.", brief: `return ${count}. O(R·C).`, inspect: insp("done") });
    return out;
  },
  View: IslandView,
};

export const dfsViz: PatternViz = { title: "DFS (Depth-First Search)", modes: [traverse, islands, cycle] };
