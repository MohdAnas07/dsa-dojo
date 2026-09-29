import type { Lesson } from "@/lib/types";

const linkedList: Lesson = {
  what: "A linked list is a chain of nodes. Each node holds a value and a pointer (next) to the next node. The list is accessed from its first node, the head.",
  analogy: { short: "A treasure hunt", text: "Each clue tells you where the next clue is hidden. To reach clue #5 you must follow clues 1 to 4. But adding a new clue is easy: just change where one clue points." },
  eli5: "Kids holding hands in a line. Each kid only knows who is next. To add a new kid, two kids let go and hold the new kid's hands. Nobody else moves.",
  tech: "Nodes live anywhere in memory and are connected by references. Insert/delete at a known node is O(1) (just rewire pointers), but reaching the i-th node is O(n). Variants: singly, doubly (prev + next), circular.",
  why: "Arrays shift elements on every insert/delete in the middle. Linked lists rewire two pointers instead. They are the basis for queues, LRU caches, adjacency lists and many interview problems about pointer manipulation.",
  how: ["Create nodes: { val, next }.", "head points to the first node; the last node's next is null.", "Traverse: cur = head; while (cur) { …; cur = cur.next }.", "Insert after node p: newNode.next = p.next; p.next = newNode.", "Delete after p: p.next = p.next.next.", "A dummy node before head simplifies edge cases."],
  props: ["Sequential access only (no index jump)", "O(1) insert/delete when you have the node", "Extra memory per node for the pointer", "Size can grow freely"],
  use: ["Frequent inserts/deletes at the front or at known positions", "Implementing queues, stacks, LRU caches", "When you don't know the size in advance"],
  avoid: ["You need random access by index", "Memory overhead or cache performance matters"],
  viz: "linked",
  cx: [["Access i-th", "O(n)", "Must walk from head, one node at a time."], ["Search", "O(n)", "Same walk."], ["Insert/delete at head", "O(1)", "Just repoint head."], ["Insert/delete after known node", "O(1)", "Rewire two pointers, nothing shifts."], ["Insert at tail", "O(n) or O(1)", "O(1) if you keep a tail pointer."]],
  space: "O(n) nodes, each with an extra pointer.",
  code: {
    c: `class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

// build 1 -> 2 -> 3
const head = new ListNode(1, new ListNode(2, new ListNode(3)));

// insert 99 after the first node
const node = new ListNode(99);
node.next = head.next;
head.next = node;

function toArray(h) {
  const out = [];
  for (let cur = h; cur; cur = cur.next) out.push(cur.val);
  return out;
}
console.log(toArray(head));`,
    hl: [13, 14],
    ex: { 13: "First point the new node at the rest of the list…", 14: "…then attach it. Doing these in the other order loses the rest of the list!", 18: "Standard traversal: stop when cur becomes null." }
  },
  examples: [
    { lvl: "Easy", title: "Reverse a linked list", prob: "Reverse the list and return the new head.", idea: "Walk through the list, turning each arrow around. Keep three pointers: prev, cur, next.", c: `class ListNode { constructor(v, n = null) { this.val = v; this.next = n; } }
const build = a => a.reduceRight((n, v) => new ListNode(v, n), null);
const show = h => { const o = []; while (h) { o.push(h.val); h = h.next; } return o; };

function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}
console.log(show(reverseList(build([1, 2, 3, 4, 5]))));`, time: "O(n)", space: "O(1)", ex: { 8: "Save next first: we're about to overwrite cur.next.", 9: "Turn the arrow around.", 10: "Move both pointers one step forward." } },
    { lvl: "Practical", title: "Middle of the list (fast & slow)", prob: "Return the middle node's value.", idea: "slow moves 1 step, fast moves 2. When fast reaches the end, slow is in the middle.", c: `class ListNode { constructor(v, n = null) { this.val = v; this.next = n; } }
const build = a => a.reduceRight((n, v) => new ListNode(v, n), null);

function middle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow.val;
}
console.log(middle(build([1, 2, 3, 4, 5])));
console.log(middle(build([1, 2, 3, 4, 5, 6])));`, time: "O(n)", space: "O(1)" },
    { lvl: "Interview", title: "Merge two sorted lists", prob: "Merge two sorted lists into one sorted list.", idea: "Use a dummy head and a tail pointer. Repeatedly attach the smaller front node. Attach the leftovers at the end.", c: `class ListNode { constructor(v, n = null) { this.val = v; this.next = n; } }
const build = a => a.reduceRight((n, v) => new ListNode(v, n), null);
const show = h => { const o = []; while (h) { o.push(h.val); h = h.next; } return o; };

function mergeTwoLists(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a || b;
  return dummy.next;
}
console.log(show(mergeTwoLists(build([1, 2, 4]), build([1, 3, 4]))));`, time: "O(n + m)", space: "O(1)", ex: { 6: "Dummy node: no special case for 'which list gives the first node?'" } }
  ],
  signals: [["\"reverse\" a list or part of it", "prev / cur / next pointers"], ["\"cycle\", \"middle\", \"k-th from end\"", "Fast & slow pointers"], ["\"merge sorted lists\"", "Dummy node + tail"], ["\"remove nodes\"", "Dummy node before head"], ["\"O(1) insert/delete + lookup\" (LRU)", "Doubly linked list + Map"]],
  mistakes: [["Losing the rest of the list by overwriting next too early", "Save cur.next in a variable before changing it."], ["Not handling empty list or single node", "Check head === null / head.next === null first."], ["Returning head instead of dummy.next", "When the head may change, always return dummy.next."], ["fast.next.next when fast.next is null", "Loop condition: while (fast && fast.next)."]],
  js: ["JS has no built-in linked list; use a class or plain objects { val, next }.", "Objects are references: assigning cur = cur.next never copies nodes."],
  iq: { Beginner: ["Print all nodes", "Count nodes"], Easy: ["reverse-list", "merge-sorted-lists", "linked-list-cycle"], Medium: ["Remove Nth node from end", "Reorder list", "Add two numbers"], Hard: ["Merge k sorted lists", "Reverse nodes in k-group"] },
  rev: { s30: "Nodes with next pointers. Access O(n), insert/delete at a known spot O(1). Most problems = pointer rewiring, dummy node, or fast & slow pointers.", m2: ["Reverse: next = cur.next; cur.next = prev; prev = cur; cur = next", "Middle/cycle: slow 1 step, fast 2 steps", "Dummy node when head may change", "Save next before rewiring"] },
  cheat: `LINKED LIST CHEAT SHEET

Access/Search  → O(n)
Insert/Delete  → O(1) at known node
Head ops       → O(1)

Reverse:
  prev = null
  while (cur) { nx = cur.next; cur.next = prev;
                prev = cur; cur = nx }

Think Linked List tricks when:
→ reverse          → 3 pointers
→ middle / cycle   → fast & slow
→ merge / remove   → dummy node`
};

export default linkedList;
