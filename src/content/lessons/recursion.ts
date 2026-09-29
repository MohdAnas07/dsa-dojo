import type { Lesson } from "@/lib/types";

const recursion: Lesson = {
  what: "Recursion is when a function solves a problem by calling itself on a smaller version of the same problem, until it reaches a case so small it can answer directly (the base case).",
  analogy: { short: "Russian nesting dolls", text: "To find the smallest doll, open the doll. Inside is a smaller doll: do the same thing. Eventually you find a doll that doesn't open. That's the base case, and you're done." },
  eli5: "You're in a long queue and want to know your position. You ask the person in front: \"what's your number?\" They ask the person in front of them… The first person says \"1\". Each person adds 1 and passes it back.",
  tech: "A recursive function has (1) a base case that stops recursion and (2) a recursive case that reduces the problem. Each call gets its own stack frame; the call stack unwinds when base cases return. Time is often (number of calls) × (work per call); space is the maximum recursion depth.",
  why: "Trees, graphs, divide & conquer, backtracking and dynamic programming are all naturally recursive. Many problems are easy to state as \"answer for n uses answer for n - 1\".",
  how: ["Define what the function returns for input n.", "Write the base case(s) first.", "Assume the function already works for smaller inputs (trust it).", "Combine smaller results into the answer for n.", "Make sure every call moves toward a base case."],
  props: ["Base case + recursive case", "Uses the call stack (O(depth) space)", "Can recompute the same subproblems (fix with memoization)", "Any recursion can be rewritten with an explicit stack"],
  use: ["Tree and graph traversal", "Divide & conquer (merge sort, quick sort)", "Backtracking (subsets, permutations)", "Problems defined in terms of smaller versions"],
  avoid: ["Very deep recursion (JS stack overflows around 10,000 frames)", "Simple loops where iteration is clearer", "Overlapping subproblems without memoization (exponential time)"],
  viz: "recursion",
  cx: [["Linear recursion (n → n-1)", "O(n) time, O(n) space", "n calls, each constant work; n frames on the stack."], ["Two branches (naive Fibonacci)", "O(2ⁿ)", "Each call spawns two more; the tree doubles each level."], ["With memoization", "O(n)", "Each subproblem is solved once and cached."], ["Halving (n → n/2)", "O(log n)", "Depth is log n."]],
  space: "O(maximum depth) for the call stack.",
  code: {
    c: `function factorial(n) {
  if (n <= 1) return 1;          // base case
  return n * factorial(n - 1);   // recursive case
}
console.log(factorial(5));

function sumArray(arr, i = 0) {
  if (i === arr.length) return 0;
  return arr[i] + sumArray(arr, i + 1);
}
console.log(sumArray([1, 2, 3, 4]));`,
    hl: [2, 3],
    ex: { 2: "Without a base case the function calls itself forever → stack overflow.", 3: "Trust that factorial(n - 1) works; just multiply by n." }
  },
  examples: [
    { lvl: "Easy", title: "Power of a number", prob: "Compute x^n.", idea: "x^n = x · x^(n-1). Base case x^0 = 1. Faster: x^n = (x^(n/2))² halves the problem → O(log n).", c: `function power(x, n) {
  if (n === 0) return 1;
  const half = power(x, Math.floor(n / 2));
  return n % 2 === 0 ? half * half : half * half * x;
}
console.log(power(2, 10));
console.log(power(3, 5));`, time: "O(log n)", space: "O(log n)" },
    { lvl: "Practical", title: "Fibonacci with memoization", prob: "Return the n-th Fibonacci number efficiently.", idea: "Naive fib(n) = fib(n-1) + fib(n-2) recomputes the same values exponentially. Cache each answer the first time it's computed.", c: `function fib(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const val = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, val);
  return val;
}
console.log(fib(10));
console.log(fib(50));`, time: "O(n)", space: "O(n)", ex: { 3: "If we already solved this n, return it instantly. This one line turns O(2ⁿ) into O(n)." } },
    { lvl: "Interview", title: "Generate all subsets", prob: "Return every subset of a set of distinct numbers.", idea: "For each element there are two choices: take it or skip it. Recursion explores both branches. 2ⁿ subsets.", c: `function subsets(nums) {
  const res = [];
  function go(i, cur) {
    if (i === nums.length) { res.push([...cur]); return; }
    go(i + 1, cur);           // skip nums[i]
    cur.push(nums[i]);
    go(i + 1, cur);           // take nums[i]
    cur.pop();                // undo (backtrack)
  }
  go(0, []);
  return res;
}
console.log(subsets([1, 2, 3]));`, time: "O(n · 2ⁿ)", space: "O(n)", ex: { 4: "Copy cur with [...cur]; otherwise every result shares the same array.", 8: "Undo the choice so the caller sees cur unchanged." } }
  ],
  signals: [["\"all combinations / subsets / permutations\"", "Recursion + backtracking"], ["Tree or nested structure", "Recursion"], ["\"f(n) depends on f(n-1)\"", "Recursion → memoization → DP"], ["\"split in half and combine\"", "Divide & conquer"]],
  mistakes: [["Missing or wrong base case", "Write the base case first and test it with the smallest input."], ["Not returning the recursive result", "return helper(...) — forgetting return gives undefined."], ["Pushing cur instead of a copy into results", "Push [...cur]; arrays are references."], ["Naive recursion with overlapping subproblems", "Add memoization (Map) or convert to bottom-up DP."]],
  js: ["Default parameters (memo = new Map()) are created per top-level call, which is handy for memoization.", "JS has no tail-call optimization in most engines; deep recursion (> ~10k) overflows."],
  iq: { Beginner: ["Print 1 to n recursively", "Sum of digits"], Easy: ["fibonacci", "power-of-two", "Reverse a string recursively"], Medium: ["subsets", "permutations", "Pow(x, n)"], Hard: ["N-Queens", "Word search II"] },
  rev: { s30: "A function calling itself on a smaller input until a base case. Space = recursion depth. Overlapping calls → memoize.", m2: ["Base case first, then trust the recursive call", "Time ≈ calls × work per call", "Two branches without memo → O(2ⁿ)", "Backtracking: choose → recurse → undo"] },
  cheat: `RECURSION CHEAT SHEET

function solve(input):
  if (base case) return answer
  smaller = solve(smaller input)
  return combine(smaller)

Space  = max depth (call stack)
Time   = #calls × work per call

Backtracking:
  choose → recurse → un-choose

Think Recursion when:
→ trees / nested data
→ all combinations
→ f(n) from f(n-1)
→ divide & conquer`
};

export default recursion;
