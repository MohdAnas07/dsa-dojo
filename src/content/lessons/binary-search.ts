import type { Lesson } from "@/lib/types";

const binarySearch: Lesson = {
  what: "Binary Search finds a target in sorted data by repeatedly checking the middle and throwing away the half where the target cannot be.",
  analogy: { short: "Dictionary lookup", text: "Looking for \"mango\" in a dictionary, you don't start at page 1. You open the middle, see \"lemon\", know mango comes later, and ignore the whole first half. Repeat with the remaining half." },
  eli5: "I'm thinking of a number from 1 to 100. You guess 50. I say \"higher\". You guess 75. \"Lower\". 62… Every guess cuts the options in half, so you win in about 7 guesses.",
  tech: "Binary search maintains an interval [lo, hi] that is guaranteed to contain the answer if it exists. Each comparison with arr[mid] halves the interval, giving O(log n). It generalises to any monotonic predicate: find the first index where condition(x) becomes true.",
  why: "Linear search is O(n). For 1 billion sorted items, binary search needs about 30 comparisons. It also solves \"minimum X such that…\" optimisation problems when the answer space is monotonic.",
  how: ["Set lo = 0, hi = n - 1.", "mid = Math.floor((lo + hi) / 2).", "If arr[mid] is the target, done.", "If arr[mid] < target, the answer is on the right: lo = mid + 1.", "Otherwise it's on the left: hi = mid - 1.", "Stop when lo > hi (not found)."],
  props: ["Requires sorted data or a monotonic condition", "O(log n) time", "O(1) space iterative", "Many variants: first/last occurrence, insert position, search on answer"],
  use: ["Search in sorted array", "First/last position of a value", "Rotated sorted arrays", "\"Minimum capacity / speed / time such that…\" (binary search on answer)"],
  avoid: ["Unsorted data (sorting first costs O(n log n); a Set may be better)", "Linked lists (no O(1) middle access)"],
  viz: "bsearch",
  cx: [["Search", "O(log n)", "Each step halves the range: n → n/2 → n/4 … → 1 takes log₂ n steps."], ["Space (iterative)", "O(1)", "Only lo, hi, mid."], ["Space (recursive)", "O(log n)", "One stack frame per halving."], ["Linear search", "O(n)", "Checks every element."]],
  space: "O(1) iterative.",
  brute: { title: "Brute force: linear search", c: `function search(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
console.log(search([10, 20, 30, 40, 50, 60, 70, 80], 70));`, time: "O(n)", space: "O(1)" },
  code: {
    c: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}
console.log(binarySearch([10, 20, 30, 40, 50, 60, 70, 80], 70));
console.log(binarySearch([10, 20, 30, 40, 50, 60, 70, 80], 35));`,
    hl: [5, 6, 11, 13],
    ex: { 5: "<= because when left === right there is still one element to check.", 6: "Middle of the current range. Math.floor keeps it an integer.", 10: "Target is bigger than the middle, so everything left of mid (and mid itself) is too small.", 11: "+1: mid is already ruled out. Forgetting it can loop forever.", 13: "-1: same reasoning on the other side." }
  },
  examples: [
    { lvl: "Easy", title: "Search insert position", prob: "Return the index of target, or where it would be inserted to keep order.", idea: "Standard binary search. When the loop ends, left is exactly the first position with a value ≥ target.", c: `function searchInsert(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    if (nums[m] === target) return m;
    if (nums[m] < target) l = m + 1;
    else r = m - 1;
  }
  return l;
}
console.log(searchInsert([1, 3, 5, 6], 5));
console.log(searchInsert([1, 3, 5, 6], 2));
console.log(searchInsert([1, 3, 5, 6], 7));`, time: "O(log n)", space: "O(1)" },
    { lvl: "Practical", title: "First and last position (lower bound)", prob: "Find the first and last index of target in a sorted array with duplicates.", idea: "lowerBound(x) = first index with value ≥ x. First position = lowerBound(t); last = lowerBound(t + 1) - 1.", c: `function lowerBound(a, x) {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
function searchRange(a, t) {
  const first = lowerBound(a, t);
  if (first === a.length || a[first] !== t) return [-1, -1];
  return [first, lowerBound(a, t + 1) - 1];
}
console.log(searchRange([5, 7, 7, 8, 8, 10], 8));
console.log(searchRange([5, 7, 7, 8, 8, 10], 6));`, time: "O(log n)", space: "O(1)", ex: { 2: "Half-open range [lo, hi): hi = length, loop while lo < hi.", 6: "a[mid] ≥ x might be the answer, so keep it: hi = mid (not mid - 1)." } },
    { lvl: "Interview", title: "Koko eating bananas (search on answer)", prob: "Find the minimum eating speed k so all piles are finished within h hours.", idea: "If speed k works, any bigger speed works too: the condition is monotonic. Binary search over k from 1 to max pile, checking hours needed.", c: `function minEatingSpeed(piles, h) {
  let lo = 1, hi = Math.max(...piles);
  const hours = k => piles.reduce((t, p) => t + Math.ceil(p / k), 0);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (hours(mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
console.log(minEatingSpeed([3, 6, 7, 11], 8));
console.log(minEatingSpeed([30, 11, 23, 4, 20], 5));`, time: "O(n log max)", space: "O(1)" }
  ],
  signals: [["\"sorted array\" + \"find\"", "Binary search"], ["\"O(log n)\" required", "Binary search"], ["\"minimum X such that…\" / \"maximum X such that…\"", "Binary search on the answer"], ["\"rotated sorted array\"", "Modified binary search: one half is always sorted"], ["\"first / last occurrence\"", "Lower / upper bound"]],
  mistakes: [["lo = mid instead of mid + 1 with while (lo <= hi)", "Can loop forever. Match your loop condition with your updates."], ["Mixing closed [lo, hi] and half-open [lo, hi) styles", "Pick one template and stick to it."], ["Using it on unsorted data", "Binary search only works when you can discard half safely."], ["(lo + hi) / 2 without floor", "JS gives decimals; use Math.floor or >> 1."]],
  js: ["(lo + hi) >> 1 is a fast floor for non-negative ints under 2^31.", "Integer overflow of lo + hi is not an issue in JS numbers for array sizes, unlike Java/C++."],
  iq: { Beginner: ["Guess the number game"], Easy: ["binary-search", "search-insert", "First bad version"], Medium: ["search-rotated", "Find minimum in rotated sorted array", "koko-bananas"], Hard: ["Median of two sorted arrays"] },
  rev: { s30: "Sorted data or monotonic yes/no → check the middle, discard half. O(log n).", m2: ["while (l <= r); l = mid + 1; r = mid - 1", "Lower bound: while (lo < hi), hi = mid", "Search on answer: monotonic feasible(x)", "Rotated: one half is always sorted"] },
  cheat: `BINARY SEARCH CHEAT SHEET

l = 0, r = n - 1
while (l <= r):
  mid = floor((l + r) / 2)
  found → return mid
  arr[mid] < t → l = mid + 1
  else         → r = mid - 1

Lower bound (first ≥ x):
  lo = 0, hi = n; while (lo < hi)
  a[mid] < x ? lo = mid + 1 : hi = mid

Think Binary Search when:
→ sorted data
→ "minimum/maximum such that"
→ need O(log n)

Time O(log n)  Space O(1)`
};

export default binarySearch;
