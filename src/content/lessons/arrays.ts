import type { Lesson } from "@/lib/types";

const arrays: Lesson = {
  what: "An array is an ordered list of values stored next to each other, where every value has a position number called an index. The first index is 0.",
  analogy: { short: "A row of numbered boxes", text: "Picture a row of lockers in a school corridor, numbered 0, 1, 2, 3… If you know the locker number you walk straight to it. But if you want to squeeze a new locker in the middle, every locker after it has to shift one place along." },
  eli5: "An array is like an egg carton. Each slot has a number. If I say \"give me slot 3\", you grab it instantly. If I say \"find the brown egg\", you have to look slot by slot.",
  tech: "An array is a contiguous block of memory. The address of element i is base + i × size, so access by index is O(1). Insertion or deletion in the middle requires shifting elements, which is O(n). JavaScript arrays are dynamic: they grow automatically, with amortized O(1) push.",
  why: "Most data comes as a list: scores, prices, messages. We need a structure where we can jump to any position instantly and loop through everything in order. Arrays do exactly that with almost no memory overhead.",
  how: ["Values sit side by side in memory.", "arr[i] jumps directly to position i.", "Adding at the end (push) just uses the next free slot.", "Adding or removing in the middle shifts everything after it.", "Searching for a value without extra info means checking each slot."],
  props: ["Indexed (0-based)", "Ordered: positions are stable until you move things", "Random access in O(1)", "Dynamic size in JavaScript; fixed size in languages like C/Java", "Can hold any type in JS (but keep them the same type for clarity)"],
  use: ["You need fast access by position", "Data is naturally sequential", "You'll iterate over everything often", "Building block for stacks, queues, heaps, DP tables"],
  avoid: ["Frequent inserts/deletes at the front or middle (use a linked list or deque)", "Frequent lookups by value (use a Set or Map)"],
  viz: "array",
  cx: [
    ["Access arr[i]", "O(1)", "Address is computed directly from the index. No searching."],
    ["Update arr[i] = x", "O(1)", "Same as access: jump and overwrite."],
    ["Search (unsorted)", "O(n)", "Value could be anywhere, so worst case you check every slot."],
    ["Push / Pop (end)", "O(1)*", "Nothing needs to move. *Amortized: occasionally JS resizes the storage."],
    ["Insert at index / unshift", "O(n)", "Every element after the index shifts one step right."],
    ["Delete at index / shift", "O(n)", "Every element after the index shifts one step left to close the gap."]
  ],
  space: "O(n) to store n elements.",
  code: {
    c: `const arr = [10, 20, 30, 40];

console.log(arr[2]);        // access
arr[1] = 25;                // update
arr.push(50);               // add to end
arr.splice(2, 0, 27);       // insert 27 at index 2
arr.splice(0, 1);           // delete index 0
console.log(arr);
console.log(arr.length);
console.log(arr.indexOf(40)); // search`,
    hl: [3, 6, 7],
    ex: { 3: "Index access. Arrays start at 0, so index 2 is the third value.", 5: "push adds at the end in O(1): nothing shifts.", 6: "splice(index, deleteCount, ...items). Inserting shifts later elements: O(n).", 7: "Removing index 0 shifts every element left: O(n).", 10: "indexOf scans from the left until it finds the value: O(n)." }
  },
  examples: [
    { lvl: "Easy", title: "Find the maximum element", prob: "Given an array of numbers, return the largest.", idea: "Keep a \"best so far\" and update it while walking once through the array.", c: `function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}
console.log(findMax([3, 9, 2, 7]));
console.log(findMax([-5, -1, -8]));`, time: "O(n)", space: "O(1)", ex: { 2: "Start with the first element, not 0. Otherwise all-negative arrays break." } },
    { lvl: "Practical", title: "Move zeroes to the end", prob: "Move all 0s to the end while keeping the order of non-zero elements. Do it in place.", idea: "Use a write pointer. Walk through the array; every non-zero value gets written at the write position, then the write pointer moves. Finally fill the rest with zeros.", c: `function moveZeroes(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      nums[write] = nums[read];
      write++;
    }
  }
  while (write < nums.length) nums[write++] = 0;
  return nums;
}
console.log(moveZeroes([0, 1, 0, 3, 12]));`, time: "O(n)", space: "O(1)", ex: { 2: "write marks where the next non-zero value should go.", 5: "Copy the non-zero value forward. Order is kept because we go left to right." } },
    { lvl: "Interview", title: "Maximum subarray sum (Kadane)", prob: "Find the contiguous subarray with the largest sum.", idea: "At each index decide: extend the previous subarray or start fresh here? If the running sum became negative, it only hurts, so start again. Track the best seen.", c: `function maxSubArray(nums) {
  let current = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));`, time: "O(n)", space: "O(1)", ex: { 5: "Either start a new subarray at nums[i], or extend the current one. Pick whichever is bigger." } }
  ],
  signals: [["\"index\", \"position\", \"i-th element\"", "Array access"], ["\"in place\", \"O(1) extra space\"", "Pointer / overwrite tricks"], ["\"contiguous subarray\"", "Sliding window / Kadane / prefix sum"], ["\"sorted array\"", "Two pointers or binary search"]],
  mistakes: [["Starting max at 0", "Start at arr[0] or -Infinity, otherwise all-negative inputs fail."], ["Off-by-one: i <= arr.length", "Valid indexes go from 0 to length - 1. Use i < arr.length."], ["Deleting while iterating forward with splice", "Indexes shift under you. Iterate backwards or build a new array."], ["Using arr.sort() on numbers without a comparator", "JS sorts as strings: [10, 9, 1].sort() → [1, 10, 9]. Use (a, b) => a - b."]],
  js: ["const arr = [] still lets you push; const only stops reassignment.", "Array(n).fill(0) makes a zero array. For 2D use Array.from({length: n}, () => Array(m).fill(0)); fill([]) would share one inner array.", "slice copies (O(k)); splice mutates."],
  iq: { Beginner: ["Reverse an array", "Find the second largest element"], Easy: ["two-sum", "best-time-stock", "move-zeroes"], Medium: ["max-subarray", "product-except-self", "rotate-array"], Hard: ["trapping-rain-water", "First missing positive"] },
  rev: { s30: "Array = numbered boxes side by side. Index access O(1). Search O(n). Insert/delete in middle O(n) because things shift. Push/pop at end O(1).", m2: ["Access/update O(1); search O(n); insert/delete middle O(n)", "push/pop O(1); shift/unshift O(n)", "Contiguous subarray → sliding window, prefix sum, Kadane", "Sort numbers with (a, b) => a - b"] },
  cheat: `ARRAYS CHEAT SHEET

Access  → O(1)      push/pop      → O(1)
Search  → O(n)      shift/unshift → O(n)
Insert  → O(n)      sort          → O(n log n)
Delete  → O(n)

Think Array when:
→ indexing matters
→ sequential data
→ contiguous elements

Tricks:
→ write pointer for in-place filtering
→ Kadane for max subarray
→ sort first, then two pointers`
};

export default arrays;
