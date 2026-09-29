import type { Lesson } from "@/lib/types";

const twoPointers: Lesson = {
  what: "Two Pointers means using two index variables that walk through the data together, often from opposite ends or at different speeds, so that you avoid checking every pair.",
  analogy: { short: "Two people closing a gap", text: "Two friends stand at opposite ends of a hallway of sorted price tags looking for two items that cost exactly ₹100 together. If the total is too high, the one at the expensive end steps inward. Too low? The one at the cheap end steps inward. They never need to go back." },
  eli5: "Put one finger at the start of a sorted list and one at the end. Add the two numbers. Too big? Move the right finger left. Too small? Move the left finger right. You find the answer without trying every combination.",
  tech: "Two pointers exploits monotonic structure (usually sortedness) so that each pointer move safely discards a set of candidate pairs. Each pointer moves at most n times, giving O(n) instead of O(n²).",
  why: "Brute-force pair problems check n² pairs. When data is sorted (or can be), one comparison tells you which side can't possibly be part of the answer, so you throw it away and move on.",
  how: ["Place pointers: both ends (opposite) or both at start (same direction / fast-slow).", "Look at the elements under the pointers.", "Based on a comparison, move exactly one pointer.", "Stop when they meet or cross.", "Every move discards options that can never work."],
  props: ["Usually needs sorted input or a clear rule for moving", "O(n) time, O(1) space", "Variants: opposite ends, same direction (read/write), fast & slow"],
  use: ["Sorted array + find a pair / triplet", "Palindrome checks", "Removing duplicates in place", "Merging two sorted arrays", "Container / area problems"],
  avoid: ["Unsorted data where sorting would lose needed indexes (use a hash map)", "When you need all pairs, not just one type"],
  viz: "twoptr",
  cx: [["Opposite-end scan", "O(n)", "Each step moves one pointer inward; together they move at most n times."], ["With sort first", "O(n log n)", "Sorting dominates the linear scan."], ["3Sum (fix one + two pointers)", "O(n²)", "n choices for the fixed element × O(n) scan."], ["Space", "O(1)", "Only two index variables."]],
  space: "O(1) extra.",
  brute: { title: "Brute force: check all pairs", c: `function pairSum(arr, target) {
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] + arr[j] === target) return [i, j];
  return [];
}
console.log(pairSum([1, 3, 4, 6, 8, 11], 10));`, time: "O(n²)", space: "O(1)" },
  code: {
    c: `// Sorted array: find two numbers adding to target
function pairSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}
console.log(pairSum([1, 3, 4, 6, 8, 11], 10));`,
    hl: [8, 9],
    ex: { 5: "Pointers must not cross; when left === right there is no pair left.", 8: "Sum too small: arr[left] is too small to pair with ANY remaining right value (they're all ≤ arr[right]). Discard it.", 9: "Sum too big: arr[right] is too big even with the smallest remaining left. Discard it." }
  },
  examples: [
    { lvl: "Easy", title: "Reverse an array in place", prob: "Reverse without creating a new array.", idea: "Swap the two ends, move both pointers inward.", c: `function reverse(arr) {
  let l = 0, r = arr.length - 1;
  while (l < r) {
    [arr[l], arr[r]] = [arr[r], arr[l]];
    l++; r--;
  }
  return arr;
}
console.log(reverse([1, 2, 3, 4, 5]));`, time: "O(n)", space: "O(1)" },
    { lvl: "Practical", title: "Remove duplicates from sorted array", prob: "Keep unique values at the front in place and return how many there are.", idea: "Slow pointer = end of the unique section. Fast pointer scans. When fast finds a new value, extend the unique section.", c: `function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}
const a = [1, 1, 2, 3, 3, 3, 4];
const k = removeDuplicates(a);
console.log(k, a.slice(0, k));`, time: "O(n)", space: "O(1)" },
    { lvl: "Interview", title: "Container with most water", prob: "Pick two lines so the container they form holds the most water.", idea: "Area = width × shorter height. Start widest. Moving the taller line can never help (width shrinks, height is capped by the shorter), so always move the shorter one.", c: `function maxArea(h) {
  let l = 0, r = h.length - 1, best = 0;
  while (l < r) {
    const area = (r - l) * Math.min(h[l], h[r]);
    best = Math.max(best, area);
    if (h[l] < h[r]) l++;
    else r--;
  }
  return best;
}
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));`, time: "O(n)", space: "O(1)" }
  ],
  signals: [["\"sorted array\" + \"pair / triplet\"", "Opposite-end pointers"], ["\"in place\" + \"remove / keep\"", "Read/write (slow-fast) pointers"], ["\"palindrome\"", "Two ends moving inward"], ["\"merge two sorted\"", "One pointer per array"], ["\"cycle\" / \"middle of list\"", "Fast & slow pointers"]],
  mistakes: [["Using two pointers on unsorted data for pair sum", "Sort first (if indexes don't matter) or use a hash map."], ["while (l <= r) when pairing distinct elements", "Use l < r so an element isn't paired with itself."], ["Moving both pointers when only one should move", "Each comparison justifies moving one side only."], ["Skipping duplicate handling in 3Sum", "Skip equal neighbours to avoid duplicate triplets."]],
  js: ["Swap with destructuring: [a[i], a[j]] = [a[j], a[i]].", "Sorting numbers: nums.sort((a, b) => a - b)."],
  iq: { Beginner: ["Reverse an array in place", "Check palindrome"], Easy: ["valid-palindrome", "move-zeroes", "Merge sorted array"], Medium: ["container-water", "three-sum", "Sort colors"], Hard: ["trapping-rain-water"] },
  rev: { s30: "Two indexes instead of nested loops. Opposite ends for sorted pair problems, slow/fast for in-place edits. Each move discards impossible options → O(n).", m2: ["Sum too small → left++, too big → right--", "Read/write pointer for in-place removal", "3Sum = sort + fix one + two pointers → O(n²)", "Always ask: why is it safe to move this pointer?"] },
  cheat: `TWO POINTERS CHEAT SHEET

Opposite ends (sorted):
  l = 0, r = n - 1
  while (l < r) → compare → move one

Same direction (in place):
  slow = write position, fast = reader

Think Two Pointers when:
→ sorted + pair/triplet
→ palindrome
→ in-place remove/partition
→ merge sorted lists

Time O(n)  Space O(1)`
};

export default twoPointers;
