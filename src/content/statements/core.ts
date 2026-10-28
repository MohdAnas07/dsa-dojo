import type { Statement } from "./types";
import { TREE_NOTE } from "./trees";

/** Statements for the 49 core problems (src/content/problems-core.ts). */
export const CORE_STATEMENTS: Record<string, Statement> = {
  "two-sum": {
    body: [
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.",
      "You may assume that each input has exactly one solution, and you may not use the same element twice. You can return the answer in any order."
    ],
    why: [
      "nums[0] + nums[1] = 2 + 7 = 9, so the answer is [0, 1].",
      "nums[1] + nums[2] = 2 + 4 = 6. Note that 3 + 3 is not allowed here: there is only one 3, and an element can't be used twice.",
      "The two 3s are different elements (indices 0 and 1), so using both is fine: 3 + 3 = 6."
    ],
    walk: [
      "Start with an empty map `seen` that will remember value → index for numbers already passed.",
      "i = 0, nums[0] = 2. We need 9 − 2 = 7. 7 is not in `seen`, so store 2 → 0.",
      "i = 1, nums[1] = 7. We need 9 − 7 = 2. 2 is in `seen` at index 0.",
      "Return [0, 1]. We never had to look at 11 or 15."
    ],
    cons: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "-10⁹ ≤ target ≤ 10⁹", "Exactly one valid answer exists."]
  },
  "contains-duplicate": {
    body: [
      "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct."
    ],
    why: [
      "The value 1 appears twice (at indices 0 and 3).",
      "All four values are different.",
      "Several values repeat, for example 1 appears three times. One repeat is enough to return true."
    ],
    walk: [
      "Start with an empty set `seen`.",
      "1 is not in `seen`: add it → {1}.",
      "2 is not in `seen`: add it → {1, 2}.",
      "3 is not in `seen`: add it → {1, 2, 3}.",
      "1 is already in `seen`, so a value repeats. Return true immediately."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹"]
  },
  "best-time-stock": {
    body: [
      "You are given an array `prices` where `prices[i]` is the price of a given stock on day i.",
      "You want to maximize your profit by choosing a single day to buy one stock and a different day in the future to sell it. Return the maximum profit you can achieve from this transaction. If you cannot make any profit, return 0."
    ],
    why: [
      "Buy on day 1 (price 1) and sell on day 4 (price 6): profit = 6 − 1 = 5. Buying at 1 and selling at 7 is not allowed, because 7 comes earlier: you must buy before you sell.",
      "Prices only go down, so every sale would lose money. Make no transaction: profit 0."
    ],
    walk: [
      "Track the cheapest price seen so far (`minPrice`) and the best profit (`best`). Start with minPrice = 7, best = 0.",
      "Day 1, price 1: cheaper than 7, so minPrice = 1.",
      "Day 2, price 5: selling today earns 5 − 1 = 4 → best = 4.",
      "Day 3, price 3: 3 − 1 = 2, not better.",
      "Day 4, price 6: 6 − 1 = 5 → best = 5.",
      "Day 5, price 4: 4 − 1 = 3, not better. Answer: 5."
    ],
    cons: ["1 ≤ prices.length ≤ 10⁵", "0 ≤ prices[i] ≤ 10⁴"]
  },
  "move-zeroes": {
    body: [
      "Given an integer array `nums`, move all 0s to the end of it while keeping the relative order of the non-zero elements.",
      "You must do this in place, without making a copy of the array. The function returns nothing; the judge checks `nums` after your function runs."
    ],
    why: [
      "The non-zero values 1, 3, 12 keep their order and move to the front; the two zeros go to the end.",
      "A single zero is already at the end."
    ],
    walk: [
      "Keep `write` = 0: the next position for a non-zero value.",
      "read 0: value 0, skip.",
      "read 1: value 1, swap with nums[0] → [1, 0, 0, 3, 12], write = 1.",
      "read 2: value 0, skip.",
      "read 3: value 3, swap with nums[1] → [1, 3, 0, 0, 12], write = 2.",
      "read 4: value 12, swap with nums[2] → [1, 3, 12, 0, 0]. Done."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁴", "-2³¹ ≤ nums[i] ≤ 2³¹ − 1"]
  },
  "max-subarray": {
    body: [
      "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
      "A subarray is a contiguous, non-empty part of the array. Numbers can be negative, so sometimes it pays to drop the elements you have so far and start again."
    ],
    why: [
      "The subarray [4, −1, 2, 1] has sum 6. No other contiguous range does better.",
      "There is only one element, so the answer is that element.",
      "Taking the whole array gives 5 + 4 − 1 + 7 + 8 = 23. The −1 is worth keeping because it connects two big groups."
    ],
    walk: [
      "Kadane's idea: `cur` is the best sum of a subarray ending at the current index; `best` is the best seen anywhere.",
      "−2: cur = −2, best = −2.",
      "1: max(1, −2 + 1) = 1 → start fresh. cur = 1, best = 1.",
      "−3: max(−3, 1 − 3) = −2. cur = −2.",
      "4: max(4, −2 + 4) = 4 → start fresh. cur = 4, best = 4.",
      "−1 → cur = 3. 2 → cur = 5, best = 5. 1 → cur = 6, best = 6.",
      "−5 → cur = 1. 4 → cur = 5. The answer stays 6 (subarray [4, −1, 2, 1])."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"]
  },
  "product-except-self": {
    body: [
      "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.",
      "You must write an algorithm that runs in O(n) time and does not use the division operation. The product of any prefix or suffix fits in a 32-bit integer."
    ],
    why: [
      "answer[0] = 2·3·4 = 24, answer[1] = 1·3·4 = 12, answer[2] = 1·2·4 = 8, answer[3] = 1·2·3 = 6.",
      "Every product that includes the 0 is 0. Only answer[2] skips the 0: (−1)·1·(−3)·3 = 9."
    ],
    walk: [
      "Pass 1 (left to right): answer[i] = product of everything before i → [1, 1, 2, 6].",
      "Pass 2 (right to left) with a running suffix product `suf`, starting at 1.",
      "i = 3: answer[3] = 6 · 1 = 6, then suf = 4.",
      "i = 2: answer[2] = 2 · 4 = 8, then suf = 12.",
      "i = 1: answer[1] = 1 · 12 = 12, then suf = 24.",
      "i = 0: answer[0] = 1 · 24 = 24. Result: [24, 12, 8, 6]."
    ],
    cons: ["2 ≤ nums.length ≤ 10⁵", "-30 ≤ nums[i] ≤ 30", "Every prefix and suffix product fits in a 32-bit integer."]
  },
  "rotate-array": {
    body: [
      "Given an integer array `nums`, rotate the array to the right by `k` steps. Each step moves the last element to the front.",
      "Do it in place; the function returns nothing. `k` can be larger than the array length."
    ],
    why: [
      "1 step: [7,1,2,3,4,5,6]. 2 steps: [6,7,1,2,3,4,5]. 3 steps: [5,6,7,1,2,3,4].",
      "1 step: [99,−1,−100,3]. 2 steps: [3,99,−1,−100]."
    ],
    walk: [
      "First reduce k: k = 3 % 7 = 3.",
      "Reverse the whole array: [7, 6, 5, 4, 3, 2, 1].",
      "Reverse the first k = 3 elements: [5, 6, 7, 4, 3, 2, 1].",
      "Reverse the remaining 4 elements: [5, 6, 7, 1, 2, 3, 4]. Done, with O(1) extra space."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁵", "-2³¹ ≤ nums[i] ≤ 2³¹ − 1", "0 ≤ k ≤ 10⁵"]
  },
  "trapping-rain-water": {
    body: [
      "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      "Water above a bar can rise to the height of the shorter of the tallest bar on its left and the tallest bar on its right."
    ],
    why: [
      "Water collects above index 2 (1 unit), index 4 (1), index 5 (2), index 6 (1) and index 9 (1): 1 + 1 + 2 + 1 + 1 = 6.",
      "The water level between the walls of height 4 and 5 is 4. Above each bar: index 1 holds 4 − 2 = 2, index 2 holds 4, index 3 holds 1, index 4 holds 2. Total 9."
    ],
    walk: [
      "For each index, water = min(tallest bar to the left, tallest bar to the right) − height, if positive.",
      "Index 2 (height 0): left max 1, right max 3 → min 1 → 1 unit.",
      "Index 4 (height 1): left max 2, right max 3 → 2 − 1 = 1 unit.",
      "Index 5 (height 0): 2 − 0 = 2 units. Index 6 (height 1): 2 − 1 = 1 unit.",
      "Index 9 (height 1): left max 3, right max 2 → 2 − 1 = 1 unit. Every other index holds 0.",
      "Total: 1 + 1 + 2 + 1 + 1 = 6. The two-pointer solution computes the same thing in one pass with O(1) space."
    ],
    cons: ["n == height.length", "1 ≤ n ≤ 2 · 10⁴", "0 ≤ height[i] ≤ 10⁵"]
  },
  "valid-palindrome": {
    body: [
      "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters are letters and digits.",
      "Given a string `s`, return `true` if it is a palindrome, or `false` otherwise."
    ],
    why: [
      "After cleaning, the string is 'amanaplanacanalpanama', which reads the same both ways.",
      "After cleaning, the string is 'raceacar'. Backwards it is 'racaecar', which is different.",
      "After removing the space, the string is empty. An empty string reads the same forward and backward."
    ],
    walk: [
      "Put `l` at the start and `r` at the end.",
      "l = 'A', r = 'a': equal after lowercasing. Move both inward.",
      "l = ' ' is not alphanumeric: skip it. Compare 'm' with 'm': equal.",
      "Keep skipping spaces, commas and the colon while comparing pairs: a/a, n/n, a/a, p/p, l/l, …",
      "The pointers meet in the middle without a mismatch, so return true."
    ],
    cons: ["1 ≤ s.length ≤ 2 · 10⁵", "`s` consists only of printable ASCII characters."]
  },
  "valid-anagram": {
    body: [
      "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
      "An anagram uses exactly the same letters, the same number of times, possibly in a different order."
    ],
    why: [
      "Both strings contain a ×3, n ×1, g ×1, r ×1, m ×1.",
      "'rat' has a 't' but 'car' has a 'c' instead, so the letter counts differ."
    ],
    walk: [
      "If the lengths differ, return false. Both have length 7.",
      "Count the letters of s = 'anagram': {a: 3, n: 1, g: 1, r: 1, m: 1}.",
      "Go through t = 'nagaram' and subtract: n, a, g, a, r, a, m. No count goes below 0.",
      "Every count ends at 0, so return true."
    ],
    cons: ["1 ≤ s.length, t.length ≤ 5 · 10⁴", "`s` and `t` consist of lowercase English letters."]
  },
  "longest-substring": {
    body: [
      "Given a string `s`, find the length of the longest substring without repeating characters.",
      "A substring is a contiguous block of characters. Picking characters that are not next to each other makes a subsequence, which does not count."
    ],
    why: [
      "The answer is 'abc', with length 3.",
      "Every substring longer than 1 repeats 'b', so the answer is 'b', with length 1.",
      "The answer is 'wke', with length 3. 'pwke' is a subsequence, not a substring, so it does not count."
    ],
    walk: [
      "Keep a window [l, r] with no repeats and a map of each character's last index. Start with l = 0.",
      "r = 0..2 ('a', 'b', 'c'): no repeats, window 'abc', best = 3.",
      "r = 3 ('a'): last seen at 0, inside the window → l = 1. Window 'bca'.",
      "r = 4 ('b'): last at 1 → l = 2, window 'cab'. r = 5 ('c'): last at 2 → l = 3, window 'abc'.",
      "r = 6 ('b'): last at 4 → l = 5, window 'cb'. r = 7 ('b'): last at 6 → l = 7, window 'b'.",
      "The window was never longer than 3, so the answer is 3."
    ],
    cons: ["0 ≤ s.length ≤ 5 · 10⁴", "`s` consists of English letters, digits, symbols and spaces."]
  },
  "group-anagrams": {
    body: [
      "Given an array of strings `strs`, group the anagrams together. You can return the groups in any order, and the words inside a group in any order.",
      "Two words are anagrams if they use exactly the same letters the same number of times."
    ],
    why: [
      "'eat', 'tea' and 'ate' all sort to 'aet'; 'tan' and 'nat' sort to 'ant'; 'bat' has no partner.",
      "The empty string forms a group on its own.",
      "A single word forms a single group."
    ],
    walk: [
      "Give each word a key: its letters sorted. Words with the same key are anagrams.",
      "'eat' → 'aet', 'tea' → 'aet', 'tan' → 'ant', 'ate' → 'aet', 'nat' → 'ant', 'bat' → 'abt'.",
      "Collect by key: aet → [eat, tea, ate], ant → [tan, nat], abt → [bat].",
      "Return the three lists."
    ],
    cons: ["1 ≤ strs.length ≤ 10⁴", "0 ≤ strs[i].length ≤ 100", "`strs[i]` consists of lowercase English letters."]
  },
  "top-k-frequent": {
    body: [
      "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.",
      "The answer is guaranteed to be unique: there is never a tie for the k-th place. Aim for better than O(n log n)."
    ],
    why: [
      "1 appears 3 times and 2 appears 2 times; 3 appears only once.",
      "There is only one element."
    ],
    walk: [
      "Count: {1: 3, 2: 2, 3: 1}.",
      "Bucket by frequency: bucket[3] = [1], bucket[2] = [2], bucket[1] = [3].",
      "Walk the buckets from the highest frequency down: take 1, then 2. We now have k = 2 numbers.",
      "Return [1, 2]."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴", "k is between 1 and the number of distinct elements.", "The answer is unique."]
  },
  "subarray-sum-k": {
    body: [
      "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals `k`.",
      "A subarray is a contiguous, non-empty sequence of elements. Numbers can be negative, so a sliding window does not work here."
    ],
    why: [
      "[1, 1] at indices 0–1 and [1, 1] at indices 1–2 both sum to 2.",
      "[1, 2] and [3] both sum to 3."
    ],
    walk: [
      "Track the running prefix sum and how many times each prefix sum has appeared. Start with count = {0: 1}.",
      "Add 1 → prefix 1. Need 1 − 2 = −1: seen 0 times. count = {0: 1, 1: 1}.",
      "Add 1 → prefix 2. Need 0: seen once, so one subarray ends here (indices 0–1). Answer 1.",
      "Add 1 → prefix 3. Need 1: seen once, so another subarray ends here (indices 1–2). Answer 2."
    ],
    cons: ["1 ≤ nums.length ≤ 2 · 10⁴", "-1000 ≤ nums[i] ≤ 1000", "-10⁷ ≤ k ≤ 10⁷"]
  },
  "longest-consecutive": {
    body: [
      "Given an unsorted array of integers `nums`, return the length of the longest sequence of consecutive integers (like 4, 5, 6, 7). The numbers can appear anywhere in the array.",
      "You must write an algorithm that runs in O(n) time, so sorting is not allowed."
    ],
    why: [
      "The longest run is 1, 2, 3, 4, which has length 4.",
      "The numbers 0 through 8 are all present (0 twice), which gives a run of length 9."
    ],
    walk: [
      "Put every number in a set: {100, 4, 200, 1, 3, 2}.",
      "100: 99 is not in the set, so 100 starts a run. 101 is missing → length 1.",
      "4: 3 is in the set, so 4 is not a start. Skip it.",
      "200: starts a run of length 1.",
      "1: 0 is missing, so 1 starts a run. 2, 3 and 4 are present, 5 is not → length 4.",
      "3 and 2 are not starts. The best length is 4."
    ],
    cons: ["0 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹"]
  },
  "container-water": {
    body: [
      "You are given an integer array `height` of length n. There are n vertical lines; line i goes from (i, 0) to (i, height[i]).",
      "Find two lines that, together with the x-axis, form a container that holds the most water. Return the maximum amount of water. The container can't be tilted, so the water level is set by the shorter line."
    ],
    why: [
      "Use the lines at index 1 (height 8) and index 8 (height 7): width 8 − 1 = 7, height min(8, 7) = 7, area 49.",
      "The only container has width 1 and height 1."
    ],
    walk: [
      "l = 0, r = 8: width 8 × min(1, 7) = 8. The left line is shorter, so move l.",
      "l = 1, r = 8: width 7 × min(8, 7) = 49. Now the right line is shorter, so move r.",
      "l = 1, r = 7: 6 × min(8, 3) = 18. Move r.",
      "l = 1, r = 6: 5 × min(8, 8) = 40. Keep moving inward: 16, 15, 4, 6.",
      "Moving the shorter line is safe: keeping it could never beat the area we already measured with it. The best is 49."
    ],
    cons: ["n == height.length", "2 ≤ n ≤ 10⁵", "0 ≤ height[i] ≤ 10⁴"]
  },
  "three-sum": {
    body: [
      "Given an integer array `nums`, return all the triplets [nums[i], nums[j], nums[k]] such that i, j and k are different indices and nums[i] + nums[j] + nums[k] == 0.",
      "The answer must not contain duplicate triplets. The order of the triplets, and of the numbers inside each triplet, does not matter."
    ],
    why: [
      "−1 + (−1) + 2 = 0 and −1 + 0 + 1 = 0. The second −1 would give [−1, 0, 1] again, so it is not repeated.",
      "The only triplet is 0 + 1 + 1 = 2, which is not 0.",
      "The only triplet is 0 + 0 + 0 = 0."
    ],
    walk: [
      "Sort: [−4, −1, −1, 0, 1, 2].",
      "i = 0 (−4): need two numbers summing to 4 from [−1, −1, 0, 1, 2]. The largest pair is 1 + 2 = 3, so none.",
      "i = 1 (−1): need a pair summing to 1. l = −1, r = 2 → 1 ✓ record [−1, −1, 2]. Move both: l = 0, r = 1 → 1 ✓ record [−1, 0, 1].",
      "i = 2 (−1): same value as before, skip it to avoid duplicates.",
      "i = 3 (0): need 0 from [1, 2]. None. Result: [[−1, −1, 2], [−1, 0, 1]]."
    ],
    cons: ["3 ≤ nums.length ≤ 3000", "-10⁵ ≤ nums[i] ≤ 10⁵"]
  },
  "max-avg-subarray": {
    body: [
      "You are given an integer array `nums` of n elements and an integer `k`.",
      "Find a contiguous subarray of length exactly `k` that has the maximum average value, and return this value. Answers within 10⁻⁵ of the correct value are accepted."
    ],
    why: [
      "The best window is [12, −5, −6, 50]: (12 − 5 − 6 + 50) / 4 = 51 / 4 = 12.75.",
      "The only window is [5], with average 5."
    ],
    walk: [
      "Sum the first window [1, 12, −5, −6] = 2. best = 2.",
      "Slide right: add 50, remove 1 → 51. best = 51.",
      "Slide right: add 3, remove 12 → 42.",
      "Best sum 51, so the answer is 51 / 4 = 12.75."
    ],
    cons: ["1 ≤ k ≤ n ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"]
  },
  "min-window-substring": {
    body: [
      "Given two strings `s` and `t`, return the minimum window substring of `s` such that every character in `t`, including duplicates, is included in the window. If there is no such substring, return the empty string \"\".",
      "The answer is guaranteed to be unique when it exists."
    ],
    why: [
      "'BANC' contains A, B and C, and no shorter window does.",
      "The whole string 'a' contains t.",
      "t needs two 'a's but s has only one, so no window works."
    ],
    walk: [
      "Expand the right edge until the window has A, B and C: at index 5 the window is 'ADOBEC' (length 6).",
      "Shrink from the left: dropping 'A' breaks the window, so record length 6 and keep expanding.",
      "At index 10 (the second 'A') the window is valid again. Shrink to 'CODEBA' (length 6, not better).",
      "Dropping 'C' breaks it. Expand to index 12 (the last 'C'): window 'ODEBANC'.",
      "Shrink: O, D and E can go, giving 'BANC' (length 4). Dropping 'B' would break it, so the answer is 'BANC'."
    ],
    cons: ["1 ≤ s.length, t.length ≤ 10⁵", "`s` and `t` consist of uppercase and lowercase English letters."]
  },
  "binary-search": {
    body: [
      "Given an array of integers `nums` sorted in ascending order and an integer `target`, write a function to search for `target` in `nums`. If it exists, return its index. Otherwise, return −1.",
      "You must write an algorithm with O(log n) runtime complexity."
    ],
    why: [
      "9 is at index 4.",
      "2 does not appear in the array."
    ],
    walk: [
      "lo = 0, hi = 5.",
      "mid = 2: nums[2] = 3 < 9, so the target is to the right → lo = 3.",
      "mid = 4: nums[4] = 9. Found it: return 4."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ < nums[i], target < 10⁴", "All the integers in `nums` are unique.", "`nums` is sorted in ascending order."]
  },
  "search-insert": {
    body: [
      "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
      "You must write an algorithm with O(log n) runtime complexity."
    ],
    why: [
      "5 is at index 2.",
      "2 is not in the array; it belongs between 1 and 3, at index 1.",
      "7 is larger than every element, so it goes at the end, index 4."
    ],
    walk: [
      "Search for the first index whose value is ≥ target. lo = 0, hi = 4 (one past the end).",
      "mid = 2: nums[2] = 5 ≥ 5 → hi = 2.",
      "mid = 1: nums[1] = 3 < 5 → lo = 2.",
      "lo == hi == 2. Return 2."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ ≤ nums[i], target ≤ 10⁴", "`nums` contains distinct values sorted in ascending order."]
  },
  "search-rotated": {
    body: [
      "An integer array `nums` sorted in ascending order with distinct values was possibly rotated at an unknown pivot, for example [0,1,2,4,5,6,7] might become [4,5,6,7,0,1,2].",
      "Given the array after the rotation and an integer `target`, return the index of `target` if it is in `nums`, or −1 if it is not. You must write an algorithm with O(log n) runtime complexity."
    ],
    why: [
      "0 is at index 4.",
      "3 does not appear in the array.",
      "The array has one element, which is not 0."
    ],
    walk: [
      "lo = 0, hi = 6, mid = 3 (value 7). The left half [4, 5, 6, 7] is sorted, and 0 is not in [4, 7] → search the right half: lo = 4.",
      "mid = 5 (value 1). The left part [0, 1] is sorted and 0 lies in [0, 1) → hi = 4.",
      "mid = 4 (value 0). Found it: return 4."
    ],
    cons: ["1 ≤ nums.length ≤ 5000", "-10⁴ ≤ nums[i], target ≤ 10⁴", "All values of `nums` are unique.", "`nums` is an ascending array that is possibly rotated."]
  },
  "koko-bananas": {
    body: [
      "Koko loves to eat bananas. There are n piles of bananas; the i-th pile has `piles[i]` bananas. The guards will come back in `h` hours.",
      "Koko picks an eating speed of k bananas per hour. Each hour she chooses one pile and eats k bananas from it. If the pile has fewer than k bananas, she eats all of them and won't eat any more that hour. Return the minimum integer k such that she can eat all the bananas within h hours."
    ],
    why: [
      "At speed 4 the piles take 1 + 2 + 2 + 3 = 8 hours, which fits. Speed 3 would need 1 + 2 + 3 + 4 = 10 hours.",
      "5 hours for 5 piles means one pile per hour, so she must finish the biggest pile (30) in one hour.",
      "At speed 23 the piles take 2 + 1 + 1 + 1 + 1 = 6 hours. At speed 22, 30 and 23 both take 2 hours, which makes 7."
    ],
    walk: [
      "The speed is between 1 and the largest pile, 11. Binary search that range.",
      "k = 6: hours = 1 + 1 + 2 + 2 = 6 ≤ 8, fast enough → try slower: hi = 6.",
      "k = 3: hours = 1 + 2 + 3 + 4 = 10 > 8, too slow → lo = 4.",
      "k = 5: hours = 1 + 2 + 2 + 3 = 8 ≤ 8 → hi = 5.",
      "k = 4: hours = 1 + 2 + 2 + 3 = 8 ≤ 8 → hi = 4. lo == hi == 4, so the answer is 4."
    ],
    cons: ["1 ≤ piles.length ≤ 10⁴", "piles.length ≤ h ≤ 10⁹", "1 ≤ piles[i] ≤ 10⁹"]
  },
  "reverse-list": {
    body: [
      "Given the `head` of a singly linked list, reverse the list, and return the head of the reversed list.",
      "Lists are written as arrays of their values from head to tail, so [1,2,3] means 1 → 2 → 3."
    ],
    why: [
      "1 → 2 → 3 → 4 → 5 becomes 5 → 4 → 3 → 2 → 1.",
      "1 → 2 becomes 2 → 1.",
      "An empty list stays empty."
    ],
    walk: [
      "prev = null, cur = 1.",
      "Save next = 2, point 1 at prev (null), move prev = 1, cur = 2.",
      "Point 2 at 1. prev = 2, cur = 3. Then 3 → 2, 4 → 3, 5 → 4.",
      "cur becomes null. prev = 5 is the new head: 5 → 4 → 3 → 2 → 1."
    ],
    cons: ["The number of nodes is in the range [0, 5000].", "-5000 ≤ Node.val ≤ 5000"]
  },
  "merge-sorted-lists": {
    body: [
      "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list by splicing together the nodes of the first two lists.",
      "Return the head of the merged linked list."
    ],
    why: [
      "Taking the smaller head each time gives 1, 1, 2, 3, 4, 4.",
      "Both lists are empty, so the result is empty.",
      "One list is empty, so the result is the other list."
    ],
    walk: [
      "Start a dummy node and a `tail` pointer.",
      "1 vs 1: take list1's 1. 2 vs 1: take list2's 1.",
      "2 vs 3: take 2. 4 vs 3: take 3.",
      "4 vs 4: take list1's 4. list1 is empty, so attach the rest of list2 (4).",
      "Return dummy.next: 1 → 1 → 2 → 3 → 4 → 4."
    ],
    cons: ["The number of nodes in both lists is in the range [0, 50].", "-100 ≤ Node.val ≤ 100", "Both lists are sorted in non-decreasing order."]
  },
  "linked-list-cycle": {
    body: [
      "Given `head`, the head of a linked list, determine if the linked list has a cycle in it. A list has a cycle if some node can be reached again by continuously following `next`.",
      "In the examples, `pos` is the index of the node that the tail connects to (−1 means no cycle). `pos` is not passed to your function; it only shows how the test list is built. Return `true` if there is a cycle, otherwise `false`."
    ],
    why: [
      "The tail (−4) points back to the node at index 1 (value 2), forming a loop.",
      "The tail (2) points back to the head (1).",
      "One node with no loop."
    ],
    walk: [
      "The list is 3 → 2 → 0 → −4 → back to 2. Start slow and fast at 3.",
      "Step 1: slow moves 1 → 2; fast moves 2 → 0.",
      "Step 2: slow → 0; fast → −4 → 2.",
      "Step 3: slow → −4; fast → 0 → −4. They meet, so there is a cycle: return true."
    ],
    cons: ["The number of nodes is in the range [0, 10⁴].", "-10⁵ ≤ Node.val ≤ 10⁵", "pos is −1 or a valid index in the list."]
  },
  "remove-nth": {
    body: [
      "Given the `head` of a linked list, remove the n-th node from the end of the list and return its head.",
      "Try to do it in one pass."
    ],
    why: [
      "The 2nd node from the end is 4, so the list becomes 1 → 2 → 3 → 5.",
      "Removing the only node leaves an empty list.",
      "The 1st node from the end is 2, leaving [1]."
    ],
    walk: [
      "Add a dummy node before the head. Put `fast` and `slow` on the dummy.",
      "Move fast n + 1 = 3 steps: dummy → 1 → 2 → 3.",
      "Move both until fast is null: (fast 4, slow 1), (fast 5, slow 2), (fast null, slow 3).",
      "slow.next is 4, the node to delete. Set 3.next = 5. Result: 1 → 2 → 3 → 5."
    ],
    cons: ["The number of nodes is sz, with 1 ≤ sz ≤ 30.", "0 ≤ Node.val ≤ 100", "1 ≤ n ≤ sz"]
  },
  "valid-parentheses": {
    body: [
      "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      "A string is valid if every open bracket is closed by the same type of bracket, open brackets are closed in the correct order, and every close bracket has a matching open bracket."
    ],
    why: [
      "One pair, opened and closed correctly.",
      "Three pairs, each closed before the next one opens.",
      "'(' is closed by ']', which is the wrong type."
    ],
    walk: [
      "Start with an empty stack.",
      "'(' is an opener: push it → ['('].",
      "')' is a closer: pop '(' and check that it matches. It does.",
      "The string is finished and the stack is empty, so return true."
    ],
    cons: ["1 ≤ s.length ≤ 10⁴", "`s` consists of the characters ()[]{} only."]
  },
  "min-stack": {
    body: [
      "Design a stack that supports push, pop, top, and retrieving the minimum element, each in O(1) time.",
      "Implement the `MinStack` class: `push(val)` pushes val, `pop()` removes the top element, `top()` returns the top element, and `getMin()` returns the minimum element in the stack.",
      "The example lists the method calls on one line and their arguments on the next. The output shows what each call returns (null for methods that return nothing)."
    ],
    why: [
      "After pushing −2, 0 and −3 the minimum is −3. pop removes −3, top is now 0, and the minimum goes back to −2."
    ],
    walk: [
      "Store pairs [value, minimum so far] on the stack.",
      "push(−2) → [−2, −2]. push(0) → [0, −2]. push(−3) → [−3, −3].",
      "getMin() reads the top pair's minimum: −3.",
      "pop() removes [−3, −3]. top() returns 0. getMin() reads [0, −2] → −2."
    ],
    cons: ["-2³¹ ≤ val ≤ 2³¹ − 1", "pop, top and getMin are only called on a non-empty stack.", "At most 3 · 10⁴ calls are made."]
  },
  "daily-temperatures": {
    body: [
      "Given an array of integers `temperatures` representing the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after day i to get a warmer temperature.",
      "If there is no future day that is warmer, keep `answer[i] == 0`."
    ],
    why: [
      "Day 0 (73) waits 1 day for 74. Day 2 (75) waits 4 days for 76. The last two days never see a warmer day.",
      "Each day is warmer than the one before, except the last.",
      "Same pattern with three days."
    ],
    walk: [
      "Keep a stack of indices of days still waiting for a warmer day.",
      "Day 0 (73): push. Day 1 (74) is warmer: pop 0, answer[0] = 1; push 1. Day 2 (75): pop 1, answer[1] = 1; push 2.",
      "Day 3 (71) and day 4 (69) are colder: push both. Stack: [2, 3, 4].",
      "Day 5 (72): pop 4 (answer 1) and 3 (answer 2). 75 is warmer, so stop; push 5.",
      "Day 6 (76): pop 5 (answer 1) and 2 (answer 4); push 6. Day 7 (73): push.",
      "Days 6 and 7 stay at 0. Result: [1, 1, 4, 2, 1, 1, 0, 0]."
    ],
    cons: ["1 ≤ temperatures.length ≤ 10⁵", "30 ≤ temperatures[i] ≤ 100"]
  },
  "eval-rpn": {
    body: [
      "You are given an array of strings `tokens` that represents an arithmetic expression in Reverse Polish Notation, where each operator comes after its two operands. Evaluate the expression and return its value.",
      "The operators are +, −, * and /. Division between two integers truncates toward zero. The input is always a valid expression, and no division by zero happens."
    ],
    why: [
      "((2 + 1) × 3) = 9.",
      "(4 + (13 / 5)) = 4 + 2 = 6, because 13 / 5 truncates to 2.",
      "(9 + 3) × −11 = −132. 6 / −132 truncates to 0. 10 × 0 = 0, then 0 + 17 + 5 = 22."
    ],
    walk: [
      "Use a stack of numbers.",
      "'2' → push 2. '1' → push 1. Stack: [2, 1].",
      "'+' → pop 1 and 2, push 2 + 1 = 3. Stack: [3].",
      "'3' → push 3. '*' → pop 3 and 3, push 9.",
      "One number is left: the answer is 9."
    ],
    cons: ["1 ≤ tokens.length ≤ 10⁴", "Each token is an operator or an integer in the range [−200, 200]."]
  },
  "level-order": {
    body: [
      "Given the `root` of a binary tree, return the level order traversal of its nodes' values: from left to right, level by level.",
      "Trees are written in level order, with null for a missing child. [3,9,20,null,null,15,7] means 3 has children 9 and 20, 9 has no children, and 20 has children 15 and 7."
    ],
    why: [
      "Level 0 is [3], level 1 is [9, 20], level 2 is [15, 7].",
      "A single node is a single level.",
      "An empty tree has no levels."
    ],
    walk: [
      "Queue = [3]. Level size 1: take 3, add its children 9 and 20 → level [3].",
      "Queue = [9, 20]. Level size 2: take 9 (no children), take 20 (add 15 and 7) → level [9, 20].",
      "Queue = [15, 7]. Level size 2: both are leaves → level [15, 7].",
      "The queue is empty. Result: [[3], [9, 20], [15, 7]]."
    ],
    cons: ["The number of nodes is in the range [0, 2000].", "-1000 ≤ Node.val ≤ 1000"]
  },
  "rotting-oranges": {
    body: [
      "You are given an m × n grid where each cell is 0 (empty), 1 (a fresh orange) or 2 (a rotten orange).",
      "Every minute, any fresh orange that is up, down, left or right of a rotten orange becomes rotten. Return the minimum number of minutes until no cell has a fresh orange. If this is impossible, return −1."
    ],
    why: [
      "The rot spreads from the top-left corner and reaches the last fresh orange, at the bottom right, after 4 minutes.",
      "The orange in the bottom-left corner is surrounded by empty cells, so the rot can never reach it.",
      "There are no fresh oranges at minute 0, so the answer is 0."
    ],
    walk: [
      "Put every rotten orange in a queue: [(0,0)]. Fresh oranges: 6.",
      "Minute 1: (0,0) rots (0,1) and (1,0).",
      "Minute 2: those rot (0,2) and (1,1).",
      "Minute 3: (1,1) rots (2,1). Minute 4: (2,1) rots (2,2).",
      "No fresh oranges remain, so the answer is 4."
    ],
    cons: ["1 ≤ m, n ≤ 10", "grid[i][j] is 0, 1 or 2."]
  },
  "number-of-islands": {
    body: [
      "Given an m × n 2D grid that represents a map of '1's (land) and '0's (water), return the number of islands.",
      "An island is surrounded by water and is formed by connecting adjacent land cells horizontally or vertically (not diagonally). You may assume all four edges of the grid are surrounded by water."
    ],
    why: [
      "All the land cells connect into one shape.",
      "There are three separate groups: the 2 × 2 block in the top left, the single cell in the middle, and the two cells in the bottom right."
    ],
    walk: [
      "Scan the grid row by row.",
      "(0,0) is '1': count = 1. Flood it with DFS and turn every connected land cell into '0'.",
      "All the other land cells were connected to (0,0), so the flood sank them too.",
      "The rest of the scan finds no '1'. The answer is 1."
    ],
    cons: ["1 ≤ m, n ≤ 300", "grid[i][j] is '0' or '1'."]
  },
  "fibonacci": {
    body: [
      "The Fibonacci numbers form a sequence where each number is the sum of the two before it: F(0) = 0, F(1) = 1, and F(n) = F(n − 1) + F(n − 2) for n > 1.",
      "Given `n`, calculate F(n)."
    ],
    why: [
      "F(2) = F(1) + F(0) = 1 + 0 = 1.",
      "F(3) = F(2) + F(1) = 1 + 1 = 2.",
      "F(4) = F(3) + F(2) = 2 + 1 = 3."
    ],
    walk: [
      "Keep the last two values: a = F(0) = 0, b = F(1) = 1.",
      "One step: the next value is a + b = 1. Shift: a = 1, b = 1.",
      "We have reached n = 2, so return b = 1."
    ],
    cons: ["0 ≤ n ≤ 30"]
  },
  "climbing-stairs": {
    body: [
      "You are climbing a staircase. It takes `n` steps to reach the top.",
      "Each time you can climb either 1 or 2 steps. In how many distinct ways can you climb to the top?"
    ],
    why: [
      "1 + 1, or 2.",
      "1 + 1 + 1, 1 + 2, or 2 + 1."
    ],
    walk: [
      "To stand on step i, your last move came from step i − 1 or step i − 2, so ways(i) = ways(i − 1) + ways(i − 2).",
      "ways(1) = 1 (one single step).",
      "ways(2) = 2 (1 + 1, or 2). For n = 2, the answer is 2."
    ],
    cons: ["1 ≤ n ≤ 45"]
  },
  "power-of-two": {
    body: [
      "Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`.",
      "An integer n is a power of two if there exists an integer x such that n == 2ˣ."
    ],
    why: [
      "2⁰ = 1.",
      "2⁴ = 16.",
      "There is no integer x with 2ˣ = 3."
    ],
    walk: [
      "A power of two has exactly one 1-bit in binary. n − 1 flips that bit and turns on every bit below it, so n & (n − 1) is 0 only for powers of two.",
      "n = 1 is binary 1, and n − 1 = 0.",
      "1 & 0 = 0, and n > 0, so return true."
    ],
    cons: ["-2³¹ ≤ n ≤ 2³¹ − 1"]
  },
  "subsets": {
    body: [
      "Given an integer array `nums` of unique elements, return all possible subsets (the power set).",
      "The solution set must not contain duplicate subsets. Return the subsets in any order."
    ],
    why: [
      "3 elements give 2³ = 8 subsets, including the empty set and the full set.",
      "The empty set and [0]."
    ],
    walk: [
      "Backtrack: at each call, record the current path, then try adding each remaining element.",
      "Record []. Add 1 → record [1]. Add 2 → record [1, 2]. Add 3 → record [1, 2, 3].",
      "Undo 3 and 2. Add 3 → record [1, 3].",
      "Undo back to []. Add 2 → [2], then [2, 3]. Undo. Add 3 → [3].",
      "That makes 8 subsets in total."
    ],
    cons: ["1 ≤ nums.length ≤ 10", "-10 ≤ nums[i] ≤ 10", "All the numbers of `nums` are unique."]
  },
  "permutations": {
    body: [
      "Given an array `nums` of distinct integers, return all the possible permutations (orderings). You can return the answer in any order."
    ],
    why: [
      "3 elements give 3! = 6 orderings.",
      "2 elements give 2 orderings.",
      "One element has one ordering."
    ],
    walk: [
      "Build a path one position at a time, using each number at most once.",
      "Pick 1, then 2, then 3 → [1, 2, 3]. Undo 3 and 2; pick 3, then 2 → [1, 3, 2].",
      "Undo back to the start. Pick 2 first → [2, 1, 3] and [2, 3, 1].",
      "Pick 3 first → [3, 1, 2] and [3, 2, 1]. That makes 6 permutations."
    ],
    cons: ["1 ≤ nums.length ≤ 6", "-10 ≤ nums[i] ≤ 10", "All the integers of `nums` are unique."]
  },
  "max-depth": {
    body: [
      "Given the `root` of a binary tree, return its maximum depth.",
      "The maximum depth is the number of nodes along the longest path from the root down to the farthest leaf. An empty tree has depth 0." + " " + TREE_NOTE
    ],
    why: [
      "The longest path is 3 → 20 → 15 (or 3 → 20 → 7): 3 nodes.",
      "1 has only a right child 2: the path 1 → 2 has 2 nodes."
    ],
    walk: [
      "depth(node) = 1 + max(depth(left), depth(right)); depth(null) = 0.",
      "depth(9) = 1 (a leaf). depth(15) = depth(7) = 1.",
      "depth(20) = 1 + max(1, 1) = 2.",
      "depth(3) = 1 + max(1, 2) = 3."
    ],
    cons: ["The number of nodes is in the range [0, 10⁴].", "-100 ≤ Node.val ≤ 100"]
  },
  "invert-tree": {
    body: [
      "Given the `root` of a binary tree, invert the tree (mirror it left to right), and return its root.",
      "Inverting means swapping the left and right children of every node." + " " + TREE_NOTE
    ],
    why: [
      "Every left and right child is swapped: 2 ↔ 7, then 1 ↔ 3 and 6 ↔ 9.",
      "The two children of 2 are swapped.",
      "An empty tree stays empty."
    ],
    walk: [
      "Invert the subtrees of 2: its children 1 and 3 swap → 2 has (3, 1).",
      "Invert the subtrees of 7: 6 and 9 swap → 7 has (9, 6).",
      "At the root, swap the two subtrees: 4 has (7, 2).",
      "In level order: [4, 7, 2, 9, 6, 3, 1]."
    ],
    cons: ["The number of nodes is in the range [0, 100].", "-100 ≤ Node.val ≤ 100"]
  },
  "same-tree": {
    body: [
      "Given the roots of two binary trees `p` and `q`, check whether they are the same.",
      "Two binary trees are the same if they have the same shape and the nodes in the same positions have the same values." + " " + TREE_NOTE
    ],
    why: [
      "Same shape, same values.",
      "In p, 2 is the left child of 1; in q, 2 is the right child. The shapes differ.",
      "Same shape, but the children's values are swapped."
    ],
    walk: [
      "Compare the roots: 1 and 1 match.",
      "Compare the left children: 2 and 2 match, and both have no children.",
      "Compare the right children: 3 and 3 match, and both have no children.",
      "Every pair matched, so return true."
    ],
    cons: ["The number of nodes in both trees is in the range [0, 100].", "-10⁴ ≤ Node.val ≤ 10⁴"]
  },
  "validate-bst": {
    body: [
      "Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).",
      "In a valid BST, every node in a node's left subtree has a smaller value than the node, every node in its right subtree has a larger value, and both subtrees are BSTs too. Checking only a node's direct children is not enough." + " " + TREE_NOTE
    ],
    why: [
      "1 < 2 < 3.",
      "The root is 5, but its right child is 4, which is smaller than 5."
    ],
    walk: [
      "Check each node against the range it must fall in.",
      "Root 2 can be anything: (−∞, ∞) ✓.",
      "Left child 1 must be in (−∞, 2) ✓.",
      "Right child 3 must be in (2, ∞) ✓. Every node fits, so return true."
    ],
    cons: ["The number of nodes is in the range [1, 10⁴].", "-2³¹ ≤ Node.val ≤ 2³¹ − 1"]
  },
  "lca-bst": {
    body: [
      "Given a binary search tree and the values of two nodes `p` and `q` in it, find their lowest common ancestor (LCA) and return its value.",
      "The LCA is the lowest node that has both p and q as descendants. A node counts as a descendant of itself." + " " + TREE_NOTE
    ],
    why: [
      "2 is in the left subtree of 6 and 8 is in the right subtree, so 6 is where their paths split.",
      "4 is inside 2's subtree, and 2 is a descendant of itself, so the LCA is 2.",
      "1 is the child of 2, so the LCA is 2."
    ],
    walk: [
      "Start at the root, 6.",
      "p = 2 is smaller than 6 and q = 8 is larger, so they are on different sides.",
      "6 is the split point. Return 6."
    ],
    cons: ["The number of nodes is in the range [2, 10⁵].", "-10⁹ ≤ Node.val ≤ 10⁹", "All values are unique; p ≠ q, and both exist in the tree."]
  },
  "merge-intervals": {
    body: [
      "Given an array of `intervals` where intervals[i] = [startᵢ, endᵢ], merge all overlapping intervals.",
      "Return an array of the non-overlapping intervals that cover all the intervals in the input. Intervals that touch, like [1,4] and [4,5], count as overlapping."
    ],
    why: [
      "[1,3] and [2,6] overlap, so they merge into [1,6]. [8,10] and [15,18] don't overlap anything.",
      "[1,4] and [4,5] touch at 4, so they merge into [1,5]."
    ],
    walk: [
      "Sort by start (already sorted here). Result = [[1,3]].",
      "[2,6]: 2 ≤ 3, so it overlaps. Extend the last interval to [1,6].",
      "[8,10]: 8 > 6, no overlap. Add it.",
      "[15,18]: 15 > 10. Add it. Result: [[1,6], [8,10], [15,18]]."
    ],
    cons: ["1 ≤ intervals.length ≤ 10⁴", "intervals[i].length == 2", "0 ≤ startᵢ ≤ endᵢ ≤ 10⁴"]
  },
  "kth-largest": {
    body: [
      "Given an integer array `nums` and an integer `k`, return the k-th largest element in the array.",
      "This is the k-th largest in sorted order, not the k-th distinct element. Can you solve it without sorting?"
    ],
    why: [
      "Sorted from largest: [6, 5, 4, 3, 2, 1]. The 2nd is 5.",
      "Sorted from largest: [6, 5, 5, 4, 3, 3, 2, 2, 1]. The 4th is 4: the two 5s both count."
    ],
    walk: [
      "Keep a min-heap of the k largest numbers seen so far (k = 2).",
      "3 → [3]. 2 → [2, 3].",
      "1 is not bigger than the heap's smallest (2): skip. 5 → replace 2 → [3, 5].",
      "6 → replace 3 → [5, 6]. 4 is smaller than 5: skip.",
      "The heap's smallest is 5, which is the 2nd largest."
    ],
    cons: ["1 ≤ k ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"]
  },
  "single-number": {
    body: [
      "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.",
      "You must implement a solution with O(n) time and only constant extra space."
    ],
    why: [
      "2 appears twice; 1 appears once.",
      "1 and 2 appear twice; 4 appears once.",
      "The only element is the single one."
    ],
    walk: [
      "XOR has two useful rules: x ^ x = 0 and x ^ 0 = x. So pairs cancel out.",
      "Start with 0. 0 ^ 2 = 2.",
      "2 ^ 2 = 0 (the pair cancels).",
      "0 ^ 1 = 1. The answer is 1."
    ],
    cons: ["1 ≤ nums.length ≤ 3 · 10⁴", "-3 · 10⁴ ≤ nums[i] ≤ 3 · 10⁴", "Each element appears twice except for exactly one."]
  },
  "house-robber": {
    body: [
      "You are a robber planning to rob houses along a street. Each house has some amount of money, given by `nums`.",
      "Adjacent houses have connected alarms: if two adjacent houses are robbed on the same night, the police are alerted. Return the maximum amount of money you can rob tonight without alerting the police."
    ],
    why: [
      "Rob house 0 (1) and house 2 (3): 1 + 3 = 4.",
      "Rob houses 0, 2 and 4: 2 + 9 + 1 = 12."
    ],
    walk: [
      "best(i) = max(skip house i → best(i − 1), rob it → best(i − 2) + nums[i]).",
      "House 0 (1): best = 1.",
      "House 1 (2): max(1, 0 + 2) = 2.",
      "House 2 (3): max(2, 1 + 3) = 4.",
      "House 3 (1): max(4, 2 + 1) = 4. The answer is 4."
    ],
    cons: ["1 ≤ nums.length ≤ 100", "0 ≤ nums[i] ≤ 400"]
  },
  "coin-change": {
    body: [
      "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.",
      "Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up by any combination of the coins, return −1. You have an unlimited number of each kind of coin."
    ],
    why: [
      "11 = 5 + 5 + 1: 3 coins.",
      "Only coins of 2 exist, so an odd amount like 3 is impossible.",
      "Making 0 needs 0 coins."
    ],
    walk: [
      "dp[a] = the fewest coins that make amount a. dp[0] = 0.",
      "dp[a] = 1 + min(dp[a − c]) over every coin c ≤ a.",
      "dp[1] = 1, dp[2] = 1, dp[3] = 2, dp[4] = 2, dp[5] = 1, dp[6] = 2 (5 + 1).",
      "Continuing: dp[10] = 2 (5 + 5).",
      "dp[11] = 1 + min(dp[10], dp[9], dp[6]) = 1 + 2 = 3."
    ],
    cons: ["1 ≤ coins.length ≤ 12", "1 ≤ coins[i] ≤ 2³¹ − 1", "0 ≤ amount ≤ 10⁴"]
  }
};
