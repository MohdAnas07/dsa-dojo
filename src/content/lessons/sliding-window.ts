import type { Lesson } from "@/lib/types";

const slidingWindow: Lesson = {
  what: "Sliding Window is a technique for problems about contiguous subarrays or substrings. You keep a \"window\" [left, right] and slide it along, updating the answer in O(1) per step instead of recomputing from scratch.",
  analogy: { short: "A train window", text: "Sitting on a train, you see a fixed stretch of landscape through the window. As the train moves, one tree leaves on the left and one enters on the right. You don't re-look at the whole view; you just notice what came in and what went out." },
  eli5: "You want the biggest total of any 3 numbers in a row. Instead of adding 3 numbers again and again, add the new number coming in and take away the one leaving. Like a caterpillar crawling along.",
  tech: "Maintain an invariant over s[left..right]. Fixed-size windows move both ends together. Variable-size windows expand right until the invariant breaks, then shrink left until it holds again. Each index enters and leaves at most once, so total work is O(n).",
  why: "Brute force looks at every subarray: O(n²) or O(n³). Neighbouring windows overlap almost completely, so recomputing is wasted work. Sliding reuses the overlap.",
  how: ["Expand: move right forward and add s[right] to the window state.", "Check: is the window still valid (sum ≤ k, no duplicates, …)?", "Shrink: while invalid, remove s[left] and move left forward.", "Record the answer (max length, min length, count) when valid.", "Fixed window: once size hits k, remove the leftmost each time you add."],
  props: ["Only for contiguous ranges", "Window state: sum, count map, set, or deque", "Fixed or variable size", "O(n) time: left and right each move at most n times"],
  use: ["Max/min sum of k consecutive elements", "Longest/shortest substring with a condition", "Count subarrays with a property (positive numbers)", "Anagram / permutation in a string"],
  avoid: ["Subsequences (not contiguous): think DP", "Arrays with negative numbers when the condition is a sum (window isn't monotonic): use prefix sums + map"],
  viz: "window",
  cx: [["Fixed window of size k", "O(n)", "Each step adds one and removes one element."], ["Variable window", "O(n)", "left only moves forward; total moves of left + right ≤ 2n. The inner while loop does not make it O(n²)."], ["Brute force all subarrays", "O(n²)", "n starts × n ends."], ["Space", "O(1) or O(k)", "A sum is O(1); a character map is O(alphabet)."]],
  space: "O(1) for sums, O(k) or O(alphabet) for maps.",
  brute: { title: "Brute force: sum every window from scratch", c: `function maxSumK(arr, k) {
  let best = -Infinity;
  for (let i = 0; i + k <= arr.length; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) sum += arr[j];
    best = Math.max(best, sum);
  }
  return best;
}
console.log(maxSumK([2, 1, 5, 1, 3, 2], 3));`, time: "O(n · k)", space: "O(1)" },
  code: {
    c: `// Fixed window: max sum of k consecutive elements
function maxSumK(arr, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += arr[i];
  let best = sum;
  for (let right = k; right < arr.length; right++) {
    sum += arr[right] - arr[right - k];
    best = Math.max(best, sum);
  }
  return best;
}
console.log(maxSumK([2, 1, 5, 1, 3, 2], 3));`,
    hl: [7],
    ex: { 4: "Build the first window of size k.", 7: "Slide: add the element entering on the right, subtract the one leaving on the left. O(1) per step." }
  },
  examples: [
    { lvl: "Easy", title: "Maximum sum of K consecutive elements", prob: "Return the largest sum of any k adjacent numbers.", idea: "Fixed window. Add the new element, drop the old one.", c: `function maxSum(arr, k) {
  let sum = 0, best = -Infinity;
  for (let r = 0; r < arr.length; r++) {
    sum += arr[r];
    if (r >= k) sum -= arr[r - k];
    if (r >= k - 1) best = Math.max(best, sum);
  }
  return best;
}
console.log(maxSum([4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 3));`, time: "O(n)", space: "O(1)" },
    { lvl: "Practical", title: "Longest substring without repeating characters", prob: "Length of the longest substring with all unique characters.", idea: "Variable window. Remember the last index of each character. If the new character was seen inside the window, jump left past it.", c: `function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) {
      left = last.get(ch) + 1;
    }
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
console.log(lengthOfLongestSubstring("abcabcbb"));
console.log(lengthOfLongestSubstring("pwwkew"));`, time: "O(n)", space: "O(alphabet)", ex: { 6: "Only a duplicate INSIDE the window matters. An old index before left is irrelevant.", 10: "Window length is right - left + 1." } },
    { lvl: "Interview", title: "Minimum window substring", prob: "Smallest substring of s containing every character of t (with counts).", idea: "Expand right until the window covers all of t. Then shrink from the left as long as it still covers, recording the smallest. 'missing' tracks how many characters are still needed.", c: `function minWindow(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  let missing = t.length, left = 0, start = 0, len = Infinity;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (need.has(c)) {
      if (need.get(c) > 0) missing--;
      need.set(c, need.get(c) - 1);
    }
    while (missing === 0) {
      if (right - left + 1 < len) { len = right - left + 1; start = left; }
      const d = s[left++];
      if (need.has(d)) {
        need.set(d, need.get(d) + 1);
        if (need.get(d) > 0) missing++;
      }
    }
  }
  return len === Infinity ? "" : s.slice(start, start + len);
}
console.log(minWindow("ADOBECODEBANC", "ABC"));`, time: "O(|s| + |t|)", space: "O(alphabet)" }
  ],
  signals: [["\"contiguous subarray / substring\"", "Sliding window"], ["\"longest / shortest … such that\"", "Variable window"], ["\"of size k\" / \"k consecutive\"", "Fixed window"], ["\"at most k distinct\"", "Window + count map"], ["\"max of each window\"", "Window + monotonic deque"]],
  mistakes: [["Using if instead of while when shrinking", "The window may need to shrink several steps; use while (invalid)."], ["Wrong length formula", "Window length = right - left + 1."], ["Applying it to sums with negative numbers", "Shrinking no longer guarantees a smaller sum. Use prefix sum + Map."], ["Forgetting a jump-left guard (last index < left)", "An old occurrence outside the window must be ignored."]],
  js: ["Map is ideal for character counts in a window; delete keys when count hits 0 if you need map.size as 'distinct count'."],
  iq: { Beginner: ["Average of every k-length subarray"], Easy: ["max-avg-subarray", "best-time-stock"], Medium: ["longest-substring", "Longest repeating character replacement", "Permutation in string"], Hard: ["min-window-substring", "Sliding window maximum"] },
  rev: { s30: "Contiguous + longest/shortest/size k → sliding window. Expand right, shrink left while invalid, record answer. Each element enters and leaves once → O(n).", m2: ["Fixed: sum += in - out", "Variable: for right… while (invalid) left++", "Length = right - left + 1", "Doesn't work for sums with negatives"] },
  cheat: `SLIDING WINDOW CHEAT SHEET

let left = 0
for (right = 0; right < n; right++) {
  add(s[right])
  while (window invalid) remove(s[left++])
  answer = best(answer, right - left + 1)
}

Think Sliding Window when:
→ contiguous subarray / substring
→ longest / shortest
→ fixed window (size k)
→ variable window (condition)

Time O(n)  Space O(k)`
};

export default slidingWindow;
