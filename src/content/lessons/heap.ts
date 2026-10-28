import type { Lesson } from "@/lib/types";
import { HEAP } from "./_shared";

const heap: Lesson = {
  what: "A heap is a tree-shaped structure that always keeps the smallest element (min-heap) or the largest element (max-heap) at the top, so you can read it instantly. It is the standard way to build a priority queue.",
  analogy: { short: "A hospital emergency room", text: "Patients aren't treated in arrival order: the most urgent case goes first. When someone new arrives, they are slotted in by urgency. The nurse never needs the full sorted list, only who is most urgent right now. A heap is that waiting room." },
  eli5: "Imagine a pile of kids where the smallest kid always climbs to the top. If you lift the top kid off, the next smallest wriggles up. You always know who is smallest without lining everyone up.",
  tech: "A binary heap is a complete binary tree stored in an array: the children of index i are 2i + 1 and 2i + 2, and its parent is ⌊(i − 1) / 2⌋. The heap property says every parent is ≤ its children (for a min-heap). push appends at the end and sifts the value up; pop swaps the root with the last element, removes it, and sifts the new root down. Both are O(log n), and peek is O(1). JavaScript has no built-in heap, so you write a small class.",
  why: "Many problems repeatedly need the smallest or largest item of a set that keeps changing: top-k, merging k sorted lists, scheduling, Dijkstra, a running median. Sorting again after every change costs O(n log n); a heap handles each change in O(log n).",
  how: ["Store the tree in an array; index 0 is the top.", "push(x): append x, then swap it with its parent while it beats the parent (sift up).", "pop(): save the top, move the last element to index 0, then swap it down with its better child while that child beats it (sift down).", "peek(): read index 0.", "Max-heap: flip the comparison (or push negated numbers into a min-heap).", "Top-k largest: keep a min-heap of size k. Its top is the k-th largest."],
  props: ["The top is always the min (or max)", "Complete tree, so height ≈ log n", "Only parent/child order is guaranteed; siblings aren't sorted", "Stored in a plain array, no pointers"],
  use: ["Top-k and k-th largest", "Merging k sorted lists", "Scheduling by priority or deadline", "Dijkstra and Prim", "Running median (two heaps)"],
  avoid: ["You need to search for arbitrary values (O(n) in a heap)", "You need everything sorted just once (sort instead)", "You need the min and the max at the same time (use two heaps)"],
  viz: "tree",
  cx: [["peek", "O(1)", "The top lives at index 0."], ["push", "O(log n)", "Sift up at most the height of the tree."], ["pop", "O(log n)", "Sift down at most the height of the tree."], ["Build from n items", "O(n)", "Heapify bottom-up: most nodes are near the leaves and barely move."], ["Search for a value", "O(n)", "The array isn't sorted beyond parent/child pairs."]],
  space: "O(n) for the array.",
  code: {
    c: `class MinHeap {
  constructor() { this.a = []; }
  size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x) {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p] <= a[i]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && a[l] < a[m]) m = l;
        if (r < a.length && a[r] < a[m]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}
const h = new MinHeap();
for (const x of [5, 3, 8, 1, 4]) h.push(x);
console.log(h.peek());
console.log(h.pop(), h.pop(), h.pop());
console.log(h.size());`,
    hl: [10, 22],
    ex: { 10: "The parent of index i is (i − 1) >> 1 (integer division by 2).", 12: "Swap upward while the new value is smaller than its parent.", 17: "Remove the last element; it refills the root's slot.", 23: "Pick the smaller child, so the heap property still holds after the swap." }
  },
  brute: { title: "Brute force: sort again for every question", c: `function topK(nums, k) {
  const sorted = [...nums].sort((a, b) => b - a);
  return sorted.slice(0, k);
}
console.log(topK([3, 1, 5, 12, 2, 11], 3));`, time: "O(n log n) per query", space: "O(n)", ex: { 2: "Fine once, but repeating this after every new number is what makes it slow." } },
  examples: [
    { lvl: "Easy", title: "Last stone weight (max-heap)", prob: "Repeatedly smash the two heaviest stones; return the weight left at the end.", idea: "A max-heap hands you the two heaviest stones in O(log n) each time.", c: HEAP + `function lastStoneWeight(stones) {
  const h = new Heap((x, y) => x > y);
  for (const s of stones) h.push(s);
  while (h.size > 1) {
    const y = h.pop(), x = h.pop();
    if (y !== x) h.push(y - x);
  }
  return h.size ? h.pop() : 0;
}
console.log(lastStoneWeight([2, 7, 4, 1, 8, 1]));`, time: "O(n log n)", space: "O(n)", ex: { 7: "less = (x, y) => x > y makes the largest value the top: a max-heap.", 10: "The two heaviest stones come off the top." } },
    { lvl: "Practical", title: "K-th largest element (min-heap of size k)", prob: "Return the k-th largest number in an array.", idea: "Keep only the k largest numbers seen so far in a min-heap. When it grows past k, drop its smallest. The top is then the k-th largest.", c: HEAP + `function findKthLargest(nums, k) {
  const h = new Heap((x, y) => x < y);
  for (const x of nums) {
    h.push(x);
    if (h.size > k) h.pop();
  }
  return h.peek();
}
console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2));
console.log(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4));`, time: "O(n log k)", space: "O(k)", ex: { 10: "Too many candidates: throw away the smallest one.", 12: "The smallest of the k largest is the k-th largest." } },
    { lvl: "Interview", title: "Merge k sorted lists", prob: "Merge k sorted arrays into one sorted array.", idea: "The next output is always the smallest current head. Keep one entry per list in a min-heap: [value, list index, position].", c: HEAP + `function mergeK(lists) {
  const h = new Heap((x, y) => x[0] < y[0]);
  lists.forEach((l, i) => { if (l.length) h.push([l[0], i, 0]); });
  const out = [];
  while (h.size) {
    const [v, i, j] = h.pop();
    out.push(v);
    if (j + 1 < lists[i].length) h.push([lists[i][j + 1], i, j + 1]);
  }
  return out;
}
console.log(mergeK([[1, 4, 5], [1, 3, 4], [2, 6]]));`, time: "O(N log k) for N total items", space: "O(k)", ex: { 8: "Start with the first element of every list.", 13: "Replace the popped head with the next element from the same list." } }
  ],
  signals: [["\"k-th largest / smallest\", \"top k\"", "Heap of size k"], ["\"merge k sorted\"", "Min-heap of the current heads"], ["\"always handle the cheapest / earliest / most urgent next\"", "Priority queue"], ["\"median of a stream\"", "Two heaps (max-heap low half, min-heap high half)"], ["shortest path with weighted edges", "Dijkstra (min-heap)"]],
  mistakes: [["Using a max-heap for the top-k largest", "Use a min-heap of size k: its top is the k-th largest, and popping removes the weakest candidate."], ["Sorting inside the loop", "That is O(n log n) per step; a heap update is O(log n)."], ["Thinking the heap array is sorted", "Only the top is guaranteed. Siblings can be in any order."], ["Forgetting that JS has no built-in heap", "Practise writing the 20-line class until it is automatic."]],
  js: ["JavaScript has no PriorityQueue: keep a small heap class ready.", "For a max-heap, flip the comparator or push negated numbers.", "(i - 1) >> 1 is integer division by 2: the parent index."],
  iq: { Beginner: ["Find the smallest element using a heap"], Easy: ["last-stone-weight", "kth-largest-stream"], Medium: ["kth-largest", "top-k-frequent", "k-closest-points", "task-scheduler"], Hard: ["merge-k-sorted-lists", "find-median-stream", "ipo"] },
  rev: { s30: "A heap keeps the min (or max) on top: peek O(1), push and pop O(log n). Use it whenever you repeatedly need the smallest or largest of a changing set.", m2: ["Array-backed complete tree: children 2i+1 and 2i+2, parent (i−1)>>1", "push = append + sift up; pop = move last to top + sift down", "Top-k largest → min-heap of size k", "Running median → two heaps", "No built-in heap in JS"] },
  cheat: `HEAP CHEAT SHEET

peek → O(1)   push → O(log n)   pop → O(log n)
children of i: 2i+1, 2i+2   parent: (i-1)>>1

Top-k largest:
  min-heap; push x; if size > k pop
  answer = top

Think Heap when:
→ k-th largest / top k
→ merge k sorted things
→ always take the cheapest next
→ running median
→ Dijkstra / Prim`
};

export default heap;
