import type { Lesson } from "@/lib/types";

const hashing: Lesson = {
  what: "Hashing lets you store and find things by a key in (almost) constant time. In JavaScript you use Map for key → value pairs and Set for a collection of unique values.",
  analogy: { short: "A coat-check counter", text: "At a coat check, you get ticket #47. When you come back, the attendant doesn't search every coat: they go straight to hook 47. A hash function turns your key into a hook number." },
  eli5: "Imagine a magic notebook. You say a word, and it instantly opens to the page for that word. No flipping. That's what a Map does for your code.",
  tech: "A hash table uses a hash function to map keys to bucket indexes. With a good hash function and resizing, get/set/delete run in O(1) average time. Collisions (two keys in the same bucket) are handled by chaining or probing; worst case O(n) is rare.",
  why: "Arrays make you search O(n) to find a value. Many problems ask \"have I seen this before?\" or \"how many times does X appear?\". A hash map answers those in O(1), turning O(n²) brute force into O(n).",
  how: ["The key goes through a hash function → a number.", "That number picks a bucket in an internal array.", "The value is stored in that bucket.", "Looking up runs the same hash → same bucket → instant.", "When full, the table grows and re-spreads entries (still amortized O(1))."],
  props: ["Key → value lookups in O(1) average", "Set stores unique values only", "Map keeps insertion order in JS", "Keys can be any type in Map (objects compare by reference)"],
  use: ["Counting frequencies", "Checking \"seen before?\"", "Finding a complement (target - x)", "Grouping items by a computed key", "Caching results (memoization)"],
  avoid: ["You need sorted order or range queries (use sorting or a tree)", "Memory is very tight", "Keys are small integers in a range: a plain array is simpler"],
  viz: "hash",
  cx: [
    ["map.set(k, v)", "O(1) avg", "Hash the key, drop the value in its bucket."],
    ["map.get(k)", "O(1) avg", "Hash the key, go straight to the bucket."],
    ["map.has(k)", "O(1) avg", "Same as get."],
    ["map.delete(k)", "O(1) avg", "Find the bucket, remove the entry."],
    ["Iterate all", "O(n)", "Every entry must be visited."],
    ["Worst case (all collide)", "O(n)", "Everything in one bucket becomes a list. Rare in practice."]
  ],
  space: "O(n) for n keys.",
  code: {
    c: `const freq = new Map();
for (const ch of "banana") {
  freq.set(ch, (freq.get(ch) || 0) + 1);
}
console.log(freq.get("a"));
console.log([...freq.entries()]);

const seen = new Set([1, 2, 2, 3]);
console.log(seen.size);
console.log(seen.has(2));`,
    hl: [3],
    ex: { 3: "The counting idiom: read the old count (or 0), add 1, write it back.", 6: "Spread entries into an array to print or sort them.", 8: "A Set drops duplicates automatically." }
  },
  examples: [
    { lvl: "Easy", title: "First non-repeating character", prob: "Return the index of the first character that appears exactly once, or -1.", idea: "Pass 1: count all characters. Pass 2: the first character with count 1 is the answer.", c: `function firstUniqChar(s) {
  const count = new Map();
  for (const ch of s) count.set(ch, (count.get(ch) || 0) + 1);
  for (let i = 0; i < s.length; i++) {
    if (count.get(s[i]) === 1) return i;
  }
  return -1;
}
console.log(firstUniqChar("leetcode"));
console.log(firstUniqChar("loveleetcode"));
console.log(firstUniqChar("aabb"));`, time: "O(n)", space: "O(1) (alphabet size)" },
    { lvl: "Practical", title: "Two Sum", prob: "Find indexes of two numbers that add up to target.", idea: "For each number x, the partner we need is target - x. Store every number we've passed in a map (value → index). If the partner is already there, done.", c: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}
console.log(twoSum([2, 7, 11, 15], 9));
console.log(twoSum([3, 2, 4], 6));`, time: "O(n)", space: "O(n)", ex: { 4: "The complement: what value would complete the pair?", 5: "Check BEFORE storing the current number, so we never pair an element with itself." } },
    { lvl: "Interview", title: "Group anagrams", prob: "Group words that are anagrams of each other.", idea: "Anagrams become identical when sorted. Use the sorted word as the map key and push each word into its group.", c: `function groupAnagrams(words) {
  const groups = new Map();
  for (const w of words) {
    const key = w.split("").sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}
console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));`, time: "O(n · k log k)", space: "O(n · k)", ex: { 4: "\"eat\", \"tea\" and \"ate\" all become \"aet\": the same key." } }
  ],
  signals: [["\"have we seen this before?\"", "Set"], ["\"count\", \"frequency\", \"most common\"", "Map counter"], ["\"pair that sums to\" (unsorted)", "Map of complements"], ["\"group by\" / \"same pattern\"", "Map with a computed key"], ["\"subarray sum equals k\"", "Prefix sum + Map"]],
  mistakes: [["Using a plain object with number keys and expecting numbers back", "Object keys become strings. Use Map to keep key types."], ["Using an array or object as a Map key and expecting value equality", "Map compares objects by reference. Convert to a string key, e.g. arr.join(',')."], ["Checking map.get(k) truthiness when the value can be 0", "Use map.has(k) to test existence."], ["Storing before checking in Two Sum", "Check first, then store, or you'll pair an element with itself."]],
  js: ["Map preserves insertion order; iterating is predictable.", "new Set(arr) is the fastest way to dedupe: [...new Set(arr)].", "WeakMap only accepts object keys and doesn't prevent garbage collection."],
  iq: { Beginner: ["Count occurrences of each element", "Remove duplicates from an array"], Easy: ["two-sum", "contains-duplicate", "valid-anagram"], Medium: ["group-anagrams", "top-k-frequent", "subarray-sum-k", "longest-consecutive"], Hard: ["LRU Cache (Map + ordering)"] },
  rev: { s30: "Map/Set give O(1) lookups. Use them to count, to remember what you've seen, and to find complements. They turn O(n²) into O(n) by spending O(n) memory.", m2: ["get/set/has/delete O(1) average", "Counting idiom: m.set(k, (m.get(k) || 0) + 1)", "Two Sum: store value → index, look up target - x", "Group by computed key (sorted word, tuple string)"] },
  cheat: `HASHING CHEAT SHEET

Map  → key → value     O(1) avg
Set  → unique values   O(1) avg

count:  m.set(k, (m.get(k) || 0) + 1)
dedupe: [...new Set(arr)]

Think Hashing when:
→ "seen before?"
→ frequency / count
→ complement (target - x)
→ group by pattern
→ prefix sum lookups

Trade: O(n) memory for O(n) time`
};

export default hashing;
