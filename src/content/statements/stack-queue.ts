import type { Statement } from "./types";

export const STACK_QUEUE_STATEMENTS: Record<string, Statement> = {
  "next-greater-element-i": {
    body: [
      "The next greater element of some element x in an array is the first element to the right of x in the same array that is greater than x.",
      "You are given two distinct integer arrays `nums1` and `nums2`, where nums1 is a subset of nums2. For each nums1[i], find it in nums2 and return its next greater element there, or −1 if there is none."
    ],
    why: [
      "4: nothing to its right in nums2 is bigger → −1. 1: the first bigger value to its right is 3. 2: nothing to its right → −1.",
      "2 → 3. 4 is the last element → −1."
    ],
    walk: [
      "Scan nums2 = [1, 3, 4, 2] with a stack of values still waiting for a bigger one.",
      "1: push. 3 is bigger than 1 → next(1) = 3; push 3.",
      "4 is bigger than 3 → next(3) = 4; push 4. 2: push.",
      "4 and 2 never find anything bigger → −1.",
      "Look up nums1 = [4, 1, 2] → [−1, 3, −1]."
    ],
    cons: ["1 ≤ nums1.length ≤ nums2.length ≤ 1000", "0 ≤ nums1[i], nums2[i] ≤ 10⁴", "All values are unique, and every value of nums1 is in nums2."]
  },
  "next-greater-element-ii": {
    body: [
      "Given a circular integer array `nums` (the element after the last one is nums[0]), return the next greater number for every element.",
      "The next greater number of x is the first greater number found by traversing the array in order from x, wrapping around if needed. If it doesn't exist, return −1 for that element."
    ],
    why: [
      "The first 1 sees 2 next. 2 is the largest value → −1. The last 1 wraps around and finds 2.",
      "The last 3 wraps around and finds 4. 4 is the largest → −1."
    ],
    walk: [
      "Scan the array twice (indices 0 … 2n − 1, using i % n) with a stack of indices still waiting.",
      "Pass 1: 1 (index 0) waits. 2 is bigger → answer[0] = 2; index 1 waits. 1 (index 2) waits.",
      "Pass 2: 1 (index 0) is not bigger than anything waiting. 2 (index 1) is bigger than index 2's 1 → answer[2] = 2.",
      "Index 1 (value 2) is never beaten → −1. Result: [2, −1, 2]."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹"]
  },
  "largest-rectangle-histogram": {
    body: [
      "Given an array of integers `heights` representing a histogram's bar heights, where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
      "The rectangle must lie inside the bars, so its height is limited by the shortest bar it spans."
    ],
    why: [
      "The bars of height 5 and 6 together make a 2-wide rectangle of height 5: area 10.",
      "The single bar of height 4 gives 4 (2 × 2 = 4 also works)."
    ],
    walk: [
      "Keep a stack of bar indices with increasing heights. When a shorter bar arrives, pop the taller ones and measure the rectangle each popped bar can make.",
      "2 is pushed. 1 is shorter: pop 2 → area 2 × 1 = 2. Push 1, 5, 6.",
      "2 arrives: pop 6 → 6 × 1 = 6. Pop 5 → it spans indices 2–3 → 5 × 2 = 10. Push 2, 3.",
      "At the end (treat it as height 0): pop 3 → 3. Pop 2 → spans 2–5 → 2 × 4 = 8. Pop 1 → spans all 6 → 6.",
      "The largest area is 10."
    ],
    cons: ["1 ≤ heights.length ≤ 10⁵", "0 ≤ heights[i] ≤ 10⁴"]
  },
  "maximal-rectangle": {
    body: [
      "Given a rows × cols binary `matrix` filled with '0's and '1's, find the largest rectangle containing only '1's and return its area."
    ],
    why: [
      "Rows 1–2, columns 2–4 form a 2 × 3 rectangle of '1's: area 6.",
      "There are no '1's.",
      "A single '1'."
    ],
    walk: [
      "Treat each row as the base of a histogram: a column's height is how many '1's are stacked above it, ending in this row.",
      "Row 0: [1,0,1,0,0] → largest rectangle 1.",
      "Row 1: [2,0,2,1,1] → height 1 across columns 2–4 = 3.",
      "Row 2: [3,1,3,2,2] → height 2 across columns 2–4 = 6.",
      "Row 3: [4,0,0,3,0] → 4. The best is 6."
    ],
    cons: ["rows == matrix.length", "cols == matrix[i].length", "1 ≤ rows, cols ≤ 200", "matrix[i][j] is '0' or '1'."]
  },
  "online-stock-span": {
    body: [
      "Design an algorithm that collects daily price quotes for a stock and returns the span of that stock's price for the current day.",
      "The span is the number of consecutive days, going backward from today and including today, on which the price was less than or equal to today's price. Implement `StockSpanner` with `next(price)`, which receives today's price and returns its span. The example lists the calls on one line and their arguments on the next."
    ],
    why: [
      "75's span is 4: 75 and the previous 60, 70 and 60 are ≤ 75, but 80 is not. 85's span is 6: everything back to 80."
    ],
    walk: [
      "Keep a stack of [price, span]. A new price swallows every entry with price ≤ it and adds up their spans.",
      "100 → [[100,1]] → 1. 80 → 1. 60 → 1.",
      "70 swallows [60,1] → span 2. 60 → 1.",
      "75 swallows [60,1] and [70,2] → 1 + 1 + 2 = 4.",
      "85 swallows [75,4] and [80,1] → 1 + 4 + 1 = 6."
    ],
    cons: ["1 ≤ price ≤ 10⁵", "At most 10⁴ calls to next."]
  },
  "remove-k-digits": {
    body: [
      "Given a string `num` representing a non-negative integer and an integer `k`, return the smallest possible integer after removing k digits from num.",
      "Return it as a string with no leading zeros. If nothing is left, return \"0\"."
    ],
    why: [
      "Remove 4, 3 and 2 to get 1219.",
      "Remove the leading 1 to get 0200, which is written 200.",
      "Remove both digits; nothing is left, so the answer is 0."
    ],
    walk: [
      "Go left to right with a stack. While the new digit is smaller than the top and k > 0, pop the top (a bigger digit earlier makes the number bigger).",
      "1 → [1]. 4 → [1,4].",
      "3 < 4: pop 4 (k = 2) → [1,3]. 2 < 3: pop 3 (k = 1) → [1,2].",
      "2 → [1,2,2]. 1 < 2: pop 2 (k = 0) → [1,2,1]. 9 → [1,2,1,9].",
      "Result: '1219'."
    ],
    cons: ["1 ≤ k ≤ num.length ≤ 10⁵", "`num` consists of only digits.", "`num` has no leading zeros except for the zero itself."]
  },
  "asteroid-collision": {
    body: [
      "We are given an array `asteroids` of integers representing asteroids in a row. The absolute value is the asteroid's size and the sign is its direction (positive = right, negative = left). All asteroids move at the same speed.",
      "When two asteroids meet, the smaller one explodes. If both are the same size, both explode. Two asteroids moving in the same direction never meet. Return the state of the asteroids after all collisions."
    ],
    why: [
      "10 and −5 collide and −5 explodes. 5 and 10 move the same way and never meet.",
      "8 and −8 are the same size, so both explode.",
      "−5 destroys 2, then 10 destroys −5.",
      "The left-moving asteroids are already on the left, so nothing ever meets."
    ],
    walk: [
      "Use a stack of survivors.",
      "5 → [5]. 10 → [5, 10].",
      "−5 moves left and meets the top, 10. 5 < 10, so −5 explodes.",
      "Result: [5, 10]."
    ],
    cons: ["2 ≤ asteroids.length ≤ 10⁴", "-1000 ≤ asteroids[i] ≤ 1000", "asteroids[i] != 0"]
  },
  "decode-string": {
    body: [
      "Given an encoded string, return its decoded string.",
      "The encoding rule is k[encoded_string]: the encoded_string inside the square brackets is repeated exactly k times. Brackets can be nested. The input is always valid, and digits only appear as repeat counts."
    ],
    why: [
      "'a' three times, then 'bc' twice.",
      "The inner 2[c] is 'cc', so a2[c] is 'acc', repeated 3 times.",
      "'abc' twice, 'cd' three times, then 'ef'."
    ],
    walk: [
      "Keep a stack of (count, text before the bracket).",
      "Read 3, then '[': push (3, ''). Read 'a'.",
      "']': pop (3, '') → '' + 'a' × 3 = 'aaa'.",
      "Read 2, then '[': push (2, 'aaa'). Read 'bc'. ']': pop → 'aaa' + 'bcbc'.",
      "Result: 'aaabcbc'."
    ],
    cons: ["1 ≤ s.length ≤ 30", "`s` consists of lowercase English letters, digits and square brackets.", "All repeat counts are in [1, 300]."]
  },
  "simplify-path": {
    body: [
      "You are given an absolute path for a Unix-style file system, which always begins with a slash '/'. Transform it into its simplified canonical path.",
      "'.' means the current directory, '..' means the parent directory, and several slashes in a row act as one. The canonical path starts with a single '/', has single slashes between names, has no trailing slash, and contains no '.' or '..'."
    ],
    why: [
      "The trailing slash is removed.",
      "The double slash becomes a single one.",
      "Going up from the root stays at the root.",
      "a, then '.' (stay), b, '..' (back to a), '..' (back to root), c → /c."
    ],
    walk: [
      "Split on '/': ['', 'home', ''].",
      "Skip empty parts and '.'. Push names; for '..', pop if possible.",
      "The stack is ['home'].",
      "Join: '/home'."
    ],
    cons: ["1 ≤ path.length ≤ 3000", "`path` consists of English letters, digits, '.', '/' and '_'.", "`path` is a valid absolute Unix path."]
  },
  "basic-calculator": {
    body: [
      "Given a string `s` representing a valid expression, implement a basic calculator to evaluate it, and return the result.",
      "The expression can contain non-negative integers, '+', '−', parentheses and spaces. '−' can also be a unary minus, as in '−(2 + 3)'. You may not use a built-in eval."
    ],
    why: [
      "1 + 1 = 2.",
      "2 − 1 + 2 = 3; spaces are ignored.",
      "(1 + 11 − 3) + 14 = 9 + 14 = 23."
    ],
    walk: [
      "Keep a running `result` and the `sign` of the next number. On '(' push (result, sign) and start fresh; on ')' combine with what was pushed.",
      "Read 1 → result = 1.",
      "'+' → sign = +1.",
      "Read 1 → result = 1 + 1 = 2. The answer is 2."
    ],
    cons: ["1 ≤ s.length ≤ 3 · 10⁵", "`s` consists of digits, '+', '-', '(', ')' and ' '.", "`s` is a valid expression."]
  },
  "basic-calculator-ii": {
    body: [
      "Given a string `s` which represents an expression, evaluate this expression and return its value.",
      "The expression contains non-negative integers, '+', '−', '*', '/' and spaces. Multiplication and division happen before addition and subtraction, and integer division truncates toward zero. You may not use a built-in eval."
    ],
    why: [
      "2 * 2 = 4 happens first, then 3 + 4 = 7.",
      "3 / 2 truncates to 1.",
      "5 / 2 = 2 first, then 3 + 2 = 5."
    ],
    walk: [
      "Keep a stack of terms that will be added at the end, and remember the operator before the current number.",
      "Read 3 (operator +): push 3.",
      "Read 2 (operator +): push 2.",
      "Read 2 (operator *): pop 2, push 2 × 2 = 4. The stack is [3, 4].",
      "Sum the stack: 7."
    ],
    cons: ["1 ≤ s.length ≤ 3 · 10⁵", "`s` consists of digits, '+', '-', '*', '/' and spaces.", "`s` is a valid expression; all intermediate results fit in 32 bits."]
  },
  "longest-valid-parentheses": {
    body: [
      "Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
      "The substring must be contiguous, and every '(' in it must be matched by a later ')'."
    ],
    why: [
      "The longest valid part is '()'.",
      "The longest valid part is '()()'.",
      "The string is empty."
    ],
    walk: [
      "Keep a stack of indices, starting with −1 as a base marker.",
      "i = 0 '(': push 0. i = 1 '(': push 1.",
      "i = 2 ')': pop 1. The top is now 0, so a valid run ends here with length 2 − 0 = 2.",
      "The answer is 2."
    ],
    cons: ["0 ≤ s.length ≤ 3 · 10⁴", "s[i] is '(' or ')'."]
  },
  "sum-subarray-minimums": {
    body: [
      "Given an array of integers `arr`, find the sum of min(b), where b ranges over every (contiguous) subarray of arr.",
      "Since the answer may be large, return it modulo 10⁹ + 7."
    ],
    why: [
      "The 10 subarrays have minimums 3, 1, 2, 4, 1, 1, 2, 1, 1, 1, which sum to 17.",
      "Adding up the minimum of every subarray gives 444."
    ],
    walk: [
      "Instead of listing subarrays, ask: in how many subarrays is each element the minimum?",
      "3: it can only be the minimum of [3] → 1 × 3 = 3.",
      "1: subarrays can start at index 0 or 1 and end at index 1, 2 or 3 → 2 × 3 = 6 subarrays → 6 × 1 = 6.",
      "2: start at 2, end at 2 or 3 → 2 subarrays → 4. 4: only [4] → 4.",
      "Total 3 + 6 + 4 + 4 = 17. Monotonic stacks find these left and right ranges in O(n)."
    ],
    cons: ["1 ≤ arr.length ≤ 3 · 10⁴", "1 ≤ arr[i] ≤ 3 · 10⁴"]
  },
  "queue-using-stacks": {
    body: [
      "Implement a first in, first out (FIFO) queue using only two stacks. The queue supports `push(x)` (add to the back), `pop()` (remove and return the front), `peek()` (return the front) and `empty()`.",
      "You may only use standard stack operations: push to top, peek/pop from top, size and is empty. The example lists the calls on one line and their arguments on the next."
    ],
    why: [
      "After pushing 1 and 2, the front is 1 (peek), pop removes 1, and the queue still holds 2, so empty() is false."
    ],
    walk: [
      "Use an `in` stack for pushes and an `out` stack for pops.",
      "push(1), push(2) → in = [1, 2].",
      "peek(): out is empty, so move everything from in to out → out = [2, 1]. The top of out is 1.",
      "pop() → 1. out = [2]. empty() → false."
    ],
    cons: ["1 ≤ x ≤ 9", "At most 100 calls are made.", "pop and peek are only called on a non-empty queue."]
  },
  "stack-using-queues": {
    body: [
      "Implement a last in, first out (LIFO) stack using only queues. The stack supports `push(x)`, `pop()` (remove and return the top), `top()` and `empty()`.",
      "You may only use standard queue operations: push to back, peek/pop from front, size and is empty. The example lists the calls on one line and their arguments on the next."
    ],
    why: [
      "After pushing 1 and 2, the top is 2; pop removes 2, and 1 is still there, so empty() is false."
    ],
    walk: [
      "Keep one queue with the newest element at the front.",
      "push(1) → [1]. push(2) → [1, 2], then rotate the older element behind it → [2, 1].",
      "top() → 2 (the front). pop() → 2, leaving [1].",
      "empty() → false."
    ],
    cons: ["1 ≤ x ≤ 9", "At most 100 calls are made.", "pop and top are only called on a non-empty stack."]
  },
  "backspace-string-compare": {
    body: [
      "Given two strings `s` and `t`, return `true` if they are equal when both are typed into empty text editors. '#' means a backspace character.",
      "Backspacing in an empty editor keeps it empty. Can you solve it in O(n) time and O(1) space?"
    ],
    why: [
      "Both become 'ac'.",
      "Both become empty.",
      "s becomes 'c' and t is 'b'."
    ],
    walk: [
      "Type s = 'ab#c': a → 'a', b → 'ab', # → 'a', c → 'ac'.",
      "Type t = 'ad#c': a, d, # removes d, c → 'ac'.",
      "Both are 'ac', so return true. (Scanning both strings from the back with skip counters avoids building them.)"
    ],
    cons: ["1 ≤ s.length, t.length ≤ 200", "`s` and `t` contain only lowercase letters and '#'."]
  },
  "remove-adjacent-duplicates-ii": {
    body: [
      "You are given a string `s` and an integer `k`. A k duplicate removal consists of choosing k adjacent and equal letters from s and removing them, which joins the left and right sides together.",
      "Repeatedly make k duplicate removals until no more can be made. Return the final string. The answer is unique."
    ],
    why: [
      "No letter appears twice in a row, so nothing is removed.",
      "Remove 'eee' and 'ccc' → 'ddbbbdaa'. Remove 'bbb' → 'dddaa'. Remove 'ddd' → 'aa'.",
      "Pairs keep disappearing until only 'ps' is left."
    ],
    walk: [
      "Keep a stack of runs: [letter, count]. When a run reaches k, pop it.",
      "'a' → [a,1]. 'b' → [b,1]. 'c' → [c,1]. 'd' → [d,1].",
      "No run reaches k = 2.",
      "Rebuild from the stack: 'abcd'."
    ],
    cons: ["1 ≤ s.length ≤ 10⁵", "2 ≤ k ≤ 10⁴", "`s` contains only lowercase English letters."]
  },
  "design-circular-queue": {
    body: [
      "Design your implementation of a circular queue: a fixed-size FIFO queue whose last position wraps around to the first, so freed space at the front can be reused.",
      "Implement `MyCircularQueue(k)` with `enQueue(value)` and `deQueue()` (each returns true if it succeeded), `Front()` and `Rear()` (return −1 if empty), `isEmpty()` and `isFull()`. The example lists the calls on one line and their arguments on the next."
    ],
    why: [
      "With size 3, the fourth enQueue fails because the queue is full. After one deQueue there is room, so enQueue(4) succeeds and Rear() becomes 4."
    ],
    walk: [
      "Use an array of size 3 with a `head` index and a `count`.",
      "enQueue 1, 2, 3 → [1, 2, 3], count 3. enQueue(4) → full → false.",
      "Rear() → 3. isFull() → true. deQueue() removes 1 → head moves to index 1.",
      "enQueue(4) writes at (head + count) % 3 = 0 → [4, 2, 3]. Rear() → 4."
    ],
    cons: ["1 ≤ k ≤ 1000", "0 ≤ value ≤ 1000", "At most 3000 calls are made."]
  },
  "pattern-132": {
    body: [
      "Given an array of n integers `nums`, a 132 pattern is a subsequence of three integers nums[i], nums[j] and nums[k] such that i < j < k and nums[i] < nums[k] < nums[j].",
      "Return `true` if there is a 132 pattern in nums, otherwise return `false`."
    ],
    why: [
      "The values only increase, so no later value can sit between an earlier pair.",
      "1 < 2 < 4 with indices 1, 3, 2 in the order 1, 4, 2.",
      "For example −1, 3, 2: −1 < 2 < 3."
    ],
    walk: [
      "Scan from the right with a decreasing stack; `third` is the best candidate for nums[k] (initially −∞).",
      "4 → stack [4]. 3 → stack [4, 3]. 2 → [4, 3, 2]. 1 → [4, 3, 2, 1].",
      "Nothing was ever popped, so `third` stays −∞ and no value is smaller than it.",
      "Return false."
    ],
    cons: ["n == nums.length", "1 ≤ n ≤ 2 · 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹"]
  },
  "valid-parenthesis-string": {
    body: [
      "Given a string `s` containing only three types of characters: '(', ')' and '*', return `true` if s is valid.",
      "Every '(' must have a matching ')' after it, and every ')' a matching '(' before it. Each '*' can be treated as '(', as ')', or as an empty string."
    ],
    why: [
      "A matched pair.",
      "Treat '*' as empty.",
      "Treat '*' as '(' to get '(())'."
    ],
    walk: [
      "Track the range [lo, hi] of how many '(' could be open.",
      "'(' → [1, 1].",
      "')' → [0, 0].",
      "The string ends and lo = 0, so a valid choice exists: return true."
    ],
    cons: ["1 ≤ s.length ≤ 100", "s[i] is '(', ')' or '*'."]
  },
  "min-remove-valid-parentheses": {
    body: [
      "Given a string `s` of '(', ')' and lowercase English characters, remove the minimum number of parentheses so that the resulting parentheses string is valid, and return any valid result.",
      "A valid string has every ')' matched by an earlier '(' and every '(' matched by a later ')'. Letters are always kept."
    ],
    why: [
      "The final ')' has no partner. 'lee(t(co)de)' and 'lee(t(c)ode)' are also accepted.",
      "The first ')' has no partner.",
      "None of them can be matched, so all four go."
    ],
    walk: [
      "Scan with a stack of the indices of unmatched '('.",
      "'(' at 3 and 5 are pushed. ')' at 7 matches 5. ')' at 9 matches 3.",
      "')' at 12 finds an empty stack, so mark it for removal.",
      "No '(' is left unmatched. Rebuild without index 12: 'lee(t(c)o)de'."
    ],
    cons: ["1 ≤ s.length ≤ 10⁵", "s[i] is '(', ')' or a lowercase English letter."]
  },
  "exclusive-time-functions": {
    body: [
      "On a single-threaded CPU, we execute a program containing n functions with IDs 0 … n − 1. Function calls are stored in a call stack: a starting function goes on top, and the function on top is the one running.",
      "`logs` contains entries 'id:start:timestamp' (starts at the beginning of that time unit) and 'id:end:timestamp' (ends at the end of that time unit). A function's exclusive time is the time it spent running itself, not counting calls it made. Return each function's exclusive time, indexed by ID."
    ],
    why: [
      "Function 0 runs during units 0–1, function 1 during 2–5, then function 0 again during unit 6: 2 + 1 = 3 for function 0 and 4 for function 1.",
      "Function 0 calls itself twice. Adding up all the time it is running: 2 + 4 + 1 + 1 = 8."
    ],
    walk: [
      "Keep a stack of running IDs and `prev`, the time the current stretch started.",
      "'0:start:0': push 0, prev = 0.",
      "'1:start:2': function 0 ran from 0 to 1 → +2 for function 0. Push 1, prev = 2.",
      "'1:end:5': function 1 ran from 2 to 5 inclusive → +4. Pop, prev = 6.",
      "'0:end:6': function 0 runs during unit 6 → +1, total 3. Result: [3, 4]."
    ],
    cons: ["1 ≤ n ≤ 100", "1 ≤ logs.length ≤ 500", "0 ≤ timestamp ≤ 10⁹", "Each start has a matching end; no two events happen at the same time."]
  }
};
