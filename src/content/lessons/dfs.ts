import type { Lesson } from "@/lib/types";

const dfs: Lesson = {
  what: "Depth-first search (DFS) follows one path as far as it can go, then backs up and tries the next branch. It's naturally written with recursion, or with an explicit stack.",
  analogy: { short: "Exploring a maze", text: "Walk down a corridor until you hit a dead end, then back up to the last junction and try the next corridor. You fully explore one branch before trying another. That is DFS." },
  eli5: "Exploring a cave: you go as deep as you can down one tunnel. When it ends, you come back and take the next tunnel you passed.",
  tech: "DFS visits every reachable node once: O(V + E) time and O(V) space for the visited set plus the recursion stack. In trees, preorder, inorder and postorder are DFS orders. In graphs, mark nodes visited when you enter them so cycles don't loop forever. DFS is used for connected components, flood fill, cycle detection (in a directed graph, reaching a node that is still on the current path means a cycle), topological order (reverse postorder), path finding and backtracking. Very deep recursion can overflow JavaScript's call stack, so extremely deep inputs may need an explicit stack.",
  why: "Many problems are about exploring everything reachable, not about shortest paths: islands, regions, components, cycles, all paths, tree properties. DFS is short to write and uses memory proportional to the depth rather than the width.",
  how: ["Mark the current node visited.", "Do whatever work the problem needs (count it, record it, compare it).", "Recurse into each unvisited neighbour.", "Combine the results on the way back (postorder) if the answer depends on the children.", "Loop over all nodes as starts to cover disconnected graphs."],
  props: ["Goes deep before wide", "Recursion or an explicit stack", "O(V + E) time", "Memory grows with the depth"],
  use: ["Connected components, islands, flood fill", "Cycle detection", "Topological sort (postorder)", "All paths / backtracking", "Tree heights, sums and validations"],
  avoid: ["Shortest path in steps (use BFS)", "Very deep graphs in JS without an explicit stack"],
  viz: "recursion",
  cx: [["DFS on a graph", "O(V + E)", "Each node entered once, each edge checked once."], ["DFS on a tree", "O(n)", "Each node once."], ["Space", "O(h) to O(V)", "The recursion depth plus the visited set."]],
  space: "O(V) visited + O(depth) recursion.",
  code: {
    c: `const graph = { A: ["B", "C"], B: ["D"], C: ["D", "E"], D: [], E: ["A"] };
function dfs(node, seen = new Set(), order = []) {
  if (seen.has(node)) return order;
  seen.add(node);
  order.push(node);
  for (const next of graph[node]) dfs(next, seen, order);
  return order;
}
function dfsIterative(start) {
  const seen = new Set(), order = [], stack = [start];
  while (stack.length) {
    const node = stack.pop();
    if (seen.has(node)) continue;
    seen.add(node);
    order.push(node);
    for (const next of [...graph[node]].reverse()) stack.push(next);
  }
  return order;
}
console.log(dfs("A"));
console.log(dfsIterative("A"));`,
    hl: [6, 16],
    ex: { 3: "E points back to A: without this check we would loop forever.", 6: "Go deep into each neighbour before trying the next one.", 12: "An explicit stack replaces the call stack.", 16: "Push in reverse so the first neighbour is popped first, matching the recursive order." }
  },
  examples: [
    { lvl: "Easy", title: "Maximum depth of a tree", prob: "Return the number of nodes on the longest root-to-leaf path.", idea: "Postorder DFS: get the depth of both subtrees, then add one for the current node.", c: `function T(v, l = null, r = null) { return { val: v, left: l, right: r }; }
function maxDepth(node) {
  if (!node) return 0;
  return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
}
console.log(maxDepth(T(3, T(9), T(20, T(15), T(7)))));
console.log(maxDepth(null));`, time: "O(n)", space: "O(h)", ex: { 3: "The base case: an empty tree has depth 0.", 4: "The answer for a node is built from its children's answers." } },
    { lvl: "Practical", title: "Largest island", prob: "Return the size of the largest group of connected 1s in a grid.", idea: "DFS from each land cell returns the size of its island, sinking cells so they are counted once.", c: `function maxAreaOfIsland(grid) {
  const area = (r, c) => {
    if (!grid[r] || grid[r][c] !== 1) return 0;
    grid[r][c] = 0;
    return 1 + area(r + 1, c) + area(r - 1, c) + area(r, c + 1) + area(r, c - 1);
  };
  let best = 0;
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++) best = Math.max(best, area(r, c));
  return best;
}
console.log(maxAreaOfIsland([[1, 1, 0, 0], [1, 0, 0, 1], [0, 0, 1, 1], [0, 0, 1, 1]]));`, time: "O(rows × cols)", space: "O(rows × cols) recursion worst case", ex: { 3: "Off the grid, water, or already counted: contributes 0.", 5: "This cell plus whatever its four neighbours reach." } },
    { lvl: "Interview", title: "Detect a cycle in a directed graph", prob: "Does a directed graph contain a cycle?", idea: "Three states: 0 = unvisited, 1 = on the current path, 2 = finished. Reaching a node in state 1 means we came back around: a cycle.", c: `function hasCycle(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adj[u].push(v);
  const state = new Array(n).fill(0);
  const visit = u => {
    state[u] = 1;
    for (const v of adj[u]) {
      if (state[v] === 1) return true;
      if (state[v] === 0 && visit(v)) return true;
    }
    state[u] = 2;
    return false;
  };
  for (let u = 0; u < n; u++) if (state[u] === 0 && visit(u)) return true;
  return false;
}
console.log(hasCycle(4, [[0, 1], [1, 2], [2, 3]]));
console.log(hasCycle(4, [[0, 1], [1, 2], [2, 0], [2, 3]]));`, time: "O(V + E)", space: "O(V)", ex: { 6: "u is now on the current path.", 8: "Back to a node on the current path: that's a cycle.", 11: "Fully explored and cycle-free: never needs checking again." } }
  ],
  signals: [["\"islands\", \"regions\", \"connected\"", "DFS flood fill"], ["\"all paths\", \"every combination\"", "DFS / backtracking"], ["tree height, sum, validate, compare", "Recursive DFS"], ["\"cycle\" in a directed graph", "DFS with three states"], ["\"order with dependencies\"", "DFS postorder (topological sort)"]],
  mistakes: [["Using DFS for 'shortest path'", "DFS finds a path, not the shortest one. Use BFS for unweighted graphs."], ["Using a single visited set to detect directed cycles", "A node finished earlier isn't a cycle; you need 'on the current path' vs 'finished'."], ["Forgetting the base case", "Return immediately on null / out of bounds / visited."], ["Stack overflow on deep inputs", "For very deep graphs, switch to an explicit stack."]],
  js: ["Arrow functions capturing grid and seen keep recursive helpers short.", "JS engines allow roughly 10,000 nested calls; deeper inputs need an explicit stack."],
  iq: { Beginner: ["Print every node of a tree in preorder"], Easy: ["max-depth", "flood-fill", "path-sum", "island-perimeter"], Medium: ["number-of-islands", "max-area-island", "surrounded-regions", "course-schedule", "all-paths-source-target", "keys-and-rooms"], Hard: ["longest-increasing-path-matrix", "critical-connections"] },
  rev: { s30: "DFS goes deep along one path, then backtracks. Recursion (or a stack) + visited set, O(V + E). Use it for components, flood fill, cycles, all paths and tree recursion.", m2: ["Mark visited on entry", "Base case: null / out of bounds / visited", "Postorder combines children's answers", "Directed cycle: three states", "Shortest path → BFS, not DFS"] },
  cheat: `DFS CHEAT SHEET

visit(u):
  if seen(u) return
  seen.add(u)
  for v of adj[u]: visit(v)

Grid: sink(r,c) → check bounds & cell → mark → 4 calls
Directed cycle: state 0 new / 1 on path / 2 done
Time O(V + E)

Think DFS when:
→ islands / regions / components
→ all paths / combinations
→ tree recursion
→ cycle detection, topological order`
};

export default dfs;
