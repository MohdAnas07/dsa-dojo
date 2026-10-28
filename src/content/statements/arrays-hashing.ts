import type { Statement } from "./types";

export const ARRAYS_HASHING_STATEMENTS: Record<string, Statement> = {
  "majority-element": {
    body: [
      "Given an array `nums` of size n, return the majority element: the element that appears more than ⌊n / 2⌋ times.",
      "You may assume that the majority element always exists in the array. Can you solve it in O(n) time and O(1) extra space?"
    ],
    why: [
      "n = 3, so the majority must appear more than 1 time. 3 appears twice.",
      "n = 7, so it must appear more than 3 times. 2 appears 4 times."
    ],
    walk: [
      "Boyer–Moore voting: keep a `candidate` and a `count`.",
      "3: count is 0, so candidate = 3, count = 1.",
      "2: different from the candidate → count = 0.",
      "3: count is 0, so candidate = 3, count = 1. The candidate left standing, 3, is the majority."
    ],
    cons: ["n == nums.length", "1 ≤ n ≤ 5 · 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "The majority element always exists."]
  },
  "missing-number": {
    body: [
      "Given an array `nums` containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
      "Note that the range has n + 1 numbers but the array holds only n of them, so exactly one is missing."
    ],
    why: [
      "n = 3, so the range is 0–3. 2 is missing.",
      "n = 2, so the range is 0–2. 2 is missing (it can be the largest number).",
      "n = 9, so the range is 0–9. 8 is missing."
    ],
    walk: [
      "n = 3. The sum of 0 + 1 + 2 + 3 is n(n + 1) / 2 = 6.",
      "The actual sum is 3 + 0 + 1 = 4.",
      "The difference, 6 − 4 = 2, is the missing number."
    ],
    cons: ["n == nums.length", "1 ≤ n ≤ 10⁴", "0 ≤ nums[i] ≤ n", "All the numbers of `nums` are unique."]
  },
  "intersection-two-arrays-ii": {
    body: [
      "Given two integer arrays `nums1` and `nums2`, return an array of their intersection.",
      "Each element in the result must appear as many times as it shows in both arrays (the smaller of the two counts). You may return the result in any order."
    ],
    why: [
      "2 appears twice in both arrays, so it appears twice in the result. 1 is not in nums2.",
      "9 appears once in nums1 (twice in nums2), so it appears once. 4 also appears once. [4, 9] is also accepted."
    ],
    walk: [
      "Count nums1: {1: 2, 2: 2}.",
      "nums2[0] = 2: count is 2 > 0 → output 2, count becomes 1.",
      "nums2[1] = 2: count is 1 > 0 → output 2, count becomes 0.",
      "Result: [2, 2]."
    ],
    cons: ["1 ≤ nums1.length, nums2.length ≤ 1000", "0 ≤ nums1[i], nums2[i] ≤ 1000"]
  },
  "plus-one": {
    body: [
      "You are given a large integer represented as an integer array `digits`, where each `digits[i]` is a digit. The digits are ordered from most significant to least significant, and there are no leading zeros.",
      "Increment the large integer by one and return the resulting array of digits."
    ],
    why: [
      "123 + 1 = 124.",
      "4321 + 1 = 4322.",
      "9 + 1 = 10: the carry creates a new leading digit."
    ],
    walk: [
      "Start at the last digit, 3.",
      "3 is not 9, so add 1 → 4. There is no carry, so stop.",
      "Result: [1, 2, 4]. (For a 9 we would write 0 and carry 1 to the next digit to the left.)"
    ],
    cons: ["1 ≤ digits.length ≤ 100", "0 ≤ digits[i] ≤ 9", "`digits` has no leading zeros (except the number 0 itself)."]
  },
  "pascals-triangle": {
    body: [
      "Given an integer `numRows`, return the first numRows rows of Pascal's triangle.",
      "In Pascal's triangle, every row starts and ends with 1, and each number inside is the sum of the two numbers directly above it."
    ],
    why: [
      "Each inner number is the sum of the two above it: 2 = 1 + 1, 3 = 1 + 2, 6 = 3 + 3, 4 = 3 + 1.",
      "Only the first row, [1]."
    ],
    walk: [
      "Row 0: [1].",
      "Row 1: [1, 1].",
      "Row 2: 1, then 1 + 1 = 2, then 1 → [1, 2, 1].",
      "Row 3: 1, 1 + 2 = 3, 2 + 1 = 3, 1 → [1, 3, 3, 1].",
      "Row 4: 1, 4, 6, 4, 1."
    ],
    cons: ["1 ≤ numRows ≤ 30"]
  },
  "isomorphic-strings": {
    body: [
      "Given two strings `s` and `t`, determine if they are isomorphic.",
      "Two strings are isomorphic if the characters in s can be replaced to get t. Every occurrence of a character must be replaced with the same character, and no two different characters may map to the same character. A character may map to itself."
    ],
    why: [
      "e → a and g → d turns 'egg' into 'add'.",
      "'o' would have to become both 'a' and 'r'.",
      "p → t, a → i, e → l, r → e turns 'paper' into 'title'."
    ],
    walk: [
      "Keep two maps: s → t and t → s.",
      "e ↔ a: both new, record them.",
      "g ↔ d: both new, record them.",
      "g ↔ d: matches what we recorded. No conflicts, so return true."
    ],
    cons: ["1 ≤ s.length ≤ 5 · 10⁴", "t.length == s.length", "`s` and `t` consist of any valid ASCII characters."]
  },
  "word-pattern": {
    body: [
      "Given a `pattern` and a string `s` of words separated by single spaces, find if s follows the same pattern.",
      "Following means a one-to-one match: each letter in the pattern maps to exactly one word, and each word maps to exactly one letter. The number of words must equal the pattern length."
    ],
    why: [
      "a ↔ dog and b ↔ cat.",
      "The last 'a' would map to 'fish', but 'a' already maps to 'dog'.",
      "All four letters are 'a', but the words differ."
    ],
    walk: [
      "Split s into words: [dog, cat, cat, dog]. There are 4 words for 4 letters.",
      "a ↔ dog: new, record it. b ↔ cat: new, record it.",
      "b ↔ cat: consistent. a ↔ dog: consistent.",
      "No conflicts, so return true."
    ],
    cons: ["1 ≤ pattern.length ≤ 300", "`pattern` contains only lowercase English letters.", "1 ≤ s.length ≤ 3000", "`s` contains lowercase letters and single spaces, with no leading or trailing spaces."]
  },
  "ransom-note": {
    body: [
      "Given two strings `ransomNote` and `magazine`, return `true` if ransomNote can be constructed by using the letters from magazine, and `false` otherwise.",
      "Each letter in magazine can only be used once in ransomNote."
    ],
    why: [
      "The magazine has no 'a'.",
      "The note needs two 'a's, but the magazine has only one.",
      "The magazine has two 'a's (and a spare 'b')."
    ],
    walk: [
      "Count the magazine's letters: {b: 1}.",
      "The note needs 'a', but there are 0 'a's available.",
      "Return false."
    ],
    cons: ["1 ≤ ransomNote.length, magazine.length ≤ 10⁵", "Both strings consist of lowercase English letters."]
  },
  "first-unique-char": {
    body: [
      "Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return −1."
    ],
    why: [
      "'l' (index 0) appears only once.",
      "'l' and 'o' repeat; 'v' at index 2 is the first character that appears once.",
      "Every character appears twice."
    ],
    walk: [
      "Count every character: {l: 1, e: 3, t: 1, c: 1, o: 1, d: 1}.",
      "Scan from the left: s[0] = 'l' has count 1.",
      "Return 0."
    ],
    cons: ["1 ≤ s.length ≤ 10⁵", "`s` consists of only lowercase English letters."]
  },
  "happy-number": {
    body: [
      "Write an algorithm to determine if a number `n` is happy.",
      "Starting with n, replace the number by the sum of the squares of its digits, and repeat. If the process reaches 1, the number is happy. Otherwise it loops forever in a cycle that does not include 1, and the number is not happy."
    ],
    why: [
      "19 → 1² + 9² = 82 → 8² + 2² = 68 → 6² + 8² = 100 → 1² + 0² + 0² = 1.",
      "2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4, which is a loop that never reaches 1."
    ],
    walk: [
      "19: 1 + 81 = 82.",
      "82: 64 + 4 = 68.",
      "68: 36 + 64 = 100.",
      "100: 1 + 0 + 0 = 1. We reached 1, so 19 is happy. (To detect a loop, use a set of seen numbers, or fast and slow pointers.)"
    ],
    cons: ["1 ≤ n ≤ 2³¹ − 1"]
  },
  "contains-duplicate-ii": {
    body: [
      "Given an integer array `nums` and an integer `k`, return `true` if there are two distinct indices i and j in the array such that nums[i] == nums[j] and |i − j| ≤ k."
    ],
    why: [
      "The 1s at indices 0 and 3 are 3 apart, and 3 ≤ 3.",
      "The 1s at indices 2 and 3 are 1 apart.",
      "Every pair of equal values is 3 apart, which is more than 2."
    ],
    walk: [
      "Keep a map of each value's last index.",
      "i = 0..2: 1 → 0, 2 → 1, 3 → 2.",
      "i = 3, value 1: last seen at index 0, distance 3 ≤ k = 3. Return true."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹", "0 ≤ k ≤ 10⁵"]
  },
  "valid-sudoku": {
    body: [
      "Determine if a 9 × 9 Sudoku board is valid. Only the filled cells need to be checked: each row must contain the digits 1–9 without repetition, each column must too, and so must each of the nine 3 × 3 boxes.",
      "Empty cells are written as '.'. The board does not have to be solvable; it only must not break the rules so far."
    ],
    why: [
      "No digit repeats in any row, column or box.",
      "Same as Example 1, except the top-left cell is now 8. Column 0 then has two 8s, and so does the top-left box."
    ],
    walk: [
      "Keep a set for each row, each column and each box. The box index is ⌊row / 3⌋ · 3 + ⌊col / 3⌋.",
      "Cell (0,0) = '5': record it in row 0, column 0 and box 0.",
      "Cell (0,1) = '3': record it in row 0, column 1 and box 0. Continue cell by cell, skipping '.'.",
      "A digit already in its row, column or box set would make the board invalid. That never happens here, so return true."
    ],
    cons: ["board.length == 9", "board[i].length == 9", "board[i][j] is a digit 1–9 or '.'."]
  },
  "sort-colors": {
    body: [
      "Given an array `nums` with n objects colored red, white or blue, sort them in place so that objects of the same color are adjacent, in the order red, white, blue.",
      "The colors are represented by 0 (red), 1 (white) and 2 (blue). You must solve this without the library's sort function. Can you do it in one pass with O(1) extra space?"
    ],
    why: [
      "Two of each color, sorted.",
      "One of each color, sorted."
    ],
    walk: [
      "Three pointers: everything before `lo` is 0, everything after `hi` is 2, and `mid` scans. lo = mid = 0, hi = 5.",
      "nums[0] = 2: swap with nums[5] → [0,0,2,1,1,2], hi = 4.",
      "nums[0] = 0: swap with nums[lo] (itself), lo = mid = 1. nums[1] = 0: same, lo = mid = 2.",
      "nums[2] = 2: swap with nums[4] → [0,0,1,1,2,2], hi = 3.",
      "nums[2] = 1 and nums[3] = 1: just move mid. mid passes hi, so we are done: [0,0,1,1,2,2]."
    ],
    cons: ["n == nums.length", "1 ≤ n ≤ 300", "nums[i] is 0, 1 or 2."]
  },
  "next-permutation": {
    body: [
      "A permutation of an array is an arrangement of its members. The next permutation is the next greater arrangement in dictionary (lexicographic) order. If the array is already the greatest arrangement, the next one wraps around to the smallest (sorted ascending).",
      "Given an array of integers `nums`, rearrange it into its next permutation in place, using only constant extra memory."
    ],
    why: [
      "The arrangements of 1, 2, 3 in order are 123, 132, 213, 231, 312, 321. After 123 comes 132.",
      "321 is the last arrangement, so we wrap around to 123.",
      "After 115 comes 151."
    ],
    walk: [
      "From the right, find the first index i with nums[i] < nums[i + 1]: i = 1 (2 < 3). This is the digit to bump up.",
      "From the right, find the first value bigger than nums[i] = 2: it is 3 at index 2.",
      "Swap them → [1, 3, 2].",
      "Reverse everything after index i (here just [2]), so the tail is as small as possible. Result: [1, 3, 2]."
    ],
    cons: ["1 ≤ nums.length ≤ 100", "0 ≤ nums[i] ≤ 100"]
  },
  "spiral-matrix": {
    body: [
      "Given an m × n `matrix`, return all elements of the matrix in spiral order: along the top row left to right, down the right column, back along the bottom row, up the left column, then the same for the inner layers."
    ],
    why: [
      "Outer ring 1, 2, 3, 6, 9, 8, 7, 4, then the centre 5.",
      "Outer ring 1, 2, 3, 4, 8, 12, 11, 10, 9, 5, then the inner row 6, 7."
    ],
    walk: [
      "Boundaries: top = 0, bottom = 2, left = 0, right = 2.",
      "Top row left → right: 1, 2, 3. Then top = 1.",
      "Right column top → bottom: 6, 9. Then right = 1.",
      "Bottom row right → left: 8, 7. Then bottom = 1.",
      "Left column bottom → top: 4. Then left = 1.",
      "The inner layer is the single cell 5. Result: [1,2,3,6,9,8,7,4,5]."
    ],
    cons: ["m == matrix.length", "n == matrix[i].length", "1 ≤ m, n ≤ 10", "-100 ≤ matrix[i][j] ≤ 100"]
  },
  "rotate-image": {
    body: [
      "You are given an n × n 2D `matrix` representing an image. Rotate the image by 90 degrees clockwise.",
      "You have to rotate the image in place, which means you modify the input matrix directly. Do not allocate another 2D matrix."
    ],
    why: [
      "The first column read bottom-up (7, 4, 1) becomes the first row.",
      "Same rule on a 4 × 4 matrix: the first column read bottom-up (15, 13, 2, 5) becomes the first row."
    ],
    walk: [
      "Transpose (swap matrix[i][j] with matrix[j][i]): [[1,4,7],[2,5,8],[3,6,9]].",
      "Reverse each row: [7,4,1], [8,5,2], [9,6,3].",
      "Result: [[7,4,1],[8,5,2],[9,6,3]]."
    ],
    cons: ["n == matrix.length == matrix[i].length", "1 ≤ n ≤ 20", "-1000 ≤ matrix[i][j] ≤ 1000"]
  },
  "set-matrix-zeroes": {
    body: [
      "Given an m × n integer `matrix`, if an element is 0, set its entire row and column to 0s.",
      "You must do it in place. Be careful: zeros you write must not cause more rows and columns to be cleared, so find the original zeros first."
    ],
    why: [
      "The 0 at (1,1) clears row 1 and column 1.",
      "The zeros at (0,0) and (0,3) clear row 0, column 0 and column 3."
    ],
    walk: [
      "Scan for the original zeros: only (1,1). So zero rows = {1} and zero columns = {1}.",
      "Clear row 1: [0, 0, 0].",
      "Clear column 1 in the other rows: [1, 0, 1] and [1, 0, 1].",
      "Result: [[1,0,1],[0,0,0],[1,0,1]]."
    ],
    cons: ["m == matrix.length", "n == matrix[0].length", "1 ≤ m, n ≤ 200", "-2³¹ ≤ matrix[i][j] ≤ 2³¹ − 1"]
  },
  "game-of-life": {
    body: [
      "The board is an m × n grid of cells, where each cell is live (1) or dead (0). Each cell interacts with its eight neighbours (horizontal, vertical and diagonal).",
      "A live cell with fewer than two live neighbours dies, one with two or three lives on, and one with more than three dies. A dead cell with exactly three live neighbours becomes live. All cells change at the same moment. Update the board in place to its next state."
    ],
    why: [
      "For example, (1,0) is dead with 3 live neighbours, so it becomes live; (0,1) is live with only 1 live neighbour, so it dies.",
      "The dead cell (1,1) has exactly 3 live neighbours and becomes live. The live cells each have 2 neighbours and survive."
    ],
    walk: [
      "Count the live neighbours of each cell using the current state.",
      "(0,1) is live with 1 neighbour → dies. (1,0) is dead with 3 → becomes live.",
      "(1,2) is live with 3 → survives. (2,0) is live with 1 → dies. (2,1) is live with 3 → survives.",
      "(3,1) is dead with 3 → becomes live. (1,1) is dead with 5 → stays dead.",
      "To do this in place, mark changes with temporary values (for example 2 = was live, now dead) and convert them at the end."
    ],
    cons: ["m == board.length", "n == board[i].length", "1 ≤ m, n ≤ 25", "board[i][j] is 0 or 1."]
  },
  "longest-common-prefix": {
    body: [
      "Write a function to find the longest common prefix string among an array of strings.",
      "If there is no common prefix, return an empty string \"\"."
    ],
    why: [
      "All three words start with 'fl'; the third letter differs ('o', 'o', 'i').",
      "The first letters already differ."
    ],
    walk: [
      "Compare the words column by column.",
      "Index 0: f, f, f ✓. Index 1: l, l, l ✓.",
      "Index 2: o, o, i ✗. Stop.",
      "The prefix is 'fl'."
    ],
    cons: ["1 ≤ strs.length ≤ 200", "0 ≤ strs[i].length ≤ 200", "`strs[i]` consists of only lowercase English letters."]
  },
  "max-product-subarray": {
    body: [
      "Given an integer array `nums`, find a contiguous non-empty subarray that has the largest product, and return the product.",
      "Watch out for negative numbers: two negatives multiply to a positive, so the smallest product so far can suddenly become the largest."
    ],
    why: [
      "[2, 3] has product 6.",
      "The answer is 0 (just [0]). [−2, −1] would give 2, but those elements are not next to each other.",
      "The whole array: −2 × 3 × −4 = 24."
    ],
    walk: [
      "Track the largest and smallest product of a subarray ending here.",
      "2: max = 2, min = 2, best = 2.",
      "3: candidates 3, 2·3, 2·3 → max = 6, min = 3, best = 6.",
      "−2: candidates −2, 6·(−2) = −12, 3·(−2) = −6 → max = −2, min = −12.",
      "4: candidates 4, −8, −48 → max = 4, min = −48. The best stays 6."
    ],
    cons: ["1 ≤ nums.length ≤ 2 · 10⁴", "-10 ≤ nums[i] ≤ 10", "Every prefix or suffix product fits in a 32-bit integer."]
  },
  "subarray-sums-divisible-k": {
    body: [
      "Given an integer array `nums` and an integer `k`, return the number of non-empty subarrays that have a sum divisible by k.",
      "A subarray is a contiguous part of the array. Numbers may be negative."
    ],
    why: [
      "The 7 subarrays are [4,5,0,−2,−3,1], [5], [5,0], [5,0,−2,−3], [0], [0,−2,−3] and [−2,−3].",
      "5 is not divisible by 9."
    ],
    walk: [
      "Two prefix sums with the same remainder mod k enclose a subarray divisible by k. Count remainders, starting with {0: 1}.",
      "Prefix 4 → remainder 4: seen 0 times. Prefix 9 → 4: seen once, answer 1.",
      "Prefix 9 → 4: seen twice, answer 3. Prefix 7 → 2: new.",
      "Prefix 4 → 4: seen three times, answer 6.",
      "Prefix 5 → 0: seen once (the starting 0), answer 7."
    ],
    cons: ["1 ≤ nums.length ≤ 3 · 10⁴", "-10⁴ ≤ nums[i] ≤ 10⁴", "2 ≤ k ≤ 10⁴"]
  },
  "continuous-subarray-sum": {
    body: [
      "Given an integer array `nums` and an integer `k`, return `true` if nums has a good subarray, or `false` otherwise.",
      "A good subarray has length at least two and a sum that is a multiple of k. 0 is always a multiple of k."
    ],
    why: [
      "[2, 4] sums to 6, which is a multiple of 6.",
      "The whole array sums to 42 = 7 × 6.",
      "No subarray of length ≥ 2 sums to a multiple of 13."
    ],
    walk: [
      "Store the first index at which each prefix-sum remainder appears, starting with {0: −1}.",
      "23 → remainder 5, store 5 → 0.",
      "25 → remainder 1, store 1 → 1.",
      "29 → remainder 5, already seen at index 0. The subarray from index 1 to 2 has length 2 ≥ 2, so return true."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁵", "0 ≤ nums[i] ≤ 10⁹", "1 ≤ k ≤ 2³¹ − 1"]
  },
  "range-sum-query": {
    body: [
      "Given an integer array `nums`, handle many queries of the form: what is the sum of the elements between indices left and right, inclusive?",
      "Implement the `NumArray` class: the constructor receives `nums`, and `sumRange(left, right)` returns nums[left] + nums[left + 1] + … + nums[right].",
      "The example lists the calls on one line and their arguments on the next; null is what the constructor returns."
    ],
    why: [
      "sumRange(0, 2) = −2 + 0 + 3 = 1. sumRange(2, 5) = 3 − 5 + 2 − 1 = −1. sumRange(0, 5) = −3."
    ],
    walk: [
      "Precompute prefix sums once: pre = [0, −2, −2, 1, −4, −2, −3], where pre[i] is the sum of the first i elements.",
      "sumRange(0, 2) = pre[3] − pre[0] = 1 − 0 = 1.",
      "sumRange(2, 5) = pre[6] − pre[2] = −3 − (−2) = −1.",
      "sumRange(0, 5) = pre[6] − pre[0] = −3. Each query takes O(1)."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁴", "-10⁵ ≤ nums[i] ≤ 10⁵", "0 ≤ left ≤ right < nums.length", "At most 10⁴ calls to sumRange."]
  },
  "pivot-index": {
    body: [
      "Given an array of integers `nums`, calculate the pivot index: the index where the sum of all numbers strictly to its left equals the sum of all numbers strictly to its right.",
      "If the index is at the left edge, the left sum is 0 (and likewise for the right edge). Return the leftmost pivot index, or −1 if none exists."
    ],
    why: [
      "Left of index 3: 1 + 7 + 3 = 11. Right of it: 5 + 6 = 11.",
      "No index has equal sums on both sides.",
      "At index 0 the left sum is 0 and the right sum is 1 + (−1) = 0."
    ],
    walk: [
      "Total = 28. Walk with a running left sum; right sum = total − left − nums[i].",
      "i = 0: left 0, right 27. i = 1: left 1, right 20.",
      "i = 2: left 8, right 17.",
      "i = 3: left 11, right 28 − 11 − 6 = 11. Equal, so return 3."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁴", "-1000 ≤ nums[i] ≤ 1000"]
  },
  "find-duplicate-number": {
    body: [
      "Given an array `nums` containing n + 1 integers where each integer is in the range [1, n], there is exactly one repeated number (it may repeat more than once). Return this repeated number.",
      "You must solve the problem without modifying the array and using only constant extra space."
    ],
    why: [
      "2 appears twice.",
      "3 appears twice.",
      "3 appears five times."
    ],
    walk: [
      "Treat each value as a pointer to an index: 0 → 1 → 3 → 2 → 4 → 2 → 4 … The repeated value is where the loop starts.",
      "Phase 1: slow moves 1 step and fast 2 steps from index 0. slow 1, 3, 2, 4; fast 3, 4, 4, 4. They meet at 4.",
      "Phase 2: restart one pointer at 0 and move both 1 step. 0 → 1 → 3 → 2 and 4 → 2 → 4 → 2.",
      "They meet at 2, the entrance of the loop. The duplicate is 2."
    ],
    cons: ["1 ≤ n ≤ 10⁵", "nums.length == n + 1", "1 ≤ nums[i] ≤ n", "Exactly one integer repeats; it may appear more than twice."]
  },
  "first-missing-positive": {
    body: [
      "Given an unsorted integer array `nums`, return the smallest positive integer that is not present in nums.",
      "You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space."
    ],
    why: [
      "1 and 2 are present, so the answer is 3.",
      "1 is present but 2 is not.",
      "1 is missing."
    ],
    walk: [
      "The answer is always in 1 … n + 1. Try to put each value v in 1 … n at index v − 1.",
      "nums[0] = 1 already belongs at index 0. nums[1] = 2 belongs at index 1. nums[2] = 0 is out of range, so leave it.",
      "Scan: index 0 holds 1 ✓, index 1 holds 2 ✓, index 2 holds 0 ✗.",
      "The first index that holds the wrong value is 2, so the answer is 2 + 1 = 3."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁵", "-2³¹ ≤ nums[i] ≤ 2³¹ − 1"]
  },
  "top-k-frequent-words": {
    body: [
      "Given an array of strings `words` and an integer `k`, return the k most frequent strings.",
      "Sort the answer by frequency from highest to lowest. Words with the same frequency are sorted in alphabetical (lexicographic) order."
    ],
    why: [
      "'i' and 'love' each appear twice. They tie, so 'i' comes first alphabetically.",
      "'the' appears 4 times, 'is' 3, 'sunny' 2, 'day' 1."
    ],
    walk: [
      "Count: {i: 2, love: 2, leetcode: 1, coding: 1}.",
      "Sort by count (high first), then alphabetically: i, love, coding, leetcode.",
      "Take the first k = 2: ['i', 'love']."
    ],
    cons: ["1 ≤ words.length ≤ 500", "1 ≤ words[i].length ≤ 10", "`words[i]` consists of lowercase English letters.", "k is between 1 and the number of unique words."]
  },
  "sort-characters-by-frequency": {
    body: [
      "Given a string `s`, sort it in decreasing order based on the frequency of the characters. Return the sorted string.",
      "Identical characters must stay together. If several answers are valid (characters with equal frequency in a different order), any of them is accepted."
    ],
    why: [
      "'e' appears twice, 'r' and 't' once. 'eert' is also accepted.",
      "Both appear 3 times. 'aaaccc' is also accepted, but 'cacaca' is not: identical characters must be together.",
      "'b' appears twice. 'A' and 'a' are different characters. 'bbaA' is also accepted."
    ],
    walk: [
      "Count: {t: 1, r: 1, e: 2}.",
      "Order by count, highest first: e (2), then t and r (1 each).",
      "Repeat each character by its count: 'ee' + 't' + 'r' = 'eetr'."
    ],
    cons: ["1 ≤ s.length ≤ 5 · 10⁵", "`s` consists of uppercase and lowercase English letters and digits."]
  },
  "longest-palindrome-build": {
    body: [
      "Given a string `s` of lowercase or uppercase letters, return the length of the longest palindrome that can be built with those letters. You don't have to use all of them.",
      "Letters are case sensitive: 'Aa' is not a palindrome."
    ],
    why: [
      "One longest palindrome is 'dccaccd', with length 7.",
      "'a' on its own is a palindrome."
    ],
    walk: [
      "Count: {a: 1, b: 1, c: 4, d: 2}.",
      "Letters in pairs can go on both sides: c gives 4 and d gives 2, so 6 letters.",
      "Some letter has an odd count left over, so one letter can sit in the middle: 6 + 1 = 7."
    ],
    cons: ["1 ≤ s.length ≤ 2000", "`s` consists of lowercase and/or uppercase English letters."]
  },
  "number-of-good-pairs": {
    body: [
      "Given an array of integers `nums`, return the number of good pairs.",
      "A pair (i, j) is good if nums[i] == nums[j] and i < j."
    ],
    why: [
      "The good pairs are (0,3), (0,4), (3,4) for the value 1 and (2,5) for the value 3.",
      "Any two of the four 1s make a pair: 4 · 3 / 2 = 6.",
      "All values are different."
    ],
    walk: [
      "Walk left to right. Each new value pairs with every earlier copy of itself.",
      "1: no earlier 1s. 2: none. 3: none.",
      "1: one earlier 1 → +1. 1: two earlier 1s → +2. 3: one earlier 3 → +1.",
      "Total: 1 + 2 + 1 = 4."
    ],
    cons: ["1 ≤ nums.length ≤ 100", "1 ≤ nums[i] ≤ 100"]
  },
  "brick-wall": {
    body: [
      "There is a rectangular brick wall in front of you with n rows of bricks. Each row has bricks of the same height but different widths, and the total width of each row is the same. `wall[i]` lists the widths of the bricks in row i from left to right.",
      "Draw one vertical line from the top to the bottom that crosses the fewest bricks. A line that passes along an edge between two bricks does not cross them. You cannot draw the line along either side edge of the wall. Return the minimum number of crossed bricks."
    ],
    why: [
      "A line at distance 4 from the left passes along brick edges in 4 of the 6 rows, so it crosses only 2 bricks.",
      "Each row is one brick wide, so there are no inner edges. Any line crosses all 3 rows."
    ],
    walk: [
      "For each row, list the positions of the edges between its bricks (not the far right end).",
      "Row 1 [1,2,2,1] → 1, 3, 5. Row 2 [3,1,2] → 3, 4. Row 3 [1,3,2] → 1, 4. Row 4 [2,4] → 2. Row 5 → 3, 4. Row 6 [1,3,1,1] → 1, 4, 5.",
      "Count each position: 1 → 3, 2 → 1, 3 → 3, 4 → 4, 5 → 2.",
      "The best position, 4, is an edge in 4 rows, so the line crosses 6 − 4 = 2 bricks."
    ],
    cons: ["n == wall.length", "1 ≤ n ≤ 10⁴", "1 ≤ wall[i].length ≤ 10⁴", "1 ≤ wall[i][j] ≤ 2³¹ − 1", "Every row has the same total width."]
  },
  "max-subarray-one-deletion": {
    body: [
      "Given an array of integers `arr`, return the maximum sum of a non-empty subarray (contiguous elements) with at most one element deleted.",
      "In other words, choose a subarray and optionally delete one element from it so that the sum of the remaining elements is as large as possible. The subarray must still have at least one element after the deletion."
    ],
    why: [
      "Choose [1, −2, 0, 3] and delete −2: 1 + 0 + 3 = 4.",
      "Take [3] alone. Deleting a −2 from [1, −2, −2, 3] only gives 2.",
      "At least one element must remain, so the best is −1."
    ],
    walk: [
      "Track two values for subarrays ending here: `keep` (no deletion yet) and `del` (one element already deleted).",
      "1: keep = 1. No deletion is possible yet. best = 1.",
      "−2: del = max(delete −2 → keep before = 1, del + (−2)) = 1. keep = max(−2, 1 − 2) = −1. best = 1.",
      "0: del = max(−1, 1 + 0) = 1. keep = max(0, −1 + 0) = 0.",
      "3: del = max(0, 1 + 3) = 4. keep = 3. best = 4."
    ],
    cons: ["1 ≤ arr.length ≤ 10⁵", "-10⁴ ≤ arr[i] ≤ 10⁴"]
  },
  "majority-element-ii": {
    body: [
      "Given an integer array `nums` of size `n`, find all elements that appear more than ⌊n / 3⌋ times.",
      "Return them in any order. There can be zero, one or two such elements, never more: three values each appearing more than n/3 times would need more than n elements."
    ],
    why: [
      "n = 3, so a value must appear more than ⌊3/3⌋ = 1 time. 3 appears twice; 2 appears only once.",
      "n = 1, so the threshold is more than ⌊1/3⌋ = 0 times. 1 appears once, which is enough.",
      "n = 2, threshold is more than 0 times. Both 1 and 2 appear once, so both are returned."
    ],
    walk: [
      "n = 3, so an answer must appear more than ⌊3/3⌋ = 1 time, i.e. at least 2 times.",
      "Count each value: 3 appears 2 times, 2 appears 1 time.",
      "Only 3 passes the threshold, so the answer is [3]."
    ],
    cons: ["1 ≤ nums.length ≤ 5 · 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹"]
  },
  "find-disappeared-numbers": {
    body: [
      "You are given an array `nums` of `n` integers where every value is in the range [1, n]. Some values appear twice and others appear once, so some numbers in [1, n] are missing.",
      "Return an array of all the integers in the range [1, n] that do not appear in `nums`, in any order."
    ],
    why: [
      "n = 8, so the range is 1 to 8. The array contains 1, 2, 3, 4, 7 and 8 (2 and 3 twice). 5 and 6 never appear.",
      "n = 2, so the range is 1 to 2. 1 appears twice and 2 is missing."
    ],
    walk: [
      "n = 8, so we are looking for which of 1, 2, …, 8 are absent.",
      "Mark every value we see: 4, 3, 2, 7, 8, 2, 3, 1. Duplicates (2 and 3) are just marked again.",
      "Marked: 1, 2, 3, 4, 7, 8. Unmarked: 5 and 6.",
      "Return [5, 6]."
    ],
    cons: ["n == nums.length", "1 ≤ n ≤ 10⁵", "1 ≤ nums[i] ≤ n"]
  }
};
