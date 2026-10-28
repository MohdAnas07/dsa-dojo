import type { Lesson } from "@/lib/types";

const T = "function T(v, l = null, r = null) { return { val: v, left: l, right: r }; }\n";

const bst: Lesson = {
  what: "A binary search tree (BST) is a binary tree with an ordering rule: every value in a node's left subtree is smaller than the node, and every value in its right subtree is larger. That rule lets you search, insert and delete by walking a single path down from the root.",
  analogy: { short: "The 'higher or lower' guessing game", text: "When a friend says 'higher' or 'lower' after each guess, you throw away half the possibilities every time. A BST builds those answers into its shape: at each node you go left for smaller and right for bigger." },
  eli5: "A sorting tree. Smaller numbers always go to the left, bigger numbers to the right. To find a number, you just keep turning left or right until you reach it.",
  tech: "Search, insert and delete cost O(h), where h is the tree's height: O(log n) when the tree is balanced, but O(n) when it degenerates into a chain (for example after inserting already-sorted values). An inorder traversal visits the values in sorted order. Deleting a node with two children replaces it with its inorder successor, the smallest value in its right subtree. Self-balancing trees (AVL, red-black) keep h = O(log n); in interviews you usually work with a plain BST.",
  why: "When data must stay sorted while it changes, a BST gives fast inserts, deletes and lookups, plus ordered questions like 'k-th smallest', 'closest value' or 'everything in a range'. Many tree interview questions use the ordering rule to skip half of the tree at each step.",
  how: ["Search: compare with the node; go left if smaller, right if bigger, stop when equal or null.", "Insert: search for the value and attach a new node where the search falls off the tree.", "Delete a leaf: remove it. One child: replace the node with that child.", "Delete with two children: copy in the inorder successor's value, then delete the successor from the right subtree.", "Inorder traversal (left, node, right) gives sorted order."],
  props: ["Left < node < right, for every node and its whole subtrees", "Inorder traversal is sorted", "Speed depends on the height", "Minimum = leftmost node, maximum = rightmost node"],
  use: ["Ordered sets and maps", "Range queries", "k-th smallest / largest", "Floor and ceiling (closest values)", "Checking that data is ordered"],
  avoid: ["Only exact lookups (a hash map is O(1))", "Sorted input with no balancing (the tree becomes a chain, O(n))"],
  viz: "tree",
  cx: [["Search", "O(h)", "One comparison per level."], ["Insert", "O(h)", "Search for the spot, then attach."], ["Delete", "O(h)", "Find the node, maybe find its successor."], ["Inorder traversal", "O(n)", "Visits every node once."], ["h when balanced / skewed", "O(log n) / O(n)", "Sorted inserts make a chain."]],
  space: "O(n) nodes; O(h) recursion.",
  code: {
    c: `class Node {
  constructor(val) { this.val = val; this.left = null; this.right = null; }
}
function insert(root, val) {
  if (!root) return new Node(val);
  if (val < root.val) root.left = insert(root.left, val);
  else root.right = insert(root.right, val);
  return root;
}
function search(root, val) {
  while (root && root.val !== val) root = val < root.val ? root.left : root.right;
  return root !== null;
}
function inorder(root, out = []) {
  if (root) { inorder(root.left, out); out.push(root.val); inorder(root.right, out); }
  return out;
}
let root = null;
for (const x of [8, 3, 10, 1, 6, 14, 4]) root = insert(root, x);
console.log(inorder(root));
console.log(search(root, 6), search(root, 7));`,
    hl: [6, 11],
    ex: { 5: "The search fell off the tree here: this is where the new value belongs.", 6: "Smaller values belong in the left subtree.", 11: "Each step discards a whole subtree, so a search costs O(h).", 15: "Inorder (left, node, right) visits a BST in sorted order." }
  },
  brute: { title: "Brute force: an unsorted array", c: `const data = [8, 3, 10, 1, 6, 14, 4];
console.log(data.includes(6));
console.log([...data].sort((a, b) => a - b));`, time: "O(n) per search, O(n log n) to list in order", space: "O(n)", ex: { 2: "Every lookup scans the whole array." } },
  examples: [
    { lvl: "Easy", title: "Validate a BST", prob: "Check whether a binary tree follows the BST rule everywhere, not just between parent and child.", idea: "Pass down the range each node must fall in. Going left lowers the upper bound; going right raises the lower bound.", c: T + `function isValidBST(node, lo = -Infinity, hi = Infinity) {
  if (!node) return true;
  if (node.val <= lo || node.val >= hi) return false;
  return isValidBST(node.left, lo, node.val) && isValidBST(node.right, node.val, hi);
}
console.log(isValidBST(T(2, T(1), T(3))));
console.log(isValidBST(T(5, T(1), T(4, T(3), T(6)))));
console.log(isValidBST(T(5, T(4), T(6, T(3), T(7)))));`, time: "O(n)", space: "O(h)", ex: { 4: "The node must lie strictly between the bounds inherited from its ancestors.", 9: "3 is a fine child of 6, but it sits in 5's right subtree, so it must be > 5." } },
    { lvl: "Practical", title: "K-th smallest value", prob: "Return the k-th smallest value in a BST.", idea: "An inorder traversal visits values in increasing order; stop at the k-th visit. An explicit stack lets you stop early.", c: T + `function kthSmallest(root, k) {
  const stack = [];
  let node = root;
  while (node || stack.length) {
    while (node) { stack.push(node); node = node.left; }
    node = stack.pop();
    if (--k === 0) return node.val;
    node = node.right;
  }
}
const root = T(5, T(3, T(2, T(1)), T(4)), T(6));
console.log(kthSmallest(root, 1), kthSmallest(root, 3), kthSmallest(root, 6));`, time: "O(h + k)", space: "O(h)", ex: { 6: "Go as far left as possible: that is the next smallest value.", 8: "The k-th node visited in order is the answer." } },
    { lvl: "Interview", title: "Delete a node", prob: "Delete a value from a BST and keep it valid.", idea: "Leaves and one-child nodes are easy. For two children, copy in the inorder successor (the smallest value in the right subtree) and delete that successor instead.", c: T + `function deleteNode(root, key) {
  if (!root) return null;
  if (key < root.val) root.left = deleteNode(root.left, key);
  else if (key > root.val) root.right = deleteNode(root.right, key);
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let succ = root.right;
    while (succ.left) succ = succ.left;
    root.val = succ.val;
    root.right = deleteNode(root.right, succ.val);
  }
  return root;
}
const inorder = n => (n ? [...inorder(n.left), n.val, ...inorder(n.right)] : []);
const root = T(5, T(3, T(2), T(4)), T(6, null, T(7)));
console.log(inorder(deleteNode(root, 3)));
console.log(root.left.val);`, time: "O(h)", space: "O(h)", ex: { 7: "Zero or one child: the child takes the node's place.", 10: "The successor is the leftmost node of the right subtree.", 12: "Copy its value up, then remove the duplicate from the right subtree." } }
  ],
  signals: [["\"binary search tree\", \"BST\" in the statement", "Use left < node < right to skip subtrees"], ["\"k-th smallest\", \"in sorted order\"", "Inorder traversal"], ["\"closest value\", \"floor\", \"ceiling\"", "Walk one path, tracking the best"], ["\"range sum\", values between low and high", "Prune subtrees outside the range"], ["\"validate\"", "Pass min/max bounds down"]],
  mistakes: [["Validating only parent and child", "A value deep in the right subtree must still be bigger than every ancestor it's right of. Pass bounds down."], ["Forgetting that sorted inserts make a chain", "The tree degenerates to O(n). Mention balancing (AVL/red-black) in interviews."], ["Deleting a two-child node by just removing it", "Replace it with its inorder successor (or predecessor)."], ["Ignoring duplicates", "Decide whether duplicates go left, right or are rejected, and say so."]],
  js: ["Plain objects { val, left, right } work fine for interview trees.", "Recursion depth equals the height; very skewed trees can overflow the call stack."],
  iq: { Beginner: ["Insert values into a BST and print them in order"], Easy: ["range-sum-bst", "min-abs-diff-bst", "two-sum-bst", "sorted-array-to-bst"], Medium: ["validate-bst", "kth-smallest-bst", "lca-bst", "insert-into-bst", "delete-node-bst", "bst-iterator"], Hard: ["Recover a BST in which two nodes were swapped"] },
  rev: { s30: "A binary tree where left < node < right everywhere. Search, insert and delete walk one path: O(h), which is O(log n) when balanced. Inorder traversal is sorted.", m2: ["Go left if smaller, right if bigger", "Inorder = sorted order", "Validate with bounds, not just children", "Delete with two children → inorder successor", "Skewed tree → O(n)"] },
  cheat: `BST CHEAT SHEET

left < node < right (whole subtrees)
search/insert/delete → O(h)
balanced h = log n, skewed h = n
inorder → sorted

Validate: f(node, lo, hi)
  lo < node.val < hi
  f(left, lo, val) && f(right, val, hi)

Delete with 2 children:
  successor = leftmost of right subtree`
};

export default bst;
