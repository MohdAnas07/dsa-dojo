import type { Lesson } from "@/lib/types";

const bfs: Lesson = {
  what: "Breadth-first search (BFS) explores a graph level by level: first the start, then everything one step away, then everything two steps away, and so on. It uses a queue.",
  analogy: { short: "Ripples in a pond", text: "Drop a stone and the ripple reaches nearby points first, then farther ones, in widening rings. BFS spreads through a graph the same way, so it reaches every node by the fewest possible steps." },
  eli5: "Passing on a secret: you tell your friends, then they tell their friends, then those friends tell theirs. BFS keeps track of who hears it in which round.",
  tech: "Put the start in a queue and mark it visited. Repeatedly take the front node and add its unvisited neighbours to the back. Nodes come out in order of distance, so the first time BFS reaches a node is along a shortest path (counting edges). Time O(V + E), space O(V). To work level by level, process the queue one layer at a time. Multi-source BFS starts with several nodes at distance 0 (rotting oranges, nearest gate). In JavaScript, use an array with a head index or a 'next level' array, because shift() is O(n).",
  why: "BFS finds shortest paths when every step costs the same: grids, word ladders, lock combinations, minimum moves in puzzles. It also gives level-order traversal of trees and models anything that spreads step by step.",
  how: ["Queue the start node(s) and mark them visited.", "Take the next node from the queue.", "For each neighbour not yet visited: mark it and add it to the queue.", "Count levels by processing the queue one layer at a time.", "Stop when you reach the goal (that distance is the shortest), or when the queue is empty."],
  props: ["Visits nodes in order of distance", "Shortest path in unweighted graphs", "Uses a queue (FIFO)", "O(V + E) time"],
  use: ["Shortest path on grids and unweighted graphs", "Minimum number of moves / transformations", "Level-order tree traversal", "Spreading processes (fire, infection, rot)", "Nearest X for every cell (multi-source)"],
  avoid: ["Weighted edges (use Dijkstra)", "You need every path or a full search with undo (DFS / backtracking)", "Very wide graphs where memory is tight (DFS uses less)"],
  viz: "queue",
  cx: [["BFS on a graph", "O(V + E)", "Each node is queued once and each edge checked once."], ["BFS on an R × C grid", "O(R · C)", "Each cell has at most 4 neighbours."], ["Space", "O(V)", "The queue and the visited set."]],
  space: "O(V) for the queue and the visited set.",
  code: {
    c: `function shortestSteps(grid, start, goal) {
  const rows = grid.length, cols = grid[0].length;
  const seen = new Set([start.join(",")]);
  let queue = [start], steps = 0;
  while (queue.length) {
    const next = [];
    for (const [r, c] of queue) {
      if (r === goal[0] && c === goal[1]) return steps;
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr, nc = c + dc, key = nr + "," + nc;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || grid[nr][nc] === 1 || seen.has(key)) continue;
        seen.add(key);
        next.push([nr, nc]);
      }
    }
    queue = next;
    steps++;
  }
  return -1;
}
const grid = [
  [0, 0, 0, 0],
  [1, 1, 0, 1],
  [0, 0, 0, 0],
  [0, 1, 1, 0]
];
console.log(shortestSteps(grid, [0, 0], [3, 3]));
console.log(shortestSteps(grid, [0, 0], [3, 0]));`,
    hl: [6, 16],
    ex: { 6: "Everything in `queue` is the same number of steps from the start.", 8: "BFS reaches cells in order of distance, so the first visit to the goal is the shortest.", 11: "Skip walls (1), cells off the grid, and cells already seen.", 12: "Mark when adding, not when taking out, so no cell is queued twice." }
  },
  examples: [
    { lvl: "Easy", title: "Level order traversal of a tree", prob: "Return a tree's values level by level.", idea: "A tree is a graph with no cycles, so BFS needs no visited set. Build each next level from the children of the current one.", c: `function T(v, l = null, r = null) { return { val: v, left: l, right: r }; }
function levelOrder(root) {
  if (!root) return [];
  const out = [];
  let level = [root];
  while (level.length) {
    out.push(level.map(n => n.val));
    level = level.flatMap(n => [n.left, n.right].filter(Boolean));
  }
  return out;
}
console.log(levelOrder(T(3, T(9), T(20, T(15), T(7)))));`, time: "O(n)", space: "O(width)", ex: { 7: "Record the current level.", 8: "The next level is every child of this level, left to right." } },
    { lvl: "Practical", title: "Rotting oranges (multi-source BFS)", prob: "Every minute, rotten oranges rot their fresh neighbours. How many minutes until none are fresh (or −1)?", idea: "Start with every rotten orange in the queue. Each BFS level is one minute.", c: `function orangesRotting(grid) {
  let fresh = 0, q = [];
  grid.forEach((row, r) => row.forEach((v, c) => { if (v === 2) q.push([r, c]); if (v === 1) fresh++; }));
  let minutes = 0;
  while (q.length && fresh) {
    const next = [];
    for (const [r, c] of q)
      for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]])
        if (grid[nr] && grid[nr][nc] === 1) { grid[nr][nc] = 2; fresh--; next.push([nr, nc]); }
    q = next;
    minutes++;
  }
  return fresh ? -1 : minutes;
}
console.log(orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]));
console.log(orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]]));`, time: "O(rows × cols)", space: "O(rows × cols)", ex: { 3: "All rotten oranges start in the queue together: distance 0.", 9: "Rot a fresh neighbour and queue it for the next minute.", 13: "Any fresh orange left was unreachable." } },
    { lvl: "Interview", title: "Word ladder", prob: "Change one letter at a time to get from begin to end using only dictionary words. How many words are in the shortest sequence?", idea: "Each word is a node; words one letter apart are neighbours. BFS gives the fewest steps. Deleting a word from the set when it's queued marks it visited.", c: `function ladderLength(begin, end, wordList) {
  const words = new Set(wordList);
  if (!words.has(end)) return 0;
  let level = [begin], steps = 1;
  while (level.length) {
    const next = [];
    for (const w of level) {
      if (w === end) return steps;
      for (let i = 0; i < w.length; i++)
        for (const ch of "abcdefghijklmnopqrstuvwxyz") {
          const cand = w.slice(0, i) + ch + w.slice(i + 1);
          if (words.has(cand)) { words.delete(cand); next.push(cand); }
        }
    }
    level = next;
    steps++;
  }
  return 0;
}
console.log(ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]));`, time: "O(N · L · 26)", space: "O(N)", ex: { 9: "Try every one-letter change instead of comparing every pair of words.", 12: "Removing the word from the set marks it visited." } }
  ],
  signals: [["\"minimum number of steps / moves / transformations\"", "BFS"], ["shortest path, every step costs the same", "BFS (not DFS)"], ["\"level by level\", \"each minute\", spreading", "BFS by levels"], ["\"nearest\" for every cell, many sources", "Multi-source BFS"], ["weighted edges", "Not BFS: use Dijkstra"]],
  mistakes: [["Marking visited when popping instead of when pushing", "The same node gets queued many times. Mark it as soon as you add it."], ["Using queue.shift()", "shift is O(n) in JS. Use a head index or build a next-level array."], ["Using DFS for a shortest path", "DFS finds a path, not the shortest one."], ["Starting multi-source problems one source at a time", "Put all sources in the queue first; that's one BFS instead of many."]],
  js: ["Level-by-level BFS with a `next` array avoids shift() entirely.", "Grid neighbours: loop over [[1,0],[-1,0],[0,1],[0,-1]].", "Use r + ',' + c strings (or r * cols + c numbers) as keys in a Set."],
  iq: { Beginner: ["Print a tree level by level"], Easy: ["average-of-levels", "min-depth"], Medium: ["level-order", "right-side-view", "rotting-oranges", "zero-one-matrix", "shortest-path-binary-matrix", "open-the-lock"], Hard: ["word-ladder"] },
  rev: { s30: "BFS explores level by level with a queue. The first time it reaches a node is the shortest path in steps. O(V + E).", m2: ["Queue + visited set", "Mark visited when queuing", "Process one level at a time to count steps", "Multi-source: queue all sources first", "Weighted edges → Dijkstra instead"] },
  cheat: `BFS CHEAT SHEET

level = [start]; seen = {start}; steps = 0
while level not empty:
  next = []
  for node in level:
    if node is goal: return steps
    for nb of neighbours(node):
      if !seen: seen.add(nb); next.push(nb)
  level = next; steps++

Time O(V + E)
Shortest path when every step costs 1`
};

export default bfs;
