import type { ProblemDef } from "@/lib/types";

const HEAP = `class Heap {
  constructor(cmp = (a, b) => a - b) { this.a = []; this.cmp = cmp; }
  get size() { return this.a.length; }
  push(x) { const a = this.a; a.push(x); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (this.cmp(a[i], a[p]) >= 0) break; [a[i], a[p]] = [a[p], a[i]]; i = p; } }
  pop() { const a = this.a, top = a[0], last = a.pop(); if (a.length) { a[0] = last; let i = 0; while (true) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && this.cmp(a[l], a[m]) < 0) m = l; if (r < a.length && this.cmp(a[r], a[m]) < 0) m = r; if (m === i) break; [a[i], a[m]] = [a[m], a[i]]; i = m; } } return top; }
}
`;
const DSU = `class DSU {
  constructor(n) { this.p = Array.from({ length: n }, (_, i) => i); this.r = new Array(n).fill(0); }
  find(x) { while (this.p[x] !== x) { this.p[x] = this.p[this.p[x]]; x = this.p[x]; } return x; }
  union(a, b) { a = this.find(a); b = this.find(b); if (a === b) return false; if (this.r[a] < this.r[b]) [a, b] = [b, a]; this.p[b] = a; if (this.r[a] === this.r[b]) this.r[a]++; return true; }
}
`;

