import type { Lesson } from "@/lib/types";

const INIT = "Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)))";

const floydWarshall: Lesson = {
  what: "Floyd-Warshall computes the shortest path between every pair of nodes at once, using a simple triple loop over a distance matrix.",
  analogy: { short: "Adding layover cities one at a time", text: "Start with direct flights only. Then allow layovers in city 0: does stopping there make any trip cheaper? Then allow city 1 as well, and so on. After every city has been allowed as a layover, every trip has its cheapest price." },
  eli5: "A big table of 'how far from every town to every other town'. You keep asking: would it be shorter to go through this town in the middle?",
  tech: "Start with d[i][j] = the direct edge weight (0 on the diagonal, Infinity if no edge). For each k from 0 to n − 1, and every pair (i, j), set d[i][j] = min(d[i][j], d[i][k] + d[k][j]). After round k, d holds the shortest paths that only pass through nodes 0…k in between. Time O(V³), space O(V²). It handles negative edges; a negative value on the diagonal afterwards means a negative cycle. The k loop must be the outermost.",
  why: "When you need many or all pairwise distances on a small graph (up to a few hundred nodes), Floyd-Warshall is the shortest code to write. The same triple loop also answers reachability (transitive closure) and chained ratios (evaluate division).",
  how: ["Build an n × n matrix: 0 on the diagonal, edge weights where edges exist, Infinity elsewhere.", "For k = 0 … n − 1 (outermost loop):", "  for every i and j: if d[i][k] + d[k][j] < d[i][j], update d[i][j].", "Read any distance straight from the matrix.", "d[i][i] < 0 afterwards ⇒ a negative cycle through i."],
  props: ["All pairs at once", "O(V³) time, O(V²) space", "Handles negative edges", "k loop outermost"],
  use: ["All-pairs shortest paths on small graphs", "Reachability between all pairs (transitive closure)", "Combining ratios or relations through intermediates", "Finding the most central node"],
  avoid: ["Large graphs (O(V³) is too slow beyond a few hundred nodes)", "Single-source questions (Dijkstra / Bellman-Ford)"],
  viz: "array",
  cx: [["Triple loop", "O(V³)", "n rounds of n × n updates."], ["Space", "O(V²)", "The distance matrix."], ["Query after building", "O(1)", "Read d[i][j]."]],
  space: "O(V²).",
  code: {
    c: `function floydWarshall(n, edges) {
  const d = ${INIT};
  for (const [u, v, w] of edges) d[u][v] = Math.min(d[u][v], w);
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
  return d;
}
const d = floydWarshall(4, [[0, 1, 3], [1, 2, 1], [0, 2, 7], [2, 3, 2], [3, 0, 2]]);
console.log(d[0]);
console.log(d[3][2], d[1][0]);`,
    hl: [4, 7],
    ex: { 2: "0 on the diagonal, Infinity where there is no direct edge yet.", 4: "k is the outermost loop: after round k, paths may stop over at nodes 0…k.", 7: "Is going through k better than the best i → j so far?", 12: "3 → 0 → 1 → 2 costs 6; 1 → 2 → 3 → 0 costs 5." }
  },
  examples: [
    { lvl: "Easy", title: "Who can reach whom (transitive closure)", prob: "For a directed graph, answer 'can i reach j?' for every pair.", idea: "Same triple loop with booleans: i reaches j if i reaches k and k reaches j.", c: `function reachable(n, edges) {
  const r = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j));
  for (const [u, v] of edges) r[u][v] = true;
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) if (r[i][k] && r[k][j]) r[i][j] = true;
  return r;
}
const r = reachable(4, [[0, 1], [1, 2], [3, 0]]);
console.log(r[0][2], r[3][2], r[2][0]);`, time: "O(V³)", space: "O(V²)", ex: { 6: "Reaching k and then j means reaching j.", 10: "0 → 1 → 2 ✓, 3 → 0 → 1 → 2 ✓, but nothing leaves 2." } },
    { lvl: "Practical", title: "City with the fewest neighbours within a threshold", prob: "Return the city that can reach the fewest other cities within distanceThreshold (ties → the larger index).", idea: "Compute all-pairs distances, then count, for each city, how many others are within the threshold.", c: `function findTheCity(n, edges, threshold) {
  const d = ${INIT};
  for (const [u, v, w] of edges) { d[u][v] = Math.min(d[u][v], w); d[v][u] = Math.min(d[v][u], w); }
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
  let best = -1, fewest = Infinity;
  for (let i = 0; i < n; i++) {
    const count = d[i].filter((x, j) => j !== i && x <= threshold).length;
    if (count <= fewest) { fewest = count; best = i; }
  }
  return best;
}
console.log(findTheCity(4, [[0, 1, 3], [1, 2, 1], [1, 3, 4], [2, 3, 1]], 4));`, time: "O(V³)", space: "O(V²)", ex: { 3: "Undirected roads: set both directions.", 10: "<= lets a later city win ties, as required." } },
    { lvl: "Interview", title: "Evaluate division", prob: "Given a / b = 2 and b / c = 3, answer queries like a / c.", idea: "Store known ratios in a matrix and chain them: if i / k and k / j are known, then i / j = (i / k) · (k / j). It's Floyd-Warshall with multiplication.", c: `function calcEquation(equations, values, queries) {
  const id = new Map();
  for (const [a, b] of equations) for (const x of [a, b]) if (!id.has(x)) id.set(x, id.size);
  const n = id.size;
  const r = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  equations.forEach(([a, b], i) => { r[id.get(a)][id.get(b)] = values[i]; r[id.get(b)][id.get(a)] = 1 / values[i]; });
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) if (!r[i][j] && r[i][k] && r[k][j]) r[i][j] = r[i][k] * r[k][j];
  return queries.map(([a, b]) => (id.has(a) && id.has(b) && r[id.get(a)][id.get(b)]) || -1);
}
console.log(calcEquation([["a", "b"], ["b", "c"]], [2, 3], [["a", "c"], ["b", "a"], ["a", "e"], ["a", "a"], ["x", "x"]]));`, time: "O(V³ + Q)", space: "O(V²)", ex: { 5: "0 means 'unknown'; every variable divided by itself is 1.", 9: "Fill an unknown ratio by chaining two known ones." } }
  ],
  signals: [["\"between every pair\", \"all pairs\"", "Floyd-Warshall"], ["small n (≤ ~400) and many distance queries", "Precompute with Floyd-Warshall"], ["\"can i reach j\" for all pairs", "Boolean Floyd-Warshall"], ["ratios / relations that chain through a middle item", "Floyd-Warshall with × or AND"]],
  mistakes: [["Putting the k loop inside", "k must be the outermost loop, or paths through later nodes are missed."], ["Forgetting 0 on the diagonal", "d[i][i] must start at 0 (or 1 for ratios)."], ["Using it on large graphs", "O(V³) explodes; use Dijkstra from each source on sparse graphs."], ["Overwriting with duplicate edges", "Keep the minimum: d[u][v] = Math.min(d[u][v], w)."]],
  js: ["Array.from with a nested Array.from builds an independent n × n matrix.", "Infinity + x is Infinity, so missing edges never create fake paths."],
  iq: { Beginner: ["Distances between every pair of cities on a small map"], Easy: ["Which nodes can reach which (transitive closure)"], Medium: ["evaluate-division", "network-delay-time"], Hard: ["Find the city with the fewest neighbours within a distance threshold"] },
  rev: { s30: "All-pairs shortest paths with a triple loop: for k, i, j: d[i][j] = min(d[i][j], d[i][k] + d[k][j]). O(V³), k outermost, works with negative edges.", m2: ["0 diagonal, ∞ for missing edges", "k loop outermost", "O(V³) time, O(V²) space", "Booleans → reachability", "d[i][i] < 0 ⇒ negative cycle"] },
  cheat: `FLOYD-WARSHALL CHEAT SHEET

d[i][j] = 0 if i==j, w if edge, ∞ otherwise
for k: for i: for j:
  d[i][j] = min(d[i][j], d[i][k] + d[k][j])

O(V³) time, O(V²) space
k outermost!
Negative cycle: d[i][i] < 0`
};

export default floydWarshall;
