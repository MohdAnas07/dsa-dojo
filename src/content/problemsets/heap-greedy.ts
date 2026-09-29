import type { ProblemDef } from "@/lib/types";

// A small binary heap used by several reference solutions (JS has no built-in priority queue).
const HEAP = `class Heap {
  constructor(cmp = (a, b) => a - b) { this.a = []; this.cmp = cmp; }
  get size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x) { const a = this.a; a.push(x); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (this.cmp(a[i], a[p]) >= 0) break; [a[i], a[p]] = [a[p], a[i]]; i = p; } }
  pop() { const a = this.a, top = a[0], last = a.pop(); if (a.length) { a[0] = last; let i = 0; while (true) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && this.cmp(a[l], a[m]) < 0) m = l; if (r < a.length && this.cmp(a[r], a[m]) < 0) m = r; if (m === i) break; [a[i], a[m]] = [a[m], a[i]]; i = m; } } return top; }
}
`;

/** Heaps / priority queues and greedy choices. */
export const HEAP_GREEDY: ProblemDef[] = [
  {
    id: "kth-largest-stream", t: "Kth Largest Element in a Stream", d: "E", tp: ["heap", "trees"], pt: ["top-k"], co: ["Amazon", "Meta", "Microsoft"], lc: "kth-largest-element-in-a-stream",
    s: "Design KthLargest(k, nums) where add(val) returns the k-th largest element so far.", h: ["Keep only the k largest values.", "A min-heap of size k: its top is the answer."],
    a: "Min-heap capped at size k.", tc: "O(log k) per add", sc: "O(k)", sim: ["kth-largest", "find-median-stream", "top-k-frequent"],
    fn: "KthLargest", ctor: "k:number, nums:number[]", methods: "add(val:number):number",
    ex: [[["KthLargest", "add", "add", "add", "add", "add"], [[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]], [null, 4, 5, 5, 8, 8]]],
    hid: [[["KthLargest", "add", "add", "add"], [[1, []], [-3], [-2], [-4]]], [["KthLargest", "add", "add"], [[2, [0]], [-1], [1]]]],
    code: HEAP + `class KthLargest {
  constructor(k, nums) { this.k = k; this.h = new Heap(); for (const x of nums) this.add(x); }
  add(val) {
    this.h.push(val);
    if (this.h.size > this.k) this.h.pop();
    return this.h.peek();
  }
}`
  },
  {
    id: "last-stone-weight", t: "Last Stone Weight", d: "E", tp: ["heap", "greedy"], pt: ["top-k"], co: ["Amazon", "Google"], lc: "last-stone-weight",
    s: "Repeatedly smash the two heaviest stones (x ≤ y → y - x remains if nonzero). Return the last stone's weight or 0.", h: ["You always need the two largest.", "A max-heap."],
    a: "Max-heap simulation.", tc: "O(n log n)", sc: "O(n)", sim: ["last-stone-weight-ii", "kth-largest"],
    fn: "lastStoneWeight", params: "stones:number[]", ret: "number",
    ex: [[[2, 7, 4, 1, 8, 1], 1], [[1], 1]], hid: [[[2, 2]], [[10, 4, 2, 10]], [[3, 7, 2]]],
    code: HEAP + `function lastStoneWeight(stones) {
  const h = new Heap((a, b) => b - a);
  for (const s of stones) h.push(s);
  while (h.size > 1) { const y = h.pop(), x = h.pop(); if (y > x) h.push(y - x); }
  return h.size ? h.peek() : 0;
}`
  },
  {
    id: "k-closest-points", t: "K Closest Points to Origin", d: "M", tp: ["heap", "sorting", "divide-conquer", "math-basics"], pt: ["top-k"], co: ["Meta", "Amazon", "Asana", "LinkedIn"], lc: "k-closest-points-to-origin",
    s: "Return the k points closest to (0, 0), in any order.", h: ["Compare squared distances (no square roots needed).", "Max-heap of size k, or quickselect for O(n) average."],
    a: "Max-heap by distance capped at k.", tc: "O(n log k)", sc: "O(k)", sim: ["kth-largest", "top-k-frequent", "find-k-closest"],
    fn: "kClosest", params: "points:number[][], k:number", ret: "number[][]", cmp: "unordered",
    ex: [[[[1, 3], [-2, 2]], 1, [[-2, 2]]], [[[3, 3], [5, -1], [-2, 4]], 2, [[3, 3], [-2, 4]]]], hid: [[[[0, 1], [1, 0]], 2], [[[1, 1], [2, 2], [3, 3], [-1, -1]], 1]],
    code: HEAP + `function kClosest(points, k) {
  const d = p => p[0] * p[0] + p[1] * p[1];
  const h = new Heap((a, b) => d(b) - d(a));
  for (const p of points) { h.push(p); if (h.size > k) h.pop(); }
  return h.a;
}`
  },
  {
    id: "task-scheduler", t: "Task Scheduler", d: "M", tp: ["greedy", "heap", "hashing", "math-basics"], pt: ["greedy", "frequency-counter"], co: ["Meta", "Amazon", "Microsoft", "Uber"], lc: "task-scheduler",
    s: "Same tasks must be at least n intervals apart. Return the minimum total intervals (including idle ones).", h: ["The most frequent task sets the frame: (maxCount - 1) blocks of size n + 1.", "Add one for each task tied at maxCount; the answer is at least the number of tasks."],
    a: "max(tasks.length, (maxF - 1)(n + 1) + countMax).", tc: "O(n)", sc: "O(1)", sim: ["reorganize-string", "top-k-frequent"],
    fn: "leastInterval", params: "tasks:string[], n:number", ret: "number",
    ex: [[["A", "A", "A", "B", "B", "B"], 2, 8], [["A", "C", "A", "B", "D", "B"], 1, 6], [["A", "A", "A", "B", "B", "B"], 3, 10]], hid: [[["A"], 5], [["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], 2], [["A", "B", "C", "D"], 0]],
    code: `function leastInterval(tasks, n) {
  const count = {};
  for (const t of tasks) count[t] = (count[t] || 0) + 1;
  const f = Object.values(count), maxF = Math.max(...f), numMax = f.filter(x => x === maxF).length;
  return Math.max(tasks.length, (maxF - 1) * (n + 1) + numMax);
}`
  },
  {
    id: "find-median-stream", t: "Find Median from Data Stream", d: "H", tp: ["heap", "sorting"], pt: ["top-k"], co: ["Amazon", "Google", "Microsoft", "Apple", "Uber"], lc: "find-median-from-data-stream",
    s: "Design MedianFinder with addNum(num) and findMedian().", h: ["Split numbers into a lower half and an upper half.", "Max-heap for the lower half, min-heap for the upper; keep sizes within 1."],
    a: "Two heaps, rebalanced after each insert.", tc: "O(log n) add, O(1) median", sc: "O(n)", sim: ["median-two-sorted", "kth-largest-stream"],
    fn: "MedianFinder", ctor: "", methods: "addNum(num:number):void; findMedian():double", cmp: "float",
    ex: [[["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"], [[], [1], [2], [], [3], []], [null, null, null, 1.5, null, 2]]],
    hid: [[["MedianFinder", "addNum", "findMedian", "addNum", "findMedian", "addNum", "findMedian", "addNum", "findMedian"], [[], [-1], [], [-2], [], [-3], [], [-4], []]], [["MedianFinder", "addNum", "addNum", "addNum", "addNum", "addNum", "findMedian"], [[], [6], [10], [2], [6], [5], []]]],
    code: HEAP + `class MedianFinder {
  constructor() { this.lo = new Heap((a, b) => b - a); this.hi = new Heap(); }
  addNum(num) {
    this.lo.push(num);
    this.hi.push(this.lo.pop());
    if (this.hi.size > this.lo.size) this.lo.push(this.hi.pop());
  }
  findMedian() {
    return this.lo.size > this.hi.size ? this.lo.peek() : (this.lo.peek() + this.hi.peek()) / 2;
  }
}`
  },
  {
    id: "reorganize-string", t: "Reorganize String", d: "M", tp: ["heap", "greedy", "hashing", "strings"], pt: ["greedy", "top-k"], co: ["Amazon", "Meta", "Google"], lc: "reorganize-string",
    s: "Rearrange s so no two adjacent characters are equal; return \"\" if impossible. Any valid answer is accepted.", h: ["Impossible if some letter appears more than ⌈n/2⌉ times.", "Place the most frequent letter at even indexes first, then fill the rest."],
    a: "Sort letters by frequency and fill even then odd positions.", tc: "O(n)", sc: "O(1)", sim: ["task-scheduler", "sort-characters-by-frequency"],
    fn: "reorganizeString", params: "s:string", ret: "string",
    check: `(args, out, exp) => { if (exp === "") return out === ""; const s = args[0]; if (typeof out !== "string" || out.length !== s.length) return false; for (let i = 1; i < out.length; i++) if (out[i] === out[i - 1]) return false; return [...out].sort().join("") === [...s].sort().join(""); }`,
    ex: [["aab", "aba"], ["aaab", ""]], hid: [["a"], ["vvvlo"], ["aaabbbcc"], ["aaa"]],
    code: `function reorganizeString(s) {
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  const letters = Object.keys(count).sort((a, b) => count[b] - count[a]);
  if (count[letters[0]] > Math.ceil(s.length / 2)) return "";
  const res = new Array(s.length);
  let i = 0;
  for (const c of letters) for (let k = 0; k < count[c]; k++) { if (i >= s.length) i = 1; res[i] = c; i += 2; }
  return res.join("");
}`
  },
  {
    id: "ugly-number-ii", t: "Ugly Number II", d: "M", tp: ["dp", "heap", "math-basics"], pt: ["dp", "top-k"], co: ["Amazon", "Google"], lc: "ugly-number-ii",
    s: "Ugly numbers have only 2, 3 and 5 as prime factors (1 counts). Return the n-th ugly number.", h: ["Every ugly number is 2, 3 or 5 times a smaller ugly number.", "Three pointers into the list of generated numbers."],
    a: "DP with three pointers (merge of three sequences).", tc: "O(n)", sc: "O(n)", sim: ["count-primes", "perfect-squares"],
    fn: "nthUglyNumber", params: "n:number", ret: "number",
    ex: [[10, 12], [1, 1]], hid: [[11], [100], [1690]],
    code: `function nthUglyNumber(n) {
  const u = [1];
  let a = 0, b = 0, c = 0;
  while (u.length < n) {
    const next = Math.min(u[a] * 2, u[b] * 3, u[c] * 5);
    u.push(next);
    if (next === u[a] * 2) a++;
    if (next === u[b] * 3) b++;
    if (next === u[c] * 5) c++;
  }
  return u[n - 1];
}`
  },
  {
    id: "ipo", t: "IPO", d: "H", tp: ["heap", "greedy", "sorting"], pt: ["top-k", "greedy"], co: ["Amazon", "Google"], lc: "ipo",
    s: "Start with capital w. Pick at most k projects; project i needs capital[i] and adds profits[i]. Maximise final capital.", h: ["At each step, among affordable projects take the most profitable.", "Sort by capital; push newly affordable projects into a max-heap of profits."],
    a: "Sort + max-heap, k rounds.", tc: "O(n log n)", sc: "O(n)", sim: ["furthest-building", "min-refuel-stops"],
    fn: "findMaximizedCapital", params: "k:number, w:number, profits:number[], capital:number[]", ret: "number",
    ex: [[2, 0, [1, 2, 3], [0, 1, 1], 4], [3, 0, [1, 2, 3], [0, 1, 2], 6]], hid: [[1, 0, [1, 2, 3], [1, 1, 2]], [10, 0, [1, 2, 3], [0, 1, 2]], [1, 2, [1, 2, 3], [1, 1, 2]]],
    code: HEAP + `function findMaximizedCapital(k, w, profits, capital) {
  const idx = profits.map((_, i) => i).sort((a, b) => capital[a] - capital[b]);
  const h = new Heap((a, b) => b - a);
  let i = 0;
  while (k-- > 0) {
    while (i < idx.length && capital[idx[i]] <= w) h.push(profits[idx[i++]]);
    if (!h.size) break;
    w += h.pop();
  }
  return w;
}`
  },
  {
    id: "connect-sticks", t: "Minimum Cost to Connect Sticks", d: "M", tp: ["heap", "greedy"], pt: ["top-k", "greedy"], co: ["Amazon"], lc: "minimum-cost-to-connect-sticks",
    s: "Joining sticks x and y costs x + y. Return the minimum cost to join all sticks into one.", h: ["Short sticks should be joined early (they get re-added many times).", "Always join the two shortest: a min-heap (Huffman coding)."],
    a: "Min-heap, pop two, push their sum.", tc: "O(n log n)", sc: "O(n)", sim: ["last-stone-weight", "ipo"],
    fn: "connectSticks", params: "sticks:number[]", ret: "number",
    ex: [[[2, 4, 3], 14], [[1, 8, 3, 5], 30], [[5], 0]], hid: [[[1, 1]], [[3354, 4316, 3259, 4904, 4598, 474, 3166, 6322, 8080, 9009]]],
    code: HEAP + `function connectSticks(sticks) {
  const h = new Heap();
  for (const s of sticks) h.push(s);
  let cost = 0;
  while (h.size > 1) { const x = h.pop() + h.pop(); cost += x; h.push(x); }
  return cost;
}`
  },
  {
    id: "jump-game", t: "Jump Game", d: "M", tp: ["greedy", "arrays", "dp"], pt: ["greedy"], co: ["Amazon", "Microsoft", "Meta", "Apple"], lc: "jump-game",
    s: "nums[i] is the max jump length from i. Can you reach the last index?", h: ["Track the farthest index reachable so far.", "If you ever stand beyond it, you're stuck."],
    a: "Greedy farthest reach.", tc: "O(n)", sc: "O(1)", sim: ["jump-game-ii", "gas-station"],
    fn: "canJump", params: "nums:number[]", ret: "boolean",
    ex: [[[2, 3, 1, 1, 4], true], [[3, 2, 1, 0, 4], false]], hid: [[[0]], [[2, 0, 0]], [[1, 0, 1, 0]], [[2, 5, 0, 0]]],
    code: `function canJump(nums) {
  let far = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > far) return false;
    far = Math.max(far, i + nums[i]);
  }
  return true;
}`
  },
  {
    id: "jump-game-ii", t: "Jump Game II", d: "M", tp: ["greedy", "arrays", "bfs", "dp"], pt: ["greedy", "bfs"], co: ["Amazon", "Google", "Microsoft"], lc: "jump-game-ii",
    s: "Return the minimum number of jumps to reach the last index (always reachable).", h: ["Think of BFS levels: all indexes reachable with j jumps form a range.", "When you reach the end of the current range, jump++ and extend to the farthest reach."],
    a: "Greedy BFS over ranges.", tc: "O(n)", sc: "O(1)", sim: ["jump-game", "video-stitching"],
    fn: "jump", params: "nums:number[]", ret: "number",
    ex: [[[2, 3, 1, 1, 4], 2], [[2, 3, 0, 1, 4], 2]], hid: [[[0]], [[1, 2]], [[1, 1, 1, 1]], [[5, 9, 3, 2, 1, 0, 2, 3, 3, 1, 0, 0]]],
    code: `function jump(nums) {
  let jumps = 0, end = 0, far = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    far = Math.max(far, i + nums[i]);
    if (i === end) { jumps++; end = far; }
  }
  return jumps;
}`
  },
  {
    id: "video-stitching", t: "Video Stitching", d: "M", tp: ["greedy", "dp", "intervals"], pt: ["greedy", "intervals"], co: ["Google", "Amazon"], lc: "video-stitching",
    s: "Clips are intervals [start, end]. Return the fewest clips that cover [0, time], or -1.", h: ["Same shape as Jump Game II.", "For each position record the farthest end of a clip starting there."],
    a: "Greedy range extension.", tc: "O(n + time)", sc: "O(time)", sim: ["jump-game-ii", "min-arrows-balloons"],
    fn: "videoStitching", params: "clips:number[][], time:number", ret: "number",
    ex: [[[[0, 2], [4, 6], [8, 10], [1, 9], [1, 5], [5, 9]], 10, 3], [[[0, 1], [1, 2]], 5, -1], [[[0, 1], [6, 8], [0, 2], [5, 6], [0, 4], [0, 3], [6, 7], [1, 3], [4, 7], [1, 4], [2, 5], [2, 6], [3, 4], [4, 5], [5, 7], [6, 9]], 9, 3]], hid: [[[[0, 4], [2, 8]], 5], [[[5, 7], [1, 8], [0, 0], [2, 3], [4, 5], [0, 6], [5, 10], [7, 10]], 5]],
    code: `function videoStitching(clips, time) {
  const reach = new Array(time + 1).fill(0);
  for (const [s, e] of clips) if (s <= time) reach[s] = Math.max(reach[s], e);
  let clipsUsed = 0, end = 0, far = 0;
  for (let i = 0; i < time; i++) {
    far = Math.max(far, reach[i]);
    if (i === end) {
      if (far <= i) return -1;
      clipsUsed++; end = far;
    }
  }
  return clipsUsed;
}`
  },
  {
    id: "gas-station", t: "Gas Station", d: "M", tp: ["greedy", "arrays", "prefix-sum"], pt: ["greedy", "prefix-sum"], co: ["Amazon", "Google", "Bloomberg"], lc: "gas-station",
    s: "Return the starting station index to travel around the circuit once, or -1 (answer is unique).", h: ["If total gas < total cost, it's impossible.", "If the tank goes negative at i, no station between the start and i can work: start at i + 1."],
    a: "One pass with a running tank and total.", tc: "O(n)", sc: "O(1)", sim: ["jump-game", "max-subarray"],
    fn: "canCompleteCircuit", params: "gas:number[], cost:number[]", ret: "number",
    ex: [[[1, 2, 3, 4, 5], [3, 4, 5, 1, 2], 3], [[2, 3, 4], [3, 4, 3], -1]], hid: [[[5], [4]], [[3, 1, 1], [1, 2, 2]], [[5, 1, 2, 3, 4], [4, 4, 1, 5, 1]]],
    code: `function canCompleteCircuit(gas, cost) {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const d = gas[i] - cost[i];
    total += d; tank += d;
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return total < 0 ? -1 : start;
}`
  },
  {
    id: "hand-of-straights", t: "Hand of Straights", d: "M", tp: ["greedy", "hashing", "sorting"], pt: ["greedy", "frequency-counter"], co: ["Google", "Amazon"], lc: "hand-of-straights",
    s: "Can the cards be split into groups of groupSize consecutive values?", h: ["The smallest remaining card must start a group.", "Count cards; for each smallest value, consume the next groupSize values."],
    a: "Sorted keys + counts, greedy from the smallest.", tc: "O(n log n)", sc: "O(n)", sim: ["partition-k-equal-subsets", "task-scheduler"],
    fn: "isNStraightHand", params: "hand:number[], groupSize:number", ret: "boolean",
    ex: [[[1, 2, 3, 6, 2, 3, 4, 7, 8], 3, true], [[1, 2, 3, 4, 5], 4, false]], hid: [[[1], 1], [[1, 1, 2, 2, 3, 3], 3], [[1, 2, 3], 1], [[8, 10, 12], 3]],
    code: `function isNStraightHand(hand, groupSize) {
  if (hand.length % groupSize) return false;
  const count = new Map();
  for (const x of hand) count.set(x, (count.get(x) || 0) + 1);
  for (const x of [...count.keys()].sort((a, b) => a - b)) {
    const c = count.get(x);
    if (!c) continue;
    for (let k = 0; k < groupSize; k++) {
      if ((count.get(x + k) || 0) < c) return false;
      count.set(x + k, count.get(x + k) - c);
    }
  }
  return true;
}`
  },
  {
    id: "merge-triplets", t: "Merge Triplets to Form Target Triplet", d: "M", tp: ["greedy", "arrays"], pt: ["greedy"], co: ["Google", "Amazon"], lc: "merge-triplets-to-form-target-triplet",
    s: "Merging two triplets takes the element-wise max. Can you obtain target?", h: ["Any triplet with a value above target in some position must never be used.", "Among the rest, check each target position is matched by someone."],
    a: "Filter safe triplets; check coverage of all three positions.", tc: "O(n)", sc: "O(1)", sim: ["jump-game", "partition-labels"],
    fn: "mergeTriplets", params: "triplets:number[][], target:number[]", ret: "boolean",
    ex: [[[[2, 5, 3], [1, 8, 4], [1, 7, 5]], [2, 7, 5], true], [[[3, 4, 5], [4, 5, 6]], [3, 2, 5], false], [[[2, 5, 3], [2, 3, 4], [1, 2, 5], [5, 2, 3]], [5, 5, 5], true]], hid: [[[[1, 1, 1]], [1, 1, 1]], [[[1, 2, 3]], [1, 2, 4]]],
    code: `function mergeTriplets(triplets, target) {
  const got = [false, false, false];
  for (const t of triplets) {
    if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) continue;
    for (let i = 0; i < 3; i++) if (t[i] === target[i]) got[i] = true;
  }
  return got.every(Boolean);
}`
  },
  {
    id: "candy", t: "Candy", d: "H", tp: ["greedy", "arrays"], pt: ["greedy"], co: ["Amazon", "Google", "Microsoft"], lc: "candy",
    s: "Each child gets ≥ 1 candy; a child with a higher rating than a neighbour gets more than that neighbour. Return the minimum total.", h: ["Handle the left neighbour and the right neighbour separately.", "Left-to-right pass, then right-to-left pass taking the max."],
    a: "Two greedy passes.", tc: "O(n)", sc: "O(n)", sim: ["trapping-rain-water", "product-except-self"],
    fn: "candy", params: "ratings:number[]", ret: "number",
    ex: [[[1, 0, 2], 5], [[1, 2, 2], 4]], hid: [[[1]], [[1, 3, 2, 2, 1]], [[1, 2, 87, 87, 87, 2, 1]], [[5, 4, 3, 2, 1]]],
    code: `function candy(ratings) {
  const n = ratings.length, c = new Array(n).fill(1);
  for (let i = 1; i < n; i++) if (ratings[i] > ratings[i - 1]) c[i] = c[i - 1] + 1;
  for (let i = n - 2; i >= 0; i--) if (ratings[i] > ratings[i + 1]) c[i] = Math.max(c[i], c[i + 1] + 1);
  return c.reduce((a, b) => a + b, 0);
}`
  },
  {
    id: "assign-cookies", t: "Assign Cookies", d: "E", tp: ["greedy", "sorting", "two-pointers"], pt: ["greedy", "two-pointers"], co: ["Amazon"], lc: "assign-cookies",
    s: "Child i needs a cookie of size ≥ g[i]. Each child gets at most one cookie. Maximise content children.", h: ["Sort both arrays.", "Give each smallest cookie to the least greedy child it satisfies."],
    a: "Sort + two pointers.", tc: "O(n log n)", sc: "O(1)", sim: ["boats-to-save-people", "lemonade-change"],
    fn: "findContentChildren", params: "g:number[], s:number[]", ret: "number",
    ex: [[[1, 2, 3], [1, 1], 1], [[1, 2], [1, 2, 3], 2]], hid: [[[1], []], [[10, 9, 8, 7], [5, 6, 7, 8]]],
    code: `function findContentChildren(g, s) {
  g.sort((a, b) => a - b); s.sort((a, b) => a - b);
  let i = 0;
  for (let j = 0; j < s.length && i < g.length; j++) if (s[j] >= g[i]) i++;
  return i;
}`
  },
  {
    id: "lemonade-change", t: "Lemonade Change", d: "E", tp: ["greedy", "arrays"], pt: ["greedy"], co: ["Amazon", "Atlassian"], lc: "lemonade-change",
    s: "Lemonade costs $5; customers pay with $5, $10 or $20 in order. Can you always give correct change (starting with none)?", h: ["Only $5 and $10 bills matter for change.", "For $20 prefer giving $10 + $5 before three $5s."],
    a: "Greedy counters.", tc: "O(n)", sc: "O(1)", sim: ["assign-cookies", "gas-station"],
    fn: "lemonadeChange", params: "bills:number[]", ret: "boolean",
    ex: [[[5, 5, 5, 10, 20], true], [[5, 5, 10, 10, 20], false]], hid: [[[10]], [[5, 5, 10]], [[5, 5, 5, 5, 20, 20, 5, 5, 20, 5]]],
    code: `function lemonadeChange(bills) {
  let five = 0, ten = 0;
  for (const b of bills) {
    if (b === 5) five++;
    else if (b === 10) { if (!five) return false; five--; ten++; }
    else if (ten && five) { ten--; five--; }
    else if (five >= 3) five -= 3;
    else return false;
  }
  return true;
}`
  },
  {
    id: "best-time-stock-ii", t: "Best Time to Buy and Sell Stock II", d: "M", tp: ["greedy", "dp", "arrays"], pt: ["greedy", "dp"], co: ["Amazon", "Microsoft", "Bloomberg"], lc: "best-time-to-buy-and-sell-stock-ii",
    s: "Unlimited transactions (hold at most one share). Return the maximum profit.", h: ["Any upward move can be captured.", "Sum every positive day-to-day difference."],
    a: "Greedy sum of rises.", tc: "O(n)", sc: "O(1)", sim: ["best-time-stock", "best-time-cooldown", "best-time-fee"],
    fn: "maxProfit", params: "prices:number[]", ret: "number",
    ex: [[[7, 1, 5, 3, 6, 4], 7], [[1, 2, 3, 4, 5], 4], [[7, 6, 4, 3, 1], 0]], hid: [[[1]], [[2, 1, 2, 0, 1]]],
    code: `function maxProfit(prices) {
  let p = 0;
  for (let i = 1; i < prices.length; i++) p += Math.max(0, prices[i] - prices[i - 1]);
  return p;
}`
  },
  {
    id: "queue-reconstruction", t: "Queue Reconstruction by Height", d: "M", tp: ["greedy", "sorting", "arrays"], pt: ["greedy"], co: ["Google", "Amazon"], lc: "queue-reconstruction-by-height",
    s: "people[i] = [h, k]: k people of height ≥ h stand in front. Reconstruct the queue.", h: ["Place tall people first; short people don't affect them.", "Sort by height desc, k asc; insert each person at index k."],
    a: "Sort and insert.", tc: "O(n²)", sc: "O(n)", sim: ["largest-number", "h-index"],
    fn: "reconstructQueue", params: "people:number[][]", ret: "number[][]",
    ex: [[[[7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2]], [[5, 0], [7, 0], [5, 2], [6, 1], [4, 4], [7, 1]]], [[[6, 0], [5, 0], [4, 0], [3, 2], [2, 2], [1, 4]], [[4, 0], [5, 0], [2, 2], [3, 2], [1, 4], [6, 0]]]], hid: [[[[1, 0]]], [[[2, 0], [1, 1]]]],
    code: `function reconstructQueue(people) {
  people.sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  const q = [];
  for (const p of people) q.splice(p[1], 0, p);
  return q;
}`
  },
  {
    id: "min-refuel-stops", t: "Minimum Number of Refueling Stops", d: "H", tp: ["heap", "greedy", "dp"], pt: ["top-k", "greedy"], co: ["Google", "Amazon"], lc: "minimum-number-of-refueling-stops",
    s: "Drive to target with startFuel; stations[i] = [position, fuel]. Return the fewest stops, or -1.", h: ["Drive as far as you can; remember the stations you passed.", "When you run dry, retroactively refuel at the biggest passed station (max-heap)."],
    a: "Greedy with a max-heap of passed fuel amounts.", tc: "O(n log n)", sc: "O(n)", sim: ["ipo", "furthest-building", "jump-game-ii"],
    fn: "minRefuelStops", params: "target:number, startFuel:number, stations:number[][]", ret: "number",
    ex: [[1, 1, [], 0], [100, 1, [[10, 100]], -1], [100, 10, [[10, 60], [20, 30], [30, 30], [60, 40]], 2]], hid: [[100, 50, [[25, 25], [50, 50]]], [1000, 83, [[25, 27], [36, 187], [140, 186], [378, 6], [492, 202], [517, 89], [579, 234], [673, 86], [808, 53], [954, 49]]]],
    code: HEAP + `function minRefuelStops(target, startFuel, stations) {
  const h = new Heap((a, b) => b - a);
  let fuel = startFuel, stops = 0, i = 0;
  while (fuel < target) {
    while (i < stations.length && stations[i][0] <= fuel) h.push(stations[i++][1]);
    if (!h.size) return -1;
    fuel += h.pop(); stops++;
  }
  return stops;
}`
  },
  {
    id: "maximum-units-truck", t: "Maximum Units on a Truck", d: "E", tp: ["greedy", "sorting"], pt: ["greedy"], co: ["Amazon"], lc: "maximum-units-on-a-truck",
    s: "boxTypes[i] = [count, unitsPerBox]. Load at most truckSize boxes to maximise units.", h: ["Take boxes with the most units first.", "Sort by units per box descending."],
    a: "Greedy fractional-style knapsack on whole boxes.", tc: "O(n log n)", sc: "O(1)", sim: ["knapsack-01", "assign-cookies"],
    fn: "maximumUnits", params: "boxTypes:number[][], truckSize:number", ret: "number",
    ex: [[[[1, 3], [2, 2], [3, 1]], 4, 8], [[[5, 10], [2, 5], [4, 7], [3, 9]], 10, 91]], hid: [[[[1, 1]], 5], [[[2, 1], [4, 4], [3, 1], [4, 1], [2, 4], [3, 4], [1, 3], [4, 3], [5, 3], [5, 3]], 13]],
    code: `function maximumUnits(boxTypes, truckSize) {
  boxTypes.sort((a, b) => b[1] - a[1]);
  let units = 0;
  for (const [n, u] of boxTypes) {
    const take = Math.min(n, truckSize);
    units += take * u; truckSize -= take;
    if (!truckSize) break;
  }
  return units;
}`
  },
  {
    id: "two-city-scheduling", t: "Two City Scheduling", d: "M", tp: ["greedy", "sorting"], pt: ["greedy"], co: ["Bloomberg", "Amazon"], lc: "two-city-scheduling",
    s: "2n people; costs[i] = [costA, costB]. Send exactly n to each city at minimum total cost.", h: ["What matters is how much cheaper A is than B for each person.", "Sort by costA - costB; first half to A, rest to B."],
    a: "Sort by difference.", tc: "O(n log n)", sc: "O(1)", sim: ["maximum-units-truck", "assign-cookies"],
    fn: "twoCitySchedCost", params: "costs:number[][]", ret: "number",
    ex: [[[[10, 20], [30, 200], [400, 50], [30, 20]], 110], [[[259, 770], [448, 54], [926, 667], [184, 139], [840, 118], [577, 469]], 1859]], hid: [[[[1, 2], [2, 1]]], [[[515, 563], [451, 713], [537, 709], [343, 819], [855, 779], [457, 60], [650, 359], [631, 42]]]],
    code: `function twoCitySchedCost(costs) {
  costs.sort((a, b) => (a[0] - a[1]) - (b[0] - b[1]));
  const n = costs.length / 2;
  let total = 0;
  costs.forEach((c, i) => { total += i < n ? c[0] : c[1]; });
  return total;
}`
  },
  {
    id: "furthest-building", t: "Furthest Building You Can Reach", d: "M", tp: ["heap", "greedy"], pt: ["top-k", "greedy"], co: ["Google", "Amazon"], lc: "furthest-building-you-can-reach",
    s: "Climbing up needs bricks equal to the height difference or one ladder. Return the furthest building index reachable.", h: ["Ladders should cover the biggest climbs.", "Keep a min-heap of climbs using ladders; when it overflows, pay the smallest with bricks."],
    a: "Min-heap of the largest climbs.", tc: "O(n log L)", sc: "O(L)", sim: ["min-refuel-stops", "ipo"],
    fn: "furthestBuilding", params: "heights:number[], bricks:number, ladders:number", ret: "number",
    ex: [[[4, 2, 7, 6, 9, 14, 12], 5, 1, 4], [[4, 12, 2, 7, 3, 18, 20, 3, 19], 10, 2, 7], [[14, 3, 19, 3], 17, 0, 3]], hid: [[[1, 2], 0, 0], [[1, 5, 1, 2, 3, 4, 10000], 4, 1], [[1, 13, 1, 1, 13, 5, 10, 20], 10, 1]],
    code: HEAP + `function furthestBuilding(heights, bricks, ladders) {
  const h = new Heap();
  for (let i = 0; i < heights.length - 1; i++) {
    const d = heights[i + 1] - heights[i];
    if (d <= 0) continue;
    h.push(d);
    if (h.size > ladders) { bricks -= h.pop(); if (bricks < 0) return i; }
  }
  return heights.length - 1;
}`
  },
  {
    id: "find-k-pairs-smallest-sums", t: "Find K Pairs with Smallest Sums", d: "M", tp: ["heap", "arrays"], pt: ["top-k"], co: ["LinkedIn", "Amazon", "Google"], lc: "find-k-pairs-with-smallest-sums",
    s: "Both arrays are sorted. Return the k pairs [u, v] with the smallest sums (any order).", h: ["Pair nums1[i] with nums2[0] for the first candidates.", "Pop the smallest pair (i, j) from a min-heap and push (i, j + 1)."],
    a: "Min-heap frontier like merging k sorted lists.", tc: "O(k log k)", sc: "O(k)", sim: ["merge-k-sorted-lists", "kth-smallest-sorted-matrix"],
    fn: "kSmallestPairs", params: "nums1:number[], nums2:number[], k:number", ret: "number[][]", cmp: "unordered",
    ex: [[[1, 7, 11], [2, 4, 6], 3, [[1, 2], [1, 4], [1, 6]]], [[1, 1, 2], [1, 2, 3], 2, [[1, 1], [1, 1]]]], hid: [[[1, 2], [3], 3], [[1, 2, 4, 5, 6], [3, 5, 7, 9], 3]],
    code: HEAP + `function kSmallestPairs(nums1, nums2, k) {
  const h = new Heap((a, b) => a[0] - b[0]), res = [];
  for (let i = 0; i < Math.min(nums1.length, k); i++) h.push([nums1[i] + nums2[0], i, 0]);
  while (res.length < k && h.size) {
    const [, i, j] = h.pop();
    res.push([nums1[i], nums2[j]]);
    if (j + 1 < nums2.length) h.push([nums1[i] + nums2[j + 1], i, j + 1]);
  }
  return res;
}`
  },
  {
    id: "single-threaded-cpu", t: "Single-Threaded CPU", d: "M", tp: ["heap", "sorting", "arrays"], pt: ["top-k"], co: ["Amazon", "Google"], lc: "single-threaded-cpu",
    s: "tasks[i] = [enqueueTime, processingTime]. The CPU always picks the available task with the shortest processing time (ties → smaller index). Return the processing order.", h: ["Sort tasks by enqueue time.", "Min-heap of available tasks keyed by (processing time, index); jump the clock when idle."],
    a: "Event simulation with a min-heap.", tc: "O(n log n)", sc: "O(n)", sim: ["task-scheduler", "meeting-rooms-ii"],
    fn: "getOrder", params: "tasks:number[][]", ret: "number[]",
    ex: [[[[1, 2], [2, 4], [3, 2], [4, 1]], [0, 2, 3, 1]], [[[7, 10], [7, 12], [7, 5], [7, 4], [7, 2]], [4, 3, 2, 0, 1]]], hid: [[[[1, 1]]], [[[19, 13], [16, 9], [21, 10], [32, 25], [37, 4], [49, 24], [2, 15], [38, 41], [37, 34], [33, 6], [45, 4], [18, 18], [46, 39], [12, 24]]]],
    code: HEAP + `function getOrder(tasks) {
  const idx = tasks.map((_, i) => i).sort((a, b) => tasks[a][0] - tasks[b][0]);
  const h = new Heap((a, b) => tasks[a][1] - tasks[b][1] || a - b), res = [];
  let time = 0, i = 0;
  while (res.length < tasks.length) {
    if (!h.size && time < tasks[idx[i]][0]) time = tasks[idx[i]][0];
    while (i < idx.length && tasks[idx[i]][0] <= time) h.push(idx[i++]);
    const t = h.pop();
    res.push(t); time += tasks[t][1];
  }
  return res;
}`
  }
];
