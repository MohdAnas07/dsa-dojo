import type { Statement } from "./types";

/** Dynamic programming, part 2: strings, stock states, intervals and more. */
export const DP_STATEMENTS_2: Record<string, Statement> = {
  "longest-common-subsequence": {
    body: [
      "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
      "A subsequence keeps the original order but may skip characters: 'ace' is a subsequence of 'abcde'. A common subsequence is a subsequence of both strings."
    ],
    why: [
      "'ace' appears in both, in order.",
      "The strings are identical.",
      "They share no characters."
    ],
    walk: [
      "dp[i][j] = the LCS of the first i characters of text1 and the first j of text2. If the characters match, it is dp[i−1][j−1] + 1; otherwise max(dp[i−1][j], dp[i][j−1]).",
      "'a' = 'a' → 1.",
      "'c' (text1[2]) = 'c' (text2[1]) → 2.",
      "'e' (text1[4]) = 'e' (text2[2]) → 3. The answer is 3."
    ],
    cons: ["1 ≤ text1.length, text2.length ≤ 1000", "Both strings consist of only lowercase English characters."]
  },
  "uncrossed-lines": {
    body: [
      "You are given two integer arrays `nums1` and `nums2`, written on two horizontal lines in the given order.",
      "You may draw a straight line connecting nums1[i] and nums2[j] if they are equal, as long as the line doesn't cross another line or share an endpoint with one. Return the maximum number of connecting lines."
    ],
    why: [
      "Connect the 1s and the 4s (or the 1s and the 2s). Connecting both 4 and 2 would make the lines cross.",
      "Three lines can be drawn without crossing.",
      "Two lines can be drawn without crossing."
    ],
    walk: [
      "Lines that don't cross match elements in the same order in both arrays, which is exactly a longest common subsequence.",
      "LCS of [1, 4, 2] and [1, 2, 4]: [1, 4] or [1, 2].",
      "Both have length 2.",
      "The answer is 2."
    ],
    cons: ["1 ≤ nums1.length, nums2.length ≤ 500", "1 ≤ nums1[i], nums2[j] ≤ 2000"]
  },
  "max-length-repeated-subarray": {
    body: [
      "Given two integer arrays `nums1` and `nums2`, return the maximum length of a subarray that appears in both arrays.",
      "A subarray is contiguous, unlike a subsequence."
    ],
    why: [
      "[3, 2, 1] appears in both arrays.",
      "The whole array is shared."
    ],
    walk: [
      "dp[i][j] = the length of the common run ending at nums1[i] and nums2[j] = dp[i−1][j−1] + 1 if they are equal, else 0.",
      "nums1[2] = 3 and nums2[0] = 3 → 1.",
      "nums1[3] = 2 and nums2[1] = 2 → 2.",
      "nums1[4] = 1 and nums2[2] = 1 → 3. The longest is 3."
    ],
    cons: ["1 ≤ nums1.length, nums2.length ≤ 1000", "0 ≤ nums1[i], nums2[i] ≤ 100"]
  },
  "edit-distance": {
    body: [
      "Given two strings `word1` and `word2`, return the minimum number of operations required to convert word1 to word2.",
      "You have three operations on a single character: insert it, delete it, or replace it."
    ],
    why: [
      "horse → rorse (replace 'h' with 'r') → rose (delete 'r') → ros (delete 'e').",
      "intention → inention (delete 't') → enention (replace 'i' with 'e') → exention (replace 'n' with 'x') → exection (replace 'n' with 'c') → execution (insert 'u')."
    ],
    walk: [
      "dp[i][j] = the edits to turn the first i letters of word1 into the first j letters of word2. If the letters match, take dp[i−1][j−1]; otherwise 1 + min(replace, delete, insert).",
      "Turning '' into 'ros' takes 3 inserts; turning 'horse' into '' takes 5 deletes. Those are the borders.",
      "'h' vs 'r' differ → replace. 'o' matches 'o' for free.",
      "'r', 's', 'e' against the remaining 's' cost one more delete each where they don't match.",
      "The table ends with dp[5][3] = 3."
    ],
    cons: ["0 ≤ word1.length, word2.length ≤ 500", "Both words consist of lowercase English letters."]
  },
  "delete-operation-two-strings": {
    body: [
      "Given two strings `word1` and `word2`, return the minimum number of steps required to make word1 and word2 the same.",
      "In one step, you can delete exactly one character in either string."
    ],
    why: [
      "Delete 's' from 'sea' and 't' from 'eat'; both become 'ea'.",
      "Keep the shared 'etco' and delete the other 4 letters."
    ],
    walk: [
      "Whatever survives is a common subsequence, so keep the longest one.",
      "The LCS of 'sea' and 'eat' is 'ea' (length 2).",
      "Deletions = (3 − 2) + (3 − 2).",
      "The answer is 2."
    ],
    cons: ["1 ≤ word1.length, word2.length ≤ 500", "Both words consist of only lowercase English letters."]
  },
  "longest-palindromic-substring": {
    body: [
      "Given a string `s`, return the longest palindromic substring in s.",
      "A substring is contiguous, and a palindrome reads the same forward and backward. If several substrings share the maximum length, any of them is accepted."
    ],
    why: [
      "'bab' is a longest palindrome; 'aba' is also accepted.",
      "'bb' is the longest palindrome."
    ],
    walk: [
      "Every palindrome has a centre (a letter, or the gap between two letters). Expand from each centre while both ends match.",
      "Centre 'b' (index 0): just 'b'.",
      "Centre 'a' (index 1): 'b' = 'b' → 'bab' (length 3). The next pair is out of range.",
      "Centre 'b' (index 2): 'aba' (length 3). No centre gives more than 3.",
      "Return 'bab'."
    ],
    cons: ["1 ≤ s.length ≤ 1000", "`s` consists of digits and English letters."]
  },
  "palindromic-substrings": {
    body: [
      "Given a string `s`, return the number of palindromic substrings in it.",
      "A substring is a contiguous sequence of characters. Substrings at different positions count separately, even if they contain the same characters."
    ],
    why: [
      "'a', 'b' and 'c'.",
      "'a', 'a', 'a', 'aa', 'aa' and 'aaa'."
    ],
    walk: [
      "Expand from all 2n − 1 centres and count every palindrome found.",
      "The centres at the letters give 'a', 'b', 'c' (3).",
      "The centres between letters: 'ab' and 'bc' aren't palindromes.",
      "Total 3."
    ],
    cons: ["1 ≤ s.length ≤ 1000", "`s` consists of lowercase English letters."]
  },
  "longest-palindromic-subsequence": {
    body: [
      "Given a string `s`, find the longest palindromic subsequence's length in s.",
      "A subsequence keeps the order of characters but may skip some."
    ],
    why: [
      "'bbbb' (skipping the 'a') is a palindrome of length 4.",
      "'bb'."
    ],
    walk: [
      "A palindromic subsequence reads the same in s and in reverse(s), so the answer is LCS(s, reverse(s)).",
      "reverse('bbbab') = 'babbb'.",
      "Their LCS is 'bbbb'.",
      "The answer is 4."
    ],
    cons: ["1 ≤ s.length ≤ 1000", "`s` consists only of lowercase English letters."]
  },
  "min-insertions-palindrome": {
    body: [
      "Given a string `s`, in one step you can insert any character at any index of the string.",
      "Return the minimum number of steps to make s a palindrome."
    ],
    why: [
      "'zzazz' is already a palindrome.",
      "Insert 2 letters, for example 'mbdadbm' or 'mdbabdm'.",
      "Insert 5 letters, for example 'leetcodocteel'."
    ],
    walk: [
      "Keep the longest palindromic subsequence and add a mirror partner for every other letter.",
      "The longest palindromic subsequence of 'mbadm' has length 3 (for example 'mam').",
      "Letters without a partner: 5 − 3 = 2.",
      "The answer is 2."
    ],
    cons: ["1 ≤ s.length ≤ 500", "`s` consists of lowercase English letters."]
  },
  "distinct-subsequences": {
    body: [
      "Given two strings `s` and `t`, return the number of distinct subsequences of s which equal t.",
      "Two subsequences are different if they use different positions in s. The answer fits in a 32-bit signed integer."
    ],
    why: [
      "'rabbbit' has three 'b's and 'rabbit' needs two, so there are 3 ways to choose which 'b' to skip.",
      "There are 5 different ways to pick 'b', 'a', 'g' in order from 'babgbag'."
    ],
    walk: [
      "dp[j] = the number of ways to form the first j characters of t from the part of s read so far. dp[0] = 1.",
      "Read s one letter at a time, updating j from the end so each letter is used once per way.",
      "The first 'r', 'a' build 'ra' (1 way). Each 'b' adds ways to form 'rab' and 'rabb': after three 'b's there are 3 ways to form 'rabb'.",
      "'i' and 't' extend those 3 ways to 'rabbit'. The answer is 3."
    ],
    cons: ["1 ≤ s.length, t.length ≤ 1000", "`s` and `t` consist of English letters."]
  },
  "interleaving-string": {
    body: [
      "Given strings `s1`, `s2` and `s3`, find whether s3 is formed by an interleaving of s1 and s2.",
      "An interleaving splits s1 and s2 into pieces and alternates them, keeping the letters of each string in their original order. Every letter of s1 and s2 is used exactly once."
    ],
    why: [
      "s3 = 'aa' (from s1) + 'dbbc' (s2) + 'bc' (s1) + 'a' (s2) + 'c' (s1).",
      "No interleaving produces this string.",
      "Two empty strings interleave into an empty string."
    ],
    walk: [
      "dp[i][j] = whether the first i letters of s1 and the first j letters of s2 can form the first i + j letters of s3.",
      "Take 'a', 'a' from s1 (s3 starts 'aa').",
      "s3 continues 'dbbc': take those from s2.",
      "Then 'bc' from s1, 'a' from s2 and 'c' from s1. Everything is used, so return true."
    ],
    cons: ["0 ≤ s1.length, s2.length ≤ 100", "0 ≤ s3.length ≤ 200", "All strings consist of lowercase English letters."]
  },
  "regex-matching": {
    body: [
      "Given an input string `s` and a pattern `p`, implement regular expression matching with support for '.' and '*'. '.' matches any single character, and '*' matches zero or more of the element right before it.",
      "The match must cover the entire input string, not just part of it."
    ],
    why: [
      "'a' matches only one character, but s has two.",
      "'a*' means zero or more 'a's, so it matches 'aa'.",
      "'.*' means zero or more of any character, so it matches anything."
    ],
    walk: [
      "match(i, j) asks: does s from index i match p from index j?",
      "s[0] = 'a' and p[0] = 'a' match. Move on to match(1, 1).",
      "The pattern is finished, but s still has an 'a' left.",
      "Return false."
    ],
    cons: ["1 ≤ s.length ≤ 20", "1 ≤ p.length ≤ 20", "`s` contains only lowercase letters; `p` contains lowercase letters, '.' and '*'.", "Each '*' has a valid character before it."]
  },
  "wildcard-matching": {
    body: [
      "Given an input string `s` and a pattern `p`, implement wildcard pattern matching with support for '?' and '*'. '?' matches any single character, and '*' matches any sequence of characters (including the empty sequence).",
      "The match must cover the entire input string."
    ],
    why: [
      "'a' matches only one character.",
      "'*' matches any sequence.",
      "'?' matches 'c', but 'a' does not match 'b'.",
      "The first '*' matches nothing, 'a' matches 'a', the second '*' matches 'dce', and 'b' matches 'b'."
    ],
    walk: [
      "dp[i][j] = whether the first i characters of s match the first j of p.",
      "'a' matches 'a'.",
      "The pattern is used up, but s has another 'a'.",
      "Return false."
    ],
    cons: ["0 ≤ s.length, p.length ≤ 2000", "`s` contains only lowercase letters; `p` contains lowercase letters, '?' and '*'."]
  },
  "best-time-cooldown": {
    body: [
      "You are given an array `prices` where prices[i] is the price of a given stock on day i. You may complete as many transactions as you like (buy one and sell one share, multiple times).",
      "After you sell your stock, you cannot buy on the next day (a one-day cooldown). You may not hold more than one share at a time. Return the maximum profit."
    ],
    why: [
      "Buy at 1, sell at 2, cool down, buy at 0, sell at 2: 1 + 2 = 3.",
      "With one day there is nothing to sell."
    ],
    walk: [
      "Track three states each day: `hold` (own a share), `sold` (just sold today) and `rest` (no share, free to buy).",
      "Day 0 (1): hold = −1, sold = −∞, rest = 0. Day 1 (2): sold = −1 + 2 = 1.",
      "Day 2 (3): sold = −1 + 3 = 2, rest = 1.",
      "Day 3 (0): hold = max(−1, rest 1 − 0) = 1 (buy at 0 after cooling down), rest = 2.",
      "Day 4 (2): sold = 1 + 2 = 3. The answer is max(sold, rest) = 3."
    ],
    cons: ["1 ≤ prices.length ≤ 5000", "0 ≤ prices[i] ≤ 1000"]
  },
  "best-time-fee": {
    body: [
      "You are given an array `prices` where prices[i] is the price of a given stock on day i, and an integer `fee` representing a transaction fee.",
      "Find the maximum profit you can achieve. You may complete as many transactions as you like, but you pay the fee once for each transaction (each buy-and-sell). You may not hold more than one share at a time."
    ],
    why: [
      "Buy at 1, sell at 8 (7 − 2 = 5), buy at 4, sell at 9 (5 − 2 = 3): 8.",
      "One transaction, buy at 1 and sell at 10: 9 − 3 = 6. Trading more often only adds fees."
    ],
    walk: [
      "Track `cash` (best profit holding nothing) and `hold` (best profit holding a share).",
      "Day 0 (1): hold = −1, cash = 0.",
      "Days 1–2 (3, 2): selling would earn 0 or less after the fee, so nothing changes.",
      "Day 3 (8): cash = −1 + 8 − 2 = 5. Day 4 (4): hold = 5 − 4 = 1.",
      "Day 5 (9): cash = 1 + 9 − 2 = 8."
    ],
    cons: ["1 ≤ prices.length ≤ 5 · 10⁴", "1 ≤ prices[i] < 5 · 10⁴", "0 ≤ fee < 5 · 10⁴"]
  },
  "best-time-iii": {
    body: [
      "You are given an array `prices` where prices[i] is the price of a given stock on day i.",
      "Find the maximum profit you can achieve. You may complete at most two transactions, and you must sell the stock before you buy again."
    ],
    why: [
      "Buy at 0, sell at 3 (+3); buy at 1, sell at 4 (+3): 6.",
      "One transaction from 1 to 5 is best: 4.",
      "Prices only fall, so make no transactions."
    ],
    walk: [
      "Track four running bests: after the first buy, the first sell, the second buy and the second sell.",
      "Through day 4, the first buy reaches −0 (buy at 0) and the first sell reaches 3 (sell at 3).",
      "The second buy can use that profit: 3 − 1 = 2 when buying at 1 on day 6.",
      "Selling at 4 on day 7 gives 2 + 4 = 6.",
      "The answer is 6."
    ],
    cons: ["1 ≤ prices.length ≤ 10⁵", "0 ≤ prices[i] ≤ 10⁵"]
  },
  "best-time-iv": {
    body: [
      "You are given an integer `k` and an array `prices` where prices[i] is the price of a given stock on day i.",
      "Find the maximum profit you can achieve with at most k transactions. You must sell the stock before you buy again."
    ],
    why: [
      "Buy at 2, sell at 4: 2.",
      "Buy at 2, sell at 6 (+4); buy at 0, sell at 3 (+3): 7."
    ],
    walk: [
      "Keep a pair of states for each transaction t = 1 … k: the best after buying the t-th time and after selling it.",
      "Day 0 (2): buy₁ = −2, buy₂ = −2.",
      "Day 1 (4): sell₁ = −2 + 4 = 2, sell₂ = 2.",
      "Day 2 (1): buy₂ = max(−2, sell₁ − 1 = 1) = 1, but there is no later day to sell it.",
      "The answer is 2."
    ],
    cons: ["1 ≤ k ≤ 100", "1 ≤ prices.length ≤ 1000", "0 ≤ prices[i] ≤ 1000"]
  },
  "burst-balloons": {
    body: [
      "You are given n balloons, indexed from 0 to n − 1. Each balloon is painted with a number, given in the array `nums`. You are asked to burst all the balloons.",
      "Bursting balloon i earns nums[i − 1] × nums[i] × nums[i + 1] coins, using the neighbours at that moment. If i − 1 or i + 1 goes out of bounds, treat it as a balloon painted 1. Return the maximum coins you can collect."
    ],
    why: [
      "Burst 1 (3 × 1 × 5 = 15), then 5 (3 × 5 × 8 = 120), then 3 (1 × 3 × 8 = 24), then 8 (1 × 8 × 1 = 8): 167.",
      "Burst 1 (1 × 1 × 5 = 5), then 5 (1 × 5 × 1 = 5): 10."
    ],
    walk: [
      "Think about the last balloon to burst in a range: when it bursts, its neighbours are the range's borders, which never change.",
      "Pad with 1s: [1, 3, 1, 5, 8, 1]. best(l, r) = the best for the balloons strictly between l and r.",
      "best(l, r) = max over k of best(l, k) + best(k, r) + nums[l] × nums[k] × nums[r].",
      "Filling the table from short ranges to long ones, the whole range gives 167."
    ],
    cons: ["n == nums.length", "1 ≤ n ≤ 300", "0 ≤ nums[i] ≤ 100"]
  },
  "min-cost-cut-stick": {
    body: [
      "Given a wooden stick of length `n` units, labeled from 0 to n, and an integer array `cuts` where cuts[i] is a position you must cut at.",
      "You can make the cuts in any order. The cost of one cut is the length of the stick being cut. Return the minimum total cost of all the cuts."
    ],
    why: [
      "Cut at 3 (cost 7), then 5 (cost 4, the piece 3–7), then 1 (cost 3, the piece 0–3), then 4 (cost 2, the piece 3–5): 16.",
      "The best order costs 22."
    ],
    walk: [
      "Add the two ends and sort: [0, 1, 3, 4, 5, 7]. cost(i, j) = the cheapest way to make every cut strictly between cut i and cut j.",
      "cost(i, j) = (length cuts[j] − cuts[i]) + min over k of cost(i, k) + cost(k, j).",
      "Short ranges: cost(1, 3) = 2 (one cut at 4 in a piece of length 2), and so on.",
      "The full range cost(0, 5) comes out to 16."
    ],
    cons: ["2 ≤ n ≤ 10⁶", "1 ≤ cuts.length ≤ min(n − 1, 100)", "1 ≤ cuts[i] ≤ n − 1", "All cuts are distinct."]
  },
  "ones-and-zeroes": {
    body: [
      "You are given an array of binary strings `strs` and two integers `m` and `n`.",
      "Return the size of the largest subset of strs such that there are at most m 0s and n 1s in the subset in total."
    ],
    why: [
      "{'10', '0001', '1', '0'} uses 5 zeros and 3 ones. '111001' alone would use 2 zeros and 4 ones, too many ones.",
      "{'0', '1'} uses one of each."
    ],
    walk: [
      "This is a knapsack with two capacities. best[z][o] = the most strings using at most z zeros and o ones.",
      "'10' (1 zero, 1 one): every best[z ≥ 1][o ≥ 1] becomes 1.",
      "Add '0001' (3, 1), '111001' (2, 4), '1' (0, 1) and '0' (1, 0), updating capacities from high to low.",
      "best[5][3] ends at 4."
    ],
    cons: ["1 ≤ strs.length ≤ 600", "1 ≤ strs[i].length ≤ 100", "Each string has only '0's and '1's.", "1 ≤ m, n ≤ 100"]
  },
  "delete-and-earn": {
    body: [
      "You are given an integer array `nums`. You want to maximize the number of points you get by repeatedly picking any nums[i], earning nums[i] points, and then deleting every element equal to nums[i] − 1 and nums[i] + 1.",
      "Return the maximum number of points you can earn."
    ],
    why: [
      "Take 4 (deleting 3), then 2: 6.",
      "Take all three 3s (deleting the 2s and the 4): 9."
    ],
    walk: [
      "Total the points per value: 2 → 2, 3 → 3, 4 → 4.",
      "Taking a value forbids its neighbours, which is House Robber over the values.",
      "Take 2 and 4 → 6, or take 3 alone → 3.",
      "The answer is 6."
    ],
    cons: ["1 ≤ nums.length ≤ 2 · 10⁴", "1 ≤ nums[i] ≤ 10⁴"]
  },
  "longest-string-chain": {
    body: [
      "You are given an array of `words`, each consisting of lowercase English letters. wordA is a predecessor of wordB if you can insert exactly one letter anywhere in wordA, without changing the order of the other letters, to make it equal to wordB.",
      "A word chain is a sequence where each word is a predecessor of the next. A single word is a chain of length 1. Return the length of the longest possible word chain."
    ],
    why: [
      "a → ba → bda → bdca.",
      "xb → xbc → cxbc → pcxbc → pcxbcf.",
      "Getting from 'abcd' to 'dbqca' would require reordering letters, so the longest chain is a single word."
    ],
    walk: [
      "Sort by length. best[word] = 1 + the best among the words formed by deleting one of its letters.",
      "'a' → 1, 'b' → 1. 'ba' → delete a letter to get 'a' or 'b' → 2.",
      "'bca' → deleting 'c' gives 'ba' → 3. 'bda' → 'ba' → 3.",
      "'bdca' → deleting 'c' gives 'bda' → 4."
    ],
    cons: ["1 ≤ words.length ≤ 1000", "1 ≤ words[i].length ≤ 16", "`words[i]` consists of lowercase English letters."]
  },
  "maximum-sum-circular": {
    body: [
      "Given a circular integer array `nums` of length n, return the maximum possible sum of a non-empty subarray of nums.",
      "Circular means the end of the array connects to the beginning, so a subarray may wrap around. Each element can be used at most once."
    ],
    why: [
      "The subarray [3] is the best.",
      "Wrap around: [5, 5] (the last 5 followed by the first) sums to 10.",
      "All numbers are negative, so take the largest single one, −2."
    ],
    walk: [
      "Either the best subarray doesn't wrap (normal Kadane), or it wraps, which means it is the total minus the smallest subarray in the middle.",
      "Kadane maximum: 3.",
      "Smallest subarray: −2. The total is 0, so wrapping gives 0 − (−2) = 2.",
      "max(3, 2) = 3. (If every number is negative, use the Kadane answer.)"
    ],
    cons: ["n == nums.length", "1 ≤ n ≤ 3 · 10⁴", "-3 · 10⁴ ≤ nums[i] ≤ 3 · 10⁴"]
  },
  "arithmetic-slices": {
    body: [
      "An integer array is called arithmetic if it has at least three elements and the difference between any two consecutive elements is the same. For example, [1,3,5,7,9] and [7,7,7,7] are arithmetic.",
      "Given an integer array `nums`, return the number of arithmetic subarrays (contiguous) of nums."
    ],
    why: [
      "[1,2,3], [2,3,4] and [1,2,3,4].",
      "One element can't form a slice."
    ],
    walk: [
      "cur = the number of arithmetic slices ending at the current index. It grows by 1 each time the difference stays the same.",
      "i = 2: 3 − 2 = 2 − 1 → cur = 1, total 1.",
      "i = 3: 4 − 3 = 3 − 2 → cur = 2, total 3.",
      "The answer is 3."
    ],
    cons: ["1 ≤ nums.length ≤ 5000", "-1000 ≤ nums[i] ≤ 1000"]
  },
  "dungeon-game": {
    body: [
      "Demons captured the princess and put her in the bottom-right room of a dungeon, an m × n grid. The knight starts in the top-left room and moves only right or down.",
      "Each room changes his health by dungeon[i][j] (negative values hurt, positive values heal). If his health ever drops to 0 or below, he dies. Return the knight's minimum initial health so that he can rescue the princess."
    ],
    why: [
      "Going right, right, down, down costs the least health: starting with 7, his health never drops below 1.",
      "The room is neutral, but health must always be at least 1."
    ],
    walk: [
      "Work backwards from the princess: need[i][j] = the health needed when entering room (i, j).",
      "Princess room (−5): he needs 6 to finish with 1.",
      "Room (1,2) with +1 needs 5. Room (2,1) with +30 needs only 1.",
      "Continue: room (1,1) with −10 needs 11, (0,2) needs 2, (0,1) needs 5, (1,0) needs 6.",
      "Start room (−2): min(5, 6) + 2 = 7."
    ],
    cons: ["m == dungeon.length", "n == dungeon[i].length", "1 ≤ m, n ≤ 200", "-1000 ≤ dungeon[i][j] ≤ 1000"]
  },
  "predict-the-winner": {
    body: [
      "You are given an integer array `nums`. Two players play a game. Player 1 goes first; on each turn a player takes one number from either end of the array and adds it to their score.",
      "The game ends when no numbers are left. Return `true` if player 1 can win (a tie also counts as a win for player 1), assuming both players play optimally."
    ],
    why: [
      "Whichever end player 1 takes, player 2 takes the 5. Player 1 ends with at most 3, against 5.",
      "Player 1 takes 1. Whatever player 2 takes, player 1 can then take 233."
    ],
    walk: [
      "diff(i, j) = how far ahead the player to move can get on nums[i..j]: max(nums[i] − diff(i+1, j), nums[j] − diff(i, j−1)).",
      "Single numbers: diff = the number.",
      "diff(0, 1) = max(1 − 5, 5 − 1) = 4. diff(1, 2) = max(5 − 2, 2 − 5) = 3.",
      "diff(0, 2) = max(1 − 3, 2 − 4) = −2 < 0, so player 1 loses. Return false."
    ],
    cons: ["1 ≤ nums.length ≤ 20", "0 ≤ nums[i] ≤ 10⁷"]
  },
  "paint-house": {
    body: [
      "There is a row of n houses, and each house can be painted red, blue or green. The cost of painting each house with each color is different. `costs[i][c]` is the cost of painting house i with color c.",
      "No two adjacent houses may have the same color. Return the minimum cost to paint all houses."
    ],
    why: [
      "House 0 in color 1 (2) + house 1 in color 2 (5) + house 2 in color 1 (3) = 10.",
      "One house: the cheapest color costs 2."
    ],
    walk: [
      "best[i][c] = costs[i][c] + the cheaper of the other two colors for house i − 1.",
      "House 0: [17, 2, 17].",
      "House 1: 16 + min(2, 17) = 18, 16 + min(17, 17) = 33, 5 + min(17, 2) = 7 → [18, 33, 7].",
      "House 2: 14 + min(33, 7) = 21, 3 + min(18, 7) = 10, 19 + min(18, 33) = 37. The minimum is 10."
    ],
    cons: ["costs.length == n", "costs[i].length == 3", "1 ≤ n ≤ 100", "1 ≤ costs[i][j] ≤ 20"]
  }
};
