import type { Statement } from "./types";

export const POINTERS_WINDOW_STATEMENTS: Record<string, Statement> = {
  "two-sum-ii": {
    body: [
      "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers that add up to a specific `target`.",
      "Return the indices of the two numbers as [index1, index2] with 1 ≤ index1 < index2 (1-based, so add one to each 0-based index). There is exactly one solution, you may not use the same element twice, and your solution must use only constant extra space."
    ],
    why: [
      "2 + 7 = 9. They are at 1-based positions 1 and 2.",
      "2 + 4 = 6, at positions 1 and 3.",
      "−1 + 0 = −1, at positions 1 and 2."
    ],
    walk: [
      "l at 2 (position 1), r at 15 (position 4): 2 + 15 = 17 > 9, so move r left.",
      "r at 11: 2 + 11 = 13 > 9, move r left.",
      "r at 7: 2 + 7 = 9. Found it: return [1, 2]."
    ],
    cons: ["2 ≤ numbers.length ≤ 3 · 10⁴", "-1000 ≤ numbers[i] ≤ 1000", "`numbers` is sorted in non-decreasing order.", "Exactly one solution exists."]
  },
  "three-sum-closest": {
    body: [
      "Given an integer array `nums` of length n and an integer `target`, find three integers at different indices in nums such that the sum is closest to target.",
      "Return the sum of the three integers. You may assume that each input has exactly one closest sum."
    ],
    why: [
      "−1 + 2 + 1 = 2 is the closest possible sum to 1 (distance 1).",
      "The only possible sum is 0."
    ],
    walk: [
      "Sort: [−4, −1, 1, 2]. Fix one number, then move two pointers over the rest.",
      "Fix −4: −4 + (−1) + 2 = −3 (distance 4). Too small, so move the left pointer: −4 + 1 + 2 = −1 (distance 2).",
      "Fix −1: −1 + 1 + 2 = 2 (distance 1). The best so far.",
      "Nothing comes closer, so the answer is 2."
    ],
    cons: ["3 ≤ nums.length ≤ 500", "-1000 ≤ nums[i] ≤ 1000", "-10⁴ ≤ target ≤ 10⁴"]
  },
  "four-sum": {
    body: [
      "Given an array `nums` of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that a, b, c and d are different indices and the four numbers add up to `target`.",
      "The answer must not contain duplicate quadruplets. You may return them in any order."
    ],
    why: [
      "Three different groups of four numbers sum to 0.",
      "Every choice of four elements is [2, 2, 2, 2], which counts once."
    ],
    walk: [
      "Sort: [−2, −1, 0, 0, 1, 2]. Fix the first two numbers, then use two pointers for the last two.",
      "Fix −2, −1: need 3 from [0, 0, 1, 2]. 0 + 2 is too small, 0 + 2 again, then 1 + 2 = 3 ✓ → [−2, −1, 1, 2].",
      "Fix −2, 0: need 2 from [0, 1, 2]. 0 + 2 = 2 ✓ → [−2, 0, 0, 2]. The next 0 is a duplicate, skip it.",
      "Fix −1, 0: need 1 from [0, 1, 2]. 0 + 2 is too big, 0 + 1 = 1 ✓ → [−1, 0, 0, 1].",
      "No other combination works. Three quadruplets."
    ],
    cons: ["1 ≤ nums.length ≤ 200", "-10⁹ ≤ nums[i] ≤ 10⁹", "-10⁹ ≤ target ≤ 10⁹"]
  },
  "squares-sorted-array": {
    body: [
      "Given an integer array `nums` sorted in non-decreasing order, return an array of the squares of each number, also sorted in non-decreasing order.",
      "Negative numbers become positive when squared, so the biggest squares are at the two ends. Can you do it in O(n) without sorting again?"
    ],
    why: [
      "The squares are [16, 1, 0, 9, 100]; sorted, they are [0, 1, 9, 16, 100].",
      "The squares are [49, 9, 4, 9, 121]; sorted, they are [4, 9, 9, 49, 121]."
    ],
    walk: [
      "l at −4, r at 10. Fill the output from the back with the larger square.",
      "16 vs 100: write 100, move r. 16 vs 9: write 16, move l.",
      "1 vs 9: write 9, move r. 1 vs 0: write 1, move l.",
      "Only 0 is left: write 0. Result: [0, 1, 9, 16, 100]."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ ≤ nums[i] ≤ 10⁴", "`nums` is sorted in non-decreasing order."]
  },
  "merge-sorted-array": {
    body: [
      "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`: the number of real elements in nums1 and nums2.",
      "Merge nums2 into nums1 so that nums1 holds all m + n numbers in sorted order. nums1 has length m + n; its last n slots are 0 placeholders to make room. Do it in place: the function returns nothing and the judge checks nums1."
    ],
    why: [
      "Merging [1, 2, 3] and [2, 5, 6] gives [1, 2, 2, 3, 5, 6].",
      "nums2 is empty, so nums1 is unchanged.",
      "m = 0, so nums1's 0 is only a placeholder. The result is nums2's [1]."
    ],
    walk: [
      "Fill nums1 from the back. i points at 3 (the last real value of nums1), j at 6, write at index 5.",
      "6 > 3: write 6, then j moves to 5. 5 > 3: write 5, j moves to 2.",
      "3 > 2: write 3 at index 3, i moves to 2.",
      "2 vs 2: write nums2's 2. nums2 is used up; the rest of nums1 is already in place: [1, 2, 2, 3, 5, 6]."
    ],
    cons: ["nums1.length == m + n", "nums2.length == n", "0 ≤ m, n ≤ 200", "1 ≤ m + n ≤ 200", "-10⁹ ≤ nums1[i], nums2[j] ≤ 10⁹"]
  },
  "valid-palindrome-ii": {
    body: [
      "Given a string `s`, return `true` if s can be a palindrome after deleting at most one character from it."
    ],
    why: [
      "'aba' is already a palindrome.",
      "Delete 'c' (or 'b') to get 'aba'.",
      "No single deletion makes it a palindrome."
    ],
    walk: [
      "Compare from both ends: s[0] = 'a' and s[2] = 'a' match.",
      "The pointers meet in the middle without a mismatch, so return true.",
      "(On a mismatch we would try skipping either the left or the right character, and check if the rest is a palindrome.)"
    ],
    cons: ["1 ≤ s.length ≤ 10⁵", "`s` consists of lowercase English letters."]
  },
  "reverse-words": {
    body: [
      "Given an input string `s`, reverse the order of the words. A word is a sequence of non-space characters.",
      "Return a string of the words in reverse order joined by a single space. s may have leading or trailing spaces, or multiple spaces between two words; the result must not."
    ],
    why: [
      "The words in reverse order.",
      "The leading and trailing spaces are removed.",
      "The three spaces between 'good' and 'example' become one."
    ],
    walk: [
      "Split on spaces and drop the empty pieces: ['the', 'sky', 'is', 'blue'].",
      "Reverse the list: ['blue', 'is', 'sky', 'the'].",
      "Join with single spaces: 'blue is sky the'."
    ],
    cons: ["1 ≤ s.length ≤ 10⁴", "`s` contains English letters, digits and spaces.", "There is at least one word in `s`."]
  },
  "is-subsequence": {
    body: [
      "Given two strings `s` and `t`, return `true` if s is a subsequence of t, or `false` otherwise.",
      "A subsequence is formed by deleting some (possibly none) characters from a string without changing the order of the rest. For example, 'ace' is a subsequence of 'abcde', but 'aec' is not."
    ],
    why: [
      "a, b and c appear in t in that order: a, h, b, g, d, c.",
      "t has no 'x'."
    ],
    walk: [
      "Pointer i on s, scanning t from left to right.",
      "t[0] = 'a' matches s[0], so i = 1. 'h' does not match 'b'.",
      "t[2] = 'b' matches, so i = 2. 'g' and 'd' do not match 'c'.",
      "t[5] = 'c' matches, so i = 3. All of s has been matched: return true."
    ],
    cons: ["0 ≤ s.length ≤ 100", "0 ≤ t.length ≤ 10⁴", "`s` and `t` consist only of lowercase English letters."]
  },
  "boats-to-save-people": {
    body: [
      "You are given an array `people` where `people[i]` is the weight of the i-th person, and an infinite number of boats where each boat can carry a maximum weight of `limit`.",
      "Each boat carries at most two people at the same time, provided their total weight is at most limit. Return the minimum number of boats needed to carry every person. Nobody is heavier than limit."
    ],
    why: [
      "1 + 2 = 3 ≤ 3: both fit in one boat.",
      "Boats: (1, 2), (2), (3).",
      "No two people fit together (the lightest pair is 3 + 3 = 6 > 5), so everyone needs their own boat."
    ],
    walk: [
      "Sort: [1, 2]. Pair the heaviest person with the lightest person if they fit.",
      "Heaviest 2 + lightest 1 = 3 ≤ 3: they share a boat. 1 boat.",
      "Everyone is on a boat. The answer is 1."
    ],
    cons: ["1 ≤ people.length ≤ 5 · 10⁴", "1 ≤ people[i] ≤ limit ≤ 3 · 10⁴"]
  },
  "longest-mountain": {
    body: [
      "An array is a mountain if it has at least 3 elements and there is a peak index i where the values strictly increase up to i and strictly decrease after it.",
      "Given an integer array `arr`, return the length of the longest subarray that is a mountain. Return 0 if there is no mountain subarray."
    ],
    why: [
      "The longest mountain is [1, 4, 7, 3, 2], length 5.",
      "Equal neighbours are not strictly increasing, so there is no mountain."
    ],
    walk: [
      "Look for peaks: values bigger than both neighbours. 7 at index 3 is one.",
      "Walk left while values keep falling: 4, then 1. Index 0 holds 2, which is bigger than 1, so stop. The left foot is index 1.",
      "Walk right while values keep falling: 3, 2. Index 6 holds 5, which is bigger than 2, so stop. The right foot is index 5.",
      "The length is 5 − 1 + 1 = 5. No other peak gives a longer mountain."
    ],
    cons: ["1 ≤ arr.length ≤ 10⁴", "0 ≤ arr[i] ≤ 10⁴"]
  },
  "partition-labels": {
    body: [
      "You are given a string `s`. Partition it into as many parts as possible so that each letter appears in at most one part. Joined back together in order, the parts must form s.",
      "Return a list of the sizes of these parts."
    ],
    why: [
      "The parts are 'ababcbaca', 'defegde' and 'hijhklij'. Splitting into fewer, bigger parts is also valid, but not as many parts.",
      "Every letter's occurrences overlap, so the whole string is one part."
    ],
    walk: [
      "Record each letter's last index: a → 8, b → 5, c → 7, d → 14, e → 15, …",
      "Start a part at 0. 'a' extends the end to 8; 'b' (5) and 'c' (7) stay inside. At i = 8, i reaches the end: the part has size 9.",
      "Start at 9: d → 14, e → 15, f → 11, g → 13. At i = 15 the part closes with size 7.",
      "Start at 16: h, i, j, k, l push the end to 23. At i = 23 the part closes with size 8. Result: [9, 7, 8]."
    ],
    cons: ["1 ≤ s.length ≤ 500", "`s` consists of lowercase English letters."]
  },
  "find-anagrams": {
    body: [
      "Given two strings `s` and `p`, return an array of all the start indices of p's anagrams in s. You may return the answer in any order.",
      "An anagram uses exactly the same letters as p, the same number of times."
    ],
    why: [
      "'cba' starts at index 0 and 'bac' at index 6.",
      "'ab' at 0, 'ba' at 1, and 'ab' at 2."
    ],
    walk: [
      "Slide a window of length 3 (the length of p) over s and compare letter counts with p's {a: 1, b: 1, c: 1}.",
      "Index 0: 'cba' ✓.",
      "Indices 1–5: 'bae', 'aeb', 'eba', 'bab', 'aba' ✗.",
      "Index 6: 'bac' ✓. Index 7: 'acd' ✗. Result: [0, 6]."
    ],
    cons: ["1 ≤ s.length, p.length ≤ 3 · 10⁴", "`s` and `p` consist of lowercase English letters."]
  },
  "permutation-in-string": {
    body: [
      "Given two strings `s1` and `s2`, return `true` if s2 contains a permutation of s1, or `false` otherwise.",
      "In other words, return true if one of s1's rearrangements appears in s2 as a contiguous substring."
    ],
    why: [
      "s2 contains 'ba', a permutation of 'ab'.",
      "'a' and 'b' never appear next to each other in s2."
    ],
    walk: [
      "Slide a window of length 2 over s2 and compare letter counts with {a: 1, b: 1}.",
      "'ei' ✗, 'id' ✗, 'db' ✗.",
      "'ba' ✓. Return true."
    ],
    cons: ["1 ≤ s1.length, s2.length ≤ 10⁴", "`s1` and `s2` consist of lowercase English letters."]
  },
  "max-consecutive-ones-iii": {
    body: [
      "Given a binary array `nums` and an integer `k`, return the maximum number of consecutive 1s in the array if you can flip at most k 0s."
    ],
    why: [
      "Flip the zeros at indices 5 and 10: indices 5–10 then hold six 1s.",
      "Flip the zeros at indices 4, 5 and 9: indices 2–11 then hold ten 1s."
    ],
    walk: [
      "Grow a window to the right, counting the zeros inside it. If there are more than k = 2, move the left edge.",
      "r = 0..4: the window [0, 4] has 2 zeros, length 5.",
      "r = 5: 3 zeros. Move l past the first zero (index 3) → l = 4.",
      "r = 6..9 are 1s: the window [4, 9] has length 6.",
      "r = 10 is a zero: move l past index 4 → window [5, 10], length 6. The answer is 6."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁵", "nums[i] is 0 or 1.", "0 ≤ k ≤ nums.length"]
  },
  "longest-repeating-char-replacement": {
    body: [
      "You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English letter. You can do this at most k times.",
      "Return the length of the longest substring containing the same letter you can get after performing these operations."
    ],
    why: [
      "Replace both 'A's with 'B's (or both 'B's with 'A's) to get 'BBBB'.",
      "Replace the 'A' at index 3 to get 'AABBBBA'; the substring 'BBBB' has length 4."
    ],
    walk: [
      "A window is fine if (window length − count of its most common letter) ≤ k: that many letters need changing.",
      "'A': fine. 'AB': 2 − 1 = 1 ≤ 2. 'ABA': 3 − 2 = 1 ≤ 2.",
      "'ABAB': 4 − 2 = 2 ≤ 2. Still fine, length 4.",
      "That is the whole string, so the answer is 4."
    ],
    cons: ["1 ≤ s.length ≤ 10⁵", "`s` consists of only uppercase English letters.", "0 ≤ k ≤ s.length"]
  },
  "fruit-into-baskets": {
    body: [
      "You are visiting a farm with a single row of fruit trees. `fruits[i]` is the type of fruit tree i produces. You have two baskets, and each basket can hold only one type of fruit, as much as you like.",
      "Starting at any tree, you must pick exactly one fruit from every tree while moving right, and you stop at the first tree whose fruit doesn't fit in your baskets. Return the maximum number of fruits you can pick."
    ],
    why: [
      "Only two types (1 and 2), so you can pick from all three trees.",
      "Start at tree 1: [1, 2, 2]. Starting at tree 0 you would have to stop at tree 2 (a third type).",
      "Pick from trees 1–4: [2, 3, 2, 2]."
    ],
    walk: [
      "Grow a window to the right with a count of each type, shrinking from the left when there are more than 2 types.",
      "1 → {1: 1}. 2 → {1: 1, 2: 1}. 1 → {1: 2, 2: 1}.",
      "The window never holds more than 2 types, so it covers all 3 trees: the answer is 3."
    ],
    cons: ["1 ≤ fruits.length ≤ 10⁵", "0 ≤ fruits[i] < fruits.length"]
  },
  "longest-substring-k-distinct": {
    body: [
      "Given a string `s` and an integer `k`, return the length of the longest substring of s that contains at most k distinct characters."
    ],
    why: [
      "'ece' has 2 distinct characters and length 3.",
      "'aa' has 1 distinct character."
    ],
    walk: [
      "Grow a window with character counts, shrinking from the left when there are more than k = 2 distinct.",
      "'e', 'ec', 'ece': at most 2 distinct. best = 3.",
      "Add 'b' → 3 distinct. Drop 'e' (one e is still inside), then 'c' → window 'eb'.",
      "Add 'a' → 3 distinct. Drop 'e' → 'ba'. The best stays 3."
    ],
    cons: ["1 ≤ s.length ≤ 5 · 10⁴", "0 ≤ k ≤ 50"]
  },
  "min-size-subarray-sum": {
    body: [
      "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to target.",
      "If there is no such subarray, return 0."
    ],
    why: [
      "[4, 3] sums to 7 with only 2 elements.",
      "[4] alone reaches 4.",
      "The whole array only sums to 8 < 11."
    ],
    walk: [
      "Grow the window to the right; while its sum is ≥ 7, record the length and shrink from the left.",
      "2 + 3 + 1 + 2 = 8 ≥ 7: length 4. Drop 2 → 6.",
      "Add 4 → 10: length 4. Drop 3 → 7: length 3. Drop 1 → 6.",
      "Add 3 → 9: length 3. Drop 2 → 7: length 2. Drop 4 → 3.",
      "The shortest length seen is 2."
    ],
    cons: ["1 ≤ target ≤ 10⁹", "1 ≤ nums.length ≤ 10⁵", "1 ≤ nums[i] ≤ 10⁴"]
  },
  "sliding-window-maximum": {
    body: [
      "You are given an array of integers `nums` and a sliding window of size `k` that moves from the very left of the array to the very right, one position at a time. You can only see the k numbers in the window.",
      "Return an array of the maximum of each window position."
    ],
    why: [
      "The windows are [1,3,−1] → 3, [3,−1,−3] → 3, [−1,−3,5] → 5, [−3,5,3] → 5, [5,3,6] → 6, [3,6,7] → 7.",
      "One window, [1]."
    ],
    walk: [
      "Keep a deque of indices whose values are decreasing. The front is always the window's maximum.",
      "1, then 3: 3 is bigger, so pop 1. Then −1. The deque is [3, −1] and the first window's max is 3.",
      "−3: deque [3, −1, −3], max 3.",
      "5: pop everything smaller (−3, −1); 3 has left the window. Deque [5], max 5.",
      "3 → [5, 3], max 5. 6 pops both → max 6. 7 pops 6 → max 7. Result: [3, 3, 5, 5, 6, 7]."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴", "1 ≤ k ≤ nums.length"]
  },
  "subarrays-k-distinct": {
    body: [
      "Given an integer array `nums` and an integer `k`, return the number of good subarrays of nums.",
      "A good subarray is a contiguous part of the array that contains exactly k different integers. For example, [1,2,3,1,2] contains 3 different integers."
    ],
    why: [
      "The 7 subarrays with exactly 2 different integers are [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2] and [1,2,1,2].",
      "The 3 subarrays are [1,2,1,3], [2,1,3] and [1,3,4]."
    ],
    walk: [
      "exactly(k) = atMost(k) − atMost(k − 1), and atMost is an easy sliding window.",
      "atMost(2): the number of valid windows ending at each index is 1, 2, 3, 4, 2 → 12.",
      "atMost(1): each index can only end the single-element window → 5.",
      "12 − 5 = 7."
    ],
    cons: ["1 ≤ nums.length ≤ 2 · 10⁴", "1 ≤ nums[i], k ≤ nums.length"]
  },
  "count-nice-subarrays": {
    body: [
      "Given an array of integers `nums` and an integer `k`, a contiguous subarray is called nice if there are exactly k odd numbers in it.",
      "Return the number of nice subarrays."
    ],
    why: [
      "[1,1,2,1] and [1,2,1,1] each contain exactly three odd numbers.",
      "There are no odd numbers.",
      "Any subarray containing both 1s (indices 3 and 6) is nice: 4 choices of start × 4 choices of end = 16."
    ],
    walk: [
      "Count the odd numbers seen so far (the prefix count). Remember how often each prefix count appeared, starting with {0: 1}.",
      "1 → prefix 1. 1 → prefix 2. 2 → prefix 2 (seen twice now).",
      "1 → prefix 3. A prefix of 3 − 3 = 0 was seen once → +1.",
      "1 → prefix 4. A prefix of 1 was seen once → +1. Total 2."
    ],
    cons: ["1 ≤ nums.length ≤ 5 · 10⁴", "1 ≤ nums[i] ≤ 10⁵", "1 ≤ k ≤ nums.length"]
  },
  "max-points-cards": {
    body: [
      "Several cards are arranged in a row, and each card has some points, given in the array `cardPoints`.",
      "In one step you can take one card from the beginning or from the end of the row. You have to take exactly `k` cards. Your score is the sum of the points of the cards you have taken. Return the maximum score you can obtain."
    ],
    why: [
      "Take the three cards on the right: 1 + 6 + 5 = 12.",
      "Any two cards give 2 + 2 = 4.",
      "You must take all 7 cards: the sum is 55."
    ],
    walk: [
      "Whatever you take, the cards left behind form one contiguous block of n − k = 4 cards. So find the block with the smallest sum.",
      "The total is 22. The blocks of 4: [1,2,3,4] = 10, [2,3,4,5] = 14, [3,4,5,6] = 18, [4,5,6,1] = 16.",
      "The smallest is 10, so the best score is 22 − 10 = 12."
    ],
    cons: ["1 ≤ cardPoints.length ≤ 10⁵", "1 ≤ cardPoints[i] ≤ 10⁴", "1 ≤ k ≤ cardPoints.length"]
  },
  "longest-subarray-limit": {
    body: [
      "Given an array of integers `nums` and an integer `limit`, return the size of the longest non-empty subarray in which the absolute difference between any two elements is less than or equal to limit.",
      "That is the same as saying the subarray's maximum minus its minimum is at most limit."
    ],
    why: [
      "[2, 4] (difference 2) and [4, 7] (difference 3) are the longest. [2, 4, 7] has difference 5 > 4.",
      "[2, 4, 7, 2] has max 7 and min 2: difference 5 ≤ 5.",
      "[2, 2, 2] has difference 0."
    ],
    walk: [
      "Grow a window, tracking its max and min (two deques make this fast). Shrink while max − min > 4.",
      "[8]: fine. [8, 2]: 6 > 4, drop 8 → [2].",
      "[2, 4]: 2 ≤ 4, length 2.",
      "[2, 4, 7]: 5 > 4, drop 2 → [4, 7], length 2. The answer is 2."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁵", "1 ≤ nums[i] ≤ 10⁹", "0 ≤ limit ≤ 10⁹"]
  },
  "equal-substrings-budget": {
    body: [
      "You are given two strings `s` and `t` of the same length and an integer `maxCost`. Changing s[i] into t[i] costs |s[i] − t[i]|, the difference of their character codes.",
      "Return the maximum length of a substring of s that can be changed into the matching substring of t with a total cost of at most maxCost. If no substring can be changed, return 0."
    ],
    why: [
      "'abc' → 'bcd' costs 1 + 1 + 1 = 3.",
      "Each change costs 2, so only one character fits in the budget.",
      "s[0] = t[0] = 'a' costs nothing, so the substring 'a' works."
    ],
    walk: [
      "The cost of each position: [1, 1, 1, 2].",
      "Grow a window: 1, 2, 3 (indices 0–2). Length 3 within budget.",
      "Add index 3 → 5 > 3. Drop index 0 → 4, still too much. Drop index 1 → 3: window [2, 3], length 2.",
      "The best length is 3."
    ],
    cons: ["1 ≤ s.length ≤ 10⁵", "t.length == s.length", "0 ≤ maxCost ≤ 10⁶", "`s` and `t` consist of only lowercase English letters."]
  },
  "remove-duplicates-sorted-ii": {
    body: [
      "Given an integer array `nums` sorted in non-decreasing order, remove some duplicates in place so that each unique element appears at most twice. The relative order of the elements should stay the same.",
      "Use O(1) extra memory. In this version, return the kept part of the array (the first k elements) as an array."
    ],
    why: [
      "1 appears three times; one copy is removed.",
      "1 appears four times; two copies are removed."
    ],
    walk: [
      "The first two elements are always kept, so write = 2. Compare each new value with nums[write − 2].",
      "read 2 (1): equals nums[0] = 1, so a third 1 would be too many. Skip.",
      "read 3 (2): differs from nums[0] = 1 → nums[2] = 2, write = 3.",
      "read 4 (2): differs from nums[1] = 1 → nums[3] = 2, write = 4.",
      "read 5 (3): differs from nums[2] = 2 → nums[4] = 3, write = 5. Kept: [1, 1, 2, 2, 3]."
    ],
    cons: ["1 ≤ nums.length ≤ 3 · 10⁴", "-10⁴ ≤ nums[i] ≤ 10⁴", "`nums` is sorted in non-decreasing order."]
  }
};
