import type { Lesson } from "@/lib/types";
import { DSU } from "./_shared";

const unionFind: Lesson = {
  what: "Union-Find (also called a Disjoint Set Union, DSU) keeps track of which items belong to the same group. It answers 'are these two in the same group?' and merges two groups, both in nearly O(1) time.",
  analogy: { short: "Clubs with presidents", text: "Every club has a president. To check whether two people are in the same club, ask each of them who their president is. To merge two clubs, one president agrees to report to the other. Over time, everyone learns to ask the top president directly." },
  eli5: "Each kid holds hands with a 'leader'. To see if two kids are on the same team, follow the hands to the top leader. To join two teams, one leader holds the other leader's hand.",
  tech: "Each item stores a parent; a root (parent of itself) represents its group. find(x) follows parents to the root; union(a, b) links one root under the other. Two tricks make it fast: path compression (point nodes closer to the root while finding) and union by size or rank (hang the smaller tree under the bigger one). Together they make each operation O(α(n)), the inverse Ackermann function, which is below 5 for any practical n. union returning false means a and b were already connected, which is how DSU detects cycles in undirected graphs.",
  why: "Many problems are 'which things end up connected?' with connections arriving one by one: friend circles, network components, redundant edges, Kruskal's minimum spanning tree, equations like a == b. DSU handles each new connection in near-constant time, without rebuilding a graph.",
  how: ["Start with parent[i] = i: everyone is their own group.", "find(x): follow parent pointers to the root; compress the path as you go.", "union(a, b): find both roots; if they differ, attach the smaller tree under the larger.", "Same root = same group.", "Count groups: start at n and subtract one for every successful union."],
  props: ["Only merges, never splits", "find + union ≈ O(1) amortized", "union returns false if already connected", "Works on any items you can number"],
  use: ["Connected components with incremental edges", "Cycle detection in undirected graphs", "Kruskal's MST", "Grouping by equivalence (equations, accounts, synonyms)", "Dynamic connectivity in grids"],
  avoid: ["You need to remove connections (DSU can't split)", "You need the actual path between two nodes (use BFS/DFS)", "Directed relationships"],
  viz: "array",
  cx: [["find", "≈ O(1) amortized", "Path compression keeps trees very flat."], ["union", "≈ O(1) amortized", "Two finds and one pointer change."], ["Without the tricks", "O(n) worst case", "Trees can degrade into long chains."], ["Space", "O(n)", "A parent (and size) per item."]],
  space: "O(n).",
  code: {
    c: `class DSU {
  constructor(n) { this.parent = Array.from({ length: n }, (_, i) => i); this.size = new Array(n).fill(1); }
  find(x) {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }
  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this.size[ra] < this.size[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    this.size[ra] += this.size[rb];
    return true;
  }
}
const d = new DSU(6);
d.union(0, 1); d.union(1, 2); d.union(3, 4);
console.log(d.find(2) === d.find(0), d.find(3) === d.find(5));
console.log(d.union(0, 2));
console.log(new Set([0, 1, 2, 3, 4, 5].map(x => d.find(x))).size);`,
    hl: [5, 13],
    ex: { 2: "Everyone starts as their own group.", 5: "Path halving: point x at its grandparent, flattening the tree as we go.", 12: "Already in the same group: in a graph, this edge would close a cycle.", 13: "Union by size: hang the smaller tree under the bigger one.", 23: "Groups left: {0,1,2}, {3,4} and {5}." }
  },
  examples: [
    { lvl: "Easy", title: "Number of provinces", prob: "Cities are connected directly or through others. Count the connected groups from an adjacency matrix.", idea: "Start with n groups and union every connected pair; each successful union removes one group.", c: DSU + `function findCircleNum(isConnected) {
  const n = isConnected.length, dsu = new DSU(n);
  let groups = n;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (isConnected[i][j] && dsu.union(i, j)) groups--;
  return groups;
}
console.log(findCircleNum([[1, 1, 0], [1, 1, 0], [0, 0, 1]]));
console.log(findCircleNum([[1, 0, 0], [0, 1, 0], [0, 0, 1]]));`, time: "O(n² · α(n))", space: "O(n)", ex: { 11: "union returns true only when two different groups merge." } },
    { lvl: "Practical", title: "Redundant connection", prob: "A tree got one extra edge. Return the edge that creates the cycle.", idea: "Add edges one by one. The first edge whose ends are already connected closes a cycle.", c: DSU + `function findRedundantConnection(edges) {
  const dsu = new DSU(edges.length + 1);
  for (const [u, v] of edges) if (!dsu.union(u, v)) return [u, v];
  return [];
}
console.log(findRedundantConnection([[1, 2], [1, 3], [2, 3]]));
console.log(findRedundantConnection([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]));`, time: "O(n · α(n))", space: "O(n)", ex: { 8: "union fails ⇒ u and v were already connected ⇒ this edge is the extra one." } },
    { lvl: "Interview", title: "Satisfiability of equality equations", prob: "Given equations like 'a==b' and 'a!=c', can they all be true at once?", idea: "First union every pair that must be equal. Then check that no '!=' pair ended up in the same group.", c: DSU + `function equationsPossible(equations) {
  const dsu = new DSU(26), id = ch => ch.charCodeAt(0) - 97;
  for (const e of equations) if (e[1] === "=") dsu.union(id(e[0]), id(e[3]));
  for (const e of equations) if (e[1] === "!" && dsu.find(id(e[0])) === dsu.find(id(e[3]))) return false;
  return true;
}
console.log(equationsPossible(["a==b", "b!=a"]));
console.log(equationsPossible(["a==b", "b==c", "a==c"]));
console.log(equationsPossible(["a==b", "b==c", "c!=a"]));`, time: "O(n · α(26))", space: "O(1)", ex: { 8: "Pass 1: merge everything that must be equal.", 9: "Pass 2: a '!=' inside one group is a contradiction." } }
  ],
  signals: [["\"connected\", \"groups\", \"friend circles\", \"provinces\"", "Union-Find (or DFS)"], ["edges arrive one at a time", "Union-Find"], ["\"extra edge\", \"would form a cycle\" (undirected)", "union returns false"], ["\"minimum cost to connect everything\"", "Kruskal = sort edges + Union-Find"], ["equivalences: a == b, synonyms, same accounts", "Union-Find over the items"]],
  mistakes: [["Comparing parents instead of roots", "Two nodes can have different parents but the same root. Always compare find(a) and find(b)."], ["Skipping path compression and union by size", "Without them, finds can be O(n)."], ["Forgetting 1-indexed nodes", "Allocate n + 1 slots when nodes are numbered from 1."], ["Using DSU for directed graphs", "It models undirected connectivity only."]],
  js: ["Array.from({ length: n }, (_, i) => i) builds [0, 1, …, n − 1].", "For string items, map each string to an index first (a Map)."],
  iq: { Beginner: ["Group people into friend circles"], Easy: ["Check whether two nodes are connected after a list of unions"], Medium: ["number-of-provinces", "number-connected-components", "redundant-connection", "graph-valid-tree", "satisfiability-equations", "most-stones-removed"], Hard: ["min-cost-connect-points", "swim-rising-water"] },
  rev: { s30: "Track groups with parent pointers. find follows parents to the root (compress the path); union links roots (smaller under bigger). Both ≈ O(1). union returning false means already connected.", m2: ["parent[i] = i at the start", "find with path compression", "union by size", "union false ⇒ cycle / already connected", "groups = n − successful unions"] },
  cheat: `UNION-FIND CHEAT SHEET

parent = [0..n-1], size = [1..]
find(x): while p[x] != x: p[x] = p[p[x]]; x = p[x]
union(a,b): ra, rb = find(a), find(b)
  if ra == rb return false   // cycle!
  attach smaller under bigger; return true

≈ O(1) per operation

Think Union-Find when:
→ connected groups, edges arrive over time
→ cycle in an undirected graph
→ Kruskal's MST, equivalences`
};

export default unionFind;
