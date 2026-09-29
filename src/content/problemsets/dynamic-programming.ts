import type { ProblemDef } from "@/lib/types";

/** Dynamic programming: 1D, knapsack, grids, strings, intervals, stock problems. */
export const DYNAMIC_PROGRAMMING: ProblemDef[] = [
  {
    id: "min-cost-climbing-stairs", t: "Min Cost Climbing Stairs", d: "E", tp: ["dp", "arrays"], pt: ["dp"], co: ["Amazon", "Adobe"], lc: "min-cost-climbing-stairs",
    s: "cost[i] is paid when you step on stair i; you may climb 1 or 2 steps and start at index 0 or 1. Return the minimum cost to reach the top.", h: ["dp[i] = cost to stand on step i = cost[i] + min(dp[i-1], dp[i-2]).", "The top is past the last index: min of the last two."],
    a: "1D DP with two rolling variables.", tc: "O(n)", sc: "O(1)", sim: ["climbing-stairs", "house-robber"],
    fn: "minCostClimbingStairs", params: "cost:number[]", ret: "number",
    ex: [[[10, 15, 20], 15], [[1, 100, 1, 1, 1, 100, 1, 1, 100, 1], 6]], hid: [[[0, 0]], [[5, 1]], [[0, 1, 2, 2]]],
    code: `function minCostClimbingStairs(cost) {
  let a = cost[0], b = cost[1];
  for (let i = 2; i < cost.length; i++) [a, b] = [b, cost[i] + Math.min(a, b)];
  return Math.min(a, b);
}`
  },
  {
    id: "house-robber-ii", t: "House Robber II", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Amazon", "Microsoft", "Google"], lc: "house-robber-ii",
    s: "Houses are in a circle (first and last are adjacent). Return the maximum loot without robbing adjacent houses.", h: ["You can't take both the first and the last house.", "Run House Robber on nums[0..n-2] and nums[1..n-1]; take the max."],
    a: "Two linear House Robber passes.", tc: "O(n)", sc: "O(1)", sim: ["house-robber", "house-robber-iii", "delete-and-earn"],
    fn: "rob", params: "nums:number[]", ret: "number",
    ex: [[[2, 3, 2], 3], [[1, 2, 3, 1], 4], [[1, 2, 3], 3]], hid: [[[5]], [[1, 2]], [[200, 3, 140, 20, 10]]],
    code: `function rob(nums) {
  if (nums.length === 1) return nums[0];
  const line = (lo, hi) => { let a = 0, b = 0; for (let i = lo; i <= hi; i++) [a, b] = [b, Math.max(b, a + nums[i])]; return b; };
  return Math.max(line(0, nums.length - 2), line(1, nums.length - 1));
}`
  },
  {
    id: "decode-ways", t: "Decode Ways", d: "M", tp: ["dp", "strings"], pt: ["dp"], co: ["Meta", "Amazon", "Google", "Uber"], lc: "decode-ways",
    s: "'A'→1 … 'Z'→26. Count the ways to decode a digit string.", h: ["dp[i] = ways to decode the first i characters.", "Add dp[i-1] if s[i-1] is 1–9, and dp[i-2] if s[i-2..i-1] is 10–26."],
    a: "1D DP with two rolling values.", tc: "O(n)", sc: "O(1)", sim: ["climbing-stairs", "word-break"],
    fn: "numDecodings", params: "s:string", ret: "number",
    ex: [["12", 2], ["226", 3], ["06", 0]], hid: [["0"], ["10"], ["27"], ["11106"], ["2611055971756562"]],
    code: `function numDecodings(s) {
  let prev2 = 1, prev1 = s[0] === "0" ? 0 : 1;
  for (let i = 2; i <= s.length; i++) {
    let cur = 0;
    if (s[i - 1] !== "0") cur += prev1;
    const two = Number(s.slice(i - 2, i));
    if (two >= 10 && two <= 26) cur += prev2;
    [prev2, prev1] = [prev1, cur];
  }
  return prev1;
}`
  },
  {
    id: "longest-increasing-subsequence", t: "Longest Increasing Subsequence", d: "M", tp: ["dp", "binary-search"], pt: ["dp", "binary-search"], co: ["Amazon", "Google", "Microsoft", "Meta"], lc: "longest-increasing-subsequence",
    s: "Return the length of the longest strictly increasing subsequence.", h: ["O(n²) DP: dp[i] = 1 + max dp[j] for j < i with nums[j] < nums[i].", "O(n log n): keep tails[k] = smallest tail of an increasing subsequence of length k + 1; binary search each number into it."],
    a: "Patience sorting with binary search.", tc: "O(n log n)", sc: "O(n)", sim: ["number-of-lis", "russian-doll-envelopes", "longest-string-chain"],
    fn: "lengthOfLIS", params: "nums:number[]", ret: "number",
    ex: [[[10, 9, 2, 5, 3, 7, 101, 18], 4], [[0, 1, 0, 3, 2, 3], 4], [[7, 7, 7, 7, 7, 7, 7], 1]], hid: [[[1]], [[4, 10, 4, 3, 8, 9]], { label: "50,000 numbers (needs O(n log n))", gen: "() => [Array.from({ length: 50000 }, (_, i) => (i * 7919) % 50021)]" }],
    code: `function lengthOfLIS(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (tails[m] < x) lo = m + 1; else hi = m; }
    tails[lo] = x;
  }
  return tails.length;
}`
  },
  {
    id: "number-of-lis", t: "Number of Longest Increasing Subsequence", d: "M", tp: ["dp"], pt: ["dp"], co: ["Amazon", "Google"], lc: "number-of-longest-increasing-subsequence",
    s: "Return how many longest strictly increasing subsequences exist.", h: ["Track two arrays: len[i] and count[i] for subsequences ending at i.", "When extending from j gives a longer length, reset count; equal length adds counts."],
    a: "O(n²) DP with lengths and counts.", tc: "O(n²)", sc: "O(n)", sim: ["longest-increasing-subsequence"],
    fn: "findNumberOfLIS", params: "nums:number[]", ret: "number",
    ex: [[[1, 3, 5, 4, 7], 2], [[2, 2, 2, 2, 2], 5]], hid: [[[1]], [[1, 2, 4, 3, 5, 4, 7, 2]], [[3, 1, 2]]],
    code: `function findNumberOfLIS(nums) {
  const n = nums.length, len = new Array(n).fill(1), cnt = new Array(n).fill(1);
  for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) {
    if (nums[j] >= nums[i]) continue;
    if (len[j] + 1 > len[i]) { len[i] = len[j] + 1; cnt[i] = cnt[j]; }
    else if (len[j] + 1 === len[i]) cnt[i] += cnt[j];
  }
  const best = Math.max(...len);
  return cnt.reduce((s, c, i) => s + (len[i] === best ? c : 0), 0);
}`
  },
  {
    id: "russian-doll-envelopes", t: "Russian Doll Envelopes", d: "H", tp: ["dp", "binary-search", "sorting"], pt: ["dp", "binary-search"], co: ["Google", "Amazon", "Microsoft"], lc: "russian-doll-envelopes",
    s: "An envelope fits inside another if both width and height are strictly smaller. Return the maximum nesting depth.", h: ["Sort by width ascending, and height descending for equal widths.", "Then the answer is the LIS of heights."],
    a: "Sort + O(n log n) LIS.", tc: "O(n log n)", sc: "O(n)", sim: ["longest-increasing-subsequence", "maximum-length-pair-chain"],
    fn: "maxEnvelopes", params: "envelopes:number[][]", ret: "number",
    ex: [[[[5, 4], [6, 4], [6, 7], [2, 3]], 3], [[[1, 1], [1, 1], [1, 1]], 1]], hid: [[[[4, 5], [4, 6], [6, 7], [2, 3], [1, 1]]], [[[1, 3], [3, 5], [6, 7], [6, 8], [8, 4], [9, 5]]]],
    code: `function maxEnvelopes(envelopes) {
  envelopes.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const tails = [];
  for (const [, h] of envelopes) {
    let lo = 0, hi = tails.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (tails[m] < h) lo = m + 1; else hi = m; }
    tails[lo] = h;
  }
  return tails.length;
}`
  },
  {
    id: "maximum-length-pair-chain", t: "Maximum Length of Pair Chain", d: "M", tp: ["greedy", "dp", "sorting", "intervals"], pt: ["greedy", "dp"], co: ["Amazon"], lc: "maximum-length-of-pair-chain",
    s: "Pair [c, d] can follow [a, b] if b < c. Return the longest chain length.", h: ["Same as activity selection.", "Sort by the second value and greedily take pairs."],
    a: "Greedy by earliest end.", tc: "O(n log n)", sc: "O(1)", sim: ["non-overlapping-intervals", "russian-doll-envelopes"],
    fn: "findLongestChain", params: "pairs:number[][]", ret: "number",
    ex: [[[[1, 2], [2, 3], [3, 4]], 2], [[[1, 2], [7, 8], [4, 5]], 3]], hid: [[[[1, 2]]], [[[-10, -8], [8, 9], [-5, 0], [6, 10], [-6, -4], [1, 7], [9, 10], [-4, 7]]]],
    code: `function findLongestChain(pairs) {
  pairs.sort((a, b) => a[1] - b[1]);
  let end = -Infinity, count = 0;
  for (const [a, b] of pairs) if (a > end) { count++; end = b; }
  return count;
}`
  },
  {
    id: "word-break", t: "Word Break", d: "M", tp: ["dp", "hashing", "strings", "trie"], pt: ["dp"], co: ["Amazon", "Meta", "Google", "Microsoft", "Bloomberg"], lc: "word-break",
    s: "Can s be split into a sequence of dictionary words (words may repeat)?", h: ["dp[i] = can the first i characters be segmented.", "dp[i] is true if some dp[j] is true and s[j..i) is a word."],
    a: "1D DP over prefixes.", tc: "O(n² )", sc: "O(n)", sim: ["word-break-ii", "decode-ways", "coin-change"],
    fn: "wordBreak", params: "s:string, wordDict:string[]", ret: "boolean",
    ex: [["leetcode", ["leet", "code"], true], ["applepenapple", ["apple", "pen"], true], ["catsandog", ["cats", "dog", "sand", "and", "cat"], false]], hid: [["a", ["b"]], ["aaaaaaa", ["aaaa", "aaa"]], ["cars", ["car", "ca", "rs"]]],
    code: `function wordBreak(s, wordDict) {
  const dict = new Set(wordDict), dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++)
    for (let j = 0; j < i; j++) if (dp[j] && dict.has(s.slice(j, i))) { dp[i] = true; break; }
  return dp[s.length];
}`
  },
  {
    id: "coin-change-ii", t: "Coin Change II", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Amazon", "Microsoft", "Bloomberg"], lc: "coin-change-ii",
    s: "Return the number of combinations of coins (unlimited supply) that make amount.", h: ["Order doesn't matter, so loop coins on the outside.", "dp[a] += dp[a - coin]."],
    a: "Unbounded knapsack counting combinations.", tc: "O(amount · coins)", sc: "O(amount)", sim: ["coin-change", "combination-sum", "combination-sum-iv"],
    fn: "change", params: "amount:number, coins:number[]", ret: "number",
    ex: [[5, [1, 2, 5], 4], [3, [2], 0], [10, [10], 1]], hid: [[0, [7]], [500, [3, 5, 7, 8, 9, 10, 11]], [100, [1, 2, 5, 10, 20, 50]]],
    code: `function change(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const c of coins) for (let a = c; a <= amount; a++) dp[a] += dp[a - c];
  return dp[amount];
}`
  },
  {
    id: "combination-sum-iv", t: "Combination Sum IV", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Google", "Meta", "Amazon"], lc: "combination-sum-iv",
    s: "Count ordered sequences (permutations count separately) of nums that sum to target.", h: ["Now order matters: loop targets on the outside.", "dp[t] = Σ dp[t - x] for x in nums."],
    a: "DP over target, counting sequences.", tc: "O(target · n)", sc: "O(target)", sim: ["coin-change-ii", "climbing-stairs", "combination-sum"],
    fn: "combinationSum4", params: "nums:number[], target:number", ret: "number",
    ex: [[[1, 2, 3], 4, 7], [[9], 3, 0]], hid: [[[1], 10], [[2, 1, 3], 35], [[4, 2, 1], 32]],
    code: `function combinationSum4(nums, target) {
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;
  for (let t = 1; t <= target; t++) for (const x of nums) if (x <= t) dp[t] += dp[t - x];
  return dp[target];
}`
  },
  {
    id: "partition-equal-subset", t: "Partition Equal Subset Sum", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Amazon", "Meta", "Google", "Microsoft"], lc: "partition-equal-subset-sum",
    s: "Can nums be split into two subsets with equal sums?", h: ["Need a subset summing to total / 2 (total must be even).", "0/1 knapsack: dp[s] = reachable sum; iterate s downward so each number is used once."],
    a: "Boolean subset-sum DP.", tc: "O(n · sum)", sc: "O(sum)", sim: ["target-sum", "last-stone-weight-ii", "partition-k-equal-subsets"],
    fn: "canPartition", params: "nums:number[]", ret: "boolean",
    ex: [[[1, 5, 11, 5], true], [[1, 2, 3, 5], false]], hid: [[[1, 1]], [[2, 2, 1, 1]], [[100]], [[1, 2, 5]]],
    code: `function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2) return false;
  const half = total / 2, dp = new Array(half + 1).fill(false);
  dp[0] = true;
  for (const x of nums) for (let s = half; s >= x; s--) if (dp[s - x]) dp[s] = true;
  return dp[half];
}`
  },
  {
    id: "target-sum", t: "Target Sum", d: "M", tp: ["dp", "backtracking", "arrays"], pt: ["dp", "backtracking"], co: ["Meta", "Google", "Amazon"], lc: "target-sum",
    s: "Put + or - before each number. Count expressions that evaluate to target.", h: ["Positives P and negatives N: P - N = target, P + N = total.", "So count subsets with sum (total + target) / 2."],
    a: "Subset-count knapsack.", tc: "O(n · sum)", sc: "O(sum)", sim: ["partition-equal-subset", "coin-change-ii"],
    fn: "findTargetSumWays", params: "nums:number[], target:number", ret: "number",
    ex: [[[1, 1, 1, 1, 1], 3, 5], [[1], 1, 1]], hid: [[[1], 2], [[0, 0, 0, 0, 0, 0, 0, 0, 1], 1], [[1, 2, 7, 9, 981], 1000000000]],
    code: `function findTargetSumWays(nums, target) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (Math.abs(target) > total || (total + target) % 2) return 0;
  const P = (total + target) / 2, dp = new Array(P + 1).fill(0);
  dp[0] = 1;
  for (const x of nums) for (let s = P; s >= x; s--) dp[s] += dp[s - x];
  return dp[P];
}`
  },
  {
    id: "last-stone-weight-ii", t: "Last Stone Weight II", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Google", "Amazon"], lc: "last-stone-weight-ii",
    s: "Smash stones in any order (result y - x). Return the smallest possible final weight.", h: ["The result is |sum(A) - sum(B)| for some split into two groups.", "Find the subset sum closest to total / 2."],
    a: "Subset-sum reachability up to total / 2.", tc: "O(n · sum)", sc: "O(sum)", sim: ["partition-equal-subset", "last-stone-weight"],
    fn: "lastStoneWeightII", params: "stones:number[]", ret: "number",
    ex: [[[2, 7, 4, 1, 8, 1], 1], [[31, 26, 33, 21, 40], 5]], hid: [[[1]], [[1, 2]], [[1, 1, 4, 2, 2]]],
    code: `function lastStoneWeightII(stones) {
  const total = stones.reduce((a, b) => a + b, 0), half = Math.floor(total / 2);
  const dp = new Array(half + 1).fill(false);
  dp[0] = true;
  for (const x of stones) for (let s = half; s >= x; s--) if (dp[s - x]) dp[s] = true;
  for (let s = half; s >= 0; s--) if (dp[s]) return total - 2 * s;
  return total;
}`
  },
  {
    id: "knapsack-01", t: "0/1 Knapsack", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Amazon", "Flipkart", "Goldman Sachs", "Morgan Stanley"], lc: "",
    s: "Item i has weights[i] and values[i]. Each item can be taken at most once. Return the maximum value within capacity. (Classic interview problem, not on LeetCode.)", h: ["dp[c] = best value using capacity c.", "Iterate capacity downward so each item is used once."],
    a: "1D 0/1 knapsack.", tc: "O(n · capacity)", sc: "O(capacity)", sim: ["partition-equal-subset", "ones-and-zeroes", "rod-cutting"],
    fn: "knapsack", params: "weights:number[], values:number[], capacity:number", ret: "number",
    ex: [[[1, 3, 4, 5], [1, 4, 5, 7], 7, 9], [[5], [10], 4, 0]], hid: [[[1, 2, 3], [10, 15, 40], 6], [[10, 20, 30], [60, 100, 120], 50], [[4, 5, 1], [1, 2, 3], 4]],
    code: `function knapsack(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++)
    for (let c = capacity; c >= weights[i]; c--) dp[c] = Math.max(dp[c], dp[c - weights[i]] + values[i]);
  return dp[capacity];
}`
  },
  {
    id: "rod-cutting", t: "Rod Cutting", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Amazon", "Microsoft"], lc: "",
    s: "prices[i] is the price of a rod piece of length i + 1. Cut a rod of length n to maximise revenue. (Classic unbounded knapsack.)", h: ["dp[len] = best revenue for a rod of length len.", "Try every first cut: dp[len] = max(prices[k - 1] + dp[len - k])."],
    a: "Unbounded knapsack over lengths.", tc: "O(n²)", sc: "O(n)", sim: ["knapsack-01", "coin-change", "integer-break"],
    fn: "cutRod", params: "prices:number[], n:number", ret: "number",
    ex: [[[1, 5, 8, 9, 10, 17, 17, 20], 8, 22], [[3, 5, 8, 9, 10, 17, 17, 20], 8, 24]], hid: [[[2], 1], [[1, 1, 1, 1], 4], [[5, 1, 1], 3]],
    code: `function cutRod(prices, n) {
  const dp = new Array(n + 1).fill(0);
  for (let len = 1; len <= n; len++)
    for (let k = 1; k <= Math.min(len, prices.length); k++) dp[len] = Math.max(dp[len], prices[k - 1] + dp[len - k]);
  return dp[n];
}`
  },
  {
    id: "integer-break", t: "Integer Break", d: "M", tp: ["dp", "math-basics", "greedy"], pt: ["dp", "greedy"], co: ["Amazon", "Google"], lc: "integer-break",
    s: "Split n (≥ 2) into at least two positive integers maximising their product.", h: ["dp[i] = max over j of max(j, dp[j]) · max(i - j, dp[i - j]).", "Math shortcut: use as many 3s as possible."],
    a: "DP over i.", tc: "O(n²)", sc: "O(n)", sim: ["rod-cutting", "perfect-squares"],
    fn: "integerBreak", params: "n:number", ret: "number",
    ex: [[2, 1], [10, 36]], hid: [[3], [4], [8], [58]],
    code: `function integerBreak(n) {
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++)
    for (let j = 1; j < i; j++) dp[i] = Math.max(dp[i], Math.max(j, dp[j]) * Math.max(i - j, dp[i - j]));
  return dp[n];
}`
  },
  {
    id: "perfect-squares", t: "Perfect Squares", d: "M", tp: ["dp", "bfs", "math-basics"], pt: ["dp", "bfs"], co: ["Google", "Amazon", "Adobe"], lc: "perfect-squares",
    s: "Return the least number of perfect squares that sum to n.", h: ["It's coin change where coins are 1, 4, 9, 16, …", "dp[i] = 1 + min dp[i - k²]."],
    a: "Unbounded coin-change DP.", tc: "O(n √n)", sc: "O(n)", sim: ["coin-change", "integer-break", "open-the-lock"],
    fn: "numSquares", params: "n:number", ret: "number",
    ex: [[12, 3], [13, 2]], hid: [[1], [7], [43], [9999]],
    code: `function numSquares(n) {
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) for (let k = 1; k * k <= i; k++) dp[i] = Math.min(dp[i], dp[i - k * k] + 1);
  return dp[n];
}`
  },
  {
    id: "unique-paths", t: "Unique Paths", d: "M", tp: ["dp", "math-basics"], pt: ["dp"], co: ["Amazon", "Google", "Meta", "Bloomberg"], lc: "unique-paths",
    s: "A robot moves only right or down on an m×n grid. Count paths from the top-left to the bottom-right.", h: ["paths(r, c) = paths(r-1, c) + paths(r, c-1).", "A single row array is enough."],
    a: "Grid DP with one row.", tc: "O(mn)", sc: "O(n)", sim: ["unique-paths-ii", "min-path-sum", "pascals-triangle"],
    fn: "uniquePaths", params: "m:number, n:number", ret: "number",
    ex: [[3, 7, 28], [3, 2, 3]], hid: [[1, 1], [10, 10], [23, 12]],
    code: `function uniquePaths(m, n) {
  const row = new Array(n).fill(1);
  for (let r = 1; r < m; r++) for (let c = 1; c < n; c++) row[c] += row[c - 1];
  return row[n - 1];
}`
  },
  {
    id: "unique-paths-ii", t: "Unique Paths II", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Amazon", "Google", "Microsoft"], lc: "unique-paths-ii",
    s: "Same as Unique Paths, but cells with 1 are obstacles.", h: ["An obstacle cell has 0 paths.", "Otherwise the same recurrence."],
    a: "Grid DP zeroing obstacles.", tc: "O(mn)", sc: "O(n)", sim: ["unique-paths", "min-path-sum"],
    fn: "uniquePathsWithObstacles", params: "obstacleGrid:number[][]", ret: "number",
    ex: [[[[0, 0, 0], [0, 1, 0], [0, 0, 0]], 2], [[[0, 1], [0, 0]], 1]], hid: [[[[1]]], [[[0]]], [[[0, 0], [1, 1], [0, 0]]]],
    code: `function uniquePathsWithObstacles(obstacleGrid) {
  const n = obstacleGrid[0].length, row = new Array(n).fill(0);
  row[0] = 1;
  for (const r of obstacleGrid) for (let c = 0; c < n; c++) {
    if (r[c]) row[c] = 0;
    else if (c > 0) row[c] += row[c - 1];
  }
  return row[n - 1];
}`
  },
  {
    id: "min-path-sum", t: "Minimum Path Sum", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Amazon", "Google", "Goldman Sachs"], lc: "minimum-path-sum",
    s: "Moving only right or down, find the path from top-left to bottom-right with the smallest sum.", h: ["dp[r][c] = grid[r][c] + min(top, left).", "Edges only have one way in."],
    a: "Grid DP.", tc: "O(mn)", sc: "O(n)", sim: ["unique-paths", "triangle", "minimum-falling-path"],
    fn: "minPathSum", params: "grid:number[][]", ret: "number",
    ex: [[[[1, 3, 1], [1, 5, 1], [4, 2, 1]], 7], [[[1, 2, 3], [4, 5, 6]], 12]], hid: [[[[5]]], [[[1, 2], [1, 1]]], [[[9, 1, 4, 8]]]],
    code: `function minPathSum(grid) {
  const n = grid[0].length, dp = new Array(n).fill(Infinity);
  dp[0] = 0;
  for (const row of grid) for (let c = 0; c < n; c++) dp[c] = row[c] + Math.min(dp[c], c ? dp[c - 1] : Infinity);
  return dp[n - 1];
}`
  },
  {
    id: "triangle", t: "Triangle", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Amazon", "Bloomberg", "Apple"], lc: "triangle",
    s: "Return the minimum path sum from top to bottom, moving to adjacent numbers on the row below.", h: ["Work bottom-up.", "dp[i] = row[i] + min(dp[i], dp[i + 1])."],
    a: "Bottom-up DP in one array.", tc: "O(n²)", sc: "O(n)", sim: ["min-path-sum", "pascals-triangle", "minimum-falling-path"],
    fn: "minimumTotal", params: "triangle:number[][]", ret: "number",
    ex: [[[[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]], 11], [[[-10]], -10]], hid: [[[[1], [2, 3]]], [[[-1], [2, 3], [1, -1, -3]]]],
    code: `function minimumTotal(triangle) {
  const dp = [...triangle[triangle.length - 1]];
  for (let r = triangle.length - 2; r >= 0; r--)
    for (let i = 0; i <= r; i++) dp[i] = triangle[r][i] + Math.min(dp[i], dp[i + 1]);
  return dp[0];
}`
  },
  {
    id: "minimum-falling-path", t: "Minimum Falling Path Sum", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Google", "Goldman Sachs"], lc: "minimum-falling-path-sum",
    s: "Fall from any cell of the first row to the last row, moving to one of the three cells below each step. Return the minimum sum.", h: ["dp[r][c] = matrix[r][c] + min of the three cells above.", "Keep one previous row."],
    a: "Row-by-row DP.", tc: "O(n²)", sc: "O(n)", sim: ["triangle", "min-path-sum"],
    fn: "minFallingPathSum", params: "matrix:number[][]", ret: "number",
    ex: [[[[2, 1, 3], [6, 5, 4], [7, 8, 9]], 13], [[[-19, 57], [-40, -5]], -59]], hid: [[[[7]]], [[[100, -42, -46, -41], [31, 97, 10, -10], [-58, -51, 82, 89], [51, 81, 69, -51]]]],
    code: `function minFallingPathSum(matrix) {
  let prev = [...matrix[0]];
  for (let r = 1; r < matrix.length; r++) {
    prev = matrix[r].map((v, c) => v + Math.min(prev[c], c > 0 ? prev[c - 1] : Infinity, c + 1 < prev.length ? prev[c + 1] : Infinity));
  }
  return Math.min(...prev);
}`
  },
  {
    id: "maximal-square", t: "Maximal Square", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Amazon", "Google", "Meta", "Apple"], lc: "maximal-square",
    s: "Return the area of the largest square containing only '1's.", h: ["dp[r][c] = side of the largest square ending at (r, c).", "dp = 1 + min(top, left, top-left) when the cell is '1'."],
    a: "2D DP on square sides.", tc: "O(mn)", sc: "O(n)", sim: ["maximal-rectangle", "count-square-submatrices"],
    fn: "maximalSquare", params: "matrix:character[][]", ret: "number",
    ex: [[[["1", "0", "1", "0", "0"], ["1", "0", "1", "1", "1"], ["1", "1", "1", "1", "1"], ["1", "0", "0", "1", "0"]], 4], [[["0", "1"], ["1", "0"]], 1], [[["0"]], 0]], hid: [[[["1", "1"], ["1", "1"]]], [[["1", "1", "1", "0"], ["1", "1", "1", "1"], ["1", "1", "1", "1"]]]],
    code: `function maximalSquare(matrix) {
  const R = matrix.length, C = matrix[0].length, dp = Array.from({ length: R + 1 }, () => new Array(C + 1).fill(0));
  let side = 0;
  for (let r = 1; r <= R; r++) for (let c = 1; c <= C; c++) {
    if (matrix[r - 1][c - 1] === "1") {
      dp[r][c] = 1 + Math.min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]);
      side = Math.max(side, dp[r][c]);
    }
  }
  return side * side;
}`
  },
  {
    id: "count-square-submatrices", t: "Count Square Submatrices with All Ones", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Google", "Amazon"], lc: "count-square-submatrices-with-all-ones",
    s: "Count all square submatrices made only of 1s.", h: ["Same DP as Maximal Square.", "dp[r][c] squares end at (r, c), so sum all dp values."],
    a: "Maximal-square DP, summed.", tc: "O(mn)", sc: "O(1) in place", sim: ["maximal-square"],
    fn: "countSquares", params: "matrix:number[][]", ret: "number",
    ex: [[[[0, 1, 1, 1], [1, 1, 1, 1], [0, 1, 1, 1]], 15], [[[1, 0, 1], [1, 1, 0], [1, 1, 0]], 7]], hid: [[[[1]]], [[[1, 1], [1, 1]]]],
    code: `function countSquares(matrix) {
  let total = 0;
  for (let r = 0; r < matrix.length; r++) for (let c = 0; c < matrix[0].length; c++) {
    if (matrix[r][c] && r && c) matrix[r][c] = 1 + Math.min(matrix[r - 1][c], matrix[r][c - 1], matrix[r - 1][c - 1]);
    total += matrix[r][c];
  }
  return total;
}`
  },
  {
    id: "longest-common-subsequence", t: "Longest Common Subsequence", d: "M", tp: ["dp", "strings"], pt: ["dp"], co: ["Amazon", "Google", "Microsoft", "Meta"], lc: "longest-common-subsequence",
    s: "Return the length of the longest common subsequence of two strings.", h: ["dp[i][j] = LCS of the first i and first j characters.", "Equal characters: dp[i-1][j-1] + 1; otherwise max(dp[i-1][j], dp[i][j-1])."],
    a: "Classic 2D string DP.", tc: "O(mn)", sc: "O(n)", sim: ["edit-distance", "longest-palindromic-subsequence", "uncrossed-lines"],
    fn: "longestCommonSubsequence", params: "text1:string, text2:string", ret: "number",
    ex: [["abcde", "ace", 3], ["abc", "abc", 3], ["abc", "def", 0]], hid: [["a", "a"], ["bsbininm", "jmjkbkjkv"], ["oxcpqrsvwf", "shmtulqrypy"]],
    code: `function longestCommonSubsequence(text1, text2) {
  const n = text2.length;
  let prev = new Array(n + 1).fill(0);
  for (let i = 1; i <= text1.length; i++) {
    const cur = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) cur[j] = text1[i - 1] === text2[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    prev = cur;
  }
  return prev[n];
}`
  },
  {
    id: "uncrossed-lines", t: "Uncrossed Lines", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Amazon"], lc: "uncrossed-lines",
    s: "Draw lines between equal numbers of two arrays without crossings. Return the maximum number of lines.", h: ["Non-crossing lines keep order in both arrays.", "That is exactly LCS on arrays."],
    a: "LCS DP.", tc: "O(mn)", sc: "O(n)", sim: ["longest-common-subsequence", "max-length-repeated-subarray"],
    fn: "maxUncrossedLines", params: "nums1:number[], nums2:number[]", ret: "number",
    ex: [[[1, 4, 2], [1, 2, 4], 2], [[2, 5, 1, 2, 5], [10, 5, 2, 1, 5, 2], 3], [[1, 3, 7, 1, 7, 5], [1, 9, 2, 5, 1], 2]], hid: [[[1], [2]], [[3, 1, 4, 1, 1, 3, 5, 1, 2, 2], [4, 1, 5, 2, 1, 1, 1, 5, 3, 1, 1, 1, 2, 3, 1, 4, 3, 5, 5, 3, 1, 2, 3, 2, 4, 1, 1, 1, 5, 3]]],
    code: `function maxUncrossedLines(nums1, nums2) {
  const n = nums2.length;
  let prev = new Array(n + 1).fill(0);
  for (const a of nums1) {
    const cur = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) cur[j] = a === nums2[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    prev = cur;
  }
  return prev[n];
}`
  },
  {
    id: "max-length-repeated-subarray", t: "Maximum Length of Repeated Subarray", d: "M", tp: ["dp", "sliding-window", "binary-search", "hashing"], pt: ["dp"], co: ["Amazon", "Karat"], lc: "maximum-length-of-repeated-subarray",
    s: "Return the length of the longest subarray that appears in both arrays.", h: ["Contiguous → dp[i][j] = length of common suffix ending at i, j.", "dp[i][j] = dp[i-1][j-1] + 1 if equal, else 0."],
    a: "Longest common substring DP.", tc: "O(mn)", sc: "O(n)", sim: ["longest-common-subsequence", "uncrossed-lines"],
    fn: "findLength", params: "nums1:number[], nums2:number[]", ret: "number",
    ex: [[[1, 2, 3, 2, 1], [3, 2, 1, 4, 7], 3], [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], 5]], hid: [[[1], [2]], [[1, 0, 0, 0, 1], [1, 0, 0, 1, 1]]],
    code: `function findLength(nums1, nums2) {
  const n = nums2.length;
  let prev = new Array(n + 1).fill(0), best = 0;
  for (let i = 1; i <= nums1.length; i++) {
    const cur = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) if (nums1[i - 1] === nums2[j - 1]) { cur[j] = prev[j - 1] + 1; best = Math.max(best, cur[j]); }
    prev = cur;
  }
  return best;
}`
  },
  {
    id: "edit-distance", t: "Edit Distance", d: "M", tp: ["dp", "strings"], pt: ["dp"], co: ["Amazon", "Google", "Microsoft", "Meta"], lc: "edit-distance",
    s: "Return the minimum insertions, deletions and replacements to turn word1 into word2.", h: ["dp[i][j] = cost to convert the first i chars into the first j chars.", "Equal chars copy dp[i-1][j-1]; otherwise 1 + min(insert, delete, replace)."],
    a: "Levenshtein DP.", tc: "O(mn)", sc: "O(n)", sim: ["longest-common-subsequence", "delete-operation-two-strings", "one-edit-distance"],
    fn: "minDistance", params: "word1:string, word2:string", ret: "number",
    ex: [["horse", "ros", 3], ["intention", "execution", 5]], hid: [["", "a"], ["abc", "abc"], ["zoologicoarchaeologist", "zoogeologist"]],
    code: `function minDistance(word1, word2) {
  const n = word2.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= word1.length; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = word1[i - 1] === word2[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
    prev = cur;
  }
  return prev[n];
}`
  },
  {
    id: "delete-operation-two-strings", t: "Delete Operation for Two Strings", d: "M", tp: ["dp", "strings"], pt: ["dp"], co: ["Google", "Amazon"], lc: "delete-operation-for-two-strings",
    s: "Return the minimum number of deletions (from either string) to make the strings equal.", h: ["What survives in both is a common subsequence.", "Answer = m + n - 2 · LCS."],
    a: "LCS-based formula.", tc: "O(mn)", sc: "O(n)", sim: ["longest-common-subsequence", "edit-distance"],
    fn: "minDistance", params: "word1:string, word2:string", ret: "number",
    ex: [["sea", "eat", 2], ["leetcode", "etco", 4]], hid: [["a", "b"], ["abc", "abc"], ["park", "spake"]],
    code: `function minDistance(word1, word2) {
  const n = word2.length;
  let prev = new Array(n + 1).fill(0);
  for (let i = 1; i <= word1.length; i++) {
    const cur = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) cur[j] = word1[i - 1] === word2[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    prev = cur;
  }
  return word1.length + n - 2 * prev[n];
}`
  },
  {
    id: "longest-palindromic-substring", t: "Longest Palindromic Substring", d: "M", tp: ["dp", "strings", "two-pointers"], pt: ["two-pointers", "dp"], co: ["Amazon", "Microsoft", "Google", "Meta", "Adobe"], lc: "longest-palindromic-substring",
    s: "Return the longest palindromic substring (any one if several have the maximum length).", h: ["Every palindrome has a center: a character or a gap between two.", "Expand around each of the 2n - 1 centers."],
    a: "Expand around center.", tc: "O(n²)", sc: "O(1)", sim: ["palindromic-substrings", "longest-palindromic-subsequence", "valid-palindrome"],
    fn: "longestPalindrome", params: "s:string", ret: "string",
    check: `(args, out, exp) => { const s = args[0]; if (typeof out !== "string" || out.length !== exp.length || !s.includes(out)) return false; return out === [...out].reverse().join(""); }`,
    ex: [["babad", "bab"], ["cbbd", "bb"]], hid: [["a"], ["ac"], ["forgeeksskeegfor"], ["aaaabaaa"]],
    code: `function longestPalindrome(s) {
  let start = 0, len = 0;
  const expand = (l, r) => { while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; } if (r - l - 1 > len) { len = r - l - 1; start = l + 1; } };
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); }
  return s.slice(start, start + len);
}`
  },
  {
    id: "palindromic-substrings", t: "Palindromic Substrings", d: "M", tp: ["dp", "strings", "two-pointers"], pt: ["two-pointers", "dp"], co: ["Meta", "Amazon", "Google"], lc: "palindromic-substrings",
    s: "Count substrings that are palindromes.", h: ["Expand around every center.", "Each successful expansion is one more palindrome."],
    a: "Expand around 2n - 1 centers, counting.", tc: "O(n²)", sc: "O(1)", sim: ["longest-palindromic-substring", "palindrome-partitioning"],
    fn: "countSubstrings", params: "s:string", ret: "number",
    ex: [["abc", 3], ["aaa", 6]], hid: [["a"], ["abba"], ["fdsklf"]],
    code: `function countSubstrings(s) {
  let count = 0;
  const expand = (l, r) => { while (l >= 0 && r < s.length && s[l] === s[r]) { count++; l--; r++; } };
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); }
  return count;
}`
  },
  {
    id: "longest-palindromic-subsequence", t: "Longest Palindromic Subsequence", d: "M", tp: ["dp", "strings"], pt: ["dp"], co: ["Amazon", "Uber", "LinkedIn"], lc: "longest-palindromic-subsequence",
    s: "Return the length of the longest palindromic subsequence.", h: ["It's the LCS of s and reversed s.", "Or interval DP: dp[i][j] over substrings."],
    a: "LCS(s, reverse(s)).", tc: "O(n²)", sc: "O(n)", sim: ["longest-common-subsequence", "min-insertions-palindrome", "longest-palindromic-substring"],
    fn: "longestPalindromeSubseq", params: "s:string", ret: "number",
    ex: [["bbbab", 4], ["cbbd", 2]], hid: [["a"], ["abcdef"], ["aabaa"]],
    code: `function longestPalindromeSubseq(s) {
  const t = [...s].reverse().join(""), n = s.length;
  let prev = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const cur = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) cur[j] = s[i - 1] === t[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    prev = cur;
  }
  return prev[n];
}`
  },
  {
    id: "min-insertions-palindrome", t: "Minimum Insertion Steps to Make a String Palindrome", d: "H", tp: ["dp", "strings"], pt: ["dp"], co: ["Google", "Amazon"], lc: "minimum-insertion-steps-to-make-a-string-palindrome",
    s: "Return the minimum characters to insert anywhere to make s a palindrome.", h: ["Characters already forming a palindromic subsequence can stay.", "Answer = n - longest palindromic subsequence."],
    a: "n - LPS.", tc: "O(n²)", sc: "O(n)", sim: ["longest-palindromic-subsequence"],
    fn: "minInsertions", params: "s:string", ret: "number",
    ex: [["zzazz", 0], ["mbadm", 2], ["leetcode", 5]], hid: [["a"], ["ab"], ["abcba"]],
    code: `function minInsertions(s) {
  const t = [...s].reverse().join(""), n = s.length;
  let prev = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const cur = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) cur[j] = s[i - 1] === t[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    prev = cur;
  }
  return n - prev[n];
}`
  },
  {
    id: "distinct-subsequences", t: "Distinct Subsequences", d: "H", tp: ["dp", "strings"], pt: ["dp"], co: ["Google", "Amazon", "Bloomberg"], lc: "distinct-subsequences",
    s: "Count the distinct subsequences of s that equal t.", h: ["dp[j] = ways to form t[0..j) so far.", "For each char of s, update j from right to left: if s[i] == t[j-1], dp[j] += dp[j-1]."],
    a: "1D DP iterating t backwards.", tc: "O(mn)", sc: "O(n)", sim: ["is-subsequence", "longest-common-subsequence"],
    fn: "numDistinct", params: "s:string, t:string", ret: "number",
    ex: [["rabbbit", "rabbit", 3], ["babgbag", "bag", 5]], hid: [["a", "b"], ["aaa", "a"], ["aabb", "ab"]],
    code: `function numDistinct(s, t) {
  const dp = new Array(t.length + 1).fill(0);
  dp[0] = 1;
  for (const ch of s) for (let j = t.length; j >= 1; j--) if (ch === t[j - 1]) dp[j] += dp[j - 1];
  return dp[t.length];
}`
  },
  {
    id: "interleaving-string", t: "Interleaving String", d: "M", tp: ["dp", "strings"], pt: ["dp"], co: ["Amazon", "Google", "Microsoft"], lc: "interleaving-string",
    s: "Is s3 formed by interleaving s1 and s2 (keeping each string's order)?", h: ["dp[i][j] = can the first i of s1 and first j of s2 form the first i + j of s3.", "Come from the top (take s1[i-1]) or from the left (take s2[j-1])."],
    a: "2D DP on (i, j).", tc: "O(mn)", sc: "O(n)", sim: ["edit-distance", "longest-common-subsequence"],
    fn: "isInterleave", params: "s1:string, s2:string, s3:string", ret: "boolean",
    ex: [["aabcc", "dbbca", "aadbbcbcac", true], ["aabcc", "dbbca", "aadbbbaccc", false], ["", "", "", true]], hid: [["a", "", "a"], ["a", "b", "ab"], ["ab", "bc", "bbac"]],
    code: `function isInterleave(s1, s2, s3) {
  const m = s1.length, n = s2.length;
  if (m + n !== s3.length) return false;
  const dp = new Array(n + 1).fill(false);
  for (let i = 0; i <= m; i++) for (let j = 0; j <= n; j++) {
    if (i === 0 && j === 0) dp[j] = true;
    else dp[j] = (i > 0 && dp[j] && s1[i - 1] === s3[i + j - 1]) || (j > 0 && dp[j - 1] && s2[j - 1] === s3[i + j - 1]);
  }
  return dp[n];
}`
  },
  {
    id: "regex-matching", t: "Regular Expression Matching", d: "H", tp: ["dp", "strings", "recursion"], pt: ["dp", "recursion"], co: ["Google", "Meta", "Amazon", "Microsoft"], lc: "regular-expression-matching",
    s: "Implement matching with '.' (any char) and '*' (zero or more of the previous element) over the whole string.", h: ["dp[i][j] = does s[i..] match p[j..].", "If p[j+1] is '*': skip the pair, or consume one char of s when it matches."],
    a: "Memoized recursion on (i, j).", tc: "O(mn)", sc: "O(mn)", sim: ["wildcard-matching", "edit-distance"],
    fn: "isMatch", params: "s:string, p:string", ret: "boolean",
    ex: [["aa", "a", false], ["aa", "a*", true], ["ab", ".*", true]], hid: [["aab", "c*a*b"], ["mississippi", "mis*is*p*."], ["", "a*b*"], ["ab", ".*c"]],
    code: `function isMatch(s, p) {
  const memo = new Map();
  const go = (i, j) => {
    const key = i * 100 + j;
    if (memo.has(key)) return memo.get(key);
    let res;
    if (j === p.length) res = i === s.length;
    else {
      const first = i < s.length && (p[j] === "." || p[j] === s[i]);
      res = p[j + 1] === "*" ? go(i, j + 2) || (first && go(i + 1, j)) : first && go(i + 1, j + 1);
    }
    memo.set(key, res);
    return res;
  };
  return go(0, 0);
}`
  },
  {
    id: "wildcard-matching", t: "Wildcard Matching", d: "H", tp: ["dp", "greedy", "strings"], pt: ["dp", "greedy"], co: ["Google", "Amazon", "Meta"], lc: "wildcard-matching",
    s: "Match with '?' (any one char) and '*' (any sequence, including empty) over the whole string.", h: ["dp[i][j] = do the first i of s and first j of p match.", "'*' either matches empty (dp[i][j-1]) or one more char (dp[i-1][j])."],
    a: "2D DP (or greedy backtracking to the last '*').", tc: "O(mn)", sc: "O(n)", sim: ["regex-matching", "add-search-words"],
    fn: "isMatch", params: "s:string, p:string", ret: "boolean",
    ex: [["aa", "a", false], ["aa", "*", true], ["cb", "?a", false], ["adceb", "*a*b", true]], hid: [["acdcb", "a*c?b"], ["", "******"], ["abc", "abc*"]],
    code: `function isMatch(s, p) {
  const n = p.length;
  let prev = new Array(n + 1).fill(false);
  prev[0] = true;
  for (let j = 1; j <= n; j++) prev[j] = prev[j - 1] && p[j - 1] === "*";
  for (let i = 1; i <= s.length; i++) {
    const cur = new Array(n + 1).fill(false);
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "*") cur[j] = cur[j - 1] || prev[j];
      else cur[j] = prev[j - 1] && (p[j - 1] === "?" || p[j - 1] === s[i - 1]);
    }
    prev = cur;
  }
  return prev[n];
}`
  },
  {
    id: "best-time-cooldown", t: "Best Time to Buy and Sell Stock with Cooldown", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["Amazon", "Google"], lc: "best-time-to-buy-and-sell-stock-with-cooldown",
    s: "Unlimited transactions, but after selling you must wait one day. Return the maximum profit.", h: ["Three states: holding, just sold (cooldown), resting.", "Write transitions between the states for each day."],
    a: "State-machine DP.", tc: "O(n)", sc: "O(1)", sim: ["best-time-stock-ii", "best-time-fee", "best-time-iii"],
    fn: "maxProfit", params: "prices:number[]", ret: "number",
    ex: [[[1, 2, 3, 0, 2], 3], [[1], 0]], hid: [[[2, 1]], [[1, 2, 4]], [[6, 1, 6, 4, 3, 0, 2]]],
    code: `function maxProfit(prices) {
  let hold = -Infinity, sold = 0, rest = 0;
  for (const p of prices) [hold, sold, rest] = [Math.max(hold, rest - p), hold + p, Math.max(rest, sold)];
  return Math.max(sold, rest);
}`
  },
  {
    id: "best-time-fee", t: "Best Time to Buy and Sell Stock with Transaction Fee", d: "M", tp: ["dp", "greedy", "arrays"], pt: ["dp"], co: ["Meta", "Amazon"], lc: "best-time-to-buy-and-sell-stock-with-transaction-fee",
    s: "Unlimited transactions; each sale costs fee. Return the maximum profit.", h: ["Two states: holding a share or not.", "cash = max(cash, hold + p - fee); hold = max(hold, cash - p)."],
    a: "Two-state DP.", tc: "O(n)", sc: "O(1)", sim: ["best-time-cooldown", "best-time-stock-ii"],
    fn: "maxProfit", params: "prices:number[], fee:number", ret: "number",
    ex: [[[1, 3, 2, 8, 4, 9], 2, 8], [[1, 3, 7, 5, 10, 3], 3, 6]], hid: [[[1], 0], [[9, 8, 7, 1, 2], 3], [[4, 5, 2, 4, 3, 3, 1, 2, 5, 4], 1]],
    code: `function maxProfit(prices, fee) {
  let cash = 0, hold = -prices[0];
  for (let i = 1; i < prices.length; i++) {
    cash = Math.max(cash, hold + prices[i] - fee);
    hold = Math.max(hold, cash - prices[i]);
  }
  return cash;
}`
  },
  {
    id: "best-time-iii", t: "Best Time to Buy and Sell Stock III", d: "H", tp: ["dp", "arrays"], pt: ["dp"], co: ["Amazon", "Google", "Bloomberg"], lc: "best-time-to-buy-and-sell-stock-iii",
    s: "At most two transactions. Return the maximum profit.", h: ["Four running states: buy1, sell1, buy2, sell2.", "buy2 builds on the profit of sell1."],
    a: "Four-state DP in one pass.", tc: "O(n)", sc: "O(1)", sim: ["best-time-iv", "best-time-stock"],
    fn: "maxProfit", params: "prices:number[]", ret: "number",
    ex: [[[3, 3, 5, 0, 0, 3, 1, 4], 6], [[1, 2, 3, 4, 5], 4], [[7, 6, 4, 3, 1], 0]], hid: [[[1]], [[1, 2, 4, 2, 5, 7, 2, 4, 9, 0]]],
    code: `function maxProfit(prices) {
  let b1 = -Infinity, s1 = 0, b2 = -Infinity, s2 = 0;
  for (const p of prices) {
    b1 = Math.max(b1, -p); s1 = Math.max(s1, b1 + p);
    b2 = Math.max(b2, s1 - p); s2 = Math.max(s2, b2 + p);
  }
  return s2;
}`
  },
  {
    id: "best-time-iv", t: "Best Time to Buy and Sell Stock IV", d: "H", tp: ["dp", "arrays"], pt: ["dp"], co: ["Amazon", "Google", "Citadel"], lc: "best-time-to-buy-and-sell-stock-iv",
    s: "At most k transactions. Return the maximum profit.", h: ["Generalise the four states of Stock III to 2k states.", "buy[j] = max(buy[j], sell[j-1] - p); sell[j] = max(sell[j], buy[j] + p)."],
    a: "k pairs of buy/sell states.", tc: "O(nk)", sc: "O(k)", sim: ["best-time-iii", "best-time-stock-ii"],
    fn: "maxProfit", params: "k:number, prices:number[]", ret: "number",
    ex: [[2, [2, 4, 1], 2], [2, [3, 2, 6, 5, 0, 3], 7]], hid: [[1, [1]], [100, [1, 2, 3, 4, 5]], [3, [3, 3, 5, 0, 0, 3, 1, 4]]],
    code: `function maxProfit(k, prices) {
  const buy = new Array(k + 1).fill(-Infinity), sell = new Array(k + 1).fill(0);
  for (const p of prices) for (let j = 1; j <= k; j++) {
    buy[j] = Math.max(buy[j], sell[j - 1] - p);
    sell[j] = Math.max(sell[j], buy[j] + p);
  }
  return sell[k];
}`
  },
  {
    id: "burst-balloons", t: "Burst Balloons", d: "H", tp: ["dp", "divide-conquer"], pt: ["dp", "recursion"], co: ["Google", "Amazon", "Microsoft"], lc: "burst-balloons",
    s: "Bursting balloon i earns nums[left] · nums[i] · nums[right] (neighbours at that time; outside counts as 1). Maximise the total.", h: ["Think about which balloon is burst LAST in an interval.", "dp[l][r] = max over k of dp[l][k] + dp[k][r] + v[l]·v[k]·v[r] (with padding 1s)."],
    a: "Interval DP.", tc: "O(n³)", sc: "O(n²)", sim: ["min-cost-cut-stick", "different-ways-parentheses"],
    fn: "maxCoins", params: "nums:number[]", ret: "number",
    ex: [[[3, 1, 5, 8], 167], [[1, 5], 10]], hid: [[[7]], [[9, 76, 64, 21]]],
    code: `function maxCoins(nums) {
  const v = [1, ...nums, 1], n = v.length, dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let len = 2; len < n; len++)
    for (let l = 0; l + len < n; l++) {
      const r = l + len;
      for (let k = l + 1; k < r; k++) dp[l][r] = Math.max(dp[l][r], dp[l][k] + dp[k][r] + v[l] * v[k] * v[r]);
    }
  return dp[0][n - 1];
}`
  },
  {
    id: "min-cost-cut-stick", t: "Minimum Cost to Cut a Stick", d: "H", tp: ["dp", "sorting"], pt: ["dp"], co: ["Google", "Amazon"], lc: "minimum-cost-to-cut-a-stick",
    s: "A stick of length n must be cut at given positions; each cut costs the current stick length. Return the minimum total cost.", h: ["Sort cuts and add 0 and n as ends.", "Interval DP: dp[i][j] = (c[j] - c[i]) + min over k of dp[i][k] + dp[k][j]."],
    a: "Interval DP over cut indexes.", tc: "O(m³)", sc: "O(m²)", sim: ["burst-balloons"],
    fn: "minCost", params: "n:number, cuts:number[]", ret: "number",
    ex: [[7, [1, 3, 4, 5], 16], [9, [5, 6, 1, 4, 2], 22]], hid: [[2, [1]], [30, [13, 25, 16, 20, 26, 5, 27, 8, 23, 14, 6, 15, 21, 24, 29, 1, 19, 9, 3]]],
    code: `function minCost(n, cuts) {
  const c = [0, ...cuts.sort((a, b) => a - b), n], m = c.length;
  const dp = Array.from({ length: m }, () => new Array(m).fill(0));
  for (let len = 2; len < m; len++)
    for (let i = 0; i + len < m; i++) {
      const j = i + len;
      dp[i][j] = Infinity;
      for (let k = i + 1; k < j; k++) dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j]);
      dp[i][j] += c[j] - c[i];
    }
  return dp[0][m - 1];
}`
  },
  {
    id: "ones-and-zeroes", t: "Ones and Zeroes", d: "M", tp: ["dp", "strings"], pt: ["dp"], co: ["Google", "Amazon"], lc: "ones-and-zeroes",
    s: "Pick the largest subset of binary strings using at most m zeros and n ones in total.", h: ["0/1 knapsack with two capacities.", "dp[i][j] = best count using i zeros and j ones; iterate both downward."],
    a: "2D-capacity knapsack.", tc: "O(L · m · n)", sc: "O(m · n)", sim: ["knapsack-01", "partition-equal-subset"],
    fn: "findMaxForm", params: "strs:string[], m:number, n:number", ret: "number",
    ex: [[["10", "0001", "111001", "1", "0"], 5, 3, 4], [["10", "0", "1"], 1, 1, 2]], hid: [[["0"], 0, 0], [["10", "0001", "111001", "1", "0"], 4, 3]],
    code: `function findMaxForm(strs, m, n) {
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (const s of strs) {
    const z = [...s].filter(c => c === "0").length, o = s.length - z;
    for (let i = m; i >= z; i--) for (let j = n; j >= o; j--) dp[i][j] = Math.max(dp[i][j], dp[i - z][j - o] + 1);
  }
  return dp[m][n];
}`
  },
  {
    id: "delete-and-earn", t: "Delete and Earn", d: "M", tp: ["dp", "hashing"], pt: ["dp"], co: ["Amazon", "Google"], lc: "delete-and-earn",
    s: "Taking value x earns x but deletes every x - 1 and x + 1. Return the maximum points.", h: ["Group equal values: points[x] = x · count(x).", "Now it's House Robber over values 0..max."],
    a: "Bucket sums + House Robber.", tc: "O(n + max)", sc: "O(max)", sim: ["house-robber", "house-robber-ii"],
    fn: "deleteAndEarn", params: "nums:number[]", ret: "number",
    ex: [[[3, 4, 2], 6], [[2, 2, 3, 3, 3, 4], 9]], hid: [[[1]], [[1, 1, 1, 2, 4, 5, 5, 5, 6]], [[8, 10, 4, 9, 1, 3, 5, 9, 4, 10]]],
    code: `function deleteAndEarn(nums) {
  const pts = new Array(Math.max(...nums) + 1).fill(0);
  for (const x of nums) pts[x] += x;
  let a = 0, b = 0;
  for (const p of pts) [a, b] = [b, Math.max(b, a + p)];
  return b;
}`
  },
  {
    id: "longest-string-chain", t: "Longest String Chain", d: "M", tp: ["dp", "hashing", "sorting", "strings"], pt: ["dp", "hashing"], co: ["Google", "Amazon", "Meta"], lc: "longest-string-chain",
    s: "wordA is a predecessor of wordB if one letter can be inserted into A to get B. Return the longest chain length.", h: ["Sort words by length.", "dp[w] = 1 + max dp[w with one letter removed]."],
    a: "Map DP over sorted words.", tc: "O(n · L²)", sc: "O(n)", sim: ["longest-increasing-subsequence", "longest-word-dictionary"],
    fn: "longestStrChain", params: "words:string[]", ret: "number",
    ex: [[["a", "b", "ba", "bca", "bda", "bdca"], 4], [["xbc", "pcxbcf", "xb", "cxbc", "pcxbc"], 5], [["abcd", "dbqca"], 1]], hid: [[["a"]], [["a", "ab", "ac", "bd", "abc", "abd", "abdd"]]],
    code: `function longestStrChain(words) {
  words.sort((a, b) => a.length - b.length);
  const dp = new Map();
  let best = 0;
  for (const w of words) {
    let cur = 1;
    for (let i = 0; i < w.length; i++) cur = Math.max(cur, (dp.get(w.slice(0, i) + w.slice(i + 1)) || 0) + 1);
    dp.set(w, cur);
    best = Math.max(best, cur);
  }
  return best;
}`
  },
  {
    id: "maximum-sum-circular", t: "Maximum Sum Circular Subarray", d: "M", tp: ["dp", "arrays", "queue"], pt: ["dp"], co: ["Amazon", "Google"], lc: "maximum-sum-circular-subarray",
    s: "Return the maximum sum of a non-empty subarray of a circular array.", h: ["Either the best subarray doesn't wrap (Kadane), or it wraps: total minus the minimum subarray.", "If every number is negative, the wrap case would be empty; return the Kadane max."],
    a: "Kadane for max and min simultaneously.", tc: "O(n)", sc: "O(1)", sim: ["max-subarray", "max-product-subarray", "max-subarray-one-deletion"],
    fn: "maxSubarraySumCircular", params: "nums:number[]", ret: "number",
    ex: [[[1, -2, 3, -2], 3], [[5, -3, 5], 10], [[-3, -2, -3], -2]], hid: [[[7]], [[3, -1, 2, -1]], [[-2, 4, -5, 4, -5, 9, 4]]],
    code: `function maxSubarraySumCircular(nums) {
  let total = 0, curMax = 0, curMin = 0, best = -Infinity, worst = Infinity;
  for (const x of nums) {
    curMax = Math.max(x, curMax + x); best = Math.max(best, curMax);
    curMin = Math.min(x, curMin + x); worst = Math.min(worst, curMin);
    total += x;
  }
  return best < 0 ? best : Math.max(best, total - worst);
}`
  },
  {
    id: "arithmetic-slices", t: "Arithmetic Slices", d: "M", tp: ["dp", "arrays"], pt: ["dp", "sliding-window"], co: ["Amazon", "Baidu"], lc: "arithmetic-slices",
    s: "Count contiguous subarrays of length ≥ 3 with a constant difference.", h: ["dp[i] = number of arithmetic slices ending at i.", "If the last three are arithmetic, dp[i] = dp[i-1] + 1."],
    a: "Running DP counter.", tc: "O(n)", sc: "O(1)", sim: ["count-nice-subarrays", "longest-mountain"],
    fn: "numberOfArithmeticSlices", params: "nums:number[]", ret: "number",
    ex: [[[1, 2, 3, 4], 3], [[1], 0]], hid: [[[1, 2, 3, 8, 9, 10]], [[7, 7, 7, 7, 7]], [[1, 3, 5, 7, 9, 2]]],
    code: `function numberOfArithmeticSlices(nums) {
  let cur = 0, total = 0;
  for (let i = 2; i < nums.length; i++) {
    cur = nums[i] - nums[i - 1] === nums[i - 1] - nums[i - 2] ? cur + 1 : 0;
    total += cur;
  }
  return total;
}`
  },
  {
    id: "dungeon-game", t: "Dungeon Game", d: "H", tp: ["dp", "arrays", "binary-search"], pt: ["dp"], co: ["Google", "Amazon", "Microsoft"], lc: "dungeon-game",
    s: "The knight moves right or down from the top-left to the princess at the bottom-right; health must stay ≥ 1. Return the minimum starting health.", h: ["Working forward doesn't work: you don't know future costs.", "Go backwards: need[r][c] = max(1, min(need right, need down) - dungeon[r][c])."],
    a: "Reverse grid DP.", tc: "O(mn)", sc: "O(n)", sim: ["min-path-sum", "unique-paths-ii"],
    fn: "calculateMinimumHP", params: "dungeon:number[][]", ret: "number",
    ex: [[[[-2, -3, 3], [-5, -10, 1], [10, 30, -5]], 7], [[[0]], 1]], hid: [[[[100]]], [[[1, -3, 3], [0, -2, 0], [-3, -3, -3]]], [[[-5]]]],
    code: `function calculateMinimumHP(dungeon) {
  const R = dungeon.length, C = dungeon[0].length, need = new Array(C + 1).fill(Infinity);
  need[C - 1] = 1;
  for (let r = R - 1; r >= 0; r--) {
    const row = new Array(C + 1).fill(Infinity);
    for (let c = C - 1; c >= 0; c--) {
      const next = r === R - 1 && c === C - 1 ? 1 : Math.min(need[c], row[c + 1]);
      row[c] = Math.max(1, next - dungeon[r][c]);
    }
    need.splice(0, C + 1, ...row);
  }
  return need[0];
}`
  },
  {
    id: "predict-the-winner", t: "Predict the Winner", d: "M", tp: ["dp", "recursion", "math-basics"], pt: ["dp", "recursion"], co: ["Google", "Amazon"], lc: "predict-the-winner",
    s: "Two players alternately take a number from either end of the array, both playing optimally. Does player 1 win (ties count as a win)?", h: ["Track the score difference the current player can force.", "diff(l, r) = max(nums[l] - diff(l+1, r), nums[r] - diff(l, r-1))."],
    a: "Interval DP on score difference.", tc: "O(n²)", sc: "O(n)", sim: ["burst-balloons", "paint-house"],
    fn: "predictTheWinner", params: "nums:number[]", ret: "boolean",
    ex: [[[1, 5, 2], false], [[1, 5, 233, 7], true]], hid: [[[1]], [[1, 1]], [[2, 4, 55, 6, 8]]],
    code: `function predictTheWinner(nums) {
  const n = nums.length, dp = [...nums];
  for (let len = 2; len <= n; len++)
    for (let l = 0; l + len - 1 < n; l++) dp[l] = Math.max(nums[l] - dp[l + 1], nums[l + len - 1] - dp[l]);
  return dp[0] >= 0;
}`
  },
  {
    id: "paint-house", t: "Paint House", d: "M", tp: ["dp", "arrays"], pt: ["dp"], co: ["LinkedIn", "Amazon"], lc: "paint-house",
    s: "costs[i][c] is the cost of painting house i with color c (3 colors). No two adjacent houses share a color. Return the minimum cost.", h: ["Track the best total ending in each color.", "new[c] = cost[c] + min of the other two previous totals."],
    a: "Three-state DP.", tc: "O(n)", sc: "O(1)", sim: ["house-robber", "min-path-sum"],
    fn: "minCost", params: "costs:number[][]", ret: "number",
    ex: [[[[17, 2, 17], [16, 16, 5], [14, 3, 19]], 10], [[[7, 6, 2]], 2]], hid: [[[[1, 2, 3], [1, 2, 3]]], [[[5, 8, 6], [19, 14, 13], [7, 5, 12], [14, 15, 17], [3, 20, 10]]]],
    code: `function minCost(costs) {
  let [a, b, c] = [0, 0, 0];
  for (const [x, y, z] of costs) [a, b, c] = [x + Math.min(b, c), y + Math.min(a, c), z + Math.min(a, b)];
  return Math.min(a, b, c);
}`
  }
];
