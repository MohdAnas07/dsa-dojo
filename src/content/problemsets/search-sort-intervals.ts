import type { ProblemDef } from "@/lib/types";

/** Binary search, sorting, divide & conquer, intervals. */
export const SEARCH_SORT_INTERVALS: ProblemDef[] = [
  {
    id: "find-min-rotated", t: "Find Minimum in Rotated Sorted Array", d: "M", tp: ["binary-search", "arrays"], pt: ["binary-search"], co: ["Amazon", "Microsoft", "Meta", "Bloomberg"], lc: "find-minimum-in-rotated-sorted-array",
    s: "A sorted array of unique values was rotated. Find its minimum in O(log n).", h: ["Compare nums[mid] with nums[hi].", "If nums[mid] > nums[hi], the minimum is to the right of mid."],
    a: "Binary search: lo = mid + 1 when mid is in the left (larger) part, else hi = mid.", tc: "O(log n)", sc: "O(1)", sim: ["search-rotated", "search-rotated-ii", "peak-element"],
    fn: "findMin", params: "nums:number[]", ret: "number",
    ex: [[[3, 4, 5, 1, 2], 1], [[4, 5, 6, 7, 0, 1, 2], 0], [[11, 13, 15, 17], 11]], hid: [[[1]], [[2, 1]], [[5, 1, 2, 3, 4]]],
    code: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1; else hi = mid;
  }
  return nums[lo];
}`
  },
  {
    id: "search-rotated-ii", t: "Search in Rotated Sorted Array II", d: "M", tp: ["binary-search", "arrays"], pt: ["binary-search"], co: ["Amazon", "Meta", "LinkedIn"], lc: "search-in-rotated-sorted-array-ii",
    s: "Like Search in Rotated Sorted Array, but values may repeat. Return whether target exists.", h: ["Duplicates can hide which half is sorted.", "When nums[lo] == nums[mid] == nums[hi], shrink both ends by one."],
    a: "Standard rotated search, trimming equal ends when undecidable.", tc: "O(log n) average, O(n) worst", sc: "O(1)", sim: ["search-rotated", "find-min-rotated"],
    fn: "search", params: "nums:number[], target:number", ret: "boolean",
    ex: [[[2, 5, 6, 0, 0, 1, 2], 0, true], [[2, 5, 6, 0, 0, 1, 2], 3, false]], hid: [[[1, 0, 1, 1, 1], 0], [[1], 0], [[1, 1, 1, 1, 1, 1, 1, 1, 1, 13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 13]],
    code: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return true;
    if (nums[lo] === nums[mid] && nums[mid] === nums[hi]) { lo++; hi--; continue; }
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
    }
  }
  return false;
}`
  },
  {
    id: "search-2d-matrix", t: "Search a 2D Matrix", d: "M", tp: ["binary-search", "arrays"], pt: ["binary-search"], co: ["Amazon", "Microsoft", "Bloomberg"], lc: "search-a-2d-matrix",
    s: "Rows are sorted and each row's first value is bigger than the previous row's last. Find target in O(log(mn)).", h: ["The matrix is one sorted array written row by row.", "Index k maps to matrix[Math.floor(k / n)][k % n]."],
    a: "Binary search over 0..mn-1 with index mapping.", tc: "O(log mn)", sc: "O(1)", sim: ["search-2d-matrix-ii", "binary-search"],
    fn: "searchMatrix", params: "matrix:number[][], target:number", ret: "boolean",
    ex: [[[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3, true], [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13, false]], hid: [[[[1]], 1], [[[1, 3]], 3], [[[1], [3]], 2]],
    code: `function searchMatrix(matrix, target) {
  const m = matrix.length, n = matrix[0].length;
  let lo = 0, hi = m * n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1, v = matrix[Math.floor(mid / n)][mid % n];
    if (v === target) return true;
    if (v < target) lo = mid + 1; else hi = mid - 1;
  }
  return false;
}`
  },
  {
    id: "search-2d-matrix-ii", t: "Search a 2D Matrix II", d: "M", tp: ["binary-search", "arrays", "two-pointers", "divide-conquer"], pt: ["two-pointers", "binary-search"], co: ["Amazon", "Microsoft", "Apple", "Google"], lc: "search-a-2d-matrix-ii",
    s: "Each row and each column is sorted ascending. Return whether target exists.", h: ["Start at the top-right corner.", "Too big → move left; too small → move down."],
    a: "Staircase search from the top-right corner.", tc: "O(m + n)", sc: "O(1)", sim: ["search-2d-matrix", "kth-smallest-sorted-matrix"],
    fn: "searchMatrix", params: "matrix:number[][], target:number", ret: "boolean",
    ex: [[[[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 5, true], [[[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 20, false]], hid: [[[[-5]], -5], [[[1, 1]], 2], [[[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]], 10]],
    code: `function searchMatrix(matrix, target) {
  let r = 0, c = matrix[0].length - 1;
  while (r < matrix.length && c >= 0) {
    const v = matrix[r][c];
    if (v === target) return true;
    if (v > target) c--; else r++;
  }
  return false;
}`
  },
  {
    id: "first-last-position", t: "Find First and Last Position of Element", d: "M", tp: ["binary-search", "arrays"], pt: ["binary-search"], co: ["Meta", "Amazon", "LinkedIn", "Uber"], lc: "find-first-and-last-position-of-element-in-sorted-array",
    s: "Return [first, last] index of target in a sorted array, or [-1, -1], in O(log n).", h: ["Two binary searches.", "lowerBound(target) and lowerBound(target + 1) - 1."],
    a: "Lower bound twice.", tc: "O(log n)", sc: "O(1)", sim: ["search-insert", "binary-search", "find-k-closest"],
    fn: "searchRange", params: "nums:number[], target:number", ret: "number[]",
    ex: [[[5, 7, 7, 8, 8, 10], 8, [3, 4]], [[5, 7, 7, 8, 8, 10], 6, [-1, -1]], [[], 0, [-1, -1]]], hid: [[[1], 1], [[2, 2], 2], [[1, 2, 3, 3, 3, 3, 4], 3]],
    code: `function searchRange(nums, target) {
  const lower = x => { let lo = 0, hi = nums.length; while (lo < hi) { const m = (lo + hi) >> 1; if (nums[m] < x) lo = m + 1; else hi = m; } return lo; };
  const a = lower(target);
  if (a === nums.length || nums[a] !== target) return [-1, -1];
  return [a, lower(target + 1) - 1];
}`
  },
  {
    id: "peak-element", t: "Find Peak Element", d: "M", tp: ["binary-search", "arrays"], pt: ["binary-search"], co: ["Meta", "Google", "Amazon", "Uber"], lc: "find-peak-element",
    s: "Return the index of any peak (strictly greater than both neighbours; out of range counts as -∞) in O(log n).", h: ["If nums[mid] < nums[mid + 1], a peak exists to the right.", "Otherwise a peak exists at mid or to its left."],
    a: "Binary search moving towards the rising side.", tc: "O(log n)", sc: "O(1)", sim: ["find-min-rotated", "longest-mountain"],
    fn: "findPeakElement", params: "nums:number[]", ret: "number",
    check: `(args, out) => { const a = args[0]; if (!Number.isInteger(out) || out < 0 || out >= a.length) return false; const l = out === 0 ? -Infinity : a[out - 1], r = out === a.length - 1 ? -Infinity : a[out + 1]; return a[out] > l && a[out] > r; }`,
    ex: [[[1, 2, 3, 1], 2], [[1, 2, 1, 3, 5, 6, 4], 5]], hid: [[[1]], [[2, 1]], [[1, 2]], [[3, 4, 3, 2, 1]]],
    code: `function findPeakElement(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < nums[mid + 1]) lo = mid + 1; else hi = mid;
  }
  return lo;
}`
  },
  {
    id: "sqrtx", t: "Sqrt(x)", d: "E", tp: ["binary-search", "math-basics"], pt: ["binary-search"], co: ["Amazon", "Microsoft", "Apple"], lc: "sqrtx",
    s: "Return ⌊√x⌋ without using Math.sqrt or **.", h: ["The answer is in [0, x].", "Find the largest m with m·m ≤ x."],
    a: "Binary search on the answer.", tc: "O(log x)", sc: "O(1)", sim: ["valid-perfect-square", "koko-bananas"],
    fn: "mySqrt", params: "x:number", ret: "number",
    ex: [[4, 2], [8, 2], [0, 0]], hid: [[1], [2147395599], [15], [16]],
    code: `function mySqrt(x) {
  let lo = 0, hi = x;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (mid * mid <= x) lo = mid; else hi = mid - 1;
  }
  return lo;
}`
  },
  {
    id: "valid-perfect-square", t: "Valid Perfect Square", d: "E", tp: ["binary-search", "math-basics"], pt: ["binary-search"], co: ["LinkedIn", "Amazon"], lc: "valid-perfect-square",
    s: "Return true if num is a perfect square, without built-in sqrt.", h: ["Binary search for m with m·m == num.", "Search space is [1, num]."],
    a: "Binary search on m.", tc: "O(log n)", sc: "O(1)", sim: ["sqrtx"],
    fn: "isPerfectSquare", params: "num:number", ret: "boolean",
    ex: [[16, true], [14, false]], hid: [[1], [2], [808201], [2147483647]],
    code: `function isPerfectSquare(num) {
  let lo = 1, hi = num;
  while (lo <= hi) {
    const m = Math.floor((lo + hi) / 2), sq = m * m;
    if (sq === num) return true;
    if (sq < num) lo = m + 1; else hi = m - 1;
  }
  return false;
}`
  },
  {
    id: "capacity-ship-packages", t: "Capacity To Ship Packages Within D Days", d: "M", tp: ["binary-search", "greedy", "arrays"], pt: ["binary-search", "greedy"], co: ["Amazon", "Google", "Meta"], lc: "capacity-to-ship-packages-within-d-days",
    s: "Ship packages in the given order within days days. Return the minimum ship capacity.", h: ["If capacity C works, any bigger capacity works too.", "Binary search C in [max weight, total weight]; check greedily."],
    a: "Binary search on the answer with a greedy day counter.", tc: "O(n log sum)", sc: "O(1)", sim: ["koko-bananas", "split-array-largest-sum"],
    fn: "shipWithinDays", params: "weights:number[], days:number", ret: "number",
    ex: [[[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5, 15], [[3, 2, 2, 4, 1, 4], 3, 6], [[1, 2, 3, 1, 1], 4, 3]], hid: [[[10], 1], [[1, 1, 1, 1], 4], [[5, 5, 5, 5], 2]],
    code: `function shipWithinDays(weights, days) {
  let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);
  const ok = cap => { let d = 1, cur = 0; for (const w of weights) { if (cur + w > cap) { d++; cur = 0; } cur += w; } return d <= days; };
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (ok(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}`
  },
  {
    id: "split-array-largest-sum", t: "Split Array Largest Sum", d: "H", tp: ["binary-search", "greedy", "dp"], pt: ["binary-search", "greedy"], co: ["Google", "Amazon", "Meta", "Baidu"], lc: "split-array-largest-sum",
    s: "Split nums into k non-empty contiguous parts minimising the largest part sum. Return that minimum.", h: ["Guess the largest sum S: can you split into ≤ k parts?", "That check is greedy, and it's monotonic in S."],
    a: "Binary search on S in [max, sum] with a greedy split counter.", tc: "O(n log sum)", sc: "O(1)", sim: ["capacity-ship-packages", "koko-bananas"],
    fn: "splitArray", params: "nums:number[], k:number", ret: "number",
    ex: [[[7, 2, 5, 10, 8], 2, 18], [[1, 2, 3, 4, 5], 2, 9], [[1, 4, 4], 3, 4]], hid: [[[10], 1], [[2, 3, 1, 2, 4, 3], 5], [[1, 1, 1, 1, 1, 1, 1, 1], 3]],
    code: `function splitArray(nums, k) {
  let lo = Math.max(...nums), hi = nums.reduce((a, b) => a + b, 0);
  const parts = S => { let p = 1, cur = 0; for (const x of nums) { if (cur + x > S) { p++; cur = 0; } cur += x; } return p; };
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (parts(mid) <= k) hi = mid; else lo = mid + 1;
  }
  return lo;
}`
  },
  {
    id: "median-two-sorted", t: "Median of Two Sorted Arrays", d: "H", tp: ["binary-search", "arrays", "divide-conquer"], pt: ["binary-search"], co: ["Google", "Amazon", "Microsoft", "Apple", "Goldman Sachs"], lc: "median-of-two-sorted-arrays",
    s: "Return the median of two sorted arrays in O(log(m + n)).", h: ["Partition both arrays so the left halves together hold half the elements.", "Binary search the cut in the smaller array until maxLeft ≤ minRight on both sides."],
    a: "Binary search on the partition of the shorter array.", tc: "O(log min(m, n))", sc: "O(1)", sim: ["find-median-stream", "kth-smallest-sorted-matrix"],
    fn: "findMedianSortedArrays", params: "nums1:number[], nums2:number[]", ret: "double", cmp: "float",
    ex: [[[1, 3], [2], 2], [[1, 2], [3, 4], 2.5]], hid: [[[], [1]], [[2], []], [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11]], [[0, 0], [0, 0]]],
    code: `function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1];
  const m = nums1.length, n = nums2.length, half = (m + n + 1) >> 1;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1, j = half - i;
    const aL = i ? nums1[i - 1] : -Infinity, aR = i < m ? nums1[i] : Infinity;
    const bL = j ? nums2[j - 1] : -Infinity, bR = j < n ? nums2[j] : Infinity;
    if (aL <= bR && bL <= aR) {
      return (m + n) % 2 ? Math.max(aL, bL) : (Math.max(aL, bL) + Math.min(aR, bR)) / 2;
    }
    if (aL > bR) hi = i - 1; else lo = i + 1;
  }
  return 0;
}`
  },
  {
    id: "time-based-kv-store", t: "Time Based Key-Value Store", d: "M", tp: ["binary-search", "hashing"], pt: ["binary-search", "hashing"], co: ["Google", "Amazon", "Netflix", "Uber"], lc: "time-based-key-value-store",
    s: "Design TimeMap: set(key, value, timestamp) and get(key, timestamp) returning the value with the largest timestamp ≤ the given one (\"\" if none). Timestamps for set are increasing.", h: ["Store a list of [timestamp, value] per key.", "The list is sorted, so binary search it on get."],
    a: "Map key → array of pairs; upper-bound binary search.", tc: "O(1) set, O(log n) get", sc: "O(n)", sim: ["snapshot-array", "first-last-position"],
    fn: "TimeMap", ctor: "", methods: "set(key:string, value:string, timestamp:number):void; get(key:string, timestamp:number):string",
    ex: [[["TimeMap", "set", "get", "get", "set", "get", "get"], [[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]], [null, null, "bar", "bar", null, "bar2", "bar2"]]],
    hid: [[["TimeMap", "get", "set", "get", "get"], [[], ["a", 1], ["a", "x", 5], ["a", 4], ["a", 10]]], [["TimeMap", "set", "set", "set", "get", "get", "get"], [[], ["k", "v1", 10], ["k", "v2", 20], ["k", "v3", 30], ["k", 15], ["k", 30], ["k", 5]]]],
    code: `class TimeMap {
  constructor() { this.map = new Map(); }
  set(key, value, timestamp) {
    if (!this.map.has(key)) this.map.set(key, []);
    this.map.get(key).push([timestamp, value]);
  }
  get(key, timestamp) {
    const arr = this.map.get(key) || [];
    let lo = 0, hi = arr.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (arr[m][0] <= timestamp) lo = m + 1; else hi = m; }
    return lo ? arr[lo - 1][1] : "";
  }
}`
  },
  {
    id: "kth-smallest-sorted-matrix", t: "Kth Smallest Element in a Sorted Matrix", d: "M", tp: ["binary-search", "heap", "sorting"], pt: ["binary-search", "top-k"], co: ["Google", "Amazon", "Meta"], lc: "kth-smallest-element-in-a-sorted-matrix",
    s: "Rows and columns are sorted. Return the k-th smallest element.", h: ["Binary search on the value, not the index.", "Count elements ≤ mid with the staircase walk in O(n)."],
    a: "Value binary search + staircase count.", tc: "O(n log(max - min))", sc: "O(1)", sim: ["search-2d-matrix-ii", "kth-largest", "find-k-pairs-smallest-sums"],
    fn: "kthSmallest", params: "matrix:number[][], k:number", ret: "number",
    ex: [[[[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8, 13], [[[-5]], 1, -5]], hid: [[[[1, 2], [1, 3]], 2], [[[1, 3, 5], [6, 7, 12], [11, 14, 14]], 6]],
    code: `function kthSmallest(matrix, k) {
  const n = matrix.length;
  let lo = matrix[0][0], hi = matrix[n - 1][n - 1];
  const countLE = x => { let c = 0, r = n - 1, col = 0; while (r >= 0 && col < n) { if (matrix[r][col] <= x) { c += r + 1; col++; } else r--; } return c; };
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (countLE(mid) >= k) hi = mid; else lo = mid + 1;
  }
  return lo;
}`
  },
  {
    id: "find-k-closest", t: "Find K Closest Elements", d: "M", tp: ["binary-search", "two-pointers", "sliding-window", "heap"], pt: ["binary-search", "two-pointers"], co: ["Meta", "Amazon", "LinkedIn"], lc: "find-k-closest-elements",
    s: "arr is sorted. Return the k closest values to x, sorted ascending (ties prefer smaller values).", h: ["The answer is a contiguous window of length k.", "Binary search the window's left edge: compare x - arr[m] with arr[m + k] - x."],
    a: "Binary search over window starts in [0, n - k].", tc: "O(log(n - k) + k)", sc: "O(1)", sim: ["first-last-position", "k-closest-points"],
    fn: "findClosestElements", params: "arr:number[], k:number, x:number", ret: "number[]",
    ex: [[[1, 2, 3, 4, 5], 4, 3, [1, 2, 3, 4]], [[1, 2, 3, 4, 5], 4, -1, [1, 2, 3, 4]], [[1, 1, 2, 3, 4, 5], 4, -1, [1, 1, 2, 3]]], hid: [[[1, 3], 1, 2], [[0, 0, 1, 2, 3, 3, 4, 7, 7, 8], 3, 5], [[1, 10, 15, 25, 35, 45, 50, 59], 1, 30]],
    code: `function findClosestElements(arr, k, x) {
  let lo = 0, hi = arr.length - k;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (x - arr[m] > arr[m + k] - x) lo = m + 1; else hi = m;
  }
  return arr.slice(lo, lo + k);
}`
  },
  {
    id: "single-element-sorted", t: "Single Element in a Sorted Array", d: "M", tp: ["binary-search", "bit-manipulation"], pt: ["binary-search"], co: ["Google", "Amazon", "Microsoft"], lc: "single-element-in-a-sorted-array",
    s: "Every element appears twice except one. The array is sorted. Find the single one in O(log n).", h: ["Before the single element, pairs start at even indexes.", "Check pairs at even mid: if nums[mid] == nums[mid + 1] the single element is to the right."],
    a: "Binary search on even indexes.", tc: "O(log n)", sc: "O(1)", sim: ["single-number", "binary-search"],
    fn: "singleNonDuplicate", params: "nums:number[]", ret: "number",
    ex: [[[1, 1, 2, 3, 3, 4, 4, 8, 8], 2], [[3, 3, 7, 7, 10, 11, 11], 10]], hid: [[[1]], [[1, 1, 2]], [[0, 1, 1]]],
    code: `function singleNonDuplicate(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    let mid = (lo + hi) >> 1;
    if (mid % 2) mid--;
    if (nums[mid] === nums[mid + 1]) lo = mid + 2; else hi = mid;
  }
  return nums[lo];
}`
  },
  {
    id: "min-days-bouquets", t: "Minimum Number of Days to Make m Bouquets", d: "M", tp: ["binary-search", "arrays"], pt: ["binary-search"], co: ["Google", "Amazon"], lc: "minimum-number-of-days-to-make-m-bouquets",
    s: "Flower i blooms on bloomDay[i]. A bouquet needs k adjacent bloomed flowers. Return the minimum day to make m bouquets, or -1.", h: ["If day D works, every later day works too.", "Check a day by counting runs of bloomed flowers."],
    a: "Binary search on the day in [min, max].", tc: "O(n log max)", sc: "O(1)", sim: ["koko-bananas", "capacity-ship-packages"],
    fn: "minDays", params: "bloomDay:number[], m:number, k:number", ret: "number",
    ex: [[[1, 10, 3, 10, 2], 3, 1, 3], [[1, 10, 3, 10, 2], 3, 2, -1], [[7, 7, 7, 7, 12, 7, 7], 2, 3, 12]], hid: [[[1000000000, 1000000000], 1, 1], [[1, 10, 2, 9, 3, 8, 4, 7, 5, 6], 4, 2]],
    code: `function minDays(bloomDay, m, k) {
  if (m * k > bloomDay.length) return -1;
  const ok = d => { let b = 0, run = 0; for (const x of bloomDay) { run = x <= d ? run + 1 : 0; if (run === k) { b++; run = 0; } } return b >= m; };
  let lo = Math.min(...bloomDay), hi = Math.max(...bloomDay);
  while (lo < hi) { const mid = Math.floor((lo + hi) / 2); if (ok(mid)) hi = mid; else lo = mid + 1; }
  return lo;
}`
  },
  {
    id: "insert-interval", t: "Insert Interval", d: "M", tp: ["intervals", "arrays"], pt: ["merge-intervals", "intervals"], co: ["Google", "Meta", "LinkedIn", "Amazon"], lc: "insert-interval",
    s: "Insert newInterval into a sorted list of non-overlapping intervals, merging where needed.", h: ["Three phases: intervals fully before, overlapping, fully after.", "Overlapping ones grow the new interval's [min start, max end]."],
    a: "Linear scan in three phases.", tc: "O(n)", sc: "O(n)", sim: ["merge-intervals", "non-overlapping-intervals"],
    fn: "insert", params: "intervals:number[][], newInterval:number[]", ret: "number[][]",
    ex: [[[[1, 3], [6, 9]], [2, 5], [[1, 5], [6, 9]]], [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8], [[1, 2], [3, 10], [12, 16]]]], hid: [[[], [5, 7]], [[[1, 5]], [2, 3]], [[[1, 5]], [6, 8]], [[[3, 5]], [1, 2]]],
    code: `function insert(intervals, newInterval) {
  const res = [];
  let [s, e] = newInterval, i = 0;
  while (i < intervals.length && intervals[i][1] < s) res.push(intervals[i++]);
  while (i < intervals.length && intervals[i][0] <= e) { s = Math.min(s, intervals[i][0]); e = Math.max(e, intervals[i][1]); i++; }
  res.push([s, e]);
  while (i < intervals.length) res.push(intervals[i++]);
  return res;
}`
  },
  {
    id: "non-overlapping-intervals", t: "Non-overlapping Intervals", d: "M", tp: ["intervals", "greedy", "sorting"], pt: ["intervals", "greedy"], co: ["Meta", "Amazon", "Google"], lc: "non-overlapping-intervals",
    s: "Return the minimum number of intervals to remove so the rest don't overlap (touching ends are fine).", h: ["Classic activity selection.", "Sort by end; keep an interval if it starts after the last kept end."],
    a: "Greedy by earliest end; count the ones you skip.", tc: "O(n log n)", sc: "O(1)", sim: ["min-arrows-balloons", "meeting-rooms", "merge-intervals"],
    fn: "eraseOverlapIntervals", params: "intervals:number[][]", ret: "number",
    ex: [[[[1, 2], [2, 3], [3, 4], [1, 3]], 1], [[[1, 2], [1, 2], [1, 2]], 2], [[[1, 2], [2, 3]], 0]], hid: [[[[1, 100], [11, 22], [1, 11], [2, 12]]], [[[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]]]],
    code: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let end = -Infinity, removed = 0;
  for (const [s, e] of intervals) {
    if (s >= end) end = e; else removed++;
  }
  return removed;
}`
  },
  {
    id: "meeting-rooms", t: "Meeting Rooms", d: "E", tp: ["intervals", "sorting"], pt: ["intervals"], co: ["Meta", "Amazon", "Bloomberg"], lc: "meeting-rooms",
    s: "Can one person attend all meetings (no overlaps)?", h: ["Sort by start time.", "Any meeting starting before the previous one ends is a conflict."],
    a: "Sort and compare neighbours.", tc: "O(n log n)", sc: "O(1)", sim: ["meeting-rooms-ii", "merge-intervals"],
    fn: "canAttendMeetings", params: "intervals:number[][]", ret: "boolean",
    ex: [[[[0, 30], [5, 10], [15, 20]], false], [[[7, 10], [2, 4]], true]], hid: [[[]], [[[1, 5], [5, 10]]], [[[13, 15], [1, 13], [6, 9]]]],
    code: `function canAttendMeetings(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) if (intervals[i][0] < intervals[i - 1][1]) return false;
  return true;
}`
  },
  {
    id: "meeting-rooms-ii", t: "Meeting Rooms II", d: "M", tp: ["intervals", "heap", "sorting", "greedy"], pt: ["intervals", "top-k"], co: ["Google", "Meta", "Amazon", "Uber", "Microsoft"], lc: "meeting-rooms-ii",
    s: "Return the minimum number of conference rooms needed.", h: ["Sort starts and ends separately.", "Sweep: a start before the earliest free end needs a new room."],
    a: "Two sorted arrays and a sweep (or a min-heap of end times).", tc: "O(n log n)", sc: "O(n)", sim: ["meeting-rooms", "car-pooling", "min-arrows-balloons"],
    fn: "minMeetingRooms", params: "intervals:number[][]", ret: "number",
    ex: [[[[0, 30], [5, 10], [15, 20]], 2], [[[7, 10], [2, 4]], 1]], hid: [[[[1, 5], [5, 10]]], [[[1, 10], [2, 7], [3, 19], [8, 12], [10, 20], [11, 30]]], [[[9, 10], [4, 9], [4, 17]]]],
    code: `function minMeetingRooms(intervals) {
  const starts = intervals.map(x => x[0]).sort((a, b) => a - b);
  const ends = intervals.map(x => x[1]).sort((a, b) => a - b);
  let rooms = 0, e = 0;
  for (const s of starts) {
    if (s < ends[e]) rooms++; else e++;
  }
  return rooms;
}`
  },
  {
    id: "car-pooling", t: "Car Pooling", d: "M", tp: ["intervals", "prefix-sum", "sorting", "heap"], pt: ["prefix-sum", "intervals"], co: ["Lyft", "Amazon", "Google"], lc: "car-pooling",
    s: "trips[i] = [passengers, from, to]. The car drives east with the given capacity. Can it complete every trip?", h: ["Passengers change only at pickup and drop-off points.", "Difference array: +p at from, -p at to; prefix sums give the load."],
    a: "Difference array over locations (or sort events).", tc: "O(n + L)", sc: "O(L)", sim: ["meeting-rooms-ii", "range-sum-query"],
    fn: "carPooling", params: "trips:number[][], capacity:number", ret: "boolean",
    ex: [[[[2, 1, 5], [3, 3, 7]], 4, false], [[[2, 1, 5], [3, 3, 7]], 5, true]], hid: [[[[2, 1, 5], [3, 5, 7]], 3], [[[3, 2, 7], [3, 7, 9], [8, 3, 9]], 11], [[[9, 0, 1], [3, 3, 7]], 4]],
    code: `function carPooling(trips, capacity) {
  const diff = new Array(1002).fill(0);
  for (const [p, a, b] of trips) { diff[a] += p; diff[b] -= p; }
  let load = 0;
  for (const d of diff) { load += d; if (load > capacity) return false; }
  return true;
}`
  },
  {
    id: "min-arrows-balloons", t: "Minimum Number of Arrows to Burst Balloons", d: "M", tp: ["intervals", "greedy", "sorting"], pt: ["intervals", "greedy"], co: ["Amazon", "Meta", "Microsoft"], lc: "minimum-number-of-arrows-to-burst-balloons",
    s: "Balloons are intervals on the x-axis. An arrow at x bursts every balloon with start ≤ x ≤ end. Return the minimum arrows.", h: ["Sort by end.", "Shoot at the first balloon's end; skip every balloon that covers that point."],
    a: "Greedy by earliest end (touching counts as overlap here).", tc: "O(n log n)", sc: "O(1)", sim: ["non-overlapping-intervals", "meeting-rooms-ii"],
    fn: "findMinArrowShots", params: "points:number[][]", ret: "number",
    ex: [[[[10, 16], [2, 8], [1, 6], [7, 12]], 2], [[[1, 2], [3, 4], [5, 6], [7, 8]], 4], [[[1, 2], [2, 3], [3, 4], [4, 5]], 2]], hid: [[[[1, 2]]], [[[-2147483646, -2147483645], [2147483646, 2147483647]]], [[[9, 12], [1, 10], [4, 11], [8, 12], [3, 9], [6, 9], [6, 7]]]],
    code: `function findMinArrowShots(points) {
  points.sort((a, b) => a[1] - b[1]);
  let arrows = 0, pos = -Infinity;
  for (const [s, e] of points) {
    if (s > pos) { arrows++; pos = e; }
  }
  return arrows;
}`
  },
  {
    id: "interval-list-intersections", t: "Interval List Intersections", d: "M", tp: ["intervals", "two-pointers"], pt: ["two-pointers", "intervals"], co: ["Meta", "Uber", "Google"], lc: "interval-list-intersections",
    s: "Two lists of sorted, disjoint closed intervals. Return their intersection.", h: ["One pointer per list.", "Intersection is [max starts, min ends] if valid; advance whichever ends first."],
    a: "Two pointers over both lists.", tc: "O(m + n)", sc: "O(1) extra", sim: ["merge-intervals", "merge-sorted-array"],
    fn: "intervalIntersection", params: "firstList:number[][], secondList:number[][]", ret: "number[][]",
    ex: [[[[0, 2], [5, 10], [13, 23], [24, 25]], [[1, 5], [8, 12], [15, 24], [25, 26]], [[1, 2], [5, 5], [8, 10], [15, 23], [24, 24], [25, 25]]], [[[1, 3], [5, 9]], [], []]], hid: [[[[1, 7]], [[3, 10]]], [[[3, 10]], [[5, 10]]]],
    code: `function intervalIntersection(firstList, secondList) {
  const res = [];
  let i = 0, j = 0;
  while (i < firstList.length && j < secondList.length) {
    const lo = Math.max(firstList[i][0], secondList[j][0]);
    const hi = Math.min(firstList[i][1], secondList[j][1]);
    if (lo <= hi) res.push([lo, hi]);
    if (firstList[i][1] < secondList[j][1]) i++; else j++;
  }
  return res;
}`
  },
  {
    id: "sort-array", t: "Sort an Array (implement merge sort)", d: "M", tp: ["sorting", "divide-conquer", "recursion"], pt: ["recursion"], co: ["Amazon", "Microsoft", "Apple"], lc: "sort-an-array",
    s: "Sort nums ascending in O(n log n) without using the built-in sort.", h: ["Split in half, sort each half, merge.", "Merging two sorted arrays is a two-pointer walk."],
    a: "Top-down merge sort.", tc: "O(n log n)", sc: "O(n)", note: "Don't call Array.prototype.sort: the large hidden test is fine for O(n log n) but not for O(n²).", sim: ["merge-sorted-array", "sort-list", "reverse-pairs"],
    fn: "sortArray", params: "nums:number[]", ret: "number[]",
    ex: [[[5, 2, 3, 1], [1, 2, 3, 5]], [[5, 1, 1, 2, 0, 0], [0, 0, 1, 1, 2, 5]]], hid: [[[1]], [[-4, 0, 7, 4, 9, -5, -1, 0, -7, -1]], { label: "100,000 numbers (needs O(n log n))", gen: "() => [Array.from({ length: 100000 }, (_, i) => (i * 7919) % 100003 - 50000)]" }],
    code: `function sortArray(nums) {
  if (nums.length <= 1) return nums;
  const mid = nums.length >> 1;
  const a = sortArray(nums.slice(0, mid)), b = sortArray(nums.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++]);
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);
  return out;
}`
  },
  {
    id: "largest-number", t: "Largest Number", d: "M", tp: ["sorting", "strings", "greedy"], pt: ["greedy"], co: ["Amazon", "Microsoft", "Goldman Sachs"], lc: "largest-number",
    s: "Arrange non-negative integers to form the largest number, returned as a string.", h: ["Compare two numbers a, b by which concatenation is bigger: a+b or b+a.", "Watch out for all zeros → \"0\"."],
    a: "Custom sort by concatenation order.", tc: "O(n log n · k)", sc: "O(n)", sim: ["sort-array"],
    fn: "largestNumber", params: "nums:number[]", ret: "string",
    ex: [[[10, 2], "210"], [[3, 30, 34, 5, 9], "9534330"], [[0, 0], "0"]], hid: [[[1]], [[432, 43243]], [[999999991, 9]]],
    code: `function largestNumber(nums) {
  const s = nums.map(String).sort((a, b) => (b + a).localeCompare(a + b));
  return s[0] === "0" ? "0" : s.join("");
}`
  },
  {
    id: "reverse-pairs", t: "Reverse Pairs", d: "H", tp: ["divide-conquer", "sorting", "binary-search"], pt: ["recursion"], co: ["Google", "Amazon"], lc: "reverse-pairs",
    s: "Count pairs i < j with nums[i] > 2 · nums[j].", h: ["Merge sort: count pairs across the two sorted halves before merging.", "With both halves sorted, a single pointer sweep counts in linear time."],
    a: "Merge sort with a counting step.", tc: "O(n log n)", sc: "O(n)", sim: ["sort-array", "count-of-smaller"],
    fn: "reversePairs", params: "nums:number[]", ret: "number",
    ex: [[[1, 3, 2, 3, 1], 2], [[2, 4, 3, 5, 1], 3]], hid: [[[1]], [[5, 4, 3, 2, 1]], [[2147483647, 2147483647, 2147483647, 2147483647, 2147483647, 2147483647]]],
    code: `function reversePairs(nums) {
  const sort = a => {
    if (a.length <= 1) return [a, 0];
    const mid = a.length >> 1;
    const [L, c1] = sort(a.slice(0, mid)), [R, c2] = sort(a.slice(mid));
    let c = c1 + c2, j = 0;
    for (const x of L) { while (j < R.length && x > 2 * R[j]) j++; c += j; }
    const out = []; let i = 0; j = 0;
    while (i < L.length && j < R.length) out.push(L[i] <= R[j] ? L[i++] : R[j++]);
    return [out.concat(L.slice(i), R.slice(j)), c];
  };
  return sort(nums)[1];
}`
  },
  {
    id: "count-of-smaller", t: "Count of Smaller Numbers After Self", d: "H", tp: ["divide-conquer", "sorting", "binary-search"], pt: ["recursion", "binary-search"], co: ["Google", "Amazon", "Apple"], lc: "count-of-smaller-numbers-after-self",
    s: "Return counts where counts[i] is how many numbers to the right of nums[i] are smaller.", h: ["Merge sort indexes; when an element from the left half is placed, every right element already placed was smaller.", "Or insert from the right into a sorted list with binary search (O(n²) worst)."],
    a: "Merge sort on indexes, counting right-half elements placed before each left element.", tc: "O(n log n)", sc: "O(n)", sim: ["reverse-pairs", "sort-array"],
    fn: "countSmaller", params: "nums:number[]", ret: "number[]",
    ex: [[[5, 2, 6, 1], [2, 1, 1, 0]], [[-1], [0]], [[-1, -1], [0, 0]]], hid: [[[1, 2, 3]], [[3, 2, 1]], [[2, 0, 1]]],
    code: `function countSmaller(nums) {
  const res = new Array(nums.length).fill(0);
  const sort = idx => {
    if (idx.length <= 1) return idx;
    const mid = idx.length >> 1;
    const L = sort(idx.slice(0, mid)), R = sort(idx.slice(mid));
    const out = []; let i = 0, j = 0;
    while (i < L.length || j < R.length) {
      if (j === R.length || (i < L.length && nums[L[i]] <= nums[R[j]])) { res[L[i]] += j; out.push(L[i++]); }
      else out.push(R[j++]);
    }
    return out;
  };
  sort(nums.map((_, i) => i));
  return res;
}`
  },
  {
    id: "h-index", t: "H-Index", d: "M", tp: ["sorting", "arrays"], pt: ["greedy"], co: ["Google", "Amazon", "Bloomberg"], lc: "h-index",
    s: "Return the h-index: the maximum h such that at least h papers have ≥ h citations each.", h: ["Sort citations descending.", "h is the last position i (1-based) where citations[i - 1] ≥ i."],
    a: "Sort descending and scan (or bucket counts for O(n)).", tc: "O(n log n)", sc: "O(1)", sim: ["sort-array"],
    fn: "hIndex", params: "citations:number[]", ret: "number",
    ex: [[[3, 0, 6, 1, 5], 3], [[1, 3, 1], 1]], hid: [[[0]], [[100]], [[4, 4, 0, 0]], [[11, 15]]],
    code: `function hIndex(citations) {
  citations.sort((a, b) => b - a);
  let h = 0;
  while (h < citations.length && citations[h] >= h + 1) h++;
  return h;
}`
  },
  {
    id: "car-fleet", t: "Car Fleet", d: "M", tp: ["sorting", "stack", "monotonic-stack"], pt: ["monotonic-stack", "greedy"], co: ["Google", "Amazon", "Uber"], lc: "car-fleet",
    s: "Cars drive to target; a faster car catching a slower one joins its fleet. Return how many fleets arrive.", h: ["Sort cars by position, closest to target first.", "Compute each car's arrival time; a car that would arrive later than the fleet ahead starts a new fleet."],
    a: "Sort by position descending; count increases in arrival time.", tc: "O(n log n)", sc: "O(n)", sim: ["daily-temperatures", "asteroid-collision"],
    fn: "carFleet", params: "target:number, position:number[], speed:number[]", ret: "number",
    ex: [[12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3], 3], [10, [3], [3], 1], [100, [0, 2, 4], [4, 2, 1], 1]], hid: [[10, [6, 8], [3, 2]], [10, [0, 4, 2], [2, 1, 3]]],
    code: `function carFleet(target, position, speed) {
  const cars = position.map((p, i) => [p, (target - p) / speed[i]]).sort((a, b) => b[0] - a[0]);
  let fleets = 0, slowest = 0;
  for (const [, t] of cars) {
    if (t > slowest) { fleets++; slowest = t; }
  }
  return fleets;
}`
  }
];
