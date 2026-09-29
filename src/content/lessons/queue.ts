import type { Lesson } from "@/lib/types";

const queue: Lesson = {
  what: "A queue is a collection where the first item in is the first item out (FIFO: First In, First Out). You add at the back and remove from the front.",
  analogy: { short: "A line at a ticket counter", text: "People join at the back and are served from the front. Nobody cuts in line. Whoever waited longest goes first." },
  eli5: "Kids lining up for the slide. The first kid in line slides first. New kids join at the end.",
  tech: "A queue supports enqueue (add to back) and dequeue (remove from front), both O(1) with a proper implementation (linked list, circular buffer, or two-index array). A deque allows O(1) operations at both ends. Queues drive BFS and scheduling.",
  why: "Whenever things must be processed in arrival order (tasks, requests, levels of a tree, cells in a grid by distance), you need a queue. It's the engine behind Breadth-First Search.",
  how: ["enqueue(x): add to the back.", "dequeue(): remove from the front.", "peek(): look at the front.", "In JS, arr.shift() is O(n)! Use a head index or a linked list for big queues.", "Deque: add/remove at both ends."],
  props: ["FIFO order", "O(1) enqueue/dequeue (with the right implementation)", "Front and back access only", "Variants: deque, circular queue, priority queue"],
  use: ["BFS on trees and graphs", "Level-order traversal", "Task scheduling, buffers, rate limiting", "Sliding window maximum (deque)"],
  avoid: ["You need the most recent item first (stack)", "You need the smallest/largest item first (priority queue / heap)"],
  viz: "queue",
  cx: [["enqueue (push)", "O(1)", "Append to the back."], ["dequeue with head index", "O(1)", "Just move the head index forward."], ["dequeue with arr.shift()", "O(n)", "JS re-indexes every remaining element. Fine for small inputs."], ["peek", "O(1)", "Read the front."]],
  space: "O(n).",
  code: {
    c: `class Queue {
  constructor() { this.items = []; this.head = 0; }
  enqueue(x) { this.items.push(x); }
  dequeue() {
    if (this.isEmpty()) return undefined;
    return this.items[this.head++];
  }
  peek() { return this.items[this.head]; }
  size() { return this.items.length - this.head; }
  isEmpty() { return this.size() === 0; }
}

const q = new Queue();
q.enqueue("A"); q.enqueue("B"); q.enqueue("C");
console.log(q.dequeue());
console.log(q.peek());
console.log(q.size());`,
    hl: [6],
    ex: { 2: "head marks the front. Items before head are 'already dequeued'.", 6: "O(1) dequeue: read the front and move head forward. No shifting." }
  },
  examples: [
    { lvl: "Easy", title: "Recent counter", prob: "Count requests in the last 3000 ms each time a new one arrives.", idea: "Queue of timestamps. Add the new one, drop from the front everything older than t - 3000.", c: `class RecentCounter {
  constructor() { this.q = []; this.head = 0; }
  ping(t) {
    this.q.push(t);
    while (this.q[this.head] < t - 3000) this.head++;
    return this.q.length - this.head;
  }
}
const rc = new RecentCounter();
console.log([1, 100, 3001, 3002].map(t => rc.ping(t)));`, time: "O(1) amortized", space: "O(n)" },
    { lvl: "Practical", title: "BFS shortest path in a grid", prob: "Fewest steps from top-left to bottom-right in a grid (0 = open, 1 = wall).", idea: "BFS explores all cells 1 step away, then 2 steps, … The first time we reach the target is the shortest path.", c: `function shortestPath(grid) {
  const R = grid.length, C = grid[0].length;
  const dist = grid.map(row => row.map(() => -1));
  const q = [[0, 0]]; dist[0][0] = 0;
  let head = 0;
  while (head < q.length) {
    const [r, c] = q[head++];
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < R && nc < C && grid[nr][nc] === 0 && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        q.push([nr, nc]);
      }
    }
  }
  return dist[R - 1][C - 1];
}
console.log(shortestPath([
  [0, 0, 0],
  [1, 1, 0],
  [0, 0, 0]
]));`, time: "O(R · C)", space: "O(R · C)", ex: { 10: "Mark distance when ENQUEUING, not when dequeuing, so a cell is never added twice." } },
    { lvl: "Interview", title: "Sliding window maximum (deque)", prob: "Return the maximum of every window of size k.", idea: "Keep a deque of indexes with decreasing values. Front = current max. Drop the front when it leaves the window; drop from the back anything smaller than the new value (it can never be a max again).", c: `function maxSlidingWindow(nums, k) {
  const dq = [], out = [];
  let head = 0;
  for (let i = 0; i < nums.length; i++) {
    if (head < dq.length && dq[head] <= i - k) head++;
    while (dq.length > head && nums[dq[dq.length - 1]] < nums[i]) dq.pop();
    dq.push(i);
    if (i >= k - 1) out.push(nums[dq[head]]);
  }
  return out;
}
console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));`, time: "O(n)", space: "O(k)" }
  ],
  signals: [["\"shortest path\" in unweighted graph/grid", "BFS with queue"], ["\"level by level\"", "Queue (level-order)"], ["\"in the order they arrive\"", "Queue"], ["\"max/min of each window\"", "Monotonic deque"]],
  mistakes: [["Using arr.shift() in a large BFS", "shift is O(n). Use a head index."], ["Marking visited on dequeue instead of enqueue", "The same node gets queued many times. Mark when you push."], ["Confusing queue with priority queue", "A queue is arrival order; a priority queue is smallest/largest first."]],
  js: ["JS has no built-in Queue. Array + head index is simple and fast.", "For level-order, snapshot size = q.length - head before processing a level."],
  iq: { Beginner: ["Implement a queue with an array"], Easy: ["Implement stack using queues", "Number of recent calls"], Medium: ["level-order", "rotting-oranges", "Design circular queue"], Hard: ["Sliding window maximum"] },
  rev: { s30: "FIFO. Add at back, remove from front. Powers BFS. In JS avoid shift() for big queues; use a head index.", m2: ["enqueue/dequeue O(1) with head index", "BFS: mark visited when enqueuing", "Level order: process size-at-start nodes per level", "Deque for window max/min"] },
  cheat: `QUEUE CHEAT SHEET

enqueue → O(1)   dequeue → O(1)*
FIFO             *not with shift()

BFS template:
q = [start]; seen.add(start); head = 0
while (head < q.length):
  node = q[head++]
  for nb of neighbors(node):
    if !seen: seen.add(nb); q.push(nb)

Think Queue when:
→ BFS / shortest unweighted path
→ level by level
→ arrival order processing`
};

export default queue;