/** Graphs: grids, BFS/DFS, topological sort, union-find, shortest paths, MST. */
export const GRAPHS: ProblemDef[] = [
  {
    id: "flood-fill", t: "Flood Fill", d: "E", tp: ["dfs", "bfs", "graph"], pt: ["dfs", "graph-traversal"], co: ["Amazon", "Microsoft", "Uber"], lc: "flood-fill",
    s: "Recolor the connected region (4-directional, same original color) that contains (sr, sc).", h: ["DFS from the start cell.", "If the new color equals the old one, return immediately (avoids infinite loops)."],
    a: "DFS recoloring cells of the original color.", tc: "O(cells)", sc: "O(cells)", sim: ["number-of-islands", "max-area-island", "surrounded-regions"],
    fn: "floodFill", params: "image:number[][], sr:number, sc:number, color:number", ret: "number[][]",
    ex: [[[[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2, [[2, 2, 2], [2, 2, 0], [2, 0, 1]]], [[[0, 0, 0], [0, 0, 0]], 0, 0, 0, [[0, 0, 0], [0, 0, 0]]]], hid: [[[[0, 0, 0], [0, 1, 1]], 1, 1, 1], [[[1]], 0, 0, 5]],
    code: `function floodFill(image, sr, sc, color) {
  const old = image[sr][sc];
  if (old === color) return image;
  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= image.length || c >= image[0].length || image[r][c] !== old) return;
    image[r][c] = color;
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  };
  dfs(sr, sc);
  return image;
}`
  },
  {
    id: "max-area-island", t: "Max Area of Island", d: "M", tp: ["dfs", "bfs", "graph", "union-find"], pt: ["dfs", "graph-traversal"], co: ["Amazon", "Google", "Meta", "DoorDash"], lc: "max-area-of-island",
    s: "Return the largest island area (4-directionally connected 1s), or 0.", h: ["Like Number of Islands, but DFS returns the size.", "Sink visited cells to avoid recounting."],
    a: "DFS returning area.", tc: "O(cells)", sc: "O(cells)", sim: ["number-of-islands", "island-perimeter", "flood-fill"],
    fn: "maxAreaOfIsland", params: "grid:number[][]", ret: "number",
    ex: [[[[0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]], 6], [[[0, 0, 0, 0, 0, 0, 0, 0]], 0]], hid: [[[[1]]], [[[1, 1], [1, 0]]]],
    code: `function maxAreaOfIsland(grid) {
  const R = grid.length, C = grid[0].length;
  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] !== 1) return 0;
    grid[r][c] = 0;
    return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);
  };
  let best = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) best = Math.max(best, dfs(r, c));
  return best;
}`
  },
  {
    id: "island-perimeter", t: "Island Perimeter", d: "E", tp: ["graph", "arrays", "dfs"], pt: ["graph-traversal"], co: ["Google", "Meta", "Amazon"], lc: "island-perimeter",
    s: "The grid has exactly one island. Return its perimeter.", h: ["Each land cell adds 4.", "Each shared edge between two land cells removes 2."],
    a: "Count cells and shared edges.", tc: "O(cells)", sc: "O(1)", sim: ["max-area-island", "number-of-islands"],
    fn: "islandPerimeter", params: "grid:number[][]", ret: "number",
    ex: [[[[0, 1, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [1, 1, 0, 0]], 16], [[[1]], 4], [[[1, 0]], 4]], hid: [[[[1, 1], [1, 1]]], [[[0, 1], [0, 1]]]],
    code: `function islandPerimeter(grid) {
  let p = 0;
  for (let r = 0; r < grid.length; r++) for (let c = 0; c < grid[0].length; c++) {
    if (!grid[r][c]) continue;
    p += 4;
    if (r > 0 && grid[r - 1][c]) p -= 2;
    if (c > 0 && grid[r][c - 1]) p -= 2;
  }
  return p;
}`
  },
  {
    id: "surrounded-regions", t: "Surrounded Regions", d: "M", tp: ["dfs", "bfs", "graph", "union-find"], pt: ["dfs", "graph-traversal"], co: ["Google", "Amazon", "Uber"], lc: "surrounded-regions",
    s: "Flip every 'O' region that is fully surrounded by 'X' (not touching the border) to 'X', in place.", h: ["It's easier to find the regions that survive.", "DFS from every border 'O', mark them safe; flip the rest."],
    a: "Border-first DFS marking, then a final sweep.", tc: "O(cells)", sc: "O(cells)", sim: ["number-of-enclaves", "pacific-atlantic", "number-of-islands"],
    fn: "solve", params: "board:character[][]", ret: "void", inplace: 0, note: "Modify board in place.",
    ex: [[[["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"], ["X", "O", "X", "X"]], [["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "O", "X", "X"]]], [[["X"]], [["X"]]]], hid: [[[["O", "O"], ["O", "O"]]], [[["X", "O", "X"], ["O", "X", "O"], ["X", "O", "X"]]], [[["X", "X", "X"], ["X", "O", "X"], ["X", "X", "X"]]]],
    code: `function solve(board) {
  const R = board.length, C = board[0].length;
  const mark = (r, c) => {
    if (r < 0 || c < 0 || r >= R || c >= C || board[r][c] !== "O") return;
    board[r][c] = "S";
    mark(r + 1, c); mark(r - 1, c); mark(r, c + 1); mark(r, c - 1);
  };
  for (let r = 0; r < R; r++) { mark(r, 0); mark(r, C - 1); }
  for (let c = 0; c < C; c++) { mark(0, c); mark(R - 1, c); }
  for (const row of board) for (let c = 0; c < C; c++) row[c] = row[c] === "S" ? "O" : "X";
}`
  },
  {
    id: "number-of-enclaves", t: "Number of Enclaves", d: "M", tp: ["dfs", "bfs", "graph"], pt: ["dfs", "graph-traversal"], co: ["Google", "Amazon"], lc: "number-of-enclaves",
    s: "Count land cells from which you can't walk off the grid boundary.", h: ["Remove every land cell connected to the border.", "Count the land that's left."],
    a: "Border DFS sinking, then count.", tc: "O(cells)", sc: "O(cells)", sim: ["surrounded-regions", "number-of-islands"],
    fn: "numEnclaves", params: "grid:number[][]", ret: "number",
    ex: [[[[0, 0, 0, 0], [1, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], 3], [[[0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]], 0]], hid: [[[[1]]], [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]]],
    code: `function numEnclaves(grid) {
  const R = grid.length, C = grid[0].length;
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] !== 1) return;
    grid[r][c] = 0;
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  for (let r = 0; r < R; r++) { sink(r, 0); sink(r, C - 1); }
  for (let c = 0; c < C; c++) { sink(0, c); sink(R - 1, c); }
  return grid.flat().filter(x => x === 1).length;
}`
  },
  {
    id: "pacific-atlantic", t: "Pacific Atlantic Water Flow", d: "M", tp: ["dfs", "bfs", "graph"], pt: ["dfs", "graph-traversal"], co: ["Google", "Amazon", "Meta"], lc: "pacific-atlantic-water-flow",
    s: "Water flows to neighbours with height ≤ current. Return cells that can reach both the Pacific (top/left) and Atlantic (bottom/right), in any order.", h: ["Search backwards from each ocean: climb to neighbours with height ≥ current.", "Answer = cells reached by both searches."],
    a: "Two reverse DFS passes, intersect.", tc: "O(cells)", sc: "O(cells)", sim: ["surrounded-regions", "number-of-islands"],
    fn: "pacificAtlantic", params: "heights:number[][]", ret: "number[][]", cmp: "unordered",
    ex: [[[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]], [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]], [[[1]], [[0, 0]]]], hid: [[[[1, 1], [1, 1]]], [[[3, 3, 3], [3, 1, 3], [0, 2, 4]]]],
    code: `function pacificAtlantic(heights) {
  const R = heights.length, C = heights[0].length;
  const pac = Array.from({ length: R }, () => new Array(C).fill(false));
  const atl = Array.from({ length: R }, () => new Array(C).fill(false));
  const dfs = (r, c, seen, prev) => {
    if (r < 0 || c < 0 || r >= R || c >= C || seen[r][c] || heights[r][c] < prev) return;
    seen[r][c] = true;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) dfs(r + dr, c + dc, seen, heights[r][c]);
  };
  for (let r = 0; r < R; r++) { dfs(r, 0, pac, -Infinity); dfs(r, C - 1, atl, -Infinity); }
  for (let c = 0; c < C; c++) { dfs(0, c, pac, -Infinity); dfs(R - 1, c, atl, -Infinity); }
  const res = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (pac[r][c] && atl[r][c]) res.push([r, c]);
  return res;
}`
  },
  {
    id: "course-schedule", t: "Course Schedule", d: "M", tp: ["topo-sort", "graph", "bfs", "dfs"], pt: ["graph-traversal", "bfs"], co: ["Amazon", "Meta", "Google", "Microsoft", "Uber"], lc: "course-schedule",
    s: "prerequisites[i] = [a, b] means take b before a. Can you finish all numCourses courses?", h: ["It's possible exactly when the graph has no cycle.", "Kahn's algorithm: repeatedly take courses with no remaining prerequisites."],
    a: "Topological sort with indegrees (BFS).", tc: "O(V + E)", sc: "O(V + E)", sim: ["course-schedule-ii", "alien-dictionary", "graph-valid-tree"],
    fn: "canFinish", params: "numCourses:number, prerequisites:number[][]", ret: "boolean",
    ex: [[2, [[1, 0]], true], [2, [[1, 0], [0, 1]], false]], hid: [[1, []], [3, [[1, 0], [2, 1], [0, 2]]], [5, [[1, 4], [2, 4], [3, 1], [3, 2]]]],
    code: `function canFinish(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []), indeg = new Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) { adj[b].push(a); indeg[a]++; }
  const q = [];
  indeg.forEach((d, i) => { if (!d) q.push(i); });
  let done = 0;
  for (let h = 0; h < q.length; h++) {
    done++;
    for (const nx of adj[q[h]]) if (--indeg[nx] === 0) q.push(nx);
  }
  return done === numCourses;
}`
  },
  {
    id: "course-schedule-ii", t: "Course Schedule II", d: "M", tp: ["topo-sort", "graph", "bfs", "dfs"], pt: ["graph-traversal", "bfs"], co: ["Amazon", "Meta", "Google", "Microsoft", "Airbnb"], lc: "course-schedule-ii",
    s: "Return any valid order to take all courses, or [] if impossible.", h: ["Kahn's algorithm produces an order as it goes.", "If the order has fewer than numCourses entries, there was a cycle."],
    a: "Topological sort (BFS).", tc: "O(V + E)", sc: "O(V + E)", sim: ["course-schedule", "alien-dictionary", "minimum-height-trees"],
    fn: "findOrder", params: "numCourses:number, prerequisites:number[][]", ret: "number[]",
    check: `(args, out, exp) => { const [n, pre] = args; if (!Array.isArray(out)) return false; if (!exp.length) return out.length === 0; if (out.length !== n || new Set(out).size !== n) return false; const pos = new Map(out.map((v, i) => [v, i])); for (let i = 0; i < n; i++) if (!pos.has(i)) return false; return pre.every(([a, b]) => pos.get(b) < pos.get(a)); }`,
    ex: [[2, [[1, 0]], [0, 1]], [4, [[1, 0], [2, 0], [3, 1], [3, 2]], [0, 1, 2, 3]], [1, [], [0]]], hid: [[2, [[0, 1], [1, 0]]], [3, [[0, 1], [0, 2], [1, 2]]], [6, [[5, 4], [4, 3], [3, 2], [2, 1], [1, 0]]]],
    code: `function findOrder(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []), indeg = new Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) { adj[b].push(a); indeg[a]++; }
  const q = [];
  indeg.forEach((d, i) => { if (!d) q.push(i); });
  for (let h = 0; h < q.length; h++) for (const nx of adj[q[h]]) if (--indeg[nx] === 0) q.push(nx);
  return q.length === numCourses ? q : [];
}`
  },
  {
    id: "alien-dictionary", t: "Alien Dictionary", d: "H", tp: ["topo-sort", "graph", "strings", "bfs"], pt: ["graph-traversal", "bfs"], co: ["Meta", "Airbnb", "Google", "Amazon", "Uber"], lc: "alien-dictionary",
    s: "words are sorted in an unknown alphabet. Return any letter order consistent with them, or \"\" if impossible.", h: ["Compare adjacent words: the first differing letters give an edge a → b.", "A longer word before its own prefix is invalid. Then topologically sort all letters."],
    a: "Build edges from adjacent pairs, Kahn's algorithm over letters.", tc: "O(total chars)", sc: "O(1) (26 letters)", sim: ["course-schedule-ii", "course-schedule"],
    fn: "alienOrder", params: "words:string[]", ret: "string",
    check: `(args, out, exp) => { if (exp === "") return out === ""; if (typeof out !== "string") return false; const words = args[0], letters = new Set(words.join("")); if (out.length !== letters.size || new Set(out).size !== out.length || [...letters].some(c => !out.includes(c))) return false; const pos = {}; [...out].forEach((c, i) => pos[c] = i); for (let i = 0; i + 1 < words.length; i++) { const a = words[i], b = words[i + 1]; for (let j = 0; j < Math.min(a.length, b.length); j++) if (a[j] !== b[j]) { if (pos[a[j]] > pos[b[j]]) return false; break; } } return true; }`,
    ex: [[["wrt", "wrf", "er", "ett", "rftt"], "wertf"], [["z", "x"], "zx"], [["z", "x", "z"], ""]], hid: [[["abc", "ab"]], [["z", "z"]], [["ac", "ab", "zc", "zb"]]],
    code: `function alienOrder(words) {
  const adj = new Map(), indeg = new Map();
  for (const w of words) for (const c of w) { adj.set(c, adj.get(c) || new Set()); indeg.set(c, indeg.get(c) || 0); }
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i], b = words[i + 1];
    if (a.length > b.length && a.startsWith(b)) return "";
    for (let j = 0; j < Math.min(a.length, b.length); j++) {
      if (a[j] !== b[j]) {
        if (!adj.get(a[j]).has(b[j])) { adj.get(a[j]).add(b[j]); indeg.set(b[j], indeg.get(b[j]) + 1); }
        break;
      }
    }
  }
  const q = [...indeg.keys()].filter(c => indeg.get(c) === 0);
  for (let h = 0; h < q.length; h++) for (const nx of adj.get(q[h])) { indeg.set(nx, indeg.get(nx) - 1); if (!indeg.get(nx)) q.push(nx); }
  return q.length === indeg.size ? q.join("") : "";
}`
  },
  {
    id: "number-connected-components", t: "Number of Connected Components in an Undirected Graph", d: "M", tp: ["union-find", "graph", "dfs"], pt: ["union-find", "graph-traversal"], co: ["Amazon", "LinkedIn", "Meta"], lc: "number-of-connected-components-in-an-undirected-graph",
    s: "Count connected components among n nodes given undirected edges.", h: ["Start with n components.", "Each union that merges two different sets reduces the count by one."],
    a: "Union-Find.", tc: "O(E · α(n))", sc: "O(n)", sim: ["number-of-provinces", "graph-valid-tree", "number-of-islands"],
    fn: "countComponents", params: "n:number, edges:number[][]", ret: "number",
    ex: [[5, [[0, 1], [1, 2], [3, 4]], 2], [5, [[0, 1], [1, 2], [2, 3], [3, 4]], 1]], hid: [[1, []], [4, []], [4, [[0, 1], [2, 3], [1, 2]]]],
    code: DSU + `function countComponents(n, edges) {
  const d = new DSU(n);
  let count = n;
  for (const [a, b] of edges) if (d.union(a, b)) count--;
  return count;
}`
  },
  {
    id: "number-of-provinces", t: "Number of Provinces", d: "M", tp: ["union-find", "dfs", "graph"], pt: ["union-find", "dfs"], co: ["Amazon", "Goldman Sachs", "Two Sigma"], lc: "number-of-provinces",
    s: "isConnected is an n×n adjacency matrix. Return the number of connected groups (provinces).", h: ["Each unvisited city starts a new DFS.", "Or union every connected pair and count roots."],
    a: "DFS over the adjacency matrix.", tc: "O(n²)", sc: "O(n)", sim: ["number-connected-components", "number-of-islands"],
    fn: "findCircleNum", params: "isConnected:number[][]", ret: "number",
    ex: [[[[1, 1, 0], [1, 1, 0], [0, 0, 1]], 2], [[[1, 0, 0], [0, 1, 0], [0, 0, 1]], 3]], hid: [[[[1]]], [[[1, 0, 0, 1], [0, 1, 1, 0], [0, 1, 1, 1], [1, 0, 1, 1]]]],
    code: `function findCircleNum(isConnected) {
  const n = isConnected.length, seen = new Array(n).fill(false);
  const dfs = i => { seen[i] = true; for (let j = 0; j < n; j++) if (isConnected[i][j] && !seen[j]) dfs(j); };
  let count = 0;
  for (let i = 0; i < n; i++) if (!seen[i]) { count++; dfs(i); }
  return count;
}`
  },
  {
    id: "graph-valid-tree", t: "Graph Valid Tree", d: "M", tp: ["union-find", "graph", "dfs", "bfs"], pt: ["union-find", "graph-traversal"], co: ["Google", "Meta", "LinkedIn", "Zenefits"], lc: "graph-valid-tree",
    s: "Do the n nodes and undirected edges form a valid tree?", h: ["A tree has exactly n - 1 edges.", "…and no cycle: union-find must never see an edge inside one set."],
    a: "Edge count check + Union-Find cycle detection.", tc: "O(E · α(n))", sc: "O(n)", sim: ["redundant-connection", "number-connected-components", "course-schedule"],
    fn: "validTree", params: "n:number, edges:number[][]", ret: "boolean",
    ex: [[5, [[0, 1], [0, 2], [0, 3], [1, 4]], true], [5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]], false]], hid: [[1, []], [2, []], [4, [[0, 1], [2, 3]]]],
    code: DSU + `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const d = new DSU(n);
  for (const [a, b] of edges) if (!d.union(a, b)) return false;
  return true;
}`
  },
  {
    id: "redundant-connection", t: "Redundant Connection", d: "M", tp: ["union-find", "graph", "dfs"], pt: ["union-find"], co: ["Google", "Amazon", "Uber"], lc: "redundant-connection",
    s: "A tree of n nodes (1-indexed) had one extra edge added. Return the last edge in the input that can be removed to restore a tree.", h: ["Process edges in order.", "The first edge whose endpoints are already connected creates the cycle."],
    a: "Union-Find, return the edge that fails to union.", tc: "O(n · α(n))", sc: "O(n)", sim: ["graph-valid-tree", "number-connected-components"],
    fn: "findRedundantConnection", params: "edges:number[][]", ret: "number[]",
    ex: [[[[1, 2], [1, 3], [2, 3]], [2, 3]], [[[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]], [1, 4]]], hid: [[[[1, 2], [2, 3], [1, 3]]], [[[3, 4], [1, 2], [2, 4], [3, 5], [2, 5]]]],
    code: DSU + `function findRedundantConnection(edges) {
  const d = new DSU(edges.length + 1);
  for (const e of edges) if (!d.union(e[0], e[1])) return e;
  return [];
}`
  },
  {
    id: "satisfiability-equations", t: "Satisfiability of Equality Equations", d: "M", tp: ["union-find", "graph", "strings"], pt: ["union-find"], co: ["Google", "Amazon"], lc: "satisfiability-of-equality-equations",
    s: "Equations look like \"a==b\" or \"a!=b\" (single letters). Can all be satisfied at once?", h: ["First union every '==' pair.", "Then every '!=' pair must be in different sets."],
    a: "Two passes with Union-Find over 26 letters.", tc: "O(n)", sc: "O(1)", sim: ["evaluate-division", "number-connected-components"],
    fn: "equationsPossible", params: "equations:string[]", ret: "boolean",
    ex: [[["a==b", "b!=a"], false], [["b==a", "a==b"], true], [["a==b", "b==c", "a==c"], true]], hid: [[["a!=a"]], [["a==b", "b!=c", "c==a"]], [["c==c", "b==d", "x!=z"]]],
    code: DSU + `function equationsPossible(equations) {
  const d = new DSU(26), id = c => c.charCodeAt(0) - 97;
  for (const e of equations) if (e[1] === "=") d.union(id(e[0]), id(e[3]));
  for (const e of equations) if (e[1] === "!" && d.find(id(e[0])) === d.find(id(e[3]))) return false;
  return true;
}`
  },
  {
    id: "most-stones-removed", t: "Most Stones Removed with Same Row or Column", d: "M", tp: ["union-find", "graph", "dfs"], pt: ["union-find"], co: ["Google", "Amazon"], lc: "most-stones-removed-with-same-row-or-column",
    s: "A stone can be removed if another stone shares its row or column. Return the most stones you can remove.", h: ["Stones sharing a row or column form a component.", "Each component can be reduced to one stone: answer = stones - components."],
    a: "Union rows with columns (offset column ids).", tc: "O(n · α)", sc: "O(n)", sim: ["number-connected-components", "number-of-provinces"],
    fn: "removeStones", params: "stones:number[][]", ret: "number",
    ex: [[[[0, 0], [0, 1], [1, 0], [1, 2], [2, 1], [2, 2]], 5], [[[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]], 3], [[[0, 0]], 0]], hid: [[[[0, 1], [1, 0]]], [[[0, 0], [0, 1], [1, 1]]]],
    code: `function removeStones(stones) {
  const parent = new Map();
  const find = x => { if (!parent.has(x)) parent.set(x, x); while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
  for (const [r, c] of stones) parent.set(find(r), find(~c));
  const roots = new Set();
  for (const [r] of stones) roots.add(find(r));
  return stones.length - roots.size;
}`
  },
  {
    id: "word-ladder", t: "Word Ladder", d: "H", tp: ["bfs", "graph", "hashing", "strings"], pt: ["bfs", "graph-traversal"], co: ["Amazon", "Meta", "Google", "Microsoft", "LinkedIn"], lc: "word-ladder",
    s: "Transform beginWord to endWord changing one letter at a time, every intermediate word in wordList. Return the number of words in the shortest sequence, or 0.", h: ["Words are nodes; one-letter differences are edges.", "BFS from beginWord; generate neighbours by trying all 26 letters per position."],
    a: "BFS with a Set of unvisited words.", tc: "O(N · L · 26)", sc: "O(N)", sim: ["open-the-lock", "shortest-path-binary-matrix"],
    fn: "ladderLength", params: "beginWord:string, endWord:string, wordList:string[]", ret: "number",
    ex: [["hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"], 5], ["hit", "cog", ["hot", "dot", "dog", "lot", "log"], 0]], hid: [["a", "c", ["a", "b", "c"]], ["hot", "dog", ["hot", "dog"]], ["red", "tax", ["ted", "tex", "red", "tax", "tad", "den", "rex", "pee"]]],
    code: `function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  let q = [beginWord], steps = 1;
  words.delete(beginWord);
  while (q.length) {
    const next = [];
    for (const w of q) {
      if (w === endWord) return steps;
      for (let i = 0; i < w.length; i++) for (let c = 97; c <= 122; c++) {
        const nw = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1);
        if (words.has(nw)) { words.delete(nw); next.push(nw); }
      }
    }
    q = next; steps++;
  }
  return 0;
}`
  },
  {
    id: "open-the-lock", t: "Open the Lock", d: "M", tp: ["bfs", "graph", "hashing", "strings"], pt: ["bfs"], co: ["Google", "Amazon"], lc: "open-the-lock",
    s: "A 4-wheel lock starts at \"0000\". Each move turns one wheel by one (wrapping). Avoid deadends. Return the minimum moves to reach target, or -1.", h: ["States are 4-digit strings; each has 8 neighbours.", "BFS from \"0000\", treating deadends as visited."],
    a: "BFS over lock states.", tc: "O(10⁴ · 8)", sc: "O(10⁴)", sim: ["word-ladder", "perfect-squares"],
    fn: "openLock", params: "deadends:string[], target:string", ret: "number",
    ex: [[["0201", "0101", "0102", "1212", "2002"], "0202", 6], [["8888"], "0009", 1], [["8887", "8889", "8878", "8898", "8788", "8988", "7888", "9888"], "8888", -1]], hid: [[["0000"], "8888"], [[], "0000"], [[], "5555"]],
    code: `function openLock(deadends, target) {
  const seen = new Set(deadends);
  if (seen.has("0000")) return -1;
  let q = ["0000"], steps = 0;
  seen.add("0000");
  while (q.length) {
    const next = [];
    for (const s of q) {
      if (s === target) return steps;
      for (let i = 0; i < 4; i++) for (const d of [1, 9]) {
        const ns = s.slice(0, i) + ((Number(s[i]) + d) % 10) + s.slice(i + 1);
        if (!seen.has(ns)) { seen.add(ns); next.push(ns); }
      }
    }
    q = next; steps++;
  }
  return -1;
}`
  },
  {
    id: "shortest-path-binary-matrix", t: "Shortest Path in Binary Matrix", d: "M", tp: ["bfs", "graph", "arrays"], pt: ["bfs"], co: ["Meta", "Amazon", "Google"], lc: "shortest-path-in-binary-matrix",
    s: "Return the length (cells) of the shortest clear path (0s, 8-directional) from top-left to bottom-right, or -1.", h: ["Unweighted shortest path → BFS.", "Eight neighbour directions; mark cells when enqueued."],
    a: "BFS from (0, 0).", tc: "O(n²)", sc: "O(n²)", sim: ["rotting-oranges", "zero-one-matrix", "path-min-effort"],
    fn: "shortestPathBinaryMatrix", params: "grid:number[][]", ret: "number",
    ex: [[[[0, 1], [1, 0]], 2], [[[0, 0, 0], [1, 1, 0], [1, 1, 0]], 4], [[[1, 0, 0], [1, 1, 0], [1, 1, 0]], -1]], hid: [[[[0]]], [[[0, 0, 0], [0, 1, 0], [0, 0, 1]]]],
    code: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] || grid[n - 1][n - 1]) return -1;
  const q = [[0, 0, 1]];
  grid[0][0] = 1;
  for (let h = 0; h < q.length; h++) {
    const [r, c, d] = q[h];
    if (r === n - 1 && c === n - 1) return d;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < n && nc < n && !grid[nr][nc]) { grid[nr][nc] = 1; q.push([nr, nc, d + 1]); }
    }
  }
  return -1;
}`
  },
  {
    id: "zero-one-matrix", t: "01 Matrix", d: "M", tp: ["bfs", "dp", "graph"], pt: ["bfs"], co: ["Google", "Amazon", "Uber"], lc: "01-matrix",
    s: "Return the distance of each cell to the nearest 0.", h: ["Many sources: start BFS from every 0 at once.", "Or two DP passes (top-left then bottom-right)."],
    a: "Multi-source BFS.", tc: "O(cells)", sc: "O(cells)", sim: ["rotting-oranges", "as-far-from-land", "walls-and-gates"],
    fn: "updateMatrix", params: "mat:number[][]", ret: "number[][]",
    ex: [[[[0, 0, 0], [0, 1, 0], [0, 0, 0]], [[0, 0, 0], [0, 1, 0], [0, 0, 0]]], [[[0, 0, 0], [0, 1, 0], [1, 1, 1]], [[0, 0, 0], [0, 1, 0], [1, 2, 1]]]], hid: [[[[0]]], [[[1, 1, 1], [1, 1, 1], [1, 1, 0]]]],
    code: `function updateMatrix(mat) {
  const R = mat.length, C = mat[0].length, dist = mat.map(row => row.map(() => -1)), q = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (mat[r][c] === 0) { dist[r][c] = 0; q.push([r, c]); }
  for (let h = 0; h < q.length; h++) {
    const [r, c] = q[h];
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < R && nc < C && dist[nr][nc] < 0) { dist[nr][nc] = dist[r][c] + 1; q.push([nr, nc]); }
    }
  }
  return dist;
}`
  },
  {
    id: "as-far-from-land", t: "As Far from Land as Possible", d: "M", tp: ["bfs", "graph", "dp"], pt: ["bfs"], co: ["Amazon", "Google"], lc: "as-far-from-land-as-possible",
    s: "Return the maximum Manhattan distance from a water cell to its nearest land, or -1 if there is no land or no water.", h: ["Multi-source BFS from all land cells.", "The last BFS level reached is the answer."],
    a: "Multi-source BFS, count levels.", tc: "O(n²)", sc: "O(n²)", sim: ["zero-one-matrix", "rotting-oranges"],
    fn: "maxDistance", params: "grid:number[][]", ret: "number",
    ex: [[[[1, 0, 1], [0, 0, 0], [1, 0, 1]], 2], [[[1, 0, 0], [0, 0, 0], [0, 0, 0]], 4]], hid: [[[[1, 1], [1, 1]]], [[[0, 0], [0, 0]]], [[[0, 1], [0, 0]]]],
    code: `function maxDistance(grid) {
  const n = grid.length;
  let q = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (grid[r][c]) q.push([r, c]);
  if (!q.length || q.length === n * n) return -1;
  let d = -1;
  while (q.length) {
    const next = [];
    for (const [r, c] of q) for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < n && nc < n && !grid[nr][nc]) { grid[nr][nc] = 1; next.push([nr, nc]); }
    }
    q = next; d++;
  }
  return d;
}`
  },
  {
    id: "network-delay-time", t: "Network Delay Time", d: "M", tp: ["dijkstra", "graph", "heap"], pt: ["graph-traversal", "top-k"], co: ["Google", "Amazon", "Meta"], lc: "network-delay-time",
    s: "times[i] = [u, v, w] is a directed edge. A signal starts at k. Return how long until all n nodes receive it, or -1.", h: ["Shortest paths from one source with positive weights → Dijkstra.", "The answer is the largest shortest distance."],
    a: "Dijkstra with a min-heap.", tc: "O(E log V)", sc: "O(V + E)", sim: ["cheapest-flights-k-stops", "path-min-effort", "swim-rising-water"],
    fn: "networkDelayTime", params: "times:number[][], n:number, k:number", ret: "number",
    ex: [[[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2, 2], [[[1, 2, 1]], 2, 1, 1], [[[1, 2, 1]], 2, 2, -1]], hid: [[[[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1], [[[1, 2, 1], [2, 1, 3]], 2, 2]],
    code: HEAP + `function networkDelayTime(times, n, k) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);
  const dist = new Array(n + 1).fill(Infinity);
  const h = new Heap((a, b) => a[0] - b[0]);
  dist[k] = 0; h.push([0, k]);
  while (h.size) {
    const [d, u] = h.pop();
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) if (d + w < dist[v]) { dist[v] = d + w; h.push([dist[v], v]); }
  }
  const best = Math.max(...dist.slice(1));
  return best === Infinity ? -1 : best;
}`
  },
  {
    id: "cheapest-flights-k-stops", t: "Cheapest Flights Within K Stops", d: "M", tp: ["bellman-ford", "graph", "dp", "bfs"], pt: ["graph-traversal", "dp"], co: ["Amazon", "Airbnb", "Google", "Meta"], lc: "cheapest-flights-within-k-stops",
    s: "Return the cheapest price from src to dst with at most k stops, or -1.", h: ["At most k stops = at most k + 1 edges.", "Bellman-Ford for k + 1 rounds, relaxing from a copy of last round's prices."],
    a: "Bounded Bellman-Ford.", tc: "O(k · E)", sc: "O(n)", sim: ["network-delay-time", "path-min-effort"],
    fn: "findCheapestPrice", params: "n:number, flights:number[][], src:number, dst:number, k:number", ret: "number",
    ex: [[4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], 0, 3, 1, 700], [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1, 200], [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0, 500]], hid: [[3, [[0, 1, 2], [1, 2, 1], [2, 0, 10]], 1, 2, 1], [4, [[0, 1, 1], [0, 2, 5], [1, 2, 1], [2, 3, 1]], 0, 3, 1], [2, [[0, 1, 5]], 1, 0, 3]],
    code: `function findCheapestPrice(n, flights, src, dst, k) {
  let dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let i = 0; i <= k; i++) {
    const next = dist.slice();
    for (const [u, v, w] of flights) if (dist[u] + w < next[v]) next[v] = dist[u] + w;
    dist = next;
  }
  return dist[dst] === Infinity ? -1 : dist[dst];
}`
  },
  {
    id: "path-min-effort", t: "Path With Minimum Effort", d: "M", tp: ["dijkstra", "binary-search", "graph", "heap"], pt: ["graph-traversal", "binary-search"], co: ["Google", "Amazon"], lc: "path-with-minimum-effort",
    s: "Effort of a path = the maximum height difference between consecutive cells. Return the minimum effort from top-left to bottom-right.", h: ["Dijkstra where a path's cost is its max edge, not its sum.", "Or binary search the effort and BFS with that limit."],
    a: "Dijkstra minimising the maximum edge.", tc: "O(cells log cells)", sc: "O(cells)", sim: ["swim-rising-water", "network-delay-time"],
    fn: "minimumEffortPath", params: "heights:number[][]", ret: "number",
    ex: [[[[1, 2, 2], [3, 8, 2], [5, 3, 5]], 2], [[[1, 2, 3], [3, 8, 4], [5, 3, 5]], 1], [[[1, 2, 1, 1, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 1, 1, 2, 1]], 0]], hid: [[[[3]]], [[[1, 10, 6, 7, 9, 10, 4, 9]]]],
    code: HEAP + `function minimumEffortPath(heights) {
  const R = heights.length, C = heights[0].length;
  const eff = heights.map(r => r.map(() => Infinity));
  const h = new Heap((a, b) => a[0] - b[0]);
  eff[0][0] = 0; h.push([0, 0, 0]);
  while (h.size) {
    const [e, r, c] = h.pop();
    if (r === R - 1 && c === C - 1) return e;
    if (e > eff[r][c]) continue;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
      const ne = Math.max(e, Math.abs(heights[nr][nc] - heights[r][c]));
      if (ne < eff[nr][nc]) { eff[nr][nc] = ne; h.push([ne, nr, nc]); }
    }
  }
  return 0;
}`
  },
  {
    id: "swim-rising-water", t: "Swim in Rising Water", d: "H", tp: ["dijkstra", "heap", "union-find", "binary-search"], pt: ["graph-traversal", "top-k"], co: ["Google", "Amazon"], lc: "swim-in-rising-water",
    s: "At time t you can swim through cells with elevation ≤ t. Return the least time to reach the bottom-right from the top-left.", h: ["It's the path minimising the maximum cell value.", "Dijkstra / min-heap flood from (0, 0)."],
    a: "Min-heap expansion by elevation.", tc: "O(n² log n)", sc: "O(n²)", sim: ["path-min-effort", "network-delay-time"],
    fn: "swimInWater", params: "grid:number[][]", ret: "number",
    ex: [[[[0, 2], [1, 3]], 3], [[[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]], 16]], hid: [[[[0]]], [[[3, 2], [0, 1]]]],
    code: HEAP + `function swimInWater(grid) {
  const n = grid.length, seen = grid.map(r => r.map(() => false));
  const h = new Heap((a, b) => a[0] - b[0]);
  h.push([grid[0][0], 0, 0]); seen[0][0] = true;
  let t = 0;
  while (h.size) {
    const [v, r, c] = h.pop();
    t = Math.max(t, v);
    if (r === n - 1 && c === n - 1) return t;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < n && nc < n && !seen[nr][nc]) { seen[nr][nc] = true; h.push([grid[nr][nc], nr, nc]); }
    }
  }
  return t;
}`
  },
  {
    id: "min-cost-connect-points", t: "Min Cost to Connect All Points", d: "M", tp: ["mst", "graph", "union-find", "heap"], pt: ["union-find", "greedy"], co: ["Amazon", "Google", "Microsoft"], lc: "min-cost-to-connect-all-points",
    s: "Connecting two points costs their Manhattan distance. Return the minimum cost to connect all points.", h: ["That's a minimum spanning tree on a complete graph.", "Prim's algorithm in O(n²) is ideal for dense graphs."],
    a: "Prim's with an array of best distances.", tc: "O(n²)", sc: "O(n)", sim: ["number-connected-components", "redundant-connection"],
    fn: "minCostConnectPoints", params: "points:number[][]", ret: "number",
    ex: [[[[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]], 20], [[[3, 12], [-2, 5], [-4, 1]], 18]], hid: [[[[0, 0]]], [[[0, 0], [1, 1], [1, 0], [-1, 1]]], [[[-1000000, -1000000], [1000000, 1000000]]]],
    code: `function minCostConnectPoints(points) {
  const n = points.length, best = new Array(n).fill(Infinity), used = new Array(n).fill(false);
  best[0] = 0;
  let total = 0;
  for (let k = 0; k < n; k++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!used[i] && (u < 0 || best[i] < best[u])) u = i;
    used[u] = true; total += best[u];
    for (let v = 0; v < n; v++) {
      if (used[v]) continue;
      const d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
      if (d < best[v]) best[v] = d;
    }
  }
  return total;
}`
  },
  {
    id: "evaluate-division", t: "Evaluate Division", d: "M", tp: ["graph", "dfs", "union-find", "bfs"], pt: ["graph-traversal", "union-find"], co: ["Google", "Amazon", "Uber", "Bloomberg"], lc: "evaluate-division",
    s: "equations[i] = [a, b] with values[i] = a / b. Answer each query c / d, or -1.0 if it can't be determined.", h: ["Variables are nodes; a / b = k gives edges a→b (k) and b→a (1/k).", "Answer a query by multiplying weights along any path."],
    a: "Weighted graph + DFS per query.", tc: "O(Q · (V + E))", sc: "O(V + E)", sim: ["satisfiability-equations", "course-schedule"],
    fn: "calcEquation", params: "equations:string[][], values:double[], queries:string[][]", ret: "double[]", cmp: "float",
    ex: [[[["a", "b"], ["b", "c"]], [2.0, 3.0], [["a", "c"], ["b", "a"], ["a", "e"], ["a", "a"], ["x", "x"]], [6.0, 0.5, -1.0, 1.0, -1.0]], [[["a", "b"], ["b", "c"], ["bc", "cd"]], [1.5, 2.5, 5.0], [["a", "c"], ["c", "b"], ["bc", "cd"], ["cd", "bc"]], [3.75, 0.4, 5.0, 0.2]]], hid: [[[["a", "b"]], [0.5], [["a", "b"], ["b", "a"], ["a", "c"], ["x", "y"]]]],
    code: `function calcEquation(equations, values, queries) {
  const g = new Map();
  const add = (a, b, w) => { if (!g.has(a)) g.set(a, []); g.get(a).push([b, w]); };
  equations.forEach(([a, b], i) => { add(a, b, values[i]); add(b, a, 1 / values[i]); });
  const dfs = (cur, target, acc, seen) => {
    if (cur === target) return acc;
    seen.add(cur);
    for (const [nx, w] of g.get(cur) || []) if (!seen.has(nx)) { const r = dfs(nx, target, acc * w, seen); if (r !== -1) return r; }
    return -1;
  };
  return queries.map(([c, d]) => (!g.has(c) || !g.has(d) ? -1 : dfs(c, d, 1, new Set())));
}`
  },
  {
    id: "find-town-judge", t: "Find the Town Judge", d: "E", tp: ["graph", "arrays"], pt: ["graph-traversal"], co: ["Amazon", "Apple"], lc: "find-the-town-judge",
    s: "The judge trusts nobody and is trusted by everyone else. trust[i] = [a, b] means a trusts b. Return the judge's label or -1.", h: ["Think in-degree minus out-degree.", "The judge has score n - 1."],
    a: "Degree counting.", tc: "O(n + trust)", sc: "O(n)", sim: ["course-schedule", "keys-and-rooms"],
    fn: "findJudge", params: "n:number, trust:number[][]", ret: "number",
    ex: [[2, [[1, 2]], 2], [3, [[1, 3], [2, 3]], 3], [3, [[1, 3], [2, 3], [3, 1]], -1]], hid: [[1, []], [4, [[1, 3], [1, 4], [2, 3], [2, 4], [4, 3]]], [3, [[1, 2], [2, 3]]]],
    code: `function findJudge(n, trust) {
  const score = new Array(n + 1).fill(0);
  for (const [a, b] of trust) { score[a]--; score[b]++; }
  for (let i = 1; i <= n; i++) if (score[i] === n - 1) return i;
  return -1;
}`
  },
  {
    id: "is-graph-bipartite", t: "Is Graph Bipartite?", d: "M", tp: ["graph", "bfs", "dfs", "union-find"], pt: ["bfs", "graph-traversal"], co: ["Meta", "Amazon", "Google"], lc: "is-graph-bipartite",
    s: "graph[i] lists neighbours of node i. Can the nodes be split into two sets with every edge crossing between them?", h: ["Try to 2-color the graph.", "BFS each component; a neighbour with the same color means not bipartite."],
    a: "BFS 2-coloring.", tc: "O(V + E)", sc: "O(V)", sim: ["possible-bipartition", "course-schedule"],
    fn: "isBipartite", params: "graph:number[][]", ret: "boolean",
    ex: [[[[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]], false], [[[1, 3], [0, 2], [1, 3], [0, 2]], true]], hid: [[[[]]], [[[1], [0], [3], [2]]], [[[1, 2], [0, 2], [0, 1]]]],
    code: `function isBipartite(graph) {
  const color = new Array(graph.length).fill(-1);
  for (let s = 0; s < graph.length; s++) {
    if (color[s] >= 0) continue;
    color[s] = 0;
    const q = [s];
    for (let h = 0; h < q.length; h++) {
      const u = q[h];
      for (const v of graph[u]) {
        if (color[v] < 0) { color[v] = 1 - color[u]; q.push(v); }
        else if (color[v] === color[u]) return false;
      }
    }
  }
  return true;
}`
  },
  {
    id: "possible-bipartition", t: "Possible Bipartition", d: "M", tp: ["graph", "bfs", "dfs", "union-find"], pt: ["bfs", "union-find"], co: ["Google", "Amazon"], lc: "possible-bipartition",
    s: "n people; dislikes[i] = [a, b] can't be in the same group. Can everyone be split into two groups?", h: ["Build the dislike graph (1-indexed).", "Check it's bipartite with 2-coloring."],
    a: "BFS 2-coloring on the dislike graph.", tc: "O(n + E)", sc: "O(n + E)", sim: ["is-graph-bipartite"],
    fn: "possibleBipartition", params: "n:number, dislikes:number[][]", ret: "boolean",
    ex: [[4, [[1, 2], [1, 3], [2, 4]], true], [3, [[1, 2], [1, 3], [2, 3]], false]], hid: [[1, []], [5, [[1, 2], [2, 3], [3, 4], [4, 5], [1, 5]]], [10, [[1, 2], [3, 4], [5, 6], [6, 7], [8, 9], [7, 8]]]],
    code: `function possibleBipartition(n, dislikes) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [a, b] of dislikes) { adj[a].push(b); adj[b].push(a); }
  const color = new Array(n + 1).fill(-1);
  for (let s = 1; s <= n; s++) {
    if (color[s] >= 0) continue;
    color[s] = 0;
    const q = [s];
    for (let h = 0; h < q.length; h++) for (const v of adj[q[h]]) {
      if (color[v] < 0) { color[v] = 1 - color[q[h]]; q.push(v); }
      else if (color[v] === color[q[h]]) return false;
    }
  }
  return true;
}`
  },
  {
    id: "keys-and-rooms", t: "Keys and Rooms", d: "M", tp: ["graph", "dfs", "bfs"], pt: ["dfs", "graph-traversal"], co: ["Amazon", "Google"], lc: "keys-and-rooms",
    s: "Room 0 is unlocked; rooms[i] lists keys found in room i. Can you visit every room?", h: ["Rooms are nodes, keys are edges.", "DFS from room 0 and check everything was reached."],
    a: "DFS reachability.", tc: "O(V + E)", sc: "O(V)", sim: ["find-town-judge", "number-of-provinces"],
    fn: "canVisitAllRooms", params: "rooms:number[][]", ret: "boolean",
    ex: [[[[1], [2], [3], []], true], [[[1, 3], [3, 0, 1], [2], [0]], false]], hid: [[[[]]], [[[1], [], [0]]]],
    code: `function canVisitAllRooms(rooms) {
  const seen = new Set([0]), st = [0];
  while (st.length) for (const k of rooms[st.pop()]) if (!seen.has(k)) { seen.add(k); st.push(k); }
  return seen.size === rooms.length;
}`
  },
  {
    id: "all-paths-source-target", t: "All Paths From Source to Target", d: "M", tp: ["graph", "backtracking", "dfs"], pt: ["backtracking", "dfs"], co: ["Amazon", "Google", "Bloomberg"], lc: "all-paths-from-source-to-target",
    s: "In a DAG with nodes 0..n-1, return every path from 0 to n-1 (any order).", h: ["DFS from 0 with a path array.", "It's a DAG, so no visited set is needed."],
    a: "Backtracking DFS.", tc: "O(2ⁿ · n)", sc: "O(n)", sim: ["path-sum-ii", "course-schedule-ii"],
    fn: "allPathsSourceTarget", params: "graph:number[][]", ret: "number[][]", cmp: "outer",
    ex: [[[[1, 2], [3], [3], []], [[0, 1, 3], [0, 2, 3]]], [[[4, 3, 1], [3, 2, 4], [3], [4], []], [[0, 4], [0, 3, 4], [0, 1, 3, 4], [0, 1, 2, 3, 4], [0, 1, 4]]]], hid: [[[[1], []]], [[[1, 2, 3], [2], [3], []]]],
    code: `function allPathsSourceTarget(graph) {
  const res = [], path = [0], target = graph.length - 1;
  const dfs = u => {
    if (u === target) { res.push([...path]); return; }
    for (const v of graph[u]) { path.push(v); dfs(v); path.pop(); }
  };
  dfs(0);
  return res;
}`
  },
  {
    id: "longest-increasing-path-matrix", t: "Longest Increasing Path in a Matrix", d: "H", tp: ["dfs", "dp", "graph", "topo-sort"], pt: ["dfs", "dp"], co: ["Google", "Amazon", "Meta", "Microsoft"], lc: "longest-increasing-path-in-a-matrix",
    s: "Return the length of the longest strictly increasing path (4-directional).", h: ["Strictly increasing edges can't form cycles: it's a DAG.", "DFS with memo: longest path starting at each cell."],
    a: "Memoized DFS.", tc: "O(cells)", sc: "O(cells)", sim: ["longest-increasing-subsequence", "pacific-atlantic"],
    fn: "longestIncreasingPath", params: "matrix:number[][]", ret: "number",
    ex: [[[[9, 9, 4], [6, 6, 8], [2, 1, 1]], 4], [[[3, 4, 5], [3, 2, 6], [2, 2, 1]], 4], [[[1]], 1]], hid: [[[[1, 2]]], [[[7, 8, 9], [9, 7, 6], [7, 2, 3]]]],
    code: `function longestIncreasingPath(matrix) {
  const R = matrix.length, C = matrix[0].length, memo = matrix.map(r => r.map(() => 0));
  const dfs = (r, c) => {
    if (memo[r][c]) return memo[r][c];
    let best = 1;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < R && nc < C && matrix[nr][nc] > matrix[r][c]) best = Math.max(best, 1 + dfs(nr, nc));
    }
    return (memo[r][c] = best);
  };
  let best = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) best = Math.max(best, dfs(r, c));
  return best;
}`
  },
  {
    id: "minimum-height-trees", t: "Minimum Height Trees", d: "M", tp: ["graph", "topo-sort", "bfs"], pt: ["bfs", "graph-traversal"], co: ["Google", "Amazon", "Meta"], lc: "minimum-height-trees",
    s: "Given a tree, return all roots that give minimum height (any order).", h: ["The best roots are in the 'center' of the longest path.", "Peel leaves layer by layer until at most 2 nodes remain."],
    a: "Leaf-trimming BFS (topological style).", tc: "O(n)", sc: "O(n)", sim: ["course-schedule-ii", "graph-valid-tree"],
    fn: "findMinHeightTrees", params: "n:number, edges:number[][]", ret: "number[]", cmp: "unordered",
    ex: [[4, [[1, 0], [1, 2], [1, 3]], [1]], [6, [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]], [3, 4]]], hid: [[1, []], [2, [[0, 1]]], [7, [[0, 1], [1, 2], [1, 3], [2, 4], [3, 5], [4, 6]]]],
    code: `function findMinHeightTrees(n, edges) {
  if (n === 1) return [0];
  const adj = Array.from({ length: n }, () => new Set());
  for (const [a, b] of edges) { adj[a].add(b); adj[b].add(a); }
  let leaves = [];
  for (let i = 0; i < n; i++) if (adj[i].size === 1) leaves.push(i);
  let remaining = n;
  while (remaining > 2) {
    remaining -= leaves.length;
    const next = [];
    for (const l of leaves) for (const nb of adj[l]) { adj[nb].delete(l); if (adj[nb].size === 1) next.push(nb); }
    leaves = next;
  }
  return leaves;
}`
  },
  {
    id: "reconstruct-itinerary", t: "Reconstruct Itinerary", d: "H", tp: ["graph", "dfs", "sorting"], pt: ["dfs", "graph-traversal"], co: ["Google", "Meta", "Uber", "Amazon"], lc: "reconstruct-itinerary",
    s: "Use every ticket once, starting from \"JFK\"; if several itineraries exist, return the lexicographically smallest.", h: ["It's an Eulerian path.", "Hierholzer: DFS taking the smallest destination first, append airports on the way back, then reverse."],
    a: "Sorted adjacency + post-order DFS.", tc: "O(E log E)", sc: "O(E)", sim: ["course-schedule-ii", "all-paths-source-target"],
    fn: "findItinerary", params: "tickets:string[][]", ret: "string[]",
    ex: [[[["MUC", "LHR"], ["JFK", "MUC"], ["SFO", "SJC"], ["LHR", "SFO"]], ["JFK", "MUC", "LHR", "SFO", "SJC"]], [[["JFK", "SFO"], ["JFK", "ATL"], ["SFO", "ATL"], ["ATL", "JFK"], ["ATL", "SFO"]], ["JFK", "ATL", "JFK", "SFO", "ATL", "SFO"]]], hid: [[[["JFK", "KUL"], ["JFK", "NRT"], ["NRT", "JFK"]]], [[["JFK", "A"]]]],
    code: `function findItinerary(tickets) {
  const g = new Map();
  for (const [a, b] of [...tickets].sort((x, y) => (x[1] < y[1] ? 1 : -1))) { if (!g.has(a)) g.set(a, []); g.get(a).push(b); }
  const route = [];
  const dfs = a => { const list = g.get(a) || []; while (list.length) dfs(list.pop()); route.push(a); };
  dfs("JFK");
  return route.reverse();
}`
  },
  {
    id: "critical-connections", t: "Critical Connections in a Network", d: "H", tp: ["graph", "dfs"], pt: ["dfs", "graph-traversal"], co: ["Amazon", "Google", "Meta"], lc: "critical-connections-in-a-network",
    s: "Return every bridge: an edge whose removal disconnects the network (any order).", h: ["Tarjan's algorithm: discovery times and low-links.", "Edge (u, v) is a bridge if low[v] > disc[u]."],
    a: "Single DFS computing low-link values.", tc: "O(V + E)", sc: "O(V + E)", sim: ["redundant-connection", "number-connected-components"],
    fn: "criticalConnections", params: "n:number, connections:number[][]", ret: "number[][]", cmp: "groups",
    ex: [[4, [[0, 1], [1, 2], [2, 0], [1, 3]], [[1, 3]]], [2, [[0, 1]], [[0, 1]]]], hid: [[5, [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4]]], [6, [[0, 1], [1, 2], [2, 0], [1, 3], [3, 4], [4, 5], [5, 3]]]],
    code: `function criticalConnections(n, connections) {
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of connections) { adj[a].push(b); adj[b].push(a); }
  const disc = new Array(n).fill(-1), low = new Array(n).fill(0), res = [];
  let t = 0;
  const dfs = (u, parent) => {
    disc[u] = low[u] = t++;
    for (const v of adj[u]) {
      if (v === parent) continue;
      if (disc[v] < 0) { dfs(v, u); low[u] = Math.min(low[u], low[v]); if (low[v] > disc[u]) res.push([u, v]); }
      else low[u] = Math.min(low[u], disc[v]);
    }
  };
  dfs(0, -1);
  return res;
}`
  },
  {
    id: "walls-and-gates", t: "Walls and Gates", d: "M", tp: ["bfs", "graph", "arrays"], pt: ["bfs"], co: ["Meta", "Google", "Amazon"], lc: "walls-and-gates",
    s: "-1 is a wall, 0 a gate, 2147483647 an empty room. Fill each room with the distance to its nearest gate, in place.", h: ["Many sources → start BFS from every gate at once.", "Only overwrite rooms that are still 2147483647."],
    a: "Multi-source BFS.", tc: "O(cells)", sc: "O(cells)", sim: ["zero-one-matrix", "rotting-oranges"],
    fn: "wallsAndGates", params: "rooms:number[][]", ret: "void", inplace: 0, note: "Modify rooms in place.",
    ex: [[[[2147483647, -1, 0, 2147483647], [2147483647, 2147483647, 2147483647, -1], [2147483647, -1, 2147483647, -1], [0, -1, 2147483647, 2147483647]], [[3, -1, 0, 1], [2, 2, 1, -1], [1, -1, 2, -1], [0, -1, 3, 4]]], [[[-1]], [[-1]]]], hid: [[[[2147483647]]], [[[0, 2147483647, 2147483647, 0]]]],
    code: `function wallsAndGates(rooms) {
  const R = rooms.length, C = rooms[0].length, q = [], INF = 2147483647;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (rooms[r][c] === 0) q.push([r, c]);
  for (let h = 0; h < q.length; h++) {
    const [r, c] = q[h];
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < R && nc < C && rooms[nr][nc] === INF) { rooms[nr][nc] = rooms[r][c] + 1; q.push([nr, nc]); }
    }
  }
}`
  }
];
