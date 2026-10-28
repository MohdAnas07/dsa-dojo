import type { Lesson } from "@/lib/types";
import { HEAP } from "./_shared";

const mst: Lesson = {
  what: "A minimum spanning tree (MST) connects every node of a weighted, undirected graph using exactly V − 1 edges, with no cycles, and with the smallest possible total weight.",
  analogy: { short: "Laying cable between towns", text: "You must connect every town to the network, and cable costs money per kilometre. You don't need a direct cable between every pair, just enough cables that everything is connected, as cheaply as possible. That cheapest set of cables is an MST." },
  eli5: "You want to connect all the dots with lines, using as little string as possible, without any loops.",
  tech: "Kruskal's algorithm sorts the edges by weight and adds each edge that connects two different components (checked with Union-Find): O(E log E). Prim's algorithm grows one tree from a start node, always adding the cheapest edge leaving the tree (a min-heap): O(E log V), or O(V²) with arrays for dense graphs. Both rely on the cut property: the cheapest edge crossing any split of the nodes belongs to some MST. If the graph is disconnected, there is no spanning tree (a spanning forest instead).",
  why: "Connecting everything at minimum cost is a classic: networks, roads, wiring, clustering. In interviews it appears as 'minimum cost to connect all points/cities', and it's a great showcase for Union-Find and heaps.",
  how: ["Kruskal: sort all edges by weight.", "Kruskal: go through them; add an edge if its two ends are in different components (union succeeds), otherwise skip it.", "Prim: start from any node; push its edges into a min-heap.", "Prim: pop the cheapest edge leading to a node not yet in the tree; add that node and push its edges.", "Stop after V − 1 edges (or when every node is in the tree)."],
  props: ["Exactly V − 1 edges", "No cycles", "Minimum total weight", "Not necessarily unique (equal weights)", "Only for undirected, connected graphs"],
  use: ["Minimum cost to connect points, cities or computers", "Network design", "Clustering (remove the most expensive MST edges)", "Approximations for harder problems (traveling salesman)"],
  avoid: ["Shortest path between two specific nodes (that's Dijkstra; an MST path isn't necessarily shortest)", "Directed graphs"],
  viz: "array",
  cx: [["Kruskal", "O(E log E)", "Sorting the edges dominates; Union-Find is nearly O(1)."], ["Prim with a heap", "O(E log V)", "Each edge may enter the heap."], ["Prim with arrays", "O(V²)", "Good for dense graphs such as all pairs of points."]],
  space: "O(V + E).",
  code: {
    c: `function kruskal(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = x => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  let total = 0;
  const used = [];
  for (const [w, u, v] of [...edges].sort((a, b) => a[0] - b[0])) {
    const ru = find(u), rv = find(v);
    if (ru === rv) continue;
    parent[ru] = rv;
    total += w;
    used.push([u, v]);
  }
  return [total, used];
}
console.log(kruskal(4, [[1, 0, 1], [3, 0, 2], [2, 1, 2], [4, 1, 3], [5, 2, 3]]));`,
    hl: [6, 8],
    ex: { 3: "A tiny Union-Find with path compression.", 6: "Kruskal: consider edges from cheapest to most expensive.", 8: "Both ends are already connected: this edge would form a cycle.", 9: "Merge the two components." }
  },
  examples: [
    { lvl: "Easy", title: "Connect all cities at minimum cost", prob: "Cities 1…n and possible connections with costs. Return the minimum total cost to connect everything, or −1.", idea: "Kruskal. If fewer than n − 1 edges were added, the graph can't be connected.", c: `function minCostConnect(n, connections) {
  const parent = Array.from({ length: n + 1 }, (_, i) => i);
  const find = x => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  let cost = 0, edges = 0;
  for (const [u, v, w] of [...connections].sort((a, b) => a[2] - b[2])) {
    const a = find(u), b = find(v);
    if (a === b) continue;
    parent[a] = b;
    cost += w;
    edges++;
  }
  return edges === n - 1 ? cost : -1;
}
console.log(minCostConnect(3, [[1, 2, 5], [1, 3, 6], [2, 3, 1]]));
console.log(minCostConnect(4, [[1, 2, 3], [3, 4, 4]]));`, time: "O(E log E)", space: "O(n)", ex: { 12: "A spanning tree needs exactly n − 1 edges; fewer means some city is unreachable." } },
    { lvl: "Practical", title: "Min cost to connect all points (Prim, O(n²))", prob: "Connect points on a plane where a link costs the Manhattan distance.", idea: "Every pair is a possible edge (a dense graph), so array-based Prim is ideal: keep each point's cheapest link to the tree and add the cheapest point each round.", c: `function minCostConnectPoints(points) {
  const n = points.length, dist = new Array(n).fill(Infinity), inTree = new Array(n).fill(false);
  dist[0] = 0;
  let total = 0;
  for (let k = 0; k < n; k++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!inTree[i] && (u === -1 || dist[i] < dist[u])) u = i;
    inTree[u] = true;
    total += dist[u];
    for (let v = 0; v < n; v++) {
      const d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
      if (!inTree[v] && d < dist[v]) dist[v] = d;
    }
  }
  return total;
}
console.log(minCostConnectPoints([[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]));`, time: "O(n²)", space: "O(n)", ex: { 7: "Pick the point with the cheapest link into the tree.", 12: "The new tree member may offer a cheaper link to the others." } },
    { lvl: "Interview", title: "Prim with a min-heap", prob: "Find the MST weight of a sparse graph given as an edge list.", idea: "Grow the tree from node 0. The heap holds candidate edges (weight, node); stale entries for nodes already in the tree are skipped.", c: HEAP + `function primMST(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) { adj[u].push([v, w]); adj[v].push([u, w]); }
  const seen = new Array(n).fill(false), pq = new Heap((x, y) => x[0] < y[0]);
  pq.push([0, 0]);
  let total = 0, count = 0;
  while (pq.size && count < n) {
    const [w, u] = pq.pop();
    if (seen[u]) continue;
    seen[u] = true;
    total += w;
    count++;
    for (const [v, wv] of adj[u]) if (!seen[v]) pq.push([wv, v]);
  }
  return count === n ? total : -1;
}
console.log(primMST(4, [[0, 1, 1], [0, 2, 3], [1, 2, 2], [1, 3, 4], [2, 3, 5]]));`, time: "O(E log V)", space: "O(V + E)", ex: { 14: "Already in the tree: an old, more expensive candidate.", 18: "Every edge leaving the new node becomes a candidate." } }
  ],
  signals: [["\"minimum cost to connect all\"", "MST"], ["\"connect every\" + edge costs, no start/target", "MST (not shortest path)"], ["edge list, sparse graph", "Kruskal + Union-Find"], ["all pairs of points are possible edges", "Prim O(n²)"], ["\"remove the most expensive links to form k clusters\"", "Kruskal, stop early"]],
  mistakes: [["Confusing MST with shortest paths", "An MST minimizes the total network cost, not the distance between two nodes."], ["Forgetting the cycle check in Kruskal", "Use Union-Find: skip edges whose ends are already connected."], ["Not handling disconnected graphs", "Check that V − 1 edges were added (or all nodes reached)."], ["Building all n² edges for points when n is large", "Array-based Prim avoids storing them."]],
  js: ["Sort edges with (a, b) => a.w - b.w; keep the weight in a consistent position.", "Copy before sorting ([...edges]) if the input must not change."],
  iq: { Beginner: ["Connect all houses with the least cable"], Easy: ["Pick V − 1 cheapest edges without forming a cycle (by hand)"], Medium: ["min-cost-connect-points", "redundant-connection"], Hard: ["Find critical and pseudo-critical edges in an MST"] },
  rev: { s30: "Connect all nodes with V − 1 edges at minimum total weight. Kruskal: sort edges, add if Union-Find says different components. Prim: grow from one node with a min-heap.", m2: ["Kruskal O(E log E) + Union-Find", "Prim O(E log V) with heap, O(V²) with arrays", "Skip edges that form cycles", "V − 1 edges, else disconnected", "MST ≠ shortest path tree"] },
  cheat: `MST CHEAT SHEET

Kruskal:
  sort edges by weight
  for (w,u,v): if find(u) != find(v): union, total += w

Prim:
  heap = [(0, start)]
  pop cheapest to an unvisited node, add, push its edges

V − 1 edges, no cycles, min total
Kruskal O(E log E) | Prim O(E log V) / O(V²)`
};

export default mst;
