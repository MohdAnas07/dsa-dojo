import type { ProblemDef } from "@/lib/types";

/** Backtracking, recursion and divide & conquer. */
export const BACKTRACKING: ProblemDef[] = [
  {
    id: "generate-parentheses", t: "Generate Parentheses", d: "M", tp: ["backtracking", "recursion", "strings"], pt: ["backtracking"], co: ["Amazon", "Google", "Meta", "Microsoft", "Bloomberg"], lc: "generate-parentheses",
    s: "Return all combinations of n pairs of well-formed parentheses.", h: ["Add '(' while you have some left.", "Add ')' only if it wouldn't close more than you opened."],
    a: "Backtracking on (open, close) counts.", tc: "O(4ⁿ / √n)", sc: "O(n)", sim: ["valid-parentheses", "letter-combinations", "subsets"],
    fn: "generateParenthesis", params: "n:number", ret: "string[]", cmp: "unordered",
    ex: [[3, ["((()))", "(()())", "(())()", "()(())", "()()()"]], [1, ["()"]]], hid: [[2], [4]],
    code: `function generateParenthesis(n) {
  const res = [];
  const bt = (s, open, close) => {
    if (s.length === 2 * n) { res.push(s); return; }
    if (open < n) bt(s + "(", open + 1, close);
    if (close < open) bt(s + ")", open, close + 1);
  };
  bt("", 0, 0);
  return res;
}`
  },
  {
    id: "combination-sum", t: "Combination Sum", d: "M", tp: ["backtracking", "recursion", "arrays"], pt: ["backtracking"], co: ["Amazon", "Airbnb", "Uber", "Meta"], lc: "combination-sum",
    s: "Distinct candidates, each usable unlimited times. Return all unique combinations summing to target.", h: ["Choose a start index to avoid permutations of the same combination.", "Staying on the same index allows reuse."],
    a: "Backtracking with a start index and remaining target.", tc: "O(2^target) roughly", sc: "O(target)", sim: ["combination-sum-ii", "combination-sum-iii", "coin-change-ii"],
    fn: "combinationSum", params: "candidates:number[], target:number", ret: "number[][]", cmp: "groups",
    ex: [[[2, 3, 6, 7], 7, [[2, 2, 3], [7]]], [[2, 3, 5], 8, [[2, 2, 2, 2], [2, 3, 3], [3, 5]]], [[2], 1, []]], hid: [[[1], 2], [[7, 3, 2], 18]],
    code: `function combinationSum(candidates, target) {
  const res = [], path = [];
  const bt = (start, rem) => {
    if (rem === 0) { res.push([...path]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > rem) continue;
      path.push(candidates[i]); bt(i, rem - candidates[i]); path.pop();
    }
  };
  bt(0, target);
  return res;
}`
  },
  {
    id: "combination-sum-ii", t: "Combination Sum II", d: "M", tp: ["backtracking", "sorting"], pt: ["backtracking"], co: ["Amazon", "Meta", "LinkedIn"], lc: "combination-sum-ii",
    s: "Each candidate may be used once and candidates may repeat. Return unique combinations summing to target.", h: ["Sort so duplicates are adjacent.", "At the same recursion level, skip a value equal to the previous one."],
    a: "Sorted backtracking with sibling de-duplication.", tc: "O(2ⁿ)", sc: "O(n)", sim: ["combination-sum", "subsets-ii", "permutations-ii"],
    fn: "combinationSum2", params: "candidates:number[], target:number", ret: "number[][]", cmp: "groups",
    ex: [[[10, 1, 2, 7, 6, 1, 5], 8, [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]], [[2, 5, 2, 1, 2], 5, [[1, 2, 2], [5]]]], hid: [[[1, 1, 1, 1], 2], [[3], 1]],
    code: `function combinationSum2(candidates, target) {
  candidates.sort((a, b) => a - b);
  const res = [], path = [];
  const bt = (start, rem) => {
    if (rem === 0) { res.push([...path]); return; }
    for (let i = start; i < candidates.length && candidates[i] <= rem; i++) {
      if (i > start && candidates[i] === candidates[i - 1]) continue;
      path.push(candidates[i]); bt(i + 1, rem - candidates[i]); path.pop();
    }
  };
  bt(0, target);
  return res;
}`
  },
  {
    id: "combination-sum-iii", t: "Combination Sum III", d: "M", tp: ["backtracking"], pt: ["backtracking"], co: ["Amazon", "Microsoft"], lc: "combination-sum-iii",
    s: "Find all combinations of k distinct numbers from 1–9 that sum to n.", h: ["Choose numbers in increasing order.", "Stop when the path has k numbers."],
    a: "Backtracking over 1..9.", tc: "O(C(9, k))", sc: "O(k)", sim: ["combinations", "combination-sum"],
    fn: "combinationSum3", params: "k:number, n:number", ret: "number[][]", cmp: "groups",
    ex: [[3, 7, [[1, 2, 4]]], [3, 9, [[1, 2, 6], [1, 3, 5], [2, 3, 4]]], [4, 1, []]], hid: [[2, 18], [9, 45]],
    code: `function combinationSum3(k, n) {
  const res = [], path = [];
  const bt = (start, rem) => {
    if (path.length === k) { if (rem === 0) res.push([...path]); return; }
    for (let x = start; x <= 9 && x <= rem; x++) { path.push(x); bt(x + 1, rem - x); path.pop(); }
  };
  bt(1, n);
  return res;
}`
  },
  {
    id: "combinations", t: "Combinations", d: "M", tp: ["backtracking", "recursion"], pt: ["backtracking"], co: ["Amazon", "Google"], lc: "combinations",
    s: "Return all combinations of k numbers chosen from 1..n.", h: ["Increasing order avoids duplicates.", "Prune: stop when not enough numbers remain."],
    a: "Backtracking with a start value.", tc: "O(k · C(n, k))", sc: "O(k)", sim: ["subsets", "combination-sum-iii"],
    fn: "combine", params: "n:number, k:number", ret: "number[][]", cmp: "groups",
    ex: [[4, 2, [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]], [1, 1, [[1]]]], hid: [[5, 3], [3, 3]],
    code: `function combine(n, k) {
  const res = [], path = [];
  const bt = start => {
    if (path.length === k) { res.push([...path]); return; }
    for (let x = start; x <= n - (k - path.length) + 1; x++) { path.push(x); bt(x + 1); path.pop(); }
  };
  bt(1);
  return res;
}`
  },
  {
    id: "subsets-ii", t: "Subsets II", d: "M", tp: ["backtracking", "sorting", "bit-manipulation"], pt: ["backtracking"], co: ["Amazon", "Meta", "Bloomberg"], lc: "subsets-ii",
    s: "nums may contain duplicates. Return all unique subsets.", h: ["Sort first.", "Skip a value equal to the previous one at the same level."],
    a: "Sorted backtracking with sibling de-duplication.", tc: "O(n · 2ⁿ)", sc: "O(n)", sim: ["subsets", "combination-sum-ii", "permutations-ii"],
    fn: "subsetsWithDup", params: "nums:number[]", ret: "number[][]", cmp: "groups",
    ex: [[[1, 2, 2], [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]], [[0], [[], [0]]]], hid: [[[4, 4, 4, 1, 4]], [[1, 2, 3]]],
    code: `function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b);
  const res = [], path = [];
  const bt = start => {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]); bt(i + 1); path.pop();
    }
  };
  bt(0);
  return res;
}`
  },
  {
    id: "permutations-ii", t: "Permutations II", d: "M", tp: ["backtracking", "sorting"], pt: ["backtracking"], co: ["Microsoft", "LinkedIn", "Amazon"], lc: "permutations-ii",
    s: "nums may contain duplicates. Return all unique permutations.", h: ["Sort, and track used positions.", "Skip nums[i] if it equals nums[i - 1] and nums[i - 1] isn't used (so equal values are placed in order)."],
    a: "Used-array backtracking with duplicate pruning.", tc: "O(n · n!)", sc: "O(n)", sim: ["permutations", "next-permutation", "subsets-ii"],
    fn: "permuteUnique", params: "nums:number[]", ret: "number[][]", cmp: "outer",
    ex: [[[1, 1, 2], [[1, 1, 2], [1, 2, 1], [2, 1, 1]]], [[1, 2, 3], [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]]], hid: [[[1]], [[2, 2, 1, 1]]],
    code: `function permuteUnique(nums) {
  nums.sort((a, b) => a - b);
  const res = [], path = [], used = new Array(nums.length).fill(false);
  const bt = () => {
    if (path.length === nums.length) { res.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i] || (i > 0 && nums[i] === nums[i - 1] && !used[i - 1])) continue;
      used[i] = true; path.push(nums[i]); bt(); path.pop(); used[i] = false;
    }
  };
  bt();
  return res;
}`
  },
  {
    id: "letter-combinations", t: "Letter Combinations of a Phone Number", d: "M", tp: ["backtracking", "strings", "hashing"], pt: ["backtracking"], co: ["Amazon", "Google", "Meta", "Uber"], lc: "letter-combinations-of-a-phone-number",
    s: "Given digits 2–9, return every letter combination they could represent (phone keypad).", h: ["One recursion level per digit.", "At each level try every letter for that digit."],
    a: "Backtracking over digits.", tc: "O(4ⁿ · n)", sc: "O(n)", sim: ["generate-parentheses", "subsets"],
    fn: "letterCombinations", params: "digits:string", ret: "string[]", cmp: "unordered",
    ex: [["23", ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]], ["", []], ["2", ["a", "b", "c"]]], hid: [["79"], ["234"]],
    code: `function letterCombinations(digits) {
  if (!digits) return [];
  const map = { 2: "abc", 3: "def", 4: "ghi", 5: "jkl", 6: "mno", 7: "pqrs", 8: "tuv", 9: "wxyz" };
  const res = [];
  const bt = (i, s) => {
    if (i === digits.length) { res.push(s); return; }
    for (const c of map[digits[i]]) bt(i + 1, s + c);
  };
  bt(0, "");
  return res;
}`
  },
  {
    id: "word-search", t: "Word Search", d: "M", tp: ["backtracking", "dfs", "arrays"], pt: ["backtracking", "dfs"], co: ["Amazon", "Microsoft", "Meta", "Bloomberg"], lc: "word-search",
    s: "Can word be formed from sequentially adjacent cells (each cell used once)?", h: ["Try every starting cell.", "DFS with backtracking: mark the cell as used, recurse to neighbours, unmark."],
    a: "Grid backtracking.", tc: "O(cells · 3^L)", sc: "O(L)", sim: ["word-search-ii", "number-of-islands"],
    fn: "exist", params: "board:character[][], word:string", ret: "boolean",
    ex: [[[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED", true], [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "SEE", true], [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB", false]], hid: [[[["a"]], "a"], [[["a", "b"], ["c", "d"]], "abdc"], [[["a", "a"]], "aaa"]],
    code: `function exist(board, word) {
  const R = board.length, C = board[0].length;
  const dfs = (r, c, i) => {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= R || c >= C || board[r][c] !== word[i]) return false;
    const ch = board[r][c]; board[r][c] = "#";
    const ok = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r][c] = ch;
    return ok;
  };
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (dfs(r, c, 0)) return true;
  return false;
}`
  },
  {
    id: "palindrome-partitioning", t: "Palindrome Partitioning", d: "M", tp: ["backtracking", "dp", "strings"], pt: ["backtracking", "dp"], co: ["Amazon", "Google", "Bloomberg"], lc: "palindrome-partitioning",
    s: "Return every way to split s into palindromic pieces.", h: ["Choose the next piece s[start..end] if it's a palindrome, then recurse.", "Precompute a palindrome table to make checks O(1)."],
    a: "Backtracking over cut positions.", tc: "O(n · 2ⁿ)", sc: "O(n²)", sim: ["palindromic-substrings", "word-break-ii", "restore-ip-addresses"],
    fn: "partition", params: "s:string", ret: "string[][]", cmp: "outer",
    ex: [["aab", [["a", "a", "b"], ["aa", "b"]]], ["a", [["a"]]]], hid: [["aaa"], ["abba"], ["racecar"]],
    code: `function partition(s) {
  const res = [], path = [];
  const isPal = (l, r) => { while (l < r) if (s[l++] !== s[r--]) return false; return true; };
  const bt = start => {
    if (start === s.length) { res.push([...path]); return; }
    for (let end = start; end < s.length; end++) {
      if (!isPal(start, end)) continue;
      path.push(s.slice(start, end + 1)); bt(end + 1); path.pop();
    }
  };
  bt(0);
  return res;
}`
  },
  {
    id: "n-queens", t: "N-Queens", d: "H", tp: ["backtracking", "hashing"], pt: ["backtracking"], co: ["Amazon", "Microsoft", "Apple", "Google"], lc: "n-queens",
    s: "Return every placement of n non-attacking queens on an n×n board ('Q' and '.').", h: ["Place one queen per row.", "Track used columns and both diagonals (r - c and r + c) in sets."],
    a: "Row-by-row backtracking with column/diagonal sets.", tc: "O(n!)", sc: "O(n)", sim: ["n-queens-ii", "sudoku-solver"],
    fn: "solveNQueens", params: "n:number", ret: "string[][]", cmp: "outer",
    ex: [[4, [[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]]], [1, [["Q"]]]], hid: [[2], [5]],
    code: `function solveNQueens(n) {
  const res = [], cols = new Set(), d1 = new Set(), d2 = new Set(), q = [];
  const bt = r => {
    if (r === n) { res.push(q.map(c => ".".repeat(c) + "Q" + ".".repeat(n - c - 1))); return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
      cols.add(c); d1.add(r - c); d2.add(r + c); q.push(c);
      bt(r + 1);
      cols.delete(c); d1.delete(r - c); d2.delete(r + c); q.pop();
    }
  };
  bt(0);
  return res;
}`
  },
  {
    id: "n-queens-ii", t: "N-Queens II", d: "H", tp: ["backtracking", "bit-manipulation"], pt: ["backtracking", "bit-manipulation"], co: ["Amazon", "Zenefits"], lc: "n-queens-ii",
    s: "Return the number of distinct n-queens solutions.", h: ["Same search as N-Queens, but only count.", "Bitmasks for columns and diagonals make it very fast."],
    a: "Bitmask backtracking.", tc: "O(n!)", sc: "O(n)", sim: ["n-queens"],
    fn: "totalNQueens", params: "n:number", ret: "number",
    ex: [[4, 2], [1, 1], [8, 92]], hid: [[2], [6], [9]],
    code: `function totalNQueens(n) {
  const full = (1 << n) - 1;
  const bt = (cols, d1, d2) => {
    if (cols === full) return 1;
    let count = 0, free = full & ~(cols | d1 | d2);
    while (free) {
      const bit = free & -free;
      free -= bit;
      count += bt(cols | bit, ((d1 | bit) << 1) & full, (d2 | bit) >> 1);
    }
    return count;
  };
  return bt(0, 0, 0);
}`
  },
  {
    id: "sudoku-solver", t: "Sudoku Solver", d: "H", tp: ["backtracking", "hashing"], pt: ["backtracking"], co: ["Amazon", "Microsoft", "Uber", "Snap"], lc: "sudoku-solver",
    s: "Fill the board in place so it becomes a valid Sudoku (the puzzle has one solution).", h: ["Find an empty cell, try 1–9 that don't conflict.", "Recurse; undo on failure."],
    a: "Backtracking with row/column/box sets.", tc: "O(9^empty)", sc: "O(81)", sim: ["valid-sudoku", "n-queens"],
    fn: "solveSudoku", params: "board:character[][]", ret: "void", inplace: 0, note: "Fill the board in place.",
    ex: [[[["5", "3", ".", ".", "7", ".", ".", ".", "."], ["6", ".", ".", "1", "9", "5", ".", ".", "."], [".", "9", "8", ".", ".", ".", ".", "6", "."], ["8", ".", ".", ".", "6", ".", ".", ".", "3"], ["4", ".", ".", "8", ".", "3", ".", ".", "1"], ["7", ".", ".", ".", "2", ".", ".", ".", "6"], [".", "6", ".", ".", ".", ".", "2", "8", "."], [".", ".", ".", "4", "1", "9", ".", ".", "5"], [".", ".", ".", ".", "8", ".", ".", "7", "9"]],
      [["5", "3", "4", "6", "7", "8", "9", "1", "2"], ["6", "7", "2", "1", "9", "5", "3", "4", "8"], ["1", "9", "8", "3", "4", "2", "5", "6", "7"], ["8", "5", "9", "7", "6", "1", "4", "2", "3"], ["4", "2", "6", "8", "5", "3", "7", "9", "1"], ["7", "1", "3", "9", "2", "4", "8", "5", "6"], ["9", "6", "1", "5", "3", "7", "2", "8", "4"], ["2", "8", "7", "4", "1", "9", "6", "3", "5"], ["3", "4", "5", "2", "8", "6", "1", "7", "9"]]]],
    code: `function solveSudoku(board) {
  const rows = Array.from({ length: 9 }, () => new Set()), cols = Array.from({ length: 9 }, () => new Set()), boxes = Array.from({ length: 9 }, () => new Set());
  const empty = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    const v = board[r][c], b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    if (v === ".") empty.push([r, c, b]); else { rows[r].add(v); cols[c].add(v); boxes[b].add(v); }
  }
  const bt = i => {
    if (i === empty.length) return true;
    const [r, c, b] = empty[i];
    for (let d = 1; d <= 9; d++) {
      const v = String(d);
      if (rows[r].has(v) || cols[c].has(v) || boxes[b].has(v)) continue;
      board[r][c] = v; rows[r].add(v); cols[c].add(v); boxes[b].add(v);
      if (bt(i + 1)) return true;
      board[r][c] = "."; rows[r].delete(v); cols[c].delete(v); boxes[b].delete(v);
    }
    return false;
  };
  bt(0);
}`
  },
  {
    id: "restore-ip-addresses", t: "Restore IP Addresses", d: "M", tp: ["backtracking", "strings"], pt: ["backtracking"], co: ["Amazon", "Microsoft", "Cisco"], lc: "restore-ip-addresses",
    s: "Insert dots into a digit string to form every valid IPv4 address (each part 0–255, no leading zeros).", h: ["Exactly four parts, each 1–3 digits.", "Prune when the remaining length can't fit the remaining parts."],
    a: "Backtracking over part lengths.", tc: "O(3⁴)", sc: "O(1)", sim: ["palindrome-partitioning", "word-break-ii"],
    fn: "restoreIpAddresses", params: "s:string", ret: "string[]", cmp: "unordered",
    ex: [["25525511135", ["255.255.11.135", "255.255.111.35"]], ["0000", ["0.0.0.0"]], ["101023", ["1.0.10.23", "1.0.102.3", "10.1.0.23", "10.10.2.3", "101.0.2.3"]]], hid: [["1111"], ["010010"], ["123"]],
    code: `function restoreIpAddresses(s) {
  const res = [], parts = [];
  const bt = start => {
    if (parts.length === 4) { if (start === s.length) res.push(parts.join(".")); return; }
    for (let len = 1; len <= 3 && start + len <= s.length; len++) {
      const p = s.slice(start, start + len);
      if ((p.length > 1 && p[0] === "0") || Number(p) > 255) break;
      parts.push(p); bt(start + len); parts.pop();
    }
  };
  bt(0);
  return res;
}`
  },
  {
    id: "partition-k-equal-subsets", t: "Partition to K Equal Sum Subsets", d: "M", tp: ["backtracking", "dp", "bit-manipulation"], pt: ["backtracking"], co: ["LinkedIn", "Amazon", "Google"], lc: "partition-to-k-equal-sum-subsets",
    s: "Can nums be split into k non-empty subsets with equal sums?", h: ["Each bucket must reach total / k.", "Sort descending and place numbers into buckets; skip buckets with the same current sum."],
    a: "Backtracking over buckets with symmetry pruning.", tc: "O(kⁿ) worst", sc: "O(n)", sim: ["partition-equal-subset", "matchsticks-to-square"],
    fn: "canPartitionKSubsets", params: "nums:number[], k:number", ret: "boolean",
    ex: [[[4, 3, 2, 3, 5, 2, 1], 4, true], [[1, 2, 3, 4], 3, false]], hid: [[[1, 1, 1, 1], 4], [[2, 2, 2, 2, 3, 4, 5], 4], [[10, 10, 10, 7, 7, 7, 7, 7, 7, 6, 6, 6], 3]],
    code: `function canPartitionKSubsets(nums, k) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % k) return false;
  const target = total / k;
  nums.sort((a, b) => b - a);
  if (nums[0] > target) return false;
  const buckets = new Array(k).fill(0);
  const bt = i => {
    if (i === nums.length) return true;
    const seen = new Set();
    for (let b = 0; b < k; b++) {
      if (buckets[b] + nums[i] > target || seen.has(buckets[b])) continue;
      seen.add(buckets[b]);
      buckets[b] += nums[i];
      if (bt(i + 1)) return true;
      buckets[b] -= nums[i];
    }
    return false;
  };
  return bt(0);
}`
  },
  {
    id: "matchsticks-to-square", t: "Matchsticks to Square", d: "M", tp: ["backtracking", "dp", "bit-manipulation"], pt: ["backtracking"], co: ["Rackspace", "Amazon"], lc: "matchsticks-to-square",
    s: "Can all matchsticks form a square (each used exactly once)?", h: ["It's partitioning into 4 equal subsets.", "Longest sticks first prunes much faster."],
    a: "Four-bucket backtracking.", tc: "O(4ⁿ) worst", sc: "O(n)", sim: ["partition-k-equal-subsets", "partition-equal-subset"],
    fn: "makesquare", params: "matchsticks:number[]", ret: "boolean",
    ex: [[[1, 1, 2, 2, 2], true], [[3, 3, 3, 3, 4], false]], hid: [[[5, 5, 5, 5]], [[1, 1, 1]], [[5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3]]],
    code: `function makesquare(matchsticks) {
  const total = matchsticks.reduce((a, b) => a + b, 0);
  if (total % 4 || matchsticks.length < 4) return false;
  const side = total / 4, s = [0, 0, 0, 0];
  matchsticks.sort((a, b) => b - a);
  const bt = i => {
    if (i === matchsticks.length) return true;
    for (let k = 0; k < 4; k++) {
      if (s[k] + matchsticks[i] > side || (k > 0 && s[k] === s[k - 1])) continue;
      s[k] += matchsticks[i];
      if (bt(i + 1)) return true;
      s[k] -= matchsticks[i];
    }
    return false;
  };
  return bt(0);
}`
  },
  {
    id: "word-break-ii", t: "Word Break II", d: "H", tp: ["backtracking", "dp", "hashing", "strings"], pt: ["backtracking", "dp"], co: ["Amazon", "Google", "Meta", "Uber"], lc: "word-break-ii",
    s: "Return every sentence made by adding spaces to s so each word is in the dictionary.", h: ["Try every dictionary word as a prefix, recurse on the rest.", "Memoize results per start index."],
    a: "DFS + memo on the suffix start.", tc: "O(2ⁿ) worst output", sc: "O(n · output)", sim: ["word-break", "palindrome-partitioning"],
    fn: "wordBreak", params: "s:string, wordDict:string[]", ret: "string[]", cmp: "unordered",
    ex: [["catsanddog", ["cat", "cats", "and", "sand", "dog"], ["cats and dog", "cat sand dog"]], ["pineapplepenapple", ["apple", "pen", "applepen", "pine", "pineapple"], ["pine apple pen apple", "pineapple pen apple", "pine applepen apple"]], ["catsandog", ["cats", "dog", "sand", "and", "cat"], []]], hid: [["a", ["a"]], ["aaaa", ["a", "aa"]]],
    code: `function wordBreak(s, wordDict) {
  const dict = new Set(wordDict), memo = new Map();
  const go = start => {
    if (start === s.length) return [""];
    if (memo.has(start)) return memo.get(start);
    const res = [];
    for (let end = start + 1; end <= s.length; end++) {
      const w = s.slice(start, end);
      if (dict.has(w)) for (const rest of go(end)) res.push(rest ? w + " " + rest : w);
    }
    memo.set(start, res);
    return res;
  };
  return go(0);
}`
  },
  {
    id: "pow-x-n", t: "Pow(x, n)", d: "M", tp: ["recursion", "math-basics", "divide-conquer"], pt: ["recursion"], co: ["Meta", "Amazon", "LinkedIn", "Bloomberg"], lc: "powx-n",
    s: "Compute x raised to the integer power n (n may be negative).", h: ["xⁿ = (x^(n/2))², times x if n is odd.", "For negative n, compute (1/x)^(-n)."],
    a: "Fast exponentiation.", tc: "O(log n)", sc: "O(log n)", sim: ["power-of-two", "sqrtx"],
    fn: "myPow", params: "x:double, n:number", ret: "double", cmp: "float",
    ex: [[2, 10, 1024], [2.1, 3, 9.261], [2, -2, 0.25]], hid: [[1, 2147483647], [-1, 3], [0.5, 4], [2, 0]],
    code: `function myPow(x, n) {
  if (n < 0) { x = 1 / x; n = -n; }
  let res = 1;
  while (n > 0) {
    if (n % 2 === 1) res *= x;
    x *= x;
    n = Math.floor(n / 2);
  }
  return res;
}`
  },
  {
    id: "kth-symbol-grammar", t: "K-th Symbol in Grammar", d: "M", tp: ["recursion", "bit-manipulation", "math-basics"], pt: ["recursion", "bit-manipulation"], co: ["Amazon", "Meta"], lc: "k-th-symbol-in-grammar",
    s: "Row 1 is \"0\"; each row replaces 0 with 01 and 1 with 10. Return the k-th symbol (1-indexed) of row n.", h: ["Symbol k in row n comes from symbol ⌈k/2⌉ in row n - 1.", "It flips when k is even. (Equivalently: popcount(k - 1) mod 2.)"],
    a: "Count set bits of k - 1.", tc: "O(log k)", sc: "O(1)", sim: ["pow-x-n", "counting-bits"],
    fn: "kthGrammar", params: "n:number, k:number", ret: "number",
    ex: [[1, 1, 0], [2, 1, 0], [2, 2, 1]], hid: [[3, 3], [30, 434991989], [4, 5]],
    code: `function kthGrammar(n, k) {
  let x = k - 1, bits = 0;
  while (x) { bits += x & 1; x >>= 1; }
  return bits % 2;
}`
  },
  {
    id: "beautiful-arrangement", t: "Beautiful Arrangement", d: "M", tp: ["backtracking", "bit-manipulation", "dp"], pt: ["backtracking"], co: ["Google", "Amazon"], lc: "beautiful-arrangement",
    s: "Count permutations of 1..n where for every position i, perm[i] % i == 0 or i % perm[i] == 0.", h: ["Fill positions one by one.", "Only try numbers that satisfy the rule for this position."],
    a: "Backtracking with pruning.", tc: "O(k) valid branches", sc: "O(n)", sim: ["permutations", "n-queens-ii"],
    fn: "countArrangement", params: "n:number", ret: "number",
    ex: [[2, 2], [1, 1], [3, 3]], hid: [[4], [8], [12]],
    code: `function countArrangement(n) {
  const used = new Array(n + 1).fill(false);
  const bt = pos => {
    if (pos > n) return 1;
    let count = 0;
    for (let x = 1; x <= n; x++) {
      if (used[x] || (x % pos && pos % x)) continue;
      used[x] = true; count += bt(pos + 1); used[x] = false;
    }
    return count;
  };
  return bt(1);
}`
  },
  {
    id: "different-ways-parentheses", t: "Different Ways to Add Parentheses", d: "M", tp: ["recursion", "divide-conquer", "dp"], pt: ["recursion", "dp"], co: ["Amazon", "Google"], lc: "different-ways-to-add-parentheses",
    s: "Return all results from every way of grouping the expression with parentheses (any order).", h: ["Split at every operator.", "Combine every result of the left side with every result of the right side."],
    a: "Divide and conquer with memo.", tc: "Catalan", sc: "Catalan", sim: ["basic-calculator", "burst-balloons"],
    fn: "diffWaysToCompute", params: "expression:string", ret: "number[]", cmp: "unordered",
    ex: [["2-1-1", [0, 2]], ["2*3-4*5", [-34, -14, -10, -10, 10]]], hid: [["11"], ["1+2*3"], ["2*3*4-5"]],
    code: `function diffWaysToCompute(expression) {
  const memo = new Map();
  const go = e => {
    if (memo.has(e)) return memo.get(e);
    const res = [];
    for (let i = 0; i < e.length; i++) {
      const op = e[i];
      if (op !== "+" && op !== "-" && op !== "*") continue;
      for (const a of go(e.slice(0, i))) for (const b of go(e.slice(i + 1))) res.push(op === "+" ? a + b : op === "-" ? a - b : a * b);
    }
    if (!res.length) res.push(Number(e));
    memo.set(e, res);
    return res;
  };
  return go(expression);
}`
  },
  {
    id: "gray-code", t: "Gray Code", d: "M", tp: ["bit-manipulation", "backtracking", "math-basics"], pt: ["bit-manipulation"], co: ["Amazon", "Google"], lc: "gray-code",
    s: "Return any n-bit Gray code sequence starting at 0 (consecutive values differ by exactly one bit, and so do the last and first).", h: ["i XOR (i >> 1) gives the i-th Gray code.", "Or reflect: prefix a 1-bit to the previous sequence in reverse."],
    a: "Formula i ^ (i >> 1).", tc: "O(2ⁿ)", sc: "O(1) extra", sim: ["counting-bits", "subsets"],
    fn: "grayCode", params: "n:number", ret: "number[]",
    check: `(args, out) => { const n = args[0]; if (!Array.isArray(out) || out.length !== 1 << n || out[0] !== 0 || new Set(out).size !== out.length) return false; const one = x => x > 0 && (x & (x - 1)) === 0; for (let i = 0; i < out.length; i++) { const v = out[i]; if (v < 0 || v >= 1 << n || !one(v ^ out[(i + 1) % out.length])) return false; } return true; }`,
    ex: [[2, [0, 1, 3, 2]], [1, [0, 1]]], hid: [[3], [5]],
    code: `function grayCode(n) {
  const res = [];
  for (let i = 0; i < 1 << n; i++) res.push(i ^ (i >> 1));
  return res;
}`
  }
];
