import type { Lesson } from "@/lib/types";

const dp: Lesson = {
  what: "Dynamic programming (DP) solves a problem by breaking it into smaller overlapping subproblems, solving each subproblem once, and storing its answer for reuse. It's recursion plus memory.",
  analogy: { short: "Climbing stairs with a notebook", text: "To count the ways to reach step 10, you need the ways to reach steps 9 and 8, which need 8 and 7, and so on. Without notes you'd recount step 7 hundreds of times. With a notebook you write each step's answer once and look it up." },
  eli5: "If someone asks you 1 + 1 + 1 + 1, you count 4. If they add another + 1, you don't recount: you remember 4 and say 5. DP is remembering answers you already worked out.",
  tech: "DP applies when a problem has optimal substructure (the answer is built from answers to smaller versions) and overlapping subproblems (the same smaller versions are needed again and again). Top-down: write the recursion and memoize results in a Map or array. Bottom-up: fill a table from the smallest subproblems up. Every DP needs: a state (what dp[i] or dp[i][j] means), a transition (how it's built from smaller states), base cases, an order of computation, and where the answer lives. Tables can often shrink to a few rolling variables. Common families: 1D (stairs, house robber), knapsack (subset sums, coin change), grids (paths), two strings (LCS, edit distance), intervals (burst balloons), and state machines (stock trading).",
  why: "Many interview problems have an exponential brute force (try every choice) that collapses to polynomial time once repeated work is cached. Counting ways, minimum cost, maximum value and 'is it possible' questions over sequences, grids and strings are usually DP.",
  how: ["Write the brute-force recursion: what choices do you have at each step?", "Spot the parameters that define a subproblem: they become the state.", "Memoize: store each state's answer the first time you compute it (top-down).", "Or flip it: fill a table in an order where smaller states come first (bottom-up).", "Shrink the table if each row only needs the previous one.", "Say the complexity: number of states × work per state."],
  props: ["Optimal substructure", "Overlapping subproblems", "Time = states × transition cost", "Top-down (memo) or bottom-up (table)"],
  use: ["Counting ways (paths, decodings, combinations)", "Minimum / maximum cost or value", "Subsequence and substring problems on strings", "Knapsack-style choices with a budget", "Games and decision sequences with states"],
  avoid: ["Subproblems don't repeat (plain recursion or divide and conquer)", "A greedy choice is provably optimal (simpler)", "You need every solution listed (backtracking)"],
  viz: "recursion",
  cx: [["Plain recursion (e.g. Fibonacci)", "O(2ⁿ)", "The same subproblems are recomputed over and over."], ["Memoized / tabulated", "O(states × transition)", "Each state is solved once."], ["Rolling variables", "O(1) space", "Keep only the states the next step needs."]],
  space: "O(number of states), often reducible to one row or a few variables.",
  code: {
    c: `function fibNaive(n) {
  return n < 2 ? n : fibNaive(n - 1) + fibNaive(n - 2);
}
function fibMemo(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const val = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, val);
  return val;
}
function fibTable(n) {
  if (n < 2) return n;
  let prev = 0, cur = 1;
  for (let i = 2; i <= n; i++) [prev, cur] = [cur, prev + cur];
  return cur;
}
console.log(fibNaive(20), fibMemo(20), fibTable(20));
console.log(fibMemo(50), fibTable(50));`,
    hl: [6, 14],
    ex: { 2: "Exponential: fib(n − 2) is computed again inside fib(n − 1), and so on all the way down.", 6: "Already solved: reuse the stored answer (top-down DP).", 14: "Bottom-up: each value needs only the previous two, so two variables replace the whole table.", 18: "fibNaive(50) would take minutes; the DP versions are instant." }
  },
  brute: { title: "Brute force: plain recursion recounts everything", c: `let calls = 0;
function ways(n) {
  calls++;
  if (n <= 1) return 1;
  return ways(n - 1) + ways(n - 2);
}
console.log(ways(25), "calls:", calls);`, time: "O(2ⁿ)", space: "O(n)", ex: { 7: "Over 240,000 calls for n = 25; a DP needs 25 steps." } },
  examples: [
    { lvl: "Easy", title: "House robber (1D DP)", prob: "Maximize the money robbed from houses in a row without robbing two neighbours.", idea: "At each house, either skip it (keep the best so far) or rob it (best without the previous house + this one). Two rolling variables are enough.", c: `function rob(nums) {
  let skip = 0, take = 0;
  for (const x of nums) [skip, take] = [Math.max(skip, take), skip + x];
  return Math.max(skip, take);
}
console.log(rob([1, 2, 3, 1]), rob([2, 7, 9, 3, 1]));`, time: "O(n)", space: "O(1)", ex: { 3: "skip = best if this house is skipped; take = best if it is robbed (so the previous one was skipped)." } },
    { lvl: "Practical", title: "Coin change (unbounded knapsack)", prob: "Fewest coins that make an amount, or −1.", idea: "dp[a] = fewest coins for amount a = 1 + min over coins c of dp[a − c]. Fill amounts from 0 upward.", c: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins) if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
  return dp[amount] === Infinity ? -1 : dp[amount];
}
console.log(coinChange([1, 2, 5], 11), coinChange([2], 3), coinChange([1], 0));`, time: "O(amount × coins)", space: "O(amount)", ex: { 3: "Base case: amount 0 needs 0 coins.", 5: "Try each coin as the last one used." } },
    { lvl: "Interview", title: "Longest common subsequence (2D DP)", prob: "Length of the longest subsequence shared by two strings.", idea: "dp[i][j] = LCS of the first i letters of a and the first j letters of b. Matching letters extend the diagonal; otherwise drop a letter from one string.", c: `function lcs(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[a.length][b.length];
}
console.log(lcs("abcde", "ace"), lcs("abc", "def"));`, time: "O(n · m)", space: "O(n · m)", ex: { 2: "Row 0 and column 0 stay 0: an empty string shares nothing.", 5: "Match → diagonal + 1; no match → best of dropping one letter." } }
  ],
  signals: [["\"how many ways\"", "Counting DP"], ["\"minimum cost\" / \"maximum profit\" with choices", "Optimization DP"], ["\"longest / shortest subsequence\", two strings", "2D string DP"], ["\"can you make / reach / partition\"", "Boolean DP (often knapsack)"], ["a choice now limits future choices (neighbours, cooldowns)", "State-machine DP"]],
  mistakes: [["Jumping to a table before defining the state", "Write what dp[i] means in one sentence first."], ["Wrong or missing base cases", "Check the smallest inputs (0, empty string) by hand."], ["Filling in the wrong order", "Every state must be computed after the states it depends on."], ["Using 0/1 knapsack loops for unbounded items (or the reverse)", "0/1: loop capacity downwards. Unbounded: loop upwards."]],
  js: ["Memoize with a Map keyed by i or `${i},${j}`.", "Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0)) builds a 2D table with independent rows.", "Destructuring swaps ([a, b] = [b, a + b]) make rolling variables tidy."],
  iq: { Beginner: ["fibonacci", "climbing-stairs"], Easy: ["min-cost-climbing-stairs", "pascals-triangle"], Medium: ["house-robber", "coin-change", "longest-increasing-subsequence", "unique-paths", "longest-common-subsequence", "word-break", "decode-ways", "edit-distance"], Hard: ["burst-balloons", "regex-matching", "distinct-subsequences"] },
  rev: { s30: "Recursion + memory: solve each subproblem once. Define the state, the transition, the base cases and the order. Time = number of states × work per state.", m2: ["Brute recursion first, then memoize", "State = the parameters that change", "Bottom-up: smaller states first", "Shrink to rolling variables when possible", "Families: 1D, knapsack, grid, two strings, intervals, state machine"] },
  cheat: `DP CHEAT SHEET

1. State:      dp[i] = …
2. Transition: dp[i] = f(dp[i-1], dp[i-2], …)
3. Base:       dp[0] = …
4. Order:      small → large
5. Answer:     dp[n]

Top-down: recursion + memo
Bottom-up: table, then shrink

Knapsack 0/1: for cap down.  Unbounded: for cap up.
2 strings: dp[i][j] over prefixes`
};

export default dp;
