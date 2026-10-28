import type { Lesson } from "@/lib/types";

const searching: Lesson = {
  what: "Linear search checks the elements one by one until it finds the target or runs out. It works on any data, sorted or not, and it is the baseline every faster search is measured against.",
  analogy: { short: "Checking every pocket for your keys", text: "You don't know which pocket has the keys, so you check them one after another. If they're in the last pocket (or not there at all), you check every pocket. That's the worst case of a linear search." },
  eli5: "Looking for a red sock in a pile by picking up socks one at a time until you find it.",
  tech: "Linear search takes O(n) time in the worst and average case, O(1) in the best case, and O(1) extra space. Common variants find the first or last match, all matches, the minimum or maximum, or the first element meeting a condition. On sorted data, binary search (O(log n)) is better; for many lookups in the same data, build a Set or Map once (O(n)) and then each lookup is O(1). JavaScript's indexOf, includes, find, findIndex and some are all linear searches.",
  why: "It is the simplest correct solution and often the right one for a single lookup in unsorted data. Knowing its cost explains why interviewers push for sorting + binary search or a hash set when the same data is searched many times.",
  how: ["Start at index 0.", "Compare each element with the target (or test the condition).", "Return as soon as you find it.", "If the loop finishes, report 'not found' (−1, null or false).", "For repeated lookups, convert the data to a Set/Map first."],
  props: ["Works on unsorted data", "O(n) worst case", "O(1) extra space", "Can stop early"],
  use: ["One-off lookups in small or unsorted data", "Finding min/max or counting matches", "Checking a condition across all items", "Linked lists (no random access)"],
  avoid: ["Sorted data (use binary search)", "Many lookups in the same data (build a Set/Map)"],
  viz: "array",
  cx: [["Worst / average case", "O(n)", "The target may be last or missing."], ["Best case", "O(1)", "The target is the first element."], ["Many lookups with a Set", "O(n) build, then O(1) each", "Pay once, look up instantly."], ["Sorted data with binary search", "O(log n)", "Halve the range each step."]],
  space: "O(1).",
  code: {
    c: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
const nums = [7, 3, 9, 4, 3];
console.log(linearSearch(nums, 9));
console.log(linearSearch(nums, 8));
console.log(nums.indexOf(3), nums.lastIndexOf(3));
console.log(nums.find(x => x > 5), nums.findIndex(x => x > 5));`,
    hl: [3],
    ex: { 3: "Stop as soon as we find it.", 5: "The loop finished without a match.", 10: "Built-ins: first match and last match.", 11: "find returns the value, findIndex its position." }
  },
  examples: [
    { lvl: "Easy", title: "Minimum and maximum in one pass", prob: "Find the smallest and largest value in an array.", idea: "Start both at the first element and update them while scanning.", c: `function minMax(arr) {
  let min = arr[0], max = arr[0];
  for (const x of arr) {
    if (x < min) min = x;
    if (x > max) max = x;
  }
  return [min, max];
}
console.log(minMax([3, -2, 9, 4]));`, time: "O(n)", space: "O(1)", ex: { 2: "Starting from the first element avoids guessing a sentinel value." } },
    { lvl: "Practical", title: "Find every index of a value", prob: "Return all positions where the target appears.", idea: "Don't stop at the first match; collect them all.", c: `function allIndexes(arr, target) {
  const out = [];
  for (let i = 0; i < arr.length; i++) if (arr[i] === target) out.push(i);
  return out;
}
console.log(allIndexes(["a", "b", "a", "c", "a"], "a"));
console.log(allIndexes([1, 2, 3], 4));`, time: "O(n)", space: "O(k) for k matches", ex: { 3: "Record each match and keep going." } },
    { lvl: "Interview", title: "Repeated lookups: switch to a Set", prob: "Return the values of a that also appear in b.", idea: "Calling includes inside a loop is a linear search per element: O(n · m). Building a Set from b once makes each lookup O(1): O(n + m).", c: `function commonSlow(a, b) {
  return a.filter(x => b.includes(x));
}
function commonFast(a, b) {
  const set = new Set(b);
  return a.filter(x => set.has(x));
}
const a = [1, 5, 9, 12], b = [12, 3, 9, 7];
console.log(commonSlow(a, b));
console.log(commonFast(a, b));`, time: "O(n · m) vs O(n + m)", space: "O(1) vs O(m)", ex: { 2: "includes scans all of b for every element of a.", 5: "One pass to build the set…", 6: "…then every lookup is O(1)." } }
  ],
  signals: [["unsorted data, a single lookup", "Linear search is fine"], ["\"have I seen this before?\" many times", "Hash set instead of repeated scans"], ["sorted array", "Binary search instead"], ["min / max / count over everything", "One linear pass"], ["linked list", "Linear search (no random access)"]],
  mistakes: [["Using includes/indexOf inside a loop", "That hides an O(n²) algorithm. Build a Set first."], ["Returning inside the loop too early when looking for all matches", "Collect matches; return after the loop."], ["Linear search on sorted data in an interview", "Mention binary search: O(log n)."], ["indexOf with NaN", "indexOf(NaN) is −1; includes(NaN) is true."]],
  js: ["indexOf / lastIndexOf / includes / find / findIndex / findLast / some / every are all O(n).", "Set.has and Map.get are O(1) on average."],
  iq: { Beginner: ["Return the index of a target in an array, or -1"], Easy: ["contains-duplicate", "first-unique-char", "missing-number", "majority-element"], Medium: ["two-sum", "longest-consecutive"], Hard: ["first-missing-positive"] },
  rev: { s30: "Check elements one by one: O(n) time, O(1) space, works on anything. Use binary search for sorted data and a Set/Map for repeated lookups.", m2: ["Return early on a match", "Return −1 / null after the loop", "includes in a loop = hidden O(n²)", "Sorted → binary search", "Many lookups → Set/Map"] },
  cheat: `LINEAR SEARCH CHEAT SHEET

for i in 0..n-1:
  if arr[i] === target return i
return -1

Time O(n)  Space O(1)

Better options:
→ sorted data: binary search O(log n)
→ many lookups: new Set(arr) → has O(1)

JS built-ins (all O(n)):
indexOf, includes, find, findIndex, some`
};

export default searching;
