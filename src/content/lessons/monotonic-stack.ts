import type { Lesson } from "@/lib/types";

const monotonicStack: Lesson = {
  what: "A monotonic stack is a stack whose values are always kept in increasing (or decreasing) order. When a new value would break the order, you pop values first, and each pop answers a question like 'what is the next greater element?'",
  analogy: { short: "People in a line looking for someone taller", text: "Everyone in a queue wants to know the first taller person behind them. When a tall person arrives, every shorter person still waiting finally gets their answer and leaves; the tall person then waits too. That waiting crowd is the monotonic stack." },
  eli5: "Kids wait in a pile for someone taller to show up. When a tall kid arrives, all the shorter kids on top of the pile shout 'found one!' and leave.",
  tech: "Keep a stack of indices whose answer isn't known yet, with values in decreasing order (for 'next greater'). For each new index i, pop while nums[i] is greater than the value at the top; the popped index's answer is i (or nums[i]). Then push i. Each index is pushed once and popped at most once, so the loop runs in O(n) even though it looks nested. Flip the comparison for 'next smaller', and scan from the right (or for previous elements) as needed. Storing indices lets you compute distances and widths, as in Daily Temperatures and Largest Rectangle in Histogram.",
  why: "'Next greater / smaller', 'how many days until', 'span of', and histogram problems have an O(n²) brute force that a monotonic stack makes O(n). It's a classic interview pattern that's easy once you recognise it.",
  how: ["Decide what you're looking for: the next greater or next smaller element.", "Scan left to right with a stack of indices still waiting for their answer.", "While the current value beats the top's value: pop it and record its answer.", "Push the current index.", "Indices left on the stack never found an answer (use −1 or 0)."],
  props: ["Values on the stack stay sorted", "Each index pushed and popped at most once: O(n)", "Store indices, not values", "Increasing stack ↔ next smaller; decreasing stack ↔ next greater"],
  use: ["Next greater / smaller element", "Days until warmer / stock span", "Largest rectangle in a histogram or matrix", "Removing digits to make the smallest number", "Sum of subarray minimums"],
  avoid: ["Range minimum queries in arbitrary ranges (sparse table / segment tree)", "Sliding window maximum (use a monotonic deque)"],
  viz: "stack",
  cx: [["Whole scan", "O(n)", "Each index enters and leaves the stack once."], ["Brute force", "O(n²)", "For each element, scan to the right."], ["Space", "O(n)", "The stack in the worst case."]],
  space: "O(n).",
  code: {
    c: `function nextGreater(nums) {
  const ans = new Array(nums.length).fill(-1);
  const stack = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      ans[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return ans;
}
console.log(nextGreater([2, 1, 2, 4, 3]));
console.log(nextGreater([5, 4, 3, 2, 1]));`,
    hl: [5, 8],
    ex: { 5: "The current value is the answer for every smaller value still waiting.", 6: "Pop and record: this index is done.", 8: "Store indices; the values on the stack stay in decreasing order.", 13: "Strictly decreasing input: nobody ever finds a greater element." }
  },
  brute: { title: "Brute force: scan right for every element", c: `function nextGreaterBrute(nums) {
  return nums.map((x, i) => {
    for (let j = i + 1; j < nums.length; j++) if (nums[j] > x) return nums[j];
    return -1;
  });
}
console.log(nextGreaterBrute([2, 1, 2, 4, 3]));`, time: "O(n²)", space: "O(1)", ex: { 3: "Rescans the same elements again and again." } },
  examples: [
    { lvl: "Easy", title: "Next greater element I", prob: "For each value of nums1, find the next greater value to its right in nums2.", idea: "One monotonic-stack pass over nums2 fills a map value → next greater; then look up nums1.", c: `function nextGreaterElement(nums1, nums2) {
  const next = new Map(), stack = [];
  for (const x of nums2) {
    while (stack.length && x > stack[stack.length - 1]) next.set(stack.pop(), x);
    stack.push(x);
  }
  return nums1.map(x => next.get(x) ?? -1);
}
console.log(nextGreaterElement([4, 1, 2], [1, 3, 4, 2]));`, time: "O(n + m)", space: "O(m)", ex: { 4: "Values are unique here, so storing values instead of indices works.", 7: "?? -1: no greater element was found." } },
    { lvl: "Practical", title: "Daily temperatures", prob: "For each day, how many days until a warmer temperature?", idea: "The answer is a distance, so store indices. A warmer day pops every colder day still waiting and sets their wait.", c: `function dailyTemperatures(t) {
  const ans = new Array(t.length).fill(0), stack = [];
  for (let i = 0; i < t.length; i++) {
    while (stack.length && t[i] > t[stack[stack.length - 1]]) {
      const j = stack.pop();
      ans[j] = i - j;
    }
    stack.push(i);
  }
  return ans;
}
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));`, time: "O(n)", space: "O(n)", ex: { 6: "Distance between the warmer day and the waiting day." } },
    { lvl: "Interview", title: "Largest rectangle in a histogram", prob: "Find the largest rectangle that fits under a histogram.", idea: "Keep bars in increasing height. When a shorter bar arrives, the popped bar can't extend further right; its left limit is the bar below it on the stack. A final height 0 flushes the stack.", c: `function largestRectangleArea(heights) {
  const stack = [];
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];
    while (stack.length && h < heights[stack[stack.length - 1]]) {
      const height = heights[stack.pop()];
      const left = stack.length ? stack[stack.length - 1] + 1 : 0;
      best = Math.max(best, height * (i - left));
    }
    stack.push(i);
  }
  return best;
}
console.log(largestRectangleArea([2, 1, 5, 6, 2, 3]), largestRectangleArea([2, 4]));`, time: "O(n)", space: "O(n)", ex: { 5: "A virtual bar of height 0 at the end pops everything left.", 8: "The rectangle spans from just after the previous smaller bar…", 9: "…up to just before the current (smaller) bar." } }
  ],
  signals: [["\"next greater / smaller element\"", "Monotonic stack"], ["\"how many days until\", \"span\"", "Monotonic stack of indices"], ["\"largest rectangle\" (histogram or matrix rows)", "Increasing stack with a final 0"], ["\"remove k digits to make the smallest number\"", "Increasing stack, pop while bigger"], ["maximum of every sliding window", "Monotonic deque (a close cousin)"]],
  mistakes: [["Storing values when you need distances", "Store indices; read values via nums[index]."], ["Using the wrong comparison", "Decreasing stack for 'next greater', increasing for 'next smaller'; decide on > vs ≥ for ties."], ["Forgetting the elements left on the stack", "They have no answer (−1 / 0), or flush them with a sentinel."], ["Thinking it's O(n²)", "Each element is popped at most once, so the total work is O(n)."]],
  js: ["stack[stack.length - 1] (or stack.at(-1)) reads the top.", "?? -1 gives a default when the map has no entry."],
  iq: { Beginner: ["Find the next greater element for each number"], Easy: ["next-greater-element-i"], Medium: ["daily-temperatures", "next-greater-element-ii", "online-stock-span", "remove-k-digits", "sum-subarray-minimums", "pattern-132"], Hard: ["largest-rectangle-histogram", "maximal-rectangle", "trapping-rain-water"] },
  rev: { s30: "Keep a stack of indices with sorted values. A new value pops everything it beats, answering their 'next greater/smaller'. Each index is pushed and popped once: O(n).", m2: ["Store indices", "Next greater → decreasing stack", "Next smaller → increasing stack", "Pop = answer found", "Sentinel 0 flushes the histogram stack"] },
  cheat: `MONOTONIC STACK CHEAT SHEET

ans = [-1…]; st = []
for i:
  while st && a[i] > a[top]:
    ans[st.pop()] = a[i]      // or i - idx
  st.push(i)

> : next greater (decreasing stack)
< : next smaller (increasing stack)
O(n): each index pushed/popped once
Histogram: push sentinel height 0 at the end`
};

export default monotonicStack;
