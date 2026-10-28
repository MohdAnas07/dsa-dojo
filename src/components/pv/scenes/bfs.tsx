import type { Mode, PatternViz, Step } from "../types";
import { Net, Queue, Grid, Stat, type NNode, type NEdge } from "../prims";
import { parseGraph, layout, parseGrid } from "./_graph";

interface GS { pos: [string, number, number][]; w: number; h: number; edges: [string, string, string?][]; nst: Record<string, string>; dist: Record<string, number>; queue: string[]; qhot?: string; directed: boolean; stats: [string, string | number, ("good" | "sky" | "vio" | "accent")?][] }

function GraphView({ s }: { s: GS }) {
  const nodes: NNode[] = s.pos.map(([id, x, y]) => ({ id, x, y, v: id, st: s.nst[id], badge: s.dist[id] !== undefined ? s.dist[id] : undefined }));
  const edges: NEdge[] = s.edges.map(([a, b, st]) => ({ a, b, st, dir: s.directed }));
  return (
    <div className="pv-scene">
      <div className="pv-stats">{s.stats.map(([l, v, t]) => <Stat key={l} label={l} value={v} tone={t} />)}</div>
      <Net nodes={nodes} edges={edges} w={s.w} h={s.h} r={21} />
      <Queue title="queue (front → back)" items={s.queue.map((id, k) => ({ id: id + ":" + k, v: id, sub: s.dist[id] !== undefined ? `d=${s.dist[id]}` : undefined, st: id === s.qhot ? "cmp" : "mem" }))} />
    </div>
  );
}
const ek = (a: string, b: string) => (a < b ? a + "|" + b : b + "|" + a);

