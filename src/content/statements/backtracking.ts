import type { Statement } from "./types";

export const BACKTRACKING_STATEMENTS: Record<string, Statement> = {
  "generate-parentheses": {
    body: [
      "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
      "Well-formed means every '(' is closed by a later ')', and no ')' appears before its '('. You may return the combinations in any order."
    ],
    why: [
      "There are exactly 5 ways to arrange 3 well-formed pairs.",
      "With one pair, the only option is '()'."
    ],
    walk: [
      "Build the string one character at a time. You may add '(' while fewer than n are open, and ')' while it would close an open one.",
      "'(' → '((' → '(((' (3 open) → ')))' → record '((()))'.",
      "Back up to '((' and add ')' → '(()' → '(()(' → '(()()' → '(()())' ✓. Then '(())()' ✓.",
      "Back up to '(' → '()' → '()((' … → '()(())' ✓ and '()()()' ✓.",
      "5 combinations in total."
    ],
    cons: ["1 ≤ n ≤ 8"]
  },
  "combination-sum": {
    body: [
      "Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return them in any order.",
      "The same number may be chosen an unlimited number of times. Two combinations are the same if they use each number the same number of times, so [2,2,3] and [2,3,2] count once."
    ],
    why: [
      "2 + 2 + 3 = 7, and 7 on its own.",
      "2 + 2 + 2 + 2, 2 + 3 + 3 and 3 + 5 all make 8.",
      "Only 2s are available, and they can't make 1."
    ],
    walk: [
      "Pick numbers in non-decreasing index order (to avoid repeats), subtracting from what's left.",
      "2 → 5 left. 2 → 3 left. 2 → 1 left; nothing fits, so back up. 3 → 0 left ✓ record [2, 2, 3].",
      "[2, 3] → 2 left; 3 is too big. [2, 6] and [2, 7] overshoot.",
      "Starting from 3: [3, 3] → 1 left, nothing fits. 6 → 1 left, nothing fits. 7 → 0 ✓ record [7].",
      "Result: [[2, 2, 3], [7]]."
    ],
    cons: ["1 ≤ candidates.length ≤ 30", "2 ≤ candidates[i] ≤ 40", "All candidates are distinct.", "1 ≤ target ≤ 40"]
  },
  "combination-sum-ii": {
    body: [
      "Given a collection of candidate numbers `candidates` (which may contain duplicates) and a target number `target`, find all unique combinations in candidates where the numbers sum to target.",
      "Each number in candidates may only be used once in a combination. The solution set must not contain duplicate combinations."
    ],
    why: [
      "1 + 1 + 6, 1 + 2 + 5, 1 + 7 and 2 + 6 all make 8. Using the other 1 instead would give the same combinations again.",
      "1 + 2 + 2 and 5."
    ],
    walk: [
      "Sort: [1, 1, 2, 5, 6, 7, 10]. At each level, skip a number equal to the previous one tried at that same level.",
      "1, 1 → need 6 → [1, 1, 6] ✓. 1, 2 → need 5 → [1, 2, 5] ✓. 1, 7 ✓.",
      "Starting with the second 1 at the top level would repeat everything, so skip it.",
      "2 → need 6 → [2, 6] ✓. Starting with 5, 6, 7 or 10 finds nothing new.",
      "Result: [[1,1,6], [1,2,5], [1,7], [2,6]]."
    ],
    cons: ["1 ≤ candidates.length ≤ 100", "1 ≤ candidates[i] ≤ 50", "1 ≤ target ≤ 30"]
  },
  "combination-sum-iii": {
    body: [
      "Find all valid combinations of `k` numbers that sum up to `n`, using only the numbers 1 through 9, each at most once.",
      "Return a list of all possible valid combinations. The list must not contain the same combination twice, and the combinations may be returned in any order."
    ],
    why: [
      "1 + 2 + 4 = 7 is the only way with three different numbers.",
      "1 + 2 + 6, 1 + 3 + 5 and 2 + 3 + 4.",
      "Four different numbers add up to at least 1 + 2 + 3 + 4 = 10 > 1."
    ],
    walk: [
      "Choose numbers in increasing order.",
      "1, 2 → need 4 more with one number → 4 ✓ [1, 2, 4].",
      "1, 3 → need 3 with one number bigger than 3: impossible. 1, 4 and above overshoot.",
      "2, 3 → need 2, impossible. The only combination is [1, 2, 4]."
    ],
    cons: ["2 ≤ k ≤ 9", "1 ≤ n ≤ 60"]
  },
  "combinations": {
    body: [
      "Given two integers `n` and `k`, return all possible combinations of k numbers chosen from the range [1, n].",
      "Order inside a combination doesn't matter ([1,2] and [2,1] are the same), and you may return the combinations in any order."
    ],
    why: [
      "There are C(4, 2) = 6 ways to choose 2 numbers from 1–4.",
      "There is one way to choose 1 number from [1]."
    ],
    walk: [
      "Pick numbers in increasing order.",
      "Start with 1: add 2, 3 or 4 → [1,2], [1,3], [1,4].",
      "Start with 2: add 3 or 4 → [2,3], [2,4].",
      "Start with 3: add 4 → [3,4]. 6 combinations."
    ],
    cons: ["1 ≤ n ≤ 20", "1 ≤ k ≤ n"]
  },
  "subsets-ii": {
    body: [
      "Given an integer array `nums` that may contain duplicates, return all possible subsets (the power set).",
      "The solution set must not contain duplicate subsets. Return the solution in any order."
    ],
    why: [
      "Six different subsets. [2] appears once even though there are two 2s.",
      "The empty set and [0]."
    ],
    walk: [
      "Sort: [1, 2, 2]. Record the current subset at every step; at each level, skip a value equal to the previous one tried.",
      "[] → [1] → [1, 2] → [1, 2, 2].",
      "Back at [1]: the second 2 would give [1, 2] again, so skip it.",
      "Back at []: [2] → [2, 2]. Skip the second 2 at the top level.",
      "Result: [], [1], [1,2], [1,2,2], [2], [2,2]."
    ],
    cons: ["1 ≤ nums.length ≤ 10", "-10 ≤ nums[i] ≤ 10"]
  },
  "permutations-ii": {
    body: [
      "Given a collection of numbers `nums` that might contain duplicates, return all possible unique permutations in any order."
    ],
    why: [
      "Swapping the two 1s gives the same order, so there are 3 unique permutations, not 6.",
      "All values differ, so all 3! = 6 orders are unique."
    ],
    walk: [
      "Sort: [1, 1, 2]. Use each index once, and skip a 1 if the previous identical 1 is not currently in use.",
      "First 1, then the second 1, then 2 → [1, 1, 2]. First 1, then 2, then 1 → [1, 2, 1].",
      "Starting with the second 1 would repeat those, so skip it.",
      "Start with 2 → [2, 1, 1]. 3 permutations in total."
    ],
    cons: ["1 ≤ nums.length ≤ 8", "-10 ≤ nums[i] ≤ 10"]
  },
  "letter-combinations": {
    body: [
      "Given a string containing digits from 2 to 9 inclusive, return all possible letter combinations that the number could represent, in any order.",
      "The digits map to letters as on a telephone keypad: 2 → abc, 3 → def, 4 → ghi, 5 → jkl, 6 → mno, 7 → pqrs, 8 → tuv, 9 → wxyz."
    ],
    why: [
      "3 letters for '2' times 3 letters for '3' gives 9 combinations.",
      "No digits, so no combinations.",
      "Each letter of '2'."
    ],
    walk: [
      "Pick one letter per digit, in order.",
      "'2' → a: then '3' → d, e, f → 'ad', 'ae', 'af'.",
      "'2' → b → 'bd', 'be', 'bf'.",
      "'2' → c → 'cd', 'ce', 'cf'. 9 combinations."
    ],
    cons: ["0 ≤ digits.length ≤ 4", "digits[i] is a digit in the range ['2', '9']."]
  },
  "word-search": {
    body: [
      "Given an m × n grid of characters `board` and a string `word`, return `true` if word exists in the grid.",
      "The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically neighbouring). The same cell may not be used more than once."
    ],
    why: [
      "A(0,0) → B(0,1) → C(0,2) → C(1,2) → E(2,2) → D(2,1).",
      "S(1,3) → E(2,3) → E(2,2).",
      "After A → B → C, the only 'B' nearby is the one already used."
    ],
    walk: [
      "Try every cell as a start. Start at (0,0) 'A' ✓, and mark it as used.",
      "Neighbour (0,1) 'B' ✓ → (0,2) 'C' ✓ → (1,2) 'C' ✓.",
      "(2,2) 'E' ✓ → (2,1) 'D' ✓. All six letters matched.",
      "Return true. (A dead end would unmark the cell and try another direction.)"
    ],
    cons: ["m == board.length", "n == board[i].length", "1 ≤ m, n ≤ 6", "1 ≤ word.length ≤ 15", "`board` and `word` consist of English letters."]
  },
  "palindrome-partitioning": {
    body: [
      "Given a string `s`, partition s such that every piece of the partition is a palindrome. Return all possible palindrome partitionings of s.",
      "A palindrome reads the same forward and backward. Single letters are always palindromes."
    ],
    why: [
      "'a' | 'a' | 'b' and 'aa' | 'b'. 'aab' and 'ab' are not palindromes.",
      "A single letter."
    ],
    walk: [
      "At each position, try every palindromic prefix of the rest, then recurse on what remains.",
      "Take 'a' → rest 'ab': take 'a' → rest 'b': take 'b' → record [a, a, b]. ('ab' is not a palindrome.)",
      "Take 'aa' → rest 'b' → record [aa, b].",
      "'aab' is not a palindrome. Two partitions."
    ],
    cons: ["1 ≤ s.length ≤ 16", "`s` contains only lowercase English letters."]
  },
  "n-queens": {
    body: [
      "The n-queens puzzle is the problem of placing n queens on an n × n chessboard such that no two queens attack each other: no two share a row, a column or a diagonal.",
      "Given an integer `n`, return all distinct solutions. Each solution is a board as a list of strings, where 'Q' is a queen and '.' is an empty square. You may return the solutions in any order."
    ],
    why: [
      "There are exactly two ways to place 4 queens; each is the other's mirror image.",
      "One queen on a 1 × 1 board."
    ],
    walk: [
      "Place one queen per row, tracking used columns and both diagonals.",
      "Row 0 at column 0 → row 1 at column 2 → row 2 has no safe column. Back up: row 1 at column 3 → row 2 at column 1 → row 3 has no safe column. Back up.",
      "Row 0 at column 1 → row 1 at column 3 → row 2 at column 0 → row 3 at column 2 ✓ record it.",
      "Continuing finds the mirror solution with row 0 at column 2. Two solutions."
    ],
    cons: ["1 ≤ n ≤ 9"]
  },
  "n-queens-ii": {
    body: [
      "The n-queens puzzle is the problem of placing n queens on an n × n chessboard such that no two queens attack each other (no shared row, column or diagonal).",
      "Given an integer `n`, return the number of distinct solutions."
    ],
    why: [
      "There are two solutions on a 4 × 4 board.",
      "One queen, one way.",
      "The classic 8-queens puzzle has 92 solutions."
    ],
    walk: [
      "Place one queen per row, keeping the used columns and diagonals as sets (or bitmasks).",
      "Rows 0–3 with the queen in column 0 of row 0 always get stuck, so backtrack.",
      "Column 1 in row 0 leads to the full placement 1, 3, 0, 2 → count 1.",
      "Column 2 in row 0 leads to 2, 0, 3, 1 → count 2. Column 3 gets stuck. The answer is 2."
    ],
    cons: ["1 ≤ n ≤ 9"]
  },
  "sudoku-solver": {
    body: [
      "Write a program to solve a Sudoku puzzle by filling the empty cells (written '.').",
      "Each of the digits 1–9 must occur exactly once in each row, each column and each of the nine 3 × 3 boxes. The input has exactly one solution. Fill the board in place; the function returns nothing."
    ],
    why: [
      "The completed board follows all the Sudoku rules and keeps every given digit."
    ],
    walk: [
      "Keep sets of the digits used in each row, column and box.",
      "Find the first empty cell, (0,2). Row 0 has 5, 3, 7; column 2 has 8; the box has 5, 3, 6, 9, 8. So 1, 2 and 4 are allowed there.",
      "Try 1, then move on to the next empty cell. If some later cell has no allowed digit, undo and try the next option.",
      "Eventually (0,2) = 4 leads to a full board. That is the unique solution."
    ],
    cons: ["board.length == 9", "board[i].length == 9", "board[i][j] is a digit or '.'.", "The puzzle has exactly one solution."]
  },
  "restore-ip-addresses": {
    body: [
      "A valid IP address consists of exactly four integers separated by single dots. Each integer is between 0 and 255 (inclusive) and cannot have leading zeros: '0.011.255.245' is invalid.",
      "Given a string `s` containing only digits, return all possible valid IP addresses that can be formed by inserting dots into s. You may not reorder or remove any digits, and you may return the addresses in any order."
    ],
    why: [
      "Both ways split the digits into four parts between 0 and 255.",
      "'00' would have a leading zero, so every part must be a single '0'.",
      "Five ways to place the dots."
    ],
    walk: [
      "Choose each part's length (1–3 digits), check it is valid, and recurse on the rest.",
      "First part '255', second '255' (both ≤ 255). The rest is '11135'.",
      "'11' + '135' → 255.255.11.135 ✓. '111' + '35' → 255.255.111.35 ✓. '1' + '1135' fails (too long).",
      "Other first parts, like '2' or '25', leave too many digits for three parts. Two addresses."
    ],
    cons: ["1 ≤ s.length ≤ 20", "`s` consists of digits only."]
  },
  "partition-k-equal-subsets": {
    body: [
      "Given an integer array `nums` and an integer `k`, return `true` if it is possible to divide this array into k non-empty subsets whose sums are all equal.",
      "Every element must be used in exactly one subset."
    ],
    why: [
      "The total is 20, so each subset must sum to 5: (5), (1, 4), (2, 3), (2, 3).",
      "The total is 10, which can't be split into 3 equal integer sums."
    ],
    walk: [
      "The target per subset is 20 / 4 = 5. Sort descending: [5, 4, 3, 3, 2, 2, 1].",
      "Put 5 in bucket 1 (full). Put 4 in bucket 2.",
      "3 doesn't fit in bucket 2 (4 + 3 > 5), so it goes in bucket 3. The next 3 goes in bucket 4.",
      "2 fits in bucket 3 (5), 2 fits in bucket 4 (5), and 1 fits in bucket 2 (5). All full: return true."
    ],
    cons: ["1 ≤ k ≤ nums.length ≤ 16", "1 ≤ nums[i] ≤ 10⁴", "Each value appears at most 4 times."]
  },
  "matchsticks-to-square": {
    body: [
      "You are given an integer array `matchsticks` where matchsticks[i] is the length of the i-th matchstick. You want to use all the matchsticks to make one square.",
      "You should not break any stick, but you can link them up, and each matchstick must be used exactly once. Return `true` if you can make this square and `false` otherwise."
    ],
    why: [
      "The total is 8, so each side is 2: (2), (2), (2) and (1 + 1).",
      "The total is 16, so each side is 4. Only the 4 fits one side exactly; the 3s can't make 4."
    ],
    walk: [
      "The total is 8, so the side length is 2. Sort descending: [2, 2, 2, 1, 1].",
      "Put each 2 on its own side: sides [2, 2, 2, 0].",
      "1 → the fourth side [2, 2, 2, 1]. 1 → [2, 2, 2, 2].",
      "Every side is 2: return true."
    ],
    cons: ["1 ≤ matchsticks.length ≤ 15", "1 ≤ matchsticks[i] ≤ 10⁸"]
  },
  "word-break-ii": {
    body: [
      "Given a string `s` and a dictionary of strings `wordDict`, add spaces in s to construct a sentence where each word is a valid dictionary word. Return all such possible sentences in any order.",
      "The same dictionary word may be reused multiple times."
    ],
    why: [
      "'cat' + 'sand' + 'dog' and 'cats' + 'and' + 'dog'.",
      "Three ways to split it into pine, apple, pen and applepen.",
      "Whatever you take first, the ending 'og' is not a word."
    ],
    walk: [
      "From each position, try every dictionary word that starts there, then solve the rest (and memoize the results per position).",
      "From 0: 'cat' → rest 'sanddog'. 'sand' → rest 'dog' → 'dog' ✓ → 'cat sand dog'.",
      "From 0: 'cats' → rest 'anddog'. 'and' → 'dog' ✓ → 'cats and dog'.",
      "No other first word matches. Two sentences."
    ],
    cons: ["1 ≤ s.length ≤ 20", "1 ≤ wordDict.length ≤ 1000", "1 ≤ wordDict[i].length ≤ 10", "All strings are lowercase; dictionary words are unique."]
  },
  "pow-x-n": {
    body: [
      "Implement pow(x, n), which calculates x raised to the power n (that is, xⁿ). n can be negative: x⁻ⁿ = 1 / xⁿ.",
      "Multiplying x by itself n times is too slow for large n. Answers within 10⁻⁵ are accepted."
    ],
    why: [
      "2¹⁰ = 1024.",
      "2.1³ = 9.261 (floating-point arithmetic shows a tiny rounding error).",
      "2⁻² = 1 / 2² = 1 / 4 = 0.25."
    ],
    walk: [
      "Fast exponentiation: square the base and halve the exponent. 10 in binary is 1010.",
      "Powers of 2 by squaring: 2¹ = 2, 2² = 4, 2⁴ = 16, 2⁸ = 256.",
      "The bits of 10 pick 2² and 2⁸.",
      "4 × 256 = 1024, using about log₂(10) steps instead of 10."
    ],
    cons: ["-100.0 < x < 100.0", "-2³¹ ≤ n ≤ 2³¹ − 1", "Either x is not 0 or n > 0.", "-10⁴ ≤ xⁿ ≤ 10⁴"]
  },
  "kth-symbol-grammar": {
    body: [
      "We build a table of n rows (1-indexed). Row 1 is '0'. To build each next row, look at the previous row and replace every 0 with '01' and every 1 with '10'.",
      "For example, the first rows are 0, 01, 0110 and 01101001. Given two integers `n` and `k`, return the k-th (1-indexed) symbol in the n-th row."
    ],
    why: [
      "Row 1 is '0'.",
      "Row 2 is '01'; its 1st symbol is 0.",
      "Row 2 is '01'; its 2nd symbol is 1."
    ],
    walk: [
      "Each symbol is its parent's value, flipped if it is a right child (an odd position from 0).",
      "Going from the root down to position k − 1, every 1-bit of k − 1 is one flip.",
      "For n = 1, k = 1: k − 1 = 0 has no 1-bits, so there are no flips.",
      "The symbol is 0."
    ],
    cons: ["1 ≤ n ≤ 30", "1 ≤ k ≤ 2ⁿ⁻¹"]
  },
  "beautiful-arrangement": {
    body: [
      "Suppose you have n integers labeled 1 through n. A permutation of them (1-indexed as perm) is a beautiful arrangement if for every position i, either perm[i] is divisible by i, or i is divisible by perm[i].",
      "Given an integer `n`, return the number of beautiful arrangements you can construct."
    ],
    why: [
      "[1, 2] and [2, 1] both work: at position 2, 2 % 2 = 0 and 2 % 1 = 0.",
      "[1] works.",
      "[1, 2, 3], [2, 1, 3] and [3, 2, 1] work."
    ],
    walk: [
      "Fill positions one by one with unused numbers that satisfy the rule.",
      "Position 1: any number works (everything is divisible by 1). Try 1 → position 2 gets 2 (2 % 2 = 0) ✓.",
      "Try 2 at position 1 → position 2 gets 1 (2 % 1 = 0) ✓.",
      "2 arrangements."
    ],
    cons: ["1 ≤ n ≤ 15"]
  },
  "different-ways-parentheses": {
    body: [
      "Given a string `expression` of numbers and operators (+, − and *), return all possible results from computing all the different possible ways to group the numbers and operators with parentheses.",
      "You may return the answer in any order. The same value can appear more than once if different groupings produce it."
    ],
    why: [
      "((2 − 1) − 1) = 0 and (2 − (1 − 1)) = 2.",
      "(2 × (3 − (4 × 5))) = −34, ((2 × 3) − (4 × 5)) = −14, ((2 × (3 − 4)) × 5) = −10, (2 × ((3 − 4) × 5)) = −10, (((2 × 3) − 4) × 5) = 10."
    ],
    walk: [
      "Pick an operator to be the last one applied, solve each side recursively, and combine every left result with every right result.",
      "Split at the first '−': left '2' → [2], right '1−1' → [0]. 2 − 0 = 2.",
      "Split at the second '−': left '2−1' → [1], right '1' → [1]. 1 − 1 = 0.",
      "Results: [2, 0]."
    ],
    cons: ["1 ≤ expression.length ≤ 20", "`expression` consists of digits and the operators '+', '-' and '*'.", "All integer values are in the range [0, 99]."]
  },
  "gray-code": {
    body: [
      "An n-bit Gray code sequence is a sequence of 2ⁿ integers in [0, 2ⁿ − 1] that starts with 0, uses every integer exactly once, and in which every two adjacent integers (including the first and the last) differ in exactly one bit.",
      "Given an integer `n`, return any valid n-bit Gray code sequence."
    ],
    why: [
      "In binary: 00, 01, 11, 10. Each step flips one bit, and 10 → 00 also flips one. [0, 2, 3, 1] is also valid.",
      "0 and 1 differ in one bit."
    ],
    walk: [
      "A neat formula: the i-th Gray code is i XOR (i >> 1).",
      "i = 0 → 0. i = 1 → 1 XOR 0 = 1.",
      "i = 2 → 2 XOR 1 = 3. i = 3 → 3 XOR 1 = 2.",
      "Sequence: [0, 1, 3, 2]."
    ],
    cons: ["1 ≤ n ≤ 16"]
  }
};
