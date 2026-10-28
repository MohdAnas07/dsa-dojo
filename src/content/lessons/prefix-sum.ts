import type { Lesson } from "@/lib/types";

const prefixSum: Lesson = {
  what: "A prefix sum array stores running totals: pre[i] is the sum of the first i elements. With it, the sum of any range nums[l..r] is a single subtraction, pre[r + 1] − pre[l], instead of a loop.",
  analogy: { short: "A car's odometer", text: "To know how far you drove between two towns, you don't re-measure the road: you subtract the odometer reading at the first town from the reading at the second. Prefix sums are odometer readings for an array." },
  eli5: "Write down your piggy-bank total every day. To find how much you saved between Monday and Thursday, take Thursday's total minus Sunday's total.",
  tech: "Build pre with pre[0] = 0 and pre[i + 1] = pre[i] + nums[i] in O(n). Then sum(l, r) = pre[r + 1] − pre[l] in O(1). The leading 0 avoids special cases for ranges starting at 0. Combining prefix sums with a hash map counts subarrays with a given sum in O(n), even with negative numbers: a subarray ending at j sums to k exactly when some earlier prefix equals pre[j] − k. In 2D, P[r + 1][c + 1] = cell + top + left − top-left, and any rectangle's sum takes four lookups. The same idea works with XOR, counts, or remainders mod k.",
  why: "Range-sum questions with many queries, and subarray-sum questions with negative numbers (where sliding windows break), become O(1) per query or O(n) overall. It's one of the most reusable tricks in interviews.",
  how: ["pre = [0]; for each x: pre.push(last + x).", "Range sum l..r (inclusive) = pre[r + 1] − pre[l].", "Count subarrays summing to k: keep a map of how many times each prefix appeared (start with {0: 1}).", "At each step add map[sum − k] to the answer, then record sum.", "2D: build P with inclusion-exclusion; query with four corners."],
  props: ["O(n) to build, O(1) per range query", "pre has n + 1 entries (leading 0)", "Works with negatives (unlike sliding window)", "Generalizes to 2D, XOR, counts and remainders"],
  use: ["Many range-sum queries", "Subarray sum equals k (with negatives)", "Pivot / balance index", "Matrix region sums", "Subarrays divisible by k (prefix remainders)"],
  avoid: ["The array changes between queries (use a Fenwick or segment tree)", "Only one query (just loop)"],
  viz: "array",
  cx: [["Build", "O(n)", "One pass."], ["Range query", "O(1)", "One subtraction."], ["Subarray sum = k with a map", "O(n)", "One pass with O(1) map work per element."], ["2D build / query", "O(R · C) / O(1)", "Inclusion-exclusion."]],
  space: "O(n) for the prefix array (O(R · C) in 2D).",
  code: {
    c: `const nums = [3, 1, 4, 1, 5, 9, 2];
const pre = [0];
for (const x of nums) pre.push(pre[pre.length - 1] + x);
const rangeSum = (l, r) => pre[r + 1] - pre[l];
console.log(pre);
console.log(rangeSum(0, 2), rangeSum(2, 5), rangeSum(6, 6));`,
    hl: [3, 4],
    ex: { 2: "pre[0] = 0 makes ranges that start at index 0 work without special cases.", 3: "pre[i + 1] = pre[i] + nums[i]: a running total.", 4: "Sum of nums[l..r] = total up to r minus total before l." }
  },
  brute: { title: "Brute force: loop for every query", c: `const nums = [3, 1, 4, 1, 5, 9, 2];
function rangeSum(l, r) {
  let s = 0;
  for (let i = l; i <= r; i++) s += nums[i];
  return s;
}
console.log(rangeSum(0, 2), rangeSum(2, 5), rangeSum(6, 6));`, time: "O(n) per query", space: "O(1)", ex: { 4: "Fine for one query, slow for thousands." } },
  examples: [
    { lvl: "Easy", title: "Pivot index", prob: "Find the leftmost index where the sum to its left equals the sum to its right.", idea: "With the total known, the right sum is total − left − nums[i]. Keep a running left sum.", c: `function pivotIndex(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  let left = 0;
  for (let i = 0; i < nums.length; i++) {
    if (left === total - left - nums[i]) return i;
    left += nums[i];
  }
  return -1;
}
console.log(pivotIndex([1, 7, 3, 6, 5, 6]), pivotIndex([1, 2, 3]));`, time: "O(n)", space: "O(1)", ex: { 5: "Right sum = total − left − the pivot itself." } },
    { lvl: "Practical", title: "Subarray sum equals k (negatives allowed)", prob: "Count contiguous subarrays whose sum is k.", idea: "A subarray ending here sums to k when an earlier prefix equals sum − k. Count earlier prefixes in a map, starting with {0: 1} for the empty prefix.", c: `function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]);
  let sum = 0, count = 0;
  for (const x of nums) {
    sum += x;
    count += seen.get(sum - k) || 0;
    seen.set(sum, (seen.get(sum) || 0) + 1);
  }
  return count;
}
console.log(subarraySum([1, 1, 1], 2), subarraySum([1, 2, 3], 3), subarraySum([1, -1, 0], 0));`, time: "O(n)", space: "O(n)", ex: { 2: "The empty prefix (sum 0) lets subarrays that start at index 0 count.", 6: "Every earlier prefix equal to sum − k starts a subarray that ends here and sums to k.", 7: "Record this prefix only after counting, so a subarray can't be empty." } },
    { lvl: "Interview", title: "2D prefix sums: rectangle sums in O(1)", prob: "Answer many 'sum of this sub-rectangle' queries on a matrix.", idea: "P[r][c] = sum of the rectangle from (0,0) to (r−1, c−1). Any rectangle = big − top strip − left strip + the corner subtracted twice.", c: `function regionSums(matrix) {
  const R = matrix.length, C = matrix[0].length;
  const P = Array.from({ length: R + 1 }, () => new Array(C + 1).fill(0));
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) P[r + 1][c + 1] = matrix[r][c] + P[r][c + 1] + P[r + 1][c] - P[r][c];
  return (r1, c1, r2, c2) => P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1];
}
const sum = regionSums([[3, 0, 1, 4], [5, 6, 3, 2], [1, 2, 0, 1]]);
console.log(sum(1, 1, 2, 2), sum(0, 0, 2, 3));`, time: "O(R · C) build, O(1) per query", space: "O(R · C)", ex: { 5: "Cell + area above + area to the left − their overlap.", 6: "Inclusion-exclusion with four corners." } }
  ],
  signals: [["\"sum of range\", many queries, array doesn't change", "Prefix sums"], ["\"subarray sum equals k\" with negatives", "Prefix sum + hash map"], ["\"divisible by k\" subarrays", "Prefix remainders + map"], ["sum to the left equals sum to the right", "Running left sum + total"], ["matrix region sums", "2D prefix sums"]],
  mistakes: [["Off-by-one: pre[r] − pre[l]", "With a leading 0, the inclusive range l..r is pre[r + 1] − pre[l]."], ["Forgetting {0: 1} in the map", "Subarrays that start at index 0 would be missed."], ["Using a sliding window with negative numbers", "The window can't decide when to shrink; use prefix sums + a map."], ["Negative remainders in JS", "((sum % k) + k) % k keeps remainders in 0..k − 1."]],
  js: ["pre.push(pre[pre.length - 1] + x) builds the running total.", "map.get(key) || 0 reads a count that may not exist yet."],
  iq: { Beginner: ["Running totals of an array"], Easy: ["range-sum-query", "pivot-index"], Medium: ["subarray-sum-k", "product-except-self", "subarray-sums-divisible-k", "continuous-subarray-sum", "count-nice-subarrays"], Hard: ["Count range sums that fall within [lower, upper]"] },
  rev: { s30: "pre[i] = sum of the first i elements. Range sum = pre[r + 1] − pre[l] in O(1). Prefix sum + hash map counts subarrays with sum k in O(n), negatives included.", m2: ["Leading 0 in pre", "sum(l..r) = pre[r+1] − pre[l]", "Map of prefix counts, seed {0: 1}", "Remainders for 'divisible by k'", "2D: four-corner inclusion-exclusion"] },
  cheat: `PREFIX SUM CHEAT SHEET

pre = [0]; for x: pre.push(last + x)
sum(l..r) = pre[r+1] − pre[l]

Subarray sum == k:
  seen = {0: 1}; sum = 0
  for x: sum += x; ans += seen[sum − k]; seen[sum]++

2D: P[r+1][c+1] = a[r][c] + P[r][c+1] + P[r+1][c] − P[r][c]
rect = P[r2+1][c2+1] − P[r1][c2+1] − P[r2+1][c1] + P[r1][c1]`
};

export default prefixSum;
