import type { Lesson } from "@/lib/types";

const bigO: Lesson = {
  what: "Big O is a way to describe how the work an algorithm does grows as the input gets bigger. It ignores exact seconds and machines, and only asks: if I double the input, what happens to the work?",
  analogy: { short: "Recipe scaling", text: "Making tea for 1 person or 100 people: boiling the kettle once is O(1) (same effort no matter how many), pouring each cup is O(n) (one pour per person), and asking every guest how they like every other guest's tea is O(n²)." },
  eli5: "Imagine counting candies. If you just grab the top one, it takes the same time whether the jar has 10 or 10,000 candies. If you count every candy, a bigger jar means more work. Big O is a label that says which kind of job you are doing.",
  tech: "Big O gives an asymptotic upper bound on the growth rate of a function f(n). We drop constants and lower-order terms: 3n² + 5n + 100 is O(n²) because for large n the n² term dominates.",
  why: "Two solutions can both give the right answer, but one finishes in 1 millisecond and the other in 3 hours on large inputs. Interviewers ask for complexity because it proves you understand why your code is fast or slow, before running it. Constraints like n ≤ 10^5 tell you which complexity is acceptable.",
  how: [
    "Count how many times the most repeated line runs, in terms of n.",
    "A single loop over n items → O(n). A loop inside a loop over n → O(n²).",
    "Halving the problem each step → O(log n).",
    "Drop constants: O(2n) → O(n). Drop smaller terms: O(n² + n) → O(n²).",
    "Different inputs get different letters: a loop over a then over b → O(a + b), nested → O(a · b).",
    "Space complexity counts extra memory you create (arrays, maps, recursion stack), not the input itself."
  ],
  props: ["Describes growth, not exact speed", "Worst case unless stated otherwise", "Constants and small terms are dropped", "Applies to both time and space"],
  use: ["Comparing two approaches before coding", "Checking if a solution fits the constraints (n ≤ 10^5 → need about O(n log n) or better)", "Explaining trade-offs in interviews"],
  avoid: ["Micro-optimising tiny inputs where constants matter more", "Assuming O(1) is always faster than O(n) for small n"],
  viz: "bigo",
  cxTitle: "Common complexities (n = 1,000,000)",
  cx: [
    ["O(1)", "constant", "Access arr[i], Map.get, push/pop. The work does not depend on n."],
    ["O(log n)", "~20 steps", "Binary search, balanced tree ops. Each step throws away half, so 1,000,000 → 20 halvings."],
    ["O(n)", "1,000,000", "One pass: find max, sum, count. Every element touched once."],
    ["O(n log n)", "~20,000,000", "Good sorting (merge sort, Array.sort). Split log n times, n work per level."],
    ["O(n²)", "10^12 — too slow", "Nested loops comparing every pair. Fine for n ≤ ~3,000."],
    ["O(2ⁿ)", "impossible", "All subsets, naive recursive Fibonacci. Only works for n ≤ ~25."],
    ["O(n!)", "impossible", "All permutations. Only works for n ≤ ~10."]
  ],
  space: "Count extra memory: a new array of size n is O(n) space; a recursion that goes n deep is O(n) stack space.",
  code: {
    c: `// O(1): same work for any size
const first = (arr) => arr[0];

// O(n): touches every element once
function sum(arr) {
  let total = 0;
  for (const x of arr) total += x;
  return total;
}

// O(n²): every pair
function countPairs(arr) {
  let pairs = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) pairs++;
  }
  return pairs;
}

const data = [4, 8, 15, 16, 23, 42];
console.log(first(data));
console.log(sum(data));
console.log(countPairs(data));`,
    hl: [2, 5, 6, 13, 14],
    ex: { 2: "Reading one index is a direct jump in memory: O(1).", 6: "This loop body runs once per element, so n times total: O(n).", 13: "Outer loop runs n times…", 14: "…and for each, the inner loop runs up to n times. n × n = O(n²)." }
  },
  examples: [
    { lvl: "Easy", title: "Spot the complexity of a single loop", prob: "What is the time complexity of printing every element that is even?", idea: "One loop, constant work per element. The if-check does not change the growth.", c: `function printEvens(arr) {
  for (const x of arr) {
    if (x % 2 === 0) console.log(x);
  }
}
printEvens([1, 2, 3, 4, 5, 6]);
// Time: O(n)  Space: O(1)`, time: "O(n)", space: "O(1)" },
    { lvl: "Practical", title: "Why halving gives log n", prob: "How many times can you halve n before reaching 1?", idea: "Each step divides by 2. The number of halvings is log₂(n). This is why binary search is so fast.", c: `function halvings(n) {
  let steps = 0;
  while (n > 1) {
    n = Math.floor(n / 2);
    steps++;
  }
  return steps;
}
console.log(halvings(8));
console.log(halvings(1000));
console.log(halvings(1000000));`, time: "O(log n)", space: "O(1)" },
    { lvl: "Interview", title: "Improve O(n²) duplicate check to O(n)", prob: "Return true if any value appears twice. First the nested loop, then trade memory for speed with a Set.", idea: "The brute force compares every pair (O(n²)). A Set remembers what we've seen, so each check is O(1) and we pass once: O(n) time, O(n) space. This time-for-space trade is the most common interview optimisation.", c: `function hasDupSlow(arr) {
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] === arr[j]) return true;
  return false;
}

function hasDupFast(arr) {
  const seen = new Set();
  for (const x of arr) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}

console.log(hasDupSlow([3, 1, 4, 1, 5]));
console.log(hasDupFast([3, 1, 4, 1, 5]));
console.log(hasDupFast([1, 2, 3]));`, time: "O(n)", space: "O(n)" }
  ],
  signals: [
    ["n ≤ 10 to 12", "O(n!) or O(2ⁿ) is fine → backtracking"],
    ["n ≤ 20 to 25", "O(2ⁿ) → subsets / bitmask"],
    ["n ≤ 500", "O(n³) is OK"],
    ["n ≤ 5,000", "O(n²) is OK"],
    ["n ≤ 10^5 to 10^6", "Need O(n log n) or O(n)"],
    ["n up to 10^9 or more", "Need O(log n) or O(1) → binary search / math"]
  ],
  mistakes: [
    ["Saying two separate loops are O(n²)", "Loops one after another add: O(n + n) = O(n). Only nested loops multiply."],
    ["Forgetting built-in costs: arr.includes, indexOf, slice, shift inside a loop", "Each of those is O(n) itself, so inside a loop you get O(n²)."],
    ["Ignoring recursion stack space", "A recursion n levels deep uses O(n) memory even with no arrays."],
    ["Treating string concatenation in a loop as free", "Building a string with += can copy it each time. Push to an array and join at the end."]
  ],
  js: ["Array.prototype.sort is O(n log n). Always pass a comparator for numbers: arr.sort((a, b) => a - b).", "arr.shift() and arr.unshift() are O(n) because every element moves. push/pop are O(1).", "Map/Set get, set, has, delete are O(1) on average."],
  iq: { Beginner: ["What is the complexity of a for loop from 0 to n?", "Why do we drop constants in Big O?"], Easy: ["contains-duplicate", "What is the complexity of arr.includes inside a loop?"], Medium: ["Analyze the complexity of merge sort", "Time vs space trade-off: give an example"], Hard: ["Explain amortized O(1) for dynamic array push"] },
  rev: { s30: "Big O = how work grows with input size. Drop constants. Nested loops multiply, sequential loops add. Halving → log n.", m2: ["O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)", "n ≤ 10^5 needs O(n log n) or better", "Space counts extra memory + recursion stack", "shift/unshift/includes/indexOf/slice are O(n) in JS"] },
  cheat: `BIG O CHEAT SHEET

O(1)        index access, Map.get, push/pop
O(log n)    binary search, halving
O(n)        single pass
O(n log n)  sorting
O(n²)       nested loops over same data
O(2ⁿ)       all subsets
O(n!)       all permutations

Rules:
→ drop constants        O(3n) = O(n)
→ drop small terms      O(n² + n) = O(n²)
→ sequential = add      nested = multiply
→ recursion depth = stack space

Constraint → target:
n ≤ 10^5  → O(n log n)
n ≤ 10^3  → O(n²)
n ≤ 20    → O(2ⁿ)`
};

export default bigO;
