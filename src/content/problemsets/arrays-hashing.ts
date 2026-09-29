import type { ProblemDef } from "@/lib/types";

/** Arrays, hashing, matrices and prefix sums. */
export const ARRAYS_HASHING: ProblemDef[] = [
  {
    id: "majority-element", t: "Majority Element", d: "E", tp: ["arrays", "hashing"], pt: ["frequency-counter", "greedy"], co: ["Amazon", "Google", "Adobe"], lc: "majority-element",
    s: "Return the element that appears more than ⌊n/2⌋ times. It always exists.", h: ["A Map of counts works in O(n) space. Can you do O(1)?", "Boyer–Moore voting: pair up different elements and cancel them; the majority survives."],
    a: "Keep a candidate and a count. Same value → count++, different → count--, count 0 → new candidate.", tc: "O(n)", sc: "O(1)", f: ["Elements appearing more than n/3 times"], sim: ["majority-element-ii"],
    fn: "majorityElement", params: "nums:number[]", ret: "number",
    ex: [[[3, 2, 3], 3], [[2, 2, 1, 1, 1, 2, 2], 2]], hid: [[[1]], [[6, 5, 5]], [[-1, -1, 2, -1, 3]]],
    code: `function majorityElement(nums) {
  let cand = null, count = 0;
  for (const x of nums) {
    if (count === 0) cand = x;
    count += x === cand ? 1 : -1;
  }
  return cand;
}`
  },
  {
    id: "majority-element-ii", t: "Majority Element II", d: "M", tp: ["arrays", "hashing"], pt: ["frequency-counter", "greedy"], co: ["Amazon", "Microsoft", "Zenefits"], lc: "majority-element-ii",
    s: "Return all elements that appear more than ⌊n/3⌋ times, in any order.", h: ["At most two values can appear more than n/3 times.", "Extend Boyer–Moore with two candidates, then verify their counts."],
    a: "Track two candidates with counts; cancel when a third value appears. A second pass confirms which candidates really exceed n/3.", tc: "O(n)", sc: "O(1)", sim: ["majority-element", "top-k-frequent"],
    fn: "majorityElement", params: "nums:number[]", ret: "number[]", cmp: "unordered",
    ex: [[[3, 2, 3], [3]], [[1], [1]], [[1, 2], [1, 2]]], hid: [[[2, 2, 1, 3]], [[1, 1, 1, 3, 3, 2, 2, 2]], [[4, 4, 4, 4]]],
    code: `function majorityElement(nums) {
  let a = null, b = null, ca = 0, cb = 0;
  for (const x of nums) {
    if (x === a) ca++;
    else if (x === b) cb++;
    else if (ca === 0) { a = x; ca = 1; }
    else if (cb === 0) { b = x; cb = 1; }
    else { ca--; cb--; }
  }
  const res = [];
  for (const c of [a, b]) if (c !== null && nums.filter(x => x === c).length > nums.length / 3 && !res.includes(c)) res.push(c);
  return res;
}`
  },
  {
    id: "find-disappeared-numbers", t: "Find All Numbers Disappeared in an Array", d: "E", tp: ["arrays", "hashing"], pt: ["hashing"], co: ["Google", "Amazon"], lc: "find-all-numbers-disappeared-in-an-array",
    s: "nums has n integers in [1, n]. Return every number in [1, n] that does not appear.", h: ["A Set makes it easy. Can you mark presence inside the array itself?", "Flip nums[|x| - 1] to negative for every x; indexes still positive are missing."],
    a: "Use the sign of nums[i] as a 'seen' flag for value i + 1.", tc: "O(n)", sc: "O(1) extra", sim: ["missing-number", "first-missing-positive", "find-duplicate-number"],
    fn: "findDisappearedNumbers", params: "nums:number[]", ret: "number[]", cmp: "unordered",
    ex: [[[4, 3, 2, 7, 8, 2, 3, 1], [5, 6]], [[1, 1], [2]]], hid: [[[1, 2, 3]], [[2, 2, 2, 2]], [[5, 4, 3, 2, 1]]],
    code: `function findDisappearedNumbers(nums) {
  for (const x of nums) {
    const i = Math.abs(x) - 1;
    if (nums[i] > 0) nums[i] = -nums[i];
  }
  const res = [];
  for (let i = 0; i < nums.length; i++) if (nums[i] > 0) res.push(i + 1);
  return res;
}`
  },
  {
    id: "missing-number", t: "Missing Number", d: "E", tp: ["arrays", "bit-manipulation", "math-basics"], pt: ["bit-manipulation", "hashing"], co: ["Amazon", "Microsoft", "Apple"], lc: "missing-number",
    s: "nums contains n distinct numbers from the range [0, n]. Return the one number missing.", h: ["What should the sum of 0..n be?", "Or XOR every index and every value: pairs cancel, the missing one remains."],
    a: "Expected sum n(n+1)/2 minus the actual sum.", tc: "O(n)", sc: "O(1)", sim: ["single-number", "find-disappeared-numbers", "first-missing-positive"],
    fn: "missingNumber", params: "nums:number[]", ret: "number",
    ex: [[[3, 0, 1], 2], [[0, 1], 2], [[9, 6, 4, 2, 3, 5, 7, 0, 1], 8]], hid: [[[0]], [[1]], [[1, 2, 3, 4, 0, 6]]],
    code: `function missingNumber(nums) {
  const n = nums.length;
  let sum = n * (n + 1) / 2;
  for (const x of nums) sum -= x;
  return sum;
}`
  },
  {
    id: "intersection-two-arrays-ii", t: "Intersection of Two Arrays II", d: "E", tp: ["hashing", "arrays", "two-pointers", "sorting"], pt: ["frequency-counter", "two-pointers"], co: ["Facebook", "Amazon"], lc: "intersection-of-two-arrays-ii",
    s: "Return the intersection of two arrays, keeping each element as many times as it appears in both.", h: ["Count the first array.", "Walk the second array and take an element while its count is positive."],
    a: "Map of counts for nums1; for each x in nums2 with count > 0, output it and decrement.", tc: "O(n + m)", sc: "O(min(n, m))", f: ["What if both arrays are sorted?", "What if nums2 is too big to fit in memory?"],
    fn: "intersect", params: "nums1:number[], nums2:number[]", ret: "number[]", cmp: "unordered",
    ex: [[[1, 2, 2, 1], [2, 2], [2, 2]], [[4, 9, 5], [9, 4, 9, 8, 4], [4, 9]]], hid: [[[1, 2], [3]], [[1, 1, 1], [1, 1]], [[3, 1, 2], [1, 1]]],
    code: `function intersect(nums1, nums2) {
  const count = new Map();
  for (const x of nums1) count.set(x, (count.get(x) || 0) + 1);
  const res = [];
  for (const x of nums2) {
    if (count.get(x) > 0) { res.push(x); count.set(x, count.get(x) - 1); }
  }
  return res;
}`
  },
  {
    id: "plus-one", t: "Plus One", d: "E", tp: ["arrays", "math-basics"], pt: ["two-pointers"], co: ["Google", "Amazon"], lc: "plus-one",
    s: "A large integer is given as an array of digits (most significant first). Return the digits of the integer plus one.", h: ["Work from the last digit.", "A 9 becomes 0 and the carry continues; anything else just increments and you're done."],
    a: "Scan from the right; stop at the first non-9 digit after incrementing. If all were 9, prepend 1.", tc: "O(n)", sc: "O(1)", sim: ["add-binary", "add-two-numbers", "multiply-strings"],
    fn: "plusOne", params: "digits:number[]", ret: "number[]",
    ex: [[[1, 2, 3], [1, 2, 4]], [[4, 3, 2, 1], [4, 3, 2, 2]], [[9], [1, 0]]], hid: [[[9, 9]], [[0]], [[8, 9, 9]]],
    code: `function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) { digits[i]++; return digits; }
    digits[i] = 0;
  }
  return [1, ...digits];
}`
  },
  {
    id: "pascals-triangle", t: "Pascal's Triangle", d: "E", tp: ["arrays", "dp"], pt: ["dp"], co: ["Amazon", "Apple", "Adobe"], lc: "pascals-triangle",
    s: "Return the first numRows rows of Pascal's triangle.", h: ["Each row starts and ends with 1.", "Every inner value is the sum of the two values above it."],
    a: "Build row by row: row[j] = prev[j - 1] + prev[j].", tc: "O(n²)", sc: "O(n²)", sim: ["unique-paths", "triangle"],
    fn: "generate", params: "numRows:number", ret: "number[][]",
    ex: [[5, [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]], [1, [[1]]]], hid: [[2], [7]],
    code: `function generate(numRows) {
  const rows = [[1]];
  for (let i = 1; i < numRows; i++) {
    const prev = rows[i - 1], row = [1];
    for (let j = 1; j < i; j++) row.push(prev[j - 1] + prev[j]);
    row.push(1);
    rows.push(row);
  }
  return rows;
}`
  },
  {
    id: "isomorphic-strings", t: "Isomorphic Strings", d: "E", tp: ["strings", "hashing"], pt: ["hashing"], co: ["LinkedIn", "Amazon", "Google"], lc: "isomorphic-strings",
    s: "Two strings are isomorphic if characters of s can be replaced one-to-one to get t. Return whether they are.", h: ["The mapping must work in both directions.", "Keep two maps: s→t and t→s."],
    a: "Walk both strings together; if either map already has a different partner, return false.", tc: "O(n)", sc: "O(k)", sim: ["word-pattern", "group-anagrams"],
    fn: "isIsomorphic", params: "s:string, t:string", ret: "boolean",
    ex: [["egg", "add", true], ["foo", "bar", false], ["paper", "title", true]], hid: [["badc", "baba"], ["ab", "aa"], ["a", "a"]],
    code: `function isIsomorphic(s, t) {
  const st = new Map(), ts = new Map();
  for (let i = 0; i < s.length; i++) {
    const a = s[i], b = t[i];
    if ((st.has(a) && st.get(a) !== b) || (ts.has(b) && ts.get(b) !== a)) return false;
    st.set(a, b); ts.set(b, a);
  }
  return true;
}`
  },
  {
    id: "word-pattern", t: "Word Pattern", d: "E", tp: ["strings", "hashing"], pt: ["hashing"], co: ["Uber", "Dropbox", "Amazon"], lc: "word-pattern",
    s: "Does the string of words s follow the same pattern (one-to-one letter ↔ word)?", h: ["Split s into words; lengths must match.", "Same two-map idea as isomorphic strings."],
    a: "Two maps (letter→word, word→letter); any conflict means false.", tc: "O(n)", sc: "O(n)", sim: ["isomorphic-strings"],
    fn: "wordPattern", params: "pattern:string, s:string", ret: "boolean",
    ex: [["abba", "dog cat cat dog", true], ["abba", "dog cat cat fish", false], ["aaaa", "dog cat cat dog", false]], hid: [["abba", "dog dog dog dog"], ["aaa", "aa aa aa aa"], ["abc", "b c a"]],
    code: `function wordPattern(pattern, s) {
  const words = s.split(" ");
  if (words.length !== pattern.length) return false;
  const pw = new Map(), wp = new Map();
  for (let i = 0; i < words.length; i++) {
    const p = pattern[i], w = words[i];
    if ((pw.has(p) && pw.get(p) !== w) || (wp.has(w) && wp.get(w) !== p)) return false;
    pw.set(p, w); wp.set(w, p);
  }
  return true;
}`
  },
  {
    id: "ransom-note", t: "Ransom Note", d: "E", tp: ["hashing", "strings"], pt: ["frequency-counter"], co: ["Microsoft", "Apple"], lc: "ransom-note",
    s: "Can ransomNote be built from the letters of magazine (each letter used once)?", h: ["Count what the magazine offers.", "Spend a letter for each character of the note."],
    a: "Count magazine letters; decrement for each note letter and fail on a negative count.", tc: "O(n + m)", sc: "O(1)", sim: ["valid-anagram", "find-anagrams"],
    fn: "canConstruct", params: "ransomNote:string, magazine:string", ret: "boolean",
    ex: [["a", "b", false], ["aa", "ab", false], ["aa", "aab", true]], hid: [["", "abc"], ["abc", "cba"], ["bg", "efjbdfbdgfjhhaiigfhbaejahgfbbgbjagbddfgdiaigdadhcfcj"]],
    code: `function canConstruct(ransomNote, magazine) {
  const count = new Map();
  for (const c of magazine) count.set(c, (count.get(c) || 0) + 1);
  for (const c of ransomNote) {
    if (!count.get(c)) return false;
    count.set(c, count.get(c) - 1);
  }
  return true;
}`
  },
  {
    id: "first-unique-char", t: "First Unique Character in a String", d: "E", tp: ["hashing", "strings", "queue"], pt: ["frequency-counter"], co: ["Amazon", "Bloomberg", "Goldman Sachs"], lc: "first-unique-character-in-a-string",
    s: "Return the index of the first character that appears exactly once, or -1.", h: ["Two passes are fine.", "First count, then find the first count of 1."],
    a: "Count characters, then scan for the first with count 1.", tc: "O(n)", sc: "O(1)", sim: ["valid-anagram", "sort-characters-by-frequency"],
    fn: "firstUniqChar", params: "s:string", ret: "number",
    ex: [["leetcode", 0], ["loveleetcode", 2], ["aabb", -1]], hid: [["z"], ["dddccdbba"], ["abcabd"]],
    code: `function firstUniqChar(s) {
  const count = new Map();
  for (const c of s) count.set(c, (count.get(c) || 0) + 1);
  for (let i = 0; i < s.length; i++) if (count.get(s[i]) === 1) return i;
  return -1;
}`
  },
  {
    id: "happy-number", t: "Happy Number", d: "E", tp: ["hashing", "math-basics", "fast-slow"], pt: ["fast-slow", "hashing"], co: ["Amazon", "Uber", "Apple"], lc: "happy-number",
    s: "Repeatedly replace n with the sum of the squares of its digits. n is happy if this reaches 1. Return whether n is happy.", h: ["If it never reaches 1, the sequence must loop.", "Detect the loop with a Set, or with fast & slow pointers for O(1) space."],
    a: "Floyd's cycle detection on the sequence n → next(n).", tc: "O(log n) per step", sc: "O(1)", sim: ["linked-list-cycle", "find-duplicate-number"],
    fn: "isHappy", params: "n:number", ret: "boolean",
    ex: [[19, true], [2, false]], hid: [[1], [7], [4], [100]],
    code: `function isHappy(n) {
  const next = x => { let s = 0; while (x) { const d = x % 10; s += d * d; x = Math.floor(x / 10); } return s; };
  let slow = n, fast = next(n);
  while (fast !== 1 && slow !== fast) { slow = next(slow); fast = next(next(fast)); }
  return fast === 1;
}`
  },
  {
    id: "contains-duplicate-ii", t: "Contains Duplicate II", d: "E", tp: ["hashing", "sliding-window", "arrays"], pt: ["sliding-window", "hashing"], co: ["Amazon", "Airbnb", "Palantir"], lc: "contains-duplicate-ii",
    s: "Return true if two equal values exist at indexes i ≠ j with |i - j| ≤ k.", h: ["Remember the last index of each value.", "Or keep a Set holding only the last k values (a sliding window)."],
    a: "Map value → last index; a repeat within distance k answers true.", tc: "O(n)", sc: "O(min(n, k))", sim: ["contains-duplicate", "max-avg-subarray"],
    fn: "containsNearbyDuplicate", params: "nums:number[], k:number", ret: "boolean",
    ex: [[[1, 2, 3, 1], 3, true], [[1, 0, 1, 1], 1, true], [[1, 2, 3, 1, 2, 3], 2, false]], hid: [[[1], 1], [[99, 99], 2], [[1, 2, 1], 0]],
    code: `function containsNearbyDuplicate(nums, k) {
  const last = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (last.has(nums[i]) && i - last.get(nums[i]) <= k) return true;
    last.set(nums[i], i);
  }
  return false;
}`
  },
  {
    id: "valid-sudoku", t: "Valid Sudoku", d: "M", tp: ["hashing", "arrays"], pt: ["hashing"], co: ["Amazon", "Apple", "Uber", "Microsoft"], lc: "valid-sudoku",
    s: "Check whether a partially filled 9×9 board is valid: no repeated digit in any row, column, or 3×3 box. Empty cells are '.'.", h: ["Keep a Set for each row, each column and each box.", "Box index = Math.floor(r / 3) * 3 + Math.floor(c / 3)."],
    a: "One pass; for each digit check and record it in its row, column and box sets.", tc: "O(81)", sc: "O(81)", sim: ["sudoku-solver"],
    fn: "isValidSudoku", params: "board:character[][]", ret: "boolean",
    ex: [[[["5", "3", ".", ".", "7", ".", ".", ".", "."], ["6", ".", ".", "1", "9", "5", ".", ".", "."], [".", "9", "8", ".", ".", ".", ".", "6", "."], ["8", ".", ".", ".", "6", ".", ".", ".", "3"], ["4", ".", ".", "8", ".", "3", ".", ".", "1"], ["7", ".", ".", ".", "2", ".", ".", ".", "6"], [".", "6", ".", ".", ".", ".", "2", "8", "."], [".", ".", ".", "4", "1", "9", ".", ".", "5"], [".", ".", ".", ".", "8", ".", ".", "7", "9"]], true],
      [[["8", "3", ".", ".", "7", ".", ".", ".", "."], ["6", ".", ".", "1", "9", "5", ".", ".", "."], [".", "9", "8", ".", ".", ".", ".", "6", "."], ["8", ".", ".", ".", "6", ".", ".", ".", "3"], ["4", ".", ".", "8", ".", "3", ".", ".", "1"], ["7", ".", ".", ".", "2", ".", ".", ".", "6"], [".", "6", ".", ".", ".", ".", "2", "8", "."], [".", ".", ".", "4", "1", "9", ".", ".", "5"], [".", ".", ".", ".", "8", ".", ".", "7", "9"]], false]],
    hid: [[[[".", ".", ".", ".", "5", ".", ".", "1", "."], [".", "4", ".", "3", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "3", ".", ".", "1"], ["8", ".", ".", ".", ".", ".", ".", "2", "."], [".", ".", "2", ".", "7", ".", ".", ".", "."], [".", "1", "5", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "2", ".", ".", "."], [".", "2", ".", "9", ".", ".", ".", ".", "."], [".", ".", "4", ".", ".", ".", ".", ".", "."]]]],
    code: `function isValidSudoku(board) {
  const rows = Array.from({ length: 9 }, () => new Set());
  const cols = Array.from({ length: 9 }, () => new Set());
  const boxes = Array.from({ length: 9 }, () => new Set());
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (v === ".") continue;
      const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if (rows[r].has(v) || cols[c].has(v) || boxes[b].has(v)) return false;
      rows[r].add(v); cols[c].add(v); boxes[b].add(v);
    }
  }
  return true;
}`
  },
  {
    id: "sort-colors", t: "Sort Colors (Dutch National Flag)", d: "M", tp: ["arrays", "two-pointers", "sorting"], pt: ["two-pointers"], co: ["Microsoft", "Amazon", "Meta", "Adobe"], lc: "sort-colors",
    s: "nums contains only 0, 1 and 2. Sort it in place in one pass without a library sort.", h: ["Keep three regions: 0s at the front, 2s at the back, unknown in the middle.", "Pointers low, mid, high: swap 0s to low, 2s to high."],
    a: "Dutch national flag partition with three pointers.", tc: "O(n)", sc: "O(1)", sim: ["move-zeroes", "partition-list", "sort-array"],
    fn: "sortColors", params: "nums:number[]", ret: "void", inplace: 0, note: "Sort nums in place. The judge checks nums after your function runs.",
    ex: [[[2, 0, 2, 1, 1, 0], [0, 0, 1, 1, 2, 2]], [[2, 0, 1], [0, 1, 2]]], hid: [[[0]], [[2, 2, 1, 1, 0, 0]], [[1, 0, 1, 2, 0]]],
    code: `function sortColors(nums) {
  let lo = 0, mid = 0, hi = nums.length - 1;
  while (mid <= hi) {
    if (nums[mid] === 0) { [nums[lo], nums[mid]] = [nums[mid], nums[lo]]; lo++; mid++; }
    else if (nums[mid] === 2) { [nums[mid], nums[hi]] = [nums[hi], nums[mid]]; hi--; }
    else mid++;
  }
}`
  },
  {
    id: "next-permutation", t: "Next Permutation", d: "M", tp: ["arrays", "two-pointers"], pt: ["two-pointers"], co: ["Google", "Meta", "Amazon", "Bloomberg"], lc: "next-permutation",
    s: "Rearrange nums into the next lexicographically greater permutation in place (or the smallest, if it's the last one).", h: ["Find the first index i from the right with nums[i] < nums[i + 1].", "Swap nums[i] with the smallest bigger value to its right, then reverse the suffix."],
    a: "Find pivot, swap with rightmost larger element, reverse the tail.", tc: "O(n)", sc: "O(1)", sim: ["permutations", "permutations-ii"],
    fn: "nextPermutation", params: "nums:number[]", ret: "void", inplace: 0, note: "Modify nums in place.",
    ex: [[[1, 2, 3], [1, 3, 2]], [[3, 2, 1], [1, 2, 3]], [[1, 1, 5], [1, 5, 1]]], hid: [[[1]], [[1, 3, 2]], [[2, 3, 1]], [[1, 5, 8, 4, 7, 6, 5, 3, 1]]],
    code: `function nextPermutation(nums) {
  let i = nums.length - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = nums.length - 1;
    while (nums[j] <= nums[i]) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  for (let l = i + 1, r = nums.length - 1; l < r; l++, r--) [nums[l], nums[r]] = [nums[r], nums[l]];
}`
  },
  {
    id: "spiral-matrix", t: "Spiral Matrix", d: "M", tp: ["arrays"], pt: ["two-pointers"], co: ["Microsoft", "Amazon", "Apple", "Google"], lc: "spiral-matrix",
    s: "Return all elements of an m×n matrix in spiral order.", h: ["Keep four boundaries: top, bottom, left, right.", "Walk one edge, then shrink that boundary."],
    a: "Layer by layer with shrinking boundaries; guard the last row/column to avoid duplicates.", tc: "O(mn)", sc: "O(1) extra", sim: ["rotate-image", "set-matrix-zeroes"],
    fn: "spiralOrder", params: "matrix:number[][]", ret: "number[]",
    ex: [[[[1, 2, 3], [4, 5, 6], [7, 8, 9]], [1, 2, 3, 6, 9, 8, 7, 4, 5]], [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]]],
    hid: [[[[1]]], [[[1, 2], [3, 4]]], [[[1], [2], [3]]], [[[1, 2, 3]]]],
    code: `function spiralOrder(matrix) {
  const res = [];
  let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) res.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);
    right--;
    if (top <= bottom) { for (let c = right; c >= left; c--) res.push(matrix[bottom][c]); bottom--; }
    if (left <= right) { for (let r = bottom; r >= top; r--) res.push(matrix[r][left]); left++; }
  }
  return res;
}`
  },
  {
    id: "rotate-image", t: "Rotate Image", d: "M", tp: ["arrays", "math-basics"], pt: ["two-pointers"], co: ["Amazon", "Microsoft", "Apple", "Meta"], lc: "rotate-image",
    s: "Rotate an n×n matrix 90° clockwise, in place.", h: ["Rotation = transpose + reverse each row.", "Transpose swaps matrix[i][j] with matrix[j][i] for j > i."],
    a: "Transpose in place, then reverse every row.", tc: "O(n²)", sc: "O(1)", sim: ["spiral-matrix", "set-matrix-zeroes"],
    fn: "rotate", params: "matrix:number[][]", ret: "void", inplace: 0, note: "Rotate matrix in place.",
    ex: [[[[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[7, 4, 1], [8, 5, 2], [9, 6, 3]]], [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]], [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]]],
    hid: [[[[1]]], [[[1, 2], [3, 4]]]],
    code: `function rotate(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
  for (const row of matrix) row.reverse();
}`
  },
  {
    id: "set-matrix-zeroes", t: "Set Matrix Zeroes", d: "M", tp: ["arrays", "hashing"], pt: ["hashing"], co: ["Amazon", "Microsoft", "Meta"], lc: "set-matrix-zeroes",
    s: "If a cell is 0, set its entire row and column to 0, in place.", h: ["First record which rows and columns contain a zero, then write.", "For O(1) space, use the first row and column as the markers."],
    a: "Collect zero rows/columns in sets, then zero them out.", tc: "O(mn)", sc: "O(m + n)", f: ["Do it in O(1) extra space"], sim: ["game-of-life", "rotate-image"],
    fn: "setZeroes", params: "matrix:number[][]", ret: "void", inplace: 0, note: "Modify matrix in place.",
    ex: [[[[1, 1, 1], [1, 0, 1], [1, 1, 1]], [[1, 0, 1], [0, 0, 0], [1, 0, 1]]], [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]], [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]]],
    hid: [[[[1]]], [[[0, 1]]], [[[1, 2, 3], [4, 0, 6], [7, 8, 0]]]],
    code: `function setZeroes(matrix) {
  const rows = new Set(), cols = new Set();
  matrix.forEach((row, r) => row.forEach((v, c) => { if (v === 0) { rows.add(r); cols.add(c); } }));
  matrix.forEach((row, r) => row.forEach((_, c) => { if (rows.has(r) || cols.has(c)) row[c] = 0; }));
}`
  },
  {
    id: "game-of-life", t: "Game of Life", d: "M", tp: ["arrays"], pt: ["hashing"], co: ["Dropbox", "Google", "Amazon"], lc: "game-of-life",
    s: "Compute the next state of Conway's Game of Life in place (live cell with 2–3 live neighbours survives; dead cell with exactly 3 becomes alive).", h: ["All cells update at the same time, so don't overwrite values you still need.", "Encode transitions: e.g. 2 = was alive, now dead; 3 = was dead, now alive."],
    a: "Mark transitions with extra states in one pass, then normalize in a second pass.", tc: "O(mn)", sc: "O(1)", sim: ["set-matrix-zeroes"],
    fn: "gameOfLife", params: "board:number[][]", ret: "void", inplace: 0, note: "Update board in place.",
    ex: [[[[0, 1, 0], [0, 0, 1], [1, 1, 1], [0, 0, 0]], [[0, 0, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0]]], [[[1, 1], [1, 0]], [[1, 1], [1, 1]]]],
    hid: [[[[1]]], [[[0, 0, 0], [1, 1, 1], [0, 0, 0]]]],
    code: `function gameOfLife(board) {
  const R = board.length, C = board[0].length;
  const alive = v => v === 1 || v === 2;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && cc >= 0 && rr < R && cc < C && alive(board[rr][cc])) n++;
    }
    if (board[r][c] === 1 && (n < 2 || n > 3)) board[r][c] = 2;
    if (board[r][c] === 0 && n === 3) board[r][c] = 3;
  }
  for (const row of board) for (let c = 0; c < C; c++) row[c] = row[c] === 2 ? 0 : row[c] === 3 ? 1 : row[c];
}`
  },
  {
    id: "longest-common-prefix", t: "Longest Common Prefix", d: "E", tp: ["strings", "trie"], pt: ["two-pointers"], co: ["Amazon", "Google", "Apple", "Adobe"], lc: "longest-common-prefix",
    s: "Return the longest common prefix among an array of strings (\"\" if none).", h: ["Compare character by character across all words.", "Or sort: only the first and last words matter."],
    a: "Vertical scan: grow the prefix while every word has the same character at that index.", tc: "O(total chars)", sc: "O(1)", sim: ["implement-trie", "search-suggestions"],
    fn: "longestCommonPrefix", params: "strs:string[]", ret: "string",
    ex: [[["flower", "flow", "flight"], "fl"], [["dog", "racecar", "car"], ""]], hid: [[["a"]], [["", "b"]], [["interview", "internet", "interval", "internal"]]],
    code: `function longestCommonPrefix(strs) {
  for (let i = 0; i < strs[0].length; i++) {
    for (const s of strs) if (s[i] !== strs[0][i]) return strs[0].slice(0, i);
  }
  return strs[0];
}`
  },
  {
    id: "max-product-subarray", t: "Maximum Product Subarray", d: "M", tp: ["arrays", "dp"], pt: ["dp"], co: ["Amazon", "LinkedIn", "Google", "Microsoft"], lc: "maximum-product-subarray",
    s: "Return the largest product of a contiguous subarray.", h: ["A negative number turns the smallest product into the largest.", "Track both the max and min product ending at each index."],
    a: "Kadane variant: at each x, newMax = max(x, x·max, x·min), newMin similarly.", tc: "O(n)", sc: "O(1)", sim: ["max-subarray", "maximum-sum-circular"],
    fn: "maxProduct", params: "nums:number[]", ret: "number",
    ex: [[[2, 3, -2, 4], 6], [[-2, 0, -1], 0], [[-2, 3, -4], 24]], hid: [[[-2]], [[0, 2]], [[-1, -2, -9, -6]], [[2, -5, -2, -4, 3]]],
    code: `function maxProduct(nums) {
  let hi = nums[0], lo = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    [hi, lo] = [Math.max(x, x * hi, x * lo), Math.min(x, x * hi, x * lo)];
    best = Math.max(best, hi);
  }
  return best;
}`
  },
  {
    id: "subarray-sums-divisible-k", t: "Subarray Sums Divisible by K", d: "M", tp: ["prefix-sum", "hashing", "arrays", "math-basics"], pt: ["prefix-sum", "hashing"], co: ["Amazon", "Twilio", "Microsoft"], lc: "subarray-sums-divisible-by-k",
    s: "Count non-empty subarrays whose sum is divisible by k.", h: ["Two prefixes with the same remainder mod k bound a divisible subarray.", "Careful: JS % can be negative. Normalize with ((x % k) + k) % k."],
    a: "Count prefix-sum remainders in a Map; each repeated remainder adds its previous count.", tc: "O(n)", sc: "O(k)", sim: ["subarray-sum-k", "continuous-subarray-sum"],
    fn: "subarraysDivByK", params: "nums:number[], k:number", ret: "number",
    ex: [[[4, 5, 0, -2, -3, 1], 5, 7], [[5], 9, 0]], hid: [[[-1, 2, 9], 2], [[2, -2, 2, -4], 6], [[0, 0, 0], 3]],
    code: `function subarraysDivByK(nums, k) {
  const count = new Map([[0, 1]]);
  let pre = 0, res = 0;
  for (const x of nums) {
    pre = ((pre + x) % k + k) % k;
    res += count.get(pre) || 0;
    count.set(pre, (count.get(pre) || 0) + 1);
  }
  return res;
}`
  },
  {
    id: "continuous-subarray-sum", t: "Continuous Subarray Sum", d: "M", tp: ["prefix-sum", "hashing", "math-basics"], pt: ["prefix-sum", "hashing"], co: ["Meta", "Amazon", "Microsoft"], lc: "continuous-subarray-sum",
    s: "Is there a subarray of length at least 2 whose sum is a multiple of k?", h: ["Same remainder at two prefix positions ⇒ the part between is a multiple of k.", "Store the first index of each remainder and require a gap of at least 2."],
    a: "Map remainder → earliest index (seed 0 → -1).", tc: "O(n)", sc: "O(min(n, k))", sim: ["subarray-sums-divisible-k", "subarray-sum-k"],
    fn: "checkSubarraySum", params: "nums:number[], k:number", ret: "boolean",
    ex: [[[23, 2, 4, 6, 7], 6, true], [[23, 2, 6, 4, 7], 6, true], [[23, 2, 6, 4, 7], 13, false]], hid: [[[0], 1], [[0, 0], 1], [[5, 0, 0, 0], 3], [[1, 2, 12], 6]],
    code: `function checkSubarraySum(nums, k) {
  const first = new Map([[0, -1]]);
  let pre = 0;
  for (let i = 0; i < nums.length; i++) {
    pre = (pre + nums[i]) % k;
    if (first.has(pre)) { if (i - first.get(pre) >= 2) return true; }
    else first.set(pre, i);
  }
  return false;
}`
  },
  {
    id: "range-sum-query", t: "Range Sum Query - Immutable", d: "E", tp: ["prefix-sum", "arrays"], pt: ["prefix-sum"], co: ["Meta", "Amazon", "Palantir"], lc: "range-sum-query-immutable",
    s: "Design NumArray(nums) with sumRange(left, right) returning the sum of nums[left..right]. Many queries will be made.", h: ["Don't loop per query.", "Precompute pre[i] = sum of the first i numbers."],
    a: "Prefix sums: sumRange = pre[right + 1] - pre[left].", tc: "O(n) build, O(1) query", sc: "O(n)", sim: ["pivot-index", "product-except-self", "subarray-sum-k"],
    fn: "NumArray", ctor: "nums:number[]", methods: "sumRange(left:number, right:number):number",
    ex: [[["NumArray", "sumRange", "sumRange", "sumRange"], [[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]], [null, 1, -1, -3]]],
    hid: [[["NumArray", "sumRange", "sumRange"], [[[5]], [0, 0], [0, 0]]], [["NumArray", "sumRange", "sumRange", "sumRange"], [[[1, 2, 3, 4, 5]], [1, 3], [4, 4], [0, 4]]]],
    code: `class NumArray {
  constructor(nums) {
    this.pre = [0];
    for (const x of nums) this.pre.push(this.pre[this.pre.length - 1] + x);
  }
  sumRange(left, right) {
    return this.pre[right + 1] - this.pre[left];
  }
}`
  },
  {
    id: "pivot-index", t: "Find Pivot Index", d: "E", tp: ["prefix-sum", "arrays"], pt: ["prefix-sum"], co: ["Amazon", "Goldman Sachs", "Adobe"], lc: "find-pivot-index",
    s: "Return the leftmost index where the sum to its left equals the sum to its right, or -1.", h: ["Compute the total once.", "Right sum = total - left - nums[i]."],
    a: "Single pass with a running left sum.", tc: "O(n)", sc: "O(1)", sim: ["range-sum-query", "product-except-self"],
    fn: "pivotIndex", params: "nums:number[]", ret: "number",
    ex: [[[1, 7, 3, 6, 5, 6], 3], [[1, 2, 3], -1], [[2, 1, -1], 0]], hid: [[[0]], [[-1, -1, 0, 1, 1, 0]], [[1, 0]]],
    code: `function pivotIndex(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  let left = 0;
  for (let i = 0; i < nums.length; i++) {
    if (left === total - left - nums[i]) return i;
    left += nums[i];
  }
  return -1;
}`
  },
  {
    id: "find-duplicate-number", t: "Find the Duplicate Number", d: "M", tp: ["arrays", "fast-slow", "binary-search"], pt: ["fast-slow", "binary-search"], co: ["Amazon", "Microsoft", "Google", "Bloomberg"], lc: "find-the-duplicate-number",
    s: "nums has n + 1 integers in [1, n] and exactly one repeated value. Find it without modifying nums, in O(1) space.", h: ["Treat i → nums[i] as a linked list; the duplicate creates a cycle.", "Floyd: find the meeting point, then restart one pointer to find the cycle entrance."],
    a: "Tortoise and hare on indexes; the cycle entrance is the duplicate.", tc: "O(n)", sc: "O(1)", sim: ["linked-list-cycle-ii", "linked-list-cycle", "happy-number"],
    fn: "findDuplicate", params: "nums:number[]", ret: "number",
    ex: [[[1, 3, 4, 2, 2], 2], [[3, 1, 3, 4, 2], 3], [[3, 3, 3, 3, 3], 3]], hid: [[[1, 1]], [[2, 5, 9, 6, 9, 3, 8, 9, 7, 1]], [[1, 4, 4, 2, 4]]],
    code: `function findDuplicate(nums) {
  let slow = nums[0], fast = nums[0];
  do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) { slow = nums[slow]; fast = nums[fast]; }
  return slow;
}`
  },
  {
    id: "first-missing-positive", t: "First Missing Positive", d: "H", tp: ["arrays", "hashing"], pt: ["hashing"], co: ["Amazon", "Google", "Microsoft", "Meta"], lc: "first-missing-positive",
    s: "Return the smallest positive integer not in nums, in O(n) time and O(1) extra space.", h: ["The answer is in [1, n + 1].", "Cyclic sort: put each value v in [1, n] at index v - 1."],
    a: "Swap values into their home index, then the first index i with nums[i] ≠ i + 1 gives the answer.", tc: "O(n)", sc: "O(1)", sim: ["missing-number", "find-disappeared-numbers"],
    fn: "firstMissingPositive", params: "nums:number[]", ret: "number",
    ex: [[[1, 2, 0], 3], [[3, 4, -1, 1], 2], [[7, 8, 9, 11, 12], 1]], hid: [[[1]], [[2]], [[1, 1]], [[2, 1, 4, 3, 6, 5]]],
    code: `function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const j = nums[i] - 1;
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }
  for (let i = 0; i < n; i++) if (nums[i] !== i + 1) return i + 1;
  return n + 1;
}`
  },
  {
    id: "top-k-frequent-words", t: "Top K Frequent Words", d: "M", tp: ["hashing", "heap", "sorting", "trie"], pt: ["top-k", "frequency-counter"], co: ["Amazon", "Uber", "Bloomberg", "Yelp"], lc: "top-k-frequent-words",
    s: "Return the k most frequent words, sorted by frequency (high to low), ties broken alphabetically.", h: ["Count with a Map.", "Sort entries by (-count, word), or keep a min-heap of size k with the reverse order."],
    a: "Count, sort with a two-key comparator, take the first k.", tc: "O(n log n)", sc: "O(n)", sim: ["top-k-frequent", "sort-characters-by-frequency", "k-closest-points"],
    fn: "topKFrequent", params: "words:string[], k:number", ret: "string[]",
    ex: [[["i", "love", "leetcode", "i", "love", "coding"], 2, ["i", "love"]], [["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], 4, ["the", "is", "sunny", "day"]]],
    hid: [[["a"], 1], [["b", "a", "c", "b", "a"], 3], [["aaa", "aa", "a"], 1]],
    code: `function topKFrequent(words, k) {
  const count = new Map();
  for (const w of words) count.set(w, (count.get(w) || 0) + 1);
  return [...count.keys()]
    .sort((a, b) => count.get(b) - count.get(a) || (a < b ? -1 : a > b ? 1 : 0))
    .slice(0, k);
}`
  },
  {
    id: "sort-characters-by-frequency", t: "Sort Characters By Frequency", d: "M", tp: ["hashing", "sorting", "heap", "strings"], pt: ["frequency-counter", "top-k"], co: ["Amazon", "Google", "Bloomberg"], lc: "sort-characters-by-frequency",
    s: "Sort the string so the most frequent characters come first; equal characters stay together. Any valid order of ties is accepted.", h: ["Count characters.", "Bucket by frequency (0..n) or sort entries by count."],
    a: "Count, sort characters by count descending, repeat each by its count.", tc: "O(n log k)", sc: "O(n)", sim: ["top-k-frequent", "top-k-frequent-words", "reorganize-string"],
    fn: "frequencySort", params: "s:string", ret: "string",
    check: `(args, out) => { const s = args[0]; if (typeof out !== "string" || out.length !== s.length) return false; const c = new Map(); for (const ch of s) c.set(ch, (c.get(ch) || 0) + 1); for (const ch of out) { if (!c.get(ch)) return false; c.set(ch, c.get(ch) - 1); } let i = 0, prev = Infinity; const seen = new Set(); while (i < out.length) { let j = i; while (j < out.length && out[j] === out[i]) j++; if (seen.has(out[i]) || j - i > prev) return false; seen.add(out[i]); prev = j - i; i = j; } return true; }`,
    ex: [["tree", "eert"], ["cccaaa", "aaaccc"], ["Aabb", "bbAa"]], hid: [["a"], ["loveleetcode"], ["2a554442f544asfasssffffasss"]],
    code: `function frequencySort(s) {
  const count = new Map();
  for (const c of s) count.set(c, (count.get(c) || 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([c, n]) => c.repeat(n)).join("");
}`
  },
  {
    id: "longest-palindrome-build", t: "Longest Palindrome (build from letters)", d: "E", tp: ["hashing", "strings", "greedy"], pt: ["frequency-counter", "greedy"], co: ["Google", "Amazon"], lc: "longest-palindrome",
    s: "Return the length of the longest palindrome that can be built with the letters of s (case-sensitive).", h: ["Pairs can always go on both sides.", "One odd-count letter may sit in the middle."],
    a: "Sum floor(count / 2) * 2 over letters, plus 1 if any count was odd.", tc: "O(n)", sc: "O(1)", sim: ["longest-palindromic-substring", "palindromic-substrings", "valid-palindrome"],
    fn: "longestPalindrome", params: "s:string", ret: "number",
    ex: [["abccccdd", 7], ["a", 1]], hid: [["Aa"], ["bb"], ["civilwartestingwhetherthatnaptionoranynartionsoconceivedandsodedicated"]],
    code: `function longestPalindrome(s) {
  const count = new Map();
  for (const c of s) count.set(c, (count.get(c) || 0) + 1);
  let len = 0, odd = false;
  for (const n of count.values()) { len += Math.floor(n / 2) * 2; if (n % 2) odd = true; }
  return len + (odd ? 1 : 0);
}`
  },
  {
    id: "number-of-good-pairs", t: "Number of Good Pairs", d: "E", tp: ["hashing", "arrays", "math-basics"], pt: ["frequency-counter"], co: ["Amazon", "Adobe"], lc: "number-of-good-pairs",
    s: "Count pairs (i, j) with i < j and nums[i] == nums[j].", h: ["Each new occurrence pairs with every earlier equal value.", "Add the current count before incrementing it."],
    a: "Running frequency map; answer += count[x] then count[x]++.", tc: "O(n)", sc: "O(n)", sim: ["two-sum", "contains-duplicate"],
    fn: "numIdenticalPairs", params: "nums:number[]", ret: "number",
    ex: [[[1, 2, 3, 1, 1, 3], 4], [[1, 1, 1, 1], 6], [[1, 2, 3], 0]], hid: [[[5]], [[2, 2, 2, 3, 3]]],
    code: `function numIdenticalPairs(nums) {
  const count = new Map();
  let pairs = 0;
  for (const x of nums) {
    pairs += count.get(x) || 0;
    count.set(x, (count.get(x) || 0) + 1);
  }
  return pairs;
}`
  },
  {
    id: "brick-wall", t: "Brick Wall", d: "M", tp: ["hashing", "prefix-sum"], pt: ["hashing", "prefix-sum"], co: ["Meta", "Amazon"], lc: "brick-wall",
    s: "Each row lists brick widths. Draw one vertical line from top to bottom crossing the fewest bricks (not along the outer edges). Return that number.", h: ["A line through an edge doesn't cross that brick.", "Count, over all rows, how often each prefix-sum position is an edge."],
    a: "Count edge positions (excluding the wall end); answer = rows - max count.", tc: "O(total bricks)", sc: "O(width positions)", sim: ["subarray-sum-k", "range-sum-query"],
    fn: "leastBricks", params: "wall:number[][]", ret: "number",
    ex: [[[[1, 2, 2, 1], [3, 1, 2], [1, 3, 2], [2, 4], [3, 1, 2], [1, 3, 1, 1]], 2], [[[1], [1], [1]], 3]], hid: [[[[1, 1], [2], [1, 1]]], [[[100000000], [100000000]]]],
    code: `function leastBricks(wall) {
  const edges = new Map();
  let best = 0;
  for (const row of wall) {
    let pos = 0;
    for (let i = 0; i < row.length - 1; i++) {
      pos += row[i];
      edges.set(pos, (edges.get(pos) || 0) + 1);
      best = Math.max(best, edges.get(pos));
    }
  }
  return wall.length - best;
}`
  },
  {
    id: "max-subarray-one-deletion", t: "Maximum Subarray Sum with One Deletion", d: "M", tp: ["arrays", "dp"], pt: ["dp"], co: ["Two Sigma", "Amazon"], lc: "maximum-subarray-sum-with-one-deletion",
    s: "Return the maximum sum of a non-empty subarray where you may delete at most one element (the result must stay non-empty).", h: ["Track two states per index: best sum ending here with no deletion, and with one deletion.", "With one deletion: either delete the current element (take noDel from before) or extend the one-deletion sum."],
    a: "Kadane with two states: keep = max(x, keep + x), del = max(prevKeep, del + x).", tc: "O(n)", sc: "O(1)", sim: ["max-subarray", "max-product-subarray", "maximum-sum-circular"],
    fn: "maximumSum", params: "arr:number[]", ret: "number",
    ex: [[[1, -2, 0, 3], 4], [[1, -2, -2, 3], 3], [[-1, -1, -1, -1], -1]], hid: [[[5]], [[2, 1, -2, -5, -2]], [[8, -1, 6, -7, -4, 5, -4, 7, -6]]],
    code: `function maximumSum(arr) {
  let keep = arr[0], del = -Infinity, best = arr[0];
  for (let i = 1; i < arr.length; i++) {
    const x = arr[i];
    del = Math.max(keep, del + x);
    keep = Math.max(x, keep + x);
    best = Math.max(best, keep, del);
  }
  return best;
}`
  }
];
