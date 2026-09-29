import type { Lesson } from "@/lib/types";

const trees: Lesson = {
  what: "A tree is a hierarchy of nodes. There's one root at the top, and every node can have children. A binary tree limits each node to at most two children: left and right.",
  analogy: { short: "A family tree / folder system", text: "Your computer's folders form a tree: one root folder, folders inside folders, and files as leaves. To find a file you walk down one path from the root." },
  eli5: "Think of an upside-down tree. The top is the root. It splits into branches, which split into smaller branches, until you reach leaves that don't split anymore.",
  tech: "A binary tree node has val, left, right. Depth of a node = edges from root; height = longest root-to-leaf path. A Binary Search Tree (BST) keeps left < node < right, giving O(h) search where h is the height (O(log n) if balanced, O(n) if skewed). Traversals: preorder, inorder, postorder (DFS) and level order (BFS).",
  why: "Hierarchical data (DOM, file systems, org charts, JSON) is a tree. BSTs give fast ordered search/insert. Trees are the most common interview topic because they test recursion thinking.",
  how: ["Almost every tree problem: solve for the left subtree, solve for the right, combine at the node.", "Preorder: node → left → right (copying a tree).", "Inorder: left → node → right (sorted order in a BST).", "Postorder: left → right → node (computing heights, deleting).", "Level order: BFS with a queue, row by row."],
  props: ["One root, no cycles", "n nodes → n - 1 edges", "Binary tree: ≤ 2 children", "BST: left < root < right, inorder is sorted", "Balanced height ≈ log n"],
  use: ["Hierarchical data", "Ordered data with fast insert/search (BST)", "Expression parsing", "Priority queues (heap), prefix search (trie)"],
  avoid: ["Flat sequential data (array)", "Many-to-many relationships (graph)"],
  viz: "tree",
  cx: [["Traverse all nodes", "O(n)", "Each node visited once."], ["BST search/insert (balanced)", "O(log n)", "Each step goes one level down; height is log n."], ["BST search/insert (skewed)", "O(n)", "A sorted insert order makes a linked-list-like tree."], ["Recursion space", "O(h)", "Call stack depth equals tree height."], ["Level order space", "O(w)", "Queue holds up to one full level (width)."]],
  space: "O(h) for DFS recursion, O(w) for BFS.",
  code: {
    c: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val; this.left = left; this.right = right;
  }
}
//        4
//      /   \\
//     2     6
//    / \\   / \\
//   1   3 5   7
const root = new TreeNode(4,
  new TreeNode(2, new TreeNode(1), new TreeNode(3)),
  new TreeNode(6, new TreeNode(5), new TreeNode(7)));

function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node.val);
  inorder(node.right, out);
  return out;
}
console.log(inorder(root));`,
    hl: [16, 17, 18, 19],
    ex: { 16: "Base case: an empty subtree contributes nothing.", 17: "Visit everything on the left first…", 18: "…then this node…", 19: "…then the right. In a BST that gives sorted order." }
  },
  examples: [
    { lvl: "Easy", title: "Maximum depth", prob: "How many levels does the tree have?", idea: "Depth of a node = 1 + max(depth of left, depth of right). Empty tree = 0.", c: `class TreeNode { constructor(v, l = null, r = null) { this.val = v; this.left = l; this.right = r; } }
const root = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));

function maxDepth(node) {
  if (!node) return 0;
  return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
}
console.log(maxDepth(root));`, time: "O(n)", space: "O(h)" },
    { lvl: "Practical", title: "Level order traversal (BFS)", prob: "Return the values level by level.", idea: "Queue the root. For each level, remember how many nodes are in the queue, process exactly that many, and queue their children.", c: `class TreeNode { constructor(v, l = null, r = null) { this.val = v; this.left = l; this.right = r; } }
const root = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));

function levelOrder(root) {
  if (!root) return [];
  const res = [], q = [root];
  let head = 0;
  while (head < q.length) {
    const size = q.length - head, level = [];
    for (let i = 0; i < size; i++) {
      const node = q[head++];
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    res.push(level);
  }
  return res;
}
console.log(levelOrder(root));`, time: "O(n)", space: "O(w)", ex: { 9: "Snapshot the level size BEFORE adding children, so levels don't mix." } },
    { lvl: "Interview", title: "Validate a BST", prob: "Check that every node respects left < node < right for its whole subtree.", idea: "Comparing a node only with its children is not enough. Pass down the allowed range (min, max) and tighten it as you go.", c: `class TreeNode { constructor(v, l = null, r = null) { this.val = v; this.left = l; this.right = r; } }

function isValidBST(node, min = -Infinity, max = Infinity) {
  if (!node) return true;
  if (node.val <= min || node.val >= max) return false;
  return isValidBST(node.left, min, node.val) &&
         isValidBST(node.right, node.val, max);
}
const good = new TreeNode(5, new TreeNode(3), new TreeNode(8, new TreeNode(6), new TreeNode(9)));
const bad = new TreeNode(5, new TreeNode(3), new TreeNode(8, new TreeNode(4), new TreeNode(9)));
console.log(isValidBST(good));
console.log(isValidBST(bad));`, time: "O(n)", space: "O(h)", ex: { 6: "Going left: everything must be smaller than this node → new max.", 7: "Going right: everything must be bigger than this node → new min." } }
  ],
  signals: [["\"root\", \"subtree\", \"leaf\", \"ancestor\"", "Tree recursion (DFS)"], ["\"level\", \"row\", \"minimum depth\", \"right side view\"", "BFS level order"], ["\"sorted\" + tree / \"k-th smallest\"", "BST inorder"], ["\"path sum\", \"diameter\"", "Postorder: compute from children, combine"]],
  mistakes: [["Validating a BST by comparing only with direct children", "Pass min/max bounds down the recursion."], ["Forgetting the null base case", "Every recursive tree function starts with if (!node)."], ["Mixing up height and depth", "Height counts down to leaves, depth counts from the root."], ["Assuming BST operations are always O(log n)", "Only if balanced. Skewed trees are O(n)."]],
  js: ["Represent trees with a class or { val, left, right } objects.", "Level-order arrays like [3, 9, 20, null, null, 15, 7] are LeetCode's input format; write a helper to build trees from them."],
  iq: { Beginner: ["Count nodes", "Sum of all nodes"], Easy: ["max-depth", "invert-tree", "same-tree", "Symmetric tree"], Medium: ["level-order", "validate-bst", "lca-bst", "Kth smallest in BST"], Hard: ["Binary tree maximum path sum", "Serialize and deserialize"] },
  rev: { s30: "Root + children, no cycles. Most problems: recurse left, recurse right, combine. BFS with a queue for levels. BST inorder = sorted.", m2: ["DFS orders: pre (N L R), in (L N R), post (L R N)", "BFS: size snapshot per level", "BST: search O(h); validate with min/max bounds", "Space O(h) recursion"] },
  cheat: `TREES CHEAT SHEET

Traverse   → O(n)
BST ops    → O(h)  (log n balanced, n skewed)
Space      → O(h) DFS, O(w) BFS

Template:
function f(node):
  if (!node) return base
  L = f(node.left); R = f(node.right)
  return combine(node, L, R)

Pre  N L R   copy / serialize
In   L N R   BST sorted order
Post L R N   heights / sizes
BFS  queue   levels / min depth`
};

export default trees;
