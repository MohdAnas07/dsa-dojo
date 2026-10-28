import type { Statement } from "./types";
import { TREE_NOTE } from "./trees";

const BST = "In a binary search tree (BST), every value in a node's left subtree is smaller than the node and every value in its right subtree is larger.";

export const BST_TRIE_STATEMENTS: Record<string, Statement> = {
  "kth-smallest-bst": {
    body: [
      "Given the `root` of a binary search tree and an integer `k`, return the k-th smallest value (1-indexed) of all the values of the nodes in the tree.",
      BST + " " + TREE_NOTE
    ],
    why: [
      "The values in order are 1, 2, 3, 4. The 1st smallest is 1.",
      "The values in order are 1, 2, 3, 4, 5, 6. The 3rd smallest is 3."
    ],
    walk: [
      "An inorder traversal (left, node, right) visits a BST's values in increasing order.",
      "From 3, go left to 1. 1 has no left child.",
      "Visit 1: that is the 1st value visited, and k = 1.",
      "Return 1."
    ],
    cons: ["The number of nodes is n.", "1 ≤ k ≤ n ≤ 10⁴", "0 ≤ Node.val ≤ 10⁴"]
  },
  "sorted-array-to-bst": {
    body: [
      "Given an integer array `nums` where the elements are sorted in ascending order, convert it to a height-balanced binary search tree.",
      "Height-balanced means the depths of the two subtrees of every node never differ by more than one. Several trees can be correct; any height-balanced BST is accepted. " + TREE_NOTE
    ],
    why: [
      "0 is the root, with −10 → −3 on the left and 5 → 9 on the right. [0,−3,9,−10,null,5] is also accepted.",
      "[1,null,3] and [3,1] are both height-balanced BSTs."
    ],
    walk: [
      "Pick the middle element as the root so both sides get about half: 0.",
      "Left part [−10, −3]: its middle is −10, with −3 as its right child.",
      "Right part [5, 9]: its middle is 5, with 9 as its right child.",
      "Result: [0, −10, 5, null, −3, null, 9]."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ ≤ nums[i] ≤ 10⁴", "`nums` is sorted in strictly increasing order."]
  },
  "insert-into-bst": {
    body: [
      "You are given the `root` of a binary search tree and a value to insert. Insert the value and return the root of the BST. The value is not already in the tree.",
      "Several results can be valid; any valid BST that contains all the old values plus the new one is accepted. " + BST + " " + TREE_NOTE
    ],
    why: [
      "5 > 4, so go right to 7; 5 < 7, so it becomes 7's left child.",
      "25 < 40 → left to 20; 25 > 20 → right to 30; 25 < 30 → it becomes 30's left child."
    ],
    walk: [
      "Start at the root, 4. 5 > 4, so go right.",
      "At 7: 5 < 7, so go left.",
      "7 has no left child: put 5 there.",
      "Result: [4, 2, 7, 1, 3, 5]."
    ],
    cons: ["The number of nodes is in the range [0, 10⁴].", "-10⁸ ≤ Node.val, val ≤ 10⁸", "All values are unique; val is not in the tree."]
  },
  "delete-node-bst": {
    body: [
      "Given the `root` of a BST and a `key`, delete the node with value key (if it exists) and return the root of the BST.",
      "Several results can be valid; any valid BST with the remaining values is accepted. " + BST + " " + TREE_NOTE
    ],
    why: [
      "3 has two children, so it is replaced by its inorder successor 4. [5,2,6,null,4,null,7] is also valid.",
      "There is no 0 in the tree, so nothing changes.",
      "The tree is empty."
    ],
    walk: [
      "Find the key: 3 < 5, so go left. Found 3.",
      "3 has two children. Its inorder successor is the smallest value in its right subtree: 4.",
      "Copy 4 into the node, then delete the original 4 from the right subtree (it is a leaf).",
      "Result: [5, 4, 6, 2, null, null, 7]."
    ],
    cons: ["The number of nodes is in the range [0, 10⁴].", "-10⁵ ≤ Node.val, key ≤ 10⁵", "All values are unique; the root is a valid BST."]
  },
  "bst-iterator": {
    body: [
      "Implement the `BSTIterator` class, which iterates over the inorder traversal (smallest to largest) of a binary search tree.",
      "`BSTIterator(root)` creates the iterator, `next()` returns the next smallest number, and `hasNext()` returns whether there is one. Use O(h) memory, where h is the height of the tree. The example lists the calls on one line and their arguments on the next."
    ],
    why: [
      "The values in order are 3, 7, 9, 15, 20. After 20, hasNext() is false."
    ],
    walk: [
      "Keep a stack of the path to the next smallest node. At the start, push the left chain from the root: 7, 3.",
      "next() pops 3, which has no right child → 3. next() pops 7, then pushes the left chain of its right subtree: 15, 9 → 7.",
      "hasNext() → true. next() pops 9 → 9.",
      "next() pops 15 and pushes 20 → 15. next() pops 20 → 20. hasNext() → false."
    ],
    cons: ["The number of nodes is in the range [1, 10⁵].", "0 ≤ Node.val ≤ 10⁶", "At most 10⁵ calls; next() is only called when hasNext() is true."]
  },
  "two-sum-bst": {
    body: [
      "Given the `root` of a binary search tree and an integer `k`, return `true` if there exist two different nodes in the BST such that the sum of their values is equal to k, or `false` otherwise.",
      TREE_NOTE
    ],
    why: [
      "2 + 7 = 9 (3 + 6 and 4 + 5 also work).",
      "The two largest values give 6 + 7 = 13, far from 28."
    ],
    walk: [
      "Walk the tree with a set of values seen so far.",
      "5: need 4, not seen. Add 5.",
      "3: need 6, not seen. Add 3. 2: need 7, not seen. Add 2.",
      "4: need 5, which was seen. Return true."
    ],
    cons: ["The number of nodes is in the range [1, 10⁴].", "-10⁴ ≤ Node.val ≤ 10⁴", "The root is a valid BST.", "-10⁵ ≤ k ≤ 10⁵"]
  },
  "trim-bst": {
    body: [
      "Given the `root` of a binary search tree and the bounds `low` and `high`, trim the tree so that all its elements lie in [low, high].",
      "Trimming should not change the relative structure of the remaining elements: any node's descendant should stay a descendant. Return the root of the trimmed tree (the root may change). " + TREE_NOTE
    ],
    why: [
      "0 is below 1, so it is removed.",
      "0 is below 1, so it is replaced by its right subtree (2 → 1). 4 is above 3, so it is removed."
    ],
    walk: [
      "At a node below low, its whole left subtree is too small: keep only its trimmed right subtree. Above high, keep only its trimmed left subtree.",
      "Root 1 is in [1, 2]: keep it and trim both children.",
      "Left child 0 < 1: its right subtree is empty, so it becomes null.",
      "Right child 2 is in range. Result: [1, null, 2]."
    ],
    cons: ["The number of nodes is in the range [1, 10⁴].", "0 ≤ Node.val ≤ 10⁴", "All values are unique; the root is a valid BST.", "0 ≤ low ≤ high ≤ 10⁴"]
  },
  "convert-bst-greater": {
    body: [
      "Given the `root` of a BST, convert it to a Greater Tree such that every value of the original BST is changed to the original value plus the sum of all values greater than it in the BST.",
      BST + " " + TREE_NOTE
    ],
    why: [
      "The values 0 … 8 become running sums from the top: 8 → 8, 7 → 15, 6 → 21, 5 → 26, 4 → 30, 3 → 33, 2 → 35, 1 → 36, 0 → 36.",
      "1 has nothing greater, so it stays 1. 0 becomes 0 + 1 = 1."
    ],
    walk: [
      "Visit the nodes in reverse inorder (right, node, left), which is largest first, keeping a running total.",
      "8 → total 8. 7 → 15. 6 → 21. 5 → 26.",
      "4 → 30. 3 → 33. 2 → 35. 1 → 36. 0 → 36.",
      "Each node takes the running total as its new value."
    ],
    cons: ["The number of nodes is in the range [0, 10⁴].", "-10⁴ ≤ Node.val ≤ 10⁴", "All values are unique; the root is a valid BST."]
  },
  "range-sum-bst": {
    body: [
      "Given the `root` of a binary search tree and two integers `low` and `high`, return the sum of the values of all nodes with a value in the inclusive range [low, high].",
      "Use the BST order to skip subtrees that are entirely out of range. " + TREE_NOTE
    ],
    why: [
      "7, 10 and 15 are in [7, 15]: 7 + 10 + 15 = 32.",
      "6, 7 and 10 are in [6, 10]: 6 + 7 + 10 = 23."
    ],
    walk: [
      "10 is in range → +10.",
      "Go left to 5: below 7, so skip 5 and everything to its left, but check its right child 7 → +7.",
      "Go right to 15: in range → +15. Its child 18 is above 15 → skip.",
      "Total 32."
    ],
    cons: ["The number of nodes is in the range [1, 2 · 10⁴].", "1 ≤ Node.val ≤ 10⁵", "1 ≤ low ≤ high ≤ 10⁵", "All values are unique."]
  },
  "increasing-order-bst": {
    body: [
      "Given the `root` of a binary search tree, rearrange the tree in inorder so that the leftmost node is now the root, and every node has no left child and only one right child.",
      "The result is a chain of increasing values going down to the right. " + TREE_NOTE
    ],
    why: [
      "The values in order, 1 … 9, become a right-only chain.",
      "1, 5, 7 become a chain."
    ],
    walk: [
      "Do an inorder traversal and keep a `tail` of the new chain (start from a dummy node).",
      "Visit 1: tail.right = 1, clear 1's left, tail = 1.",
      "Visit 2, 3, 4, 5, 6, 7, 8, 9 the same way.",
      "Return dummy.right, which is 1."
    ],
    cons: ["The number of nodes is in the range [1, 100].", "0 ≤ Node.val ≤ 1000"]
  },
  "min-abs-diff-bst": {
    body: [
      "Given the `root` of a binary search tree, return the minimum absolute difference between the values of any two different nodes in the tree.",
      "In a BST, the closest values are next to each other in sorted order. " + TREE_NOTE
    ],
    why: [
      "Sorted: 1, 2, 3, 4, 6. Neighbours differ by at least 1.",
      "Sorted: 0, 1, 12, 48, 49. 0 → 1 and 48 → 49 differ by 1."
    ],
    walk: [
      "Do an inorder traversal and compare each value with the previous one.",
      "1. Then 2 − 1 = 1 → best 1.",
      "3 − 2 = 1, 4 − 3 = 1, 6 − 4 = 2.",
      "The minimum is 1."
    ],
    cons: ["The number of nodes is in the range [2, 10⁴].", "0 ≤ Node.val ≤ 10⁵"]
  },
  "implement-trie": {
    body: [
      "A trie (pronounced 'try'), or prefix tree, is a tree that stores strings so that words sharing a prefix share a path. It is used for autocomplete and spell checking.",
      "Implement `Trie` with `insert(word)`, `search(word)` (true if the word was inserted before) and `startsWith(prefix)` (true if any inserted word starts with prefix). The example lists the calls on one line and their arguments on the next."
    ],
    why: [
      "After inserting 'apple', searching 'app' is false (it is only a prefix), but startsWith('app') is true. After inserting 'app', searching it is true."
    ],
    walk: [
      "insert('apple'): create the path a → p → p → l → e and mark e as the end of a word.",
      "search('apple'): follow the path to e; it is marked as an end → true.",
      "search('app'): the path exists, but the second p is not marked as an end → false. startsWith('app') → true.",
      "insert('app') marks the second p as an end, so search('app') → true."
    ],
    cons: ["1 ≤ word.length, prefix.length ≤ 2000", "`word` and `prefix` consist only of lowercase English letters.", "At most 3 · 10⁴ calls are made."]
  },
  "add-search-words": {
    body: [
      "Design a data structure that supports adding new words and finding if a string matches any previously added string.",
      "Implement `WordDictionary` with `addWord(word)` and `search(word)`. In search, a '.' can match any single letter. The example lists the calls on one line and their arguments on the next."
    ],
    why: [
      "'pad' was never added. 'bad' was. '.ad' matches bad, dad and mad. 'b..' matches bad."
    ],
    walk: [
      "Store the words in a trie: b-a-d, d-a-d, m-a-d.",
      "search('pad'): the root has no 'p' child → false. search('bad') follows b-a-d → true.",
      "search('.ad'): '.' tries every child of the root (b, d, m); b → a → d reaches the end of a word → true.",
      "search('b..'): b, then any letter (a), then any letter (d) → true."
    ],
    cons: ["1 ≤ word.length ≤ 25", "Added words are lowercase letters; searched words may also contain '.'.", "At most 2 dots per search; at most 10⁴ calls."]
  },
  "word-search-ii": {
    body: [
      "Given an m × n `board` of characters and a list of strings `words`, return all words that are on the board, in any order.",
      "Each word must be built from letters of sequentially adjacent cells (horizontally or vertically neighbouring). The same cell may not be used more than once in a word."
    ],
    why: [
      "'oath' runs o(0,0) → a(0,1) → t(1,1) → h(2,1). 'eat' runs e(1,3) → a(1,2) → t(1,1). There is no 'p' for 'pea', and 'rain' can't be traced.",
      "'abcb' would need to use the 'b' cell twice."
    ],
    walk: [
      "Put all the words in a trie, so one search from a cell checks every word at once.",
      "Start at (0,0) 'o': the trie has 'o'. Go to (0,1) 'a' → 'oa', then (1,1) 't' → 'oat', then (2,1) 'h' → 'oath' is a word. Record it.",
      "Keep scanning. From (1,3) 'e' → (1,2) 'a' → (1,1) 't' → 'eat'. Record it.",
      "No other path spells a word. Result: ['oath', 'eat']."
    ],
    cons: ["m == board.length", "n == board[i].length", "1 ≤ m, n ≤ 12", "1 ≤ words.length ≤ 3 · 10⁴", "1 ≤ words[i].length ≤ 10", "All words are unique and lowercase."]
  },
  "replace-words": {
    body: [
      "In English, a root can be followed by other letters to form a longer word, called a derivative: 'help' + 'ful' = 'helpful'.",
      "Given a `dictionary` of roots and a `sentence` of words separated by spaces, replace every derivative in the sentence with the root forming it. If several roots can form it, use the shortest. Return the sentence after the replacement."
    ],
    why: [
      "'cattle' starts with 'cat', 'rattled' with 'rat', and 'battery' with 'bat'. The other words have no root.",
      "Every word starts with one of the one-letter roots."
    ],
    walk: [
      "Put the roots in a trie. For each word, walk the trie and stop at the first root that ends.",
      "'the': no root starts with 't' → keep 'the'.",
      "'cattle': c → a → t, which ends the root 'cat' → replace with 'cat'.",
      "'rattled' → 'rat', 'battery' → 'bat'. Result: 'the cat was rat by the bat'."
    ],
    cons: ["1 ≤ dictionary.length ≤ 1000", "1 ≤ dictionary[i].length ≤ 100", "1 ≤ sentence.length ≤ 10⁶", "Everything is lowercase; words are separated by single spaces."]
  },
  "longest-word-dictionary": {
    body: [
      "Given an array of strings `words`, return the longest word in words that can be built one character at a time by other words in words: every prefix of it (of length 1, 2, …) must also be in the list.",
      "If there is more than one possible answer, return the one that comes first alphabetically. If there is no answer, return the empty string."
    ],
    why: [
      "w, wo, wor and worl are all present, so 'world' can be built.",
      "'apple' and 'apply' can both be built from a, ap, app, appl. They tie in length, and 'apple' comes first. 'banana' can't be built (there is no 'b')."
    ],
    walk: [
      "Sort the words so shorter ones come first, then keep a set of buildable words.",
      "'w' (length 1) is buildable. Add it.",
      "'wo': its prefix 'w' is buildable → add. 'wor' → add. 'worl' → add.",
      "'world': its prefix 'worl' is buildable → add. The longest buildable word is 'world'."
    ],
    cons: ["1 ≤ words.length ≤ 1000", "1 ≤ words[i].length ≤ 30", "`words[i]` consists of lowercase English letters."]
  },
  "search-suggestions": {
    body: [
      "You are given an array of strings `products` and a string `searchWord`. Design a system that suggests at most three product names after each character of searchWord is typed.",
      "Suggested products must start with the typed prefix. If more than three products match, return the three that come first alphabetically. Return a list of suggestion lists, one after each character typed."
    ],
    why: [
      "Sorted: mobile, moneypot, monitor, mouse, mousepad. 'm' and 'mo' match all five, so show the first three. 'mou', 'mous' and 'mouse' match only mouse and mousepad.",
      "'havana' matches every prefix of itself."
    ],
    walk: [
      "Sort the products: [mobile, moneypot, monitor, mouse, mousepad].",
      "'m': all match → [mobile, moneypot, monitor].",
      "'mo': all match → the same three.",
      "'mou', 'mous', 'mouse': only mouse and mousepad match → [mouse, mousepad] each time."
    ],
    cons: ["1 ≤ products.length ≤ 1000", "1 ≤ products[i].length ≤ 3000", "1 ≤ searchWord.length ≤ 1000", "All strings are lowercase; products are unique."]
  },
  "max-xor-two-numbers": {
    body: [
      "Given an integer array `nums`, return the maximum result of nums[i] XOR nums[j], where 0 ≤ i ≤ j < n.",
      "XOR gives a 1 bit wherever the two numbers differ, so the best partner for a number has the opposite bits, starting from the most significant bit."
    ],
    why: [
      "5 XOR 25 = 00101 XOR 11001 = 11100 = 28.",
      "The best pair gives 127."
    ],
    walk: [
      "Insert every number into a binary trie, highest bit first.",
      "For 5 (00101), walk the trie choosing the opposite bit whenever possible: 1, 1, 0 (no number continues with 1 here), 0, 1.",
      "That path is 25 (11001). 5 XOR 25 = 11100 = 28.",
      "Doing this for every number gives the maximum, 28."
    ],
    cons: ["1 ≤ nums.length ≤ 2 · 10⁵", "0 ≤ nums[i] ≤ 2³¹ − 1"]
  }
};
