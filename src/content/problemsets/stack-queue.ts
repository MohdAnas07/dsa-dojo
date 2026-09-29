import type { ProblemDef } from "@/lib/types";

/** Stacks, queues, monotonic stacks and parsing. */
export const STACK_QUEUE: ProblemDef[] = [
  {
    id: "next-greater-element-i", t: "Next Greater Element I", d: "E", tp: ["stack", "monotonic-stack", "hashing"], pt: ["monotonic-stack", "hashing"], co: ["Amazon", "Bloomberg"], lc: "next-greater-element-i",
    s: "nums1 is a subset of nums2. For each x in nums1, return the first greater number to the right of x in nums2, or -1.", h: ["Compute the next greater element for every value of nums2 once.", "Monotonic decreasing stack + Map value → answer."],
    a: "One monotonic-stack pass over nums2, then look up each nums1 value.", tc: "O(n + m)", sc: "O(n)", sim: ["next-greater-element-ii", "daily-temperatures"],
    fn: "nextGreaterElement", params: "nums1:number[], nums2:number[]", ret: "number[]",
    ex: [[[4, 1, 2], [1, 3, 4, 2], [-1, 3, -1]], [[2, 4], [1, 2, 3, 4], [3, -1]]], hid: [[[1], [1]], [[1, 3, 5, 2, 4], [6, 5, 4, 3, 2, 1, 7]]],
    code: `function nextGreaterElement(nums1, nums2) {
  const next = new Map(), st = [];
  for (const x of nums2) {
    while (st.length && st[st.length - 1] < x) next.set(st.pop(), x);
    st.push(x);
  }
  return nums1.map(x => next.get(x) ?? -1);
}`
  },
  {
    id: "next-greater-element-ii", t: "Next Greater Element II (circular)", d: "M", tp: ["stack", "monotonic-stack", "arrays"], pt: ["monotonic-stack"], co: ["Amazon", "Google", "Microsoft"], lc: "next-greater-element-ii",
    s: "The array is circular. Return the next greater number for every element, or -1.", h: ["Loop over the array twice (index i % n).", "Only push indexes during the first pass."],
    a: "Monotonic stack of indexes over 2n steps.", tc: "O(n)", sc: "O(n)", sim: ["next-greater-element-i", "daily-temperatures"],
    fn: "nextGreaterElements", params: "nums:number[]", ret: "number[]",
    ex: [[[1, 2, 1], [2, -1, 2]], [[1, 2, 3, 4, 3], [2, 3, 4, -1, 4]]], hid: [[[5]], [[3, 3, 3]], [[5, 4, 3, 2, 1]]],
    code: `function nextGreaterElements(nums) {
  const n = nums.length, res = new Array(n).fill(-1), st = [];
  for (let i = 0; i < 2 * n; i++) {
    const x = nums[i % n];
    while (st.length && nums[st[st.length - 1]] < x) res[st.pop()] = x;
    if (i < n) st.push(i);
  }
  return res;
}`
  },
  {
    id: "largest-rectangle-histogram", t: "Largest Rectangle in Histogram", d: "H", tp: ["stack", "monotonic-stack", "arrays"], pt: ["monotonic-stack"], co: ["Amazon", "Google", "Microsoft", "Meta"], lc: "largest-rectangle-in-histogram",
    s: "Return the area of the largest rectangle in a histogram.", h: ["For each bar, find how far it can extend left and right while bars are at least as tall.", "An increasing stack: when a shorter bar arrives, popped bars know their right boundary."],
    a: "Monotonic increasing stack with a sentinel 0 at the end.", tc: "O(n)", sc: "O(n)", sim: ["maximal-rectangle", "trapping-rain-water", "daily-temperatures"],
    fn: "largestRectangleArea", params: "heights:number[]", ret: "number",
    ex: [[[2, 1, 5, 6, 2, 3], 10], [[2, 4], 4]], hid: [[[1]], [[2, 2, 2, 2]], [[6, 2, 5, 4, 5, 1, 6]], { label: "100,000 increasing bars (needs O(n))", gen: "() => [Array.from({ length: 100000 }, (_, i) => i)]" }],
    code: `function largestRectangleArea(heights) {
  const st = [];
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];
    while (st.length && heights[st[st.length - 1]] >= h) {
      const height = heights[st.pop()];
      const left = st.length ? st[st.length - 1] + 1 : 0;
      best = Math.max(best, height * (i - left));
    }
    st.push(i);
  }
  return best;
}`
  },
  {
    id: "maximal-rectangle", t: "Maximal Rectangle", d: "H", tp: ["stack", "monotonic-stack", "dp"], pt: ["monotonic-stack", "dp"], co: ["Google", "Amazon", "Meta"], lc: "maximal-rectangle",
    s: "Return the area of the largest rectangle containing only '1's in a binary matrix.", h: ["Treat each row as the ground of a histogram: heights[c] counts consecutive 1s above.", "Run Largest Rectangle in Histogram on every row."],
    a: "Row-by-row histogram + monotonic stack.", tc: "O(rows · cols)", sc: "O(cols)", sim: ["largest-rectangle-histogram", "maximal-square"],
    fn: "maximalRectangle", params: "matrix:character[][]", ret: "number",
    ex: [[[["1", "0", "1", "0", "0"], ["1", "0", "1", "1", "1"], ["1", "1", "1", "1", "1"], ["1", "0", "0", "1", "0"]], 6], [[["0"]], 0], [[["1"]], 1]], hid: [[[["0", "1"], ["1", "0"]]], [[["1", "1", "1"], ["1", "1", "1"]]]],
    code: `function maximalRectangle(matrix) {
  const cols = matrix[0].length, h = new Array(cols).fill(0);
  const hist = heights => {
    const st = []; let best = 0;
    for (let i = 0; i <= heights.length; i++) {
      const cur = i === heights.length ? 0 : heights[i];
      while (st.length && heights[st[st.length - 1]] >= cur) {
        const height = heights[st.pop()], left = st.length ? st[st.length - 1] + 1 : 0;
        best = Math.max(best, height * (i - left));
      }
      st.push(i);
    }
    return best;
  };
  let best = 0;
  for (const row of matrix) {
    for (let c = 0; c < cols; c++) h[c] = row[c] === "1" ? h[c] + 1 : 0;
    best = Math.max(best, hist(h));
  }
  return best;
}`
  },
  {
    id: "online-stock-span", t: "Online Stock Span", d: "M", tp: ["stack", "monotonic-stack"], pt: ["monotonic-stack"], co: ["Amazon", "Adobe", "Samsung"], lc: "online-stock-span",
    s: "Design StockSpanner.next(price): return how many consecutive days (including today) had price ≤ today's price.", h: ["Keep a stack of [price, span] with decreasing prices.", "Pop smaller-or-equal prices and add their spans to today's."],
    a: "Monotonic stack that merges spans.", tc: "O(1) amortized", sc: "O(n)", sim: ["daily-temperatures", "next-greater-element-i"],
    fn: "StockSpanner", ctor: "", methods: "next(price:number):number",
    ex: [[["StockSpanner", "next", "next", "next", "next", "next", "next", "next"], [[], [100], [80], [60], [70], [60], [75], [85]], [null, 1, 1, 1, 2, 1, 4, 6]]],
    hid: [[["StockSpanner", "next", "next", "next"], [[], [1], [2], [3]]], [["StockSpanner", "next", "next", "next", "next"], [[], [31], [41], [48], [59]]]],
    code: `class StockSpanner {
  constructor() { this.st = []; }
  next(price) {
    let span = 1;
    while (this.st.length && this.st[this.st.length - 1][0] <= price) span += this.st.pop()[1];
    this.st.push([price, span]);
    return span;
  }
}`
  },
  {
    id: "remove-k-digits", t: "Remove K Digits", d: "M", tp: ["stack", "monotonic-stack", "greedy", "strings"], pt: ["monotonic-stack", "greedy"], co: ["Amazon", "Google", "Microsoft"], lc: "remove-k-digits",
    s: "Remove k digits from num to make the smallest possible number (as a string, no leading zeros, \"0\" if empty).", h: ["A bigger digit before a smaller one should go.", "Monotonic increasing stack; pop while k > 0 and the top is bigger than the current digit."],
    a: "Greedy with a stack; trim remaining k from the end and strip leading zeros.", tc: "O(n)", sc: "O(n)", sim: ["largest-number", "remove-adjacent-duplicates-ii"],
    fn: "removeKdigits", params: "num:string, k:number", ret: "string",
    ex: [["1432219", 3, "1219"], ["10200", 1, "200"], ["10", 2, "0"]], hid: [["9", 1], ["112", 1], ["1234567890", 9], ["100", 1]],
    code: `function removeKdigits(num, k) {
  const st = [];
  for (const d of num) {
    while (k > 0 && st.length && st[st.length - 1] > d) { st.pop(); k--; }
    st.push(d);
  }
  while (k-- > 0) st.pop();
  const s = st.join("").replace(/^0+/, "");
  return s || "0";
}`
  },
  {
    id: "asteroid-collision", t: "Asteroid Collision", d: "M", tp: ["stack", "arrays"], pt: ["monotonic-stack"], co: ["Amazon", "Uber", "Lyft", "Salesforce"], lc: "asteroid-collision",
    s: "Positive asteroids move right, negative move left, all at the same speed. Collisions destroy the smaller one (both if equal). Return the survivors.", h: ["Only a right-mover followed by a left-mover can collide.", "Use a stack of survivors; a new left-mover fights the stack top."],
    a: "Stack simulation.", tc: "O(n)", sc: "O(n)", sim: ["car-fleet", "valid-parentheses"],
    fn: "asteroidCollision", params: "asteroids:number[]", ret: "number[]",
    ex: [[[5, 10, -5], [5, 10]], [[8, -8], []], [[10, 2, -5], [10]], [[-2, -1, 1, 2], [-2, -1, 1, 2]]], hid: [[[1, -2, -2, -2]], [[-2, 2, 1, -2]], [[1, -1, -2, -2]]],
    code: `function asteroidCollision(asteroids) {
  const st = [];
  for (const a of asteroids) {
    let alive = true;
    while (alive && a < 0 && st.length && st[st.length - 1] > 0) {
      const top = st[st.length - 1];
      if (top < -a) st.pop();
      else { if (top === -a) st.pop(); alive = false; }
    }
    if (alive) st.push(a);
  }
  return st;
}`
  },
  {
    id: "decode-string", t: "Decode String", d: "M", tp: ["stack", "strings", "recursion"], pt: ["recursion"], co: ["Google", "Amazon", "Bloomberg", "Cisco"], lc: "decode-string",
    s: "Decode strings like \"3[a2[c]]\" → \"accaccacc\".", h: ["Nested brackets → a stack (or recursion).", "On '[' push the current string and count; on ']' pop and repeat."],
    a: "Two stacks: counts and partial strings.", tc: "O(output)", sc: "O(n)", sim: ["basic-calculator", "valid-parentheses"],
    fn: "decodeString", params: "s:string", ret: "string",
    ex: [["3[a]2[bc]", "aaabcbc"], ["3[a2[c]]", "accaccacc"], ["2[abc]3[cd]ef", "abcabccdcdcdef"]], hid: [["abc"], ["10[a]"], ["2[a2[b2[c]]]"]],
    code: `function decodeString(s) {
  const counts = [], strs = [];
  let cur = "", num = 0;
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") num = num * 10 + Number(ch);
    else if (ch === "[") { counts.push(num); strs.push(cur); num = 0; cur = ""; }
    else if (ch === "]") { cur = strs.pop() + cur.repeat(counts.pop()); }
    else cur += ch;
  }
  return cur;
}`
  },
  {
    id: "simplify-path", t: "Simplify Path", d: "M", tp: ["stack", "strings"], pt: ["monotonic-stack"], co: ["Meta", "Amazon", "Microsoft"], lc: "simplify-path",
    s: "Convert a Unix-style absolute path to its canonical form.", h: ["Split on '/'.", "'..' pops, '.' and '' are ignored, anything else is pushed."],
    a: "Stack of directory names.", tc: "O(n)", sc: "O(n)", sim: ["backspace-string-compare", "decode-string"],
    fn: "simplifyPath", params: "path:string", ret: "string",
    ex: [["/home/", "/home"], ["/home//foo/", "/home/foo"], ["/../", "/"], ["/a/./b/../../c/", "/c"]], hid: [["/.../a/../b/c/../d/./"], ["/"], ["/a//b////c/d//././/.."]],
    code: `function simplifyPath(path) {
  const st = [];
  for (const part of path.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") st.pop(); else st.push(part);
  }
  return "/" + st.join("/");
}`
  },
  {
    id: "basic-calculator", t: "Basic Calculator", d: "H", tp: ["stack", "strings", "math-basics", "recursion"], pt: ["recursion"], co: ["Google", "Meta", "Amazon", "Microsoft"], lc: "basic-calculator",
    s: "Evaluate an expression with +, -, parentheses and spaces (unary minus allowed).", h: ["Keep a running result and a sign.", "On '(' push the result and sign; on ')' pop and combine."],
    a: "Single pass with a stack for parentheses.", tc: "O(n)", sc: "O(n)", sim: ["basic-calculator-ii", "eval-rpn", "decode-string"],
    fn: "calculate", params: "s:string", ret: "number",
    ex: [["1 + 1", 2], [" 2-1 + 2 ", 3], ["(1+(4+5+2)-3)+(6+8)", 23]], hid: [["-(2+3)"], ["2147483647"], ["1-(     -2)"], ["- (3 + (4 + 5))"]],
    code: `function calculate(s) {
  const st = [];
  let res = 0, sign = 1, num = 0;
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") num = num * 10 + Number(ch);
    else if (ch === "+" || ch === "-") { res += sign * num; num = 0; sign = ch === "+" ? 1 : -1; }
    else if (ch === "(") { st.push(res, sign); res = 0; sign = 1; }
    else if (ch === ")") { res += sign * num; num = 0; const sg = st.pop(), prev = st.pop(); res = prev + sg * res; }
  }
  return res + sign * num;
}`
  },
  {
    id: "basic-calculator-ii", t: "Basic Calculator II", d: "M", tp: ["stack", "strings", "math-basics"], pt: ["monotonic-stack"], co: ["Meta", "Amazon", "Microsoft", "Airbnb"], lc: "basic-calculator-ii",
    s: "Evaluate an expression with + - * / (integer division truncating toward zero) and spaces.", h: ["* and / bind tighter: apply them immediately to the last number.", "Push +x and -x onto a stack; sum it at the end."],
    a: "Stack of terms, tracking the previous operator.", tc: "O(n)", sc: "O(n)", sim: ["basic-calculator", "eval-rpn"],
    fn: "calculate", params: "s:string", ret: "number",
    ex: [["3+2*2", 7], [" 3/2 ", 1], [" 3+5 / 2 ", 5]], hid: [["42"], ["14-3/2"], ["1*2-3/4+5*6-7*8+9/10"], ["0-2147483647"]],
    code: `function calculate(s) {
  const st = [];
  let num = 0, op = "+";
  for (let i = 0; i <= s.length; i++) {
    const ch = s[i];
    if (ch >= "0" && ch <= "9") { num = num * 10 + Number(ch); continue; }
    if (ch === " ") continue;
    if (op === "+") st.push(num);
    else if (op === "-") st.push(-num);
    else if (op === "*") st.push(st.pop() * num);
    else st.push(Math.trunc(st.pop() / num));
    op = ch; num = 0;
  }
  return st.reduce((a, b) => a + b, 0);
}`
  },
  {
    id: "longest-valid-parentheses", t: "Longest Valid Parentheses", d: "H", tp: ["stack", "dp", "strings"], pt: ["monotonic-stack", "dp"], co: ["Amazon", "Google", "Microsoft"], lc: "longest-valid-parentheses",
    s: "Return the length of the longest well-formed parentheses substring.", h: ["Stack of indexes, seeded with -1 as a base.", "On ')', pop; if empty push this index as the new base, else length = i - top."],
    a: "Index stack with a base marker.", tc: "O(n)", sc: "O(n)", sim: ["valid-parentheses", "min-remove-valid-parentheses"],
    fn: "longestValidParentheses", params: "s:string", ret: "number",
    ex: [["(()", 2], [")()())", 4], ["", 0]], hid: [["()(()"], ["()(())"], ["))))((((("], ["(()())"]],
    code: `function longestValidParentheses(s) {
  const st = [-1];
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") st.push(i);
    else {
      st.pop();
      if (!st.length) st.push(i);
      else best = Math.max(best, i - st[st.length - 1]);
    }
  }
  return best;
}`
  },
  {
    id: "sum-subarray-minimums", t: "Sum of Subarray Minimums", d: "M", tp: ["stack", "monotonic-stack", "dp"], pt: ["monotonic-stack"], co: ["Amazon", "Google", "Uber"], lc: "sum-of-subarray-minimums",
    s: "Return the sum of min(sub) over every contiguous subarray, modulo 1e9+7.", h: ["Count how many subarrays have arr[i] as their minimum.", "left[i] = distance to previous smaller, right[i] = distance to next smaller-or-equal; contribution = arr[i]·left·right."],
    a: "Two monotonic-stack passes (strict on one side to avoid double counting).", tc: "O(n)", sc: "O(n)", sim: ["largest-rectangle-histogram", "next-greater-element-ii"],
    fn: "sumSubarrayMins", params: "arr:number[]", ret: "number",
    ex: [[[3, 1, 2, 4], 17], [[11, 81, 94, 43, 3], 444]], hid: [[[1]], [[2, 2, 2]], [[71, 55, 82, 55]]],
    code: `function sumSubarrayMins(arr) {
  const n = arr.length, MOD = 1000000007n, left = new Array(n), right = new Array(n);
  let st = [];
  for (let i = 0; i < n; i++) { while (st.length && arr[st[st.length - 1]] > arr[i]) st.pop(); left[i] = st.length ? i - st[st.length - 1] : i + 1; st.push(i); }
  st = [];
  for (let i = n - 1; i >= 0; i--) { while (st.length && arr[st[st.length - 1]] >= arr[i]) st.pop(); right[i] = st.length ? st[st.length - 1] - i : n - i; st.push(i); }
  let sum = 0n;
  for (let i = 0; i < n; i++) sum = (sum + BigInt(arr[i]) * BigInt(left[i]) * BigInt(right[i])) % MOD;
  return Number(sum);
}`
  },
  {
    id: "queue-using-stacks", t: "Implement Queue using Stacks", d: "E", tp: ["stack", "queue"], pt: ["monotonic-stack"], co: ["Amazon", "Microsoft", "Apple", "Bloomberg"], lc: "implement-queue-using-stacks",
    s: "Implement MyQueue (push, pop, peek, empty) using only two stacks.", h: ["One stack receives pushes, the other serves pops.", "Move everything across only when the output stack is empty: amortized O(1)."],
    a: "Input stack + output stack with lazy transfer.", tc: "O(1) amortized", sc: "O(n)", sim: ["stack-using-queues", "design-circular-queue"],
    fn: "MyQueue", ctor: "", methods: "push(x:number):void; pop():number; peek():number; empty():boolean",
    ex: [[["MyQueue", "push", "push", "peek", "pop", "empty"], [[], [1], [2], [], [], []], [null, null, null, 1, 1, false]]],
    hid: [[["MyQueue", "push", "pop", "empty", "push", "push", "pop", "peek"], [[], [5], [], [], [6], [7], [], []]]],
    code: `class MyQueue {
  constructor() { this.inp = []; this.out = []; }
  push(x) { this.inp.push(x); }
  move() { if (!this.out.length) while (this.inp.length) this.out.push(this.inp.pop()); }
  pop() { this.move(); return this.out.pop(); }
  peek() { this.move(); return this.out[this.out.length - 1]; }
  empty() { return !this.inp.length && !this.out.length; }
}`
  },
  {
    id: "stack-using-queues", t: "Implement Stack using Queues", d: "E", tp: ["stack", "queue"], pt: ["bfs"], co: ["Amazon", "Microsoft", "Bloomberg"], lc: "implement-stack-using-queues",
    s: "Implement MyStack (push, pop, top, empty) using only queue operations.", h: ["After pushing x, rotate the queue so x is at the front.", "Then pop and top are just queue front operations."],
    a: "One queue; rotate n-1 elements after each push.", tc: "O(n) push, O(1) pop", sc: "O(n)", sim: ["queue-using-stacks", "min-stack"],
    fn: "MyStack", ctor: "", methods: "push(x:number):void; pop():number; top():number; empty():boolean",
    ex: [[["MyStack", "push", "push", "top", "pop", "empty"], [[], [1], [2], [], [], []], [null, null, null, 2, 2, false]]],
    hid: [[["MyStack", "push", "push", "push", "pop", "pop", "top", "empty"], [[], [1], [2], [3], [], [], [], []]]],
    code: `class MyStack {
  constructor() { this.q = []; }
  push(x) {
    this.q.push(x);
    for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift());
  }
  pop() { return this.q.shift(); }
  top() { return this.q[0]; }
  empty() { return this.q.length === 0; }
}`
  },
  {
    id: "backspace-string-compare", t: "Backspace String Compare", d: "E", tp: ["stack", "two-pointers", "strings"], pt: ["two-pointers", "monotonic-stack"], co: ["Google", "Amazon", "Meta"], lc: "backspace-string-compare",
    s: "'#' means backspace. Are s and t equal after typing both into empty editors?", h: ["A stack per string is O(n) space.", "For O(1) space, walk both strings from the end, skipping characters erased by '#'."],
    a: "Reverse two-pointer scan with skip counters.", tc: "O(n + m)", sc: "O(1)", sim: ["simplify-path", "remove-adjacent-duplicates-ii"],
    fn: "backspaceCompare", params: "s:string, t:string", ret: "boolean",
    ex: [["ab#c", "ad#c", true], ["ab##", "c#d#", true], ["a#c", "b", false]], hid: [["xywrrmp", "xywrrmu#p"], ["bxj##tw", "bxo#j##tw"], ["a##c", "#a#c"], ["bbbextm", "bbb#extm"]],
    code: `function backspaceCompare(s, t) {
  let i = s.length - 1, j = t.length - 1;
  const skip = (str, k) => { let n = 0; while (k >= 0) { if (str[k] === "#") n++; else if (n) n--; else break; k--; } return k; };
  while (true) {
    i = skip(s, i); j = skip(t, j);
    if (i < 0 || j < 0) return i < 0 && j < 0;
    if (s[i] !== t[j]) return false;
    i--; j--;
  }
}`
  },
  {
    id: "remove-adjacent-duplicates-ii", t: "Remove All Adjacent Duplicates in String II", d: "M", tp: ["stack", "strings"], pt: ["monotonic-stack"], co: ["Meta", "Bloomberg", "Amazon"], lc: "remove-all-adjacent-duplicates-in-string-ii",
    s: "Repeatedly remove k adjacent equal letters until no more can be removed.", h: ["A stack of [char, count].", "When the top's count reaches k, pop it."],
    a: "Stack of runs.", tc: "O(n)", sc: "O(n)", sim: ["backspace-string-compare", "remove-k-digits"],
    fn: "removeDuplicates", params: "s:string, k:number", ret: "string",
    ex: [["abcd", 2, "abcd"], ["deeedbbcccbdaa", 3, "aa"], ["pbbcggttciiippooaais", 2, "ps"]], hid: [["aaaa", 2], ["yfttttfbbbbnnnnffbgffffgbbbbgssssgthyyyy", 4], ["abba", 2]],
    code: `function removeDuplicates(s, k) {
  const st = [];
  for (const c of s) {
    if (st.length && st[st.length - 1][0] === c) { if (++st[st.length - 1][1] === k) st.pop(); }
    else st.push([c, 1]);
  }
  return st.map(([c, n]) => c.repeat(n)).join("");
}`
  },
  {
    id: "design-circular-queue", t: "Design Circular Queue", d: "M", tp: ["queue", "arrays"], pt: ["two-pointers"], co: ["Amazon", "Microsoft", "Apple"], lc: "design-circular-queue",
    s: "Implement MyCircularQueue(k) with enQueue, deQueue, Front, Rear, isEmpty, isFull.", h: ["A fixed array plus head index and size.", "Tail index = (head + size - 1) % k."],
    a: "Ring buffer.", tc: "O(1) per op", sc: "O(k)", sim: ["queue-using-stacks", "sliding-window-maximum"],
    fn: "MyCircularQueue", ctor: "k:number", methods: "enQueue(value:number):boolean; deQueue():boolean; Front():number; Rear():number; isEmpty():boolean; isFull():boolean",
    ex: [[["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"], [[3], [1], [2], [3], [4], [], [], [], [4], []], [null, true, true, true, false, 3, true, true, true, 4]]],
    hid: [[["MyCircularQueue", "Front", "Rear", "deQueue", "enQueue", "Front", "isEmpty"], [[2], [], [], [], [9], [], []]]],
    code: `class MyCircularQueue {
  constructor(k) { this.a = new Array(k); this.k = k; this.head = 0; this.size = 0; }
  enQueue(v) { if (this.isFull()) return false; this.a[(this.head + this.size) % this.k] = v; this.size++; return true; }
  deQueue() { if (this.isEmpty()) return false; this.head = (this.head + 1) % this.k; this.size--; return true; }
  Front() { return this.isEmpty() ? -1 : this.a[this.head]; }
  Rear() { return this.isEmpty() ? -1 : this.a[(this.head + this.size - 1) % this.k]; }
  isEmpty() { return this.size === 0; }
  isFull() { return this.size === this.k; }
}`
  },
  {
    id: "pattern-132", t: "132 Pattern", d: "M", tp: ["stack", "monotonic-stack", "arrays"], pt: ["monotonic-stack"], co: ["Amazon", "Google", "Bloomberg"], lc: "132-pattern",
    s: "Is there i < j < k with nums[i] < nums[k] < nums[j]?", h: ["Scan from the right, keeping the best candidate for nums[k] (the '2').", "A decreasing stack: popping smaller values gives the largest '2' below the current '3'."],
    a: "Reverse scan with a monotonic stack and a 'third' threshold.", tc: "O(n)", sc: "O(n)", sim: ["next-greater-element-ii", "three-sum"],
    fn: "find132pattern", params: "nums:number[]", ret: "boolean",
    ex: [[[1, 2, 3, 4], false], [[3, 1, 4, 2], true], [[-1, 3, 2, 0], true]], hid: [[[1, 0, 1, -4, -3]], [[3, 5, 0, 3, 4]], [[1]]],
    code: `function find132pattern(nums) {
  const st = [];
  let third = -Infinity;
  for (let i = nums.length - 1; i >= 0; i--) {
    if (nums[i] < third) return true;
    while (st.length && st[st.length - 1] < nums[i]) third = st.pop();
    st.push(nums[i]);
  }
  return false;
}`
  },
  {
    id: "valid-parenthesis-string", t: "Valid Parenthesis String", d: "M", tp: ["greedy", "stack", "dp", "strings"], pt: ["greedy"], co: ["Meta", "Amazon", "Alibaba"], lc: "valid-parenthesis-string",
    s: "'*' can be '(', ')' or empty. Is the string valid?", h: ["Track the range of possible open counts [lo, hi].", "'*' widens the range; if hi < 0 fail; clamp lo at 0; valid if lo == 0 at the end."],
    a: "Greedy min/max open-count range.", tc: "O(n)", sc: "O(1)", sim: ["valid-parentheses", "min-remove-valid-parentheses"],
    fn: "checkValidString", params: "s:string", ret: "boolean",
    ex: [["()", true], ["(*)", true], ["(*))", true]], hid: [["(("], ["*"], ["(((((*(()((((*((**(((()()*)()()()*((((**)())*)*)))))))(())(()))())((*()()(((()((()*(())*(()**)()(())"], [")*("]],
    code: `function checkValidString(s) {
  let lo = 0, hi = 0;
  for (const c of s) {
    if (c === "(") { lo++; hi++; }
    else if (c === ")") { lo--; hi--; }
    else { lo--; hi++; }
    if (hi < 0) return false;
    if (lo < 0) lo = 0;
  }
  return lo === 0;
}`
  },
  {
    id: "min-remove-valid-parentheses", t: "Minimum Remove to Make Valid Parentheses", d: "M", tp: ["stack", "strings"], pt: ["monotonic-stack"], co: ["Meta", "Amazon", "Bloomberg"], lc: "minimum-remove-to-make-valid-parentheses",
    s: "Remove the fewest parentheses so the string is valid. Any valid result is accepted.", h: ["Stack of indexes of unmatched '('.", "Unmatched ')' are removed immediately; leftover '(' indexes are removed at the end."],
    a: "Index stack; build the result skipping removed positions.", tc: "O(n)", sc: "O(n)", sim: ["valid-parentheses", "longest-valid-parentheses"],
    fn: "minRemoveToMakeValid", params: "s:string", ret: "string",
    check: `(args, out, exp) => { const s = args[0]; if (typeof out !== "string" || typeof exp !== "string" || out.length !== exp.length) return false; let d = 0; for (const c of out) { if (c === "(") d++; if (c === ")" && --d < 0) return false; } if (d) return false; let i = 0; for (const c of s) if (i < out.length && c === out[i]) i++; return i === out.length; }`,
    ex: [["lee(t(c)o)de)", "lee(t(c)o)de"], ["a)b(c)d", "ab(c)d"], ["))((", ""]], hid: [["(a(b(c)d)"], ["())()((("], ["abc"]],
    code: `function minRemoveToMakeValid(s) {
  const st = [], drop = new Set();
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") st.push(i);
    else if (s[i] === ")") { if (st.length) st.pop(); else drop.add(i); }
  }
  for (const i of st) drop.add(i);
  let out = "";
  for (let i = 0; i < s.length; i++) if (!drop.has(i)) out += s[i];
  return out;
}`
  },
  {
    id: "exclusive-time-functions", t: "Exclusive Time of Functions", d: "M", tp: ["stack", "arrays"], pt: ["monotonic-stack"], co: ["Meta", "Uber", "LinkedIn"], lc: "exclusive-time-of-functions",
    s: "Logs look like \"id:start:t\" and \"id:end:t\" for a single-threaded CPU. Return each function's exclusive running time.", h: ["A stack of running function ids.", "Keep the previous timestamp; charge the elapsed time to the function on top."],
    a: "Stack + previous-time bookkeeping (end timestamps are inclusive).", tc: "O(logs)", sc: "O(n)", sim: ["eval-rpn", "basic-calculator"],
    fn: "exclusiveTime", params: "n:number, logs:string[]", ret: "number[]",
    ex: [[2, ["0:start:0", "1:start:2", "1:end:5", "0:end:6"], [3, 4]], [1, ["0:start:0", "0:start:2", "0:end:5", "0:start:6", "0:end:6", "0:end:7"], [8]]], hid: [[2, ["0:start:0", "0:start:2", "0:end:5", "1:start:6", "1:end:6", "0:end:7"]], [1, ["0:start:0", "0:end:0"]]],
    code: `function exclusiveTime(n, logs) {
  const res = new Array(n).fill(0), st = [];
  let prev = 0;
  for (const log of logs) {
    const [id, type, t] = log.split(":");
    const time = Number(t);
    if (type === "start") {
      if (st.length) res[st[st.length - 1]] += time - prev;
      st.push(Number(id)); prev = time;
    } else {
      res[st.pop()] += time - prev + 1; prev = time + 1;
    }
  }
  return res;
}`
  }
];
