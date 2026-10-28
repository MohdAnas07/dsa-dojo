import type { Lesson } from "@/lib/types";

const topoSort: Lesson = {
  what: "A topological order lists the nodes of a directed graph so that every edge points from earlier to later: each task comes after everything it depends on. It exists only when the graph has no cycle (a DAG, directed acyclic graph).",
  analogy: { short: "Getting dressed", text: "Socks before shoes, shirt before tie, tie before jacket. Some items have no order between them (a watch can go on any time). Any order that respects every 'before' rule is a valid topological order." },
  eli5: "Ordering chores where some must happen first: you can't ice a cake before you bake it, and you can't bake it before you mix the batter.",
  tech: "Kahn's algorithm (BFS): compute every node's in-degree (the number of incoming edges) and queue all nodes with in-degree 0. Repeatedly remove one, append it to the order, and decrement its neighbours' in-degrees, queueing any that drop to 0. If the final order has fewer than V nodes, the rest are stuck in a cycle. The DFS version adds each node after all of its descendants (postorder) and reverses the list. Both are O(V + E). Several valid orders can exist.",
  why: "Scheduling with prerequisites is everywhere: course plans, build systems, package installs, spreadsheet formulas, task pipelines. Interviews ask both 'is there a valid order?' (cycle detection) and 'give me one'.",
  how: ["Build the adjacency list and count in-degrees (for an edge u → v, v's in-degree goes up).", "Queue every node with in-degree 0: it has no prerequisites.", "Take a node, add it to the order, and lower its neighbours' in-degrees.", "Queue a neighbour as soon as its in-degree reaches 0.", "If the order doesn't contain every node, there is a cycle."],
  props: ["Only defined for DAGs", "Usually not unique", "Edge u → v means u comes before v", "O(V + E)"],
  use: ["Course schedules and prerequisites", "Build and dependency ordering", "Detecting circular dependencies", "Deriving an ordering from comparisons (alien dictionary)", "Longest path in a DAG (process nodes in topological order)"],
  avoid: ["Undirected graphs", "Graphs with cycles (there is no valid order; detect and report it)"],
  viz: "queue",
  cx: [["Count in-degrees", "O(V + E)", "One pass over the edges."], ["Kahn's algorithm", "O(V + E)", "Each node is queued once and each edge decremented once."], ["DFS postorder version", "O(V + E)", "Standard DFS."]],
  space: "O(V + E).",
  code: {
    c: `function topoSort(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [u, v] of edges) { adj[u].push(v); indeg[v]++; }
  const q = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const order = [];
  for (let h = 0; h < q.length; h++) {
    const u = q[h];
    order.push(u);
    for (const v of adj[u]) if (--indeg[v] === 0) q.push(v);
  }
  return order.length === n ? order : null;
}
console.log(topoSort(6, [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]]));
console.log(topoSort(3, [[0, 1], [1, 2], [2, 0]]));`,
    hl: [6, 11],
    ex: { 4: "indeg[v] counts how many tasks must come before v.", 6: "Tasks with no prerequisites can start right away.", 11: "Finishing u removes one prerequisite from each neighbour; queue those with none left.", 13: "If some nodes never reached in-degree 0, they are stuck in a cycle." }
  },
  examples: [
    { lvl: "Easy", title: "Can all courses be finished?", prob: "prerequisites[i] = [a, b] means take b before a. Can you take every course?", idea: "Run Kahn's algorithm and count how many courses get taken. Fewer than all means a cycle.", c: `function canFinish(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indeg = new Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) { adj[b].push(a); indeg[a]++; }
  const q = [];
  indeg.forEach((d, i) => { if (d === 0) q.push(i); });
  let taken = 0;
  for (let h = 0; h < q.length; h++) {
    taken++;
    for (const v of adj[q[h]]) if (--indeg[v] === 0) q.push(v);
  }
  return taken === numCourses;
}
console.log(canFinish(2, [[1, 0]]));
console.log(canFinish(2, [[1, 0], [0, 1]]));`, time: "O(V + E)", space: "O(V + E)", ex: { 4: "b → a: b must come first, so a's in-degree goes up.", 12: "Courses in a cycle never reach in-degree 0." } },
    { lvl: "Practical", title: "Course order with DFS postorder", prob: "Return any valid course order, or [] if impossible.", idea: "A course is added only after every course that depends on it is finished. Reversing that postorder gives a valid order. State 1 (on the current path) catches cycles.", c: `function findOrder(n, prerequisites) {
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of prerequisites) adj[b].push(a);
  const state = new Array(n).fill(0), post = [];
  const visit = u => {
    if (state[u] === 1) return false;
    if (state[u] === 2) return true;
    state[u] = 1;
    for (const v of adj[u]) if (!visit(v)) return false;
    state[u] = 2;
    post.push(u);
    return true;
  };
  for (let u = 0; u < n; u++) if (!visit(u)) return [];
  return post.reverse();
}
console.log(findOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]]));`, time: "O(V + E)", space: "O(V + E)", ex: { 6: "Back on the current path: a cycle, so no valid order.", 11: "All courses after u are placed; now u can be added.", 15: "Reverse postorder puts each course before the ones that need it." } },
    { lvl: "Interview", title: "Alien dictionary", prob: "Words are sorted in an unknown alphabet. Recover a valid letter order.", idea: "The first differing letter of two neighbouring words gives one edge (a → b). Then topologically sort the letters. A longer word before its own prefix is invalid.", c: `function alienOrder(words) {
  const adj = new Map(), indeg = new Map();
  for (const w of words) for (const ch of w) { adj.set(ch, adj.get(ch) || new Set()); indeg.set(ch, indeg.get(ch) || 0); }
  for (let i = 0; i + 1 < words.length; i++) {
    const [a, b] = [words[i], words[i + 1]];
    if (a.length > b.length && a.startsWith(b)) return "";
    for (let j = 0; j < Math.min(a.length, b.length); j++) {
      if (a[j] !== b[j]) {
        if (!adj.get(a[j]).has(b[j])) { adj.get(a[j]).add(b[j]); indeg.set(b[j], indeg.get(b[j]) + 1); }
        break;
      }
    }
  }
  const q = [...indeg.keys()].filter(c => indeg.get(c) === 0), order = [];
  for (let h = 0; h < q.length; h++) {
    order.push(q[h]);
    for (const v of adj.get(q[h])) { indeg.set(v, indeg.get(v) - 1); if (indeg.get(v) === 0) q.push(v); }
  }
  return order.length === indeg.size ? order.join("") : "";
}
console.log(alienOrder(["wrt", "wrf", "er", "ett", "rftt"]));
console.log(alienOrder(["z", "x", "z"]) || "(no valid order)");`, time: "O(total letters)", space: "O(alphabet²)", ex: { 6: "'abc' before 'ab' can't happen in any alphabet.", 8: "Only the first difference tells us anything.", 19: "Letters left out were stuck in a cycle: contradictory input." } }
  ],
  signals: [["\"prerequisites\", \"depends on\", \"must come before\"", "Topological sort"], ["\"is it possible to finish all\"", "Kahn's algorithm + count"], ["\"return an order\"", "Kahn's queue order or reversed DFS postorder"], ["ordering deduced from sorted data", "Build edges from adjacent pairs, then topo sort"], ["circular dependency detection", "Order shorter than V ⇒ cycle"]],
  mistakes: [["Getting the edge direction backwards", "Decide once: prerequisite → course. Then in-degree counts prerequisites."], ["Forgetting nodes with no edges", "Isolated nodes have in-degree 0 and must be in the order too."], ["Not checking for cycles", "Compare the order's length with the number of nodes."], ["Using a plain visited set in the DFS version", "You need three states to tell a cycle from an already-finished node."]],
  js: ["Use a Map of Sets when nodes are letters or strings.", "--indeg[v] === 0 decrements and checks in one step."],
  iq: { Beginner: ["Order tasks given 'A before B' rules"], Easy: ["find-town-judge"], Medium: ["course-schedule", "course-schedule-ii", "minimum-height-trees"], Hard: ["alien-dictionary", "Minimum number of semesters to finish all courses"] },
  rev: { s30: "Order a DAG so every edge goes forward. Kahn: queue in-degree-0 nodes, remove them, decrement neighbours. Fewer than V nodes in the order means a cycle. O(V + E).", m2: ["Edge u → v: u before v", "Start with in-degree 0", "Decrement neighbours, queue at 0", "Order length < V ⇒ cycle", "DFS version: reverse postorder"] },
  cheat: `TOPOLOGICAL SORT CHEAT SHEET

indeg[v]++ for each edge u→v
q = nodes with indeg 0
while q: u = pop; order.push(u)
  for v of adj[u]: if --indeg[v] == 0: q.push(v)
order.length < n → cycle

DFS: postorder, then reverse
Time O(V + E)

Think topo sort when:
→ prerequisites / dependencies
→ "valid order" of tasks`
};

export default topoSort;
