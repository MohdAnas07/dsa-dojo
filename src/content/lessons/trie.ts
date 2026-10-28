import type { Lesson } from "@/lib/types";

const trie: Lesson = {
  what: "A trie (prefix tree) stores strings one character per level. Words that start the same way share the same path from the root, so checking a prefix takes as many steps as the prefix has letters, no matter how many words are stored.",
  analogy: { short: "An autocomplete index", text: "Type 'c', then 'ca', then 'car': each letter narrows the suggestions. A trie is exactly that index, built letter by letter, where every node is 'everything that starts with these letters'." },
  eli5: "A choose-your-path tree where each step is a letter. To spell 'cat' you walk c → a → t. Every word that starts with 'ca' walks through the same first two steps.",
  tech: "Each node holds up to 26 children (an object or Map keyed by character) and an `end` flag that marks where a word finishes. insert, search and startsWith each take O(L) for a string of length L, regardless of how many words are stored. Space is O(total characters). Tries power autocomplete, spell checkers, word games like Word Search II, and bit problems (a binary trie for maximum XOR).",
  why: "Prefix questions ('any word starting with…', 'the shortest root of…', 'all words matching b.d') are slow with a plain list of words (O(n · L) each). A trie answers them in O(L), and it lets a search stop the moment no stored word continues.",
  how: ["Start with an empty root node.", "insert(word): walk letter by letter, creating missing children; mark the last node with end = true.", "search(word): walk; fail if a child is missing; succeed only if the last node is marked end.", "startsWith(prefix): the same walk, without the end check.", "Wildcard or grid searches: DFS through the trie and abandon a branch as soon as the next letter is missing."],
  props: ["Shared prefixes share nodes", "Operations cost O(word length)", "Visiting children in sorted order lists words alphabetically", "An end flag separates whole words from prefixes"],
  use: ["Autocomplete and search suggestions", "Counting words with a prefix", "Word search on a grid with many words", "Replacing words with their roots", "Maximum XOR (binary trie)"],
  avoid: ["Only exact lookups are needed (a Set is simpler)", "Long strings that share almost no prefixes (lots of memory)"],
  viz: "tree",
  cx: [["insert", "O(L)", "One step per character."], ["search / startsWith", "O(L)", "The same walk, no extra work."], ["Space", "O(total characters)", "Each character creates at most one node."]],
  space: "O(N · L) in the worst case for N words of length L.",
  code: {
    c: `class Trie {
  constructor() { this.root = {}; }
  insert(word) {
    let node = this.root;
    for (const ch of word) node = node[ch] = node[ch] || {};
    node.end = true;
  }
  walk(s) {
    let node = this.root;
    for (const ch of s) { node = node[ch]; if (!node) return null; }
    return node;
  }
  search(word) { const n = this.walk(word); return !!(n && n.end); }
  startsWith(prefix) { return this.walk(prefix) !== null; }
}
const t = new Trie();
["car", "cart", "cat", "dog"].forEach(w => t.insert(w));
console.log(t.search("car"), t.search("ca"));
console.log(t.startsWith("ca"), t.startsWith("do"), t.startsWith("x"));`,
    hl: [5, 10],
    ex: { 5: "Create the child if it's missing, then step into it.", 6: "Mark where a word ends: 'ca' is a prefix here, not a word.", 10: "A missing child means no stored word continues this way.", 13: "A whole word must end exactly at the last node." }
  },
  examples: [
    { lvl: "Easy", title: "Count words with a prefix", prob: "After inserting words, answer 'how many words start with p?' quickly.", idea: "Store a counter in every node: how many inserted words pass through it.", c: `function buildCounts(words) {
  const root = { cnt: 0 };
  for (const w of words) {
    let node = root;
    for (const ch of w) { node = node[ch] = node[ch] || { cnt: 0 }; node.cnt++; }
  }
  return prefix => {
    let node = root;
    for (const ch of prefix) { node = node[ch]; if (!node) return 0; }
    return node.cnt;
  };
}
const count = buildCounts(["apple", "app", "apply", "bat"]);
console.log(count("app"), count("appl"), count("b"), count("z"));`, time: "O(L) per query", space: "O(total characters)", ex: { 5: "Every word passing through a node bumps its counter.", 10: "The counter at the prefix's last node is the answer." } },
    { lvl: "Practical", title: "Replace words with their shortest root", prob: "Replace each word in a sentence with the shortest dictionary root it starts with.", idea: "Walk each word through a trie of roots and stop at the first node marked end.", c: `function replaceWords(roots, sentence) {
  const trie = {};
  for (const r of roots) {
    let node = trie;
    for (const ch of r) node = node[ch] = node[ch] || {};
    node.end = true;
  }
  return sentence.split(" ").map(w => {
    let node = trie;
    for (let i = 0; i < w.length; i++) {
      node = node[w[i]];
      if (!node) break;
      if (node.end) return w.slice(0, i + 1);
    }
    return w;
  }).join(" ");
}
console.log(replaceWords(["cat", "bat", "rat"], "the cattle was rattled by the battery"));`, time: "O(total length)", space: "O(roots' characters)", ex: { 13: "The first root found is the shortest one.", 15: "No root matched: keep the word." } },
    { lvl: "Interview", title: "Add and search words with '.' wildcards", prob: "Support addWord and search, where '.' matches any letter.", idea: "A normal letter follows one child. A '.' tries every child with DFS, and a branch is abandoned as soon as it can't continue.", c: `class WordDictionary {
  constructor() { this.root = {}; }
  addWord(w) {
    let node = this.root;
    for (const ch of w) node = node[ch] = node[ch] || {};
    node.end = true;
  }
  search(w, i = 0, node = this.root) {
    if (i === w.length) return !!node.end;
    if (w[i] === ".") {
      for (const k in node) if (k !== "end" && this.search(w, i + 1, node[k])) return true;
      return false;
    }
    return !!node[w[i]] && this.search(w, i + 1, node[w[i]]);
  }
}
const d = new WordDictionary();
["bad", "dad", "mad"].forEach(w => d.addWord(w));
console.log(d.search("pad"), d.search(".ad"), d.search("b.."), d.search("b."));`, time: "O(L) without dots; up to O(26^dots · L)", space: "O(total characters)", ex: { 9: "At the end of the pattern, it is a match only if a word ends here.", 11: "A wildcard tries every child (skipping the 'end' flag)." } }
  ],
  signals: [["\"prefix\", \"starts with\", \"autocomplete\"", "Trie"], ["many words searched on one grid", "Trie + DFS (Word Search II)"], ["'.' or '?' wildcards in word lookups", "Trie + DFS over children"], ["\"maximum XOR of two numbers\"", "Binary trie (bits as letters)"], ["\"shortest root\", \"replace with root\"", "Trie walk, stop at the first end"]],
  mistakes: [["Treating a prefix as a word", "Use an end flag; 'app' existing as a path doesn't mean 'app' was inserted."], ["Building a trie when a Set would do", "Exact lookups only? A Set is simpler and faster."], ["Restarting the walk from the root for every grid step", "Carry the current trie node through the DFS."], ["Letting the 'end' key collide with child keys", "Use a key that can't be a letter, or a separate flag property."]],
  js: ["Plain objects work well as trie nodes: node[ch] = node[ch] || {}.", "for…in over a node also lists the 'end' flag: skip it."],
  iq: { Beginner: ["Insert words and check whether a word exists"], Easy: ["longest-common-prefix"], Medium: ["implement-trie", "add-search-words", "replace-words", "search-suggestions", "longest-word-dictionary", "max-xor-two-numbers"], Hard: ["word-search-ii"] },
  rev: { s30: "A tree of characters: shared prefixes share nodes. insert, search and startsWith are O(L). Use it for prefix questions, autocomplete and multi-word grid searches.", m2: ["Node = children map + end flag", "search needs end = true; startsWith doesn't", "Counters in nodes answer 'how many start with…'", "Wildcards → DFS over children", "Binary trie → max XOR"] },
  cheat: `TRIE CHEAT SHEET

insert(w): node=root; for ch: node = node[ch] ||= {}; node.end = true
search(w): walk; return node && node.end
startsWith(p): walk; return node != null

O(L) per operation

Think Trie when:
→ prefix / autocomplete
→ many words on one grid
→ wildcard word search
→ max XOR (binary trie)`
};

export default trie;
