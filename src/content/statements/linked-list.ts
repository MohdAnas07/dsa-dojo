import type { Statement } from "./types";

const LIST_NOTE = "Lists are written as arrays of their values from head to tail, so [1,2,3] means 1 → 2 → 3.";

export const LINKED_LIST_STATEMENTS: Record<string, Statement> = {
  "middle-of-list": {
    body: [
      "Given the `head` of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second one.",
      LIST_NOTE + " The output shows the list starting from the node you return."
    ],
    why: [
      "The middle node is 3, so the output shows 3 → 4 → 5.",
      "There are two middle nodes, 3 and 4. Return the second one, 4."
    ],
    walk: [
      "slow and fast both start at 1. Each step, slow moves 1 node and fast moves 2.",
      "Step 1: slow = 2, fast = 3.",
      "Step 2: slow = 3, fast = 5. fast has no next node, so stop.",
      "slow is at 3, the middle."
    ],
    cons: ["The number of nodes is in the range [1, 100].", "1 ≤ Node.val ≤ 100"]
  },
  "palindrome-linked-list": {
    body: [
      "Given the `head` of a singly linked list, return `true` if it is a palindrome (reads the same forward and backward), or `false` otherwise.",
      LIST_NOTE + " Can you do it in O(n) time and O(1) extra space?"
    ],
    why: [
      "1, 2, 2, 1 reads the same both ways.",
      "1, 2 reversed is 2, 1."
    ],
    walk: [
      "Find the middle with slow and fast pointers: the second half starts at the second 2.",
      "Reverse the second half: 2 → 1 becomes 1 → 2.",
      "Compare the first half 1 → 2 with the reversed half 1 → 2: equal.",
      "Return true."
    ],
    cons: ["The number of nodes is in the range [1, 10⁵].", "0 ≤ Node.val ≤ 9"]
  },
  "remove-linked-list-elements": {
    body: [
      "Given the `head` of a linked list and an integer `val`, remove all the nodes of the linked list that have Node.val == val, and return the new head.",
      LIST_NOTE
    ],
    why: [
      "Both 6s are removed.",
      "The list is empty.",
      "Every node is removed, so the result is empty."
    ],
    walk: [
      "Put a dummy node before the head so removing the first node is no special case.",
      "From the dummy: next is 1, keep it. Next is 2, keep it.",
      "2's next is 6: skip it by pointing 2 at 3.",
      "Keep 3, 4, 5. 5's next is 6: skip it, so 5 points to null. Result: [1, 2, 3, 4, 5]."
    ],
    cons: ["The number of nodes is in the range [0, 10⁴].", "1 ≤ Node.val ≤ 50", "0 ≤ val ≤ 50"]
  },
  "remove-duplicates-sorted-list": {
    body: [
      "Given the `head` of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list, still sorted.",
      LIST_NOTE
    ],
    why: [
      "The second 1 is removed.",
      "One 1 and one 3 are removed."
    ],
    walk: [
      "cur = the first 1. Its next is also 1: skip it, so the first 1 points to 2.",
      "cur's next is now 2, which is different: move cur to 2.",
      "2 has no next. Result: [1, 2]."
    ],
    cons: ["The number of nodes is in the range [0, 300].", "-100 ≤ Node.val ≤ 100", "The list is sorted in ascending order."]
  },
  "remove-duplicates-sorted-list-ii": {
    body: [
      "Given the `head` of a sorted linked list, delete all nodes that have duplicate numbers, leaving only numbers that appeared exactly once in the original list. Return the linked list, still sorted.",
      LIST_NOTE
    ],
    why: [
      "3 and 4 appear twice, so every copy of them is removed.",
      "1 appears three times, so all three are removed."
    ],
    walk: [
      "Dummy → 1 → 2 → 3 → 3 → 4 → 4 → 5, with prev = dummy.",
      "1 is not followed by another 1: prev = 1. 2 likewise: prev = 2.",
      "3 is followed by 3: skip the whole run, so 2 points to the first 4.",
      "4 is followed by 4: skip the run, so 2 points to 5.",
      "5 is unique. Result: [1, 2, 5]."
    ],
    cons: ["The number of nodes is in the range [0, 300].", "-100 ≤ Node.val ≤ 100", "The list is sorted in ascending order."]
  },
  "reorder-list": {
    body: [
      "You are given the head of a singly linked list L0 → L1 → … → Ln−1 → Ln. Reorder it to L0 → Ln → L1 → Ln−1 → L2 → Ln−2 → …",
      "You may not modify the values in the nodes; only the nodes themselves can be relinked. The function returns nothing and the judge checks the list. " + LIST_NOTE
    ],
    why: [
      "Take from the front and back alternately: 1, 4, 2, 3.",
      "1, 5, 2, 4, then the middle 3."
    ],
    walk: [
      "Find the middle and split: [1, 2] and [3, 4].",
      "Reverse the second half: [4, 3].",
      "Weave them together: 1, 4, 2, 3.",
      "Result: [1, 4, 2, 3]."
    ],
    cons: ["The number of nodes is in the range [1, 5 · 10⁴].", "1 ≤ Node.val ≤ 1000"]
  },
  "add-two-numbers": {
    body: [
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each node contains a single digit. Add the two numbers and return the sum as a linked list in the same format.",
      "The numbers have no leading zeros, except the number 0 itself."
    ],
    why: [
      "342 + 465 = 807, stored in reverse as [7, 0, 8].",
      "0 + 0 = 0.",
      "9999999 + 9999 = 10009998, stored in reverse."
    ],
    walk: [
      "Add digit by digit from the head (the ones place) with a carry.",
      "2 + 5 = 7 → digit 7, carry 0.",
      "4 + 6 = 10 → digit 0, carry 1.",
      "3 + 4 + 1 = 8 → digit 8, carry 0. Result: [7, 0, 8]."
    ],
    cons: ["The number of nodes in each list is in the range [1, 100].", "0 ≤ Node.val ≤ 9", "The lists represent numbers without leading zeros."]
  },
  "add-two-numbers-ii": {
    body: [
      "You are given two non-empty linked lists representing two non-negative integers. The most significant digit comes first, and each node contains a single digit. Add the two numbers and return the sum as a linked list in the same format.",
      "Can you solve it without reversing the input lists?"
    ],
    why: [
      "7243 + 564 = 7807.",
      "243 + 564 = 807.",
      "0 + 0 = 0."
    ],
    walk: [
      "Push each list's digits onto a stack so you can read them from the ones place: [7,2,4,3] and [5,6,4].",
      "3 + 4 = 7 → put node 7 at the front of the result.",
      "4 + 6 = 10 → put 0 at the front, carry 1. 2 + 5 + 1 = 8 → put 8 at the front.",
      "7 + 0 = 7 → put 7 at the front. Result: [7, 8, 0, 7]."
    ],
    cons: ["The number of nodes in each list is in the range [1, 100].", "0 ≤ Node.val ≤ 9", "The lists represent numbers without leading zeros."]
  },
  "swap-nodes-pairs": {
    body: [
      "Given a linked list, swap every two adjacent nodes and return its head.",
      "You must solve the problem without modifying the values in the list's nodes (only the nodes themselves may be changed). " + LIST_NOTE
    ],
    why: [
      "Pairs (1,2) and (3,4) are swapped.",
      "The list is empty.",
      "A single node has nothing to swap with."
    ],
    walk: [
      "Swap the first pair: 2 → 1.",
      "Swap the next pair: 4 → 3.",
      "Link the pairs: 1 points to 4.",
      "Result: [2, 1, 4, 3]."
    ],
    cons: ["The number of nodes is in the range [0, 100].", "0 ≤ Node.val ≤ 100"]
  },
  "reverse-linked-list-ii": {
    body: [
      "Given the `head` of a singly linked list and two integers `left` and `right` where left ≤ right, reverse the nodes of the list from position left to position right (1-based), and return the new head.",
      "Can you do it in one pass? " + LIST_NOTE
    ],
    why: [
      "Positions 2–4 hold 2, 3, 4; reversed, they become 4, 3, 2.",
      "Reversing a single node changes nothing."
    ],
    walk: [
      "Walk to the node before position 2: pre = 1. The first node to reverse is cur = 2.",
      "Move the node after cur (3) to just after pre: 1 → 3 → 2 → 4 → 5.",
      "Move the node after cur (4) to just after pre: 1 → 4 → 3 → 2 → 5.",
      "We moved right − left = 2 nodes. Done: [1, 4, 3, 2, 5]."
    ],
    cons: ["The number of nodes is n, with 1 ≤ n ≤ 500.", "-500 ≤ Node.val ≤ 500", "1 ≤ left ≤ right ≤ n"]
  },
  "rotate-list": {
    body: [
      "Given the `head` of a linked list, rotate the list to the right by `k` places. Each rotation moves the last node to the front.",
      LIST_NOTE + " k can be much larger than the length."
    ],
    why: [
      "1 rotation: [5,1,2,3,4]. 2 rotations: [4,5,1,2,3].",
      "Rotating 3 times (the length) gives back the original, so 4 rotations equal 1: [2,0,1]."
    ],
    walk: [
      "The length is 5, so k = 2 % 5 = 2.",
      "The new tail is node number 5 − 2 = 3 (value 3); the new head is the node after it (4).",
      "Connect the old tail 5 to the old head 1, and cut after 3.",
      "Result: [4, 5, 1, 2, 3]."
    ],
    cons: ["The number of nodes is in the range [0, 500].", "-100 ≤ Node.val ≤ 100", "0 ≤ k ≤ 2 · 10⁹"]
  },
  "partition-list": {
    body: [
      "Given the `head` of a linked list and a value `x`, partition it such that all nodes less than x come before nodes greater than or equal to x.",
      "You should preserve the original relative order of the nodes in each of the two partitions. " + LIST_NOTE
    ],
    why: [
      "The nodes < 3 are 1, 2, 2 (in their original order), followed by the nodes ≥ 3: 4, 3, 5.",
      "1 < 2 comes first, then 2."
    ],
    walk: [
      "Build two lists: `less` and `rest`.",
      "1 → less. 4 → rest. 3 → rest. 2 → less. 5 → rest. 2 → less.",
      "less = 1 → 2 → 2, rest = 4 → 3 → 5.",
      "Join them: [1, 2, 2, 4, 3, 5]."
    ],
    cons: ["The number of nodes is in the range [0, 200].", "-100 ≤ Node.val ≤ 100", "-200 ≤ x ≤ 200"]
  },
  "odd-even-linked-list": {
    body: [
      "Given the `head` of a singly linked list, group all the nodes with odd positions together, followed by the nodes with even positions, and return the reordered list. The first node is position 1 (odd), the second is position 2 (even), and so on.",
      "Keep the relative order inside each group. You must solve it in O(1) extra space and O(n) time."
    ],
    why: [
      "Odd positions hold 1, 3, 5; even positions hold 2, 4.",
      "Odd positions hold 2, 3, 6, 7; even positions hold 1, 5, 4. Positions matter, not the values."
    ],
    walk: [
      "odd = 1, even = 2, and remember evenHead = 2.",
      "Link odd to the node after even: 1 → 3. Link even to the node after that: 2 → 4.",
      "Repeat: 3 → 5, 4 → null.",
      "Attach the even list after the last odd node: 1 → 3 → 5 → 2 → 4."
    ],
    cons: ["The number of nodes is in the range [0, 10⁴].", "-10⁶ ≤ Node.val ≤ 10⁶"]
  },
  "linked-list-cycle-ii": {
    body: [
      "Given the `head` of a linked list, find the node where the cycle begins and return its 0-based index (LeetCode returns the node itself; here you return its position). Return −1 if there is no cycle.",
      "In the examples, `pos` is the index the tail connects back to (−1 means no cycle). It only describes how the test list is built and is not passed to your function. Do not modify the list."
    ],
    why: [
      "The tail (−4) links back to index 1 (value 2), so the cycle starts at index 1.",
      "The tail links back to the head, index 0.",
      "There is no cycle."
    ],
    walk: [
      "Phase 1: move slow by 1 and fast by 2 until they meet. In 3 → 2 → 0 → −4 → (back to 2) they meet at −4.",
      "Phase 2: put one pointer back at the head (3) and leave the other at −4. Move both 1 step at a time.",
      "3 → 2 and −4 → 2: they meet at the node with value 2.",
      "That node is at index 1, so return 1."
    ],
    cons: ["The number of nodes is in the range [0, 10⁴].", "-10⁵ ≤ Node.val ≤ 10⁵", "pos is −1 or a valid index in the list."]
  },
  "merge-k-sorted-lists": {
    body: [
      "You are given an array of k linked lists `lists`; each linked list is sorted in ascending order.",
      "Merge all the linked lists into one sorted linked list and return it."
    ],
    why: [
      "Merging 1→4→5, 1→3→4 and 2→6 gives 1→1→2→3→4→4→5→6.",
      "There are no lists.",
      "The only list is empty."
    ],
    walk: [
      "Merge the lists in pairs, halving their number each round (like merge sort).",
      "Round 1: merge [1,4,5] with [1,3,4] → [1,1,3,4,4,5]. [2,6] waits.",
      "Round 2: merge [1,1,3,4,4,5] with [2,6] → [1,1,2,3,4,4,5,6].",
      "One list remains: that is the answer. (A min-heap of list heads works too.)"
    ],
    cons: ["k == lists.length", "0 ≤ k ≤ 10⁴", "0 ≤ lists[i].length ≤ 500", "-10⁴ ≤ lists[i][j] ≤ 10⁴", "The total number of nodes is at most 10⁴."]
  },
  "reverse-nodes-k-group": {
    body: [
      "Given the `head` of a linked list, reverse the nodes of the list k at a time, and return the modified list.",
      "If the number of nodes is not a multiple of k, the nodes left at the end stay as they are. You may not change the values in the nodes, only the nodes themselves. " + LIST_NOTE
    ],
    why: [
      "Groups (1,2) and (3,4) are reversed. 5 is a group shorter than 2, so it stays.",
      "Group (1,2,3) is reversed. 4 and 5 make a group shorter than 3, so they stay."
    ],
    walk: [
      "Check there are at least k = 2 nodes ahead: 1, 2 ✓. Reverse them → 2 → 1.",
      "Next group: 3, 4 ✓. Reverse → 4 → 3. Link 1 to 4.",
      "Next group: only 5 is left, fewer than k. Leave it and link 3 to 5.",
      "Result: [2, 1, 4, 3, 5]."
    ],
    cons: ["The number of nodes is n.", "1 ≤ k ≤ n ≤ 5000", "0 ≤ Node.val ≤ 1000"]
  },
  "sort-list": {
    body: [
      "Given the `head` of a linked list, return the list after sorting it in ascending order.",
      "Can you sort it in O(n log n) time? Merge sort fits linked lists well, because merging needs no extra arrays."
    ],
    why: [
      "Sorted ascending.",
      "Sorted ascending, negatives first.",
      "An empty list stays empty."
    ],
    walk: [
      "Split at the middle: [4, 2] and [1, 3].",
      "Sort each half recursively: [2, 4] and [1, 3].",
      "Merge by taking the smaller head each time: 1, 2, 3, 4.",
      "Result: [1, 2, 3, 4]."
    ],
    cons: ["The number of nodes is in the range [0, 5 · 10⁴].", "-10⁵ ≤ Node.val ≤ 10⁵"]
  },
  "lru-cache": {
    body: [
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
      "Implement `LRUCache(capacity)`. `get(key)` returns the value of the key if it exists, otherwise −1. `put(key, value)` updates the value if the key exists, or adds the pair; if this makes the number of keys exceed capacity, evict the least recently used key. Both get and put count as using a key, and both must run in O(1) on average.",
      "The example lists the calls on one line and their arguments on the next."
    ],
    why: [
      "With capacity 2: get(1) makes key 1 recent, so put(3) evicts key 2. Later put(4) evicts key 1, which by then is the least recently used."
    ],
    walk: [
      "Keep keys ordered from least to most recently used.",
      "put(1,1) → [1]. put(2,2) → [1, 2].",
      "get(1) → 1, and 1 moves to the end: [2, 1].",
      "put(3,3): the cache is full, so evict the oldest, 2 → [1, 3]. get(2) → −1.",
      "put(4,4): evict 1 → [3, 4]. get(1) → −1, get(3) → 3, get(4) → 4."
    ],
    cons: ["1 ≤ capacity ≤ 3000", "0 ≤ key ≤ 10⁴", "0 ≤ value ≤ 10⁵", "At most 2 · 10⁵ calls to get and put."]
  },
  "design-browser-history": {
    body: [
      "You have a browser with one tab, which starts on the `homepage`. You can visit another url, go back in the history a number of steps, or move forward a number of steps.",
      "Implement `BrowserHistory(homepage)`, `visit(url)` (visiting clears all forward history), `back(steps)` and `forward(steps)`. back and forward move at most as far as the history allows and return the current url after moving. The example lists the calls on one line and their arguments on the next."
    ],
    why: [
      "After visiting google, facebook and youtube, two backs reach google and a forward returns to facebook. Visiting linkedin erases youtube from the forward history, so forward(2) can't move. back(2) reaches google, and back(7) stops at the homepage."
    ],
    walk: [
      "Keep the history in an array and an index `cur`.",
      "Visits: [leetcode, google, facebook, youtube], cur = 3.",
      "back(1) → facebook. back(1) → google. forward(1) → facebook.",
      "visit(linkedin): cut everything after facebook → [leetcode, google, facebook, linkedin], cur = 3.",
      "forward(2): nowhere to go → linkedin. back(2) → google. back(7): only 1 step is left → leetcode."
    ],
    cons: ["1 ≤ homepage.length, url.length ≤ 20", "1 ≤ steps ≤ 100", "At most 5000 calls are made."]
  },
  "twin-sum-list": {
    body: [
      "In a linked list of even size n, the i-th node (0-indexed) is the twin of the (n − 1 − i)-th node: the first and last nodes are twins, the second and second-to-last are twins, and so on.",
      "The twin sum is the sum of a node and its twin. Given the `head` of a linked list with even length, return the maximum twin sum."
    ],
    why: [
      "Twin sums: 5 + 1 = 6 and 4 + 2 = 6. The maximum is 6.",
      "Twin sums: 4 + 3 = 7 and 2 + 2 = 4. The maximum is 7.",
      "Only one pair: 1 + 100000."
    ],
    walk: [
      "Find the middle and reverse the second half: 2 → 1 becomes 1 → 2.",
      "Walk the first half (5 → 4) and the reversed half (1 → 2) together.",
      "5 + 1 = 6, 4 + 2 = 6.",
      "The maximum is 6."
    ],
    cons: ["The number of nodes is an even integer in the range [2, 10⁵].", "1 ≤ Node.val ≤ 10⁵"]
  },
  "delete-middle-node": {
    body: [
      "You are given the `head` of a linked list. Delete the middle node, and return the head of the modified linked list.",
      "The middle node of a list of size n is the ⌊n / 2⌋-th node from the start, counting from 0. For n = 1, 2, 3, 4, 5 that is index 0, 1, 1, 2, 2."
    ],
    why: [
      "n = 7, so the middle is index 3 (value 7).",
      "n = 4, so the middle is index 2 (value 3).",
      "n = 2, so the middle is index 1 (value 1)."
    ],
    walk: [
      "Start slow at the head and fast two nodes ahead, so slow stops just before the middle.",
      "slow = index 0, fast = index 2. Move: slow = 1, fast = 4. Move: slow = 2, fast = 6.",
      "fast has no next node, so stop. slow is at index 2 (value 4).",
      "Skip the middle: 4 now points to 1. Result: [1, 3, 4, 1, 2, 6]."
    ],
    cons: ["The number of nodes is in the range [1, 10⁵].", "1 ≤ Node.val ≤ 10⁵"]
  },
  "binary-list-to-integer": {
    body: [
      "Given `head`, a reference to the head node of a singly linked list in which every node is 0 or 1, the list holds the binary representation of a number, with the most significant bit at the head.",
      "Return the decimal value of the number."
    ],
    why: [
      "Binary 101 = 4 + 0 + 1 = 5.",
      "Binary 0 = 0."
    ],
    walk: [
      "Start with value = 0. For each bit: value = value × 2 + bit.",
      "1 → 0 × 2 + 1 = 1.",
      "0 → 1 × 2 + 0 = 2.",
      "1 → 2 × 2 + 1 = 5."
    ],
    cons: ["The list is not empty.", "The number of nodes is at most 30.", "Each node's value is 0 or 1."]
  }
};
