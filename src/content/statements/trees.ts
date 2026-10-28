import type { Statement } from "./types";

export const TREE_NOTE = "Trees are written in level order with null for a missing child: [1,2,3,null,5] means 1 has children 2 and 3, and 2 has only a right child, 5.";

export const TREES_STATEMENTS: Record<string, Statement> = {
  "diameter-binary-tree": {
    body: [
      "Given the `root` of a binary tree, return the length of the diameter of the tree.",
      "The diameter is the length of the longest path between any two nodes. It may or may not pass through the root. The length of a path is the number of edges between its ends. " + TREE_NOTE
    ],
    why: [
      "The path 4 → 2 → 1 → 3 (or 5 → 2 → 1 → 3) has 3 edges.",
      "The only path, 2 → 1, has 1 edge."
    ],
    walk: [
      "For each node, compute its height (in nodes) and check the path that bends at it: left height + right height edges.",
      "Leaves 4 and 5 have height 1. At node 2: 1 + 1 = 2 edges; its height is 2.",
      "Leaf 3 has height 1.",
      "At node 1: 2 + 1 = 3 edges. That is the longest, so the diameter is 3."
    ],
    cons: ["The number of nodes is in the range [1, 10⁴].", "-100 ≤ Node.val ≤ 100"]
  },
  "balanced-binary-tree": {
    body: [
      "Given a binary tree, determine if it is height-balanced.",
      "A height-balanced tree is one in which the left and right subtrees of every node differ in height by no more than 1. " + TREE_NOTE
    ],
    why: [
      "At the root, the left subtree has height 1 and the right has height 2: they differ by 1. Every other node is fine too.",
      "At the root, the left subtree has height 3 and the right has height 1: they differ by 2.",
      "An empty tree is balanced."
    ],
    walk: [
      "Compute heights bottom-up and fail as soon as some node is out of balance.",
      "9 is a leaf → height 1. 15 and 7 are leaves → height 1.",
      "20: |1 − 1| = 0 ✓ → height 2.",
      "3: |1 − 2| = 1 ✓ → height 3. Every node passed, so return true."
    ],
    cons: ["The number of nodes is in the range [0, 5000].", "-10⁴ ≤ Node.val ≤ 10⁴"]
  },
  "symmetric-tree": {
    body: [
      "Given the `root` of a binary tree, check whether it is a mirror of itself (symmetric around its center).",
      TREE_NOTE
    ],
    why: [
      "The left side 2 → (3, 4) mirrors the right side 2 → (4, 3).",
      "Both 2s have their 3 on the right. A mirror image would put one of them on the left."
    ],
    walk: [
      "Compare the two subtrees in mirror order: the left's left with the right's right, and the left's right with the right's left.",
      "2 vs 2: equal.",
      "Left.left 3 vs right.right 3: equal. Left.right 4 vs right.left 4: equal.",
      "All pairs match, so return true."
    ],
    cons: ["The number of nodes is in the range [1, 1000].", "-100 ≤ Node.val ≤ 100"]
  },
  "subtree-of-another-tree": {
    body: [
      "Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of root with the same structure and node values as subRoot, and `false` otherwise.",
      "A subtree of a tree is a node in it together with all of that node's descendants. The tree itself counts as one of its subtrees. " + TREE_NOTE
    ],
    why: [
      "The node 4 with children 1 and 2 matches subRoot exactly.",
      "The node 2 has an extra child 0, so 4's subtree is [4,1,2,null,null,0], which is not the same as subRoot."
    ],
    walk: [
      "Visit each node of root and ask: is the tree starting here the same as subRoot?",
      "At 3: 3 ≠ 4, so no.",
      "At 4: 4 = 4, the left children 1 = 1 and the right children 2 = 2, and all of them are leaves. Same!",
      "Return true."
    ],
    cons: ["The number of nodes in root is in the range [1, 2000].", "The number of nodes in subRoot is in the range [1, 1000].", "-10⁴ ≤ Node.val ≤ 10⁴"]
  },
  "path-sum": {
    body: [
      "Given the `root` of a binary tree and an integer `targetSum`, return `true` if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.",
      "A leaf is a node with no children. The path must end at a leaf. " + TREE_NOTE
    ],
    why: [
      "5 → 4 → 11 → 2 adds up to 22.",
      "The paths are 1 → 2 (sum 3) and 1 → 3 (sum 4).",
      "An empty tree has no root-to-leaf paths."
    ],
    walk: [
      "Go down subtracting each value from what is still needed.",
      "Start with 22. At 5 → 17 left. At 4 → 13. At 11 → 2.",
      "Leaf 7: 2 − 7 = −5 ✗.",
      "Leaf 2: 2 − 2 = 0 ✓. Return true."
    ],
    cons: ["The number of nodes is in the range [0, 5000].", "-1000 ≤ Node.val ≤ 1000", "-1000 ≤ targetSum ≤ 1000"]
  },
  "path-sum-ii": {
    body: [
      "Given the `root` of a binary tree and an integer `targetSum`, return all root-to-leaf paths where the sum of the node values equals targetSum.",
      "Each path is returned as a list of node values (not node references). A leaf is a node with no children. " + TREE_NOTE
    ],
    why: [
      "5 + 4 + 11 + 2 = 22 and 5 + 8 + 4 + 5 = 22.",
      "No root-to-leaf path sums to 5."
    ],
    walk: [
      "DFS with the current path; record a copy when a leaf completes the sum.",
      "5 → 4 → 11 → 7: 27 ✗. 5 → 4 → 11 → 2: 22 ✓ record [5, 4, 11, 2].",
      "5 → 8 → 13: 26 ✗.",
      "5 → 8 → 4 → 5: 22 ✓ record [5, 8, 4, 5]. 5 → 8 → 4 → 1: 18 ✗."
    ],
    cons: ["The number of nodes is in the range [0, 5000].", "-1000 ≤ Node.val ≤ 1000", "-1000 ≤ targetSum ≤ 1000"]
  },
  "path-sum-iii": {
    body: [
      "Given the `root` of a binary tree and an integer `targetSum`, return the number of paths where the sum of the values along the path equals targetSum.",
      "The path does not need to start at the root or end at a leaf, but it must go downwards (from parent nodes to child nodes). " + TREE_NOTE
    ],
    why: [
      "The three paths are 5 → 3, 5 → 2 → 1 and −3 → 11.",
      "The three paths are 5 → 4 → 11 → 2, 5 → 8 → 4 → 5 and 4 → 11 → 7."
    ],
    walk: [
      "Walk down keeping the running sum from the root. A path ending here sums to 8 if some earlier running sum equals (current − 8). Count earlier sums in a map (start with {0: 1}).",
      "10 → 15 (node 5) → 18 (node 3): 18 − 8 = 10 was seen → 1 path (5 → 3).",
      "→ 21 (the lower 3): 13 not seen. Back up; → 16 (−2): 8 not seen.",
      "Back at 5 → 17 (node 2): 9 not seen. → 18 (node 1): 10 seen → path 2 (5 → 2 → 1).",
      "Right side: 7 (−3), then 18 (11): 10 seen → path 3 (−3 → 11). Total 3."
    ],
    cons: ["The number of nodes is in the range [0, 1000].", "-10⁹ ≤ Node.val ≤ 10⁹", "-1000 ≤ targetSum ≤ 1000"]
  },
  "min-depth": {
    body: [
      "Given a binary tree, find its minimum depth: the number of nodes along the shortest path from the root node down to the nearest leaf node.",
      "A leaf is a node with no children; a node with only one child is not a leaf. " + TREE_NOTE
    ],
    why: [
      "9 is a leaf at depth 2.",
      "The tree is a chain 2 → 3 → 4 → 5 → 6, so the only leaf is at depth 5."
    ],
    walk: [
      "Go level by level (BFS) and stop at the first leaf.",
      "Level 1: [3]. 3 has children, so it is not a leaf.",
      "Level 2: [9, 20]. 9 has no children: it is a leaf.",
      "Return 2."
    ],
    cons: ["The number of nodes is in the range [0, 10⁵].", "-1000 ≤ Node.val ≤ 1000"]
  },
  "right-side-view": {
    body: [
      "Given the `root` of a binary tree, imagine yourself standing on the right side of it. Return the values of the nodes you can see, ordered from top to bottom.",
      "On each level you see the rightmost node, even if it is a left child. " + TREE_NOTE
    ],
    why: [
      "From the right you see 1, then 3, then 4 (5 is hidden behind 4).",
      "1, then 3.",
      "The tree is empty."
    ],
    walk: [
      "BFS level by level and take the last node of each level.",
      "Level 0: [1] → 1.",
      "Level 1: [2, 3] → 3.",
      "Level 2: [5, 4] → 4. Result: [1, 3, 4]."
    ],
    cons: ["The number of nodes is in the range [0, 100].", "-100 ≤ Node.val ≤ 100"]
  },
  "zigzag-level-order": {
    body: [
      "Given the `root` of a binary tree, return the zigzag level order traversal of its nodes' values: left to right for the first level, then right to left for the next, alternating between levels.",
      TREE_NOTE
    ],
    why: [
      "Level 0 left to right: [3]. Level 1 right to left: [20, 9]. Level 2 left to right: [15, 7].",
      "One level.",
      "The tree is empty."
    ],
    walk: [
      "Do a normal level order traversal and reverse every other level.",
      "Level 0: [3].",
      "Level 1: [9, 20], reversed → [20, 9].",
      "Level 2: [15, 7]. Result: [[3], [20, 9], [15, 7]]."
    ],
    cons: ["The number of nodes is in the range [0, 2000].", "-100 ≤ Node.val ≤ 100"]
  },
  "average-of-levels": {
    body: [
      "Given the `root` of a binary tree, return the average value of the nodes on each level in the form of an array.",
      "Answers within 10⁻⁵ of the actual answer are accepted. " + TREE_NOTE
    ],
    why: [
      "Level averages: 3, (9 + 20) / 2 = 14.5, (15 + 7) / 2 = 11.",
      "This tree has a different shape (15 and 7 are children of 9), but the levels hold the same values."
    ],
    walk: [
      "BFS level by level; sum each level and divide by its size.",
      "Level 0: 3 / 1 = 3.",
      "Level 1: (9 + 20) / 2 = 14.5.",
      "Level 2: (15 + 7) / 2 = 11."
    ],
    cons: ["The number of nodes is in the range [1, 10⁴].", "-2³¹ ≤ Node.val ≤ 2³¹ − 1"]
  },
  "bottom-left-value": {
    body: [
      "Given the `root` of a binary tree, return the leftmost value in the last row of the tree.",
      TREE_NOTE
    ],
    why: [
      "The last row is [1, 3]; its leftmost value is 1.",
      "The last row contains only 7."
    ],
    walk: [
      "BFS, but add each node's right child before its left child. Then the very last node taken out is the bottom-left one.",
      "Take 2: add 3, then 1.",
      "Take 3, then take 1.",
      "The last node taken was 1."
    ],
    cons: ["The number of nodes is in the range [1, 10⁴].", "-2³¹ ≤ Node.val ≤ 2³¹ − 1"]
  },
  "count-good-nodes": {
    body: [
      "Given a binary tree `root`, a node X in the tree is named good if in the path from the root to X there are no nodes with a value greater than X.",
      "Return the number of good nodes in the binary tree. The root is always good. " + TREE_NOTE
    ],
    why: [
      "Good nodes: the root 3, 4 (path 3 → 4), 5 (path 3 → 4 → 5) and the 3 under 1 (path 3 → 1 → 3, nothing bigger than 3). Both 1s are not good.",
      "The root 3, its child 3 (equal is fine) and 4 are good. 2 is not.",
      "The root is always good."
    ],
    walk: [
      "DFS while carrying the largest value seen on the path so far.",
      "3 (max −∞) ✓ good; max = 3. 1 < 3 ✗. Its child 3 ≥ 3 ✓.",
      "4 ≥ 3 ✓; max = 4. Its child 1 < 4 ✗. Its child 5 ≥ 4 ✓.",
      "4 good nodes."
    ],
    cons: ["The number of nodes is in the range [1, 10⁵].", "-10⁴ ≤ Node.val ≤ 10⁴"]
  },
  "lca-binary-tree": {
    body: [
      "Given a binary tree and the values `p` and `q` of two of its nodes, find their lowest common ancestor (LCA) and return its value.",
      "The LCA is the lowest node that has both p and q as descendants; a node counts as a descendant of itself. All values are unique and both p and q exist in the tree. Unlike a BST, there is no ordering to guide you. " + TREE_NOTE
    ],
    why: [
      "5 is in the root's left subtree and 1 is in its right subtree, so they meet at 3.",
      "4 is below 5, and 5 is a descendant of itself, so the LCA is 5.",
      "2 is the child of 1."
    ],
    walk: [
      "Recursively search each subtree. A node returns itself if it is p or q; otherwise it returns whatever its children found.",
      "From 3, the left search reaches 5, which is p, so it returns 5 without going deeper.",
      "The right search reaches 1, which is q, and returns 1.",
      "Both sides found something, so 3 is where they meet. Return 3."
    ],
    cons: ["The number of nodes is in the range [2, 10⁵].", "-10⁹ ≤ Node.val ≤ 10⁹", "All values are unique; p ≠ q and both are in the tree."]
  },
  "build-tree-pre-in": {
    body: [
      "Given two integer arrays `preorder` and `inorder`, where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.",
      "Preorder visits node, left, right; inorder visits left, node, right. All values are unique. " + TREE_NOTE
    ],
    why: [
      "The root is 3 (first in preorder). In inorder, 9 is to its left and 15, 20, 7 are to its right.",
      "A single node."
    ],
    walk: [
      "The first preorder value, 3, is the root. Find 3 in inorder: [9] is the left subtree, [15, 20, 7] the right.",
      "The next preorder value, 9, is the root of the left subtree. It has nothing else in its range, so it is a leaf.",
      "The next preorder value, 20, is the root of the right subtree. In [15, 20, 7], 15 is to its left and 7 to its right.",
      "Result: [3, 9, 20, null, null, 15, 7]."
    ],
    cons: ["1 ≤ preorder.length ≤ 3000", "inorder.length == preorder.length", "-3000 ≤ values ≤ 3000", "All values are unique and both arrays describe the same tree."]
  },
  "build-tree-in-post": {
    body: [
      "Given two integer arrays `inorder` and `postorder`, where inorder is the inorder traversal of a binary tree and postorder is the postorder traversal of the same tree, construct and return the binary tree.",
      "Postorder visits left, right, node, so the root comes last. All values are unique. " + TREE_NOTE
    ],
    why: [
      "The root is 3 (last in postorder). In inorder, 9 is to its left and 15, 20, 7 to its right.",
      "A single node."
    ],
    walk: [
      "The last postorder value, 3, is the root. In inorder, [9] is the left subtree and [15, 20, 7] the right.",
      "Reading postorder from the end gives roots in the order root, right subtree, left subtree, so build the right subtree first. The next value is 20.",
      "In [15, 20, 7], 7 is to the right of 20 and 15 to its left. They are leaves.",
      "The next value is 9, the left subtree's root. Result: [3, 9, 20, null, null, 15, 7]."
    ],
    cons: ["1 ≤ inorder.length ≤ 3000", "postorder.length == inorder.length", "-3000 ≤ values ≤ 3000", "All values are unique and both arrays describe the same tree."]
  },
  "flatten-tree": {
    body: [
      "Given the `root` of a binary tree, flatten the tree into a 'linked list' in place: use the right child pointer as 'next' and set every left child pointer to null.",
      "The nodes must appear in the same order as a preorder traversal (node, left, right). The function returns nothing; the judge checks the tree. " + TREE_NOTE
    ],
    why: [
      "The preorder is 1, 2, 3, 4, 5, 6, so the flattened tree is the chain 1 → 2 → 3 → 4 → 5 → 6, each node a right child of the previous one.",
      "An empty tree stays empty.",
      "A single node is already flat."
    ],
    walk: [
      "At node 1: its left subtree (2, 3, 4) must come before its right subtree (5, 6).",
      "Find the rightmost node of the left subtree, 4, and attach 5 to 4's right.",
      "Move the left subtree to 1's right and set 1's left to null: 1 → 2 → (3, 4 → 5 → 6).",
      "At node 2, do the same: 3's right becomes 4, then 2's right becomes 3. The chain is 1, 2, 3, 4, 5, 6."
    ],
    cons: ["The number of nodes is in the range [0, 2000].", "-100 ≤ Node.val ≤ 100"]
  },
  "max-path-sum": {
    body: [
      "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. A node can appear in the sequence at most once, and the path does not need to pass through the root.",
      "The path sum is the sum of the node values on the path. Given the `root` of a binary tree, return the maximum path sum of any non-empty path. Values can be negative. " + TREE_NOTE
    ],
    why: [
      "The path 2 → 1 → 3 sums to 6.",
      "The path 15 → 20 → 7 sums to 42. Including −10 would only lower it."
    ],
    walk: [
      "For each node, compute its gain: the best sum of a downward path starting at it (ignore a child if its gain is negative).",
      "Leaf 2 → gain 2. Leaf 3 → gain 3.",
      "At 1, the best path bending here is 2 + 1 + 3 = 6. best = 6.",
      "1 returns gain 1 + max(2, 3) = 4 to its parent (it has none). The answer is 6."
    ],
    cons: ["The number of nodes is in the range [1, 3 · 10⁴].", "-1000 ≤ Node.val ≤ 1000"]
  },
  "binary-tree-paths": {
    body: [
      "Given the `root` of a binary tree, return all root-to-leaf paths in any order.",
      "Write each path as the node values joined by '->', for example '1->2->5'. A leaf is a node with no children. " + TREE_NOTE
    ],
    why: [
      "Two leaves, 5 and 3, give two paths.",
      "The root is also a leaf."
    ],
    walk: [
      "DFS while building the path.",
      "1 → 2 → 5: 5 is a leaf, so record '1->2->5'.",
      "1 → 3: 3 is a leaf, so record '1->3'.",
      "Result: ['1->2->5', '1->3']."
    ],
    cons: ["The number of nodes is in the range [1, 100].", "-100 ≤ Node.val ≤ 100"]
  },
  "sum-root-to-leaf": {
    body: [
      "You are given the `root` of a binary tree containing digits from 0 to 9 only. Each root-to-leaf path represents a number: for example, the path 1 → 2 → 3 represents 123.",
      "Return the total sum of all root-to-leaf numbers. A leaf is a node with no children. " + TREE_NOTE
    ],
    why: [
      "The paths are 12 and 13: 12 + 13 = 25.",
      "The paths are 495, 491 and 40: their sum is 1026."
    ],
    walk: [
      "Carry the number built so far: at each node, number = number × 10 + digit.",
      "1 → 1. Go to 2: 1 × 10 + 2 = 12, a leaf → add 12.",
      "Go to 3: 1 × 10 + 3 = 13, a leaf → add 13.",
      "Total 25."
    ],
    cons: ["The number of nodes is in the range [1, 1000].", "0 ≤ Node.val ≤ 9", "The depth of the tree is at most 10."]
  },
  "all-nodes-distance-k": {
    body: [
      "Given the `root` of a binary tree, the value of a `target` node in the tree, and an integer `k`, return an array of the values of all nodes that are exactly k edges away from the target node.",
      "Distance can go up through parents as well as down through children. You can return the answer in any order. " + TREE_NOTE
    ],
    why: [
      "From 5: its grandchildren 7 and 4 are 2 edges down, and 1 is 2 edges away through the parent 3.",
      "There are no nodes 3 edges away from the only node."
    ],
    walk: [
      "First record every node's parent, so the tree can be walked like an undirected graph.",
      "BFS from 5. Distance 1: 6, 2 (children) and 3 (parent).",
      "Distance 2: from 2 → 7, 4; from 3 → 1 (5 was already visited); 6 adds nothing.",
      "Return [7, 4, 1]."
    ],
    cons: ["The number of nodes is in the range [1, 500].", "0 ≤ Node.val ≤ 500", "All values are unique and target is in the tree.", "0 ≤ k ≤ 1000"]
  },
  "vertical-order-traversal": {
    body: [
      "Given the `root` of a binary tree, calculate its vertical order traversal. The root is at row 0, column 0. A node at (row, col) has its left child at (row + 1, col − 1) and its right child at (row + 1, col + 1).",
      "Return one list per column, from the leftmost column to the rightmost. Inside a column, order nodes from top to bottom; nodes in the same row and column are ordered by value. " + TREE_NOTE
    ],
    why: [
      "Column −1: 9. Column 0: 3, then 15. Column 1: 20. Column 2: 7.",
      "5 and 6 are both at row 2, column 0, so they are ordered by value after 1.",
      "Here 6 and 5 share a position too, and sorting by value puts 5 first."
    ],
    walk: [
      "Give every node a (column, row) position: 3 (0, 0), 9 (−1, 1), 20 (1, 1), 15 (0, 2), 7 (2, 2).",
      "Sort by column, then row, then value.",
      "Group by column: −1 → [9], 0 → [3, 15], 1 → [20], 2 → [7].",
      "Result: [[9], [3, 15], [20], [7]]."
    ],
    cons: ["The number of nodes is in the range [1, 1000].", "0 ≤ Node.val ≤ 1000"]
  },
  "max-width-binary-tree": {
    body: [
      "Given the `root` of a binary tree, return the maximum width of the given tree.",
      "The width of a level is the length between its leftmost and rightmost non-null nodes, counting the missing (null) positions between them as if the tree were complete. " + TREE_NOTE
    ],
    why: [
      "The last level is 5, 3, (gap), 9: width 4.",
      "The last level runs from 6 to 7, with 5 gaps between them: width 7.",
      "Level 1 has 3 and 2: width 2."
    ],
    walk: [
      "Number positions like a heap: the root is 0, and a node at position i has children 2i and 2i + 1.",
      "Level 0: root at 0 → width 1.",
      "Level 1: 3 at 0, 2 at 1 → width 2.",
      "Level 2: 5 at 0, 3 at 1, 9 at 3 → width 3 − 0 + 1 = 4. The maximum is 4."
    ],
    cons: ["The number of nodes is in the range [1, 3000].", "-100 ≤ Node.val ≤ 100", "The answer fits in a 32-bit signed integer."]
  },
  "house-robber-iii": {
    body: [
      "The thief has found a new place for their thievery: the houses form a binary tree, and the only entrance is the root.",
      "If two directly-linked houses (a parent and its child) are robbed on the same night, the police are alerted. Given the `root` of the binary tree, return the maximum amount of money the thief can rob without alerting the police. " + TREE_NOTE
    ],
    why: [
      "Rob the root (3) and the two grandchildren (3 and 1): 3 + 3 + 1 = 7.",
      "Rob the root's children: 4 + 5 = 9."
    ],
    walk: [
      "For each node, compute [best if robbed, best if skipped].",
      "Leaf 3 → [3, 0]. Node 2 (child 3): rob → 2 + 0 = 2, skip → max(3, 0) = 3 → [2, 3].",
      "Leaf 1 → [1, 0]. The right node 3 → [3 + 0, max(1, 0)] = [3, 1].",
      "Root 3: rob → 3 + 3 + 1 = 7. Skip → max(2, 3) + max(3, 1) = 6. The answer is 7."
    ],
    cons: ["The number of nodes is in the range [1, 10⁴].", "0 ≤ Node.val ≤ 10⁴"]
  },
  "binary-tree-cameras": {
    body: [
      "You are given the `root` of a binary tree. We install cameras on the tree nodes, where each camera at a node can monitor its parent, itself, and its immediate children.",
      "Return the minimum number of cameras needed to monitor all nodes of the tree. All node values are 0; only the shape matters. " + TREE_NOTE
    ],
    why: [
      "One camera on the root's child watches the root and both of its own children.",
      "The tree is a chain of 5 nodes; it needs 2 cameras, for example on the 2nd and 4th nodes."
    ],
    walk: [
      "Decide bottom-up. Each node reports one of three states: 'needs watching', 'has a camera' or 'watched'.",
      "The two leaves have nothing below them, so they report 'needs watching'.",
      "Their parent must place a camera (count = 1) and reports 'has a camera'.",
      "The root is next to that camera, so it is 'watched'. Total: 1 camera."
    ],
    cons: ["The number of nodes is in the range [1, 1000].", "Node.val == 0"]
  },
  "distribute-coins": {
    body: [
      "You are given the `root` of a binary tree with n nodes where each node has node.val coins. There are n coins in total.",
      "In one move, we may choose two adjacent nodes and move one coin from one of them to the other. Return the minimum number of moves required to make every node have exactly one coin. " + TREE_NOTE
    ],
    why: [
      "The root has 3 coins: it sends one to each child (2 moves).",
      "The left child sends 2 coins to the root (2 moves), and the root sends 1 to the right child (1 move): 3 moves."
    ],
    walk: [
      "Each subtree has an excess: coins − nodes. That many coins must cross the edge to its parent (in one direction or the other).",
      "Left leaf: 0 coins, 1 node → excess −1, so 1 coin must cross its edge.",
      "Right leaf: excess −1, so 1 coin crosses its edge too.",
      "Moves = |−1| + |−1| = 2."
    ],
    cons: ["The number of nodes is n, with 1 ≤ n ≤ 100.", "0 ≤ Node.val ≤ n", "The sum of all Node.val is n."]
  },
  "count-complete-tree-nodes": {
    body: [
      "Given the `root` of a complete binary tree, return the number of nodes in the tree.",
      "In a complete binary tree, every level except possibly the last is completely filled, and the nodes in the last level are as far left as possible. Design an algorithm that runs in less than O(n) time. " + TREE_NOTE
    ],
    why: [
      "There are 6 nodes.",
      "The tree is empty.",
      "One node."
    ],
    walk: [
      "At a node, measure the height down the far-left edge and down the far-right edge. If they are equal, the subtree is perfect and has 2^h − 1 nodes.",
      "Root 1: left height 3 (1, 2, 4), right height 2 (1, 3). Not equal, so count each child and add 1.",
      "Node 2: left height 2, right height 2 → perfect → 3 nodes.",
      "Node 3: left height 2, right height 1 → recurse: 6 is 1 node, and the missing right child is 0 → 2 nodes.",
      "Total: 3 + 2 + 1 = 6."
    ],
    cons: ["The number of nodes is in the range [0, 5 · 10⁴].", "0 ≤ Node.val ≤ 5 · 10⁴", "The tree is guaranteed to be complete."]
  },
  "merge-two-binary-trees": {
    body: [
      "You are given two binary trees `root1` and `root2`. Imagine putting one on top of the other.",
      "Where two nodes overlap, the merged node's value is their sum. Where only one tree has a node, that node is used as it is. Return the merged tree. " + TREE_NOTE
    ],
    why: [
      "Overlapping nodes: 1 + 2 = 3, 3 + 1 = 4, 2 + 3 = 5. Only root1 has the 5 at the bottom left; only root2 has the 4 and the 7.",
      "1 + 1 = 2 at the root, and only root2 has the child 2."
    ],
    walk: [
      "Walk both trees together.",
      "Roots: 1 + 2 = 3.",
      "Left children: 3 + 1 = 4. Below them, root1 has 5 on the left; root2 has 4 on the right. Each is used as it is.",
      "Right children: 2 + 3 = 5. root2's 7 hangs on the right. Result: [3, 4, 5, 5, 4, null, 7]."
    ],
    cons: ["The number of nodes in both trees is in the range [0, 2000].", "-10⁴ ≤ Node.val ≤ 10⁴"]
  },
  "cousins-binary-tree": {
    body: [
      "Given the `root` of a binary tree with unique values and the values of two different nodes `x` and `y`, return `true` if the nodes corresponding to x and y are cousins, or `false` otherwise.",
      "Two nodes are cousins if they have the same depth but different parents. The root is at depth 0. " + TREE_NOTE
    ],
    why: [
      "4 is at depth 2 but 3 is at depth 1.",
      "5 (child of 3) and 4 (child of 2) are both at depth 2, with different parents.",
      "2 and 3 are at the same depth, but they have the same parent, so they are siblings."
    ],
    walk: [
      "Find each value's depth and parent.",
      "4: depth 2, parent 2.",
      "3: depth 1, parent 1.",
      "The depths differ, so return false."
    ],
    cons: ["The number of nodes is in the range [2, 100].", "1 ≤ Node.val ≤ 100", "All values are unique; x ≠ y and both are in the tree."]
  },
  "maximum-binary-tree": {
    body: [
      "You are given an integer array `nums` with no duplicates. A maximum binary tree is built from it recursively: the root is the maximum value in nums, the left subtree is built from the part of the array left of the maximum, and the right subtree from the part to its right.",
      "Return the maximum binary tree built from nums. " + TREE_NOTE
    ],
    why: [
      "6 is the maximum. [3, 2, 1] builds the left subtree (3 → right 2 → right 1), and [0, 5] builds the right subtree (5 with left child 0).",
      "3 is the root, 2 its right child, and 1 is 2's right child."
    ],
    walk: [
      "The maximum of [3, 2, 1, 6, 0, 5] is 6, at index 3: the root.",
      "Left part [3, 2, 1]: the max is 3, with nothing on its left and [2, 1] on its right → 3's right child is 2, and 2's right child is 1.",
      "Right part [0, 5]: the max is 5, with [0] on its left → 5's left child is 0.",
      "Result: [6, 3, 5, null, 2, 0, null, null, 1]."
    ],
    cons: ["1 ≤ nums.length ≤ 1000", "0 ≤ nums[i] ≤ 1000", "All integers in `nums` are unique."]
  },
  "serialize-deserialize-tree": {
    body: [
      "Serialization converts a data structure into a string so it can be stored or sent, and deserialization turns the string back into the same structure.",
      "Design an algorithm to serialize and deserialize a binary tree. There is no restriction on the string format. Here the judge calls `roundTrip(root)`, which must return deserialize(serialize(root)), and checks that the result is the same tree. " + TREE_NOTE
    ],
    why: [
      "Whatever string you produce, decoding it must give back the same tree.",
      "The empty tree must survive the round trip too."
    ],
    walk: [
      "Serialize with a preorder walk, writing '#' for missing children: '1,2,#,#,3,4,#,#,5,#,#'.",
      "Deserialize by reading the tokens in the same order: 1 is the root; build its left from '2,#,#' (a leaf).",
      "Then build its right from '3,4,#,#,5,#,#': 3 with children 4 and 5.",
      "The rebuilt tree is [1, 2, 3, null, null, 4, 5], identical to the input."
    ],
    cons: ["The number of nodes is in the range [0, 10⁴].", "-1000 ≤ Node.val ≤ 1000"]
  }
};
