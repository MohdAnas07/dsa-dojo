import type { Statement } from "./types";

/** Dynamic programming, part 1: 1D, knapsack and grid problems. */
export const DP_STATEMENTS_1: Record<string, Statement> = {
  "min-cost-climbing-stairs": {
    body: [
      "You are given an integer array `cost` where cost[i] is the cost of the i-th step on a staircase. Once you pay the cost, you can climb either one or two steps.",
      "You can start from the step with index 0 or the step with index 1. Return the minimum cost to reach the top of the floor, which is one step past the last index."
    ],
    why: [
      "Start on step 1, pay 15 and climb two steps to the top.",
      "Start on step 0 and step only on the 1s (indices 0, 2, 4, 6, 7, 9): total 6."
    ],
    walk: [
      "best[i] = the cheapest way to stand on step i = cost[i] + min(best[i − 1], best[i − 2]).",
      "best[0] = 10, best[1] = 15.",
      "best[2] = 20 + min(15, 10) = 30.",
      "The top can be reached from step 1 or step 2: min(15, 30) = 15."
    ],
    cons: ["2 ≤ cost.length ≤ 1000", "0 ≤ cost[i] ≤ 999"]
  },
  "house-robber-ii": {
    body: [
      "You are a robber planning to rob houses along a street. All houses are arranged in a circle, so the first house is the neighbour of the last one. `nums[i]` is the money in house i.",
      "Adjacent houses have connected security systems: robbing two adjacent houses on the same night alerts the police. Return the maximum amount of money you can rob tonight without alerting the police."
    ],
    why: [
      "Houses 0 and 2 are both worth 2, but they are neighbours in the circle. Rob house 1 (3) instead.",
      "Rob houses 0 and 2: 1 + 3 = 4.",
      "Rob house 2: 3."
    ],
    walk: [
      "The first and last houses can't both be robbed, so solve two straight-line problems and take the better one.",
      "Without the last house, [2, 3] → best 3.",
      "Without the first house, [3, 2] → best 3.",
      "The answer is max(3, 3) = 3."
    ],
    cons: ["1 ≤ nums.length ≤ 100", "0 ≤ nums[i] ≤ 1000"]
  },
  "decode-ways": {
    body: [
      "A message of letters A–Z is encoded as numbers using 'A' → 1, 'B' → 2, …, 'Z' → 26. Given a string `s` of digits, return the number of ways to decode it.",
      "A '0' can only be part of '10' or '20'; codes like '06' are invalid because they have a leading zero."
    ],
    why: [
      "'12' is 'AB' (1, 2) or 'L' (12).",
      "'226' is 'BZ' (2, 26), 'VF' (22, 6) or 'BBF' (2, 2, 6).",
      "'06' can't be decoded: 0 maps to no letter, and '06' is not a valid code."
    ],
    walk: [
      "ways[i] = the number of ways to decode the first i digits. ways[0] = 1 (the empty prefix).",
      "i = 1: '1' is a valid single digit → ways[1] = ways[0] = 1.",
      "i = 2: '2' alone is valid → + ways[1] = 1. '12' as a pair is valid → + ways[0] = 1.",
      "ways[2] = 2."
    ],
    cons: ["1 ≤ s.length ≤ 100", "`s` contains only digits and may contain leading zeros."]
  },
  "longest-increasing-subsequence": {
    body: [
      "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
      "A subsequence keeps the original order but can skip elements, so [3, 6, 2, 7] is a subsequence of [0, 3, 1, 6, 2, 2, 7]. Can you do it in O(n log n)?"
    ],
    why: [
      "One longest increasing subsequence is [2, 3, 7, 101] (also [2, 5, 7, 18]).",
      "[0, 1, 2, 3].",
      "All values are equal, and 'strictly increasing' doesn't allow equal neighbours."
    ],
    walk: [
      "Keep `tails`: tails[i] is the smallest possible last value of an increasing subsequence of length i + 1. Each value either extends tails or replaces the first entry ≥ it (found by binary search).",
      "10 → [10]. 9 replaces 10 → [9]. 2 → [2]. 5 → [2, 5]. 3 replaces 5 → [2, 3].",
      "7 → [2, 3, 7]. 101 → [2, 3, 7, 101]. 18 replaces 101 → [2, 3, 7, 18].",
      "tails has length 4, so the answer is 4."
    ],
    cons: ["1 ≤ nums.length ≤ 2500", "-10⁴ ≤ nums[i] ≤ 10⁴"]
  },
  "number-of-lis": {
    body: [
      "Given an integer array `nums`, return the number of longest strictly increasing subsequences.",
      "Two subsequences are different if they use different positions, even if their values look the same."
    ],
    why: [
      "The longest length is 4, reached by [1, 3, 4, 7] and [1, 3, 5, 7].",
      "The longest length is 1, and each of the five 2s is one such subsequence."
    ],
    walk: [
      "For each index, store the length of the longest subsequence ending there and how many such subsequences exist.",
      "1 → (1, 1). 3 → (2, 1). 5 → (3, 1).",
      "4 extends 1 → 3, giving (3, 1).",
      "7 extends both 5 and 4, each with length 3 → (4, 1 + 1) = (4, 2).",
      "The longest length is 4, with 2 subsequences."
    ],
    cons: ["1 ≤ nums.length ≤ 2000", "-10⁶ ≤ nums[i] ≤ 10⁶", "The answer fits in a 32-bit integer."]
  },
  "russian-doll-envelopes": {
    body: [
      "You are given a 2D array of integers `envelopes` where envelopes[i] = [wᵢ, hᵢ] is the width and height of an envelope.",
      "One envelope can fit into another if and only if both its width and height are strictly smaller. Return the maximum number of envelopes you can put one inside the other. You cannot rotate an envelope."
    ],
    why: [
      "[2,3] fits in [5,4], which fits in [6,7]: 3 envelopes.",
      "Identical envelopes can't fit inside each other."
    ],
    walk: [
      "Sort by width ascending, and by height descending when widths tie (so two envelopes of the same width can't both be picked).",
      "Sorted: [2,3], [5,4], [6,7], [6,4]. Now find the longest strictly increasing subsequence of the heights 3, 4, 7, 4.",
      "tails: [3] → [3, 4] → [3, 4, 7] → 4 replaces 4 → [3, 4, 7].",
      "Length 3."
    ],
    cons: ["1 ≤ envelopes.length ≤ 10⁵", "envelopes[i].length == 2", "1 ≤ wᵢ, hᵢ ≤ 10⁵"]
  },
  "maximum-length-pair-chain": {
    body: [
      "You are given an array of n pairs where pairs[i] = [leftᵢ, rightᵢ] and leftᵢ < rightᵢ. A pair p2 = [c, d] follows a pair p1 = [a, b] if b < c.",
      "A chain of pairs can be formed in this fashion. Return the length of the longest chain. You don't have to use all the pairs, and you can pick them in any order."
    ],
    why: [
      "[1,2] → [3,4]. [2,3] can't follow [1,2] because 2 < 2 is false.",
      "[1,2] → [4,5] → [7,8]."
    ],
    walk: [
      "Sort by right end and greedily take every pair that starts after the last chosen end.",
      "Sorted: [1,2], [2,3], [3,4]. Take [1,2] → end 2.",
      "[2,3] starts at 2, which is not > 2. Skip.",
      "[3,4] starts at 3 > 2. Take it. Length 2."
    ],
    cons: ["n == pairs.length", "1 ≤ n ≤ 1000", "-1000 ≤ leftᵢ < rightᵢ ≤ 1000"]
  },
  "word-break": {
    body: [
      "Given a string `s` and a dictionary of strings `wordDict`, return `true` if s can be segmented into a space-separated sequence of one or more dictionary words.",
      "The same word in the dictionary may be reused multiple times in the segmentation."
    ],
    why: [
      "'leetcode' = 'leet' + 'code'.",
      "'applepenapple' = 'apple' + 'pen' + 'apple'; 'apple' is reused.",
      "'cats' + 'and' leaves 'og', and 'cat' + 'sand' also leaves 'og'. No split works."
    ],
    walk: [
      "ok[i] = whether the first i characters can be split into words. ok[0] = true.",
      "ok[4]: ok[0] is true and s[0..4) = 'leet' is a word → true.",
      "ok[8]: ok[4] is true and s[4..8) = 'code' is a word → true.",
      "ok[8] covers the whole string: return true."
    ],
    cons: ["1 ≤ s.length ≤ 300", "1 ≤ wordDict.length ≤ 1000", "1 ≤ wordDict[i].length ≤ 20", "All strings are lowercase; dictionary words are unique."]
  },
  "coin-change-ii": {
    body: [
      "You are given an integer array `coins` representing coins of different denominations and an integer `amount`. You have an infinite number of each kind of coin.",
      "Return the number of combinations that make up that amount. If no combination works, return 0. The order of coins doesn't matter: 1 + 2 and 2 + 1 are the same combination."
    ],
    why: [
      "5 = 5 = 2 + 2 + 1 = 2 + 1 + 1 + 1 = 1 + 1 + 1 + 1 + 1.",
      "Only 2s can't make 3.",
      "One coin of 10."
    ],
    walk: [
      "ways[a] = combinations that make amount a. ways[0] = 1. Process one coin type at a time, so each combination is counted in only one order.",
      "Coin 1: every amount 0–5 has 1 way.",
      "Coin 2: ways[2] = 2, ways[3] = 2, ways[4] = 3, ways[5] = 3.",
      "Coin 5: ways[5] += ways[0] → 4."
    ],
    cons: ["1 ≤ coins.length ≤ 300", "1 ≤ coins[i] ≤ 5000", "All coin values are unique.", "0 ≤ amount ≤ 5000"]
  },
  "combination-sum-iv": {
    body: [
      "Given an array of distinct integers `nums` and a target integer `target`, return the number of possible combinations that add up to target.",
      "Different orders count as different combinations here, so (1, 2) and (2, 1) are counted separately. The answer fits in a 32-bit integer."
    ],
    why: [
      "(1,1,1,1), (1,1,2), (1,2,1), (1,3), (2,1,1), (2,2), (3,1): 7 sequences.",
      "9 is bigger than 3."
    ],
    walk: [
      "ways[t] = the number of sequences that sum to t = the sum of ways[t − x] over the numbers x (x is the last number).",
      "ways[0] = 1. ways[1] = ways[0] = 1.",
      "ways[2] = ways[1] + ways[0] = 2. ways[3] = ways[2] + ways[1] + ways[0] = 4.",
      "ways[4] = ways[3] + ways[2] + ways[1] = 4 + 2 + 1 = 7."
    ],
    cons: ["1 ≤ nums.length ≤ 200", "1 ≤ nums[i] ≤ 1000", "All elements of `nums` are unique.", "1 ≤ target ≤ 1000"]
  },
  "partition-equal-subset": {
    body: [
      "Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal, or `false` otherwise.",
      "Every element must go into exactly one of the two subsets."
    ],
    why: [
      "[1, 5, 5] and [11] both sum to 11.",
      "The total is 11, which is odd, so it can't be split evenly."
    ],
    walk: [
      "The total is 22, so we need a subset that sums to 11.",
      "Track every reachable sum: start {0}.",
      "Add 1 → {0, 1}. Add 5 → {0, 1, 5, 6}.",
      "Add 11 → 11 becomes reachable. Return true."
    ],
    cons: ["1 ≤ nums.length ≤ 200", "1 ≤ nums[i] ≤ 100"]
  },
  "target-sum": {
    body: [
      "You are given an integer array `nums` and an integer `target`. Build an expression by adding '+' or '−' before each integer in nums and then concatenating all of them.",
      "Return the number of different expressions that evaluate to target."
    ],
    why: [
      "Put '−' in front of exactly one of the five 1s: −1+1+1+1+1, +1−1+1+1+1, and so on. That is 5 ways.",
      "+1 = 1."
    ],
    walk: [
      "Let P be the sum of the numbers with '+' and N the sum with '−'. P − N = 3 and P + N = 5, so P = 4.",
      "So count the subsets of [1, 1, 1, 1, 1] that sum to 4.",
      "Choose which 4 of the 5 ones are positive: C(5, 4) = 5.",
      "The answer is 5."
    ],
    cons: ["1 ≤ nums.length ≤ 20", "0 ≤ nums[i] ≤ 1000", "0 ≤ sum(nums[i]) ≤ 1000", "-1000 ≤ target ≤ 1000"]
  },
  "last-stone-weight-ii": {
    body: [
      "You are given an array of integers `stones` where stones[i] is the weight of the i-th stone. On each turn, choose any two stones x ≤ y and smash them: if x == y both are destroyed, otherwise only y − x remains.",
      "At the end there is at most one stone left. Return the smallest possible weight of the left stone, or 0 if there are no stones left."
    ],
    why: [
      "Smashing in a good order leaves a stone of weight 1.",
      "The best order leaves 5."
    ],
    walk: [
      "Every smash order splits the stones into two groups whose difference is what remains. So make the two groups' sums as close as possible.",
      "The total is 23. Find the largest reachable subset sum ≤ 11.",
      "11 is reachable: 2 + 8 + 1 = 11.",
      "The remainder is 23 − 2 × 11 = 1."
    ],
    cons: ["1 ≤ stones.length ≤ 30", "1 ≤ stones[i] ≤ 100"]
  },
  "knapsack-01": {
    body: [
      "You are given n items, where item i has weight weights[i] and value values[i], and a knapsack that can carry at most `capacity` weight.",
      "Choose items so their total weight is at most capacity and their total value is as large as possible. Each item can be taken at most once. Return the maximum value. (This is the classic 0/1 knapsack interview problem, not a LeetCode problem.)"
    ],
    why: [
      "Take the items of weight 3 and 4: weight 7, value 4 + 5 = 9.",
      "The only item weighs 5, more than the capacity of 4."
    ],
    walk: [
      "best[c] = the best value with capacity c. For each item, update capacities from high to low, so the item is used at most once.",
      "Item (1, 1): best[1..7] = 1.",
      "Item (3, 4): best[3] = 4, best[4..7] = 5.",
      "Item (4, 5): best[4] = 5, best[5] = 6, best[7] = best[3] + 5 = 9.",
      "Item (5, 7) can't beat 9 at capacity 7 (best[2] + 7 = 8). The answer is 9."
    ],
    cons: ["1 ≤ n ≤ 100", "weights.length == values.length == n", "1 ≤ weights[i], values[i] ≤ 1000", "0 ≤ capacity ≤ 1000"]
  },
  "rod-cutting": {
    body: [
      "You are given a rod of length `n` and an array `prices`, where prices[i] is the price of a piece of length i + 1.",
      "Cut the rod into pieces (or leave it whole) to maximize the total price of the pieces, and return that maximum. Pieces of the same length can be used any number of times. (This is a classic dynamic programming problem.)"
    ],
    why: [
      "Cut into lengths 2 and 6: 5 + 17 = 22.",
      "Here a length-1 piece is worth 3, so eight pieces of length 1 give 24."
    ],
    walk: [
      "best[i] = max over the first piece's length j of prices[j − 1] + best[i − j].",
      "best[1] = 1, best[2] = 5, best[3] = 8, best[4] = 10 (2 + 2).",
      "best[5] = 13 (2 + 3), best[6] = 17, best[7] = 18.",
      "best[8] = max(20, 5 + best[6] = 22, …) = 22."
    ],
    cons: ["1 ≤ n ≤ prices.length ≤ 1000", "1 ≤ prices[i] ≤ 10⁵"]
  },
  "integer-break": {
    body: [
      "Given an integer `n`, break it into the sum of k positive integers, where k ≥ 2, and maximize the product of those integers.",
      "Return the maximum product you can get."
    ],
    why: [
      "2 = 1 + 1, and 1 × 1 = 1.",
      "10 = 3 + 3 + 4, and 3 × 3 × 4 = 36."
    ],
    walk: [
      "best[i] = max over the first part j of j × max(i − j, best[i − j]) (the rest can stay whole or be broken further).",
      "best[2] = 1, best[3] = 2, best[4] = 4, best[5] = 6, best[6] = 9.",
      "Continuing: best[7] = 12, best[8] = 18, best[9] = 27.",
      "best[10] = 36 (3 × 3 × 4). Using as many 3s as possible is always best."
    ],
    cons: ["2 ≤ n ≤ 58"]
  },
  "perfect-squares": {
    body: [
      "Given an integer `n`, return the least number of perfect square numbers that sum to n.",
      "A perfect square is an integer that is the square of an integer: 1, 4, 9, 16, … The same square can be used more than once."
    ],
    why: [
      "12 = 4 + 4 + 4.",
      "13 = 4 + 9."
    ],
    walk: [
      "fewest[i] = 1 + min(fewest[i − s]) over squares s ≤ i. fewest[0] = 0.",
      "fewest[3] = 3 (1 + 1 + 1), fewest[8] = 2 (4 + 4), fewest[11] = 3 (9 + 1 + 1).",
      "fewest[12] = 1 + min(fewest[11], fewest[8], fewest[3]) = 1 + 2 = 3.",
      "The answer is 3."
    ],
    cons: ["1 ≤ n ≤ 10⁴"]
  },
  "unique-paths": {
    body: [
      "There is a robot on an m × n grid. The robot starts in the top-left corner and tries to move to the bottom-right corner. It can only move either down or right at any point in time.",
      "Given the two integers `m` and `n`, return the number of possible unique paths the robot can take to reach the bottom-right corner."
    ],
    why: [
      "A 3 × 7 grid has 28 paths.",
      "Right → down → down, down → down → right, or down → right → down."
    ],
    walk: [
      "Each cell's path count = the count from above + the count from the left. The first row and column are all 1.",
      "Row 0: 1, 1, 1, 1, 1, 1, 1.",
      "Row 1: 1, 2, 3, 4, 5, 6, 7.",
      "Row 2: 1, 3, 6, 10, 15, 21, 28. The bottom-right cell holds 28."
    ],
    cons: ["1 ≤ m, n ≤ 100", "The answer is at most 2 · 10⁹."]
  },
  "unique-paths-ii": {
    body: [
      "You are given an m × n integer array `obstacleGrid`. A robot starts in the top-left corner and wants to reach the bottom-right corner, moving only down or right.",
      "An obstacle is marked 1 and an empty space 0. A path cannot go through an obstacle. Return the number of possible unique paths."
    ],
    why: [
      "The obstacle in the middle leaves two paths: around the top-right and around the bottom-left.",
      "The obstacle blocks the top-right route, leaving down → right."
    ],
    walk: [
      "Same as Unique Paths, but an obstacle cell has 0 paths.",
      "Row 0: 1, 1, 1.",
      "Row 1: 1, 0 (obstacle), 0 + 1 = 1.",
      "Row 2: 1, 1 + 0 = 1, 1 + 1 = 2. The answer is 2."
    ],
    cons: ["m == obstacleGrid.length", "n == obstacleGrid[i].length", "1 ≤ m, n ≤ 100", "obstacleGrid[i][j] is 0 or 1."]
  },
  "min-path-sum": {
    body: [
      "Given an m × n `grid` filled with non-negative numbers, find a path from the top-left to the bottom-right that minimizes the sum of all numbers along its path.",
      "You can only move either down or right at any point in time."
    ],
    why: [
      "1 → 3 → 1 → 1 → 1 sums to 7.",
      "1 → 2 → 3 → 6 sums to 12."
    ],
    walk: [
      "best[cell] = the cell's value + min(best above, best to the left).",
      "Row 0: 1, 4, 5.",
      "Row 1: 2, 2 + 5 = 7, min(5, 7) + 1 = 6.",
      "Row 2: 6, min(7, 6) + 2 = 8, min(6, 8) + 1 = 7. The answer is 7."
    ],
    cons: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 200", "0 ≤ grid[i][j] ≤ 200"]
  },
  "triangle": {
    body: [
      "Given a `triangle` array, return the minimum path sum from top to bottom.",
      "For each step, you may move to an adjacent number of the row below: from index i in one row, you may go to index i or i + 1 in the next row."
    ],
    why: [
      "2 → 3 → 5 → 1 sums to 11.",
      "A single number."
    ],
    walk: [
      "Work bottom-up: each number adds the smaller of the two numbers below it.",
      "Bottom row: [4, 1, 8, 3].",
      "Row 2: 6 + min(4, 1) = 7, 5 + min(1, 8) = 6, 7 + min(8, 3) = 10 → [7, 6, 10].",
      "Row 1: 3 + min(7, 6) = 9, 4 + min(6, 10) = 10. Row 0: 2 + min(9, 10) = 11."
    ],
    cons: ["1 ≤ triangle.length ≤ 200", "triangle[0].length == 1", "triangle[i].length == triangle[i − 1].length + 1", "-10⁴ ≤ triangle[i][j] ≤ 10⁴"]
  },
  "minimum-falling-path": {
    body: [
      "Given an n × n array of integers `matrix`, return the minimum sum of any falling path through matrix.",
      "A falling path starts at any element in the first row and chooses the element in the next row that is either directly below or diagonally left/right."
    ],
    why: [
      "1 → 5 → 7 (or 1 → 4 → 8) sums to 13.",
      "−19 → −40 sums to −59."
    ],
    walk: [
      "best[row][col] = matrix value + the smallest of the up to three cells above it.",
      "Row 0: [2, 1, 3].",
      "Row 1: 6 + min(2, 1) = 7, 5 + min(2, 1, 3) = 6, 4 + min(1, 3) = 5 → [7, 6, 5].",
      "Row 2: 7 + min(7, 6) = 13, 8 + min(7, 6, 5) = 13, 9 + min(6, 5) = 14. The minimum is 13."
    ],
    cons: ["n == matrix.length == matrix[i].length", "1 ≤ n ≤ 100", "-100 ≤ matrix[i][j] ≤ 100"]
  },
  "maximal-square": {
    body: [
      "Given an m × n binary `matrix` filled with '0's and '1's, find the largest square containing only '1's and return its area."
    ],
    why: [
      "There is a 2 × 2 square of '1's (rows 1–2, columns 2–3), so the area is 4.",
      "No two '1's form a square bigger than 1 × 1.",
      "There are no '1's."
    ],
    walk: [
      "side[i][j] = the biggest square whose bottom-right corner is (i, j) = 1 + min(top, left, top-left), if the cell is '1'.",
      "Row 1: columns 2–4 are '1' → sides 1, 1, 1.",
      "Row 2, column 3: 1 + min(1, 1, 1) = 2. Column 4: 1 + min(1, 2, 1) = 2.",
      "The biggest side is 2, so the area is 4."
    ],
    cons: ["m == matrix.length", "n == matrix[i].length", "1 ≤ m, n ≤ 300", "matrix[i][j] is '0' or '1'."]
  },
  "count-square-submatrices": {
    body: [
      "Given an m × n `matrix` of ones and zeros, return how many square submatrices have all ones.",
      "Squares of every size count: each single 1 is a 1 × 1 square, and so on."
    ],
    why: [
      "10 squares of side 1, 4 of side 2 and 1 of side 3: 15.",
      "6 squares of side 1 and 1 of side 2: 7."
    ],
    walk: [
      "side[i][j] (as in Maximal Square) is also the number of squares with their bottom-right corner at (i, j). Add them all up.",
      "Row 0: [0, 1, 1, 1] → sum 3.",
      "Row 1: [1, 1, 2, 2] → sum 6.",
      "Row 2: [0, 1, 2, 3] → sum 6. Total 15."
    ],
    cons: ["1 ≤ arr.length ≤ 300", "1 ≤ arr[0].length ≤ 300", "Each value is 0 or 1."]
  }
};
