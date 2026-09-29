import type { ProblemDef } from "@/lib/types";

/** Two pointers and sliding window. */
export const POINTERS_WINDOW: ProblemDef[] = [
  {
    id: "two-sum-ii", t: "Two Sum II - Input Array Is Sorted", d: "M", tp: ["two-pointers", "arrays", "binary-search"], pt: ["two-pointers", "binary-search"], co: ["Amazon", "Adobe", "Apple"], lc: "two-sum-ii-input-array-is-sorted",
    s: "numbers is sorted. Return the 1-based indexes [i, j] (i < j) of two numbers adding to target, using O(1) extra space.", h: ["A hash map works but uses O(n) space.", "Sorted → pointers at both ends."],
    a: "Move left up when the sum is too small, right down when too big.", tc: "O(n)", sc: "O(1)", sim: ["two-sum", "three-sum", "two-sum-bst"],
    fn: "twoSum", params: "numbers:number[], target:number", ret: "number[]",
    ex: [[[2, 7, 11, 15], 9, [1, 2]], [[2, 3, 4], 6, [1, 3]], [[-1, 0], -1, [1, 2]]], hid: [[[1, 2, 3, 4, 4, 9, 56, 90], 8], [[5, 25, 75], 100], [[-3, -1, 0, 2, 7], 6]],
    code: `function twoSum(numbers, target) {
  let l = 0, r = numbers.length - 1;
  while (l < r) {
    const s = numbers[l] + numbers[r];
    if (s === target) return [l + 1, r + 1];
    if (s < target) l++; else r--;
  }
  return [];
}`
  },
  {
    id: "three-sum-closest", t: "3Sum Closest", d: "M", tp: ["two-pointers", "sorting", "arrays"], pt: ["two-pointers"], co: ["Meta", "Amazon", "Bloomberg"], lc: "3sum-closest",
    s: "Return the sum of three integers in nums that is closest to target (exactly one answer).", h: ["Sort, fix one element, run two pointers on the rest.", "Update the best whenever |sum - target| improves."],
    a: "Sorting + two pointers per fixed index.", tc: "O(n²)", sc: "O(1)", sim: ["three-sum", "four-sum"],
    fn: "threeSumClosest", params: "nums:number[], target:number", ret: "number",
    ex: [[[-1, 2, 1, -4], 1, 2], [[0, 0, 0], 1, 0]], hid: [[[1, 1, 1, 0], -100], [[4, 0, 5, -5, 3, 3, 0, -4, -5], -2], [[1, 2, 5, 10, 11], 12]],
    code: `function threeSumClosest(nums, target) {
  nums.sort((a, b) => a - b);
  let best = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < nums.length - 2; i++) {
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const s = nums[i] + nums[l] + nums[r];
      if (Math.abs(s - target) < Math.abs(best - target)) best = s;
      if (s === target) return s;
      if (s < target) l++; else r--;
    }
  }
  return best;
}`
  },
  {
    id: "four-sum", t: "4Sum", d: "M", tp: ["two-pointers", "sorting", "arrays"], pt: ["two-pointers"], co: ["Amazon", "Adobe", "Apple"], lc: "4sum",
    s: "Return all unique quadruplets that sum to target.", h: ["Sort; fix two indexes with nested loops.", "Two pointers for the last two; skip duplicates at every level."],
    a: "Two outer loops + two pointers, skipping equal neighbours.", tc: "O(n³)", sc: "O(1)", sim: ["three-sum", "two-sum-ii"],
    fn: "fourSum", params: "nums:number[], target:number", ret: "number[][]", cmp: "groups",
    ex: [[[1, 0, -1, 0, -2, 2], 0, [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]], [[2, 2, 2, 2, 2], 8, [[2, 2, 2, 2]]]], hid: [[[0, 0, 0, 0], 1], [[-3, -1, 0, 2, 4, 5], 2], [[1, -2, -5, -4, -3, 3, 3, 5], -11]],
    code: `function fourSum(nums, target) {
  nums.sort((a, b) => a - b);
  const res = [], n = nums.length;
  for (let i = 0; i < n - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;
      let l = j + 1, r = n - 1;
      while (l < r) {
        const s = nums[i] + nums[j] + nums[l] + nums[r];
        if (s === target) {
          res.push([nums[i], nums[j], nums[l], nums[r]]);
          while (l < r && nums[l] === nums[l + 1]) l++;
          while (l < r && nums[r] === nums[r - 1]) r--;
          l++; r--;
        } else if (s < target) l++; else r--;
      }
    }
  }
  return res;
}`
  },
  {
    id: "squares-sorted-array", t: "Squares of a Sorted Array", d: "E", tp: ["two-pointers", "arrays", "sorting"], pt: ["two-pointers"], co: ["Meta", "Amazon", "Uber"], lc: "squares-of-a-sorted-array",
    s: "Given a sorted array (may include negatives), return the squares in sorted order in O(n).", h: ["The largest square is at one of the two ends.", "Fill the result from the back."],
    a: "Two pointers from both ends; place the larger square at the end of the output.", tc: "O(n)", sc: "O(n)", sim: ["merge-sorted-array", "two-sum-ii"],
    fn: "sortedSquares", params: "nums:number[]", ret: "number[]",
    ex: [[[-4, -1, 0, 3, 10], [0, 1, 9, 16, 100]], [[-7, -3, 2, 3, 11], [4, 9, 9, 49, 121]]], hid: [[[1]], [[-5, -3, -2, -1]], [[-2, 0, 2]]],
    code: `function sortedSquares(nums) {
  const res = new Array(nums.length);
  let l = 0, r = nums.length - 1;
  for (let k = nums.length - 1; k >= 0; k--) {
    if (Math.abs(nums[l]) > Math.abs(nums[r])) res[k] = nums[l] * nums[l++];
    else res[k] = nums[r] * nums[r--];
  }
  return res;
}`
  },
  {
    id: "merge-sorted-array", t: "Merge Sorted Array", d: "E", tp: ["two-pointers", "arrays", "sorting"], pt: ["two-pointers"], co: ["Meta", "Microsoft", "Amazon", "Bloomberg"], lc: "merge-sorted-array",
    s: "nums1 has length m + n (last n slots are 0 placeholders). Merge sorted nums2 into nums1 in place.", h: ["Filling from the front would overwrite values you still need.", "Fill from the back with three pointers."],
    a: "Compare the largest remaining of both arrays and write it at the end.", tc: "O(m + n)", sc: "O(1)", sim: ["merge-sorted-lists", "squares-sorted-array", "merge-k-sorted-lists"],
    fn: "merge", params: "nums1:number[], m:number, nums2:number[], n:number", ret: "void", inplace: 0, note: "Modify nums1 in place.",
    ex: [[[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3, [1, 2, 2, 3, 5, 6]], [[1], 1, [], 0, [1]], [[0], 0, [1], 1, [1]]], hid: [[[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3], [[2, 0], 1, [1], 1]],
    code: `function merge(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
    else nums1[k--] = nums2[j--];
  }
}`
  },
  {
    id: "valid-palindrome-ii", t: "Valid Palindrome II", d: "E", tp: ["two-pointers", "strings", "greedy"], pt: ["two-pointers", "greedy"], co: ["Meta", "Amazon", "Microsoft"], lc: "valid-palindrome-ii",
    s: "Can s become a palindrome after deleting at most one character?", h: ["Use two pointers until the first mismatch.", "At a mismatch, try skipping the left or the right character."],
    a: "On the first mismatch check whether s[l+1..r] or s[l..r-1] is a palindrome.", tc: "O(n)", sc: "O(1)", sim: ["valid-palindrome", "palindrome-linked-list"],
    fn: "validPalindrome", params: "s:string", ret: "boolean",
    ex: [["aba", true], ["abca", true], ["abc", false]], hid: [["a"], ["deeee"], ["eccer"], ["abcdefdba"], ["cupuufuupuuc"]],
    code: `function validPalindrome(s) {
  const isPal = (l, r) => { while (l < r) if (s[l++] !== s[r--]) return false; return true; };
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return isPal(l + 1, r) || isPal(l, r - 1);
    l++; r--;
  }
  return true;
}`
  },
  {
    id: "reverse-words", t: "Reverse Words in a String", d: "M", tp: ["strings", "two-pointers"], pt: ["two-pointers"], co: ["Microsoft", "Amazon", "Apple"], lc: "reverse-words-in-a-string",
    s: "Reverse the order of words. Remove leading/trailing spaces and reduce multiple spaces to one.", h: ["Split on whitespace and drop empty pieces.", "Without split: reverse the whole string, then each word."],
    a: "Split by spaces, filter empties, reverse, join with a single space.", tc: "O(n)", sc: "O(n)", sim: ["reverse-list", "rotate-array"],
    fn: "reverseWords", params: "s:string", ret: "string",
    ex: [["the sky is blue", "blue is sky the"], ["  hello world  ", "world hello"], ["a good   example", "example good a"]], hid: [["one"], ["  Bob    Loves  Alice   "], ["x y"]],
    code: `function reverseWords(s) {
  return s.split(" ").filter(Boolean).reverse().join(" ");
}`
  },
  {
    id: "is-subsequence", t: "Is Subsequence", d: "E", tp: ["two-pointers", "strings", "dp"], pt: ["two-pointers"], co: ["Pinterest", "Amazon", "Yandex"], lc: "is-subsequence",
    s: "Return true if s is a subsequence of t (same order, not necessarily contiguous).", h: ["Walk through t once.", "Advance a pointer in s whenever characters match."],
    a: "Greedy two pointers.", tc: "O(|t|)", sc: "O(1)", f: ["Many s strings against one t: preprocess t with index lists + binary search"], sim: ["longest-common-subsequence", "distinct-subsequences"],
    fn: "isSubsequence", params: "s:string, t:string", ret: "boolean",
    ex: [["abc", "ahbgdc", true], ["axc", "ahbgdc", false]], hid: [["", "ahbgdc"], ["b", "c"], ["aaaaaa", "bbaaaa"], ["ace", "abcde"]],
    code: `function isSubsequence(s, t) {
  let i = 0;
  for (let j = 0; j < t.length && i < s.length; j++) if (s[i] === t[j]) i++;
  return i === s.length;
}`
  },
  {
    id: "boats-to-save-people", t: "Boats to Save People", d: "M", tp: ["greedy", "two-pointers", "sorting"], pt: ["greedy", "two-pointers"], co: ["Amazon", "Google"], lc: "boats-to-save-people",
    s: "Each boat carries at most 2 people with total weight ≤ limit. Return the minimum number of boats.", h: ["Sort. The heaviest person always needs a boat.", "Pair the heaviest with the lightest if they fit."],
    a: "Two pointers: heaviest boards every time, lightest joins when possible.", tc: "O(n log n)", sc: "O(1)", sim: ["two-sum-ii", "assign-cookies"],
    fn: "numRescueBoats", params: "people:number[], limit:number", ret: "number",
    ex: [[[1, 2], 3, 1], [[3, 2, 2, 1], 3, 3], [[3, 5, 3, 4], 5, 4]], hid: [[[5], 5], [[2, 2, 2, 2], 4], [[1, 5, 3, 5], 7]],
    code: `function numRescueBoats(people, limit) {
  people.sort((a, b) => a - b);
  let l = 0, r = people.length - 1, boats = 0;
  while (l <= r) {
    if (people[l] + people[r] <= limit) l++;
    r--; boats++;
  }
  return boats;
}`
  },
  {
    id: "longest-mountain", t: "Longest Mountain in Array", d: "M", tp: ["arrays", "two-pointers", "dp"], pt: ["two-pointers"], co: ["Google", "Amazon"], lc: "longest-mountain-in-array",
    s: "A mountain strictly increases then strictly decreases (length ≥ 3). Return the length of the longest mountain subarray, or 0.", h: ["Every mountain has a peak with a smaller neighbour on both sides.", "From each peak expand left and right while strictly decreasing."],
    a: "Scan for peaks; expand outwards to measure; skip past each mountain.", tc: "O(n)", sc: "O(1)", sim: ["trapping-rain-water", "container-water"],
    fn: "longestMountain", params: "arr:number[]", ret: "number",
    ex: [[[2, 1, 4, 7, 3, 2, 5], 5], [[2, 2, 2], 0]], hid: [[[0, 1, 0]], [[0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0]], [[1, 2, 3]], [[875, 884, 239, 731, 723, 685]]],
    code: `function longestMountain(arr) {
  let best = 0;
  for (let i = 1; i < arr.length - 1; i++) {
    if (arr[i - 1] < arr[i] && arr[i] > arr[i + 1]) {
      let l = i, r = i;
      while (l > 0 && arr[l - 1] < arr[l]) l--;
      while (r < arr.length - 1 && arr[r + 1] < arr[r]) r++;
      best = Math.max(best, r - l + 1);
      i = r;
    }
  }
  return best;
}`
  },
  {
    id: "partition-labels", t: "Partition Labels", d: "M", tp: ["greedy", "two-pointers", "hashing", "strings"], pt: ["greedy", "intervals"], co: ["Amazon", "Meta", "Google"], lc: "partition-labels",
    s: "Split s into as many parts as possible so each letter appears in at most one part. Return the part sizes.", h: ["Record the last index of every letter.", "Extend the current part's end to the last index of each letter you see."],
    a: "Greedy: when i reaches the current end, close the part.", tc: "O(n)", sc: "O(1)", sim: ["merge-intervals", "non-overlapping-intervals"],
    fn: "partitionLabels", params: "s:string", ret: "number[]",
    ex: [["ababcbacadefegdehijhklij", [9, 7, 8]], ["eccbbbbdec", [10]]], hid: [["a"], ["abc"], ["caedbdedda"]],
    code: `function partitionLabels(s) {
  const last = {};
  for (let i = 0; i < s.length; i++) last[s[i]] = i;
  const res = [];
  let start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last[s[i]]);
    if (i === end) { res.push(end - start + 1); start = i + 1; }
  }
  return res;
}`
  },
  {
    id: "find-anagrams", t: "Find All Anagrams in a String", d: "M", tp: ["sliding-window", "hashing", "strings"], pt: ["sliding-window", "frequency-counter"], co: ["Amazon", "Meta", "Microsoft"], lc: "find-all-anagrams-in-a-string",
    s: "Return all start indexes of p's anagrams in s.", h: ["Every anagram has length |p|: a fixed window.", "Keep letter counts for the window and compare with p's counts."],
    a: "Fixed-size window with 26-count arrays; track how many letters match.", tc: "O(n)", sc: "O(1)", sim: ["permutation-in-string", "valid-anagram", "min-window-substring"],
    fn: "findAnagrams", params: "s:string, p:string", ret: "number[]",
    ex: [["cbaebabacd", "abc", [0, 6]], ["abab", "ab", [0, 1, 2]]], hid: [["a", "ab"], ["aaaaa", "aa"], ["baa", "aa"]],
    code: `function findAnagrams(s, p) {
  const res = [], need = new Array(26).fill(0), win = new Array(26).fill(0);
  const code = c => c.charCodeAt(0) - 97;
  for (const c of p) need[code(c)]++;
  for (let i = 0; i < s.length; i++) {
    win[code(s[i])]++;
    if (i >= p.length) win[code(s[i - p.length])]--;
    if (i >= p.length - 1 && win.every((v, k) => v === need[k])) res.push(i - p.length + 1);
  }
  return res;
}`
  },
  {
    id: "permutation-in-string", t: "Permutation in String", d: "M", tp: ["sliding-window", "hashing", "strings", "two-pointers"], pt: ["sliding-window", "frequency-counter"], co: ["Microsoft", "Amazon", "Meta"], lc: "permutation-in-string",
    s: "Return true if some permutation of s1 is a substring of s2.", h: ["Same as finding one anagram of s1 inside s2.", "Fixed window of size |s1| with letter counts."],
    a: "Slide a |s1|-sized window over s2 comparing 26 counts.", tc: "O(n)", sc: "O(1)", sim: ["find-anagrams", "min-window-substring"],
    fn: "checkInclusion", params: "s1:string, s2:string", ret: "boolean",
    ex: [["ab", "eidbaooo", true], ["ab", "eidboaoo", false]], hid: [["adc", "dcda"], ["hello", "ooolleoooleh"], ["a", "a"], ["abc", "ab"]],
    code: `function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  const need = new Array(26).fill(0), win = new Array(26).fill(0);
  const code = c => c.charCodeAt(0) - 97;
  for (const c of s1) need[code(c)]++;
  for (let i = 0; i < s2.length; i++) {
    win[code(s2[i])]++;
    if (i >= s1.length) win[code(s2[i - s1.length])]--;
    if (i >= s1.length - 1 && win.every((v, k) => v === need[k])) return true;
  }
  return false;
}`
  },
  {
    id: "max-consecutive-ones-iii", t: "Max Consecutive Ones III", d: "M", tp: ["sliding-window", "arrays", "prefix-sum"], pt: ["sliding-window"], co: ["Meta", "Amazon", "Google"], lc: "max-consecutive-ones-iii",
    s: "Given a binary array and k, return the longest run of 1s if you can flip at most k zeros.", h: ["Rephrase: longest window containing at most k zeros.", "Variable window; shrink when zeros exceed k."],
    a: "Expand right; when zero count > k, move left past a zero.", tc: "O(n)", sc: "O(1)", sim: ["longest-repeating-char-replacement", "longest-substring", "fruit-into-baskets"],
    fn: "longestOnes", params: "nums:number[], k:number", ret: "number",
    ex: [[[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2, 6], [[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3, 10]], hid: [[[0, 0, 0], 0], [[1, 1, 1], 0], [[0, 0, 0, 1], 4]],
    code: `function longestOnes(nums, k) {
  let l = 0, zeros = 0, best = 0;
  for (let r = 0; r < nums.length; r++) {
    if (nums[r] === 0) zeros++;
    while (zeros > k) if (nums[l++] === 0) zeros--;
    best = Math.max(best, r - l + 1);
  }
  return best;
}`
  },
  {
    id: "longest-repeating-char-replacement", t: "Longest Repeating Character Replacement", d: "M", tp: ["sliding-window", "hashing", "strings"], pt: ["sliding-window", "frequency-counter"], co: ["Google", "Amazon", "Uber"], lc: "longest-repeating-character-replacement",
    s: "You may change at most k characters. Return the longest substring that can be made of one repeated letter.", h: ["A window is valid if (length - count of its most common letter) ≤ k.", "Keep the historical max frequency; the window never needs to shrink below the best answer."],
    a: "Variable window with letter counts and maxFreq.", tc: "O(n)", sc: "O(1)", sim: ["max-consecutive-ones-iii", "longest-substring"],
    fn: "characterReplacement", params: "s:string, k:number", ret: "number",
    ex: [["ABAB", 2, 4], ["AABABBA", 1, 4]], hid: [["A", 0], ["ABBB", 2], ["AAAB", 0], ["ABCDE", 1]],
    code: `function characterReplacement(s, k) {
  const count = {};
  let l = 0, maxF = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    count[s[r]] = (count[s[r]] || 0) + 1;
    maxF = Math.max(maxF, count[s[r]]);
    while (r - l + 1 - maxF > k) count[s[l++]]--;
    best = Math.max(best, r - l + 1);
  }
  return best;
}`
  },
  {
    id: "fruit-into-baskets", t: "Fruit Into Baskets", d: "M", tp: ["sliding-window", "hashing", "arrays"], pt: ["sliding-window", "frequency-counter"], co: ["Google", "Amazon"], lc: "fruit-into-baskets",
    s: "Pick fruits from a contiguous stretch of trees with at most 2 fruit types. Return the maximum number of fruits.", h: ["Longest subarray with at most 2 distinct values.", "Map of counts; shrink while the map has more than 2 keys."],
    a: "Variable window with a count Map (delete keys at count 0).", tc: "O(n)", sc: "O(1)", sim: ["longest-substring-k-distinct", "max-consecutive-ones-iii"],
    fn: "totalFruit", params: "fruits:number[]", ret: "number",
    ex: [[[1, 2, 1], 3], [[0, 1, 2, 2], 3], [[1, 2, 3, 2, 2], 4]], hid: [[[3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]], [[1]], [[1, 0, 1, 4, 1, 4, 1, 2, 3]]],
    code: `function totalFruit(fruits) {
  const count = new Map();
  let l = 0, best = 0;
  for (let r = 0; r < fruits.length; r++) {
    count.set(fruits[r], (count.get(fruits[r]) || 0) + 1);
    while (count.size > 2) {
      const f = fruits[l++];
      count.set(f, count.get(f) - 1);
      if (count.get(f) === 0) count.delete(f);
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}`
  },
  {
    id: "longest-substring-k-distinct", t: "Longest Substring with At Most K Distinct Characters", d: "M", tp: ["sliding-window", "hashing", "strings"], pt: ["sliding-window", "frequency-counter"], co: ["Google", "Meta", "Amazon"], lc: "longest-substring-with-at-most-k-distinct-characters",
    s: "Return the length of the longest substring with at most k distinct characters.", h: ["Same shape as Fruit Into Baskets with k instead of 2.", "Shrink while the count map has more than k keys."],
    a: "Variable window + count Map.", tc: "O(n)", sc: "O(k)", sim: ["fruit-into-baskets", "longest-substring", "subarrays-k-distinct"],
    fn: "lengthOfLongestSubstringKDistinct", params: "s:string, k:number", ret: "number",
    ex: [["eceba", 2, 3], ["aa", 1, 2]], hid: [["a", 0], ["abaccc", 2], ["abcadcacacaca", 3]],
    code: `function lengthOfLongestSubstringKDistinct(s, k) {
  const count = new Map();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    count.set(s[r], (count.get(s[r]) || 0) + 1);
    while (count.size > k) {
      const c = s[l++];
      count.set(c, count.get(c) - 1);
      if (!count.get(c)) count.delete(c);
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}`
  },
  {
    id: "min-size-subarray-sum", t: "Minimum Size Subarray Sum", d: "M", tp: ["sliding-window", "prefix-sum", "binary-search"], pt: ["sliding-window", "prefix-sum"], co: ["Meta", "Amazon", "Goldman Sachs"], lc: "minimum-size-subarray-sum",
    s: "All numbers are positive. Return the minimal length of a subarray with sum ≥ target, or 0.", h: ["Positive numbers → growing the window only increases the sum.", "Expand right; while sum ≥ target, record and shrink left."],
    a: "Variable window minimising length.", tc: "O(n)", sc: "O(1)", sim: ["max-avg-subarray", "min-window-substring"],
    fn: "minSubArrayLen", params: "target:number, nums:number[]", ret: "number",
    ex: [[7, [2, 3, 1, 2, 4, 3], 2], [4, [1, 4, 4], 1], [11, [1, 1, 1, 1, 1, 1, 1, 1], 0]], hid: [[15, [1, 2, 3, 4, 5]], [3, [1, 1]], { label: "100,000 numbers (needs O(n))", gen: "() => [5000000, Array.from({ length: 100000 }, (_, i) => (i % 97) + 1)]" }],
    code: `function minSubArrayLen(target, nums) {
  let l = 0, sum = 0, best = Infinity;
  for (let r = 0; r < nums.length; r++) {
    sum += nums[r];
    while (sum >= target) { best = Math.min(best, r - l + 1); sum -= nums[l++]; }
  }
  return best === Infinity ? 0 : best;
}`
  },
  {
    id: "sliding-window-maximum", t: "Sliding Window Maximum", d: "H", tp: ["sliding-window", "queue", "heap"], pt: ["sliding-window", "monotonic-stack"], co: ["Amazon", "Google", "Microsoft", "Citadel"], lc: "sliding-window-maximum",
    s: "Return the maximum of every window of size k.", h: ["A heap gives O(n log n). Can you do O(n)?", "Monotonic deque of indexes with decreasing values; the front is the max."],
    a: "Pop smaller values from the back, drop the front when it leaves the window.", tc: "O(n)", sc: "O(k)", sim: ["daily-temperatures", "max-avg-subarray", "min-stack"],
    fn: "maxSlidingWindow", params: "nums:number[], k:number", ret: "number[]",
    ex: [[[1, 3, -1, -3, 5, 3, 6, 7], 3, [3, 3, 5, 5, 6, 7]], [[1], 1, [1]]], hid: [[[1, -1], 1], [[9, 10, 9, -7, -4, -8, 2, -6], 5], [[7, 2, 4], 2], { label: "100,000 numbers, k = 50,000 (needs O(n))", gen: "() => [Array.from({ length: 100000 }, (_, i) => (i * 7919) % 100003), 50000]" }],
    code: `function maxSlidingWindow(nums, k) {
  const dq = [], out = [];
  let head = 0;
  for (let i = 0; i < nums.length; i++) {
    if (head < dq.length && dq[head] <= i - k) head++;
    while (dq.length > head && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (i >= k - 1) out.push(nums[dq[head]]);
  }
  return out;
}`
  },
  {
    id: "subarrays-k-distinct", t: "Subarrays with K Different Integers", d: "H", tp: ["sliding-window", "hashing"], pt: ["sliding-window", "frequency-counter"], co: ["Amazon", "Google"], lc: "subarrays-with-k-different-integers",
    s: "Count subarrays with exactly k distinct integers.", h: ["Exactly k = atMost(k) - atMost(k - 1).", "atMost(k) with a window: every valid window ending at r adds (r - l + 1)."],
    a: "Two passes of the at-most-k window.", tc: "O(n)", sc: "O(n)", sim: ["longest-substring-k-distinct", "count-nice-subarrays"],
    fn: "subarraysWithKDistinct", params: "nums:number[], k:number", ret: "number",
    ex: [[[1, 2, 1, 2, 3], 2, 7], [[1, 2, 1, 3, 4], 3, 3]], hid: [[[1], 1], [[1, 1, 1], 1], [[2, 1, 1, 1, 2], 1]],
    code: `function subarraysWithKDistinct(nums, k) {
  const atMost = K => {
    const count = new Map(); let l = 0, res = 0;
    for (let r = 0; r < nums.length; r++) {
      count.set(nums[r], (count.get(nums[r]) || 0) + 1);
      while (count.size > K) {
        const x = nums[l++]; count.set(x, count.get(x) - 1);
        if (!count.get(x)) count.delete(x);
      }
      res += r - l + 1;
    }
    return res;
  };
  return atMost(k) - atMost(k - 1);
}`
  },
  {
    id: "count-nice-subarrays", t: "Count Number of Nice Subarrays", d: "M", tp: ["sliding-window", "prefix-sum", "hashing"], pt: ["prefix-sum", "sliding-window"], co: ["Amazon", "Roblox"], lc: "count-number-of-nice-subarrays",
    s: "Count subarrays that contain exactly k odd numbers.", h: ["Replace each number with 1 if odd, 0 if even.", "Now it's 'subarray sum equals k': prefix counts in a Map."],
    a: "Prefix count of odds + Map of how often each prefix occurred.", tc: "O(n)", sc: "O(n)", sim: ["subarray-sum-k", "subarrays-k-distinct"],
    fn: "numberOfSubarrays", params: "nums:number[], k:number", ret: "number",
    ex: [[[1, 1, 2, 1, 1], 3, 2], [[2, 4, 6], 1, 0], [[2, 2, 2, 1, 2, 2, 1, 2, 2, 2], 2, 16]], hid: [[[1], 1], [[1, 1, 1, 1], 1]],
    code: `function numberOfSubarrays(nums, k) {
  const count = new Map([[0, 1]]);
  let odd = 0, res = 0;
  for (const x of nums) {
    odd += x % 2;
    res += count.get(odd - k) || 0;
    count.set(odd, (count.get(odd) || 0) + 1);
  }
  return res;
}`
  },
  {
    id: "max-points-cards", t: "Maximum Points You Can Obtain from Cards", d: "M", tp: ["sliding-window", "prefix-sum", "arrays"], pt: ["sliding-window", "prefix-sum"], co: ["Google", "Amazon"], lc: "maximum-points-you-can-obtain-from-cards",
    s: "Take exactly k cards, each from the beginning or the end of the row. Maximise the total.", h: ["The cards you leave form one contiguous window of size n - k.", "Minimise that window's sum."],
    a: "Total minus the minimum-sum window of length n - k.", tc: "O(n)", sc: "O(1)", sim: ["max-avg-subarray", "min-size-subarray-sum"],
    fn: "maxScore", params: "cardPoints:number[], k:number", ret: "number",
    ex: [[[1, 2, 3, 4, 5, 6, 1], 3, 12], [[2, 2, 2], 2, 4], [[9, 7, 7, 9, 7, 7, 9], 7, 55]], hid: [[[1, 1000, 1], 1], [[1, 79, 80, 1, 1, 1, 200, 1], 3], [[100, 40, 17, 9, 73, 75], 3]],
    code: `function maxScore(cardPoints, k) {
  const n = cardPoints.length, w = n - k;
  const total = cardPoints.reduce((a, b) => a + b, 0);
  let sum = 0;
  for (let i = 0; i < w; i++) sum += cardPoints[i];
  let minSum = sum;
  for (let i = w; i < n; i++) { sum += cardPoints[i] - cardPoints[i - w]; minSum = Math.min(minSum, sum); }
  return total - minSum;
}`
  },
  {
    id: "longest-subarray-limit", t: "Longest Continuous Subarray With Absolute Diff ≤ Limit", d: "M", tp: ["sliding-window", "queue", "heap"], pt: ["sliding-window", "monotonic-stack"], co: ["Google", "Uber", "Amazon"], lc: "longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit",
    s: "Return the longest subarray where max - min ≤ limit.", h: ["Variable window; you need the window's max and min quickly.", "Keep two monotonic deques: one decreasing (max), one increasing (min)."],
    a: "Sliding window + max-deque + min-deque.", tc: "O(n)", sc: "O(n)", sim: ["sliding-window-maximum", "max-consecutive-ones-iii"],
    fn: "longestSubarray", params: "nums:number[], limit:number", ret: "number",
    ex: [[[8, 2, 4, 7], 4, 2], [[10, 1, 2, 4, 7, 2], 5, 4], [[4, 2, 2, 2, 4, 4, 2, 2], 0, 3]], hid: [[[1], 0], [[1, 5, 6, 7, 8, 10, 6, 5, 6], 4]],
    code: `function longestSubarray(nums, limit) {
  const mx = [], mn = [];
  let l = 0, best = 0;
  for (let r = 0; r < nums.length; r++) {
    while (mx.length && mx[mx.length - 1] < nums[r]) mx.pop();
    while (mn.length && mn[mn.length - 1] > nums[r]) mn.pop();
    mx.push(nums[r]); mn.push(nums[r]);
    while (mx[0] - mn[0] > limit) {
      if (mx[0] === nums[l]) mx.shift();
      if (mn[0] === nums[l]) mn.shift();
      l++;
    }
    best = Math.max(best, r - l + 1);
  }
  return best;
}`
  },
  {
    id: "equal-substrings-budget", t: "Get Equal Substrings Within Budget", d: "M", tp: ["sliding-window", "strings", "prefix-sum"], pt: ["sliding-window"], co: ["Amazon", "Google"], lc: "get-equal-substrings-within-budget",
    s: "Changing s[i] to t[i] costs |s[i] - t[i]| (char codes). With maxCost, return the longest substring of s you can turn into the matching substring of t.", h: ["Turn it into an array of costs.", "Longest window with sum ≤ maxCost."],
    a: "Variable window over the cost array.", tc: "O(n)", sc: "O(1)", sim: ["min-size-subarray-sum", "max-consecutive-ones-iii"],
    fn: "equalSubstring", params: "s:string, t:string, maxCost:number", ret: "number",
    ex: [["abcd", "bcdf", 3, 3], ["abcd", "cdef", 3, 1], ["abcd", "acde", 0, 1]], hid: [["krrgw", "zjxss", 19], ["a", "b", 0]],
    code: `function equalSubstring(s, t, maxCost) {
  let l = 0, cost = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    cost += Math.abs(s.charCodeAt(r) - t.charCodeAt(r));
    while (cost > maxCost) { cost -= Math.abs(s.charCodeAt(l) - t.charCodeAt(l)); l++; }
    best = Math.max(best, r - l + 1);
  }
  return best;
}`
  },
  {
    id: "remove-duplicates-sorted-ii", t: "Remove Duplicates from Sorted Array II", d: "M", tp: ["two-pointers", "arrays"], pt: ["two-pointers"], co: ["Meta", "Microsoft", "Bloomberg"], lc: "remove-duplicates-from-sorted-array-ii",
    s: "In a sorted array keep each value at most twice (in place). Return the kept prefix as an array.", h: ["A write pointer marks where the next kept value goes.", "Keep nums[i] if write < 2 or nums[i] !== nums[write - 2]."],
    a: "Read/write pointers comparing with the element two slots back.", tc: "O(n)", sc: "O(1)", note: "Return the first k elements after deduplicating in place, e.g. nums.slice(0, k).", sim: ["move-zeroes", "sort-colors"],
    fn: "removeDuplicates", params: "nums:number[]", ret: "number[]",
    ex: [[[1, 1, 1, 2, 2, 3], [1, 1, 2, 2, 3]], [[0, 0, 1, 1, 1, 1, 2, 3, 3], [0, 0, 1, 1, 2, 3, 3]]], hid: [[[1]], [[1, 1, 1, 1]], [[1, 2, 3]]],
    code: `function removeDuplicates(nums) {
  let w = 0;
  for (const x of nums) if (w < 2 || x !== nums[w - 2]) nums[w++] = x;
  return nums.slice(0, w);
}`
  }
];
