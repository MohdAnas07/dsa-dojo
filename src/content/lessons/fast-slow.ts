import type { Lesson } from "@/lib/types";

const NODE = "class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }\n";

const fastSlow: Lesson = {
  what: "The fast & slow pointers technique (the tortoise and the hare) moves two pointers through a sequence at different speeds, usually one step and two steps at a time. Their positions reveal the middle of a list, detect cycles, and even find where a cycle starts.",
  analogy: { short: "Runners on a circular track", text: "If a fast runner and a slow runner start together on a circular track, the fast one eventually laps the slow one. On a straight road, the fast runner just reaches the end first, when the slow one is halfway." },
  eli5: "A rabbit and a turtle race. If the path loops in a circle, the rabbit will catch up with the turtle from behind. If the path is straight, the rabbit simply finishes first.",
  tech: "With slow moving 1 step and fast moving 2 steps: when fast reaches the end of a list, slow is at the middle. If there's a cycle, fast enters it and gains one step per move, so they must meet inside the cycle (Floyd's algorithm), using O(1) memory instead of a visited set. To find where the cycle starts, put one pointer back at the head and move both one step at a time: they meet at the entrance (the distance from the head to the entrance equals the distance from the meeting point to the entrance, modulo the cycle length). The same idea works on any 'next' function: number sequences (happy number) or arrays whose values are indices (find the duplicate).",
  why: "It solves linked-list problems in O(n) time and O(1) space where the obvious approach uses a set or extra passes: middle of a list, cycle detection, cycle start, palindrome list, reorder list.",
  how: ["Start slow and fast at the head.", "Loop while fast and fast.next exist: slow = slow.next, fast = fast.next.next.", "Middle: when the loop ends, slow is the middle (the second one for even lengths).", "Cycle: if slow === fast at any point, there is a cycle.", "Cycle start: reset one pointer to the head and move both by one until they meet."],
  props: ["O(n) time, O(1) space", "Works on any sequence defined by a 'next' step", "Even length: slow ends at the second middle", "Meeting point → cycle; reset → entrance"],
  use: ["Middle of a linked list", "Detecting cycles", "Finding the start of a cycle", "Palindrome linked list (find the middle, reverse half)", "Find the duplicate number, happy number"],
  avoid: ["Arrays with random access (just use indices)", "When extra memory is fine and a Set is simpler to explain"],
  viz: "linked",
  cx: [["Middle / cycle detection", "O(n)", "fast reaches the end or laps slow within O(n) steps."], ["Cycle start", "O(n)", "A second walk of at most n steps."], ["Space", "O(1)", "Two pointers."]],
  space: "O(1).",
  code: {
    c: NODE + `const build = arr => arr.reduceRight((next, val) => new ListNode(val, next), null);
function middle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
  return slow.val;
}
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
const list = build([1, 2, 3, 4, 5]);
console.log(middle(list), middle(build([1, 2, 3, 4, 5, 6])));
console.log(hasCycle(list));
list.next.next.next.next.next = list.next;
console.log(hasCycle(list));`,
    hl: [5, 13],
    ex: { 5: "fast moves twice as far, so when it reaches the end, slow is halfway.", 13: "In a cycle the fast pointer laps the slow one and they must meet.", 18: "Odd length → the middle; even length → the second middle (4).", 20: "Point the tail (5) back at node 2 to create a cycle." }
  },
  examples: [
    { lvl: "Easy", title: "Happy number", prob: "Repeatedly replace n with the sum of the squares of its digits. Does it reach 1, or loop forever?", idea: "The numbers form a sequence with a 'next' rule, so it either reaches 1 or enters a cycle. Fast & slow detects which, without a set.", c: `function isHappy(n) {
  const next = x => String(x).split("").reduce((s, d) => s + d * d, 0);
  let slow = n, fast = next(n);
  while (fast !== 1 && slow !== fast) {
    slow = next(slow);
    fast = next(next(fast));
  }
  return fast === 1;
}
console.log(isHappy(19), isHappy(2));`, time: "O(log n) per step, few steps", space: "O(1)", ex: { 2: "The 'next' function: sum of squared digits.", 6: "fast takes two steps for every step of slow." } },
    { lvl: "Practical", title: "Where does the cycle start?", prob: "Return the value of the node where a linked list's cycle begins (or null).", idea: "After slow and fast meet, a pointer from the head and a pointer from the meeting point, both moving one step, meet exactly at the cycle's entrance.", c: NODE + `function detectCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      let p = head;
      while (p !== slow) { p = p.next; slow = slow.next; }
      return p.val;
    }
  }
  return null;
}
const nodes = [3, 2, 0, -4].map(v => new ListNode(v));
nodes.forEach((n, i) => (n.next = nodes[i + 1] || nodes[1]));
console.log(detectCycle(nodes[0]));`, time: "O(n)", space: "O(1)", ex: { 8: "Phase 2: reset one pointer to the head.", 9: "Both move one step; they meet at the entrance.", 16: "The tail (−4) links back to the node with value 2." } },
    { lvl: "Interview", title: "Find the duplicate number", prob: "nums has n + 1 values in [1, n] and one repeated value. Find it without modifying the array, in O(1) space.", idea: "Treat each value as a pointer to an index: i → nums[i]. The duplicate makes two indices point to the same place, which creates a cycle whose entrance is the duplicate.", c: `function findDuplicate(nums) {
  let slow = nums[0], fast = nums[nums[0]];
  while (slow !== fast) { slow = nums[slow]; fast = nums[nums[fast]]; }
  slow = 0;
  while (slow !== fast) { slow = nums[slow]; fast = nums[fast]; }
  return slow;
}
console.log(findDuplicate([1, 3, 4, 2, 2]), findDuplicate([3, 1, 3, 4, 2]));`, time: "O(n)", space: "O(1)", ex: { 3: "Phase 1: find a meeting point inside the cycle.", 5: "Phase 2: walk from the start and from the meeting point; they meet at the duplicate." } }
  ],
  signals: [["\"middle of the linked list\"", "Fast & slow"], ["\"cycle\" in a linked list, O(1) memory", "Floyd's tortoise and hare"], ["\"where does the cycle begin\"", "Meet, then reset one pointer to the head"], ["sequence defined by a rule that may repeat", "Fast & slow on the 'next' function"], ["values are indices into the same array, one duplicate", "Cycle detection on i → nums[i]"]],
  mistakes: [["Checking fast.next.next without checking fast.next", "Loop while (fast && fast.next) so you never step past null."], ["Comparing values instead of nodes", "Two nodes can hold the same value; compare references (slow === fast)."], ["Expecting the first middle for even lengths", "This loop gives the second middle; start fast at head.next for the first."], ["Forgetting phase 2", "The meeting point is not the cycle's start."]],
  js: ["Compare nodes with ===: it checks identity, not value.", "arr.reduceRight builds a linked list from an array in one line."],
  iq: { Beginner: ["Find the middle of a linked list"], Easy: ["middle-of-list", "linked-list-cycle", "happy-number", "palindrome-linked-list"], Medium: ["linked-list-cycle-ii", "find-duplicate-number", "reorder-list", "remove-nth", "delete-middle-node", "twin-sum-list"], Hard: ["Find where a cycle starts and how long it is"] },
  rev: { s30: "Move slow by 1 and fast by 2. When fast ends, slow is the middle. If they meet, there's a cycle; reset one to the head and step both by 1 to reach the cycle's start. O(n) time, O(1) space.", m2: ["while (fast && fast.next)", "Even length → second middle", "Meet ⇒ cycle", "Reset to head ⇒ cycle entrance", "Works on any 'next' function"] },
  cheat: `FAST & SLOW CHEAT SHEET

slow = fast = head
while (fast && fast.next):
  slow = slow.next
  fast = fast.next.next
  if slow === fast → cycle

middle = slow after the loop
cycle start: p = head; while p !== slow: p, slow step 1

O(n) time, O(1) space`
};

export default fastSlow;
