import type { ProblemDef } from "@/lib/types";

/** Linked lists (ListNode is provided). */
export const LINKED_LIST: ProblemDef[] = [
  {
    id: "middle-of-list", t: "Middle of the Linked List", d: "E", tp: ["linked-list", "fast-slow"], pt: ["fast-slow"], co: ["Amazon", "Microsoft", "Adobe"], lc: "middle-of-the-linked-list",
    s: "Return the middle node (the second middle if there are two).", h: ["Count, then walk half: two passes.", "Fast moves 2, slow moves 1: one pass."],
    a: "Fast & slow pointers.", tc: "O(n)", sc: "O(1)", sim: ["linked-list-cycle", "palindrome-linked-list", "delete-middle-node"],
    fn: "middleNode", params: "head:ListNode", ret: "ListNode",
    ex: [[[1, 2, 3, 4, 5], [3, 4, 5]], [[1, 2, 3, 4, 5, 6], [4, 5, 6]]], hid: [[[1]], [[1, 2]]],
    code: `function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  return slow;
}`
  },
  {
    id: "palindrome-linked-list", t: "Palindrome Linked List", d: "E", tp: ["linked-list", "fast-slow", "two-pointers", "recursion"], pt: ["fast-slow", "two-pointers"], co: ["Amazon", "Meta", "Microsoft", "Apple"], lc: "palindrome-linked-list",
    s: "Return true if the list reads the same forwards and backwards, in O(1) extra space.", h: ["Find the middle with fast & slow pointers.", "Reverse the second half and compare it with the first half."],
    a: "Middle → reverse second half → compare.", tc: "O(n)", sc: "O(1)", sim: ["middle-of-list", "reverse-list", "valid-palindrome"],
    fn: "isPalindrome", params: "head:ListNode", ret: "boolean",
    ex: [[[1, 2, 2, 1], true], [[1, 2], false]], hid: [[[1]], [[1, 2, 1]], [[1, 2, 3, 2, 2]]],
    code: `function isPalindrome(head) {
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  let prev = null;
  while (slow) { const nx = slow.next; slow.next = prev; prev = slow; slow = nx; }
  for (let a = head, b = prev; b; a = a.next, b = b.next) if (a.val !== b.val) return false;
  return true;
}`
  },
  {
    id: "remove-linked-list-elements", t: "Remove Linked List Elements", d: "E", tp: ["linked-list", "recursion"], pt: ["two-pointers"], co: ["Amazon", "Bloomberg"], lc: "remove-linked-list-elements",
    s: "Remove every node whose value equals val.", h: ["The head itself may need removing.", "A dummy node before head removes that special case."],
    a: "Dummy node + one pointer that skips matching nodes.", tc: "O(n)", sc: "O(1)", sim: ["remove-nth", "remove-duplicates-sorted-list", "delete-middle-node"],
    fn: "removeElements", params: "head:ListNode, val:number", ret: "ListNode",
    ex: [[[1, 2, 6, 3, 4, 5, 6], 6, [1, 2, 3, 4, 5]], [[], 1, []], [[7, 7, 7, 7], 7, []]], hid: [[[1, 2], 1], [[1, 2, 2, 1], 2]],
    code: `function removeElements(head, val) {
  const dummy = new ListNode(0, head);
  let cur = dummy;
  while (cur.next) {
    if (cur.next.val === val) cur.next = cur.next.next; else cur = cur.next;
  }
  return dummy.next;
}`
  },
  {
    id: "remove-duplicates-sorted-list", t: "Remove Duplicates from Sorted List", d: "E", tp: ["linked-list"], pt: ["two-pointers"], co: ["Amazon", "Microsoft", "Adobe"], lc: "remove-duplicates-from-sorted-list",
    s: "Delete duplicates so each value appears once (list is sorted).", h: ["Duplicates are adjacent.", "If cur.next has the same value, skip it; otherwise move on."],
    a: "Single pointer, skip equal neighbours.", tc: "O(n)", sc: "O(1)", sim: ["remove-duplicates-sorted-list-ii", "remove-linked-list-elements"],
    fn: "deleteDuplicates", params: "head:ListNode", ret: "ListNode",
    ex: [[[1, 1, 2], [1, 2]], [[1, 1, 2, 3, 3], [1, 2, 3]]], hid: [[[]], [[1, 1, 1]], [[1, 2, 3]]],
    code: `function deleteDuplicates(head) {
  let cur = head;
  while (cur && cur.next) {
    if (cur.next.val === cur.val) cur.next = cur.next.next; else cur = cur.next;
  }
  return head;
}`
  },
  {
    id: "remove-duplicates-sorted-list-ii", t: "Remove Duplicates from Sorted List II", d: "M", tp: ["linked-list", "two-pointers"], pt: ["two-pointers"], co: ["Amazon", "Meta", "Bloomberg"], lc: "remove-duplicates-from-sorted-list-ii",
    s: "Delete every value that appears more than once, leaving only distinct values.", h: ["The head can be removed: use a dummy node.", "When a run of equal values is found, link prev past the whole run."],
    a: "Dummy + prev pointer; skip entire duplicate runs.", tc: "O(n)", sc: "O(1)", sim: ["remove-duplicates-sorted-list", "remove-linked-list-elements"],
    fn: "deleteDuplicates", params: "head:ListNode", ret: "ListNode",
    ex: [[[1, 2, 3, 3, 4, 4, 5], [1, 2, 5]], [[1, 1, 1, 2, 3], [2, 3]]], hid: [[[]], [[1, 1]], [[1, 2, 2]]],
    code: `function deleteDuplicates(head) {
  const dummy = new ListNode(0, head);
  let prev = dummy, cur = head;
  while (cur) {
    if (cur.next && cur.next.val === cur.val) {
      const v = cur.val;
      while (cur && cur.val === v) cur = cur.next;
      prev.next = cur;
    } else { prev = cur; cur = cur.next; }
  }
  return dummy.next;
}`
  },
  {
    id: "reorder-list", t: "Reorder List", d: "M", tp: ["linked-list", "fast-slow", "two-pointers", "stack"], pt: ["fast-slow", "two-pointers"], co: ["Amazon", "Meta", "Microsoft", "Adobe"], lc: "reorder-list",
    s: "Reorder L0→L1→…→Ln into L0→Ln→L1→Ln-1→… in place.", h: ["Three list skills combined: find middle, reverse, merge.", "Split at the middle, reverse the second half, then weave the two halves."],
    a: "Middle + reverse + alternate merge.", tc: "O(n)", sc: "O(1)", sim: ["middle-of-list", "reverse-list", "merge-sorted-lists"],
    fn: "reorderList", params: "head:ListNode", ret: "void", inplace: 0, note: "Rearrange the list in place; the judge reads the list starting at head.",
    ex: [[[1, 2, 3, 4], [1, 4, 2, 3]], [[1, 2, 3, 4, 5], [1, 5, 2, 4, 3]]], hid: [[[1]], [[1, 2]], [[1, 2, 3]]],
    code: `function reorderList(head) {
  if (!head || !head.next) return;
  let slow = head, fast = head;
  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }
  let prev = null, cur = slow.next;
  slow.next = null;
  while (cur) { const nx = cur.next; cur.next = prev; prev = cur; cur = nx; }
  let a = head, b = prev;
  while (b) { const an = a.next, bn = b.next; a.next = b; b.next = an; a = an; b = bn; }
}`
  },
  {
    id: "add-two-numbers", t: "Add Two Numbers", d: "M", tp: ["linked-list", "math-basics", "recursion"], pt: ["two-pointers"], co: ["Amazon", "Microsoft", "Meta", "Bloomberg", "Adobe"], lc: "add-two-numbers",
    s: "Two numbers are stored in reverse order, one digit per node. Return their sum as a list in the same format.", h: ["Add digit by digit like on paper, carrying.", "Keep going while either list or the carry remains."],
    a: "Dummy head, running carry.", tc: "O(max(m, n))", sc: "O(1) extra", sim: ["add-two-numbers-ii", "plus-one", "add-binary"],
    fn: "addTwoNumbers", params: "l1:ListNode, l2:ListNode", ret: "ListNode",
    ex: [[[2, 4, 3], [5, 6, 4], [7, 0, 8]], [[0], [0], [0]], [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9], [8, 9, 9, 9, 0, 0, 0, 1]]], hid: [[[5], [5]], [[1, 8], [0]]],
    code: `function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let t = dummy, carry = 0;
  while (l1 || l2 || carry) {
    const s = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    carry = Math.floor(s / 10);
    t = t.next = new ListNode(s % 10);
    l1 = l1 && l1.next; l2 = l2 && l2.next;
  }
  return dummy.next;
}`
  },
  {
    id: "add-two-numbers-ii", t: "Add Two Numbers II", d: "M", tp: ["linked-list", "stack", "math-basics"], pt: ["monotonic-stack"], co: ["Microsoft", "Amazon", "Bloomberg"], lc: "add-two-numbers-ii",
    s: "Same as Add Two Numbers, but digits are stored most significant first.", h: ["You need to add from the end.", "Push digits onto two stacks, pop and add, and build the result by prepending."],
    a: "Two stacks + prepend new nodes.", tc: "O(m + n)", sc: "O(m + n)", sim: ["add-two-numbers", "reverse-list"],
    fn: "addTwoNumbers", params: "l1:ListNode, l2:ListNode", ret: "ListNode",
    ex: [[[7, 2, 4, 3], [5, 6, 4], [7, 8, 0, 7]], [[2, 4, 3], [5, 6, 4], [8, 0, 7]], [[0], [0], [0]]], hid: [[[9, 9], [1]], [[1], [9, 9, 9]]],
    code: `function addTwoNumbers(l1, l2) {
  const a = [], b = [];
  for (let p = l1; p; p = p.next) a.push(p.val);
  for (let p = l2; p; p = p.next) b.push(p.val);
  let head = null, carry = 0;
  while (a.length || b.length || carry) {
    const s = (a.pop() || 0) + (b.pop() || 0) + carry;
    carry = Math.floor(s / 10);
    head = new ListNode(s % 10, head);
  }
  return head;
}`
  },
  {
    id: "swap-nodes-pairs", t: "Swap Nodes in Pairs", d: "M", tp: ["linked-list", "recursion"], pt: ["recursion"], co: ["Amazon", "Meta", "Microsoft"], lc: "swap-nodes-in-pairs",
    s: "Swap every two adjacent nodes (swap nodes, not values).", h: ["Recursive: swap the first two, then attach the result of the rest.", "Iterative: a dummy node and careful pointer rewiring."],
    a: "Recursion: second.next = first; first.next = swap(rest).", tc: "O(n)", sc: "O(n) stack", sim: ["reverse-nodes-k-group", "reverse-list"],
    fn: "swapPairs", params: "head:ListNode", ret: "ListNode",
    ex: [[[1, 2, 3, 4], [2, 1, 4, 3]], [[], []], [[1], [1]]], hid: [[[1, 2, 3]], [[1, 2]]],
    code: `function swapPairs(head) {
  if (!head || !head.next) return head;
  const second = head.next;
  head.next = swapPairs(second.next);
  second.next = head;
  return second;
}`
  },
  {
    id: "reverse-linked-list-ii", t: "Reverse Linked List II", d: "M", tp: ["linked-list"], pt: ["two-pointers"], co: ["Amazon", "Meta", "Microsoft", "Bloomberg"], lc: "reverse-linked-list-ii",
    s: "Reverse the nodes from position left to right (1-based) in one pass.", h: ["Walk to the node before position left.", "Repeatedly move the next node to the front of the sublist (head insertion)."],
    a: "Dummy + head insertion right - left times.", tc: "O(n)", sc: "O(1)", sim: ["reverse-list", "reverse-nodes-k-group"],
    fn: "reverseBetween", params: "head:ListNode, left:number, right:number", ret: "ListNode",
    ex: [[[1, 2, 3, 4, 5], 2, 4, [1, 4, 3, 2, 5]], [[5], 1, 1, [5]]], hid: [[[3, 5], 1, 2], [[1, 2, 3], 1, 3], [[1, 2, 3, 4], 3, 4]],
    code: `function reverseBetween(head, left, right) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  for (let i = 1; i < left; i++) prev = prev.next;
  const start = prev.next;
  for (let i = 0; i < right - left; i++) {
    const move = start.next;
    start.next = move.next;
    move.next = prev.next;
    prev.next = move;
  }
  return dummy.next;
}`
  },
  {
    id: "rotate-list", t: "Rotate List", d: "M", tp: ["linked-list", "two-pointers"], pt: ["two-pointers"], co: ["Amazon", "Microsoft", "LinkedIn"], lc: "rotate-list",
    s: "Rotate the list to the right by k places.", h: ["k can exceed the length: use k % length.", "Connect the tail to the head, then cut at the new tail."],
    a: "Make it circular, walk to the new tail (len - k % len - 1 steps), break.", tc: "O(n)", sc: "O(1)", sim: ["rotate-array", "remove-nth"],
    fn: "rotateRight", params: "head:ListNode, k:number", ret: "ListNode",
    ex: [[[1, 2, 3, 4, 5], 2, [4, 5, 1, 2, 3]], [[0, 1, 2], 4, [2, 0, 1]]], hid: [[[], 3], [[1], 99], [[1, 2], 2]],
    code: `function rotateRight(head, k) {
  if (!head || !head.next) return head;
  let len = 1, tail = head;
  while (tail.next) { tail = tail.next; len++; }
  k %= len;
  if (!k) return head;
  tail.next = head;
  let newTail = head;
  for (let i = 0; i < len - k - 1; i++) newTail = newTail.next;
  const newHead = newTail.next;
  newTail.next = null;
  return newHead;
}`
  },
  {
    id: "partition-list", t: "Partition List", d: "M", tp: ["linked-list", "two-pointers"], pt: ["two-pointers"], co: ["Amazon", "Microsoft", "Adobe"], lc: "partition-list",
    s: "Move all nodes with value < x before nodes ≥ x, keeping relative order within each part.", h: ["Build two separate lists as you walk.", "Join the 'less' list to the 'greater-or-equal' list."],
    a: "Two dummy-headed lists, then concatenate.", tc: "O(n)", sc: "O(1)", sim: ["odd-even-linked-list", "sort-colors"],
    fn: "partition", params: "head:ListNode, x:number", ret: "ListNode",
    ex: [[[1, 4, 3, 2, 5, 2], 3, [1, 2, 2, 4, 3, 5]], [[2, 1], 2, [1, 2]]], hid: [[[], 0], [[3, 1, 2], 4], [[1, 1], 0]],
    code: `function partition(head, x) {
  const lo = new ListNode(0), hi = new ListNode(0);
  let a = lo, b = hi;
  for (let p = head; p; p = p.next) {
    if (p.val < x) a = a.next = p; else b = b.next = p;
  }
  b.next = null;
  a.next = hi.next;
  return lo.next;
}`
  },
  {
    id: "odd-even-linked-list", t: "Odd Even Linked List", d: "M", tp: ["linked-list"], pt: ["two-pointers"], co: ["Amazon", "Microsoft", "Bloomberg"], lc: "odd-even-linked-list",
    s: "Group all nodes at odd positions first, then even positions (1-based), in O(1) extra space.", h: ["Keep an odd tail and an even tail.", "Link them alternately, then attach the even head after the odd tail."],
    a: "Two pointers stepping by two.", tc: "O(n)", sc: "O(1)", sim: ["partition-list", "reorder-list"],
    fn: "oddEvenList", params: "head:ListNode", ret: "ListNode",
    ex: [[[1, 2, 3, 4, 5], [1, 3, 5, 2, 4]], [[2, 1, 3, 5, 6, 4, 7], [2, 3, 6, 7, 1, 5, 4]]], hid: [[[]], [[1]], [[1, 2]]],
    code: `function oddEvenList(head) {
  if (!head) return head;
  let odd = head, even = head.next;
  const evenHead = even;
  while (even && even.next) {
    odd.next = even.next; odd = odd.next;
    even.next = odd.next; even = even.next;
  }
  odd.next = evenHead;
  return head;
}`
  },
  {
    id: "linked-list-cycle-ii", t: "Linked List Cycle II", d: "M", tp: ["linked-list", "fast-slow", "hashing", "math-basics"], pt: ["fast-slow"], co: ["Amazon", "Microsoft", "Bloomberg", "Goldman Sachs"], lc: "linked-list-cycle-ii",
    s: "Return the 0-based index of the node where the cycle begins, or -1 if there is no cycle. (LeetCode returns the node; here you return its index.)", h: ["Floyd: find a meeting point inside the cycle.", "Reset one pointer to head; moving both one step at a time, they meet at the cycle start."],
    a: "Floyd's cycle detection, then count steps from head to the entrance.", tc: "O(n)", sc: "O(1)", note: "pos is where the tail connects (-1 = no cycle). Your function gets only head and returns an index.", sim: ["linked-list-cycle", "find-duplicate-number"],
    fn: "detectCycle", params: "head:cycle", ret: "number",
    ex: [[[[3, 2, 0, -4], 1], 1], [[[1, 2], 0], 0], [[[1], -1], -1]], hid: [[[[], -1]], [[[1, 2, 3, 4, 5, 6], 3]], [[[1], 0]]],
    code: `function detectCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next;
    if (slow === fast) {
      let p = head, idx = 0;
      while (p !== slow) { p = p.next; slow = slow.next; idx++; }
      return idx;
    }
  }
  return -1;
}`
  },
  {
    id: "merge-k-sorted-lists", t: "Merge k Sorted Lists", d: "H", tp: ["linked-list", "heap", "divide-conquer"], pt: ["top-k", "recursion"], co: ["Amazon", "Google", "Meta", "Microsoft", "Uber"], lc: "merge-k-sorted-lists",
    s: "Merge k sorted linked lists into one sorted list.", h: ["Merging one by one is O(kN).", "Divide and conquer: merge pairs of lists, halving the count each round (or use a min-heap)."],
    a: "Pairwise merging in log k rounds.", tc: "O(N log k)", sc: "O(1) extra", sim: ["merge-sorted-lists", "sort-list", "find-k-pairs-smallest-sums"],
    fn: "mergeKLists", params: "lists:ListNode[]", ret: "ListNode",
    ex: [[[[1, 4, 5], [1, 3, 4], [2, 6]], [1, 1, 2, 3, 4, 4, 5, 6]], [[], []], [[[]], []]], hid: [[[[1], [0]]], [[[5], [], [1, 2, 3], [4]]]],
    code: `function mergeKLists(lists) {
  const merge2 = (a, b) => {
    const d = new ListNode(0); let t = d;
    while (a && b) { if (a.val <= b.val) { t.next = a; a = a.next; } else { t.next = b; b = b.next; } t = t.next; }
    t.next = a || b;
    return d.next;
  };
  if (!lists.length) return null;
  while (lists.length > 1) {
    const next = [];
    for (let i = 0; i < lists.length; i += 2) next.push(merge2(lists[i], lists[i + 1] || null));
    lists = next;
  }
  return lists[0];
}`
  },
  {
    id: "reverse-nodes-k-group", t: "Reverse Nodes in k-Group", d: "H", tp: ["linked-list", "recursion"], pt: ["recursion", "two-pointers"], co: ["Microsoft", "Amazon", "Meta", "Google"], lc: "reverse-nodes-in-k-group",
    s: "Reverse the nodes of the list k at a time; a final group shorter than k stays as is.", h: ["Check that k nodes remain before reversing a group.", "Reverse the group, connect its new tail to the result of the next group."],
    a: "Recursive group reversal with a length check.", tc: "O(n)", sc: "O(n / k) stack", sim: ["swap-nodes-pairs", "reverse-linked-list-ii", "reverse-list"],
    fn: "reverseKGroup", params: "head:ListNode, k:number", ret: "ListNode",
    ex: [[[1, 2, 3, 4, 5], 2, [2, 1, 4, 3, 5]], [[1, 2, 3, 4, 5], 3, [3, 2, 1, 4, 5]]], hid: [[[1], 1], [[1, 2, 3, 4], 4], [[1, 2, 3, 4, 5, 6, 7], 3]],
    code: `function reverseKGroup(head, k) {
  let p = head;
  for (let i = 0; i < k; i++) { if (!p) return head; p = p.next; }
  let prev = reverseKGroup(p, k), cur = head;
  for (let i = 0; i < k; i++) { const nx = cur.next; cur.next = prev; prev = cur; cur = nx; }
  return prev;
}`
  },
  {
    id: "sort-list", t: "Sort List", d: "M", tp: ["linked-list", "sorting", "divide-conquer", "fast-slow"], pt: ["recursion", "fast-slow"], co: ["Meta", "Amazon", "Microsoft", "Bytedance"], lc: "sort-list",
    s: "Sort a linked list in O(n log n) time.", h: ["Merge sort suits linked lists: no random access needed.", "Split at the middle (fast & slow), sort each half, merge."],
    a: "Top-down merge sort.", tc: "O(n log n)", sc: "O(log n)", sim: ["sort-array", "merge-sorted-lists", "merge-k-sorted-lists"],
    fn: "sortList", params: "head:ListNode", ret: "ListNode",
    ex: [[[4, 2, 1, 3], [1, 2, 3, 4]], [[-1, 5, 3, 4, 0], [-1, 0, 3, 4, 5]], [[], []]], hid: [[[1]], [[2, 1]], [[3, 3, 1, 1, 2]]],
    code: `function sortList(head) {
  if (!head || !head.next) return head;
  let slow = head, fast = head.next;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  const right = slow.next; slow.next = null;
  let a = sortList(head), b = sortList(right);
  const d = new ListNode(0); let t = d;
  while (a && b) { if (a.val <= b.val) { t.next = a; a = a.next; } else { t.next = b; b = b.next; } t = t.next; }
  t.next = a || b;
  return d.next;
}`
  },
  {
    id: "lru-cache", t: "LRU Cache", d: "M", tp: ["linked-list", "hashing"], pt: ["hashing"], co: ["Amazon", "Microsoft", "Meta", "Google", "Bloomberg", "Uber"], lc: "lru-cache",
    s: "Design LRUCache(capacity) with get(key) and put(key, value) in O(1); evict the least recently used key when full.", h: ["You need O(1) lookup and O(1) 'move to most recent'.", "Map + doubly linked list. In JS, a Map already keeps insertion order: delete and re-insert to refresh."],
    a: "Map with delete/re-set to mark as recent; evict map.keys().next().", tc: "O(1)", sc: "O(capacity)", sim: ["lfu-cache", "design-browser-history"],
    fn: "LRUCache", ctor: "capacity:number", methods: "get(key:number):number; put(key:number, value:number):void",
    ex: [[["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]], [null, null, null, 1, null, -1, null, -1, 3, 4]]],
    hid: [[["LRUCache", "put", "get", "put", "get", "get"], [[1], [2, 1], [2], [3, 2], [2], [3]]], [["LRUCache", "put", "put", "put", "put", "get", "get"], [[2], [2, 1], [1, 1], [2, 3], [4, 1], [1], [2]]]],
    code: `class LRUCache {
  constructor(capacity) { this.cap = capacity; this.map = new Map(); }
  get(key) {
    if (!this.map.has(key)) return -1;
    const v = this.map.get(key);
    this.map.delete(key); this.map.set(key, v);
    return v;
  }
  put(key, value) {
    this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.cap) this.map.delete(this.map.keys().next().value);
  }
}`
  },
  {
    id: "design-browser-history", t: "Design Browser History", d: "M", tp: ["linked-list", "stack", "arrays"], pt: ["two-pointers"], co: ["Amazon", "Roblox", "Bloomberg"], lc: "design-browser-history",
    s: "Implement BrowserHistory(homepage) with visit(url), back(steps) and forward(steps).", h: ["An array of pages plus a current index.", "visit() cuts off all forward history."],
    a: "Array + current pointer + last valid index.", tc: "O(1) per op", sc: "O(n)", sim: ["lru-cache", "simplify-path"],
    fn: "BrowserHistory", ctor: "homepage:string", methods: "visit(url:string):void; back(steps:number):string; forward(steps:number):string",
    ex: [[["BrowserHistory", "visit", "visit", "visit", "back", "back", "forward", "visit", "forward", "back", "back"], [["leetcode.com"], ["google.com"], ["facebook.com"], ["youtube.com"], [1], [1], [1], ["linkedin.com"], [2], [2], [7]], [null, null, null, null, "facebook.com", "google.com", "facebook.com", null, "linkedin.com", "google.com", "leetcode.com"]]],
    hid: [[["BrowserHistory", "back", "forward", "visit", "back"], [["a.com"], [3], [3], ["b.com"], [1]]]],
    code: `class BrowserHistory {
  constructor(homepage) { this.pages = [homepage]; this.cur = 0; this.last = 0; }
  visit(url) { this.cur++; this.pages[this.cur] = url; this.last = this.cur; }
  back(steps) { this.cur = Math.max(0, this.cur - steps); return this.pages[this.cur]; }
  forward(steps) { this.cur = Math.min(this.last, this.cur + steps); return this.pages[this.cur]; }
}`
  },
  {
    id: "twin-sum-list", t: "Maximum Twin Sum of a Linked List", d: "M", tp: ["linked-list", "fast-slow", "two-pointers", "stack"], pt: ["fast-slow", "two-pointers"], co: ["Amazon", "Google"], lc: "maximum-twin-sum-of-a-linked-list",
    s: "The list has even length n. Node i and node n-1-i are twins. Return the maximum twin sum.", h: ["Find the middle.", "Reverse the second half and walk both halves together."],
    a: "Middle + reverse + paired walk.", tc: "O(n)", sc: "O(1)", sim: ["palindrome-linked-list", "reorder-list"],
    fn: "pairSum", params: "head:ListNode", ret: "number",
    ex: [[[5, 4, 2, 1], 6], [[4, 2, 2, 3], 7], [[1, 100000], 100001]], hid: [[[1, 1]], [[47, 22, 81, 46, 94, 95, 90, 22, 55, 91, 6, 83, 49, 65, 10, 32, 41, 26, 83, 99, 14, 85, 42, 99, 89, 69, 30, 92, 32, 74, 9, 81, 5, 9]]],
    code: `function pairSum(head) {
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  let prev = null;
  while (slow) { const nx = slow.next; slow.next = prev; prev = slow; slow = nx; }
  let best = 0;
  for (let a = head, b = prev; b; a = a.next, b = b.next) best = Math.max(best, a.val + b.val);
  return best;
}`
  },
  {
    id: "delete-middle-node", t: "Delete the Middle Node of a Linked List", d: "M", tp: ["linked-list", "fast-slow"], pt: ["fast-slow"], co: ["Amazon", "Microsoft"], lc: "delete-the-middle-node-of-a-linked-list",
    s: "Delete the middle node (index ⌊n/2⌋) and return the head.", h: ["You need the node before the middle.", "Start fast one step ahead (or two), so slow stops just before the middle."],
    a: "Fast & slow with an offset.", tc: "O(n)", sc: "O(1)", sim: ["middle-of-list", "remove-nth"],
    fn: "deleteMiddle", params: "head:ListNode", ret: "ListNode",
    ex: [[[1, 3, 4, 7, 1, 2, 6], [1, 3, 4, 1, 2, 6]], [[1, 2, 3, 4], [1, 2, 4]], [[2, 1], [2]]], hid: [[[1]], [[1, 2, 3]]],
    code: `function deleteMiddle(head) {
  if (!head.next) return null;
  let slow = head, fast = head.next.next;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  slow.next = slow.next.next;
  return head;
}`
  },
  {
    id: "binary-list-to-integer", t: "Convert Binary Number in a Linked List to Integer", d: "E", tp: ["linked-list", "bit-manipulation", "math-basics"], pt: ["bit-manipulation"], co: ["Amazon", "Apple"], lc: "convert-binary-number-in-a-linked-list-to-integer",
    s: "Each node holds 0 or 1; the list is a binary number (most significant bit first). Return its value.", h: ["Walk once.", "value = value · 2 + bit (or value << 1 | bit)."],
    a: "Horner's rule while walking.", tc: "O(n)", sc: "O(1)", sim: ["add-binary", "counting-bits"],
    fn: "getDecimalValue", params: "head:ListNode", ret: "number",
    ex: [[[1, 0, 1], 5], [[0], 0]], hid: [[[1]], [[1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0]], [[0, 0]]],
    code: `function getDecimalValue(head) {
  let v = 0;
  for (let p = head; p; p = p.next) v = v * 2 + p.val;
  return v;
}`
  }
];
