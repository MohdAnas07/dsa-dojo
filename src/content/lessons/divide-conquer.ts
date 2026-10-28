import type { Lesson } from "@/lib/types";

const divideConquer: Lesson = {
  what: "Divide and conquer splits a problem into smaller independent pieces (usually halves), solves each piece recursively, and combines their answers. Merge sort, quick sort and binary search all work this way.",
  analogy: { short: "Counting votes by district", text: "Instead of one person counting every ballot in the country, each district counts its own, then the regions add up their districts, and finally the totals are combined. Each level does a simple job on smaller piles." },
  eli5: "A big job is too hard, so you cut it in half, and each half in half again, until the pieces are tiny and easy. Then you glue the answers back together.",
  tech: "Three steps: divide (split the input), conquer (solve each part recursively, with a base case for tiny inputs), combine (merge the partial answers). The running time follows a recurrence such as T(n) = 2T(n/2) + O(n), which gives O(n log n) (merge sort), or T(n) = T(n/2) + O(1), which gives O(log n) (binary search). Unlike DP, the subproblems don't overlap, so there is nothing to memoize. The combine step is where the cleverness usually lives, for example counting inversions across the two halves while merging.",
  why: "Splitting in half turns many O(n²) approaches into O(n log n), and many O(n) ones into O(log n). It's the idea behind the fastest sorts, fast exponentiation, tree building and several hard interview problems (median of two arrays, count of smaller numbers).",
  how: ["Base case: what's the answer for 0 or 1 elements?", "Divide: split into two (roughly equal) parts.", "Conquer: recursively solve each part.", "Combine: merge the parts' answers, handling anything that crosses the split.", "Write the recurrence to get the complexity."],
  props: ["Independent subproblems (no overlap)", "Recursion depth ≈ log n when halving", "Cost = recursion levels × work per level", "The combine step usually decides the complexity"],
  use: ["Sorting (merge sort, quick sort)", "Fast exponentiation", "Building balanced trees from sorted data", "Counting pairs across halves (inversions, reverse pairs)", "Quickselect for the k-th element"],
  avoid: ["Subproblems overlap (use DP and memoize)", "Splitting doesn't make the parts independent"],
  viz: "recursion",
  cx: [["T(n) = 2T(n/2) + O(n)", "O(n log n)", "log n levels, O(n) work per level (merge sort)."], ["T(n) = T(n/2) + O(1)", "O(log n)", "Binary search, fast power."], ["T(n) = T(n/2) + O(n) on average", "O(n)", "Quickselect: n + n/2 + n/4 + … ≈ 2n."], ["Recursion space", "O(log n)", "Depth when splitting in half."]],
  space: "O(log n) recursion, plus O(n) if the combine step copies (merge sort).",
  code: {
    c: `function countInversions(arr) {
  if (arr.length <= 1) return [arr, 0];
  const mid = arr.length >> 1;
  const [left, a] = countInversions(arr.slice(0, mid));
  const [right, b] = countInversions(arr.slice(mid));
  const merged = [];
  let i = 0, j = 0, cross = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) merged.push(left[i++]);
    else { merged.push(right[j++]); cross += left.length - i; }
  }
  return [merged.concat(left.slice(i), right.slice(j)), a + b + cross];
}
console.log(countInversions([2, 4, 1, 3, 5])[1]);
console.log(countInversions([5, 4, 3, 2, 1])[1]);`,
    hl: [4, 10],
    ex: { 2: "Base case: one element has no inversions.", 4: "Divide and conquer: count inversions inside each half…", 10: "…combine: right[j] is smaller than every remaining left element, so it adds left.length − i inversions at once.", 12: "Total = inside left + inside right + across the split." }
  },
  brute: { title: "Brute force: check every pair", c: `function countInversionsBrute(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++) if (arr[i] > arr[j]) count++;
  return count;
}
console.log(countInversionsBrute([2, 4, 1, 3, 5]));`, time: "O(n²)", space: "O(1)", ex: { 4: "Every pair is compared separately." } },
  examples: [
    { lvl: "Easy", title: "Fast power", prob: "Compute xⁿ in O(log n) multiplications.", idea: "xⁿ = (x^(n/2))², times one more x when n is odd. Each call halves n.", c: `function myPow(x, n) {
  if (n < 0) return 1 / myPow(x, -n);
  if (n === 0) return 1;
  const half = myPow(x, Math.floor(n / 2));
  return n % 2 === 0 ? half * half : half * half * x;
}
console.log(myPow(2, 10), myPow(2, -2), myPow(3, 5));`, time: "O(log n)", space: "O(log n)", ex: { 4: "Solve the half-size problem once and reuse it.", 5: "Square it; an odd exponent needs one extra x." } },
    { lvl: "Practical", title: "Sorted array → balanced BST", prob: "Build a height-balanced binary search tree from a sorted array.", idea: "The middle element becomes the root; the left half builds the left subtree and the right half the right subtree.", c: `function sortedArrayToBST(nums, lo = 0, hi = nums.length - 1) {
  if (lo > hi) return null;
  const mid = (lo + hi) >> 1;
  return { val: nums[mid], left: sortedArrayToBST(nums, lo, mid - 1), right: sortedArrayToBST(nums, mid + 1, hi) };
}
const show = n => (n ? "(" + show(n.left) + " " + n.val + " " + show(n.right) + ")" : ".");
console.log(show(sortedArrayToBST([-10, -3, 0, 5, 9])));`, time: "O(n)", space: "O(log n)", ex: { 3: "The middle splits the values evenly, which keeps the tree balanced.", 6: "Prints the tree as (left value right), with . for empty." } },
    { lvl: "Interview", title: "Quickselect: k-th largest in O(n) average", prob: "Find the k-th largest element without fully sorting.", idea: "Partition around a pivot like quick sort, but only continue into the side that contains the target index. Average work n + n/2 + n/4 + … ≈ 2n.", c: `function findKthLargest(nums, k) {
  const a = [...nums], target = a.length - k;
  let lo = 0, hi = a.length - 1;
  while (true) {
    const pivot = a[hi];
    let p = lo;
    for (let i = lo; i < hi; i++) if (a[i] < pivot) { [a[i], a[p]] = [a[p], a[i]]; p++; }
    [a[p], a[hi]] = [a[hi], a[p]];
    if (p === target) return a[p];
    if (p < target) lo = p + 1; else hi = p - 1;
  }
}
console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2), findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4));`, time: "O(n) average, O(n²) worst", space: "O(1)", ex: { 2: "The k-th largest sits at index n − k in sorted order.", 8: "The pivot is now in its final sorted position.", 10: "Discard the half that can't contain the answer." } }
  ],
  signals: [["sorted input + \"build balanced …\"", "Middle as root, recurse on halves"], ["\"count pairs i < j with …\" over an array", "Merge-sort-style counting"], ["huge exponent", "Fast power"], ["\"k-th largest / smallest\"", "Quickselect (or a heap)"], ["\"median of two sorted arrays\"", "Binary search on a partition"]],
  mistakes: [["No base case (or the wrong one)", "Infinite recursion; handle length 0/1 first."], ["Overlapping subproblems treated as independent", "If the same piece is solved repeatedly, memoize (that's DP)."], ["Forgetting the cross-split cases when combining", "Pairs or subarrays that straddle the middle need their own handling."], ["Copying arrays at every level unnecessarily", "Pass indices (lo, hi) to avoid O(n) slices when possible."]],
  js: ["(lo + hi) >> 1 is integer division by 2.", "slice copies: fine for clarity, but indices save memory."],
  iq: { Beginner: ["Compute the sum of an array by splitting it in half"], Easy: ["sorted-array-to-bst", "majority-element"], Medium: ["pow-x-n", "sort-array", "sort-list", "kth-largest", "different-ways-parentheses", "build-tree-pre-in"], Hard: ["median-two-sorted", "reverse-pairs", "count-of-smaller", "merge-k-sorted-lists"] },
  rev: { s30: "Split into independent halves, solve recursively, combine. T(n) = 2T(n/2) + O(n) → O(n log n); T(n) = T(n/2) + O(1) → O(log n). The combine step handles what crosses the split.", m2: ["Base case first", "Divide → conquer → combine", "Write the recurrence for the complexity", "No overlap (otherwise DP)", "Quickselect, fast power, merge sort"] },
  cheat: `DIVIDE & CONQUER CHEAT SHEET

solve(problem):
  if small: return base answer
  left  = solve(first half)
  right = solve(second half)
  return combine(left, right)   // + cross cases

2T(n/2) + O(n) → O(n log n)
T(n/2) + O(1)  → O(log n)
T(n/2) + O(n)  → O(n)

Examples: merge sort, quick sort, binary search,
fast power, quickselect, inversion count`
};

export default divideConquer;
