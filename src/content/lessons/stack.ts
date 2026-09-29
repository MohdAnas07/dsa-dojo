import type { Lesson } from "@/lib/types";

const stack: Lesson = {
  what: "A stack is a collection where the last item you put in is the first one you take out (LIFO: Last In, First Out). You only touch the top.",
  analogy: { short: "A stack of plates", text: "You put clean plates on top and take plates from the top. The plate at the bottom has been there longest and comes out last." },
  eli5: "It's like a Pringles tube. You can only put chips in at the top and take them from the top. The last chip in is the first one you eat.",
  tech: "A stack supports push (add to top), pop (remove top), and peek (read top), all O(1). In JavaScript an array with push/pop is a perfect stack. Stacks model nested structure and \"undo\" order: function calls, brackets, DFS.",
  why: "Many problems need you to remember things and come back to the most recent one first: matching brackets, undo history, browser back button, evaluating expressions, and finding the next greater element.",
  how: ["push(x): put x on top.", "pop(): remove and return the top.", "peek(): look at the top without removing.", "isEmpty(): length === 0.", "Monotonic stack: pop while the new element breaks the order, so the stack stays sorted."],
  props: ["LIFO order", "O(1) push/pop/peek", "Only the top is accessible", "Natural for nesting and backtracking"],
  use: ["Matching brackets / tags", "Undo / back navigation", "Expression evaluation", "Next greater / smaller element (monotonic stack)", "Iterative DFS"],
  avoid: ["You need first-in-first-out order (use a queue)", "You need to access middle elements"],
  viz: "stack",
  cx: [["push", "O(1)", "Add at the end of the array; nothing shifts."], ["pop", "O(1)", "Remove the last element."], ["peek", "O(1)", "Read arr[arr.length - 1]."], ["search", "O(n)", "Not what stacks are for; you'd pop everything."], ["Monotonic stack pass", "O(n)", "Each element is pushed once and popped at most once."]],
  space: "O(n).",
  code: {
    c: `const stack = [];
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack[stack.length - 1]); // peek
console.log(stack.pop());
console.log(stack.pop());
console.log(stack);
console.log(stack.length === 0);`,
    hl: [5, 6],
    ex: { 5: "Peek = last element. Don't use stack.at(-1) if you need older browser support.", 6: "pop removes from the end: the most recently pushed value (3)." }
  },
  examples: [
    { lvl: "Easy", title: "Valid parentheses", prob: "Is every bracket closed by the right type in the right order?", idea: "Push opening brackets. On a closing bracket, the top of the stack must be its matching opener.", c: `function isValid(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return stack.length === 0;
}
console.log(isValid("({[]})"));
console.log(isValid("([)]"));
console.log(isValid("(("));`, time: "O(n)", space: "O(n)", ex: { 6: "Pop the latest opener. If it isn't the matching type, invalid.", 8: "Leftover openers mean something was never closed." } },
    { lvl: "Practical", title: "Evaluate Reverse Polish Notation", prob: "Evaluate an expression like [\"2\",\"1\",\"+\",\"3\",\"*\"].", idea: "Numbers get pushed. An operator pops two numbers, applies itself, and pushes the result.", c: `function evalRPN(tokens) {
  const st = [];
  for (const t of tokens) {
    if (["+", "-", "*", "/"].includes(t)) {
      const b = st.pop(), a = st.pop();
      if (t === "+") st.push(a + b);
      else if (t === "-") st.push(a - b);
      else if (t === "*") st.push(a * b);
      else st.push(Math.trunc(a / b));
    } else st.push(Number(t));
  }
  return st.pop();
}
console.log(evalRPN(["2", "1", "+", "3", "*"]));
console.log(evalRPN(["4", "13", "5", "/", "+"]));`, time: "O(n)", space: "O(n)", ex: { 5: "Order matters: the top is the RIGHT operand." } },
    { lvl: "Interview", title: "Daily temperatures (monotonic stack)", prob: "For each day, how many days until a warmer temperature?", idea: "Keep a stack of indexes whose answer is still unknown, with temperatures decreasing. A warmer day pops every colder day below it and answers them.", c: `function dailyTemperatures(t) {
  const ans = new Array(t.length).fill(0);
  const st = [];
  for (let i = 0; i < t.length; i++) {
    while (st.length && t[i] > t[st[st.length - 1]]) {
      const j = st.pop();
      ans[j] = i - j;
    }
    st.push(i);
  }
  return ans;
}
console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));`, time: "O(n)", space: "O(n)", ex: { 5: "Looks nested, but each index is popped at most once in the whole run, so total work is O(n).", 9: "Store indexes, not values, so we can compute distances." } }
  ],
  signals: [["\"valid parentheses\", nested structure", "Stack"], ["\"next greater / smaller element\"", "Monotonic stack"], ["\"undo\", \"backspace\", \"simplify path\"", "Stack"], ["\"evaluate expression\"", "Stack (operands/operators)"], ["\"largest rectangle in histogram\"", "Monotonic stack"]],
  mistakes: [["Popping from an empty stack", "Check stack.length first (in JS pop returns undefined, which can hide bugs)."], ["Forgetting to check the stack is empty at the end", "Unclosed openers → invalid."], ["Storing values instead of indexes in monotonic stack problems", "Indexes let you compute distances and read values."], ["Using shift/unshift to build a stack", "Those are O(n). Use push/pop at the end."]],
  js: ["Array push/pop are O(1): arrays are the idiomatic JS stack.", "arr.at(-1) reads the top in modern JS."],
  iq: { Beginner: ["Reverse a string using a stack"], Easy: ["valid-parentheses", "Implement queue using stacks", "Backspace string compare"], Medium: ["min-stack", "daily-temperatures", "eval-rpn"], Hard: ["Largest rectangle in histogram", "Basic calculator"] },
  rev: { s30: "LIFO. push/pop/peek are O(1). Use for matching, undo, nested structure, and next-greater problems (monotonic stack).", m2: ["JS array = stack (push/pop)", "Brackets: push openers, pop on closers", "Monotonic stack: pop while current breaks order; each item popped once → O(n)", "Store indexes in monotonic stacks"] },
  cheat: `STACK CHEAT SHEET

push  → O(1)   pop  → O(1)
peek  → O(1)   LIFO

Monotonic stack:
for i:
  while (st.length && a[i] > a[top]) resolve(st.pop())
  st.push(i)

Think Stack when:
→ matching brackets
→ undo / most recent first
→ next greater / smaller
→ expression evaluation
→ iterative DFS`
};

export default stack;
