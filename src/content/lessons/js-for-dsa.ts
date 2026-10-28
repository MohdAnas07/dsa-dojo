import type { Lesson } from "@/lib/types";

const jsForDsa: Lesson = {
  what: "The parts of JavaScript you use in almost every DSA problem: arrays as stacks and queues, Map and Set, string and array methods, sorting with comparators, and the language traps that cause wrong answers in interviews.",
  analogy: { short: "Knowing your toolbox before building", text: "A carpenter who has to hunt for the right tool mid-job loses time and makes mistakes. Knowing which JavaScript built-in does what (and how fast it is) lets you focus on the algorithm instead of the syntax." },
  eli5: "Before solving puzzles, learn what your tools do: which ones are fast, which ones are slow, and which ones can trick you.",
  tech: "Use const by default and let when reassigning; compare with === (== converts types). Arrays: push/pop at the end are O(1), but shift/unshift at the front are O(n), so use a head index for queues. includes/indexOf are O(n) scans; Map and Set give O(1) average lookups and keep insertion order (object keys are always strings, Map keys can be anything). Strings are immutable: building with an array and join is predictable, and indexing a string is O(1). sort() compares as strings unless you pass a comparator ((a, b) => a − b) and it sorts in place. new Array(n).fill([]) shares one array between all slots; use Array.from({ length: n }, () => []). There is no integer division (Math.floor / Math.trunc), integers are exact only up to 2⁵³ − 1 (use BigInt beyond), and deep recursion can overflow the call stack around 10,000 frames.",
  why: "Interviewers expect idiomatic, correct code. Most bugs in JavaScript DSA solutions aren't algorithm mistakes but language traps: string sorting, shared rows in 2D arrays, O(n) shift in BFS, == comparisons, or integer division.",
  how: ["Stacks: push / pop. Queues: push + a head index (not shift).", "Counting: map.set(k, (map.get(k) || 0) + 1).", "Seen-before checks: new Set(), then has / add.", "Sorting numbers: arr.sort((a, b) => a - b); copy first if needed.", "2D arrays: Array.from({ length: r }, () => new Array(c).fill(0)).", "Swap: [a, b] = [b, a]."],
  props: ["push/pop O(1), shift/unshift O(n)", "Map/Set O(1) average, insertion-ordered", "Strings are immutable", "sort is in place and string-based by default", "Numbers are 64-bit floats"],
  use: ["Every DSA problem written in JavaScript", "Choosing the right built-in for speed", "Avoiding classic language bugs"],
  avoid: ["Using objects as maps when keys aren't strings (use Map)", "for…in over arrays (it iterates keys as strings; use for…of or an index loop)"],
  viz: "array",
  cx: [["push / pop", "O(1)", "Work at the end of the array."], ["shift / unshift", "O(n)", "Every element moves one slot."], ["includes / indexOf / find", "O(n)", "A linear scan."], ["Map / Set get / has / add", "O(1) average", "Hash tables."], ["slice / spread / concat", "O(n)", "They copy elements."], ["sort", "O(n log n)", "TimSort, stable."]],
  space: "Copies (slice, spread, map, filter) allocate O(n) new memory.",
  code: {
    c: `const grid = Array.from({ length: 2 }, () => new Array(3).fill(0));
grid[0][0] = 1;
const shared = new Array(2).fill([]);
shared[0].push("x");
console.log(grid, shared);
console.log([10, 9, 1].sort(), [10, 9, 1].sort((a, b) => a - b));
const count = new Map();
for (const ch of "banana") count.set(ch, (count.get(ch) || 0) + 1);
console.log([...count]);
const seen = new Set([3, 1, 3]);
console.log(seen.size, seen.has(1));
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b, Math.trunc(7 / 2), Math.floor(-7 / 2));
console.log(0.1 + 0.2 === 0.3, Number.MAX_SAFE_INTEGER);`,
    hl: [3, 6],
    ex: { 1: "Array.from with a function gives every row its own array.", 3: "fill([]) puts the SAME array in every slot: pushing into one changes all of them.", 6: "The default sort compares as strings; pass (a, b) => a - b for numbers.", 8: "The counting idiom: read the old count (or 0) and add 1.", 13: "Swap with destructuring, no temporary variable.", 14: "No integer division operator: Math.trunc rounds toward 0, Math.floor rounds down.", 15: "Floating point isn't exact, and integers are exact only up to 2⁵³ − 1." }
  },
  examples: [
    { lvl: "Easy", title: "Stack and queue with plain arrays", prob: "Use arrays as a stack and as a queue efficiently.", idea: "A stack uses push/pop at the end. A queue reads from a moving head index instead of calling shift (which is O(n)).", c: `const stack = [];
stack.push(1); stack.push(2); stack.push(3);
console.log(stack.pop(), stack[stack.length - 1]);
const queue = [10, 20, 30];
let head = 0;
console.log(queue[head++], queue[head++]);
console.log(queue.length - head, queue.slice(head));`, time: "O(1) per operation", space: "O(n)", ex: { 3: "pop removes the last element; the new top is at length − 1.", 6: "Dequeue by moving the head forward: O(1).", 7: "Elements still in the queue: from head to the end." } },
    { lvl: "Practical", title: "Grouping with a Map (group anagrams)", prob: "Group words that are anagrams of each other.", idea: "Use the sorted letters as a key in a Map from key to a list of words.", c: `function groupAnagrams(words) {
  const groups = new Map();
  for (const w of words) {
    const key = [...w].sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}
console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));`, time: "O(n · k log k)", space: "O(n · k)", ex: { 4: "Spread a string into letters, sort them, join back: anagrams share a key.", 5: "Create the group the first time a key appears.", 8: "Map keeps insertion order, so groups come out in first-seen order." } },
    { lvl: "Interview", title: "Sorting by several keys", prob: "Sort people by age (oldest first), then by name; sort words ignoring case.", idea: "Return a negative, zero or positive number from the comparator. Chain keys with ||: the second key only matters when the first is a tie (0).", c: `const people = [
  { name: "Ravi", age: 30 },
  { name: "Asha", age: 25 },
  { name: "Neel", age: 30 },
  { name: "Zara", age: 25 }
];
const sorted = [...people].sort((a, b) => b.age - a.age || a.name.localeCompare(b.name));
console.log(sorted.map(p => p.name + ":" + p.age).join(", "));
const words = ["pear", "apple", "Banana"];
console.log([...words].sort(), [...words].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })));`, time: "O(n log n)", space: "O(n)", ex: { 7: "Age descending; equal ages (0) fall through to the name comparison.", 10: "Default sort puts uppercase before lowercase ('B' < 'a'); localeCompare sorts the way people read." } }
  ],
  signals: [["BFS / queue in JavaScript", "Head index or a next-level array, not shift()"], ["counting or grouping", "Map with get(...) || 0"], ["\"have I seen it?\"", "Set"], ["sorting numbers or objects", "Comparator returning a number"], ["2D grid / DP table", "Array.from with a row factory"]],
  mistakes: [["arr.sort() on numbers", "Sorts as strings. Use (a, b) => a - b."], ["new Array(n).fill([]) for 2D", "Every row is the same array. Use Array.from({ length: n }, () => [])."], ["queue.shift() inside a loop", "O(n) each time, so BFS becomes O(n²). Use a head index."], ["== instead of ===", "== converts types ('1' == 1 is true). Always use ===."], ["for…in on arrays", "Gives string keys and can include extra properties. Use for…of or an index loop."]],
  js: ["Optional chaining (node?.left) and nullish coalescing (x ?? 0) shorten edge-case code.", "Number.isInteger, Math.max(...arr) (fine for normal-sized arrays), arr.at(-1) for the last element.", "Infinity and -Infinity are handy starting values for min/max."],
  iq: { Beginner: ["Reverse an array without using .reverse()"], Easy: ["contains-duplicate", "valid-anagram", "two-sum", "fizz-buzz"], Medium: ["group-anagrams", "top-k-frequent", "sort-characters-by-frequency"], Hard: ["Implement a priority queue (heap) class in JavaScript"] },
  rev: { s30: "push/pop are O(1), shift is O(n). Map/Set for O(1) lookups. Always pass a comparator to sort numbers. Build 2D arrays with Array.from. No integer division; integers are exact to 2⁵³ − 1.", m2: ["Queue: head index, not shift", "Count: map.set(k, (map.get(k) || 0) + 1)", "sort((a, b) => a - b), copy first", "Array.from({ length: n }, () => [])", "=== always"] },
  cheat: `JAVASCRIPT FOR DSA CHEAT SHEET

stack: push / pop          O(1)
queue: q[head++]           O(1)   (shift is O(n)!)
Map:   get/set/has         O(1)   count: (m.get(k)||0)+1
Set:   add/has             O(1)
sort:  arr.sort((a,b) => a - b)   // in place
2D:    Array.from({length:r}, () => new Array(c).fill(0))
swap:  [a, b] = [b, a]
int division: Math.floor / Math.trunc
=== not ==   ·   for…of not for…in`
};

export default jsForDsa;
