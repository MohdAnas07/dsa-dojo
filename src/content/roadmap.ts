import type { Topic, Pattern, Priority } from "@/lib/types";

// ===== Registry: every roadmap node. Add content in C[slug] to "unlock" a full page. =====
export const TOPICS: Topic[] = ([
  // slug, title, group, level, priority, prerequisites, blurb, keywords
  ["big-o","Big O & Complexity","start",0,"now",[],"How work grows with input size: the language of every interview answer.","time space complexity asymptotic O(1) O(n) O(log n) O(n log n) O(n^2) O(n²)"],
  ["js-for-dsa","JavaScript for DSA","start",0,"now",[],"let/const, loops, Map/Set, spread, sort comparators, and JS traps that matter in interviews.","javascript js basics map set"],
  ["math-basics","Basic Math","start",0,"next",[],"Modulo, GCD, primes, sums of series, and integer division in JS.","gcd prime modulo math"],
  ["arrays","Arrays","ds",1,"now",["big-o"],"Numbered boxes side by side. O(1) access, O(n) insert/delete in the middle.","array list index contiguous subarray O(1)"],
  ["strings","Strings","ds",1,"now",["arrays"],"Immutable character arrays: palindromes, anagrams, substrings.","string substring palindrome anagram char"],
  ["hashing","HashMap / HashSet","ds",1,"now",["arrays"],"O(1) lookups with Map and Set. Count, remember, find complements.","hash map set hashmap hashset dictionary frequency counter O(1)"],
  ["linked-list","Linked List","ds",1,"next",["arrays"],"Nodes connected by next pointers. O(1) rewiring, O(n) access.","linked list node pointer reverse cycle"],
  ["stack","Stack","ds",1,"next",["arrays"],"Last in, first out. Brackets, undo, monotonic stack.","stack lifo push pop monotonic"],
  ["queue","Queue & Deque","ds",1,"next",["arrays"],"First in, first out. The engine behind BFS.","queue fifo deque bfs"],
  ["trees","Trees & Binary Trees","ds",1,"later",["recursion","queue"],"Hierarchies: root, children, leaves. DFS and BFS traversals.","tree binary tree bst traversal inorder preorder postorder dfs bfs"],
  ["bst","Binary Search Tree","ds",1,"later",["trees","binary-search"],"Left < node < right. Ordered search in O(h).","bst binary search tree"],
  ["heap","Heap / Priority Queue","ds",1,"later",["trees"],"Always know the smallest (or largest) in O(1); push/pop in O(log n).","heap priority queue top k min max"],
  ["graph","Graph","ds",1,"later",["trees","queue"],"Nodes and edges: networks, maps, dependencies.","graph adjacency list edges vertices"],
  ["trie","Trie","ds",1,"later",["trees","strings"],"Prefix tree for autocomplete and word search.","trie prefix tree autocomplete"],
  ["searching","Linear Search","algo",2,"now",["arrays"],"Check each element until found: O(n). The baseline for everything.","linear search"],
  ["binary-search","Binary Search","algo",2,"next",["arrays","two-pointers"],"Halve the search space every step: O(log n).","binary search sorted log n O(log n) lower bound"],
  ["sorting","Sorting","algo",2,"next",["arrays","recursion"],"Bubble, selection, insertion, merge, quick: how and when.","sort bubble selection insertion merge quick sort O(n log n)"],
  ["two-pointers","Two Pointers","pattern",2,"now",["arrays"],"Two indexes moving through data to avoid nested loops.","two pointer pointers opposite ends pair sum"],
  ["sliding-window","Sliding Window","pattern",2,"now",["two-pointers","hashing"],"Slide a range along contiguous data; update in O(1).","sliding window substring subarray contiguous longest shortest"],
  ["prefix-sum","Prefix Sum","pattern",2,"next",["arrays"],"Precompute running totals to answer range sums in O(1).","prefix sum range sum cumulative"],
  ["recursion","Recursion","algo",2,"next",["stack"],"A function solving smaller copies of itself until a base case.","recursion base case call stack memoization"],
  ["backtracking","Backtracking","algo",2,"later",["recursion"],"Try a choice, recurse, undo. All combinations and permutations.","backtracking permutations subsets combinations n-queens"],
  ["greedy","Greedy","algo",2,"later",["sorting"],"Take the locally best choice when it's provably safe.","greedy intervals scheduling"],
  ["divide-conquer","Divide & Conquer","algo",2,"later",["recursion"],"Split, solve halves, combine: merge sort, quick sort.","divide and conquer merge sort"],
  ["bfs","BFS","algo",3,"later",["queue","graph"],"Explore level by level. Shortest paths in unweighted graphs.","bfs breadth first search shortest path"],
  ["dfs","DFS","algo",3,"later",["recursion","graph"],"Go deep first. Connected components, cycles, paths.","dfs depth first search"],
  ["topo-sort","Topological Sort","algo",3,"adv",["bfs","dfs"],"Order tasks so every dependency comes first.","topological sort kahn dag course schedule"],
  ["union-find","Union Find / DSU","algo",3,"adv",["graph"],"Track connected groups with near-O(1) merges.","union find dsu disjoint set"],
  ["dijkstra","Dijkstra","algo",3,"adv",["heap","bfs"],"Shortest paths with non-negative weights.","dijkstra shortest path weighted"],
  ["bellman-ford","Bellman-Ford","algo",3,"adv",["graph"],"Shortest paths with negative edges; detects negative cycles.","bellman ford"],
  ["floyd-warshall","Floyd-Warshall","algo",3,"adv",["graph"],"All-pairs shortest paths in O(V³).","floyd warshall all pairs"],
  ["mst","Minimum Spanning Tree","algo",3,"adv",["union-find","heap"],"Kruskal and Prim: connect everything at minimum cost.","mst kruskal prim spanning tree"],
  ["dp","Dynamic Programming","algo",3,"adv",["recursion"],"Recursion + memory. 1D, 2D, knapsack, subsequences, grids, strings.","dp dynamic programming memoization tabulation knapsack lcs"],
  ["bit-manipulation","Bit Manipulation","algo",3,"adv",["math-basics"],"XOR tricks, masks, and counting bits.","bit xor and or shift mask"],
  ["intervals","Intervals","pattern",4,"later",["sorting"],"Sort by start, then merge or count overlaps.","intervals merge overlap meeting rooms"],
  ["monotonic-stack","Monotonic Stack","pattern",4,"later",["stack"],"Stack kept sorted to answer next greater/smaller in O(n).","monotonic stack next greater"],
  ["fast-slow","Fast & Slow Pointers","pattern",4,"next",["linked-list"],"Tortoise and hare: cycles and middles.","fast slow pointers floyd cycle tortoise hare"]
] as [string, string, Topic["group"], number, Priority, string[], string, string][]).map(([slug, title, group, level, pri, pre, blurb, kw]) => ({ slug, title, group, level, pri, pre, blurb, kw }));

