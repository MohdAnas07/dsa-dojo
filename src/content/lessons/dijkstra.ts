import type { Lesson } from "@/lib/types";
import { HEAP } from "./_shared";

const EDGES = "[[0, 1, 4], [0, 2, 1], [2, 1, 2], [1, 3, 1], [2, 3, 5], [3, 4, 3]]";

const dijkstra: Lesson = {
  what: "Dijkstra's algorithm finds the shortest (cheapest) path from one start node to every other node in a graph whose edge weights are all non-negative.",
  analogy: { short: "Water spreading through pipes", text: "Pour water in at the start. It reaches nearby junctions first and farther ones later, always arriving by the quickest route. Dijkstra settles nodes in exactly that order: closest first." },
  eli5: "You keep a list of places you can reach and how far away they are. You always go to the closest place you haven't visited yet, and from there you update how far its neighbours are.",
  tech: "Keep dist[v] (best known distance, Infinity at first; 0 for the source) and a min-heap of (distance, node). Repeatedly pop the closest node u; if its distance is out of date, skip it. Otherwise relax each edge u → v: if dist[u] + w < dist[v], update dist[v] and push it. With a binary heap this is O((V + E) log V). It requires non-negative weights: a negative edge could make an already-settled node cheaper later (use Bellman-Ford then). Record prev[v] when relaxing to rebuild the actual path.",
  why: "Weighted shortest paths are everywhere: maps and navigation, network latency, cheapest routes, minimum effort or cost on a grid. BFS only works when every edge costs the same; Dijkstra handles different costs.",
  how: ["dist[source] = 0, everything else Infinity; push (0, source).", "Pop the entry with the smallest distance.", "If it's stale (bigger than dist[u]), skip it.", "For each edge u → v with weight w: if dist[u] + w < dist[v], update dist[v] and push (dist[v], v).", "When the heap is empty, dist holds all shortest distances."],
  props: ["Non-negative weights only", "Greedy: settles the closest node first", "Single source, all targets", "O((V + E) log V) with a heap"],
  use: ["Navigation and routing", "Network delay / latency", "Minimum-cost or minimum-effort grid paths", "Any 'cheapest way from A' question with weights"],
  avoid: ["Negative edge weights (Bellman-Ford)", "Unweighted graphs (plain BFS is simpler and faster)", "All-pairs shortest paths on small dense graphs (Floyd-Warshall)"],
  viz: "queue",
  cx: [["With a binary heap", "O((V + E) log V)", "Each relaxation may push into the heap."], ["With an array scan", "O(V²)", "Find the closest unsettled node by scanning: fine for dense graphs."], ["Space", "O(V + E)", "Adjacency list, distances and the heap."]],
  space: "O(V + E).",
  code: {
    c: HEAP + `function dijkstra(n, edges, src) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) adj[u].push([v, w]);
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  const pq = new Heap((x, y) => x[0] < y[0]);
  pq.push([0, src]);
  while (pq.size) {
    const [d, u] = pq.pop();
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) {
      if (d + w < dist[v]) { dist[v] = d + w; pq.push([dist[v], v]); }
    }
  }
  return dist;
}
console.log(dijkstra(5, ${EDGES}, 0));`,
    hl: [15, 17],
    ex: { 11: "A min-heap ordered by distance: always settle the closest node next.", 15: "A stale entry: we already found a shorter way to u.", 17: "Relax the edge: going through u is a shorter way to v." }
  },
  brute: { title: "Simpler version: scan for the closest node (O(V²))", c: `function dijkstraSlow(n, edges, src) {
  const dist = new Array(n).fill(Infinity), done = new Array(n).fill(false);
  dist[src] = 0;
  for (let k = 0; k < n; k++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!done[i] && (u === -1 || dist[i] < dist[u])) u = i;
    done[u] = true;
    for (const [a, b, w] of edges) if (a === u && dist[u] + w < dist[b]) dist[b] = dist[u] + w;
  }
  return dist;
}
console.log(dijkstraSlow(5, ${EDGES}, 0));`, time: "O(V · (V + E))", space: "O(V)", ex: { 6: "Without a heap, finding the closest unsettled node takes a full scan." } },
  examples: [
    { lvl: "Easy", title: "Network delay time", prob: "A signal starts at node k and travels along directed weighted edges. How long until every node has it (or −1)?", idea: "Run Dijkstra from k; the answer is the largest shortest distance.", c: HEAP + `function networkDelayTime(times, n, k) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const pq = new Heap((x, y) => x[0] < y[0]);
  pq.push([0, k]);
  while (pq.size) {
    const [d, u] = pq.pop();
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) if (d + w < dist[v]) { dist[v] = d + w; pq.push([dist[v], v]); }
  }
  const worst = Math.max(...dist.slice(1));
  return worst === Infinity ? -1 : worst;
}
console.log(networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2));
console.log(networkDelayTime([[1, 2, 1]], 2, 2));`, time: "O((V + E) log V)", space: "O(V + E)", ex: { 18: "Nodes are 1-indexed, so skip index 0.", 19: "Some node was never reached." } },
    { lvl: "Practical", title: "Path with minimum effort", prob: "On a height grid, a path's effort is its biggest height jump. Find the smallest possible effort from top-left to bottom-right.", idea: "Dijkstra works with any cost that never decreases along a path, including 'the maximum step so far'.", c: HEAP + `function minimumEffortPath(h) {
  const R = h.length, C = h[0].length;
  const best = Array.from({ length: R }, () => new Array(C).fill(Infinity));
  best[0][0] = 0;
  const pq = new Heap((x, y) => x[0] < y[0]);
  pq.push([0, 0, 0]);
  while (pq.size) {
    const [e, r, c] = pq.pop();
    if (r === R - 1 && c === C - 1) return e;
    if (e > best[r][c]) continue;
    for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
      if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
      const ne = Math.max(e, Math.abs(h[nr][nc] - h[r][c]));
      if (ne < best[nr][nc]) { best[nr][nc] = ne; pq.push([ne, nr, nc]); }
    }
  }
}
console.log(minimumEffortPath([[1, 2, 2], [3, 8, 2], [5, 3, 5]]));`, time: "O(R·C · log(R·C))", space: "O(R·C)", ex: { 14: "The first time the target is popped, its effort is final.", 18: "The cost of a path is its largest step, not the sum." } },
    { lvl: "Interview", title: "Shortest route, not just its length", prob: "Return both the shortest distance and the actual path between two nodes.", idea: "Whenever an edge improves dist[v], remember prev[v] = u. Walk prev backwards from the target to rebuild the path.", c: HEAP + `function shortestRoute(n, edges, src, dst) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) { adj[u].push([v, w]); adj[v].push([u, w]); }
  const dist = new Array(n).fill(Infinity), prev = new Array(n).fill(-1);
  dist[src] = 0;
  const pq = new Heap((x, y) => x[0] < y[0]);
  pq.push([0, src]);
  while (pq.size) {
    const [d, u] = pq.pop();
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) if (d + w < dist[v]) { dist[v] = d + w; prev[v] = u; pq.push([dist[v], v]); }
  }
  const path = [];
  for (let v = dst; v !== -1; v = prev[v]) path.push(v);
  return [dist[dst], path.reverse()];
}
console.log(shortestRoute(5, ${EDGES}, 0, 4));`, time: "O((V + E) log V)", space: "O(V + E)", ex: { 16: "Remember where the best path to v came from.", 19: "Follow the breadcrumbs back from the target, then reverse." } }
  ],
  signals: [["\"shortest\" / \"cheapest\" / \"minimum time\" with weights", "Dijkstra"], ["weights are all equal", "BFS is enough"], ["negative weights", "Bellman-Ford, not Dijkstra"], ["\"minimum effort\", \"bottleneck\" path", "Dijkstra with max instead of sum"], ["\"at most k stops\"", "Bellman-Ford limited to k + 1 rounds (or BFS by levels)"]],
  mistakes: [["Using Dijkstra with negative edges", "A settled node could get cheaper later. Use Bellman-Ford."], ["Not skipping stale heap entries", "Without the d > dist[u] check you redo work (still correct, but slower)."], ["Marking nodes visited when pushing", "In Dijkstra a node is final only when it's popped."], ["Using BFS on a weighted graph", "BFS minimizes the number of edges, not the total weight."]],
  js: ["JS has no built-in priority queue: reuse a small heap class.", "Store heap entries as [distance, node] and compare entry[0]."],
  iq: { Beginner: ["Find the shortest distance from one city to every other city"], Easy: ["Run Dijkstra by hand on a small weighted graph"], Medium: ["network-delay-time", "path-min-effort", "cheapest-flights-k-stops"], Hard: ["swim-rising-water", "min-refuel-stops"] },
  rev: { s30: "Single-source shortest paths with non-negative weights. Min-heap of (dist, node): pop the closest, skip stale entries, relax edges. O((V + E) log V).", m2: ["dist[src] = 0, others Infinity", "Pop closest, skip if stale", "Relax: dist[u] + w < dist[v]", "No negative weights", "prev[] rebuilds the path"] },
  cheat: `DIJKSTRA CHEAT SHEET

dist = [∞…], dist[s] = 0, heap = [(0, s)]
while heap:
  d, u = pop min
  if d > dist[u]: continue
  for v, w of adj[u]:
    if d + w < dist[v]: dist[v] = d + w; push (dist[v], v)

O((V + E) log V), weights ≥ 0
Unweighted → BFS.  Negative → Bellman-Ford`
};

export default dijkstra;