const graph: Mode<GS> = {
  id: "graph", label: "Shortest path (graph)", task: "BFS explores in rings: every node at distance 1, then 2, … so the first time you reach a node is the shortest way.",
  fields: [{ key: "e", label: "edges", wide: true }, { key: "s", label: "start" }],
  presets: [{ label: "Tree-like", values: { e: "A-B, A-C, B-D, B-E, C-F, E-G", s: "A" } }, { label: "With cycles", values: { e: "A-B, A-C, B-C, B-D, C-E, D-E, D-F, E-F", s: "A" } }, { label: "Disconnected", values: { e: "1-2, 1-3, 2-4, 5-6", s: "1" } }],
  code: `function bfs(graph, start) {
  const dist = { [start]: 0 };              //#init
  const queue = [start];
  while (queue.length) {                    //#loop
    const u = queue.shift();                //#deq
    for (const v of graph[u]) {             //#for
      if (v in dist) continue;              //#seen
      dist[v] = dist[u] + 1;                //#dist
      queue.push(v);                        //#enq
    }
  }
  return dist;                              //#ret
}`,
  legend: [["sky", "current node u"], ["accent", "neighbour being checked"], ["vio", "waiting in the queue"], ["good", "done (distance final)"]],
  counters: [["dequeued", ["DEQUEUE"]], ["edges checked", ["COMPARE"]], ["enqueued", ["ENQUEUE"]]],
  complexity: { time: "O(V + E)", space: "O(V)", why: "Each node is enqueued and dequeued once (V), and each edge is looked at once from each end (E). The queue and dist map hold at most V entries." },
  run(v) {
    const g = parseGraph(v.e), s0 = String(v.s ?? "").trim();
    if (!g.adj.has(s0)) throw new Error(`Start "${s0}" isn't in the graph. Pick one of ${g.nodes.join(", ")}.`);
    const L = layout(g, s0), out: Step<GS>[] = [];
    const nst: Record<string, string> = {}, dist: Record<string, number> = { [s0]: 0 }, est: Record<string, string> = {}, queue = [s0];
    const snap = (o: { u?: string; v?: string; on?: string; qhot?: string } = {}): GS => ({
      pos: g.nodes.map(n => [n, L.pos.get(n)!.x, L.pos.get(n)!.y]), w: L.w, h: L.h, directed: false,
      edges: g.edges.map(([a, b]) => [a, b, ek(a, b) === o.on ? "on" : est[ek(a, b)]]),
      nst: { ...nst, ...(o.u ? { [o.u]: "cur" } : {}), ...(o.v ? { [o.v]: "cmp" } : {}) }, dist: { ...dist }, queue: [...queue], qhot: o.qhot, stats: [["visited", Object.values(nst).filter(x => x === "ok").length + (o.u ? 1 : 0)], ["queue size", queue.length, "vio"], ["current level", o.u ? dist[o.u] : "–", "sky"]],
    });
    const insp = (u: string | null, next: string, extra: [string, string | number][] = []): [string, string | number][] => [["u", u ?? "–"], ["dist[u]", u ? dist[u] : "–"], ...extra, ["queue", "[" + queue.join(", ") + "]"], ["dist", Object.entries(dist).map(([k, d]) => `${k}:${d}`).join(" ")], ["next", next]];
    nst[s0] = "que";
    out.push({ ev: ["INIT", "ENQUEUE"], s: snap({ qhot: s0 }), at: "init", what: `Start at **${s0}**: distance 0, put it in the queue.`, why: "The queue is first-in, first-out, so nodes are processed in the order they were discovered: nearest first.", next: `Take ${s0} from the front of the queue.`, brief: `dist[${s0}] = 0, queue = [${s0}].`, inspect: insp(null, `dequeue ${s0}`) });
    while (queue.length) {
      const u = queue.shift()!; delete nst[u];
      out.push({ ev: ["DEQUEUE", "VISIT_NODE"], s: snap({ u }), at: "deq", what: `Dequeue **${u}** (distance ${dist[u]}).`, why: `Everything at distance ${dist[u]} comes out of the queue before anything at distance ${dist[u] + 1}.`, next: g.adj.get(u)!.length ? `Check its neighbours: ${g.adj.get(u)!.join(", ")}.` : "It has no neighbours.", brief: `u = ${u}, d = ${dist[u]}.`, inspect: insp(u, "check neighbours") });
      for (const w of g.adj.get(u)!) {
        const seen = w in dist;
        out.push({ ev: "COMPARE", s: snap({ u, v: w, on: ek(u, w) }), at: "seen", eval: seen, decision: { cond: "v in dist", values: `${w} in dist`, result: seen, action: seen ? "skip (already discovered)" : `dist[${w}] = ${dist[u] + 1}, enqueue` },
          what: `Neighbour **${w}**: ${seen ? `already discovered (distance ${dist[w]}).` : "not discovered yet."}`, why: seen ? `Its distance is already as short as it can get: it was found earlier, by a path of length ${dist[w]}.` : `The shortest way to ${w} goes through ${u}: ${dist[u]} + 1 = ${dist[u] + 1}.`, next: seen ? "Skip it." : `Record dist[${w}] = ${dist[u] + 1} and enqueue ${w}.`, brief: seen ? `${w} seen ⇒ skip.` : `${w} new ⇒ d = ${dist[u] + 1}.`, inspect: insp(u, seen ? "skip" : `enqueue ${w}`, [["v", w], ["v in dist", String(seen)]]),
          quiz: { q: `${u} (distance ${dist[u]}) looks at neighbour ${w}. ${seen ? `${w} already has distance ${dist[w]}.` : `${w} has no distance yet.`} What happens?`, options: [`Skip ${w}`, `Set dist[${w}] = ${dist[u] + 1} and enqueue it`], answer: seen ? 0 : 1, why: seen ? "A node is only enqueued the first time it's discovered; that first time was already the shortest." : `First discovery: ${w} is one step further than ${u}.` } });
        if (seen) continue;
        dist[w] = dist[u] + 1; queue.push(w); nst[w] = "que"; est[ek(u, w)] = "ok";
        out.push({ ev: ["WRITE", "ENQUEUE"], s: snap({ u, qhot: w }), at: ["dist", "enq"], what: `dist[${w}] = **${dist[w]}**. ${w} joins the back of the queue.`, why: "The green edge is how BFS first reached it: these edges form the shortest-path tree.", next: "Next neighbour.", brief: `enqueue ${w} (d=${dist[w]}).`, inspect: insp(u, "next neighbour", [["v", w]]) });
      }
      nst[u] = "ok";
      out.push({ ev: "DONE", s: snap(), at: "loop", what: `${u} is finished.`, why: queue.length ? `${queue.length} node${queue.length > 1 ? "s" : ""} still waiting.` : "The queue is empty.", next: queue.length ? `Dequeue ${queue[0]}.` : "Done.", brief: queue.length ? `queue = [${queue.join(", ")}].` : "queue empty.", inspect: insp(null, queue.length ? `dequeue ${queue[0]}` : "return dist") });
    }
    const un = g.nodes.filter(n => !(n in dist));
    for (const n of un) nst[n] = "dim";
    out.push({ ev: "FOUND_RESULT", s: snap(), at: "ret", tone: "ok", what: `Shortest distances from ${s0}: ${Object.entries(dist).map(([k, d]) => `${k}=${d}`).join(", ")}.${un.length ? ` ${un.join(", ")} can't be reached.` : ""}`, why: "Each badge is the fewest edges from the start; the green edges form the shortest-path tree.", next: "Return dist.", brief: `O(V + E): ${g.nodes.length} nodes, ${g.edges.length} edges.`, inspect: insp(null, "done") });
    return out;
  },
  View: GraphView,
};

interface OS { grid: string[][]; t: (number | null)[][]; cur?: [number, number]; hot: string[]; queue: string[]; fresh: number; minute: number; done?: boolean }
function OrangeView({ s }: { s: OS }) {
  return (
    <div className="pv-scene">
      <div className="pv-stats"><Stat label="fresh left" value={s.fresh} tone={s.fresh ? "accent" : "good"} /><Stat label="minute" value={s.minute} tone="sky" /><Stat label="queue" value={s.queue.length} tone="vio" /></div>
      <Grid size={48} rows={s.grid.map((row, r) => row.map((c, k) => {
        const key = r + "," + k, cur = s.cur && s.cur[0] === r && s.cur[1] === k;
        return { v: c === "0" ? "" : c === "1" ? "fresh" : `t${s.t[r][k]}`, st: cur ? "cur" : s.hot.includes(key) ? "cmp" : c === "0" ? "wall" : c === "1" ? (s.done ? "bad" : "land") : "mem" };
      }))} />
      <Queue title="queue: (row, col, minute)" w={64} items={s.queue.map((q, k) => ({ id: q + ":" + k, v: q.split("@")[0], sub: "t" + q.split("@")[1], st: "mem" }))} />
    </div>
  );
}

const oranges: Mode<OS> = {
  id: "grid", label: "Rotting oranges (grid)", task: "Multi-source BFS: start from every rotten orange at once; each ring is one minute.",
  fields: [{ key: "g", label: "grid", wide: true, placeholder: "2 1 1 / 1 1 0 / 0 1 1" }],
  presets: [{ label: "Classic", values: { g: "2 1 1 / 1 1 0 / 0 1 1" } }, { label: "Two sources", values: { g: "2 1 1 1 / 1 1 0 1 / 1 1 1 2" } }, { label: "Unreachable", values: { g: "2 1 1 / 0 1 1 / 1 0 1" } }],
  code: `function orangesRotting(grid) {
  const q = []; let fresh = 0;
  grid.forEach((row, r) => row.forEach((x, c) => {
    if (x === 2) q.push([r, c, 0]);         //#seed
    if (x === 1) fresh++;
  }));
  let time = 0;
  while (q.length) {                        //#loop
    const [r, c, t] = q.shift(); time = t;  //#deq
    for (const [nr, nc] of neighbours(r, c)) {
      if (grid[nr]?.[nc] !== 1) continue;   //#check
      grid[nr][nc] = 2; fresh--;            //#rot
      q.push([nr, nc, t + 1]);              //#enq
    }
  }
  return fresh ? -1 : time;                 //#ret
}`,
  legend: [["good", "fresh orange"], ["vio", "rotten (tN = minute it rotted)"], ["sky", "spreading from here"], ["accent", "rots this minute"]],
  counters: [["dequeued", ["DEQUEUE"]], ["cells checked", ["COMPARE"]], ["oranges rotted", ["ENQUEUE"]]],
  complexity: { time: "O(rows × cols)", space: "O(rows × cols)", why: "Every cell enters the queue at most once and checks 4 neighbours. Starting from all rotten oranges together (multi-source) gives each fresh orange its earliest minute in a single BFS." },
  run(v) {
    const grid = parseGrid(v.g, "012"), R = grid.length, C = grid[0].length, out: Step<OS>[] = [];
    const t: (number | null)[][] = grid.map(r => r.map(x => (x === "2" ? 0 : null)));
    const q: [number, number, number][] = []; let fresh = 0, time = 0;
    grid.forEach((row, r) => row.forEach((x, c) => { if (x === "2") q.push([r, c, 0]); if (x === "1") fresh++; }));
    const snap = (o: Partial<OS> = {}): OS => ({ grid: grid.map(r => [...r]), t: t.map(r => [...r]), hot: [], queue: q.map(([r, c, m]) => `${r},${c}@${m}`), fresh, minute: time, ...o });
    const insp = (next: string, extra: [string, string | number][] = []): [string, string | number][] => [...extra, ["fresh", fresh], ["minute", time], ["queue", q.length ? q.map(([r, c, m]) => `(${r},${c},${m})`).join(" ") : "[]"], ["next", next]];
    if (!q.length) throw new Error("Add at least one rotten orange (2).");
    out.push({ ev: q.map(() => "ENQUEUE" as const), s: snap(), at: "seed", what: `Put **every** rotten orange in the queue at minute 0 (${q.length} of them). ${fresh} fresh oranges are waiting.`, why: "They all spread at the same time. Seeding the queue with all of them handles that in one BFS.", next: "Process the queue front to back.", brief: `multi-source: ${q.length} seeds, fresh = ${fresh}.`, inspect: insp("dequeue") });
    while (q.length) {
      const [r, c, m] = q.shift()!; time = m;
      out.push({ ev: "DEQUEUE", s: snap({ cur: [r, c] }), at: "deq", what: `Orange at (${r}, ${c}) rotted at minute ${m}. It spreads to its fresh neighbours.`, why: "Up, down, left and right: diagonal oranges aren't affected.", next: "Check the 4 neighbours.", brief: `(${r},${c}) t=${m}.`, inspect: insp("check neighbours", [["cell", `(${r}, ${c})`], ["t", m]]) });
      const hit: string[] = [];
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= R || nc >= C || grid[nr][nc] !== "1") continue;
        grid[nr][nc] = "2"; t[nr][nc] = m + 1; fresh--; q.push([nr, nc, m + 1]); hit.push(nr + "," + nc);
      }
      out.push({ ev: hit.length ? ["COMPARE", ...hit.map(() => "ENQUEUE" as const)] : "COMPARE", s: snap({ cur: [r, c], hot: hit }), at: hit.length ? ["check", "rot", "enq"] : "check", eval: hit.length > 0, decision: { cond: "neighbour === 1 (fresh)", values: `${hit.length} fresh neighbour${hit.length === 1 ? "" : "s"}`, result: hit.length > 0, action: hit.length ? `rot ${hit.map(h => `(${h})`).join(" ")} at minute ${m + 1}` : "nothing to spread to" },
        what: hit.length ? `${hit.length} fresh neighbour${hit.length > 1 ? "s" : ""} rot at minute **${m + 1}**.` : "No fresh neighbours.", why: hit.length ? "They join the back of the queue, behind everything from this minute." : "Empty cells, walls or already-rotten oranges don't change.", next: q.length ? "Dequeue the next orange." : "The queue is empty.", brief: hit.length ? `rot ${hit.length} @ t=${m + 1}; fresh = ${fresh}.` : "no spread.", inspect: insp(q.length ? "dequeue" : "return", [["cell", `(${r}, ${c})`], ["t", m], ["rotted now", hit.length]]) });
    }
    out.push({ ev: fresh ? "NOT_FOUND" : "FOUND_RESULT", s: snap({ done: true }), at: "ret", tone: fresh ? "bad" : "ok", eval: fresh > 0, decision: { cond: "fresh > 0", values: `${fresh} > 0`, result: fresh > 0, action: fresh ? "return -1" : `return ${time}` }, what: fresh ? `${fresh} orange${fresh > 1 ? "s" : ""} can never rot: nothing rotten can reach ${fresh > 1 ? "them" : "it"}.` : `All oranges are rotten after **${time} minute${time === 1 ? "" : "s"}**.`, why: fresh ? "They're cut off by empty cells." : "The last BFS ring tells us the time.", next: fresh ? "Return -1." : `Return ${time}.`, brief: fresh ? "return -1." : `return ${time}. O(R·C).`, inspect: insp("done") });
    return out;
  },
  View: OrangeView,
};

export const bfsViz: PatternViz = { title: "BFS (Breadth-First Search)", modes: [graph, oranges] };
