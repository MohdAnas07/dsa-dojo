import type { ProblemDef } from "@/lib/types";

/** Binary trees (TreeNode is provided; trees are given in level order with null gaps). */
export const TREES: ProblemDef[] = [
  {
    id: "diameter-binary-tree", t: "Diameter of Binary Tree", d: "E", tp: ["trees", "dfs", "recursion"], pt: ["tree-traversal", "dfs"], co: ["Meta", "Amazon", "Google", "Microsoft"], lc: "diameter-of-binary-tree",
    s: "Return the length (in edges) of the longest path between any two nodes.", h: ["The longest path through a node = left height + right height.", "Compute heights bottom-up and update a global best on the way."],
    a: "Postorder DFS returning height, tracking the best left + right.", tc: "O(n)", sc: "O(h)", sim: ["max-depth", "max-path-sum", "balanced-binary-tree"],
    fn: "diameterOfBinaryTree", params: "root:TreeNode", ret: "number",
    ex: [[[1, 2, 3, 4, 5], 3], [[1, 2], 1]], hid: [[[1]], [[1, 2, null, 3, 4, 5, null, null, 6]], [[4, -7, -3, null, null, -9, -3, 9, -7, -4, null, 6, null, -6, -6]]],
    code: `function diameterOfBinaryTree(root) {
  let best = 0;
  const h = n => { if (!n) return 0; const l = h(n.left), r = h(n.right); best = Math.max(best, l + r); return 1 + Math.max(l, r); };
  h(root);
  return best;
}`
  },
  {
    id: "balanced-binary-tree", t: "Balanced Binary Tree", d: "E", tp: ["trees", "dfs", "recursion"], pt: ["tree-traversal", "dfs"], co: ["Amazon", "Google", "Bloomberg"], lc: "balanced-binary-tree",
    s: "A tree is height-balanced if every node's subtree heights differ by at most 1. Is this tree balanced?", h: ["Checking heights separately at every node is O(n²).", "Return -1 from the height function as soon as an imbalance is found."],
    a: "Single postorder pass returning height or -1.", tc: "O(n)", sc: "O(h)", sim: ["max-depth", "diameter-binary-tree"],
    fn: "isBalanced", params: "root:TreeNode", ret: "boolean",
    ex: [[[3, 9, 20, null, null, 15, 7], true], [[1, 2, 2, 3, 3, null, null, 4, 4], false], [[], true]], hid: [[[1, 2, 2, 3, null, null, 3, 4, null, null, 4]], [[1, null, 2, null, 3]], [[1]]],
    code: `function isBalanced(root) {
  const h = n => {
    if (!n) return 0;
    const l = h(n.left); if (l < 0) return -1;
    const r = h(n.right); if (r < 0 || Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  };
  return h(root) >= 0;
}`
  },
  {
    id: "symmetric-tree", t: "Symmetric Tree", d: "E", tp: ["trees", "recursion", "bfs"], pt: ["tree-traversal", "recursion"], co: ["Amazon", "Microsoft", "LinkedIn", "Bloomberg"], lc: "symmetric-tree",
    s: "Is the tree a mirror of itself around its center?", h: ["Compare the left subtree with the right subtree mirrored.", "mirror(a, b): a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)."],
    a: "Recursive mirror comparison.", tc: "O(n)", sc: "O(h)", sim: ["same-tree", "invert-tree"],
    fn: "isSymmetric", params: "root:TreeNode", ret: "boolean",
    ex: [[[1, 2, 2, 3, 4, 4, 3], true], [[1, 2, 2, null, 3, null, 3], false]], hid: [[[1]], [[1, 2, 3]], [[2, 3, 3, 4, 5, 5, 4, null, null, 8, 9, 9, 8]]],
    code: `function isSymmetric(root) {
  const mirror = (a, b) => !a && !b ? true : !a || !b || a.val !== b.val ? false : mirror(a.left, b.right) && mirror(a.right, b.left);
  return mirror(root.left, root.right);
}`
  },
  {
    id: "subtree-of-another-tree", t: "Subtree of Another Tree", d: "E", tp: ["trees", "recursion", "hashing"], pt: ["tree-traversal", "dfs"], co: ["Amazon", "Meta", "Microsoft"], lc: "subtree-of-another-tree",
    s: "Does root contain a subtree identical to subRoot (same structure and values)?", h: ["At every node of root, check sameTree(node, subRoot).", "Faster: serialize both trees and search for a substring (with null markers)."],
    a: "DFS over root calling Same Tree.", tc: "O(m · n)", sc: "O(h)", sim: ["same-tree", "symmetric-tree"],
    fn: "isSubtree", params: "root:TreeNode, subRoot:TreeNode", ret: "boolean",
    ex: [[[3, 4, 5, 1, 2], [4, 1, 2], true], [[3, 4, 5, 1, 2, null, null, null, null, 0], [4, 1, 2], false]], hid: [[[1, 1], [1]], [[12], [2]], [[1, 2, 3], [1, 2]]],
    code: `function isSubtree(root, subRoot) {
  const same = (a, b) => !a && !b ? true : !a || !b || a.val !== b.val ? false : same(a.left, b.left) && same(a.right, b.right);
  const dfs = n => !!n && (same(n, subRoot) || dfs(n.left) || dfs(n.right));
  return dfs(root);
}`
  },
  {
    id: "path-sum", t: "Path Sum", d: "E", tp: ["trees", "dfs", "recursion"], pt: ["tree-traversal", "dfs"], co: ["Amazon", "Microsoft", "Meta"], lc: "path-sum",
    s: "Is there a root-to-leaf path whose values sum to targetSum?", h: ["Subtract the node's value as you go down.", "At a leaf, check whether the remainder equals its value."],
    a: "DFS with a remaining target.", tc: "O(n)", sc: "O(h)", sim: ["path-sum-ii", "path-sum-iii", "sum-root-to-leaf"],
    fn: "hasPathSum", params: "root:TreeNode, targetSum:number", ret: "boolean",
    ex: [[[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], 22, true], [[1, 2, 3], 5, false], [[], 0, false]], hid: [[[1, 2], 1], [[-2, null, -3], -5], [[1], 1]],
    code: `function hasPathSum(root, targetSum) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === targetSum;
  return hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val);
}`
  },
  {
    id: "path-sum-ii", t: "Path Sum II", d: "M", tp: ["trees", "backtracking", "dfs"], pt: ["backtracking", "tree-traversal"], co: ["Amazon", "Meta", "Bloomberg"], lc: "path-sum-ii",
    s: "Return every root-to-leaf path whose sum equals targetSum.", h: ["Carry the current path in an array.", "Push on the way down, pop on the way back (backtracking); copy the path at a matching leaf."],
    a: "DFS + backtracking path.", tc: "O(n²) worst", sc: "O(h)", sim: ["path-sum", "binary-tree-paths", "combination-sum"],
    fn: "pathSum", params: "root:TreeNode, targetSum:number", ret: "number[][]", cmp: "outer",
    ex: [[[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], 22, [[5, 4, 11, 2], [5, 8, 4, 5]]], [[1, 2, 3], 5, []]], hid: [[[1, 2], 0], [[1, -2, -3, 1, 3, -2, null, -1], -1], [[0, 1, 1], 1]],
    code: `function pathSum(root, targetSum) {
  const res = [], path = [];
  const dfs = (n, rem) => {
    if (!n) return;
    path.push(n.val);
    if (!n.left && !n.right && rem === n.val) res.push([...path]);
    dfs(n.left, rem - n.val); dfs(n.right, rem - n.val);
    path.pop();
  };
  dfs(root, targetSum);
  return res;
}`
  },
  {
    id: "path-sum-iii", t: "Path Sum III", d: "M", tp: ["trees", "prefix-sum", "hashing", "dfs"], pt: ["prefix-sum", "tree-traversal"], co: ["Amazon", "Meta", "Google"], lc: "path-sum-iii",
    s: "Count downward paths (any start, any end, parent → child) whose values sum to targetSum.", h: ["It's Subarray Sum Equals K on every root-to-node path.", "Keep a Map of prefix sums along the current path; remove on backtrack."],
    a: "DFS + prefix-sum Map with backtracking.", tc: "O(n)", sc: "O(h)", sim: ["subarray-sum-k", "path-sum-ii"],
    fn: "pathSum", params: "root:TreeNode, targetSum:number", ret: "number",
    ex: [[[10, 5, -3, 3, 2, null, 11, 3, -2, null, 1], 8, 3], [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], 22, 3]], hid: [[[], 0], [[1], 1], [[0, 1, 1], 1], [[1, -2, -3], -1]],
    code: `function pathSum(root, targetSum) {
  const seen = new Map([[0, 1]]);
  const dfs = (n, sum) => {
    if (!n) return 0;
    sum += n.val;
    let count = seen.get(sum - targetSum) || 0;
    seen.set(sum, (seen.get(sum) || 0) + 1);
    count += dfs(n.left, sum) + dfs(n.right, sum);
    seen.set(sum, seen.get(sum) - 1);
    return count;
  };
  return dfs(root, 0);
}`
  },
  {
    id: "min-depth", t: "Minimum Depth of Binary Tree", d: "E", tp: ["trees", "bfs", "dfs"], pt: ["bfs", "tree-traversal"], co: ["Amazon", "Meta", "Microsoft"], lc: "minimum-depth-of-binary-tree",
    s: "Return the number of nodes on the shortest root-to-leaf path.", h: ["A node with one child is not a leaf.", "BFS stops at the first leaf it sees."],
    a: "Level-order BFS, return the level of the first leaf.", tc: "O(n)", sc: "O(w)", sim: ["max-depth", "level-order"],
    fn: "minDepth", params: "root:TreeNode", ret: "number",
    ex: [[[3, 9, 20, null, null, 15, 7], 2], [[2, null, 3, null, 4, null, 5, null, 6], 5]], hid: [[[]], [[1]], [[1, 2, 3, 4, 5]]],
    code: `function minDepth(root) {
  if (!root) return 0;
  let q = [root], depth = 1;
  while (q.length) {
    const next = [];
    for (const n of q) {
      if (!n.left && !n.right) return depth;
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    }
    q = next; depth++;
  }
  return depth;
}`
  },
  {
    id: "right-side-view", t: "Binary Tree Right Side View", d: "M", tp: ["trees", "bfs", "dfs", "queue"], pt: ["bfs", "tree-traversal"], co: ["Meta", "Amazon", "Bloomberg", "Microsoft"], lc: "binary-tree-right-side-view",
    s: "Return the values visible from the right side, top to bottom.", h: ["It's the last node of each level.", "Level-order BFS, or DFS visiting right first and recording the first node per depth."],
    a: "BFS; take the last value of each level.", tc: "O(n)", sc: "O(w)", sim: ["level-order", "bottom-left-value", "zigzag-level-order"],
    fn: "rightSideView", params: "root:TreeNode", ret: "number[]",
    ex: [[[1, 2, 3, null, 5, null, 4], [1, 3, 4]], [[1, null, 3], [1, 3]], [[], []]], hid: [[[1, 2, 3, 4]], [[1, 2]]],
    code: `function rightSideView(root) {
  const res = [];
  const dfs = (n, d) => { if (!n) return; if (d === res.length) res.push(n.val); dfs(n.right, d + 1); dfs(n.left, d + 1); };
  dfs(root, 0);
  return res;
}`
  },
  {
    id: "zigzag-level-order", t: "Binary Tree Zigzag Level Order Traversal", d: "M", tp: ["trees", "bfs", "queue"], pt: ["bfs", "tree-traversal"], co: ["Amazon", "Meta", "Microsoft", "Bloomberg"], lc: "binary-tree-zigzag-level-order-traversal",
    s: "Return level order values, alternating left→right and right→left.", h: ["Normal BFS by levels.", "Reverse every other level before adding it."],
    a: "BFS + reverse odd levels.", tc: "O(n)", sc: "O(w)", sim: ["level-order", "right-side-view", "average-of-levels"],
    fn: "zigzagLevelOrder", params: "root:TreeNode", ret: "number[][]",
    ex: [[[3, 9, 20, null, null, 15, 7], [[3], [20, 9], [15, 7]]], [[1], [[1]]], [[], []]], hid: [[[1, 2, 3, 4, null, null, 5]], [[1, 2, 3, 4, 5, 6, 7, 8]]],
    code: `function zigzagLevelOrder(root) {
  if (!root) return [];
  const res = [];
  let q = [root];
  while (q.length) {
    const vals = q.map(n => n.val);
    res.push(res.length % 2 ? vals.reverse() : vals);
    q = q.flatMap(n => [n.left, n.right].filter(Boolean));
  }
  return res;
}`
  },
  {
    id: "average-of-levels", t: "Average of Levels in Binary Tree", d: "E", tp: ["trees", "bfs", "queue"], pt: ["bfs"], co: ["Meta", "Amazon"], lc: "average-of-levels-in-binary-tree",
    s: "Return the average value of the nodes on each level.", h: ["BFS level by level.", "Sum each level and divide by its size."],
    a: "Level-order traversal.", tc: "O(n)", sc: "O(w)", sim: ["level-order", "zigzag-level-order"],
    fn: "averageOfLevels", params: "root:TreeNode", ret: "double[]", cmp: "float",
    ex: [[[3, 9, 20, null, null, 15, 7], [3, 14.5, 11]], [[3, 9, 20, 15, 7], [3, 14.5, 11]]], hid: [[[1]], [[2147483647, 2147483647, 2147483647]], [[5, 14, null, 1]]],
    code: `function averageOfLevels(root) {
  const res = [];
  let q = [root];
  while (q.length) {
    res.push(q.reduce((s, n) => s + n.val, 0) / q.length);
    q = q.flatMap(n => [n.left, n.right].filter(Boolean));
  }
  return res;
}`
  },
  {
    id: "bottom-left-value", t: "Find Bottom Left Tree Value", d: "M", tp: ["trees", "bfs", "dfs"], pt: ["bfs"], co: ["Microsoft", "Amazon"], lc: "find-bottom-left-tree-value",
    s: "Return the leftmost value in the last row of the tree.", h: ["BFS level by level: the first node of the last level.", "Or BFS right-to-left: the very last node visited."],
    a: "BFS right-to-left; answer is the last node dequeued.", tc: "O(n)", sc: "O(w)", sim: ["right-side-view", "level-order"],
    fn: "findBottomLeftValue", params: "root:TreeNode", ret: "number",
    ex: [[[2, 1, 3], 1], [[1, 2, 3, 4, null, 5, 6, null, null, 7], 7]], hid: [[[0]], [[1, null, 2]], [[1, 2, 3, 4, 5, 6, 7]]],
    code: `function findBottomLeftValue(root) {
  const q = [root];
  let last = root;
  for (let h = 0; h < q.length; h++) {
    last = q[h];
    if (last.right) q.push(last.right);
    if (last.left) q.push(last.left);
  }
  return last.val;
}`
  },
  {
    id: "count-good-nodes", t: "Count Good Nodes in Binary Tree", d: "M", tp: ["trees", "dfs"], pt: ["dfs", "tree-traversal"], co: ["Microsoft", "Amazon"], lc: "count-good-nodes-in-binary-tree",
    s: "A node is good if no node on the path from the root to it has a greater value. Count good nodes.", h: ["Pass the maximum seen so far down the recursion.", "A node is good if its value ≥ that maximum."],
    a: "DFS carrying the path maximum.", tc: "O(n)", sc: "O(h)", sim: ["validate-bst", "path-sum"],
    fn: "goodNodes", params: "root:TreeNode", ret: "number",
    ex: [[[3, 1, 4, 3, null, 1, 5], 4], [[3, 3, null, 4, 2], 3], [[1], 1]], hid: [[[2, null, 4, 10, 8, null, null, 4]], [[9, null, 3, 6]]],
    code: `function goodNodes(root) {
  const dfs = (n, mx) => !n ? 0 : (n.val >= mx ? 1 : 0) + dfs(n.left, Math.max(mx, n.val)) + dfs(n.right, Math.max(mx, n.val));
  return dfs(root, -Infinity);
}`
  },
  {
    id: "lca-binary-tree", t: "Lowest Common Ancestor of a Binary Tree", d: "M", tp: ["trees", "dfs", "recursion"], pt: ["tree-traversal", "dfs"], co: ["Meta", "Amazon", "Microsoft", "Google", "LinkedIn"], lc: "lowest-common-ancestor-of-a-binary-tree",
    s: "Return the lowest common ancestor of the nodes with values p and q (values are unique; return its value).", h: ["If a subtree contains p or q, report it upward.", "The first node where both sides report something is the LCA."],
    a: "Postorder recursion returning the found node.", tc: "O(n)", sc: "O(h)", note: "Simplified: p and q are values and you return the ancestor's value.", sim: ["lca-bst", "all-nodes-distance-k"],
    fn: "lowestCommonAncestor", params: "root:TreeNode, p:number, q:number", ret: "number",
    ex: [[[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1, 3], [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4, 5], [[1, 2], 1, 2, 1]], hid: [[[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 7, 8], [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 6, 4]],
    code: `function lowestCommonAncestor(root, p, q) {
  const dfs = n => {
    if (!n || n.val === p || n.val === q) return n;
    const l = dfs(n.left), r = dfs(n.right);
    return l && r ? n : l || r;
  };
  return dfs(root).val;
}`
  },
  {
    id: "build-tree-pre-in", t: "Construct Binary Tree from Preorder and Inorder", d: "M", tp: ["trees", "divide-conquer", "hashing", "recursion"], pt: ["recursion", "hashing"], co: ["Amazon", "Microsoft", "Bloomberg", "Google"], lc: "construct-binary-tree-from-preorder-and-inorder-traversal",
    s: "Rebuild the tree from its preorder and inorder traversals (values are unique).", h: ["preorder[0] is the root; its position in inorder splits left and right subtrees.", "Map value → inorder index for O(1) lookups; consume preorder left to right."],
    a: "Recursive build with index ranges.", tc: "O(n)", sc: "O(n)", sim: ["build-tree-in-post", "serialize-deserialize-tree"],
    fn: "buildTree", params: "preorder:number[], inorder:number[]", ret: "TreeNode",
    ex: [[[3, 9, 20, 15, 7], [9, 3, 15, 20, 7], [3, 9, 20, null, null, 15, 7]], [[-1], [-1], [-1]]], hid: [[[1, 2], [2, 1]], [[1, 2, 4, 5, 3, 6], [4, 2, 5, 1, 6, 3]]],
    code: `function buildTree(preorder, inorder) {
  const pos = new Map(inorder.map((v, i) => [v, i]));
  let p = 0;
  const build = (lo, hi) => {
    if (lo > hi) return null;
    const v = preorder[p++], node = new TreeNode(v), mid = pos.get(v);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  };
  return build(0, inorder.length - 1);
}`
  },
  {
    id: "build-tree-in-post", t: "Construct Binary Tree from Inorder and Postorder", d: "M", tp: ["trees", "divide-conquer", "hashing", "recursion"], pt: ["recursion", "hashing"], co: ["Amazon", "Microsoft"], lc: "construct-binary-tree-from-inorder-and-postorder-traversal",
    s: "Rebuild the tree from its inorder and postorder traversals.", h: ["The last postorder value is the root.", "Consume postorder from the end, building the right subtree first."],
    a: "Recursive build, right subtree before left.", tc: "O(n)", sc: "O(n)", sim: ["build-tree-pre-in"],
    fn: "buildTree", params: "inorder:number[], postorder:number[]", ret: "TreeNode",
    ex: [[[9, 3, 15, 20, 7], [9, 15, 7, 20, 3], [3, 9, 20, null, null, 15, 7]], [[-1], [-1], [-1]]], hid: [[[2, 1], [2, 1]], [[4, 2, 5, 1, 6, 3], [4, 5, 2, 6, 3, 1]]],
    code: `function buildTree(inorder, postorder) {
  const pos = new Map(inorder.map((v, i) => [v, i]));
  let p = postorder.length - 1;
  const build = (lo, hi) => {
    if (lo > hi) return null;
    const v = postorder[p--], node = new TreeNode(v), mid = pos.get(v);
    node.right = build(mid + 1, hi);
    node.left = build(lo, mid - 1);
    return node;
  };
  return build(0, inorder.length - 1);
}`
  },
  {
    id: "flatten-tree", t: "Flatten Binary Tree to Linked List", d: "M", tp: ["trees", "linked-list", "dfs", "stack"], pt: ["tree-traversal", "dfs"], co: ["Meta", "Microsoft", "Amazon"], lc: "flatten-binary-tree-to-linked-list",
    s: "Flatten the tree in place into a 'linked list' using right pointers, in preorder, with all left pointers null.", h: ["Preorder: node, left subtree, right subtree.", "For each node with a left child, splice the left subtree between the node and its right subtree."],
    a: "Morris-style: find the rightmost node of the left subtree and rewire.", tc: "O(n)", sc: "O(1)", sim: ["reorder-list", "increasing-order-bst"],
    fn: "flatten", params: "root:TreeNode", ret: "void", inplace: 0, note: "Modify the tree in place.",
    ex: [[[1, 2, 5, 3, 4, null, 6], [1, null, 2, null, 3, null, 4, null, 5, null, 6]], [[], []], [[0], [0]]], hid: [[[1, 2, 3]], [[1, null, 2, 3]]],
    code: `function flatten(root) {
  let cur = root;
  while (cur) {
    if (cur.left) {
      let p = cur.left;
      while (p.right) p = p.right;
      p.right = cur.right;
      cur.right = cur.left;
      cur.left = null;
    }
    cur = cur.right;
  }
}`
  },
  {
    id: "max-path-sum", t: "Binary Tree Maximum Path Sum", d: "H", tp: ["trees", "dfs", "dp", "recursion"], pt: ["tree-traversal", "dp"], co: ["Meta", "Amazon", "Google", "Microsoft", "DoorDash"], lc: "binary-tree-maximum-path-sum",
    s: "A path can start and end at any nodes. Return the maximum path sum.", h: ["For each node, the best downward path is node + max(0, left gain, right gain).", "The best path through the node uses both gains; track that globally."],
    a: "Postorder DFS returning the best single-branch gain.", tc: "O(n)", sc: "O(h)", sim: ["diameter-binary-tree", "max-subarray", "house-robber-iii"],
    fn: "maxPathSum", params: "root:TreeNode", ret: "number",
    ex: [[[1, 2, 3], 6], [[-10, 9, 20, null, null, 15, 7], 42]], hid: [[[-3]], [[2, -1]], [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]], [[-2, -1]]],
    code: `function maxPathSum(root) {
  let best = -Infinity;
  const gain = n => {
    if (!n) return 0;
    const l = Math.max(0, gain(n.left)), r = Math.max(0, gain(n.right));
    best = Math.max(best, n.val + l + r);
    return n.val + Math.max(l, r);
  };
  gain(root);
  return best;
}`
  },
  {
    id: "binary-tree-paths", t: "Binary Tree Paths", d: "E", tp: ["trees", "backtracking", "dfs", "strings"], pt: ["backtracking", "tree-traversal"], co: ["Google", "Meta", "Apple"], lc: "binary-tree-paths",
    s: "Return all root-to-leaf paths as strings like \"1->2->5\", in any order.", h: ["DFS carrying the path so far.", "At a leaf, join the path."],
    a: "DFS with a string (or array) path.", tc: "O(n · h)", sc: "O(h)", sim: ["path-sum-ii", "sum-root-to-leaf"],
    fn: "binaryTreePaths", params: "root:TreeNode", ret: "string[]", cmp: "unordered",
    ex: [[[1, 2, 3, null, 5], ["1->2->5", "1->3"]], [[1], ["1"]]], hid: [[[1, 2]], [[1, 2, 3, 4, 5, 6, 7]]],
    code: `function binaryTreePaths(root) {
  const res = [];
  const dfs = (n, path) => {
    if (!n) return;
    const p = path ? path + "->" + n.val : String(n.val);
    if (!n.left && !n.right) res.push(p);
    dfs(n.left, p); dfs(n.right, p);
  };
  dfs(root, "");
  return res;
}`
  },
  {
    id: "sum-root-to-leaf", t: "Sum Root to Leaf Numbers", d: "M", tp: ["trees", "dfs", "math-basics"], pt: ["tree-traversal", "dfs"], co: ["Meta", "Amazon", "Microsoft"], lc: "sum-root-to-leaf-numbers",
    s: "Each root-to-leaf path forms a number (digits top to bottom). Return the sum of all these numbers.", h: ["Pass the number built so far: cur · 10 + node.val.", "Add it to the total at each leaf."],
    a: "DFS carrying the partial number.", tc: "O(n)", sc: "O(h)", sim: ["binary-tree-paths", "path-sum"],
    fn: "sumNumbers", params: "root:TreeNode", ret: "number",
    ex: [[[1, 2, 3], 25], [[4, 9, 0, 5, 1], 1026]], hid: [[[0]], [[1, 0]], [[9, 9, 9, 9]]],
    code: `function sumNumbers(root) {
  const dfs = (n, cur) => {
    if (!n) return 0;
    cur = cur * 10 + n.val;
    if (!n.left && !n.right) return cur;
    return dfs(n.left, cur) + dfs(n.right, cur);
  };
  return dfs(root, 0);
}`
  },
  {
    id: "all-nodes-distance-k", t: "All Nodes Distance K in Binary Tree", d: "M", tp: ["trees", "bfs", "graph", "hashing"], pt: ["bfs", "graph-traversal"], co: ["Meta", "Amazon", "Google", "Microsoft"], lc: "all-nodes-distance-k-in-binary-tree",
    s: "Return the values of all nodes exactly k edges from the node with value target, in any order.", h: ["A tree is a graph; add parent links.", "BFS from the target over left, right and parent edges."],
    a: "Record parents with DFS, then BFS k levels from the target.", tc: "O(n)", sc: "O(n)", note: "target is given as a value.", sim: ["lca-binary-tree", "rotting-oranges"],
    fn: "distanceK", params: "root:TreeNode, target:number, k:number", ret: "number[]", cmp: "unordered",
    ex: [[[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 2, [7, 4, 1]], [[1], 1, 3, []]], hid: [[[0, 1, null, 3, 2], 2, 1], [[0, 2, 1, null, null, 3], 3, 3], [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 3, 0]],
    code: `function distanceK(root, target, k) {
  const parent = new Map();
  let start = null;
  const dfs = (n, p) => { if (!n) return; parent.set(n, p); if (n.val === target) start = n; dfs(n.left, n); dfs(n.right, n); };
  dfs(root, null);
  let q = [start];
  const seen = new Set([start]);
  for (let d = 0; d < k && q.length; d++) {
    const next = [];
    for (const n of q) for (const nb of [n.left, n.right, parent.get(n)]) if (nb && !seen.has(nb)) { seen.add(nb); next.push(nb); }
    q = next;
  }
  return q.map(n => n.val);
}`
  },
  {
    id: "vertical-order-traversal", t: "Vertical Order Traversal of a Binary Tree", d: "H", tp: ["trees", "bfs", "sorting", "hashing"], pt: ["tree-traversal", "hashing"], co: ["Meta", "Amazon", "Microsoft", "Bloomberg"], lc: "vertical-order-traversal-of-a-binary-tree",
    s: "Group nodes by column (left to right); within a column sort by row, then by value.", h: ["Record (col, row, val) for every node.", "Sort by col, row, val and group by col."],
    a: "DFS collecting triples, sort, group.", tc: "O(n log n)", sc: "O(n)", sim: ["zigzag-level-order", "level-order"],
    fn: "verticalTraversal", params: "root:TreeNode", ret: "number[][]",
    ex: [[[3, 9, 20, null, null, 15, 7], [[9], [3, 15], [20], [7]]], [[1, 2, 3, 4, 5, 6, 7], [[4], [2], [1, 5, 6], [3], [7]]], [[1, 2, 3, 4, 6, 5, 7], [[4], [2], [1, 5, 6], [3], [7]]]], hid: [[[1]], [[3, 1, 4, 0, 2, 2]]],
    code: `function verticalTraversal(root) {
  const nodes = [];
  const dfs = (n, r, c) => { if (!n) return; nodes.push([c, r, n.val]); dfs(n.left, r + 1, c - 1); dfs(n.right, r + 1, c + 1); };
  dfs(root, 0, 0);
  nodes.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  const res = [];
  let prev = null;
  for (const [c, , v] of nodes) {
    if (c !== prev) { res.push([]); prev = c; }
    res[res.length - 1].push(v);
  }
  return res;
}`
  },
  {
    id: "max-width-binary-tree", t: "Maximum Width of Binary Tree", d: "M", tp: ["trees", "bfs", "queue"], pt: ["bfs"], co: ["Amazon", "Google", "Meta"], lc: "maximum-width-of-binary-tree",
    s: "Width of a level = distance between its leftmost and rightmost non-null nodes (counting the gaps). Return the maximum width.", h: ["Number nodes like a heap: left = 2i, right = 2i + 1.", "Re-base indexes per level to avoid overflow."],
    a: "BFS with positional indexes, normalized per level.", tc: "O(n)", sc: "O(w)", sim: ["level-order", "count-complete-tree-nodes"],
    fn: "widthOfBinaryTree", params: "root:TreeNode", ret: "number",
    ex: [[[1, 3, 2, 5, 3, null, 9], 4], [[1, 3, 2, 5, null, null, 9, 6, null, 7], 7], [[1, 3, 2, 5], 2]], hid: [[[1]], [[1, 1, 1, 1, null, null, 1, 1, null, null, 1]]],
    code: `function widthOfBinaryTree(root) {
  let best = 0, q = [[root, 0]];
  while (q.length) {
    const base = q[0][1];
    best = Math.max(best, q[q.length - 1][1] - base + 1);
    const next = [];
    for (const [n, i] of q) {
      const j = i - base;
      if (n.left) next.push([n.left, 2 * j]);
      if (n.right) next.push([n.right, 2 * j + 1]);
    }
    q = next;
  }
  return best;
}`
  },
  {
    id: "house-robber-iii", t: "House Robber III", d: "M", tp: ["trees", "dp", "dfs"], pt: ["dp", "tree-traversal"], co: ["Uber", "Google", "Amazon"], lc: "house-robber-iii",
    s: "Houses form a binary tree; you can't rob a node and its direct child. Return the maximum loot.", h: ["For each node return two values: best if robbed, best if not.", "rob = val + notRob(left) + notRob(right); skip = max(left pair) + max(right pair)."],
    a: "Postorder DP returning [rob, skip].", tc: "O(n)", sc: "O(h)", sim: ["house-robber", "house-robber-ii", "max-path-sum"],
    fn: "rob", params: "root:TreeNode", ret: "number",
    ex: [[[3, 2, 3, null, 3, null, 1], 7], [[3, 4, 5, 1, 3, null, 1], 9]], hid: [[[1]], [[4, 1, null, 2, null, 3]], [[2, 1, 3, null, 4]]],
    code: `function rob(root) {
  const go = n => {
    if (!n) return [0, 0];
    const [lr, ls] = go(n.left), [rr, rs] = go(n.right);
    return [n.val + ls + rs, Math.max(lr, ls) + Math.max(rr, rs)];
  };
  return Math.max(...go(root));
}`
  },
  {
    id: "binary-tree-cameras", t: "Binary Tree Cameras", d: "H", tp: ["trees", "greedy", "dp", "dfs"], pt: ["greedy", "tree-traversal"], co: ["Google", "Amazon", "Meta"], lc: "binary-tree-cameras",
    s: "A camera watches its parent, itself and its children. Return the minimum number of cameras to watch every node.", h: ["Leaves should never hold cameras; their parents should.", "Postorder states: 0 = not covered, 1 = has camera, 2 = covered."],
    a: "Greedy postorder with three states.", tc: "O(n)", sc: "O(h)", sim: ["house-robber-iii", "distribute-coins"],
    fn: "minCameraCover", params: "root:TreeNode", ret: "number",
    ex: [[[0, 0, null, 0, 0], 1], [[0, 0, null, 0, null, 0, null, null, 0], 2]], hid: [[[0]], [[0, 0, 0]], [[0, 0, 0, null, null, null, 0]]],
    code: `function minCameraCover(root) {
  let cams = 0;
  const dfs = n => {
    if (!n) return 2;
    const l = dfs(n.left), r = dfs(n.right);
    if (l === 0 || r === 0) { cams++; return 1; }
    return l === 1 || r === 1 ? 2 : 0;
  };
  return dfs(root) === 0 ? cams + 1 : cams;
}`
  },
  {
    id: "distribute-coins", t: "Distribute Coins in Binary Tree", d: "M", tp: ["trees", "dfs", "greedy"], pt: ["tree-traversal", "dfs"], co: ["Google", "Amazon"], lc: "distribute-coins-in-binary-tree",
    s: "There are n coins across n nodes. A move shifts one coin along an edge. Return the moves needed so every node has one coin.", h: ["Each subtree has an excess (coins - nodes).", "That excess must cross the edge to the parent; add |excess| per edge."],
    a: "Postorder returning excess; sum absolute values.", tc: "O(n)", sc: "O(h)", sim: ["binary-tree-cameras", "max-path-sum"],
    fn: "distributeCoins", params: "root:TreeNode", ret: "number",
    ex: [[[3, 0, 0], 2], [[0, 3, 0], 3]], hid: [[[1]], [[1, 0, 2]], [[0, 0, null, 0, 0, 4]]],
    code: `function distributeCoins(root) {
  let moves = 0;
  const dfs = n => {
    if (!n) return 0;
    const l = dfs(n.left), r = dfs(n.right);
    moves += Math.abs(l) + Math.abs(r);
    return n.val + l + r - 1;
  };
  dfs(root);
  return moves;
}`
  },
  {
    id: "count-complete-tree-nodes", t: "Count Complete Tree Nodes", d: "E", tp: ["trees", "binary-search", "recursion"], pt: ["binary-search", "tree-traversal"], co: ["Google", "Amazon"], lc: "count-complete-tree-nodes",
    s: "Count the nodes of a complete binary tree in less than O(n).", h: ["If the leftmost and rightmost depths are equal, the tree is perfect: 2^h - 1 nodes.", "Otherwise recurse on both children."],
    a: "Perfect-subtree shortcut; O(log² n).", tc: "O(log² n)", sc: "O(log n)", sim: ["max-width-binary-tree", "max-depth"],
    fn: "countNodes", params: "root:TreeNode", ret: "number",
    ex: [[[1, 2, 3, 4, 5, 6], 6], [[], 0], [[1], 1]], hid: [[[1, 2, 3, 4, 5, 6, 7]], [[1, 2]]],
    code: `function countNodes(root) {
  if (!root) return 0;
  let l = 0, r = 0;
  for (let n = root; n; n = n.left) l++;
  for (let n = root; n; n = n.right) r++;
  if (l === r) return 2 ** l - 1;
  return 1 + countNodes(root.left) + countNodes(root.right);
}`
  },
  {
    id: "merge-two-binary-trees", t: "Merge Two Binary Trees", d: "E", tp: ["trees", "recursion", "dfs"], pt: ["tree-traversal", "recursion"], co: ["Amazon", "Adobe"], lc: "merge-two-binary-trees",
    s: "Overlay two trees: overlapping nodes sum their values; otherwise use whichever node exists.", h: ["If either node is null, return the other.", "Otherwise sum and recurse on both children."],
    a: "Simultaneous recursion.", tc: "O(min(m, n))", sc: "O(h)", sim: ["same-tree", "invert-tree"],
    fn: "mergeTrees", params: "root1:TreeNode, root2:TreeNode", ret: "TreeNode",
    ex: [[[1, 3, 2, 5], [2, 1, 3, null, 4, null, 7], [3, 4, 5, 5, 4, null, 7]], [[1], [1, 2], [2, 2]]], hid: [[[], [1]], [[], []]],
    code: `function mergeTrees(root1, root2) {
  if (!root1 || !root2) return root1 || root2;
  root1.val += root2.val;
  root1.left = mergeTrees(root1.left, root2.left);
  root1.right = mergeTrees(root1.right, root2.right);
  return root1;
}`
  },
  {
    id: "cousins-binary-tree", t: "Cousins in Binary Tree", d: "E", tp: ["trees", "bfs", "dfs"], pt: ["bfs"], co: ["Amazon", "Bloomberg"], lc: "cousins-in-binary-tree",
    s: "Nodes with values x and y are cousins if they have the same depth but different parents.", h: ["Record depth and parent for x and y.", "BFS or DFS both work."],
    a: "DFS recording (depth, parent) for both values.", tc: "O(n)", sc: "O(h)", sim: ["level-order", "lca-binary-tree"],
    fn: "isCousins", params: "root:TreeNode, x:number, y:number", ret: "boolean",
    ex: [[[1, 2, 3, 4], 4, 3, false], [[1, 2, 3, null, 4, null, 5], 5, 4, true], [[1, 2, 3, null, 4], 2, 3, false]], hid: [[[1, 2, 3, 4, 5], 4, 5], [[1, 2, 3, null, 4, 5], 4, 5]],
    code: `function isCousins(root, x, y) {
  const info = {};
  const dfs = (n, p, d) => { if (!n) return; if (n.val === x || n.val === y) info[n.val] = [p, d]; dfs(n.left, n, d + 1); dfs(n.right, n, d + 1); };
  dfs(root, null, 0);
  return info[x][1] === info[y][1] && info[x][0] !== info[y][0];
}`
  },
  {
    id: "maximum-binary-tree", t: "Maximum Binary Tree", d: "M", tp: ["trees", "stack", "monotonic-stack", "divide-conquer"], pt: ["monotonic-stack", "recursion"], co: ["Microsoft", "Amazon"], lc: "maximum-binary-tree",
    s: "Build the tree: the root is the maximum; the left subtree is built from the part before it, the right from the part after.", h: ["Recursion on subarrays is O(n²) worst case.", "A decreasing stack builds it in O(n): pop smaller nodes into the new node's left."],
    a: "Monotonic decreasing stack of nodes.", tc: "O(n)", sc: "O(n)", sim: ["build-tree-pre-in", "next-greater-element-i"],
    fn: "constructMaximumBinaryTree", params: "nums:number[]", ret: "TreeNode",
    ex: [[[3, 2, 1, 6, 0, 5], [6, 3, 5, null, 2, 0, null, null, 1]], [[3, 2, 1], [3, null, 2, null, 1]]], hid: [[[1]], [[1, 2, 3]]],
    code: `function constructMaximumBinaryTree(nums) {
  const st = [];
  for (const x of nums) {
    const node = new TreeNode(x);
    while (st.length && st[st.length - 1].val < x) node.left = st.pop();
    if (st.length) st[st.length - 1].right = node;
    st.push(node);
  }
  return st[0];
}`
  },
  {
    id: "serialize-deserialize-tree", t: "Serialize and Deserialize Binary Tree", d: "H", tp: ["trees", "bfs", "dfs", "strings"], pt: ["tree-traversal", "bfs"], co: ["Amazon", "Meta", "Google", "Microsoft", "LinkedIn"], lc: "serialize-and-deserialize-binary-tree",
    s: "Design Codec with serialize(root) → string and deserialize(data) → tree. The judge calls roundTrip(root), which should return deserialize(serialize(root)); any string format is allowed.", h: ["Preorder with a marker for null (e.g. '#') is enough to rebuild the tree.", "Deserialize by reading tokens in the same preorder."],
    a: "Preorder with null markers, split by commas.", tc: "O(n)", sc: "O(n)", note: "Implement serialize and deserialize; roundTrip is how the judge checks them.", sim: ["build-tree-pre-in", "same-tree"],
    fn: "roundTrip", params: "root:TreeNode", ret: "TreeNode",
    ex: [[[1, 2, 3, null, null, 4, 5], [1, 2, 3, null, null, 4, 5]], [[], []]], hid: [[[1]], [[-1, 0, 1]], [[1, 2, null, 3, null, 4]]],
    code: `function serialize(root) {
  const out = [];
  const dfs = n => { if (!n) { out.push("#"); return; } out.push(n.val); dfs(n.left); dfs(n.right); };
  dfs(root);
  return out.join(",");
}
function deserialize(data) {
  const tok = data.split(",");
  let i = 0;
  const build = () => { const t = tok[i++]; if (t === "#") return null; const n = new TreeNode(Number(t)); n.left = build(); n.right = build(); return n; };
  return build();
}
function roundTrip(root) {
  return deserialize(serialize(root));
}`
  }
];