export const PATH: string[] = ["big-o","arrays","strings","hashing","two-pointers","sliding-window","binary-search","linked-list","stack","queue","recursion","trees","heap","graph","greedy","dp"];

export const LEVELS = [
  { n: 0, name: "Programming Fundamentals", desc: "Complexity, JS toolkit, math basics" },
  { n: 1, name: "Core Data Structures", desc: "How data is stored and accessed" },
  { n: 2, name: "Core Algorithms", desc: "Searching, sorting, recursion, core techniques" },
  { n: 3, name: "Advanced Algorithms", desc: "Graphs, shortest paths, DP, bits" },
  { n: 4, name: "Interview Patterns", desc: "Reusable problem-solving shapes" }
];

// ===== Patterns (21) =====
export const PATTERNS: Pattern[] = [
  { id: "frequency-counter", name: "Frequency Counter", topic: "hashing", signals: ["count occurrences", "anagram", "most frequent", "same elements"], idea: "Count things in a Map instead of comparing with nested loops.", tpl: `const count = new Map();\nfor (const x of arr) count.set(x, (count.get(x) || 0) + 1);` },
  { id: "two-pointers", name: "Two Pointers", topic: "two-pointers", signals: ["sorted array", "pair / triplet sum", "palindrome", "in-place"], idea: "Two indexes move toward each other or together; each move discards impossible options.", tpl: `let l = 0, r = arr.length - 1;\nwhile (l < r) {\n  if (good(l, r)) return [l, r];\n  tooSmall(l, r) ? l++ : r--;\n}` },
  { id: "sliding-window", name: "Sliding Window", topic: "sliding-window", signals: ["contiguous", "longest / shortest substring", "size k", "at most k distinct"], idea: "Grow the right edge, shrink the left edge while invalid, record the best window.", tpl: `let l = 0;\nfor (let r = 0; r < n; r++) {\n  add(a[r]);\n  while (invalid()) remove(a[l++]);\n  best = Math.max(best, r - l + 1);\n}` },
  { id: "fast-slow", name: "Fast & Slow Pointers", topic: "fast-slow", signals: ["cycle", "middle of list", "happy number", "k-th from end"], idea: "One pointer moves twice as fast. They meet in a cycle; slow lands mid-list.", tpl: `let slow = head, fast = head;\nwhile (fast && fast.next) {\n  slow = slow.next; fast = fast.next.next;\n  if (slow === fast) return true;\n}` },
  { id: "prefix-sum", name: "Prefix Sum", topic: "prefix-sum", signals: ["range sum", "subarray sum equals k", "many sum queries"], idea: "pre[i] = sum of first i items; sum(l..r) = pre[r+1] - pre[l].", tpl: `const pre = [0];\nfor (const x of a) pre.push(pre[pre.length - 1] + x);\n// sum(l..r) = pre[r + 1] - pre[l]` },
  { id: "hashing", name: "Hashing", topic: "hashing", signals: ["seen before", "complement", "group by", "O(1) lookup"], idea: "Trade memory for speed: remember values in a Map/Set.", tpl: `const seen = new Map();\nfor (let i = 0; i < a.length; i++) {\n  if (seen.has(target - a[i])) return [seen.get(target - a[i]), i];\n  seen.set(a[i], i);\n}` },
  { id: "binary-search", name: "Binary Search", topic: "binary-search", signals: ["sorted", "O(log n)", "minimum X such that", "rotated"], idea: "Discard half the space each step using a monotonic condition.", tpl: `let lo = 0, hi = n;\nwhile (lo < hi) {\n  const mid = (lo + hi) >> 1;\n  ok(mid) ? (hi = mid) : (lo = mid + 1);\n}\nreturn lo;` },
  { id: "monotonic-stack", name: "Monotonic Stack", topic: "monotonic-stack", signals: ["next greater", "next smaller", "days until warmer", "histogram"], idea: "Keep a stack in sorted order; popping resolves the answer for popped items.", tpl: `const st = [];\nfor (let i = 0; i < a.length; i++) {\n  while (st.length && a[i] > a[st.at(-1)]) ans[st.pop()] = i;\n  st.push(i);\n}` },
  { id: "top-k", name: "Heap / Top K", topic: "heap", signals: ["top k", "k-th largest", "k closest", "merge k sorted"], idea: "Keep a heap of size k; the root is the k-th best.", tpl: `// Min-heap of size k: push each item,\n// pop when size > k. Root = k-th largest.` },
  { id: "intervals", name: "Intervals", topic: "intervals", signals: ["overlapping", "meeting rooms", "schedule", "ranges"], idea: "Sort by start; compare each interval with the last kept one.", tpl: `intervals.sort((a, b) => a[0] - b[0]);\nfor (const cur of intervals) {\n  // overlap if cur[0] <= last[1]\n}` },
  { id: "merge-intervals", name: "Merge Intervals", topic: "intervals", signals: ["merge overlapping", "insert interval", "union of ranges"], idea: "After sorting, extend the last interval's end when overlapping, else start a new one.", tpl: `const out = [];\nfor (const [s, e] of sorted) {\n  if (out.length && s <= out.at(-1)[1]) out.at(-1)[1] = Math.max(out.at(-1)[1], e);\n  else out.push([s, e]);\n}` },
  { id: "recursion", name: "Recursion", topic: "recursion", signals: ["defined by smaller self", "nested", "tree"], idea: "Base case + trust the recursive call on a smaller input.", tpl: `function f(x) {\n  if (base(x)) return answer;\n  return combine(f(smaller(x)));\n}` },
  { id: "backtracking", name: "Backtracking", topic: "backtracking", signals: ["all combinations", "all permutations", "subsets", "place N items"], idea: "Choose → explore → un-choose. Prune branches that can't work.", tpl: `function bt(path) {\n  if (done(path)) { res.push([...path]); return; }\n  for (const c of choices) {\n    path.push(c); bt(path); path.pop();\n  }\n}` },
  { id: "bfs", name: "BFS", topic: "bfs", signals: ["shortest path (unweighted)", "level by level", "minimum steps", "spreading (rotting, fire)"], idea: "Queue; explore neighbors in waves. First arrival = shortest distance.", tpl: `const q = [start]; seen.add(start);\nfor (let h = 0; h < q.length; h++) {\n  for (const nb of adj(q[h])) if (!seen.has(nb)) { seen.add(nb); q.push(nb); }\n}` },
  { id: "dfs", name: "DFS", topic: "dfs", signals: ["connected components", "islands", "path exists", "explore all"], idea: "Go as deep as possible, then backtrack. Recursion or explicit stack.", tpl: `function dfs(node) {\n  if (seen.has(node)) return;\n  seen.add(node);\n  for (const nb of adj(node)) dfs(nb);\n}` },
  { id: "tree-traversal", name: "Tree Traversal", topic: "trees", signals: ["root / leaf / subtree", "depth", "path sum", "BST"], idea: "Recurse left and right, combine at the node; BFS for levels.", tpl: `function f(node) {\n  if (!node) return 0;\n  return combine(node, f(node.left), f(node.right));\n}` },
  { id: "graph-traversal", name: "Graph Traversal", topic: "graph", signals: ["network", "prerequisites", "grid as graph", "neighbors"], idea: "Build adjacency list, then BFS/DFS with a visited set.", tpl: `const adj = new Map();\nfor (const [u, v] of edges) {\n  if (!adj.has(u)) adj.set(u, []);\n  adj.get(u).push(v);\n}` },
  { id: "greedy", name: "Greedy", topic: "greedy", signals: ["maximum number of", "minimum number of", "earliest finish", "can reach"], idea: "Make the best local choice; works when a swap argument proves it safe.", tpl: `items.sort(byKey);\nfor (const it of items) if (canTake(it)) take(it);` },
  { id: "dp", name: "Dynamic Programming", topic: "dp", signals: ["number of ways", "min/max cost", "overlapping subproblems", "can you reach"], idea: "Define state, recurrence, base case; fill a table or memoize.", tpl: `const dp = new Array(n + 1).fill(0);\ndp[0] = base;\nfor (let i = 1; i <= n; i++) dp[i] = recurrence(dp, i);` },
  { id: "bit-manipulation", name: "Bit Manipulation", topic: "bit-manipulation", signals: ["single number", "XOR", "power of two", "subsets as masks"], idea: "x ^ x = 0, x & (x - 1) clears the lowest set bit.", tpl: `let x = 0;\nfor (const n of nums) x ^= n; // pairs cancel\nconst isPow2 = n > 0 && (n & (n - 1)) === 0;` },
  { id: "union-find", name: "Union Find", topic: "union-find", signals: ["connected groups", "redundant edge", "merge accounts", "dynamic connectivity"], idea: "Each group has a root; find with path compression, union by rank.", tpl: `const parent = [...Array(n).keys()];\nconst find = x => parent[x] === x ? x : (parent[x] = find(parent[x]));\nconst union = (a, b) => { parent[find(a)] = find(b); };` }
];

