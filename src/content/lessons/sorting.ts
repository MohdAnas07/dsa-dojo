import type { Lesson } from "@/lib/types";

const sorting: Lesson = {
  what: "Sorting puts items in order. Beyond tidy output, sorted data unlocks faster algorithms: binary search, two pointers, merging intervals, spotting duplicates next to each other, and greedy choices.",
  analogy: { short: "Sorting a hand of cards", text: "Most people pick up cards one at a time and slide each new card into the right spot among the ones already held. That is insertion sort. Splitting a deck into two piles, sorting each and merging them back is merge sort." },
  eli5: "Lining up kids by height. You can keep swapping neighbours who are in the wrong order, or split the class in two, line up each half, and then zip the two lines together.",
  tech: "The simple sorts (bubble, selection, insertion) are O(n²); insertion sort is fast on nearly-sorted data. Merge sort splits the array in half, sorts both halves and merges them: always O(n log n), stable, with O(n) extra space. Quick sort partitions around a pivot: O(n log n) on average, O(n²) in the worst case, and in place. No comparison sort can beat O(n log n); counting and bucket sorts can, when the values are small integers. JavaScript's arr.sort() is stable, but it compares values as strings by default, so always pass (a, b) => a − b for numbers.",
  why: "Sorting is often the first step of an efficient solution: after an O(n log n) sort, many O(n²) problems become O(n) scans. Interviews also ask you to implement merge sort or quick sort, to explain stability, or to sort with a custom comparator.",
  how: ["Bubble sort: swap neighbours that are out of order; repeat until nothing moves.", "Insertion sort: take each item and shift bigger items right until its spot opens.", "Merge sort: sort the left half and the right half recursively, then merge by repeatedly taking the smaller front item.", "Quick sort: pick a pivot, move smaller items to its left and bigger ones to its right, then sort both sides.", "Counting / bucket sort: count how often each value (or frequency) occurs, then read the buckets in order.", "In JS: arr.sort((a, b) => a - b) for numbers; return negative / zero / positive from the comparator."],
  props: ["Stable = equal items keep their original order", "In place = O(1) extra memory", "Comparison sorts need Ω(n log n) comparisons", "Counting sort is O(n + k) for values in a range of size k"],
  use: ["Before binary search or two pointers", "Merging or comparing intervals", "Grouping equal items (anagrams, duplicates)", "Greedy algorithms that need the smallest or earliest first", "Top-k by frequency (bucket sort)"],
  avoid: ["You only need the min, max or top-k once (a scan or heap is cheaper)", "You need order while items keep arriving (use a heap or BST)", "The original order matters and you can't copy the array"],
  viz: "array",
  cx: [["Bubble / selection / insertion", "O(n²)", "Nested loops over the array."], ["Insertion sort, nearly sorted input", "O(n)", "Each item moves only a few places."], ["Merge sort", "O(n log n)", "log n levels of splitting, O(n) merging per level."], ["Quick sort", "O(n log n) average, O(n²) worst", "A bad pivot splits n into n − 1 and 0."], ["Counting sort", "O(n + k)", "One pass to count, one over the k possible values."], ["JS arr.sort", "O(n log n)", "TimSort: stable, adaptive."]],
  space: "Merge sort O(n); quick sort O(log n) stack; insertion/bubble O(1).",
  code: {
    c: `function mergeSort(a) {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  const left = mergeSort(a.slice(0, mid)), right = mergeSort(a.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length)
    out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return out.concat(left.slice(i), right.slice(j));
}
console.log(mergeSort([5, 2, 9, 1, 5, 6]));
console.log([10, 9, 1, 100].sort());
console.log([10, 9, 1, 100].sort((a, b) => a - b));`,
    hl: [4, 8],
    ex: { 4: "Sort each half recursively…", 8: "…then merge by repeatedly taking the smaller front item. Using <= keeps equal items in order (stable).", 12: "The default sort compares strings: '100' comes before '9'!", 13: "Always pass a numeric comparator for numbers." }
  },
  brute: { title: "Brute force: bubble sort", c: `function bubbleSort(a) {
  a = [...a];
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j + 1 < a.length - i; j++)
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
  return a;
}
console.log(bubbleSort([5, 2, 9, 1, 5, 6]));`, time: "O(n²)", space: "O(1)", ex: { 5: "Swap neighbours that are out of order; the largest value bubbles to the end each pass." } },
  examples: [
    { lvl: "Easy", title: "Insertion sort", prob: "Sort an array by inserting each element into the sorted part on its left.", idea: "Keep a sorted prefix. Take the next value, shift bigger values one place right, and drop the value into the gap.", c: `function insertionSort(a) {
  a = [...a];
  for (let i = 1; i < a.length; i++) {
    const x = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > x) { a[j + 1] = a[j]; j--; }
    a[j + 1] = x;
  }
  return a;
}
console.log(insertionSort([4, 3, 2, 10, 12, 1, 5, 6]));`, time: "O(n²), O(n) if nearly sorted", space: "O(1)", ex: { 6: "Shift bigger values right to open a gap.", 7: "Drop the value into the gap." } },
    { lvl: "Practical", title: "Quick sort (Lomuto partition)", prob: "Sort an array in place with quick sort.", idea: "Use the last element as the pivot, move everything smaller to the front, put the pivot right after them, and recurse on both sides.", c: `function quickSort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return a;
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++)
    if (a[j] < pivot) { [a[i], a[j]] = [a[j], a[i]]; i++; }
  [a[i], a[hi]] = [a[hi], a[i]];
  quickSort(a, lo, i - 1);
  quickSort(a, i + 1, hi);
  return a;
}
console.log(quickSort([10, 7, 8, 9, 1, 5]));`, time: "O(n log n) average, O(n²) worst", space: "O(log n) average stack", ex: { 6: "Everything before index i is smaller than the pivot.", 7: "The pivot lands in its final sorted position." } },
    { lvl: "Interview", title: "Top k frequent with bucket sort (O(n))", prob: "Return the k most frequent numbers, faster than sorting.", idea: "A frequency is at most n, so put each number in a bucket indexed by its frequency, then read the buckets from the highest frequency down.", c: `function topKFrequent(nums, k) {
  const count = new Map();
  for (const x of nums) count.set(x, (count.get(x) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [x, c] of count) buckets[c].push(x);
  const out = [];
  for (let c = nums.length; c > 0 && out.length < k; c--) out.push(...buckets[c]);
  return out.slice(0, k);
}
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2));`, time: "O(n)", space: "O(n)", ex: { 4: "Frequencies range from 1 to n, so n + 1 buckets cover them all.", 7: "Read from the most frequent bucket down until we have k numbers." } }
  ],
  signals: [["\"merge\", \"overlapping\", \"intervals\"", "Sort by start first"], ["pairs/triplets summing to a target", "Sort, then two pointers"], ["\"group anagrams\", duplicates", "Sort letters / values to make equal things adjacent"], ["\"minimum number of …\" with greedy choices", "Sort by the key the greedy needs (end time, size, …)"], ["values in a small range, need O(n)", "Counting or bucket sort"]],
  mistakes: [["Calling arr.sort() on numbers without a comparator", "It sorts as strings: [10, 9, 1].sort() → [1, 10, 9]. Use (a, b) => a - b."], ["Returning a boolean from the comparator", "Return a negative, zero or positive number, not true/false."], ["Forgetting that sort mutates the array", "Copy first ([...arr].sort(...)) when the original order matters."], ["Assuming quick sort is always O(n log n)", "Its worst case is O(n²); merge sort is the guaranteed O(n log n) choice."]],
  js: ["arr.sort((a, b) => a - b) ascending, (a, b) => b - a descending.", "Sort by two keys: (a, b) => a.x - b.x || a.y - b.y.", "Strings: a.localeCompare(b).", "Array.prototype.sort is stable since ES2019."],
  iq: { Beginner: ["Sort an array of numbers correctly in JavaScript"], Easy: ["merge-sorted-array", "squares-sorted-array", "valid-anagram", "assign-cookies"], Medium: ["sort-array", "sort-colors", "largest-number", "merge-intervals", "h-index", "sort-list"], Hard: ["count-of-smaller", "reverse-pairs"] },
  rev: { s30: "Simple sorts are O(n²); merge sort is always O(n log n) and stable; quick sort is O(n log n) on average and in place. In JS always pass a comparator for numbers.", m2: ["Merge sort: split, sort halves, merge", "Quick sort: partition around a pivot", "Insertion sort shines on nearly sorted data", "Counting/bucket sort: O(n + k) for small ranges", "Sorting often enables two pointers and greedy"] },
  cheat: `SORTING CHEAT SHEET

bubble/selection/insertion  O(n²)
merge sort   O(n log n), stable, O(n) space
quick sort   O(n log n) avg, O(n²) worst, in place
counting     O(n + k)

JS: arr.sort((a, b) => a - b)   // numbers!
    arr.sort((a, b) => a.x - b.x || a.y - b.y)
    [...arr].sort(...)  // keep the original

Sort first when you see:
→ intervals, pairs, greedy, duplicates`
};

export default sorting;
