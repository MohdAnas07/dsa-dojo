import type { Lesson } from "@/lib/types";

const graph: Lesson = {
  what: "A graph is a set of nodes (vertices) connected by edges. Unlike a tree, a graph can have cycles, several paths between two nodes, and parts that aren't connected at all.",
  analogy: { short: "A city map", text: "Intersections are nodes and roads are edges. A one-way street is a directed edge, and a road's length is its weight. Asking 'can I drive from A to B?' or 'what's the shortest route?' is a graph question." },
  eli5: "Dots joined by lines. Think of the kids in a class: each kid is a dot, and a line joins two kids who are friends. Some kids have many lines, some have none.",
  tech: "A graph G = (V, E) has V nodes and E edges, which may be directed or undirected, weighted or unweighted. The usual representation is an adjacency list: for each node, a list of its neighbours, using O(V + E) space. An adjacency matrix uses O(V²) and is only worth it for dense graphs. BFS (a queue, level by level) and DFS (recursion or a stack, deep first) both visit everything in O(V + E). Always keep a visited set: cycles would otherwise loop forever.",
  why: "Networks, maps, dependencies, social links, grids and puzzle states are all graphs. Many interview problems are graph problems in disguise: islands in a grid, course prerequisites, word ladders, flight routes.",
  how: ["Build an adjacency list from the edge list.", "Choose a traversal: BFS for shortest paths when every step costs the same, DFS for exploring, connectivity and cycles.", "Mark a node visited when you queue it (BFS) or enter it (DFS).", "Loop over every node as a possible start to cover disconnected parts.", "Grids: every cell is a node; its neighbours are the 4 (or 8) adjacent cells."],
  props: ["V nodes, E edges", "Directed or undirected", "Weighted or unweighted", "May contain cycles", "May be disconnected", "A tree is a connected graph with V − 1 edges and no cycle"],
  use: ["Networks and maps", "Dependencies and scheduling (topological sort)", "Connected components and islands", "Shortest paths", "State-space search (puzzles, word ladder, locks)"],
  avoid: ["Strict hierarchies where each node has one parent (use a tree)", "Plain sequences (use an array or list)"],
  viz: "queue",
  cx: [["Build an adjacency list", "O(V + E)", "Each edge is added once (twice if undirected)."], ["BFS / DFS", "O(V + E)", "Every node and every edge is processed once."], ["Does edge u–v exist? (list)", "O(deg u)", "Scan u's neighbours (store them in a Set for O(1))."], ["Adjacency matrix space", "O(V²)", "One cell for every pair of nodes."]],
  space: "O(V + E) for the adjacency list, O(V) for visited.",
  code: {
    c: `const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]];
const n = 5;
const adj = Array.from({ length: n }, () => []);
for (const [u, v] of edges) {
  adj[u].push(v);
  adj[v].push(u);
}
function bfs(start) {
  const seen = new Set([start]), order = [], q = [start];
  for (let h = 0; h < q.length; h++) {
    const u = q[h];
    order.push(u);
    for (const v of adj[u]) if (!seen.has(v)) { seen.add(v); q.push(v); }
  }
  return order;
}
function dfs(u, seen = new Set(), order = []) {
  seen.add(u);
  order.push(u);
  for (const v of adj[u]) if (!seen.has(v)) dfs(v, seen, order);
  return order;
}
console.log(bfs(0));
console.log(dfs(0));`,
    hl: [10, 20],
    ex: { 3: "Array.from gives every node its own list (fill([]) would share one array).", 6: "Undirected: add the edge in both directions.", 10: "A moving head index instead of q.shift() keeps BFS O(V + E).", 13: "Mark when queuing, so a node is never queued twice.", 20: "DFS dives into the first unvisited neighbour before trying the others." }
  },
  examples: [
    { lvl: "Easy", title: "Number of islands (DFS on a grid)", prob: "Count groups of connected '1's in a grid (up, down, left, right).", idea: "Each cell is a node. When you find land, count it and flood-fill the whole island so it isn't counted again.", c: `function numIslands(grid) {
  let count = 0;
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] !== "1") return;
    grid[r][c] = "0";
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (grid[r][c] === "1") { count++; sink(r, c); }
  return count;
}
console.log(numIslands([["1", "1", "0", "0"], ["1", "0", "0", "1"], ["0", "0", "1", "1"]]));`, time: "O(rows × cols)", space: "O(rows × cols) recursion in the worst case", ex: { 4: "Out of bounds or water: stop.", 5: "Sinking the cell doubles as marking it visited." } },
    { lvl: "Practical", title: "Connected components", prob: "Given n nodes and undirected edges, count the connected groups.", idea: "Start a DFS from every node that hasn't been visited yet; each start is a new component.", c: `function countComponents(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const seen = new Array(n).fill(false);
  const visit = u => { seen[u] = true; for (const v of adj[u]) if (!seen[v]) visit(v); };
  let count = 0;
  for (let u = 0; u < n; u++) if (!seen[u]) { count++; visit(u); }
  return count;
}
console.log(countComponents(5, [[0, 1], [1, 2], [3, 4]]));
console.log(countComponents(4, []));`, time: "O(V + E)", space: "O(V + E)", ex: { 7: "Every unvisited node starts a new component; visit() marks the whole group." } },
    { lvl: "Interview", title: "Shortest path in an unweighted graph (BFS)", prob: "Return the fewest edges from src to dst, or −1.", idea: "BFS reaches nodes in order of distance, so the first time it reaches a node is along a shortest path.", c: `function shortestPath(n, edges, src, dst) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const dist = new Array(n).fill(-1);
  dist[src] = 0;
  const q = [src];
  for (let h = 0; h < q.length; h++) {
    const u = q[h];
    for (const v of adj[u]) if (dist[v] === -1) { dist[v] = dist[u] + 1; q.push(v); }
  }
  return dist[dst];
}
console.log(shortestPath(6, [[0, 1], [1, 2], [2, 5], [0, 3], [3, 4], [4, 5]], 0, 5));`, time: "O(V + E)", space: "O(V + E)", ex: { 4: "−1 means 'not reached yet', so dist doubles as the visited set.", 9: "A neighbour's distance is one more than the current node's." } }
  ],
  signals: [["grid of cells, \"islands\", \"regions\"", "Graph traversal on a grid (DFS or BFS)"], ["\"prerequisites\", \"dependencies\", \"valid order\"", "Directed graph + topological sort"], ["\"shortest path\" where every step costs the same", "BFS"], ["\"connected\", \"groups\", \"provinces\"", "DFS or Union-Find"], ["weighted edges, \"cheapest route\"", "Dijkstra or Bellman-Ford"]],
  mistakes: [["Forgetting the visited set", "Cycles make the traversal loop forever. Mark nodes as soon as you queue or enter them."], ["Only starting from node 0", "Disconnected graphs need a loop over every node as a possible start."], ["Using q.shift() in BFS", "shift is O(n) in JS. Use a head index."], ["Adding undirected edges in one direction only", "Push both adj[u].push(v) and adj[v].push(u)."]],
  js: ["Array.from({ length: n }, () => []) creates independent neighbour lists; new Array(n).fill([]) shares one array between all nodes.", "Use a Map when node labels are strings."],
  iq: { Beginner: ["Build an adjacency list from an edge list"], Easy: ["find-town-judge", "flood-fill"], Medium: ["number-of-islands", "number-connected-components", "course-schedule", "rotting-oranges", "pacific-atlantic"], Hard: ["word-ladder", "alien-dictionary", "critical-connections"] },
  rev: { s30: "Nodes + edges, possibly with cycles. Store as an adjacency list; traverse with BFS (queue, shortest steps) or DFS (recursion, explore) in O(V + E), always with a visited set.", m2: ["Adjacency list: O(V + E) space", "BFS = queue = shortest path in unweighted graphs", "DFS = recursion = components, cycles, paths", "Mark visited when queuing", "Loop over all nodes for disconnected graphs"] },
  cheat: `GRAPH CHEAT SHEET

adj = Array.from({length:n}, () => [])
for [u,v] of edges: adj[u].push(v); adj[v].push(u)

BFS: q=[s], seen={s}
  for (h=0; h<q.length; h++)
    for v of adj[q[h]]: if !seen → seen, push
DFS: visit(u): seen u; for v: if !seen visit(v)

Time O(V + E)
Grid: neighbours = 4 directions`
};

export default graph;
