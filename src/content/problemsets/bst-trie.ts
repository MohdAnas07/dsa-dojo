import type { ProblemDef } from "@/lib/types";

// Helpers used inside validators for BST answers (several shapes can be correct).
const TREE_CHECK = `const T = a => { if (!Array.isArray(a) || !a.length || a[0] === null) return null; const r = { v: a[0], l: null, r: null }, q = [r]; let i = 1, h = 0; while (i < a.length && h < q.length) { const n = q[h++]; if (a[i] != null) q.push(n.l = { v: a[i], l: null, r: null }); i++; if (i < a.length && a[i] != null) q.push(n.r = { v: a[i], l: null, r: null }); i++; } return r; };
  const ino = (n, o = []) => { if (n) { ino(n.l, o); o.push(n.v); ino(n.r, o); } return o; };
  const ht = n => n ? 1 + Math.max(ht(n.l), ht(n.r)) : 0;
  const bal = n => !n || (Math.abs(ht(n.l) - ht(n.r)) <= 1 && bal(n.l) && bal(n.r));`;

/** Binary search trees and tries. */
export const BST_TRIE: ProblemDef[] = [
  {
    id: "kth-smallest-bst", t: "Kth Smallest Element in a BST", d: "M", tp: ["bst", "trees", "dfs", "stack"], pt: ["tree-traversal", "dfs"], co: ["Amazon", "Meta", "Google", "Uber"], lc: "kth-smallest-element-in-a-bst",
    s: "Return the k-th smallest value (1-indexed) in a BST.", h: ["Inorder traversal of a BST is sorted.", "Stop after visiting k nodes (iterative inorder with a stack)."],
    a: "Iterative inorder, count to k.", tc: "O(h + k)", sc: "O(h)", sim: ["validate-bst", "bst-iterator", "kth-largest"],
    fn: "kthSmallest", params: "root:TreeNode, k:number", ret: "number",
    ex: [[[3, 1, 4, null, 2], 1, 1], [[5, 3, 6, 2, 4, null, null, 1], 3, 3]], hid: [[[1], 1], [[2, 1, 3], 3], [[5, 3, 6, 2, 4, null, null, 1], 6]],
    code: `function kthSmallest(root, k) {
  const st = [];
  let cur = root;
  while (true) {
    while (cur) { st.push(cur); cur = cur.left; }
    cur = st.pop();
    if (--k === 0) return cur.val;
    cur = cur.right;
  }
}`
  },
  {
    id: "sorted-array-to-bst", t: "Convert Sorted Array to Binary Search Tree", d: "E", tp: ["bst", "trees", "divide-conquer", "recursion"], pt: ["recursion"], co: ["Amazon", "Microsoft", "Apple"], lc: "convert-sorted-array-to-binary-search-tree",
    s: "Build a height-balanced BST from a sorted array. Any balanced answer is accepted.", h: ["The middle element becomes the root.", "Recurse on the left and right halves."],
    a: "Divide and conquer on the middle index.", tc: "O(n)", sc: "O(log n)", sim: ["balanced-binary-tree", "build-tree-pre-in"],
    fn: "sortedArrayToBST", params: "nums:number[]", ret: "TreeNode",
    check: `(args, out) => { ${TREE_CHECK} const t = T(out); return JSON.stringify(ino(t)) === JSON.stringify(args[0]) && bal(t); }`,
    ex: [[[-10, -3, 0, 5, 9], [0, -3, 9, -10, null, 5]], [[1, 3], [3, 1]]], hid: [[[0]], [[1, 2, 3, 4, 5, 6, 7]], [[-5, -2, 0, 1, 4, 8]]],
    code: `function sortedArrayToBST(nums) {
  const build = (lo, hi) => {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1, n = new TreeNode(nums[mid]);
    n.left = build(lo, mid - 1); n.right = build(mid + 1, hi);
    return n;
  };
  return build(0, nums.length - 1);
}`
  },
  {
    id: "insert-into-bst", t: "Insert into a Binary Search Tree", d: "M", tp: ["bst", "trees"], pt: ["binary-search", "tree-traversal"], co: ["Amazon", "Microsoft"], lc: "insert-into-a-binary-search-tree",
    s: "Insert val (not already present) into the BST and return the root. Any valid BST is accepted.", h: ["Walk down like a search.", "Attach the new node at the empty spot you reach."],
    a: "Iterative descent, attach as a leaf.", tc: "O(h)", sc: "O(1)", sim: ["delete-node-bst", "lca-bst"],
    fn: "insertIntoBST", params: "root:TreeNode, val:number", ret: "TreeNode",
    check: `(args, out) => { ${TREE_CHECK} const want = [...ino(T(args[0])), args[1]].sort((a, b) => a - b); return JSON.stringify(ino(T(out))) === JSON.stringify(want); }`,
    ex: [[[4, 2, 7, 1, 3], 5, [4, 2, 7, 1, 3, 5]], [[40, 20, 60, 10, 30, 50, 70], 25, [40, 20, 60, 10, 30, 50, 70, null, null, 25]]], hid: [[[], 5], [[5], 1], [[8, null, 55, 39, null, 11, null, null, 23, null, null], 17]],
    code: `function insertIntoBST(root, val) {
  const node = new TreeNode(val);
  if (!root) return node;
  let cur = root;
  while (true) {
    if (val < cur.val) { if (!cur.left) { cur.left = node; break; } cur = cur.left; }
    else { if (!cur.right) { cur.right = node; break; } cur = cur.right; }
  }
  return root;
}`
  },
  {
    id: "delete-node-bst", t: "Delete Node in a BST", d: "M", tp: ["bst", "trees", "recursion"], pt: ["tree-traversal", "recursion"], co: ["Amazon", "Microsoft", "Uber", "Oracle"], lc: "delete-node-in-a-bst",
    s: "Delete the node with value key (if present) and return the root. Any valid BST is accepted.", h: ["Find the node recursively.", "Two children: replace its value with the smallest value in the right subtree, then delete that value there."],
    a: "Recursive delete with the inorder-successor trick.", tc: "O(h)", sc: "O(h)", sim: ["insert-into-bst", "trim-bst"],
    fn: "deleteNode", params: "root:TreeNode, key:number", ret: "TreeNode",
    check: `(args, out) => { ${TREE_CHECK} const want = ino(T(args[0])).filter(x => x !== args[1]); return JSON.stringify(ino(T(out))) === JSON.stringify(want); }`,
    ex: [[[5, 3, 6, 2, 4, null, 7], 3, [5, 4, 6, 2, null, null, 7]], [[5, 3, 6, 2, 4, null, 7], 0, [5, 3, 6, 2, 4, null, 7]], [[], 0, []]], hid: [[[5, 3, 6, 2, 4, null, 7], 5], [[1], 1], [[2, 1], 2]],
    code: `function deleteNode(root, key) {
  if (!root) return null;
  if (key < root.val) root.left = deleteNode(root.left, key);
  else if (key > root.val) root.right = deleteNode(root.right, key);
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let m = root.right;
    while (m.left) m = m.left;
    root.val = m.val;
    root.right = deleteNode(root.right, m.val);
  }
  return root;
}`
  },
  {
    id: "bst-iterator", t: "Binary Search Tree Iterator", d: "M", tp: ["bst", "stack", "trees"], pt: ["tree-traversal", "monotonic-stack"], co: ["Meta", "Amazon", "Microsoft", "Google"], lc: "binary-search-tree-iterator",
    s: "Implement BSTIterator(root) with next() (next smallest) and hasNext(), using O(h) memory.", h: ["Iterative inorder traversal, paused between calls.", "Keep the stack of left-spine nodes; after popping, push the left spine of its right child."],
    a: "Controlled inorder with a stack.", tc: "O(1) amortized", sc: "O(h)", sim: ["kth-smallest-bst", "flatten-tree"],
    fn: "BSTIterator", ctor: "root:TreeNode", methods: "next():number; hasNext():boolean",
    ex: [[["BSTIterator", "next", "next", "hasNext", "next", "hasNext", "next", "hasNext", "next", "hasNext"], [[[7, 3, 15, null, null, 9, 20]], [], [], [], [], [], [], [], [], []], [null, 3, 7, true, 9, true, 15, true, 20, false]]],
    hid: [[["BSTIterator", "hasNext", "next", "hasNext"], [[[1]], [], [], []]], [["BSTIterator", "next", "next", "next"], [[[2, 1, 3]], [], [], []]]],
    code: `class BSTIterator {
  constructor(root) { this.st = []; this.pushLeft(root); }
  pushLeft(n) { while (n) { this.st.push(n); n = n.left; } }
  next() { const n = this.st.pop(); this.pushLeft(n.right); return n.val; }
  hasNext() { return this.st.length > 0; }
}`
  },
  {
    id: "two-sum-bst", t: "Two Sum IV - Input is a BST", d: "E", tp: ["bst", "hashing", "two-pointers", "trees"], pt: ["hashing", "two-pointers"], co: ["Amazon", "Meta", "Samsung"], lc: "two-sum-iv-input-is-a-bst",
    s: "Are there two different nodes whose values add up to k?", h: ["Any traversal with a Set of seen values works.", "Or inorder to a sorted array + two pointers."],
    a: "DFS with a Set of complements.", tc: "O(n)", sc: "O(n)", sim: ["two-sum", "two-sum-ii"],
    fn: "findTarget", params: "root:TreeNode, k:number", ret: "boolean",
    ex: [[[5, 3, 6, 2, 4, null, 7], 9, true], [[5, 3, 6, 2, 4, null, 7], 28, false]], hid: [[[1], 2], [[2, 1, 3], 4], [[2, 1, 3], 1]],
    code: `function findTarget(root, k) {
  const seen = new Set();
  const dfs = n => {
    if (!n) return false;
    if (seen.has(k - n.val)) return true;
    seen.add(n.val);
    return dfs(n.left) || dfs(n.right);
  };
  return dfs(root);
}`
  },
  {
    id: "trim-bst", t: "Trim a Binary Search Tree", d: "M", tp: ["bst", "trees", "recursion"], pt: ["recursion", "tree-traversal"], co: ["Amazon", "Bloomberg"], lc: "trim-a-binary-search-tree",
    s: "Remove all nodes outside [low, high], keeping the relative structure of the rest.", h: ["If root.val < low, the whole left side is gone: return trim(root.right).", "Symmetric for > high; otherwise trim both children."],
    a: "Recursive pruning.", tc: "O(n)", sc: "O(h)", sim: ["delete-node-bst", "range-sum-bst"],
    fn: "trimBST", params: "root:TreeNode, low:number, high:number", ret: "TreeNode",
    ex: [[[1, 0, 2], 1, 2, [1, null, 2]], [[3, 0, 4, null, 2, null, null, 1], 1, 3, [3, 2, null, 1]]], hid: [[[1], 1, 2], [[1, null, 2], 2, 4], [[3, 1, 4, null, 2], 3, 4]],
    code: `function trimBST(root, low, high) {
  if (!root) return null;
  if (root.val < low) return trimBST(root.right, low, high);
  if (root.val > high) return trimBST(root.left, low, high);
  root.left = trimBST(root.left, low, high);
  root.right = trimBST(root.right, low, high);
  return root;
}`
  },
  {
    id: "convert-bst-greater", t: "Convert BST to Greater Tree", d: "M", tp: ["bst", "trees", "dfs"], pt: ["tree-traversal", "prefix-sum"], co: ["Amazon", "Meta"], lc: "convert-bst-to-greater-tree",
    s: "Replace every value with itself plus the sum of all greater values.", h: ["Reverse inorder (right, node, left) visits values from largest to smallest.", "Keep a running sum."],
    a: "Reverse inorder with an accumulator.", tc: "O(n)", sc: "O(h)", sim: ["range-sum-bst", "kth-smallest-bst"],
    fn: "convertBST", params: "root:TreeNode", ret: "TreeNode",
    ex: [[[4, 1, 6, 0, 2, 5, 7, null, null, null, 3, null, null, null, 8], [30, 36, 21, 36, 35, 26, 15, null, null, null, 33, null, null, null, 8]], [[0, null, 1], [1, null, 1]]], hid: [[[]], [[1, 0, 2]], [[3, 2, 4, 1]]],
    code: `function convertBST(root) {
  let sum = 0;
  const dfs = n => { if (!n) return; dfs(n.right); sum += n.val; n.val = sum; dfs(n.left); };
  dfs(root);
  return root;
}`
  },
  {
    id: "range-sum-bst", t: "Range Sum of BST", d: "E", tp: ["bst", "trees", "dfs"], pt: ["tree-traversal", "dfs"], co: ["Meta", "Amazon", "Google"], lc: "range-sum-of-bst",
    s: "Sum the values of all nodes with low ≤ val ≤ high.", h: ["Any traversal works in O(n).", "Use the BST order to skip subtrees that are entirely out of range."],
    a: "DFS with pruning.", tc: "O(n)", sc: "O(h)", sim: ["trim-bst", "convert-bst-greater"],
    fn: "rangeSumBST", params: "root:TreeNode, low:number, high:number", ret: "number",
    ex: [[[10, 5, 15, 3, 7, null, 18], 7, 15, 32], [[10, 5, 15, 3, 7, 13, 18, 1, null, 6], 6, 10, 23]], hid: [[[5], 1, 4], [[5], 5, 5], [[2, 1, 3], 1, 3]],
    code: `function rangeSumBST(root, low, high) {
  if (!root) return 0;
  if (root.val < low) return rangeSumBST(root.right, low, high);
  if (root.val > high) return rangeSumBST(root.left, low, high);
  return root.val + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
}`
  },
  {
    id: "increasing-order-bst", t: "Increasing Order Search Tree", d: "E", tp: ["bst", "trees", "dfs", "stack"], pt: ["tree-traversal"], co: ["Amazon", "Google"], lc: "increasing-order-search-tree",
    s: "Rearrange the BST so it's a right-only chain in increasing order.", h: ["Inorder visits nodes in order.", "Keep a tail pointer; attach each visited node to its right and clear its left."],
    a: "Inorder with a dummy tail.", tc: "O(n)", sc: "O(h)", sim: ["flatten-tree", "kth-smallest-bst"],
    fn: "increasingBST", params: "root:TreeNode", ret: "TreeNode",
    ex: [[[5, 3, 6, 2, 4, null, 8, 1, null, null, null, 7, 9], [1, null, 2, null, 3, null, 4, null, 5, null, 6, null, 7, null, 8, null, 9]], [[5, 1, 7], [1, null, 5, null, 7]]], hid: [[[1]], [[2, 1]]],
    code: `function increasingBST(root) {
  const dummy = new TreeNode(0);
  let tail = dummy;
  const dfs = n => { if (!n) return; dfs(n.left); n.left = null; tail.right = n; tail = n; dfs(n.right); };
  dfs(root);
  return dummy.right;
}`
  },
  {
    id: "min-abs-diff-bst", t: "Minimum Absolute Difference in BST", d: "E", tp: ["bst", "trees", "dfs"], pt: ["tree-traversal"], co: ["Google", "Amazon"], lc: "minimum-absolute-difference-in-bst",
    s: "Return the minimum difference between values of any two nodes.", h: ["In sorted order, the closest pair is always adjacent.", "Inorder traversal, compare with the previous value."],
    a: "Inorder with a previous value.", tc: "O(n)", sc: "O(h)", sim: ["kth-smallest-bst", "validate-bst"],
    fn: "getMinimumDifference", params: "root:TreeNode", ret: "number",
    ex: [[[4, 2, 6, 1, 3], 1], [[1, 0, 48, null, null, 12, 49], 1]], hid: [[[1, null, 3, 2]], [[236, 104, 701, null, 227, null, 911]]],
    code: `function getMinimumDifference(root) {
  let prev = null, best = Infinity;
  const dfs = n => { if (!n) return; dfs(n.left); if (prev !== null) best = Math.min(best, n.val - prev); prev = n.val; dfs(n.right); };
  dfs(root);
  return best;
}`
  },
  {
    id: "implement-trie", t: "Implement Trie (Prefix Tree)", d: "M", tp: ["trie", "strings", "hashing"], pt: ["hashing"], co: ["Amazon", "Google", "Microsoft", "Meta", "Uber"], lc: "implement-trie-prefix-tree",
    s: "Implement Trie with insert(word), search(word) and startsWith(prefix).", h: ["Each node has a map of children and an end-of-word flag.", "search checks the flag at the end; startsWith only needs the path to exist."],
    a: "Nested objects as nodes.", tc: "O(L) per op", sc: "O(total chars)", sim: ["add-search-words", "word-search-ii", "search-suggestions"],
    fn: "Trie", ctor: "", methods: "insert(word:string):void; search(word:string):boolean; startsWith(prefix:string):boolean",
    ex: [[["Trie", "insert", "search", "search", "startsWith", "insert", "search"], [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]], [null, null, true, false, true, null, true]]],
    hid: [[["Trie", "insert", "insert", "search", "startsWith", "search", "startsWith"], [[], ["ab"], ["abc"], ["a"], ["b"], ["abc"], ["abcd"]]]],
    code: `class Trie {
  constructor() { this.root = {}; }
  insert(word) {
    let n = this.root;
    for (const c of word) n = n[c] || (n[c] = {});
    n.end = true;
  }
  find(s) { let n = this.root; for (const c of s) { n = n[c]; if (!n) return null; } return n; }
  search(word) { const n = this.find(word); return !!(n && n.end); }
  startsWith(prefix) { return !!this.find(prefix); }
}`
  },
  {
    id: "add-search-words", t: "Design Add and Search Words Data Structure", d: "M", tp: ["trie", "dfs", "backtracking", "strings"], pt: ["dfs", "backtracking"], co: ["Meta", "Amazon", "Google"], lc: "design-add-and-search-words-data-structure",
    s: "WordDictionary supports addWord(word) and search(word) where '.' matches any letter.", h: ["Store words in a trie.", "On '.', try every child (DFS)."],
    a: "Trie + DFS for wildcards.", tc: "O(L) add, O(26^dots · L) search", sc: "O(total chars)", sim: ["implement-trie", "word-search-ii", "wildcard-matching"],
    fn: "WordDictionary", ctor: "", methods: "addWord(word:string):void; search(word:string):boolean",
    ex: [[["WordDictionary", "addWord", "addWord", "addWord", "search", "search", "search", "search"], [[], ["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]], [null, null, null, null, false, true, true, true]]],
    hid: [[["WordDictionary", "addWord", "search", "search", "search"], [[], ["a"], ["."], ["a."], [".."]]]],
    code: `class WordDictionary {
  constructor() { this.root = {}; }
  addWord(word) { let n = this.root; for (const c of word) n = n[c] || (n[c] = {}); n.end = true; }
  search(word) {
    const dfs = (n, i) => {
      if (!n) return false;
      if (i === word.length) return !!n.end;
      const c = word[i];
      if (c !== ".") return dfs(n[c], i + 1);
      return Object.keys(n).some(k => k !== "end" && dfs(n[k], i + 1));
    };
    return dfs(this.root, 0);
  }
}`
  },
  {
    id: "word-search-ii", t: "Word Search II", d: "H", tp: ["trie", "backtracking", "dfs"], pt: ["backtracking", "dfs"], co: ["Amazon", "Microsoft", "Uber", "Airbnb"], lc: "word-search-ii",
    s: "Return every word from the list that can be formed by adjacent (up/down/left/right) cells, each cell used once per word.", h: ["Running Word Search per word repeats work.", "Put all words in a trie and DFS the board once, following trie edges."],
    a: "Trie-guided backtracking; remove found words to avoid duplicates.", tc: "O(cells · 4^L)", sc: "O(total chars)", sim: ["word-search", "implement-trie"],
    fn: "findWords", params: "board:character[][], words:string[]", ret: "string[]", cmp: "unordered",
    ex: [[[["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]], ["oath", "pea", "eat", "rain"], ["eat", "oath"]], [[["a", "b"], ["c", "d"]], ["abcb"], []]], hid: [[[["a"]], ["a", "b"]], [[["a", "a"]], ["aaa"]], [[["a", "b"], ["c", "d"]], ["ab", "cb", "ad", "bd", "ac", "ca", "da", "bc", "db", "adcb", "dabc", "abb", "acb"]]],
    code: `function findWords(board, words) {
  const root = {};
  for (const w of words) { let n = root; for (const c of w) n = n[c] || (n[c] = {}); n.word = w; }
  const R = board.length, C = board[0].length, res = [];
  const dfs = (r, c, node) => {
    const ch = board[r][c], next = node[ch];
    if (!next) return;
    if (next.word) { res.push(next.word); next.word = null; }
    board[r][c] = "#";
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < R && nc < C && board[nr][nc] !== "#") dfs(nr, nc, next);
    }
    board[r][c] = ch;
  };
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) dfs(r, c, root);
  return res;
}`
  },
  {
    id: "replace-words", t: "Replace Words", d: "M", tp: ["trie", "strings", "hashing"], pt: ["hashing"], co: ["Uber", "Amazon"], lc: "replace-words",
    s: "Replace each word in the sentence with the shortest dictionary root that is its prefix.", h: ["Put roots in a trie.", "For each word, walk the trie and stop at the first end-of-root."],
    a: "Trie lookup of the shortest prefix per word.", tc: "O(total chars)", sc: "O(dictionary chars)", sim: ["implement-trie", "longest-common-prefix"],
    fn: "replaceWords", params: "dictionary:string[], sentence:string", ret: "string",
    ex: [[["cat", "bat", "rat"], "the cattle was rattled by the battery", "the cat was rat by the bat"], [["a", "b", "c"], "aadsfasf absbs bbab cadsfafs", "a a b c"]], hid: [[["catt", "cat", "bat", "rat"], "the cattle was rattled by the battery"], [["x"], "hello world"]],
    code: `function replaceWords(dictionary, sentence) {
  const root = {};
  for (const w of dictionary) { let n = root; for (const c of w) n = n[c] || (n[c] = {}); n.end = true; }
  return sentence.split(" ").map(word => {
    let n = root;
    for (let i = 0; i < word.length; i++) {
      n = n[word[i]];
      if (!n) break;
      if (n.end) return word.slice(0, i + 1);
    }
    return word;
  }).join(" ");
}`
  },
  {
    id: "longest-word-dictionary", t: "Longest Word in Dictionary", d: "M", tp: ["trie", "hashing", "sorting", "strings"], pt: ["hashing"], co: ["Goldman Sachs", "Amazon"], lc: "longest-word-in-dictionary",
    s: "Return the longest word that can be built one letter at a time by other words in the list (ties → lexicographically smallest).", h: ["Sort words; a word is buildable if its prefix without the last letter was buildable.", "Keep buildable words in a Set."],
    a: "Sort + Set of buildable words.", tc: "O(n log n · L)", sc: "O(n · L)", sim: ["implement-trie", "longest-string-chain"],
    fn: "longestWord", params: "words:string[]", ret: "string",
    ex: [[["w", "wo", "wor", "worl", "world"], "world"], [["a", "banana", "app", "appl", "ap", "apply", "apple"], "apple"]], hid: [[["b"]], [["m", "mo", "moc", "moch", "mocha", "l", "la", "lat", "latt", "latte", "c", "ca", "cat"]], [["yo", "ew", "fc", "zrc", "yodn", "fcm", "qm", "qmo", "fcmz", "z", "ewq", "yod", "ewqz", "y"]]],
    code: `function longestWord(words) {
  words.sort();
  const ok = new Set([""]);
  let best = "";
  for (const w of words) {
    if (ok.has(w.slice(0, -1))) {
      ok.add(w);
      if (w.length > best.length) best = w;
    }
  }
  return best;
}`
  },
  {
    id: "search-suggestions", t: "Search Suggestions System", d: "M", tp: ["trie", "binary-search", "sorting", "strings"], pt: ["binary-search", "two-pointers"], co: ["Amazon", "Google"], lc: "search-suggestions-system",
    s: "After each typed character of searchWord, return up to 3 lexicographically smallest products with that prefix.", h: ["Sort products.", "For each prefix, binary search the first product ≥ prefix and take up to 3 that match."],
    a: "Sort + lower-bound per prefix (or a trie storing top 3 per node).", tc: "O(n log n + L log n)", sc: "O(1) extra", sim: ["implement-trie", "longest-common-prefix"],
    fn: "suggestedProducts", params: "products:string[], searchWord:string", ret: "string[][]",
    ex: [[["mobile", "mouse", "moneypot", "monitor", "mousepad"], "mouse", [["mobile", "moneypot", "monitor"], ["mobile", "moneypot", "monitor"], ["mouse", "mousepad"], ["mouse", "mousepad"], ["mouse", "mousepad"]]], [["havana"], "havana", [["havana"], ["havana"], ["havana"], ["havana"], ["havana"], ["havana"]]]], hid: [[["bags", "baggage", "banner", "box", "cloths"], "bags"], [["havana"], "tatiana"]],
    code: `function suggestedProducts(products, searchWord) {
  products.sort();
  const res = [];
  let prefix = "";
  for (const ch of searchWord) {
    prefix += ch;
    let lo = 0, hi = products.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (products[m] < prefix) lo = m + 1; else hi = m; }
    res.push(products.slice(lo, lo + 3).filter(p => p.startsWith(prefix)));
  }
  return res;
}`
  },
  {
    id: "max-xor-two-numbers", t: "Maximum XOR of Two Numbers in an Array", d: "M", tp: ["trie", "bit-manipulation", "hashing"], pt: ["bit-manipulation"], co: ["Google", "Amazon"], lc: "maximum-xor-of-two-numbers-in-an-array",
    s: "Return the maximum nums[i] XOR nums[j].", h: ["Build the answer bit by bit from the highest bit.", "A binary trie lets each number greedily look for the opposite bit."],
    a: "Binary trie of 31-bit numbers; greedy opposite-bit walk.", tc: "O(31 · n)", sc: "O(31 · n)", sim: ["single-number", "implement-trie"],
    fn: "findMaximumXOR", params: "nums:number[]", ret: "number",
    ex: [[[3, 10, 5, 25, 2, 8], 28], [[14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70], 127]], hid: [[[0]], [[8, 10, 2]], [[1, 2, 3, 4, 5, 6, 7]]],
    code: `function findMaximumXOR(nums) {
  const root = {};
  for (const x of nums) { let n = root; for (let b = 30; b >= 0; b--) { const bit = (x >> b) & 1; n = n[bit] || (n[bit] = {}); } }
  let best = 0;
  for (const x of nums) {
    let n = root, cur = 0;
    for (let b = 30; b >= 0; b--) {
      const bit = (x >> b) & 1, want = bit ^ 1;
      if (n[want]) { cur |= 1 << b; n = n[want]; } else n = n[bit];
    }
    best = Math.max(best, cur);
  }
  return best;
}`
  }
];
