import type { Lesson } from "@/lib/types";

const bitManipulation: Lesson = {
  what: "Bit manipulation works directly on the binary digits (bits) of numbers with operators like AND (&), OR (|), XOR (^), NOT (~) and shifts (<<, >>). Many tricks turn loops and extra memory into a single operation.",
  analogy: { short: "A row of light switches", text: "A number is a row of switches, each on (1) or off (0). AND keeps a light on only if it's on in both rows, OR turns it on if it's on in either, XOR turns it on if the rows differ, and shifting slides every switch left or right." },
  eli5: "Numbers are secretly made of tiny on/off switches. Bit tricks flip, check and compare those switches really fast.",
  tech: "Key facts: x & 1 tells odd/even; (x >> k) & 1 reads bit k; x | (1 << k) sets it; x & ~(1 << k) clears it; x ^ (1 << k) flips it. x & (x − 1) removes the lowest set bit (so x is a power of two when the result is 0); x & −x isolates it. XOR is its own inverse: x ^ x = 0 and x ^ 0 = x, so XOR-ing a list cancels every pair. A bitmask of n bits represents a subset of n items, giving 2ⁿ subsets as the numbers 0 … 2ⁿ − 1. In JavaScript, bitwise operators work on 32-bit signed integers; use >>> 0 for unsigned results and BigInt beyond 32 bits.",
  why: "Interviewers love bit tricks for O(1)-space solutions: finding the single number, counting bits, checking powers of two, generating subsets, and compact state in bitmask DP.",
  how: ["Write numbers in binary to see what's happening (n.toString(2)).", "Test, set, clear or flip bit k with masks built by 1 << k.", "Use XOR to cancel pairs or to find differences.", "Use x & (x − 1) to count or strip set bits.", "Use the integers 0 … 2ⁿ − 1 as bitmasks to enumerate subsets."],
  props: ["x ^ x = 0, x ^ 0 = x, XOR is commutative", "x & (x − 1) drops the lowest 1-bit", "x & −x keeps only the lowest 1-bit", "1 << k is 2ᵏ", "JS bitwise ops are 32-bit signed"],
  use: ["Single / missing number problems", "Counting set bits", "Power-of-two checks", "Enumerating subsets with bitmasks", "Compact sets of small items (letters, visited states)"],
  avoid: ["Numbers beyond 32 bits in plain JS bitwise operators (use BigInt)", "When readable arithmetic is just as fast"],
  viz: "array",
  cx: [["Any single bit operation", "O(1)", "One machine operation."], ["Count bits with x & (x − 1)", "O(number of set bits)", "One step per 1-bit."], ["All subsets via bitmasks", "O(2ⁿ · n)", "2ⁿ masks, n bits each."]],
  space: "O(1) for the tricks; O(2ⁿ) if you store every subset.",
  code: {
    c: `const n = 13;
console.log(n.toString(2));
console.log(n & 1, (n >> 2) & 1);
console.log((n | (1 << 1)).toString(2), (n & ~(1 << 2)).toString(2));
console.log(n & (n - 1), n & -n);
let bits = 0, x = n;
while (x) { x &= x - 1; bits++; }
console.log(bits);
console.log(5 ^ 5, 5 ^ 0, 6 ^ 3);`,
    hl: [5, 7],
    ex: { 2: "13 in binary is 1101.", 3: "n & 1 = 1 means odd. (n >> k) & 1 reads bit k.", 4: "Set bit k with | (1 << k); clear it with & ~(1 << k).", 5: "n & (n − 1) removes the lowest 1-bit; n & −n keeps only that bit.", 7: "Kernighan: each step removes one 1-bit, so the loop runs once per set bit.", 9: "x ^ x = 0 and x ^ 0 = x, so equal values cancel out." }
  },
  examples: [
    { lvl: "Easy", title: "Single number", prob: "Every value appears twice except one. Find it in O(1) space.", idea: "XOR all values: pairs cancel to 0, leaving the single one.", c: `function singleNumber(nums) {
  return nums.reduce((acc, x) => acc ^ x, 0);
}
console.log(singleNumber([4, 1, 2, 1, 2]), singleNumber([7]));`, time: "O(n)", space: "O(1)", ex: { 2: "4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1 ^ 1) ^ (2 ^ 2) = 4." } },
    { lvl: "Practical", title: "All subsets with bitmasks", prob: "List every subset of a small array.", idea: "Each number from 0 to 2ⁿ − 1 is a bitmask: bit i set means 'include item i'.", c: `function subsets(nums) {
  const out = [];
  for (let mask = 0; mask < 1 << nums.length; mask++) {
    const sub = [];
    for (let i = 0; i < nums.length; i++) if (mask & (1 << i)) sub.push(nums[i]);
    out.push(sub);
  }
  return out;
}
console.log(subsets(["a", "b", "c"]));`, time: "O(2ⁿ · n)", space: "O(2ⁿ · n) for the output", ex: { 3: "1 << n is 2ⁿ: the number of subsets.", 5: "Is bit i on in this mask? Then item i is in the subset." } },
    { lvl: "Interview", title: "Two single numbers", prob: "Exactly two values appear once and all others twice. Find both in O(1) space.", idea: "XOR everything to get a ^ b. Any set bit of it differs between a and b; split all numbers by that bit and XOR each group separately.", c: `function singleNumberIII(nums) {
  const xor = nums.reduce((a, b) => a ^ b, 0);
  const low = xor & -xor;
  let a = 0, b = 0;
  for (const x of nums) {
    if (x & low) a ^= x;
    else b ^= x;
  }
  return [a, b];
}
console.log(singleNumberIII([1, 2, 1, 3, 2, 5]));`, time: "O(n)", space: "O(1)", ex: { 2: "Pairs cancel, leaving a ^ b (here 3 ^ 5 = 6).", 3: "The lowest bit where a and b differ.", 6: "Each pair lands in the same group and cancels; a and b land in different groups." } }
  ],
  signals: [["\"appears twice except one\", O(1) space", "XOR everything"], ["\"count the 1 bits\", \"Hamming\"", "x & (x − 1) or bit loops"], ["\"power of two\"", "x > 0 && (x & (x − 1)) === 0"], ["n ≤ ~20 and \"all subsets\" / \"visited set\"", "Bitmask enumeration or bitmask DP"], ["\"without + or −\"", "XOR for the sum, AND << 1 for the carry"]],
  mistakes: [["Forgetting operator precedence", "& and | bind looser than ===: write (x & 1) === 0 with parentheses."], ["Expecting 64-bit results in JS", "Bitwise operators truncate to 32-bit signed integers; use >>> 0 or BigInt."], ["Using >> on negative numbers for unsigned work", ">> keeps the sign; >>> fills with zeros."], ["1 << 31 being negative", "In JS it's −2147483648; use 2 ** 31 for the value."]],
  js: ["n.toString(2) shows binary; parseInt('1101', 2) reads it.", ">>> 0 converts to an unsigned 32-bit integer.", "BigInt (123n) supports bitwise operators without the 32-bit limit."],
  iq: { Beginner: ["Check whether a number is even using bits"], Easy: ["single-number", "number-of-1-bits", "counting-bits", "hamming-distance", "power-of-two", "missing-number", "reverse-bits"], Medium: ["single-number-ii", "single-number-iii", "bitwise-and-range", "sum-two-integers", "gray-code", "max-xor-two-numbers"], Hard: ["Minimum XOR sum of two arrays (bitmask DP)"] },
  rev: { s30: "Work on bits with & | ^ ~ << >>. XOR cancels pairs, x & (x − 1) drops the lowest set bit, masks enumerate subsets. JS bitwise ops are 32-bit.", m2: ["Test bit k: (x >> k) & 1", "Set / clear: | (1 << k), & ~(1 << k)", "x & (x − 1): drop lowest 1", "XOR pairs cancel", "Masks 0…2ⁿ − 1 = all subsets"] },
  cheat: `BIT MANIPULATION CHEAT SHEET

test k:   (x >> k) & 1
set k:    x | (1 << k)
clear k:  x & ~(1 << k)
flip k:   x ^ (1 << k)
lowest 1: x & -x      drop it: x & (x - 1)
power of 2: x > 0 && !(x & (x - 1))

x ^ x = 0, x ^ 0 = x
subsets: for mask in 0..(1<<n)-1
JS: 32-bit signed; >>> 0 for unsigned`
};

export default bitManipulation;
