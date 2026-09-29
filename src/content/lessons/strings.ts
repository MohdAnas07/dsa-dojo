import type { Lesson } from "@/lib/types";

const strings: Lesson = {
  what: "A string is a sequence of characters, like an array of letters. \"hello\" has 'h' at index 0 and 'o' at index 4.",
  analogy: { short: "Beads on a necklace", text: "A string is a necklace of letter beads. You can look at any bead by its position, but in JavaScript the necklace is glued shut: to change a bead you have to make a new necklace." },
  eli5: "A word is just letters in a line. Each letter has a spot number starting from 0. Lots of puzzles are about counting letters, flipping the word, or checking if it reads the same backwards.",
  tech: "Strings are indexed sequences of UTF-16 code units. In JavaScript strings are immutable: every modification creates a new string, which costs O(n). Many string problems reduce to array techniques (two pointers, sliding window) plus character frequency maps.",
  why: "Text is everywhere: usernames, search, DNA, URLs, logs. Interviewers love strings because they combine array skills with hashing and careful edge cases.",
  how: ["Read characters with s[i] or s.charAt(i).", "Loop through with for...of or an index loop.", "To modify, convert to an array: s.split(\"\"), change it, then join(\"\").", "Count characters with a Map or a 26-length array.", "Compare letters with charCodeAt when you need numeric math."],
  props: ["Indexed and ordered", "Immutable in JavaScript", "Length is s.length", "Characters compare lexicographically ('a' < 'b')"],
  use: ["Text processing, parsing", "Palindromes, anagrams, substrings", "Pattern matching"],
  avoid: ["Building large strings with += in a loop: collect parts in an array and join", "Mutating characters in place (not possible in JS)"],
  viz: "string",
  cx: [
    ["Access s[i]", "O(1)", "Direct index like arrays."],
    ["Concatenate a + b", "O(n + m)", "A new string is created and both are copied."],
    ["Substring / slice", "O(k)", "Copies k characters into a new string."],
    ["Search s.includes(t)", "O(n · m)", "Worst case tries each start position."],
    ["split / join / reverse", "O(n)", "Touches every character once."],
    ["Compare a === b", "O(n)", "Characters compared one by one until a difference."]
  ],
  space: "O(n) for any new string you create; O(1) extra if you only use pointers.",
  code: {
    c: `const s = "hello";

console.log(s[1]);
console.log(s.length);
console.log(s.toUpperCase());
console.log(s.split("").reverse().join(""));
console.log(s.slice(1, 4));
console.log(s.includes("ell"));
console.log(s.charCodeAt(0) - 97); // 'h' → 7`,
    hl: [6],
    ex: { 6: "Classic reverse: string → array of chars → reverse → back to string. O(n).", 7: "slice(start, end) excludes end: characters at 1, 2, 3.", 9: "charCodeAt gives the number code. Subtracting 97 ('a') maps a..z to 0..25, useful for count arrays." }
  },
  examples: [
    { lvl: "Easy", title: "Valid palindrome", prob: "Ignoring non-letters and case, does the string read the same both ways?", idea: "Clean the string, then compare characters from both ends moving inward. Stop at the first mismatch.", c: `function isPalindrome(s) {
  const t = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let l = 0, r = t.length - 1;
  while (l < r) {
    if (t[l] !== t[r]) return false;
    l++; r--;
  }
  return true;
}
console.log(isPalindrome("A man, a plan, a canal: Panama"));
console.log(isPalindrome("race a car"));`, time: "O(n)", space: "O(n)" },
    { lvl: "Practical", title: "Valid anagram", prob: "Are two strings made of exactly the same letters?", idea: "Count letters of the first string, subtract counts for the second. All counts must end at zero.", c: `function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < a.length; i++) {
    count[a.charCodeAt(i) - 97]++;
    count[b.charCodeAt(i) - 97]--;
  }
  return count.every(c => c === 0);
}
console.log(isAnagram("listen", "silent"));
console.log(isAnagram("rat", "car"));`, time: "O(n)", space: "O(1)", ex: { 3: "Only 26 lowercase letters, so this array is constant size: O(1) space." } },
    { lvl: "Interview", title: "Longest common prefix", prob: "Find the longest prefix shared by all words.", idea: "Take the first word as the candidate. Shrink it until every other word starts with it.", c: `function longestCommonPrefix(words) {
  let prefix = words[0];
  for (const w of words) {
    while (!w.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix;
}
console.log(longestCommonPrefix(["flower", "flow", "flight"]));
console.log(longestCommonPrefix(["dog", "car"]) === "");`, time: "O(total chars)", space: "O(1)" }
  ],
  signals: [["\"anagram\", \"permutation of\"", "Character frequency count"], ["\"palindrome\"", "Two pointers from both ends / expand around center"], ["\"longest substring with…\"", "Sliding window + map"], ["\"prefix\" across many words", "Sort / Trie"]],
  mistakes: [["Trying s[0] = 'x'", "Strings are immutable. Use split/join or build a new string."], ["+= in a big loop", "Push parts to an array and join('') once at the end."], ["Forgetting case and spaces", "Normalise with toLowerCase and a regex before comparing."], ["Using split('') on emoji", "Emoji take 2 code units. Use [...s] or Array.from(s) for Unicode-safe splitting."]],
  js: ["[...s] splits by Unicode characters; s.split('') by UTF-16 units.", "s.localeCompare(t) for proper alphabetical order with accents.", "String comparison with < works lexicographically: 'apple' < 'banana'."],
  iq: { Beginner: ["Reverse a string", "Count vowels"], Easy: ["valid-palindrome", "valid-anagram", "First unique character"], Medium: ["longest-substring", "group-anagrams", "Longest palindromic substring"], Hard: ["min-window-substring"] },
  rev: { s30: "Strings = immutable arrays of characters. Most string problems = two pointers, sliding window, or a frequency map.", m2: ["Access O(1), slice/concat O(n)", "Immutable → split, change, join", "26-length array for lowercase counts", "Palindrome → two pointers; anagram → counts"] },
  cheat: `STRINGS CHEAT SHEET

s[i]          → O(1)
slice / +     → O(n) new string
split/join    → O(n)
immutable!    → build with array + join

Think:
anagram       → count letters
palindrome    → two pointers
substring     → sliding window
many prefixes → trie

code(c) = c.charCodeAt(0) - 97  // a→0`
};

export default strings;