// ===== Decision tree for "Which pattern?" =====
export const DTREE: Record<string, { q: string; o: [string, string][] }> = {
  start: { q: "What kind of input does the problem give you?", o: [["Array or string", "arr"], ["Linked list", "ll"], ["Tree", "tree"], ["Graph / grid / dependencies", "graph"], ["A number, or a yes/no over a range of values", "num"]] },
  arr: { q: "What is it asking for?", o: [["Something about a contiguous subarray / substring", "contig"], ["A pair or triplet with some sum", "pair"], ["Find a value / position quickly", "find"], ["All combinations, subsets or permutations", "@backtracking"], ["Count, frequency, duplicates, grouping", "@frequency-counter"], ["Next greater / smaller element", "@monotonic-stack"], ["Top K / k-th largest", "@top-k"], ["Overlapping ranges / meetings", "@merge-intervals"], ["Min/max cost or number of ways, choices depend on earlier choices", "@dp"]] },
  contig: { q: "Can the elements be negative, and is the condition a sum?", o: [["No negatives, or condition is about characters / distinct counts", "@sliding-window"], ["Sum with possible negatives, e.g. \"subarray sum equals k\"", "@prefix-sum"], ["Largest sum overall", "@dp"]] },
  pair: { q: "Is the array sorted (or can you sort it without losing needed info)?", o: [["Yes, sorted", "@two-pointers"], ["No, and I need original indexes", "@hashing"]] },
  find: { q: "Is the data sorted, or is there a monotonic yes/no condition?", o: [["Yes", "@binary-search"], ["No", "@hashing"]] },
  ll: { q: "What do you need?", o: [["Detect a cycle / find the middle / k-th from end", "@fast-slow"], ["Reverse, merge, reorder", "@two-pointers"]] },
  tree: { q: "What does it ask?", o: [["Level by level / min depth / right side view", "@bfs"], ["Depth, path sums, subtree properties, BST checks", "@tree-traversal"], ["All root-to-leaf paths", "@backtracking"]] },
  graph: { q: "What do you need?", o: [["Shortest path, all edges weight 1 / minimum steps", "@bfs"], ["Count islands / components, reachability", "@dfs"], ["Ordering with prerequisites", "@graph-traversal"], ["Keep merging groups, detect redundant edge", "@union-find"]] },
  num: { q: "What's the flavour?", o: [["Minimum X such that condition holds (monotonic)", "@binary-search"], ["Number of ways to reach n / min steps to n", "@dp"], ["Single odd one out / powers of two / bit counts", "@bit-manipulation"], ["Pick the most / fewest items under a rule", "@greedy"]] }
};

export const CLUES: [string, string][] = [
  ["Longest / shortest subarray or substring", "sliding-window"], ["Sorted array + find pair", "two-pointers"], ["Find something in sorted data", "binary-search"], ["Next greater element", "monotonic-stack"], ["Top K elements", "top-k"], ["All possible combinations", "backtracking"], ["Min/max with overlapping subproblems", "dp"], ["Subarray sum equals K", "prefix-sum"], ["Cycle in linked list", "fast-slow"], ["Shortest path in grid (unweighted)", "bfs"], ["Number of islands / components", "dfs"], ["Overlapping intervals", "merge-intervals"], ["Anagram / frequency", "frequency-counter"], ["Every element appears twice except one", "bit-manipulation"]
];
