import type { Problem } from "@/lib/types";

type CoreProblem = Omit<Problem, "topics" | "pats" | "similar">;

// ===== Problems. Each code sample prints its own output (verified at build). =====
const LL = `class ListNode { constructor(v, n = null) { this.val = v; this.next = n; } }
const build = a => a.reduceRight((n, v) => new ListNode(v, n), null);
const show = h => { const o = []; while (h) { o.push(h.val); h = h.next; } return o; };
`;
const TR = `class TreeNode { constructor(v, l = null, r = null) { this.val = v; this.left = l; this.right = r; } }
function buildTree(a) {
  if (!a.length || a[0] === null) return null;
  const root = new TreeNode(a[0]), q = [root];
  let i = 1, h = 0;
  while (i < a.length) {
    const node = q[h++];
    if (a[i] !== null && a[i] !== undefined) { node.left = new TreeNode(a[i]); q.push(node.left); } i++;
    if (i < a.length && a[i] !== null) { node.right = new TreeNode(a[i]); q.push(node.right); } i++;
  }
  return root;
}
`;
export const CORE_PROBLEMS: CoreProblem[] = [
{ id:"two-sum", t:"Two Sum", d:"E", topic:"hashing", pat:"hashing", co:["Amazon","Google","Meta","Microsoft"], lc:"two-sum",
  s:"Given an array nums and a target, return the indexes of the two numbers that add up to target. Exactly one answer exists; don't use the same element twice.",
  eg:"nums = [2, 7, 11, 15], target = 9 → [0, 1]",
  h:["For each number x, what other number do you need?","Can you remember numbers you've already passed so checking is O(1)?"],
  a:"Walk once. For each nums[i], compute need = target - nums[i]. If need is in a Map of value → index, return both indexes. Otherwise store nums[i] → i.",
  c:`function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}
console.log(twoSum([2, 7, 11, 15], 9));
console.log(twoSum([3, 3], 6));`, tc:"O(n)", sc:"O(n)", f:["What if the array is sorted? (two pointers, O(1) space)","Return all unique pairs instead of one","What if there are many queries with different targets?"] },
{ id:"contains-duplicate", t:"Contains Duplicate", d:"E", topic:"hashing", pat:"hashing", co:["Amazon","Apple","Adobe"], lc:"contains-duplicate",
  s:"Return true if any value appears at least twice in the array.", eg:"[1, 2, 3, 1] → true",
  h:["Brute force compares every pair: O(n²). What structure answers 'seen before?' in O(1)?","A Set."],
  a:"Add each number to a Set; if it's already there, return true. Or compare new Set(nums).size with nums.length.",
  c:`function containsDuplicate(nums) {
  const seen = new Set();
  for (const x of nums) {
    if (seen.has(x)) return true;
    seen.add(x);
  }
  return false;
}
console.log(containsDuplicate([1, 2, 3, 1]));
console.log(containsDuplicate([1, 2, 3, 4]));`, tc:"O(n)", sc:"O(n)", f:["Solve with O(1) extra space (sort first: O(n log n))","Duplicates within distance k of each other"] },
{ id:"best-time-stock", t:"Best Time to Buy and Sell Stock", d:"E", topic:"arrays", pat:"sliding-window", co:["Amazon","Meta","Bloomberg","Flipkart"], lc:"best-time-to-buy-and-sell-stock",
  s:"prices[i] is a stock's price on day i. Buy once and sell once later. Return the maximum profit (0 if none).", eg:"[7, 1, 5, 3, 6, 4] → 5 (buy 1, sell 6)",
  h:["For each selling day, which buying day is best?","Track the minimum price seen so far."],
  a:"One pass. Keep minPrice so far. Profit if selling today = price - minPrice. Track the best.",
  c:`function maxProfit(prices) {
  let minPrice = Infinity, best = 0;
  for (const p of prices) {
    minPrice = Math.min(minPrice, p);
    best = Math.max(best, p - minPrice);
  }
  return best;
}
console.log(maxProfit([7, 1, 5, 3, 6, 4]));
console.log(maxProfit([7, 6, 4, 3, 1]));`, tc:"O(n)", sc:"O(1)", f:["Unlimited transactions (sum of all rises)","At most two transactions (DP)","With a cooldown day (state machine DP)"] },
{ id:"move-zeroes", t:"Move Zeroes", d:"E", topic:"arrays", pat:"two-pointers", co:["Meta","Microsoft","Uber"], lc:"move-zeroes",
  s:"Move all 0s to the end in place, keeping the relative order of non-zero elements.", eg:"[0, 1, 0, 3, 12] → [1, 3, 12, 0, 0]",
  h:["Use one pointer to read and another to mark where the next non-zero should go.","Swapping instead of overwriting lets you finish in one pass."],
  a:"write = 0. For each read index, if nums[read] ≠ 0, swap nums[read] with nums[write] and write++.",
  c:`function moveZeroes(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      [nums[write], nums[read]] = [nums[read], nums[write]];
      write++;
    }
  }
  return nums;
}
console.log(moveZeroes([0, 1, 0, 3, 12]));`, tc:"O(n)", sc:"O(1)", f:["Minimise the number of writes","Move all instances of value v to the front"] },
{ id:"max-subarray", t:"Maximum Subarray", d:"M", topic:"arrays", pat:"dp", co:["Amazon","Microsoft","LinkedIn"], lc:"maximum-subarray",
  s:"Find the contiguous subarray with the largest sum and return the sum.", eg:"[-2, 1, -3, 4, -1, 2, 1, -5, 4] → 6 ([4, -1, 2, 1])",
  h:["If the running sum becomes negative, does it help anything that comes after?","At each index: extend the previous subarray or start fresh."],
  a:"Kadane's algorithm: cur = max(x, cur + x); best = max(best, cur).",
  c:`function maxSubArray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
console.log(maxSubArray([-3, -1, -2]));`, tc:"O(n)", sc:"O(1)", f:["Return the subarray itself (track start index)","Divide and conquer version","Maximum product subarray"] },
{ id:"product-except-self", t:"Product of Array Except Self", d:"M", topic:"arrays", pat:"prefix-sum", co:["Amazon","Meta","Apple"], lc:"product-of-array-except-self",
  s:"Return an array where answer[i] is the product of all elements except nums[i], without division, in O(n).", eg:"[1, 2, 3, 4] → [24, 12, 8, 6]",
  h:["answer[i] = (product of everything left of i) × (product of everything right of i).","Compute left products in one pass, right products in a second pass."],
  a:"First pass fills ans[i] with the prefix product. Second pass from the right multiplies by a running suffix product.",
  c:`function productExceptSelf(nums) {
  const n = nums.length, ans = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) { ans[i] = left; left *= nums[i]; }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) { ans[i] *= right; right *= nums[i]; }
  return ans;
}
console.log(productExceptSelf([1, 2, 3, 4]));`, tc:"O(n)", sc:"O(1) extra", f:["How would zeros break the division approach?","Range product queries"] },
{ id:"rotate-array", t:"Rotate Array", d:"M", topic:"arrays", pat:"two-pointers", co:["Microsoft","Amazon"], lc:"rotate-array",
  s:"Rotate the array to the right by k steps, in place.", eg:"[1, 2, 3, 4, 5, 6, 7], k = 3 → [5, 6, 7, 1, 2, 3, 4]",
  h:["k can be bigger than n: use k % n.","Reversing the whole array, then the two parts, does the rotation."],
  a:"reverse(all), reverse(first k), reverse(rest). Each reverse is two pointers.",
  c:`function rotate(nums, k) {
  k %= nums.length;
  const rev = (l, r) => { while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; } };
  rev(0, nums.length - 1);
  rev(0, k - 1);
  rev(k, nums.length - 1);
  return nums;
}
console.log(rotate([1, 2, 3, 4, 5, 6, 7], 3));`, tc:"O(n)", sc:"O(1)", f:["Rotate left instead","Rotate a string / check if one string is a rotation of another"] },
{ id:"trapping-rain-water", t:"Trapping Rain Water", d:"H", topic:"arrays", pat:"two-pointers", co:["Google","Amazon","Goldman Sachs"], lc:"trapping-rain-water",
  s:"Given bar heights, compute how much water is trapped after raining.", eg:"[0,1,0,2,1,0,1,3,2,1,2,1] → 6",
  h:["Water above bar i = min(maxLeft, maxRight) - height[i].","With two pointers, the side with the smaller max is the bottleneck, so you can finalize it."],
  a:"l and r from both ends with leftMax and rightMax. Move the side with the smaller max inward, adding max - height.",
  c:`function trap(h) {
  let l = 0, r = h.length - 1, lMax = 0, rMax = 0, water = 0;
  while (l < r) {
    if (h[l] < h[r]) {
      lMax = Math.max(lMax, h[l]);
      water += lMax - h[l++];
    } else {
      rMax = Math.max(rMax, h[r]);
      water += rMax - h[r--];
    }
  }
  return water;
}
console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]));
console.log(trap([4, 2, 0, 3, 2, 5]));`, tc:"O(n)", sc:"O(1)", f:["Solve with prefix max arrays first (O(n) space)","Monotonic stack solution","Trapping rain water in 2D (heap + BFS)"] },
{ id:"valid-palindrome", t:"Valid Palindrome", d:"E", topic:"strings", pat:"two-pointers", co:["Meta","Microsoft"], lc:"valid-palindrome",
  s:"After lowercasing and removing non-alphanumeric characters, does the string read the same forwards and backwards?", eg:"\"A man, a plan, a canal: Panama\" → true",
  h:["Compare characters from both ends.","Skip characters that aren't letters or digits."],
  a:"Two pointers moving inward, skipping non-alphanumerics, comparing lowercase characters.",
  c:`function isPalindrome(s) {
  const ok = c => /[a-z0-9]/i.test(c);
  let l = 0, r = s.length - 1;
  while (l < r) {
    while (l < r && !ok(s[l])) l++;
    while (l < r && !ok(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++; r--;
  }
  return true;
}
console.log(isPalindrome("A man, a plan, a canal: Panama"));
console.log(isPalindrome("race a car"));`, tc:"O(n)", sc:"O(1)", f:["Valid Palindrome II: may delete at most one character","Longest palindromic substring"] },
{ id:"valid-anagram", t:"Valid Anagram", d:"E", topic:"strings", pat:"frequency-counter", co:["Amazon","Bloomberg"], lc:"valid-anagram",
  s:"Return true if t is an anagram of s (same letters, same counts).", eg:"s = \"anagram\", t = \"nagaram\" → true",
  h:["Sorting both works in O(n log n). Can you count instead?","Increment for s, decrement for t; all counts must end at 0."],
  a:"Frequency counter with a Map (works for Unicode) or a 26-length array.",
  c:`function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Map();
  for (const c of s) count.set(c, (count.get(c) || 0) + 1);
  for (const c of t) {
    if (!count.get(c)) return false;
    count.set(c, count.get(c) - 1);
  }
  return true;
}
console.log(isAnagram("anagram", "nagaram"));
console.log(isAnagram("rat", "car"));`, tc:"O(n)", sc:"O(k)", f:["Find all anagrams of p in s (sliding window)","Group anagrams"] },
{ id:"longest-substring", t:"Longest Substring Without Repeating Characters", d:"M", topic:"sliding-window", pat:"sliding-window", co:["Amazon","Google","Meta","Adobe"], lc:"longest-substring-without-repeating-characters",
  s:"Return the length of the longest substring with no repeated characters.", eg:"\"abcabcbb\" → 3 (\"abc\")",
  h:["Substring = contiguous. Longest = … which pattern?","When you see a duplicate, where should the left edge jump to?"],
  a:"Sliding window with a Map of last seen index. If the current char was seen at index ≥ left, move left to lastIndex + 1.",
  c:`function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    if (last.has(s[right]) && last.get(s[right]) >= left) left = last.get(s[right]) + 1;
    last.set(s[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
console.log(lengthOfLongestSubstring("abcabcbb"));
console.log(lengthOfLongestSubstring("bbbbb"));
console.log(lengthOfLongestSubstring("pwwkew"));`, tc:"O(n)", sc:"O(k)", f:["At most k distinct characters","Return the substring itself"] },
{ id:"group-anagrams", t:"Group Anagrams", d:"M", topic:"hashing", pat:"hashing", co:["Amazon","Meta","Uber"], lc:"group-anagrams",
  s:"Group the words that are anagrams of each other.", eg:"[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"] → [[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]",
  h:["What do all anagrams have in common?","Use that common thing as a Map key."],
  a:"Key = sorted letters (or a 26-count signature). Map key → list of words.",
  c:`function groupAnagrams(strs) {
  const m = new Map();
  for (const s of strs) {
    const key = [...s].sort().join("");
    if (!m.has(key)) m.set(key, []);
    m.get(key).push(s);
  }
  return [...m.values()];
}
console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));`, tc:"O(n · k log k)", sc:"O(n · k)", f:["Use a count signature to make keys O(k)","Group shifted strings (abc, bcd, …)"] },
{ id:"top-k-frequent", t:"Top K Frequent Elements", d:"M", topic:"hashing", pat:"top-k", co:["Amazon","Meta","Oracle"], lc:"top-k-frequent-elements",
  s:"Return the k most frequent elements.", eg:"[1,1,1,2,2,3], k = 2 → [1, 2]",
  h:["First count frequencies.","A frequency can be at most n, so you can bucket numbers by frequency (bucket sort)."],
  a:"Count with a Map. Put each number into bucket[freq]. Walk buckets from high to low collecting k numbers. O(n).",
  c:`function topKFrequent(nums, k) {
  const count = new Map();
  for (const x of nums) count.set(x, (count.get(x) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [x, f] of count) buckets[f].push(x);
  const res = [];
  for (let f = buckets.length - 1; f >= 0 && res.length < k; f--) res.push(...buckets[f]);
  return res.slice(0, k);
}
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2));`, tc:"O(n)", sc:"O(n)", f:["Heap-based O(n log k) solution","Top k frequent words with tie-breaking"] },
{ id:"subarray-sum-k", t:"Subarray Sum Equals K", d:"M", topic:"hashing", pat:"prefix-sum", co:["Meta","Google","Amazon"], lc:"subarray-sum-equals-k",
  s:"Count contiguous subarrays whose sum equals k. Numbers can be negative.", eg:"[1, 1, 1], k = 2 → 2",
  h:["sum(i..j) = prefix[j] - prefix[i-1]. You want prefix[j] - k to have appeared before.","Negatives break sliding window. Use a Map of prefix sum → count."],
  a:"Running prefix sum. Add count.get(prefix - k) to the answer, then record the current prefix. Seed count with {0: 1}.",
  c:`function subarraySum(nums, k) {
  const count = new Map([[0, 1]]);
  let prefix = 0, res = 0;
  for (const x of nums) {
    prefix += x;
    res += count.get(prefix - k) || 0;
    count.set(prefix, (count.get(prefix) || 0) + 1);
  }
  return res;
}
console.log(subarraySum([1, 1, 1], 2));
console.log(subarraySum([1, -1, 0], 0));`, tc:"O(n)", sc:"O(n)", f:["Longest subarray with sum k","Subarray sums divisible by k"] },
{ id:"longest-consecutive", t:"Longest Consecutive Sequence", d:"M", topic:"hashing", pat:"hashing", co:["Google","Amazon"], lc:"longest-consecutive-sequence",
  s:"Return the length of the longest run of consecutive integers (in any order) in O(n).", eg:"[100, 4, 200, 1, 3, 2] → 4 (1,2,3,4)",
  h:["Sorting is O(n log n). Can a Set help?","Only start counting from numbers that have no x - 1 in the set."],
  a:"Put everything in a Set. For each x without x - 1, count x, x+1, x+2… Each number is visited a constant number of times.",
  c:`function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    if (set.has(x - 1)) continue;
    let len = 1;
    while (set.has(x + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}
console.log(longestConsecutive([100, 4, 200, 1, 3, 2]));`, tc:"O(n)", sc:"O(n)", f:["Return the sequence itself","Union-find approach"] },
{ id:"container-water", t:"Container With Most Water", d:"M", topic:"two-pointers", pat:"two-pointers", co:["Amazon","Google","Adobe"], lc:"container-with-most-water",
  s:"Choose two lines that, with the x-axis, hold the most water. Return the max area.", eg:"[1,8,6,2,5,4,8,3,7] → 49",
  h:["Start with the widest container.","Moving the taller line can't increase area. Which one should move?"],
  a:"l = 0, r = n - 1. area = (r - l) × min(h[l], h[r]). Move the shorter line inward.",
  c:`function maxArea(h) {
  let l = 0, r = h.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, (r - l) * Math.min(h[l], h[r]));
    h[l] < h[r] ? l++ : r--;
  }
  return best;
}
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));`, tc:"O(n)", sc:"O(1)", f:["Prove why moving the shorter side is safe","Trapping rain water"] },
{ id:"three-sum", t:"3Sum", d:"M", topic:"two-pointers", pat:"two-pointers", co:["Meta","Amazon","Microsoft"], lc:"3sum",
  s:"Return all unique triplets that sum to 0.", eg:"[-1,0,1,2,-1,-4] → [[-1,-1,2],[-1,0,1]]",
  h:["Sort first. Fix one number, then it's Two Sum on a sorted array.","Skip equal neighbours to avoid duplicate triplets."],
  a:"Sort. For each i (skipping duplicates), run two pointers on i+1..n-1 for target -nums[i].",
  c:`function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const s = nums[i] + nums[l] + nums[r];
      if (s === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      } else if (s < 0) l++;
      else r--;
    }
  }
  return res;
}
console.log(threeSum([-1, 0, 1, 2, -1, -4]));`, tc:"O(n²)", sc:"O(1) extra", f:["3Sum closest","4Sum / kSum generalisation"] },
{ id:"max-avg-subarray", t:"Maximum Average Subarray I", d:"E", topic:"sliding-window", pat:"sliding-window", co:["Google","Amazon"], lc:"maximum-average-subarray-i",
  s:"Find the contiguous subarray of length k with the maximum average.", eg:"[1,12,-5,-6,50,3], k = 4 → 12.75",
  h:["Maximum average = maximum sum (k is fixed).","Fixed window: add the incoming, subtract the outgoing."],
  a:"Fixed-size sliding window sum; divide the best sum by k.",
  c:`function findMaxAverage(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    best = Math.max(best, sum);
  }
  return best / k;
}
console.log(findMaxAverage([1, 12, -5, -6, 50, 3], 4));`, tc:"O(n)", sc:"O(1)", f:["Length at least k (binary search on answer)"] },
{ id:"min-window-substring", t:"Minimum Window Substring", d:"H", topic:"sliding-window", pat:"sliding-window", co:["Meta","Google","Airbnb"], lc:"minimum-window-substring",
  s:"Return the smallest substring of s that contains every character of t (including duplicates).", eg:"s = \"ADOBECODEBANC\", t = \"ABC\" → \"BANC\"",
  h:["Expand right until the window contains everything. Then what?","Shrink from the left while it's still valid, recording the smallest."],
  a:"Need-map for t and a 'missing' counter. Expand right decrementing need; when missing = 0, shrink left and update the best.",
  c:`function minWindow(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  let missing = t.length, l = 0, start = 0, len = Infinity;
  for (let r = 0; r < s.length; r++) {
    if (need.has(s[r])) { if (need.get(s[r]) > 0) missing--; need.set(s[r], need.get(s[r]) - 1); }
    while (missing === 0) {
      if (r - l + 1 < len) { len = r - l + 1; start = l; }
      if (need.has(s[l])) { need.set(s[l], need.get(s[l]) + 1); if (need.get(s[l]) > 0) missing++; }
      l++;
    }
  }
  return len === Infinity ? "" : s.slice(start, start + len);
}
console.log(minWindow("ADOBECODEBANC", "ABC"));
console.log(minWindow("a", "aa") === "");`, tc:"O(|s| + |t|)", sc:"O(k)", f:["Find all anagram start indexes","Smallest range covering elements from k lists"] },
{ id:"binary-search", t:"Binary Search", d:"E", topic:"binary-search", pat:"binary-search", co:["Microsoft","Amazon"], lc:"binary-search",
  s:"Given a sorted array and a target, return its index or -1 in O(log n).", eg:"[-1,0,3,5,9,12], 9 → 4",
  h:["Look at the middle. What does comparing it with target tell you?","Discard the half that can't contain target."],
  a:"Classic closed-interval binary search.",
  c:`function search(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    if (nums[m] === target) return m;
    if (nums[m] < target) l = m + 1; else r = m - 1;
  }
  return -1;
}
console.log(search([-1, 0, 3, 5, 9, 12], 9));
console.log(search([-1, 0, 3, 5, 9, 12], 2));`, tc:"O(log n)", sc:"O(1)", f:["Recursive version","First occurrence with duplicates"] },
{ id:"search-insert", t:"Search Insert Position", d:"E", topic:"binary-search", pat:"binary-search", co:["Amazon","Apple"], lc:"search-insert-position",
  s:"Return the index of target, or where it should be inserted to keep the array sorted.", eg:"[1,3,5,6], 2 → 1",
  h:["This is 'first index with value ≥ target'.","When the loop ends, where does left point?"],
  a:"Lower bound binary search; return lo.",
  c:`function searchInsert(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < target) lo = mid + 1; else hi = mid;
  }
  return lo;
}
console.log(searchInsert([1, 3, 5, 6], 5));
console.log(searchInsert([1, 3, 5, 6], 2));
console.log(searchInsert([1, 3, 5, 6], 7));`, tc:"O(log n)", sc:"O(1)", f:["Upper bound (first > target)"] },
{ id:"search-rotated", t:"Search in Rotated Sorted Array", d:"M", topic:"binary-search", pat:"binary-search", co:["Meta","Amazon","Microsoft","LinkedIn"], lc:"search-in-rotated-sorted-array",
  s:"A sorted array was rotated at an unknown pivot. Find target's index in O(log n).", eg:"[4,5,6,7,0,1,2], 0 → 4",
  h:["Split at mid: one of the two halves is always normally sorted.","Check if target lies inside the sorted half's range."],
  a:"At each step, decide which half is sorted, check whether target is in it, and discard the other half.",
  c:`function search(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const m = (l + r) >> 1;
    if (nums[m] === target) return m;
    if (nums[l] <= nums[m]) {
      if (nums[l] <= target && target < nums[m]) r = m - 1; else l = m + 1;
    } else {
      if (nums[m] < target && target <= nums[r]) l = m + 1; else r = m - 1;
    }
  }
  return -1;
}
console.log(search([4, 5, 6, 7, 0, 1, 2], 0));
console.log(search([4, 5, 6, 7, 0, 1, 2], 3));`, tc:"O(log n)", sc:"O(1)", f:["Find the minimum in a rotated array","With duplicates allowed"] },
{ id:"koko-bananas", t:"Koko Eating Bananas", d:"M", topic:"binary-search", pat:"binary-search", co:["Google","Airbnb"], lc:"koko-eating-bananas",
  s:"Find the minimum integer speed k so Koko finishes all piles within h hours (one pile per hour max).", eg:"piles = [3,6,7,11], h = 8 → 4",
  h:["If speed k works, does speed k + 1 also work?","Binary search the answer between 1 and max(piles)."],
  a:"Binary search on k with feasibility = sum(ceil(p / k)) ≤ h.",
  c:`function minEatingSpeed(piles, h) {
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const k = (lo + hi) >> 1;
    const hours = piles.reduce((t, p) => t + Math.ceil(p / k), 0);
    if (hours <= h) hi = k; else lo = k + 1;
  }
  return lo;
}
console.log(minEatingSpeed([3, 6, 7, 11], 8));`, tc:"O(n log m)", sc:"O(1)", f:["Capacity to ship packages within D days","Split array largest sum"] },
{ id:"reverse-list", t:"Reverse Linked List", d:"E", topic:"linked-list", pat:"two-pointers", co:["Amazon","Microsoft","Apple"], lc:"reverse-linked-list",
  s:"Reverse a singly linked list.", eg:"1→2→3→4→5 → 5→4→3→2→1",
  h:["Each node's next should point to the previous node.","You need to remember prev, cur and the original next."],
  a:"Iterate with prev/cur; save next, flip the pointer, advance.",
  c: LL + `
function reverseList(head) {
  let prev = null, cur = head;
  while (cur) { const nx = cur.next; cur.next = prev; prev = cur; cur = nx; }
  return prev;
}
console.log(show(reverseList(build([1, 2, 3, 4, 5]))));`, tc:"O(n)", sc:"O(1)", f:["Recursive version","Reverse between positions m and n","Reverse in k-groups"] },
{ id:"merge-sorted-lists", t:"Merge Two Sorted Lists", d:"E", topic:"linked-list", pat:"two-pointers", co:["Amazon","Microsoft","Apple"], lc:"merge-two-sorted-lists",
  s:"Merge two sorted linked lists into one sorted list.", eg:"1→2→4 + 1→3→4 → 1→1→2→3→4→4",
  h:["Compare the fronts; the smaller one goes next.","A dummy head avoids special cases."],
  a:"Dummy + tail. Attach the smaller head each time; attach leftovers.",
  c: LL + `
function merge(a, b) {
  const dummy = new ListNode(0); let t = dummy;
  while (a && b) {
    if (a.val <= b.val) { t.next = a; a = a.next; } else { t.next = b; b = b.next; }
    t = t.next;
  }
  t.next = a || b;
  return dummy.next;
}
console.log(show(merge(build([1, 2, 4]), build([1, 3, 4]))));`, tc:"O(n + m)", sc:"O(1)", f:["Merge k sorted lists (heap)","Recursive version"] },
{ id:"linked-list-cycle", t:"Linked List Cycle", d:"E", topic:"linked-list", pat:"fast-slow", co:["Amazon","Microsoft","Goldman Sachs"], lc:"linked-list-cycle",
  s:"Return true if the linked list has a cycle.", eg:"3→2→0→-4→(back to 2) → true",
  h:["A Set of visited nodes works in O(n) space. Can you do O(1)?","A faster runner on a circular track always laps the slower one."],
  a:"Floyd's tortoise and hare. If fast ever equals slow, there's a cycle.",
  c: LL + `
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
const h = build([3, 2, 0, -4]);
h.next.next.next.next = h.next; // create cycle
console.log(hasCycle(h));
console.log(hasCycle(build([1, 2])));`, tc:"O(n)", sc:"O(1)", f:["Return the node where the cycle begins","Happy number (cycle in number sequence)"] },
{ id:"remove-nth", t:"Remove Nth Node From End", d:"M", topic:"linked-list", pat:"two-pointers", co:["Meta","Amazon"], lc:"remove-nth-node-from-end-of-list",
  s:"Remove the n-th node from the end of the list in one pass.", eg:"1→2→3→4→5, n = 2 → 1→2→3→5",
  h:["Give one pointer an n-step head start.","When the leader hits the end, the follower is right before the target."],
  a:"Dummy node. Move fast n+1 steps, then move both until fast is null. slow.next is the node to remove.",
  c: LL + `
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast) { fast = fast.next; slow = slow.next; }
  slow.next = slow.next.next;
  return dummy.next;
}
console.log(show(removeNthFromEnd(build([1, 2, 3, 4, 5]), 2)));
console.log(show(removeNthFromEnd(build([1]), 1)));`, tc:"O(n)", sc:"O(1)", f:["Why is the dummy node needed when n = length?"] },
{ id:"valid-parentheses", t:"Valid Parentheses", d:"E", topic:"stack", pat:"recursion", co:["Amazon","Google","Meta","Bloomberg"], lc:"valid-parentheses",
  s:"Given a string of ()[]{}, determine if brackets are closed in the correct order.", eg:"\"()[]{}\" → true, \"(]\" → false",
  h:["The most recent unmatched opener must be closed first.","That 'most recent first' order is a stack."],
  a:"Push openers; on a closer, pop and compare. Stack must be empty at the end.",
  c:`function isValid(s) {
  const pair = { ")": "(", "]": "[", "}": "{" }, st = [];
  for (const c of s) {
    if (!pair[c]) st.push(c);
    else if (st.pop() !== pair[c]) return false;
  }
  return st.length === 0;
}
console.log(isValid("()[]{}"));
console.log(isValid("(]"));
console.log(isValid("{[()]}"));`, tc:"O(n)", sc:"O(n)", f:["Minimum additions to make valid","Longest valid parentheses (hard)"] },
{ id:"min-stack", t:"Min Stack", d:"M", topic:"stack", pat:"monotonic-stack", co:["Amazon","Bloomberg","Microsoft"], lc:"min-stack",
  s:"Design a stack with push, pop, top and getMin, all in O(1).", eg:"push -2, push 0, push -3, getMin → -3, pop, getMin → -2",
  h:["What was the minimum when each element was pushed?","Store that minimum alongside each value."],
  a:"Each stack entry stores [value, minSoFar]. getMin reads the top's minSoFar.",
  c:`class MinStack {
  constructor() { this.st = []; }
  push(x) {
    const min = this.st.length ? Math.min(x, this.getMin()) : x;
    this.st.push([x, min]);
  }
  pop() { this.st.pop(); }
  top() { return this.st[this.st.length - 1][0]; }
  getMin() { return this.st[this.st.length - 1][1]; }
}
const ms = new MinStack();
ms.push(-2); ms.push(0); ms.push(-3);
console.log(ms.getMin());
ms.pop();
console.log(ms.top(), ms.getMin());`, tc:"O(1) each", sc:"O(n)", f:["Use a second stack that only stores new minimums","Max stack with popMax"] },
{ id:"daily-temperatures", t:"Daily Temperatures", d:"M", topic:"stack", pat:"monotonic-stack", co:["Meta","Amazon","Google"], lc:"daily-temperatures",
  s:"For each day, return how many days until a warmer temperature (0 if none).", eg:"[73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0]",
  h:["'Next warmer' = next greater element.","Keep indexes of unresolved days in a decreasing stack."],
  a:"Monotonic decreasing stack of indexes. A warmer day pops and resolves colder days.",
  c:`function dailyTemperatures(t) {
  const ans = Array(t.length).fill(0), st = [];
  for (let i = 0; i < t.length; i++) {
    while (st.length && t[i] > t[st[st.length - 1]]) {
      const j = st.pop(); ans[j] = i - j;
    }
    st.push(i);
  }
  return ans;
}
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));`, tc:"O(n)", sc:"O(n)", f:["Next greater element in a circular array","Stock span problem"] },
{ id:"eval-rpn", t:"Evaluate Reverse Polish Notation", d:"M", topic:"stack", pat:"recursion", co:["LinkedIn","Amazon"], lc:"evaluate-reverse-polish-notation",
  s:"Evaluate an arithmetic expression in postfix notation. Division truncates toward zero.", eg:"[\"2\",\"1\",\"+\",\"3\",\"*\"] → 9",
  h:["Numbers wait until an operator arrives.","The operator applies to the two most recent numbers."],
  a:"Stack of numbers; operator pops b then a, pushes a op b.",
  c:`function evalRPN(tokens) {
  const st = [];
  const ops = { "+": (a, b) => a + b, "-": (a, b) => a - b, "*": (a, b) => a * b, "/": (a, b) => Math.trunc(a / b) };
  for (const t of tokens) {
    if (ops[t]) { const b = st.pop(), a = st.pop(); st.push(ops[t](a, b)); }
    else st.push(Number(t));
  }
  return st[0];
}
console.log(evalRPN(["2", "1", "+", "3", "*"]));
console.log(evalRPN(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]));`, tc:"O(n)", sc:"O(n)", f:["Convert infix to postfix (shunting yard)","Basic calculator with parentheses"] },
{ id:"level-order", t:"Binary Tree Level Order Traversal", d:"M", topic:"trees", pat:"bfs", co:["Amazon","Meta","Microsoft"], lc:"binary-tree-level-order-traversal",
  s:"Return node values level by level, left to right.", eg:"[3,9,20,null,null,15,7] → [[3],[9,20],[15,7]]",
  h:["Which data structure processes nodes in the order they were discovered?","How do you know where one level ends?"],
  a:"BFS with a queue; snapshot the queue size at the start of each level.",
  c: TR + `
function levelOrder(root) {
  if (!root) return [];
  const res = [], q = [root]; let h = 0;
  while (h < q.length) {
    const size = q.length - h, level = [];
    for (let i = 0; i < size; i++) {
      const n = q[h++]; level.push(n.val);
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
    res.push(level);
  }
  return res;
}
console.log(levelOrder(buildTree([3, 9, 20, null, null, 15, 7])));`, tc:"O(n)", sc:"O(w)", f:["Zigzag level order","Right side view","Average of each level"] },
{ id:"rotting-oranges", t:"Rotting Oranges", d:"M", topic:"queue", pat:"bfs", co:["Amazon","Microsoft"], lc:"rotting-oranges",
  s:"Each minute, rotten oranges (2) rot adjacent fresh ones (1). Return minutes until none are fresh, or -1.", eg:"[[2,1,1],[1,1,0],[0,1,1]] → 4",
  h:["All rotten oranges spread at the same time: start BFS from all of them together.","Count fresh oranges to know when you're done."],
  a:"Multi-source BFS. Process the queue level by level; each level is one minute.",
  c:`function orangesRotting(g) {
  const R = g.length, C = g[0].length, q = [];
  let fresh = 0, minutes = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (g[r][c] === 2) q.push([r, c]);
    if (g[r][c] === 1) fresh++;
  }
  let h = 0;
  while (h < q.length && fresh > 0) {
    const size = q.length - h;
    for (let i = 0; i < size; i++) {
      const [r, c] = q[h++];
      for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nc >= 0 && nr < R && nc < C && g[nr][nc] === 1) {
          g[nr][nc] = 2; fresh--; q.push([nr, nc]);
        }
      }
    }
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}
console.log(orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]));
console.log(orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]]));`, tc:"O(R · C)", sc:"O(R · C)", f:["Walls and gates","01 matrix (distance to nearest 0)"] },
{ id:"number-of-islands", t:"Number of Islands", d:"M", topic:"queue", pat:"dfs", co:["Amazon","Google","Meta","Microsoft"], lc:"number-of-islands",
  s:"Count groups of connected '1's (land) in a grid, connecting up/down/left/right.", eg:"grid with 3 separate land groups → 3",
  h:["Each time you find unvisited land, that's a new island.","Flood-fill the whole island so you don't count it again."],
  a:"Scan cells. On '1', count++ and DFS to sink all connected land to '0'.",
  c:`function numIslands(grid) {
  const R = grid.length, C = grid[0].length;
  const sink = (r, c) => {
    if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] !== "1") return;
    grid[r][c] = "0";
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  let count = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (grid[r][c] === "1") { count++; sink(r, c); }
  }
  return count;
}
console.log(numIslands([
  ["1", "1", "0", "0", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "1", "0", "0"],
  ["0", "0", "0", "1", "1"]
]));`, tc:"O(R · C)", sc:"O(R · C) worst stack", f:["Max area of island","Do it with BFS or Union-Find","Count distinct island shapes"] },
{ id:"fibonacci", t:"Fibonacci Number", d:"E", topic:"recursion", pat:"dp", co:["Amazon","Apple"], lc:"fibonacci-number",
  s:"Return F(n) where F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).", eg:"n = 10 → 55",
  h:["Naive recursion recomputes the same values. How many times is F(2) computed for F(10)?","Remember answers, or build up from the bottom with two variables."],
  a:"Bottom-up with two variables: O(n) time, O(1) space.",
  c:`function fib(n) {
  if (n < 2) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
console.log(fib(10));
console.log(fib(30));`, tc:"O(n)", sc:"O(1)", f:["Draw the recursion tree of naive fib(5)","O(log n) with matrix exponentiation"] },
{ id:"climbing-stairs", t:"Climbing Stairs", d:"E", topic:"recursion", pat:"dp", co:["Amazon","Adobe","Apple"], lc:"climbing-stairs",
  s:"You can climb 1 or 2 steps at a time. How many distinct ways to reach step n?", eg:"n = 3 → 3 (1+1+1, 1+2, 2+1)",
  h:["The last move was either 1 step or 2 steps.","ways(n) = ways(n-1) + ways(n-2). Looks familiar?"],
  a:"It's Fibonacci shifted. Iterate with two variables.",
  c:`function climbStairs(n) {
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
console.log(climbStairs(3));
console.log(climbStairs(5));`, tc:"O(n)", sc:"O(1)", f:["Steps of size 1, 2 or 3","Min cost climbing stairs"] },
{ id:"power-of-two", t:"Power of Two", d:"E", topic:"recursion", pat:"bit-manipulation", co:["Google","Amazon"], lc:"power-of-two",
  s:"Return true if n is a power of two.", eg:"16 → true, 6 → false",
  h:["Recursive: n is a power of 2 if n === 1, or n is even and n/2 is a power of 2.","Bit trick: powers of two have exactly one bit set."],
  a:"n > 0 && (n & (n - 1)) === 0. Recursive version shown too.",
  c:`const isPow2Rec = n => n === 1 || (n > 0 && n % 2 === 0 && isPow2Rec(n / 2));
const isPow2Bit = n => n > 0 && (n & (n - 1)) === 0;
console.log(isPow2Rec(16), isPow2Rec(6));
console.log(isPow2Bit(1024), isPow2Bit(0));`, tc:"O(log n) / O(1)", sc:"O(log n) / O(1)", f:["Power of three / four"] },
{ id:"subsets", t:"Subsets", d:"M", topic:"recursion", pat:"backtracking", co:["Meta","Amazon","Bloomberg"], lc:"subsets",
  s:"Return all subsets of an array of distinct integers.", eg:"[1,2,3] → [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]] (any order)",
  h:["Each element is either in or out.","Recurse on index; at each index branch on take / skip."],
  a:"Backtracking: at index i, record the current path, then try adding each later element.",
  c:`function subsets(nums) {
  const res = [], path = [];
  (function bt(start) {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      bt(i + 1);
      path.pop();
    }
  })(0);
  return res;
}
console.log(subsets([1, 2, 3]));`, tc:"O(n · 2ⁿ)", sc:"O(n)", f:["Subsets II with duplicates","Bitmask version"] },
{ id:"permutations", t:"Permutations", d:"M", topic:"recursion", pat:"backtracking", co:["Microsoft","Meta","LinkedIn"], lc:"permutations",
  s:"Return all permutations of distinct integers.", eg:"[1,2,3] → 6 permutations",
  h:["Build the permutation position by position.","Track which numbers are already used."],
  a:"Backtracking with a used[] array. When path length = n, record a copy.",
  c:`function permute(nums) {
  const res = [], path = [], used = Array(nums.length).fill(false);
  (function bt() {
    if (path.length === nums.length) { res.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      bt();
      path.pop(); used[i] = false;
    }
  })();
  return res;
}
console.log(permute([1, 2, 3]));`, tc:"O(n · n!)", sc:"O(n)", f:["Permutations II with duplicates","Next permutation"] },
{ id:"max-depth", t:"Maximum Depth of Binary Tree", d:"E", topic:"trees", pat:"tree-traversal", co:["Amazon","LinkedIn","Apple"], lc:"maximum-depth-of-binary-tree",
  s:"Return the number of nodes along the longest root-to-leaf path.", eg:"[3,9,20,null,null,15,7] → 3",
  h:["If you knew the depth of each subtree…","depth = 1 + max(left, right)."],
  a:"Postorder recursion; empty tree has depth 0.",
  c: TR + `
const maxDepth = n => n ? 1 + Math.max(maxDepth(n.left), maxDepth(n.right)) : 0;
console.log(maxDepth(buildTree([3, 9, 20, null, null, 15, 7])));`, tc:"O(n)", sc:"O(h)", f:["Minimum depth (careful with one-child nodes)","Iterative BFS version"] },
{ id:"invert-tree", t:"Invert Binary Tree", d:"E", topic:"trees", pat:"tree-traversal", co:["Google","Amazon"], lc:"invert-binary-tree",
  s:"Mirror the tree: swap every node's left and right children.", eg:"[4,2,7,1,3,6,9] → [4,7,2,9,6,3,1]",
  h:["What needs to happen at a single node?","Swap children, then do the same for each subtree."],
  a:"Recursively invert both subtrees and swap them.",
  c: TR + `
function invert(n) {
  if (!n) return null;
  [n.left, n.right] = [invert(n.right), invert(n.left)];
  return n;
}
function levels(root) { const o = [], q = [root]; for (let h = 0; h < q.length; h++) { const n = q[h]; if (n) { o.push(n.val); q.push(n.left, n.right); } } return o; }
console.log(levels(invert(buildTree([4, 2, 7, 1, 3, 6, 9]))));`, tc:"O(n)", sc:"O(h)", f:["Check if a tree is symmetric"] },
{ id:"same-tree", t:"Same Tree", d:"E", topic:"trees", pat:"tree-traversal", co:["Amazon","Bloomberg"], lc:"same-tree",
  s:"Return true if two binary trees are structurally identical with equal values.", eg:"[1,2,3] vs [1,2,3] → true",
  h:["Compare roots, then compare left with left and right with right.","Handle nulls first."],
  a:"Recursive: both null → true; one null or values differ → false; else recurse both sides.",
  c: TR + `
function isSame(a, b) {
  if (!a && !b) return true;
  if (!a || !b || a.val !== b.val) return false;
  return isSame(a.left, b.left) && isSame(a.right, b.right);
}
console.log(isSame(buildTree([1, 2, 3]), buildTree([1, 2, 3])));
console.log(isSame(buildTree([1, 2]), buildTree([1, null, 2])));`, tc:"O(n)", sc:"O(h)", f:["Subtree of another tree"] },
{ id:"validate-bst", t:"Validate Binary Search Tree", d:"M", topic:"trees", pat:"tree-traversal", co:["Amazon","Meta","Microsoft","Bloomberg"], lc:"validate-binary-search-tree",
  s:"Determine if a tree is a valid BST (every left subtree < node < every right subtree).", eg:"[5,1,4,null,null,3,6] → false",
  h:["Checking only a node's direct children is not enough. Why?","Pass down a valid range (min, max)."],
  a:"Recursive with bounds, or check inorder traversal is strictly increasing.",
  c: TR + `
function isValidBST(n, lo = -Infinity, hi = Infinity) {
  if (!n) return true;
  if (n.val <= lo || n.val >= hi) return false;
  return isValidBST(n.left, lo, n.val) && isValidBST(n.right, n.val, hi);
}
console.log(isValidBST(buildTree([2, 1, 3])));
console.log(isValidBST(buildTree([5, 1, 4, null, null, 3, 6])));`, tc:"O(n)", sc:"O(h)", f:["Kth smallest element in a BST","Recover a BST with two swapped nodes"] },
{ id:"lca-bst", t:"Lowest Common Ancestor of a BST", d:"M", topic:"trees", pat:"tree-traversal", co:["Meta","Amazon","Microsoft"], lc:"lowest-common-ancestor-of-a-binary-search-tree",
  s:"Find the lowest node that has both p and q as descendants in a BST.", eg:"root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8 → 6",
  h:["If both values are smaller than the node, where must the LCA be?","The first node where p and q split sides is the answer."],
  a:"Walk from the root: go left if both smaller, right if both bigger, else return the current node.",
  c: TR + `
function lca(root, p, q) {
  let n = root;
  while (n) {
    if (p < n.val && q < n.val) n = n.left;
    else if (p > n.val && q > n.val) n = n.right;
    else return n.val;
  }
}
const root = buildTree([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]);
console.log(lca(root, 2, 8));
console.log(lca(root, 2, 4));`, tc:"O(h)", sc:"O(1)", f:["LCA in a general binary tree (not BST)"] },
{ id:"merge-intervals", t:"Merge Intervals", d:"M", topic:"arrays", pat:"merge-intervals", co:["Google","Meta","Bloomberg","Microsoft"], lc:"merge-intervals",
  s:"Merge all overlapping intervals.", eg:"[[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]",
  h:["Overlaps are easy to see once intervals are sorted by…?","Compare each interval only with the last merged one."],
  a:"Sort by start. If cur.start ≤ last.end, extend last.end; else push cur.",
  c:`function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [s, e] of intervals) {
    const last = out[out.length - 1];
    if (last && s <= last[1]) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
  }
  return out;
}
console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]]));`, tc:"O(n log n)", sc:"O(n)", f:["Insert interval","Meeting rooms II (minimum rooms)"] },
{ id:"kth-largest", t:"Kth Largest Element in an Array", d:"M", topic:"arrays", pat:"top-k", co:["Meta","Amazon","Spotify"], lc:"kth-largest-element-in-an-array",
  s:"Return the k-th largest element (in sorted order, not distinct).", eg:"[3,2,1,5,6,4], k = 2 → 5",
  h:["Sorting is O(n log n). Can you avoid sorting everything?","Quickselect partitions around a pivot and recurses into one side only."],
  a:"Quickselect: average O(n). Target index is n - k in ascending order.",
  c:`function findKthLargest(nums, k) {
  const target = nums.length - k;
  let lo = 0, hi = nums.length - 1;
  while (true) {
    const pivot = nums[hi];
    let p = lo;
    for (let i = lo; i < hi; i++) {
      if (nums[i] <= pivot) { [nums[i], nums[p]] = [nums[p], nums[i]]; p++; }
    }
    [nums[p], nums[hi]] = [nums[hi], nums[p]];
    if (p === target) return nums[p];
    if (p < target) lo = p + 1; else hi = p - 1;
  }
}
console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2));
console.log(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4));`, tc:"O(n) avg", sc:"O(1)", f:["Min-heap of size k: O(n log k)","Randomise the pivot to avoid O(n²)"] },
{ id:"single-number", t:"Single Number", d:"E", topic:"hashing", pat:"bit-manipulation", co:["Amazon","Airbnb"], lc:"single-number",
  s:"Every element appears twice except one. Find it in O(n) time and O(1) space.", eg:"[4,1,2,1,2] → 4",
  h:["A Set works but uses O(n) space.","x ^ x = 0 and x ^ 0 = x."],
  a:"XOR everything; pairs cancel out.",
  c:`const singleNumber = nums => nums.reduce((acc, x) => acc ^ x, 0);
console.log(singleNumber([4, 1, 2, 1, 2]));
console.log(singleNumber([2, 2, 1]));`, tc:"O(n)", sc:"O(1)", f:["Every element appears three times except one","Two numbers appear once"] },
{ id:"house-robber", t:"House Robber", d:"M", topic:"recursion", pat:"dp", co:["Amazon","Google","Cisco"], lc:"house-robber",
  s:"Maximise money robbed from houses in a row without robbing two adjacent houses.", eg:"[2,7,9,3,1] → 12",
  h:["At house i: rob it (plus best up to i-2) or skip it (best up to i-1).","You only need the last two answers."],
  a:"dp[i] = max(dp[i-1], dp[i-2] + nums[i]) with two rolling variables.",
  c:`function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const x of nums) {
    const cur = Math.max(prev1, prev2 + x);
    prev2 = prev1; prev1 = cur;
  }
  return prev1;
}
console.log(rob([1, 2, 3, 1]));
console.log(rob([2, 7, 9, 3, 1]));`, tc:"O(n)", sc:"O(1)", f:["Houses in a circle","Houses on a binary tree"] },
{ id:"coin-change", t:"Coin Change", d:"M", topic:"recursion", pat:"dp", co:["Amazon","Google","Goldman Sachs"], lc:"coin-change",
  s:"Minimum number of coins to make the amount, or -1 if impossible.", eg:"coins = [1,2,5], amount = 11 → 3",
  h:["Greedy (take biggest coin) fails for coins like [1,3,4] and amount 6.","dp[a] = 1 + min over coins of dp[a - coin]."],
  a:"Bottom-up DP from 0 to amount.",
  c:`function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
console.log(coinChange([1, 2, 5], 11));
console.log(coinChange([2], 3));
console.log(coinChange([1, 3, 4], 6));`, tc:"O(amount · coins)", sc:"O(amount)", f:["Number of ways to make the amount (Coin Change II)"] }
];
