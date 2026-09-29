import type { ProblemDef } from "@/lib/types";

/** Bit manipulation, math, string processing and system-design style classes. */
export const BITS_MATH_DESIGN: ProblemDef[] = [
  {
    id: "number-of-1-bits", t: "Number of 1 Bits", d: "E", tp: ["bit-manipulation"], pt: ["bit-manipulation"], co: ["Apple", "Microsoft", "Amazon"], lc: "number-of-1-bits",
    s: "Return the number of set bits in the binary form of n (a non-negative 32-bit integer).", h: ["Check the lowest bit and shift.", "n & (n - 1) removes the lowest set bit: count how many times until 0."],
    a: "Brian Kernighan's trick.", tc: "O(set bits)", sc: "O(1)", sim: ["counting-bits", "hamming-distance", "power-of-two"],
    fn: "hammingWeight", params: "n:number", ret: "number",
    ex: [[11, 3], [128, 1], [2147483645, 30]], hid: [[0], [1], [4294967295]],
    code: `function hammingWeight(n) {
  let count = 0;
  while (n) { n = (n & (n - 1)) >>> 0; count++; }
  return count;
}`
  },
  {
    id: "counting-bits", t: "Counting Bits", d: "E", tp: ["bit-manipulation", "dp"], pt: ["bit-manipulation", "dp"], co: ["Amazon", "Apple", "Adobe"], lc: "counting-bits",
    s: "Return an array ans where ans[i] is the number of 1 bits in i, for 0 ≤ i ≤ n, in O(n).", h: ["i >> 1 has the same bits as i except the last one.", "ans[i] = ans[i >> 1] + (i & 1)."],
    a: "DP from the shifted value.", tc: "O(n)", sc: "O(n)", sim: ["number-of-1-bits", "kth-symbol-grammar"],
    fn: "countBits", params: "n:number", ret: "number[]",
    ex: [[2, [0, 1, 1]], [5, [0, 1, 1, 2, 1, 2]]], hid: [[0], [16]],
    code: `function countBits(n) {
  const ans = [0];
  for (let i = 1; i <= n; i++) ans.push(ans[i >> 1] + (i & 1));
  return ans;
}`
  },
  {
    id: "reverse-bits", t: "Reverse Bits", d: "E", tp: ["bit-manipulation"], pt: ["bit-manipulation"], co: ["Apple", "Airbnb", "Amazon"], lc: "reverse-bits",
    s: "Reverse the bits of a 32-bit unsigned integer and return it as an unsigned value.", h: ["Take the lowest bit of n and push it onto the result 32 times.", "In JS use >>> 0 to keep values unsigned."],
    a: "Bit-by-bit shift.", tc: "O(32)", sc: "O(1)", sim: ["number-of-1-bits", "reverse-integer"],
    fn: "reverseBits", params: "n:number", ret: "number",
    ex: [[43261596, 964176192], [4294967293, 3221225471]], hid: [[0], [1], [4294967295]],
    code: `function reverseBits(n) {
  let res = 0;
  for (let i = 0; i < 32; i++) { res = ((res << 1) | (n & 1)) >>> 0; n >>>= 1; }
  return res;
}`
  },
  {
    id: "sum-two-integers", t: "Sum of Two Integers", d: "M", tp: ["bit-manipulation", "math-basics"], pt: ["bit-manipulation"], co: ["Meta", "Microsoft", "Amazon"], lc: "sum-of-two-integers",
    s: "Return a + b without using + or -.", h: ["XOR adds without carry; AND then shift left gives the carry.", "Repeat until there is no carry."],
    a: "Iterative XOR/AND-carry addition (32-bit).", tc: "O(32)", sc: "O(1)", sim: ["add-binary", "single-number"],
    fn: "getSum", params: "a:number, b:number", ret: "number",
    ex: [[1, 2, 3], [2, 3, 5]], hid: [[-2, 3], [0, 0], [-1000, 1000], [-12, -8]],
    code: `function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`
  },
  {
    id: "single-number-ii", t: "Single Number II", d: "M", tp: ["bit-manipulation", "arrays"], pt: ["bit-manipulation"], co: ["Google", "Amazon"], lc: "single-number-ii",
    s: "Every element appears three times except one. Find it in O(n) time and O(1) space.", h: ["Count each bit position modulo 3.", "Or keep 'ones' and 'twos' masks."],
    a: "ones/twos bitmask state machine.", tc: "O(n)", sc: "O(1)", sim: ["single-number", "single-number-iii"],
    fn: "singleNumber", params: "nums:number[]", ret: "number",
    ex: [[[2, 2, 3, 2], 3], [[0, 1, 0, 1, 0, 1, 99], 99]], hid: [[[7]], [[-2, -2, 1, 1, 4, 1, 4, 4, -4, -2]]],
    code: `function singleNumber(nums) {
  let ones = 0, twos = 0;
  for (const x of nums) {
    ones = (ones ^ x) & ~twos;
    twos = (twos ^ x) & ~ones;
  }
  return ones;
}`
  },
  {
    id: "single-number-iii", t: "Single Number III", d: "M", tp: ["bit-manipulation", "hashing"], pt: ["bit-manipulation"], co: ["Amazon", "Google"], lc: "single-number-iii",
    s: "Exactly two elements appear once; all others twice. Return the two (any order).", h: ["XOR of everything = a ^ b, which is non-zero.", "Split numbers by one set bit of a ^ b; each group XORs to one answer."],
    a: "XOR + partition by the lowest differing bit.", tc: "O(n)", sc: "O(1)", sim: ["single-number", "single-number-ii"],
    fn: "singleNumber", params: "nums:number[]", ret: "number[]", cmp: "unordered",
    ex: [[[1, 2, 1, 3, 2, 5], [3, 5]], [[-1, 0], [-1, 0]], [[0, 1], [1, 0]]], hid: [[[4, 4, 7, 9]], [[1, 1, 2, 2, 100, -100]]],
    code: `function singleNumber(nums) {
  const x = nums.reduce((a, b) => a ^ b, 0);
  const bit = x & -x;
  let a = 0, b = 0;
  for (const n of nums) if (n & bit) a ^= n; else b ^= n;
  return [a, b];
}`
  },
  {
    id: "hamming-distance", t: "Hamming Distance", d: "E", tp: ["bit-manipulation"], pt: ["bit-manipulation"], co: ["Meta", "Adobe"], lc: "hamming-distance",
    s: "Return the number of positions where the bits of x and y differ.", h: ["x ^ y has a 1 exactly where they differ.", "Count its set bits."],
    a: "Popcount of XOR.", tc: "O(1)", sc: "O(1)", sim: ["number-of-1-bits"],
    fn: "hammingDistance", params: "x:number, y:number", ret: "number",
    ex: [[1, 4, 2], [3, 1, 1]], hid: [[0, 0], [2147483647, 0]],
    code: `function hammingDistance(x, y) {
  let v = x ^ y, c = 0;
  while (v) { v &= v - 1; c++; }
  return c;
}`
  },
  {
    id: "bitwise-and-range", t: "Bitwise AND of Numbers Range", d: "M", tp: ["bit-manipulation", "math-basics"], pt: ["bit-manipulation"], co: ["Amazon", "Google"], lc: "bitwise-and-of-numbers-range",
    s: "Return the bitwise AND of every number in [left, right].", h: ["Any bit that changes within the range becomes 0.", "The answer is the common binary prefix of left and right."],
    a: "Shift both right until equal, then shift back.", tc: "O(32)", sc: "O(1)", sim: ["number-of-1-bits", "counting-bits"],
    fn: "rangeBitwiseAnd", params: "left:number, right:number", ret: "number",
    ex: [[5, 7, 4], [0, 0, 0], [1, 2147483647, 0]], hid: [[6, 7], [12, 15], [600000000, 2147483645]],
    code: `function rangeBitwiseAnd(left, right) {
  let shift = 0;
  while (left !== right) { left >>>= 1; right >>>= 1; shift++; }
  return (left << shift) >>> 0;
}`
  },
  {
    id: "reverse-integer", t: "Reverse Integer", d: "M", tp: ["math-basics"], pt: ["bit-manipulation"], co: ["Amazon", "Bloomberg", "Apple", "Adobe"], lc: "reverse-integer",
    s: "Reverse the digits of a signed 32-bit integer; return 0 if the result overflows [-2³¹, 2³¹ - 1].", h: ["Pop digits with % 10 and push them onto the result.", "Check the range at the end (JS numbers are 64-bit floats)."],
    a: "Digit popping with a range check.", tc: "O(log x)", sc: "O(1)", sim: ["palindrome-number", "string-to-integer-atoi"],
    fn: "reverse", params: "x:number", ret: "number",
    ex: [[123, 321], [-123, -321], [120, 21]], hid: [[0], [1534236469], [-2147483648], [1463847412]],
    code: `function reverse(x) {
  let r = 0, v = Math.abs(x);
  while (v) { r = r * 10 + (v % 10); v = Math.floor(v / 10); }
  r = x < 0 ? -r : r;
  return r < -(2 ** 31) || r > 2 ** 31 - 1 ? 0 : r;
}`
  },
  {
    id: "palindrome-number", t: "Palindrome Number", d: "E", tp: ["math-basics"], pt: ["two-pointers"], co: ["Amazon", "Meta", "Microsoft"], lc: "palindrome-number",
    s: "Is the integer a palindrome, without converting it to a string?", h: ["Negatives and numbers ending in 0 (except 0) aren't.", "Reverse only half of the digits and compare."],
    a: "Reverse the second half numerically.", tc: "O(log x)", sc: "O(1)", sim: ["reverse-integer", "valid-palindrome"],
    fn: "isPalindrome", params: "x:number", ret: "boolean",
    ex: [[121, true], [-121, false], [10, false]], hid: [[0], [1221], [123321], [1000021]],
    code: `function isPalindrome(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let half = 0;
  while (x > half) { half = half * 10 + (x % 10); x = Math.floor(x / 10); }
  return x === half || x === Math.floor(half / 10);
}`
  },
  {
    id: "roman-to-integer", t: "Roman to Integer", d: "E", tp: ["hashing", "strings", "math-basics"], pt: ["hashing"], co: ["Amazon", "Microsoft", "Meta", "Adobe"], lc: "roman-to-integer",
    s: "Convert a Roman numeral to an integer.", h: ["Map each symbol to a value.", "If a symbol is smaller than the next one, subtract it."],
    a: "Single pass comparing with the next symbol.", tc: "O(n)", sc: "O(1)", sim: ["integer-to-roman"],
    fn: "romanToInt", params: "s:string", ret: "number",
    ex: [["III", 3], ["LVIII", 58], ["MCMXCIV", 1994]], hid: [["IV"], ["MMMCMXCIX"], ["XLIX"]],
    code: `function romanToInt(s) {
  const v = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) total += v[s[i]] < (v[s[i + 1]] || 0) ? -v[s[i]] : v[s[i]];
  return total;
}`
  },
  {
    id: "integer-to-roman", t: "Integer to Roman", d: "M", tp: ["greedy", "math-basics", "strings"], pt: ["greedy"], co: ["Amazon", "Microsoft", "Bloomberg"], lc: "integer-to-roman",
    s: "Convert an integer (1–3999) to a Roman numeral.", h: ["Include the subtractive pairs (CM, CD, XC, XL, IX, IV) in the value table.", "Greedily take the largest value that fits."],
    a: "Greedy over a 13-entry table.", tc: "O(1)", sc: "O(1)", sim: ["roman-to-integer", "coin-change"],
    fn: "intToRoman", params: "num:number", ret: "string",
    ex: [[3749, "MMMDCCXLIX"], [58, "LVIII"], [1994, "MCMXCIV"]], hid: [[1], [3999], [444]],
    code: `function intToRoman(num) {
  const t = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let out = "";
  for (const [v, s] of t) while (num >= v) { out += s; num -= v; }
  return out;
}`
  },
  {
    id: "count-primes", t: "Count Primes", d: "M", tp: ["math-basics", "arrays"], pt: ["hashing"], co: ["Amazon", "Microsoft", "Apple"], lc: "count-primes",
    s: "Count primes strictly less than n.", h: ["Trial division for every number is too slow.", "Sieve of Eratosthenes: cross out multiples starting at p²."],
    a: "Sieve.", tc: "O(n log log n)", sc: "O(n)", sim: ["ugly-number-ii", "happy-number"],
    fn: "countPrimes", params: "n:number", ret: "number",
    ex: [[10, 4], [0, 0], [1, 0]], hid: [[2], [3], [1000000]],
    code: `function countPrimes(n) {
  if (n < 3) return 0;
  const comp = new Uint8Array(n);
  let count = 0;
  for (let i = 2; i < n; i++) {
    if (comp[i]) continue;
    count++;
    for (let j = i * i; j < n; j += i) comp[j] = 1;
  }
  return count;
}`
  },
  {
    id: "gcd-of-strings", t: "Greatest Common Divisor of Strings", d: "E", tp: ["strings", "math-basics"], pt: ["recursion"], co: ["Amazon", "Microsoft"], lc: "greatest-common-divisor-of-strings",
    s: "Return the longest string x such that both str1 and str2 are x repeated some number of times.", h: ["If str1 + str2 !== str2 + str1, no answer exists.", "Otherwise the answer has length gcd(len1, len2)."],
    a: "Concatenation check + numeric gcd.", tc: "O(m + n)", sc: "O(m + n)", sim: ["repeated-substring-pattern"],
    fn: "gcdOfStrings", params: "str1:string, str2:string", ret: "string",
    ex: [["ABCABC", "ABC", "ABC"], ["ABABAB", "ABAB", "AB"], ["LEET", "CODE", ""]], hid: [["A", "A"], ["TAUXXTAUXXTAUXXTAUXXTAUXX", "TAUXXTAUXXTAUXXTAUXXTAUXXTAUXXTAUXXTAUXXTAUXX"]],
    code: `function gcdOfStrings(str1, str2) {
  if (str1 + str2 !== str2 + str1) return "";
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  return str1.slice(0, gcd(str1.length, str2.length));
}`
  },
  {
    id: "excel-column-title", t: "Excel Sheet Column Title", d: "E", tp: ["math-basics", "strings"], pt: ["recursion"], co: ["Microsoft", "Amazon", "Meta"], lc: "excel-sheet-column-title",
    s: "Convert a column number to its Excel title (1 → A, 28 → AB).", h: ["It's base 26 but without a zero digit.", "Subtract 1 before each % 26."],
    a: "Bijective base-26 conversion.", tc: "O(log n)", sc: "O(1)", sim: ["excel-column-number", "integer-to-roman"],
    fn: "convertToTitle", params: "columnNumber:number", ret: "string",
    ex: [[1, "A"], [28, "AB"], [701, "ZY"]], hid: [[26], [52], [2147483647]],
    code: `function convertToTitle(columnNumber) {
  let s = "";
  while (columnNumber > 0) {
    columnNumber--;
    s = String.fromCharCode(65 + (columnNumber % 26)) + s;
    columnNumber = Math.floor(columnNumber / 26);
  }
  return s;
}`
  },
  {
    id: "excel-column-number", t: "Excel Sheet Column Number", d: "E", tp: ["math-basics", "strings"], pt: ["hashing"], co: ["Microsoft", "Amazon"], lc: "excel-sheet-column-number",
    s: "Convert an Excel column title to its number.", h: ["Read left to right like a base-26 number.", "value = value · 26 + (letter - 'A' + 1)."],
    a: "Horner's rule.", tc: "O(n)", sc: "O(1)", sim: ["excel-column-title", "binary-list-to-integer"],
    fn: "titleToNumber", params: "columnTitle:string", ret: "number",
    ex: [["A", 1], ["AB", 28], ["ZY", 701]], hid: [["FXSHRXW"], ["Z"]],
    code: `function titleToNumber(columnTitle) {
  let v = 0;
  for (const c of columnTitle) v = v * 26 + (c.charCodeAt(0) - 64);
  return v;
}`
  },
  {
    id: "multiply-strings", t: "Multiply Strings", d: "M", tp: ["math-basics", "strings"], pt: ["two-pointers"], co: ["Meta", "Amazon", "Microsoft", "Uber"], lc: "multiply-strings",
    s: "Multiply two non-negative integers given as strings, without converting them to numbers.", h: ["Digit i of num1 times digit j of num2 lands at positions i + j and i + j + 1.", "Accumulate into an array, then handle carries."],
    a: "Grade-school multiplication into a position array.", tc: "O(mn)", sc: "O(m + n)", sim: ["add-binary", "add-two-numbers", "plus-one"],
    fn: "multiply", params: "num1:string, num2:string", ret: "string",
    ex: [["2", "3", "6"], ["123", "456", "56088"]], hid: [["0", "52"], ["999", "999"], ["123456789", "987654321"]],
    code: `function multiply(num1, num2) {
  const m = num1.length, n = num2.length, res = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) {
    const sum = res[i + j + 1] + Number(num1[i]) * Number(num2[j]);
    res[i + j + 1] = sum % 10;
    res[i + j] += Math.floor(sum / 10);
  }
  const s = res.join("").replace(/^0+/, "");
  return s || "0";
}`
  },
  {
    id: "add-binary", t: "Add Binary", d: "E", tp: ["math-basics", "strings", "bit-manipulation"], pt: ["two-pointers", "bit-manipulation"], co: ["Meta", "Amazon", "Microsoft"], lc: "add-binary",
    s: "Return the sum of two binary strings as a binary string.", h: ["Walk both strings from the end with a carry.", "Each step: sum = a + b + carry; digit = sum % 2."],
    a: "Two pointers from the right.", tc: "O(max(m, n))", sc: "O(max(m, n))", sim: ["add-two-numbers", "plus-one", "multiply-strings"],
    fn: "addBinary", params: "a:string, b:string", ret: "string",
    ex: [["11", "1", "100"], ["1010", "1011", "10101"]], hid: [["0", "0"], ["1111", "1111"], ["10100000100100110110010000010101111011011001101110111111111101000000101111001110001111100001101", "110101001011101110001111100110001010100001101011101010000011011011001011101111001100000011011110011"]],
    code: `function addBinary(a, b) {
  let i = a.length - 1, j = b.length - 1, carry = 0, out = [];
  while (i >= 0 || j >= 0 || carry) {
    const s = (i >= 0 ? Number(a[i--]) : 0) + (j >= 0 ? Number(b[j--]) : 0) + carry;
    out.push(s % 2); carry = s >> 1;
  }
  return out.reverse().join("");
}`
  },
  {
    id: "string-to-integer-atoi", t: "String to Integer (atoi)", d: "M", tp: ["strings", "math-basics"], pt: ["two-pointers"], co: ["Amazon", "Meta", "Microsoft", "Bloomberg"], lc: "string-to-integer-atoi",
    s: "Parse: skip leading spaces, optional sign, read digits until a non-digit, clamp to 32-bit range.", h: ["Follow the steps in order with an index.", "Clamp at the end (or while reading)."],
    a: "Index-based parsing with clamping.", tc: "O(n)", sc: "O(1)", sim: ["reverse-integer", "valid-number"],
    fn: "myAtoi", params: "s:string", ret: "number",
    ex: [["42", 42], [" -042", -42], ["1337c0d3", 1337], ["0-1", 0], ["words and 987", 0]], hid: [["-91283472332"], ["+-12"], ["   +0 123"], ["21474836460"]],
    code: `function myAtoi(s) {
  let i = 0, sign = 1, num = 0;
  while (s[i] === " ") i++;
  if (s[i] === "+" || s[i] === "-") { if (s[i] === "-") sign = -1; i++; }
  while (i < s.length && s[i] >= "0" && s[i] <= "9") num = num * 10 + Number(s[i++]);
  num *= sign;
  return Math.max(-(2 ** 31), Math.min(2 ** 31 - 1, num)) + 0;
}`
  },
  {
    id: "zigzag-conversion", t: "Zigzag Conversion", d: "M", tp: ["strings"], pt: ["two-pointers"], co: ["Amazon", "Adobe", "PayPal"], lc: "zigzag-conversion",
    s: "Write s in a zigzag over numRows rows, then read row by row.", h: ["Simulate: keep a current row and a direction.", "Flip direction at the top and bottom rows."],
    a: "Row buckets with a bouncing index.", tc: "O(n)", sc: "O(n)", sim: ["spiral-matrix"],
    fn: "convert", params: "s:string, numRows:number", ret: "string",
    ex: [["PAYPALISHIRING", 3, "PAHNAPLSIIGYIR"], ["PAYPALISHIRING", 4, "PINALSIGYAHRPI"], ["A", 1, "A"]], hid: [["AB", 1], ["ABCDE", 5], ["ABCDEFG", 2]],
    code: `function convert(s, numRows) {
  if (numRows === 1) return s;
  const rows = Array.from({ length: numRows }, () => []);
  let r = 0, step = 1;
  for (const c of s) {
    rows[r].push(c);
    if (r === 0) step = 1; else if (r === numRows - 1) step = -1;
    r += step;
  }
  return rows.map(x => x.join("")).join("");
}`
  },
  {
    id: "str-str", t: "Find the Index of the First Occurrence in a String", d: "E", tp: ["strings", "two-pointers"], pt: ["two-pointers", "sliding-window"], co: ["Meta", "Microsoft", "Apple"], lc: "find-the-index-of-the-first-occurrence-in-a-string",
    s: "Return the first index where needle occurs in haystack, or -1 (without indexOf).", h: ["Compare needle at every start position: O(nm).", "KMP precomputes a failure table to reach O(n + m)."],
    a: "KMP with a prefix-function table.", tc: "O(n + m)", sc: "O(m)", sim: ["repeated-substring-pattern", "rotate-string"],
    fn: "strStr", params: "haystack:string, needle:string", ret: "number",
    ex: [["sadbutsad", "sad", 0], ["leetcode", "leeto", -1]], hid: [["a", "a"], ["mississippi", "issip"], ["aaaaab", "aab"]],
    code: `function strStr(haystack, needle) {
  const lps = [0];
  for (let i = 1, k = 0; i < needle.length; i++) {
    while (k && needle[i] !== needle[k]) k = lps[k - 1];
    if (needle[i] === needle[k]) k++;
    lps[i] = k;
  }
  for (let i = 0, k = 0; i < haystack.length; i++) {
    while (k && haystack[i] !== needle[k]) k = lps[k - 1];
    if (haystack[i] === needle[k]) k++;
    if (k === needle.length) return i - k + 1;
  }
  return -1;
}`
  },
  {
    id: "repeated-substring-pattern", t: "Repeated Substring Pattern", d: "E", tp: ["strings"], pt: ["two-pointers"], co: ["Amazon", "Google"], lc: "repeated-substring-pattern",
    s: "Can s be formed by repeating one of its substrings?", h: ["Try every divisor length of s.", "Trick: s is repeated iff s appears in (s + s) with the first and last characters removed."],
    a: "Doubling trick.", tc: "O(n) with a good search", sc: "O(n)", sim: ["gcd-of-strings", "str-str", "rotate-string"],
    fn: "repeatedSubstringPattern", params: "s:string", ret: "boolean",
    ex: [["abab", true], ["aba", false], ["abcabcabcabc", true]], hid: [["a"], ["aaaa"], ["abac"]],
    code: `function repeatedSubstringPattern(s) {
  return (s + s).slice(1, -1).includes(s);
}`
  },
  {
    id: "rotate-string", t: "Rotate String", d: "E", tp: ["strings"], pt: ["two-pointers"], co: ["Amazon", "Microsoft"], lc: "rotate-string",
    s: "Can s become goal after some number of left rotations?", h: ["All rotations of s appear inside s + s.", "Lengths must match."],
    a: "Length check + substring of s + s.", tc: "O(n)", sc: "O(n)", sim: ["repeated-substring-pattern", "rotate-array"],
    fn: "rotateString", params: "s:string, goal:string", ret: "boolean",
    ex: [["abcde", "cdeab", true], ["abcde", "abced", false]], hid: [["aa", "a"], ["", ""], ["bbbacddceeb", "ceebbbbacdd"]],
    code: `function rotateString(s, goal) {
  return s.length === goal.length && (s + s).includes(goal);
}`
  },
  {
    id: "count-and-say", t: "Count and Say", d: "M", tp: ["strings", "recursion"], pt: ["two-pointers"], co: ["Amazon", "Meta"], lc: "count-and-say",
    s: "countAndSay(1) = \"1\"; each next term reads the previous one aloud (e.g. \"21\" → \"1211\"). Return the n-th term.", h: ["Build terms one by one.", "Run-length encode each term: count followed by digit."],
    a: "Iterative run-length encoding.", tc: "O(total length)", sc: "O(length)", sim: ["string-compression"],
    fn: "countAndSay", params: "n:number", ret: "string",
    ex: [[1, "1"], [4, "1211"], [5, "111221"]], hid: [[2], [10]],
    code: `function countAndSay(n) {
  let s = "1";
  for (let k = 1; k < n; k++) {
    let next = "";
    for (let i = 0; i < s.length;) { let j = i; while (s[j] === s[i]) j++; next += (j - i) + s[i]; i = j; }
    s = next;
  }
  return s;
}`
  },
  {
    id: "string-compression", t: "String Compression (run-length)", d: "M", tp: ["strings", "two-pointers"], pt: ["two-pointers"], co: ["Microsoft", "Amazon", "Goldman Sachs"], lc: "string-compression",
    s: "Compress an array of characters in place: each run becomes the character followed by its count (only if > 1). Return the compressed array.", h: ["Read pointer walks runs; write pointer writes results.", "Write multi-digit counts one digit at a time."],
    a: "Read/write pointers.", tc: "O(n)", sc: "O(1)", note: "Return the compressed prefix, e.g. chars.slice(0, k).", sim: ["count-and-say", "remove-duplicates-sorted-ii"],
    fn: "compress", params: "chars:string[]", ret: "string[]",
    ex: [[["a", "a", "b", "b", "c", "c", "c"], ["a", "2", "b", "2", "c", "3"]], [["a"], ["a"]], [["a", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"], ["a", "b", "1", "2"]]], hid: [[["a", "a", "a", "b", "b", "a", "a"]], [["x", "y", "z"]]],
    code: `function compress(chars) {
  let w = 0;
  for (let i = 0; i < chars.length;) {
    let j = i;
    while (j < chars.length && chars[j] === chars[i]) j++;
    chars[w++] = chars[i];
    if (j - i > 1) for (const d of String(j - i)) chars[w++] = d;
    i = j;
  }
  return chars.slice(0, w);
}`
  },
  {
    id: "max-points-on-line", t: "Max Points on a Line", d: "H", tp: ["math-basics", "hashing"], pt: ["hashing"], co: ["LinkedIn", "Apple", "Google", "Amazon"], lc: "max-points-on-a-line",
    s: "Return the maximum number of points that lie on one straight line.", h: ["Fix one point and group the others by slope.", "Store slopes as reduced fractions (dy/g, dx/g) with a normalized sign to avoid float errors."],
    a: "Slope counting per anchor point.", tc: "O(n²)", sc: "O(n)", sim: ["group-anagrams", "brick-wall"],
    fn: "maxPoints", params: "points:number[][]", ret: "number",
    ex: [[[[1, 1], [2, 2], [3, 3]], 3], [[[1, 1], [3, 2], [5, 3], [4, 1], [2, 3], [1, 4]], 4]], hid: [[[[0, 0]]], [[[0, 0], [1, 1], [1, -1]]], [[[2, 3], [3, 3], [-5, 3]]]],
    code: `function maxPoints(points) {
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  let best = 1;
  for (let i = 0; i < points.length; i++) {
    const slopes = new Map();
    for (let j = i + 1; j < points.length; j++) {
      let dx = points[j][0] - points[i][0], dy = points[j][1] - points[i][1];
      const g = gcd(dx, dy) || 1;
      dx /= g; dy /= g;
      if (dx < 0 || (dx === 0 && dy < 0)) { dx = -dx; dy = -dy; }
      const key = dx + "/" + dy;
      slopes.set(key, (slopes.get(key) || 0) + 1);
      best = Math.max(best, slopes.get(key) + 1);
    }
  }
  return best;
}`
  },
  {
    id: "divide-two-integers", t: "Divide Two Integers", d: "M", tp: ["bit-manipulation", "math-basics", "binary-search"], pt: ["bit-manipulation"], co: ["Meta", "Microsoft", "Amazon"], lc: "divide-two-integers",
    s: "Divide without *, / or %, truncating toward zero; clamp overflow to 2³¹ - 1.", h: ["Subtract the largest shifted divisor (divisor · 2^k) that still fits.", "Work with absolute values and restore the sign at the end."],
    a: "Exponential (doubling) subtraction.", tc: "O(log² n)", sc: "O(1)", sim: ["pow-x-n", "sum-two-integers"],
    fn: "divide", params: "dividend:number, divisor:number", ret: "number",
    ex: [[10, 3, 3], [7, -3, -2], [-2147483648, -1, 2147483647]], hid: [[0, 5], [1, 1], [-2147483648, 1], [2147483647, 2]],
    code: `function divide(dividend, divisor) {
  if (dividend === -(2 ** 31) && divisor === -1) return 2 ** 31 - 1;
  const neg = (dividend < 0) !== (divisor < 0);
  let a = Math.abs(dividend), b = Math.abs(divisor), q = 0;
  while (a >= b) {
    let d = b, m = 1;
    while (a >= d + d) { d += d; m += m; }
    a -= d; q += m;
  }
  return neg ? -q : q;
}`
  },
  {
    id: "bulls-and-cows", t: "Bulls and Cows", d: "M", tp: ["hashing", "strings"], pt: ["frequency-counter"], co: ["Google", "Amazon"], lc: "bulls-and-cows",
    s: "Return the hint \"xAyB\": x bulls (right digit, right place) and y cows (right digit, wrong place).", h: ["Count bulls directly.", "For the rest, count digits in both and add min(count) per digit."],
    a: "Two frequency arrays.", tc: "O(n)", sc: "O(1)", sim: ["valid-anagram", "intersection-two-arrays-ii"],
    fn: "getHint", params: "secret:string, guess:string", ret: "string",
    ex: [["1807", "7810", "1A3B"], ["1123", "0111", "1A1B"]], hid: [["1", "0"], ["1122", "2211"], ["1234", "1234"]],
    code: `function getHint(secret, guess) {
  const a = new Array(10).fill(0), b = new Array(10).fill(0);
  let bulls = 0;
  for (let i = 0; i < secret.length; i++) {
    if (secret[i] === guess[i]) bulls++;
    else { a[secret[i]]++; b[guess[i]]++; }
  }
  let cows = 0;
  for (let d = 0; d < 10; d++) cows += Math.min(a[d], b[d]);
  return bulls + "A" + cows + "B";
}`
  },
  {
    id: "fizz-buzz", t: "Fizz Buzz", d: "E", tp: ["math-basics", "strings"], pt: ["hashing"], co: ["Apple", "Amazon", "Microsoft"], lc: "fizz-buzz",
    s: "For i = 1..n output \"FizzBuzz\" (divisible by 3 and 5), \"Fizz\" (3), \"Buzz\" (5), or the number as a string.", h: ["Check divisibility by 15 first.", "Or build the string from 'Fizz' and 'Buzz' pieces."],
    a: "Simple loop.", tc: "O(n)", sc: "O(1) extra", sim: ["count-and-say"],
    fn: "fizzBuzz", params: "n:number", ret: "string[]",
    ex: [[3, ["1", "2", "Fizz"]], [5, ["1", "2", "Fizz", "4", "Buzz"]]], hid: [[1], [15]],
    code: `function fizzBuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) out.push((i % 3 ? "" : "Fizz") + (i % 5 ? "" : "Buzz") || String(i));
  return out;
}`
  },
  {
    id: "group-shifted-strings", t: "Group Shifted Strings", d: "M", tp: ["hashing", "strings"], pt: ["hashing"], co: ["Meta", "Google", "Uber"], lc: "group-shifted-strings",
    s: "Strings that can shift into each other (abc → bcd → … → xyz, wrapping) belong together. Group them (any order).", h: ["Normalize each string by shifting it so it starts with 'a'.", "Use the normalized form as a Map key."],
    a: "Key = sequence of letter differences mod 26.", tc: "O(total chars)", sc: "O(total chars)", sim: ["group-anagrams", "isomorphic-strings"],
    fn: "groupStrings", params: "strings:string[]", ret: "string[][]", cmp: "groups",
    ex: [[["abc", "bcd", "acef", "xyz", "az", "ba", "a", "z"], [["acef"], ["a", "z"], ["abc", "bcd", "xyz"], ["az", "ba"]]], [["a"], [["a"]]]], hid: [[["ab", "ba", "zy", "yx"]], [["abc", "abd"]]],
    code: `function groupStrings(strings) {
  const groups = new Map();
  for (const s of strings) {
    const shift = s.charCodeAt(0);
    const key = [...s].map(c => (c.charCodeAt(0) - shift + 26) % 26).join(",");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return [...groups.values()];
}`
  },
  {
    id: "lfu-cache", t: "LFU Cache", d: "H", tp: ["hashing", "linked-list"], pt: ["hashing"], co: ["Amazon", "Google", "Microsoft"], lc: "lfu-cache",
    s: "Design LFUCache(capacity) with O(1) get and put; evict the least frequently used key (ties → least recently used).", h: ["Track each key's frequency and a minimum frequency.", "Map frequency → ordered set of keys (a JS Map keeps insertion order)."],
    a: "key→[value, freq] plus freq→Map of keys, with minFreq.", tc: "O(1)", sc: "O(capacity)", sim: ["lru-cache"],
    fn: "LFUCache", ctor: "capacity:number", methods: "get(key:number):number; put(key:number, value:number):void",
    ex: [[["LFUCache", "put", "put", "get", "put", "get", "get", "put", "get", "get", "get"], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [3], [4, 4], [1], [3], [4]], [null, null, null, 1, null, -1, 3, null, -1, 3, 4]]],
    hid: [[["LFUCache", "put", "get"], [[0], [0, 0], [0]]], [["LFUCache", "put", "put", "put", "put", "get"], [[2], [3, 1], [2, 1], [2, 2], [4, 4], [2]]]],
    code: `class LFUCache {
  constructor(capacity) { this.cap = capacity; this.vals = new Map(); this.freqs = new Map(); this.min = 0; }
  touch(key) {
    const [v, f] = this.vals.get(key);
    this.freqs.get(f).delete(key);
    if (!this.freqs.get(f).size && this.min === f) this.min++;
    if (!this.freqs.has(f + 1)) this.freqs.set(f + 1, new Map());
    this.freqs.get(f + 1).set(key, true);
    this.vals.set(key, [v, f + 1]);
  }
  get(key) { if (!this.vals.has(key)) return -1; this.touch(key); return this.vals.get(key)[0]; }
  put(key, value) {
    if (this.cap === 0) return;
    if (this.vals.has(key)) { this.vals.get(key)[0] = value; this.touch(key); return; }
    if (this.vals.size >= this.cap) {
      const victim = this.freqs.get(this.min).keys().next().value;
      this.freqs.get(this.min).delete(victim);
      this.vals.delete(victim);
    }
    this.vals.set(key, [value, 1]);
    if (!this.freqs.has(1)) this.freqs.set(1, new Map());
    this.freqs.get(1).set(key, true);
    this.min = 1;
  }
}`
  },
  {
    id: "randomized-set", t: "Insert Delete GetRandom O(1)", d: "M", tp: ["hashing", "arrays", "math-basics"], pt: ["hashing"], co: ["Amazon", "Meta", "Google", "Microsoft", "LinkedIn"], lc: "insert-delete-getrandom-o1",
    s: "Design RandomizedSet with insert, remove and getRandom, each O(1) on average. (The judge tests insert and remove; implement getRandom too.)", h: ["An array gives O(1) random access; a Map gives O(1) lookup of an index.", "Remove by swapping the element with the last one, then pop."],
    a: "Array + Map value → index with swap-delete.", tc: "O(1)", sc: "O(n)", sim: ["lru-cache", "contains-duplicate"],
    fn: "RandomizedSet", ctor: "", methods: "insert(val:number):boolean; remove(val:number):boolean; getRandom():number",
    ex: [[["RandomizedSet", "insert", "remove", "insert", "insert", "remove", "insert"], [[], [1], [2], [2], [1], [1], [2]], [null, true, false, true, false, true, false]]],
    hid: [[["RandomizedSet", "remove", "insert", "insert", "remove", "remove", "insert"], [[], [0], [0], [1], [0], [1], [0]]]],
    code: `class RandomizedSet {
  constructor() { this.a = []; this.pos = new Map(); }
  insert(val) { if (this.pos.has(val)) return false; this.pos.set(val, this.a.length); this.a.push(val); return true; }
  remove(val) {
    if (!this.pos.has(val)) return false;
    const i = this.pos.get(val), last = this.a[this.a.length - 1];
    this.a[i] = last; this.pos.set(last, i);
    this.a.pop(); this.pos.delete(val);
    return true;
  }
  getRandom() { return this.a[Math.floor(Math.random() * this.a.length)]; }
}`
  },
  {
    id: "design-hit-counter", t: "Design Hit Counter", d: "M", tp: ["queue", "binary-search", "hashing"], pt: ["sliding-window"], co: ["Dropbox", "Google", "Amazon"], lc: "design-hit-counter",
    s: "HitCounter records hit(timestamp) and getHits(timestamp) returns hits in the past 300 seconds. Timestamps are non-decreasing.", h: ["Keep timestamps in a queue.", "On getHits, drop timestamps ≤ timestamp - 300 from the front."],
    a: "Queue with a head pointer (sliding window over time).", tc: "O(1) amortized", sc: "O(hits in window)", sim: ["time-based-kv-store", "sliding-window-maximum"],
    fn: "HitCounter", ctor: "", methods: "hit(timestamp:number):void; getHits(timestamp:number):number",
    ex: [[["HitCounter", "hit", "hit", "hit", "getHits", "hit", "getHits", "getHits"], [[], [1], [2], [3], [4], [300], [300], [301]], [null, null, null, null, 3, null, 4, 3]]],
    hid: [[["HitCounter", "hit", "hit", "getHits", "getHits"], [[], [1], [1], [300], [301]]]],
    code: `class HitCounter {
  constructor() { this.q = []; this.head = 0; }
  hit(t) { this.q.push(t); }
  getHits(t) {
    while (this.head < this.q.length && this.q[this.head] <= t - 300) this.head++;
    return this.q.length - this.head;
  }
}`
  },
  {
    id: "design-twitter", t: "Design Twitter", d: "M", tp: ["hashing", "heap", "linked-list"], pt: ["top-k", "hashing"], co: ["Amazon", "Twitter", "Meta"], lc: "design-twitter",
    s: "Implement postTweet, getNewsFeed (10 most recent tweet ids from the user and people they follow), follow and unfollow.", h: ["Store each user's tweets with a global increasing timestamp.", "Merge the followees' recent tweets and take the 10 newest (a heap for efficiency)."],
    a: "Per-user tweet lists + k-way merge of recent tweets.", tc: "O(F log F) per feed", sc: "O(users + tweets)", sim: ["merge-k-sorted-lists", "top-k-frequent"],
    fn: "Twitter", ctor: "", methods: "postTweet(userId:number, tweetId:number):void; getNewsFeed(userId:number):number[]; follow(followerId:number, followeeId:number):void; unfollow(followerId:number, followeeId:number):void",
    ex: [[["Twitter", "postTweet", "getNewsFeed", "follow", "postTweet", "getNewsFeed", "unfollow", "getNewsFeed"], [[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]], [null, null, [5], null, null, [6, 5], null, [5]]]],
    hid: [[["Twitter", "postTweet", "postTweet", "postTweet", "postTweet", "postTweet", "postTweet", "postTweet", "postTweet", "postTweet", "postTweet", "postTweet", "getNewsFeed", "follow", "follow", "getNewsFeed"], [[], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10], [2, 11], [1], [1, 1], [1, 2], [1]]]],
    code: `class Twitter {
  constructor() { this.time = 0; this.tweets = new Map(); this.following = new Map(); }
  postTweet(userId, tweetId) {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId).push([this.time++, tweetId]);
  }
  getNewsFeed(userId) {
    const users = new Set([userId, ...(this.following.get(userId) || [])]);
    const all = [];
    for (const u of users) all.push(...(this.tweets.get(u) || []).slice(-10));
    return all.sort((a, b) => b[0] - a[0]).slice(0, 10).map(x => x[1]);
  }
  follow(a, b) { if (a === b) return; if (!this.following.has(a)) this.following.set(a, new Set()); this.following.get(a).add(b); }
  unfollow(a, b) { this.following.get(a)?.delete(b); }
}`
  },
  {
    id: "snapshot-array", t: "Snapshot Array", d: "M", tp: ["binary-search", "hashing", "arrays"], pt: ["binary-search"], co: ["Google", "Amazon"], lc: "snapshot-array",
    s: "SnapshotArray(length) supports set(index, val), snap() → snapshot id, and get(index, snap_id).", h: ["Copying the array on every snap is too slow.", "Per index, store a history of [snapId, value]; binary search on get."],
    a: "Per-index history + upper-bound binary search.", tc: "O(log snaps) get", sc: "O(sets)", sim: ["time-based-kv-store"],
    fn: "SnapshotArray", ctor: "length:number", methods: "set(index:number, val:number):void; snap():number; get(index:number, snap_id:number):number",
    ex: [[["SnapshotArray", "set", "snap", "set", "get"], [[3], [0, 5], [], [0, 6], [0, 0]], [null, null, 0, null, 5]]],
    hid: [[["SnapshotArray", "snap", "snap", "get", "set", "snap", "set", "get", "get"], [[4], [], [], [3, 1], [2, 4], [], [1, 4], [2, 2], [1, 2]]]],
    code: `class SnapshotArray {
  constructor(length) { this.hist = Array.from({ length }, () => [[-1, 0]]); this.id = 0; }
  set(index, val) {
    const h = this.hist[index], last = h[h.length - 1];
    if (last[0] === this.id) last[1] = val; else h.push([this.id, val]);
  }
  snap() { return this.id++; }
  get(index, snapId) {
    const h = this.hist[index];
    let lo = 0, hi = h.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (h[m][0] <= snapId) lo = m + 1; else hi = m; }
    return h[lo - 1][1];
  }
}`
  },
  {
    id: "moving-average", t: "Moving Average from Data Stream", d: "E", tp: ["queue", "sliding-window"], pt: ["sliding-window"], co: ["Google", "Meta", "Amazon"], lc: "moving-average-from-data-stream",
    s: "MovingAverage(size).next(val) returns the average of the last size values.", h: ["Keep the window in a queue and its running sum.", "Subtract the value that falls out of the window."],
    a: "Fixed-size sliding window with a running sum.", tc: "O(1)", sc: "O(size)", sim: ["max-avg-subarray", "design-hit-counter"],
    fn: "MovingAverage", ctor: "size:number", methods: "next(val:number):double", cmp: "float",
    ex: [[["MovingAverage", "next", "next", "next", "next"], [[3], [1], [10], [3], [5]], [null, 1.0, 5.5, 4.66667, 6.0]]],
    hid: [[["MovingAverage", "next", "next"], [[1], [4], [0]]]],
    code: `class MovingAverage {
  constructor(size) { this.size = size; this.q = []; this.sum = 0; }
  next(val) {
    this.q.push(val); this.sum += val;
    if (this.q.length > this.size) this.sum -= this.q.shift();
    return this.sum / this.q.length;
  }
}`
  }
];
