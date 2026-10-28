import type { Statement } from "./types";

const DESIGN = "The example lists the method calls on one line and their arguments on the next; the output shows what each call returns (null for constructors and methods that return nothing).";

export const BITS_MATH_DESIGN_STATEMENTS: Record<string, Statement> = {
  "number-of-1-bits": {
    body: [
      "Given a positive integer `n`, write a function that returns the number of set bits (1s) in its binary representation, also known as the Hamming weight.",
      "n fits in 32 bits."
    ],
    why: [
      "11 in binary is 1011, which has three 1s.",
      "128 is 10000000, with a single 1.",
      "2147483645 is 1111111111111111111111111111101 in binary: 31 bits, all 1s except one."
    ],
    walk: [
      "n & (n − 1) clears the lowest 1-bit, so count how many times you can do it before n becomes 0.",
      "1011 → 1010 (count 1).",
      "1010 → 1000 (count 2).",
      "1000 → 0 (count 3). The answer is 3."
    ],
    cons: ["1 ≤ n ≤ 2³¹ − 1"]
  },
  "counting-bits": {
    body: [
      "Given an integer `n`, return an array `ans` of length n + 1 such that for each i (0 ≤ i ≤ n), ans[i] is the number of 1s in the binary representation of i.",
      "Can you do it in O(n) without counting each number's bits separately?"
    ],
    why: [
      "0 → 0, 1 → 1, 2 (10) → 1.",
      "0, 1, 10, 11, 100, 101 have 0, 1, 1, 2, 1, 2 ones."
    ],
    walk: [
      "i >> 1 drops the last bit of i, and we already know its count. So ans[i] = ans[i >> 1] + (i & 1).",
      "ans[0] = 0.",
      "ans[1] = ans[0] + 1 = 1.",
      "ans[2] = ans[1] + 0 = 1. Result: [0, 1, 1]."
    ],
    cons: ["0 ≤ n ≤ 10⁵"]
  },
  "reverse-bits": {
    body: [
      "Reverse the bits of a given 32-bit unsigned integer and return the result as an unsigned integer.",
      "The first bit (most significant) becomes the last, and so on. All 32 bits count, including leading zeros."
    ],
    why: [
      "43261596 is 00000010100101000001111010011100. Reversed it is 00111001011110000010100101000000 = 964176192.",
      "4294967293 is 11111111111111111111111111111101. Reversed it is 10111111111111111111111111111111 = 3221225471."
    ],
    walk: [
      "Repeat 32 times: shift the result left by one and append n's lowest bit, then shift n right.",
      "The lowest bits of 43261596 are 0, 0, 1, 1, 1, 0, … They become the highest bits of the result.",
      "After 32 steps every bit has moved to its mirrored position.",
      "Return the result as unsigned (use >>> 0 in JavaScript): 964176192."
    ],
    cons: ["The input is a 32-bit unsigned integer."]
  },
  "sum-two-integers": {
    body: [
      "Given two integers `a` and `b`, return the sum of the two integers without using the operators + and −.",
      "Use bit operations: XOR adds without carries, and AND finds where carries happen."
    ],
    why: [
      "1 + 2 = 3.",
      "2 + 3 = 5."
    ],
    walk: [
      "a = 01, b = 10.",
      "Sum without carries: a XOR b = 11. Carries: (a AND b) << 1 = 00.",
      "There are no carries left, so the answer is 11 = 3. (Otherwise repeat with the new sum and carry.)"
    ],
    cons: ["-1000 ≤ a, b ≤ 1000"]
  },
  "single-number-ii": {
    body: [
      "Given an integer array `nums` where every element appears three times except for one, which appears exactly once, find the single element and return it.",
      "You must implement a solution with O(n) time and constant extra space."
    ],
    why: [
      "2 appears three times; 3 appears once.",
      "0 and 1 appear three times; 99 appears once."
    ],
    walk: [
      "For every bit position, add up that bit over all numbers. Bits from triples add up to multiples of 3; whatever is left over belongs to the single number.",
      "2 = 10, 2 = 10, 3 = 11, 2 = 10.",
      "Bit 0: only 3 has it → 1 mod 3 = 1. Bit 1: all four numbers have it → 4 mod 3 = 1.",
      "The leftover bits are 11 = 3."
    ],
    cons: ["1 ≤ nums.length ≤ 3 · 10⁴", "-2³¹ ≤ nums[i] ≤ 2³¹ − 1", "Each element appears three times except for one."]
  },
  "single-number-iii": {
    body: [
      "Given an integer array `nums`, in which exactly two elements appear only once and all the other elements appear exactly twice, find the two elements that appear only once. You can return the answer in any order.",
      "You must write an algorithm that runs in linear time and uses only constant extra space."
    ],
    why: [
      "3 and 5 appear once; 1 and 2 appear twice. [5, 3] is also accepted.",
      "Both numbers appear once.",
      "Both numbers appear once, in any order."
    ],
    walk: [
      "XOR everything: pairs cancel, leaving 3 XOR 5 = 110.",
      "3 and 5 differ in every set bit of 110. Take the lowest one: 010.",
      "Split the numbers by that bit. With it: 2, 3, 2 → XOR = 3. Without it: 1, 1, 5 → XOR = 5.",
      "The answer is [3, 5]."
    ],
    cons: ["2 ≤ nums.length ≤ 3 · 10⁴", "-2³¹ ≤ nums[i] ≤ 2³¹ − 1", "Exactly two values appear once; all others appear twice."]
  },
  "hamming-distance": {
    body: [
      "The Hamming distance between two integers is the number of positions at which the corresponding bits are different.",
      "Given two integers `x` and `y`, return the Hamming distance between them."
    ],
    why: [
      "1 = 0001 and 4 = 0100 differ in two positions.",
      "3 = 11 and 1 = 01 differ in one position."
    ],
    walk: [
      "XOR sets exactly the bits that differ: 0001 XOR 0100 = 0101.",
      "Count the 1s in 0101.",
      "There are 2."
    ],
    cons: ["0 ≤ x, y ≤ 2³¹ − 1"]
  },
  "bitwise-and-range": {
    body: [
      "Given two integers `left` and `right` that represent the range [left, right], return the bitwise AND of all numbers in this range, inclusive.",
      "Looping over the whole range is too slow when it is large."
    ],
    why: [
      "5 = 101, 6 = 110, 7 = 111. Only the highest bit is in all three: 100 = 4.",
      "The range is just 0.",
      "The range covers numbers with every bit pattern, so every bit is 0 in some number."
    ],
    walk: [
      "The result is the common binary prefix of left and right; every bit after it takes both values somewhere in the range.",
      "Shift both right until they are equal: (5, 7) → (2, 3) → (1, 1), after 2 shifts.",
      "The common prefix is 1.",
      "Shift it back: 1 << 2 = 4."
    ],
    cons: ["0 ≤ left ≤ right ≤ 2³¹ − 1"]
  },
  "reverse-integer": {
    body: [
      "Given a signed 32-bit integer `x`, return x with its digits reversed. The sign stays the same.",
      "If reversing x causes the value to go outside the signed 32-bit range [−2³¹, 2³¹ − 1], return 0."
    ],
    why: [
      "123 → 321.",
      "The sign stays: −123 → −321.",
      "Reversing gives 021, which is 21."
    ],
    walk: [
      "Pop the last digit and push it onto the result: result = result × 10 + digit.",
      "Pop 3 → 3. Pop 2 → 32. Pop 1 → 321.",
      "Check the result is within the 32-bit range: it is.",
      "Return 321."
    ],
    cons: ["-2³¹ ≤ x ≤ 2³¹ − 1"]
  },
  "palindrome-number": {
    body: [
      "Given an integer `x`, return `true` if x is a palindrome, and `false` otherwise.",
      "A palindrome reads the same forward and backward. Try to solve it without converting the integer to a string."
    ],
    why: [
      "121 reads the same both ways.",
      "Backwards, −121 reads 121−, so it is not a palindrome.",
      "Backwards, 10 reads 01."
    ],
    walk: [
      "Negative numbers and numbers ending in 0 (except 0 itself) are never palindromes.",
      "Reverse only the second half: x = 121, rev = 0. Move the last digit: x = 12, rev = 1.",
      "Again: x = 1, rev = 12. Now rev ≥ x, so stop.",
      "Odd length: compare x with rev / 10 → 1 == 1. Return true."
    ],
    cons: ["-2³¹ ≤ x ≤ 2³¹ − 1"]
  },
  "roman-to-integer": {
    body: [
      "Roman numerals use seven symbols: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Symbols are usually written largest to smallest from left to right, and added up.",
      "Six cases use subtraction instead: IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900. Given a Roman numeral `s`, convert it to an integer."
    ],
    why: [
      "III = 1 + 1 + 1.",
      "L = 50, V = 5, III = 3.",
      "M = 1000, CM = 900, XC = 90, IV = 4."
    ],
    walk: [
      "Add each symbol's value, but subtract it when the next symbol is bigger.",
      "I, I, I: each is followed by a symbol that isn't bigger.",
      "1 + 1 + 1 = 3."
    ],
    cons: ["1 ≤ s.length ≤ 15", "`s` contains only the characters I, V, X, L, C, D, M.", "`s` is a valid Roman numeral in the range [1, 3999]."]
  },
  "integer-to-roman": {
    body: [
      "Given an integer `num` between 1 and 3999, convert it to a Roman numeral.",
      "The symbols are I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000, plus the subtractive forms IV = 4, IX = 9, XL = 40, XC = 90, CD = 400 and CM = 900. Only I, X, C and M can repeat, at most three times in a row."
    ],
    why: [
      "3000 = MMM, 700 = DCC, 40 = XL, 9 = IX.",
      "50 = L, 8 = VIII.",
      "1000 = M, 900 = CM, 90 = XC, 4 = IV."
    ],
    walk: [
      "Greedily subtract the largest value from the table [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1].",
      "3749: M, M, M → 749 left.",
      "D → 249. C, C → 49.",
      "XL → 9. IX → 0. Result: 'MMMDCCXLIX'."
    ],
    cons: ["1 ≤ num ≤ 3999"]
  },
  "count-primes": {
    body: [
      "Given an integer `n`, return the number of prime numbers that are strictly less than n.",
      "A prime is a number greater than 1 whose only divisors are 1 and itself."
    ],
    why: [
      "The primes below 10 are 2, 3, 5 and 7.",
      "There are no primes below 0.",
      "There are no primes below 1."
    ],
    walk: [
      "Sieve of Eratosthenes: assume 2 … 9 are prime, then cross out multiples.",
      "2 is prime: cross out 4, 6, 8.",
      "3 is prime: cross out 9 (6 is already gone). 4 is crossed out; 5² is bigger than 9, so stop.",
      "Left: 2, 3, 5, 7 → 4."
    ],
    cons: ["0 ≤ n ≤ 5 · 10⁶"]
  },
  "gcd-of-strings": {
    body: [
      "For two strings s and t, we say 't divides s' if s = t + t + … + t (t concatenated with itself one or more times).",
      "Given two strings `str1` and `str2`, return the largest string x such that x divides both str1 and str2. Return an empty string if there is none."
    ],
    why: [
      "'ABC' × 2 = str1 and 'ABC' × 1 = str2.",
      "'AB' × 3 = str1 and 'AB' × 2 = str2.",
      "No string divides both."
    ],
    walk: [
      "If a common divisor exists, str1 + str2 must equal str2 + str1: 'ABCABCABC' = 'ABCABCABC' ✓.",
      "Then the answer's length is gcd(6, 3) = 3.",
      "Return the first 3 characters: 'ABC'."
    ],
    cons: ["1 ≤ str1.length, str2.length ≤ 1000", "Both strings consist of uppercase English letters."]
  },
  "excel-column-title": {
    body: [
      "Given an integer `columnNumber`, return its corresponding column title as it appears in an Excel sheet.",
      "A → 1, B → 2, …, Z → 26, AA → 27, AB → 28, and so on. It is like base 26, but there is no zero digit."
    ],
    why: [
      "The first column is A.",
      "Z is 26, so 27 is AA and 28 is AB.",
      "Z = 26, so ZY = 26 × 26 + 25 = 701."
    ],
    walk: [
      "Subtract 1 before each step so that the letters run 0–25.",
      "28 − 1 = 27. 27 % 26 = 1 → 'B'. 27 / 26 = 1.",
      "1 − 1 = 0. 0 % 26 = 0 → 'A'. 0 / 26 = 0, so stop.",
      "Read the letters in reverse: 'AB'."
    ],
    cons: ["1 ≤ columnNumber ≤ 2³¹ − 1"]
  },
  "excel-column-number": {
    body: [
      "Given a string `columnTitle` that represents the column title as it appears in an Excel sheet, return its corresponding column number.",
      "A → 1, B → 2, …, Z → 26, AA → 27, AB → 28, and so on."
    ],
    why: [
      "A is the first column.",
      "AB = 1 × 26 + 2 = 28.",
      "ZY = 26 × 26 + 25 = 701."
    ],
    walk: [
      "Read left to right: number = number × 26 + letter value.",
      "'A' → 0 × 26 + 1 = 1.",
      "That is the whole title, so the answer is 1."
    ],
    cons: ["1 ≤ columnTitle.length ≤ 7", "`columnTitle` consists only of uppercase English letters and is in the range ['A', 'FXSHRXW']."]
  },
  "multiply-strings": {
    body: [
      "Given two non-negative integers `num1` and `num2` represented as strings, return the product of num1 and num2, also represented as a string.",
      "You must not use any built-in BigInteger library or convert the inputs to numbers directly."
    ],
    why: [
      "2 × 3 = 6.",
      "123 × 456 = 56088."
    ],
    walk: [
      "Multiply digit by digit like on paper. Digits at positions i and j add their product to position i + j + 1 of a result array.",
      "2 × 3 = 6 goes into the last position.",
      "No carries are needed.",
      "Join the digits, skipping leading zeros: '6'."
    ],
    cons: ["1 ≤ num1.length, num2.length ≤ 200", "Both consist of digits only.", "Neither has leading zeros, except the number 0 itself."]
  },
  "add-binary": {
    body: [
      "Given two binary strings `a` and `b`, return their sum as a binary string."
    ],
    why: [
      "3 + 1 = 4, which is 100 in binary.",
      "10 + 11 = 21, which is 10101 in binary."
    ],
    walk: [
      "Add from the right with a carry.",
      "1 + 1 = 2 → write 0, carry 1.",
      "1 + carry 1 = 2 → write 0, carry 1.",
      "Only the carry is left → write 1. Read backwards: '100'."
    ],
    cons: ["1 ≤ a.length, b.length ≤ 10⁴", "`a` and `b` consist only of '0' or '1' characters.", "Neither has leading zeros except '0' itself."]
  },
  "string-to-integer-atoi": {
    body: [
      "Implement the function myAtoi(s), which converts a string to a 32-bit signed integer.",
      "Skip leading spaces. Then read an optional '+' or '−'. Then read digits until the first non-digit character or the end of the string (leading zeros are fine). If no digits were read, the result is 0. Finally, clamp the result to [−2³¹, 2³¹ − 1]."
    ],
    why: [
      "Just digits.",
      "Skip the space, read the '−', then the digits 042 → −42.",
      "Reading stops at 'c'.",
      "Reading stops at '−', which comes after the digit 0.",
      "The first non-space character is 'w', so no digits are read."
    ],
    walk: [
      "No leading spaces. No sign, so the number is positive.",
      "Read '4' → 4. Read '2' → 42.",
      "The string ends. 42 is in range, so return 42."
    ],
    cons: ["0 ≤ s.length ≤ 200", "`s` consists of English letters, digits, ' ', '+', '-' and '.'."]
  },
  "zigzag-conversion": {
    body: [
      "The string 'PAYPALISHIRING' written in a zigzag pattern on 3 rows goes down the rows and then diagonally back up, like this: row 1 holds P, A, H, N; row 2 holds A, P, L, S, I, I, G; row 3 holds Y, I, R.",
      "Then the rows are read one after another. Given a string `s` and a number of rows `numRows`, return the string read row by row."
    ],
    why: [
      "Rows: 'PAHN', 'APLSIIG', 'YIR'.",
      "Rows: 'PIN', 'ALSIG', 'YAHR', 'PI'.",
      "One row: nothing changes."
    ],
    walk: [
      "Go through the letters with a row index that bounces between 0 and numRows − 1.",
      "P → row 0, A → row 1, Y → row 2, then back up: P → row 1, A → row 0, L → row 1, …",
      "Row 0 collects P, A, H, N. Row 1 collects A, P, L, S, I, I, G. Row 2 collects Y, I, R.",
      "Join the rows: 'PAHNAPLSIIGYIR'."
    ],
    cons: ["1 ≤ s.length ≤ 1000", "`s` consists of English letters, ',' and '.'.", "1 ≤ numRows ≤ 1000"]
  },
  "str-str": {
    body: [
      "Given two strings `needle` and `haystack`, return the index of the first occurrence of needle in haystack, or −1 if needle is not part of haystack.",
      "Don't use indexOf. KMP finds the answer in O(n + m)."
    ],
    why: [
      "'sad' occurs at index 0 and index 6. The first is 0.",
      "'leeto' does not occur."
    ],
    walk: [
      "Compare needle with haystack starting at each position.",
      "Position 0: 's' = 's', 'a' = 'a', 'd' = 'd'. Full match.",
      "Return 0. (KMP avoids re-checking characters after a mismatch.)"
    ],
    cons: ["1 ≤ haystack.length, needle.length ≤ 10⁴", "Both consist of only lowercase English characters."]
  },
  "repeated-substring-pattern": {
    body: [
      "Given a string `s`, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together."
    ],
    why: [
      "'ab' twice.",
      "No piece repeats to form 'aba'.",
      "'abc' four times (or 'abcabc' twice)."
    ],
    walk: [
      "Trick: if s repeats a pattern, s appears inside (s + s) with the first and last characters removed.",
      "s + s = 'abababab'. Remove the ends: 'bababa'.",
      "'abab' appears in 'bababa' (starting at index 1).",
      "Return true."
    ],
    cons: ["1 ≤ s.length ≤ 10⁴", "`s` consists of lowercase English letters."]
  },
  "rotate-string": {
    body: [
      "Given two strings `s` and `goal`, return `true` if and only if s can become goal after some number of shifts on s.",
      "A shift moves the leftmost character to the rightmost position: 'abcde' becomes 'bcdea' after one shift."
    ],
    why: [
      "Two shifts: abcde → bcdea → cdeab.",
      "No number of shifts gives 'abced'."
    ],
    walk: [
      "Every rotation of s appears inside s + s.",
      "The lengths are equal (5) ✓.",
      "s + s = 'abcdeabcde', which contains 'cdeab'.",
      "Return true."
    ],
    cons: ["1 ≤ s.length, goal.length ≤ 100", "`s` and `goal` consist of lowercase English letters."]
  },
  "count-and-say": {
    body: [
      "The count-and-say sequence starts with countAndSay(1) = '1'. Each later term describes the previous one by reading it aloud: count each run of equal digits and say the count, then the digit.",
      "For example '1' is read as 'one 1' → '11', which is read as 'two 1s' → '21', then 'one 2, one 1' → '1211'. Given `n`, return the n-th term."
    ],
    why: [
      "The first term is '1'.",
      "1 → 11 → 21 → 1211.",
      "1211 is 'one 1, one 2, two 1s' → 111221."
    ],
    walk: [
      "Start with '1'.",
      "n = 1 asks for the first term.",
      "Return '1'. (For bigger n, run-length encode the previous term n − 1 times.)"
    ],
    cons: ["1 ≤ n ≤ 30"]
  },
  "string-compression": {
    body: [
      "Given an array of characters `chars`, compress it: for each group of consecutive repeating characters, write the character, followed by the group's length if it is more than 1. A length of 10 or more is written as several characters ('1', '2' for 12).",
      "Do it in place using only constant extra space. In this version, return the compressed part of the array."
    ],
    why: [
      "'aa' → 'a2', 'bb' → 'b2', 'ccc' → 'c3'.",
      "A single 'a' stays as it is (no count for length 1).",
      "'a', then twelve 'b's → 'b', '1', '2'."
    ],
    walk: [
      "Use a read pointer to find each group and a write pointer to write the compressed form.",
      "Group 'a' × 2 → write 'a', '2'.",
      "Group 'b' × 2 → write 'b', '2'.",
      "Group 'c' × 3 → write 'c', '3'. Result: ['a','2','b','2','c','3']."
    ],
    cons: ["1 ≤ chars.length ≤ 2000", "chars[i] is a lowercase or uppercase English letter, digit or symbol."]
  },
  "max-points-on-line": {
    body: [
      "Given an array of `points` where points[i] = [xᵢ, yᵢ] is a point on the X-Y plane, return the maximum number of points that lie on the same straight line."
    ],
    why: [
      "All three points lie on the line y = x.",
      "(3,2), (4,1), (2,3) and (1,4) lie on the line x + y = 5."
    ],
    walk: [
      "Fix each point as an anchor and group the other points by the slope from the anchor (stored as a reduced fraction, so precision is not an issue).",
      "Anchor (1,1): (2,2) has slope 1/1 and (3,3) has slope 2/2 = 1/1.",
      "Two points share a slope with the anchor, so that line holds 3 points.",
      "No anchor does better. The answer is 3."
    ],
    cons: ["1 ≤ points.length ≤ 300", "-10⁴ ≤ xᵢ, yᵢ ≤ 10⁴", "All the points are unique."]
  },
  "divide-two-integers": {
    body: [
      "Given two integers `dividend` and `divisor`, divide them without using multiplication, division or the mod operator. The result truncates toward zero (8.345 → 8, −2.7335 → −2).",
      "Assume a 32-bit signed integer range [−2³¹, 2³¹ − 1]. If the quotient is bigger than 2³¹ − 1, return 2³¹ − 1; if smaller than −2³¹, return −2³¹."
    ],
    why: [
      "10 / 3 = 3.33…, truncated to 3.",
      "7 / −3 = −2.33…, truncated to −2.",
      "The true answer, 2³¹, is too big, so return 2³¹ − 1."
    ],
    walk: [
      "Subtract doubled copies of the divisor: find the biggest 3 × 2ᵏ that fits.",
      "10: 3, 6, 12 (too big). Subtract 6 → quotient 2, remainder 4.",
      "4: 3 fits, 6 doesn't. Subtract 3 → quotient 3, remainder 1.",
      "1 < 3, so stop. The answer is 3."
    ],
    cons: ["-2³¹ ≤ dividend, divisor ≤ 2³¹ − 1", "divisor != 0"]
  },
  "bulls-and-cows": {
    body: [
      "You are playing Bulls and Cows: your friend has a secret number and you make a guess. Bulls are digits in the guess that are in the correct position. Cows are digits that are in the secret but in the wrong position (and are not already bulls).",
      "Given the `secret` and the `guess`, return the hint 'xAyB', where x is the number of bulls and y the number of cows. Both may contain duplicate digits."
    ],
    why: [
      "The 8 is in the right place (a bull). 7, 1 and 0 are in the secret but in other places (3 cows).",
      "The 1 in position 1 is a bull. One more 1 from the guess matches the other 1 in the secret (a cow); the third 1 has no partner left."
    ],
    walk: [
      "Bulls: compare position by position. Only position 1 (8 = 8) matches → 1 bull.",
      "For the other positions, count digits: the secret has {1, 0, 7}, the guess has {7, 1, 0}.",
      "Cows = the overlap of those counts: 7, 1 and 0 → 3.",
      "Hint: '1A3B'."
    ],
    cons: ["1 ≤ secret.length, guess.length ≤ 1000", "secret.length == guess.length", "Both consist of digits only."]
  },
  "fizz-buzz": {
    body: [
      "Given an integer `n`, return a string array `answer` (1-indexed) where answer[i] is 'FizzBuzz' if i is divisible by 3 and 5, 'Fizz' if i is divisible by 3, 'Buzz' if i is divisible by 5, and i (as a string) otherwise."
    ],
    why: [
      "3 is divisible by 3.",
      "3 → Fizz, 5 → Buzz."
    ],
    walk: [
      "1 → '1'.",
      "2 → '2'.",
      "3 is divisible by 3 → 'Fizz'. Result: ['1', '2', 'Fizz']."
    ],
    cons: ["1 ≤ n ≤ 10⁴"]
  },
  "group-shifted-strings": {
    body: [
      "We can shift a string by moving each of its letters to the next letter of the alphabet (z wraps around to a): 'abc' → 'bcd' → … → 'xyz' → 'yza'. Strings that can reach each other this way form a shifting sequence.",
      "Given an array of `strings`, group all strings that belong to the same shifting sequence. You may return the groups in any order."
    ],
    why: [
      "abc, bcd and xyz all have gaps (+1, +1). acef is alone. az and ba both have a gap of 25 (wrapping around). Single letters can reach each other.",
      "One string, one group."
    ],
    walk: [
      "Give each string a key: the gaps between neighbouring letters, mod 26.",
      "abc → (1, 1), bcd → (1, 1), xyz → (1, 1). acef → (2, 2, 1).",
      "az → (25). ba → b to a is −1, which is 25 mod 26 → (25). 'a' and 'z' → () (no gaps).",
      "Group by key: [abc, bcd, xyz], [acef], [az, ba], [a, z]."
    ],
    cons: ["1 ≤ strings.length ≤ 200", "1 ≤ strings[i].length ≤ 50", "`strings[i]` consists of lowercase English letters."]
  },
  "lfu-cache": {
    body: [
      "Design and implement a data structure for a Least Frequently Used (LFU) cache with capacity `capacity`. `get(key)` returns the value (or −1) and `put(key, value)` inserts or updates a key. Both count as a use and must run in O(1) on average.",
      "When the cache is full, put first evicts the key used the fewest times. If several keys tie, evict the least recently used of them. " + DESIGN
    ],
    why: [
      "After get(1), key 1 has been used twice and key 2 once, so put(3) evicts 2. Then 1 and 3 are both used twice; 1 was used longer ago, so put(4) evicts 1."
    ],
    walk: [
      "Track each key's value and use count, and for each count, the keys in order of last use.",
      "put(1), put(2) → counts {1: 1, 2: 1}. get(1) → 1, counts {1: 2, 2: 1}.",
      "put(3): full → evict the lowest count, key 2. get(2) → −1. get(3) → 3, counts {1: 2, 3: 2}.",
      "put(4): 1 and 3 tie at 2; key 1 was used less recently → evict 1.",
      "get(1) → −1, get(3) → 3, get(4) → 4."
    ],
    cons: ["1 ≤ capacity ≤ 10⁴", "0 ≤ key ≤ 10⁵", "0 ≤ value ≤ 10⁹", "At most 2 · 10⁵ calls to get and put."]
  },
  "randomized-set": {
    body: [
      "Implement the `RandomizedSet` class: `insert(val)` adds val if it is not present and returns whether it was added, `remove(val)` removes val if present and returns whether it was removed, and `getRandom()` returns a random element, each with the same probability.",
      "Each function must work in average O(1) time. (The judge here tests insert and remove; implement getRandom too.) " + DESIGN
    ],
    why: [
      "insert(1) → true. remove(2) → false (not there). insert(2) → true. insert(1) → false (already there). remove(1) → true. insert(2) → false (already there)."
    ],
    walk: [
      "Keep the values in an array and a map from value to its index.",
      "insert(1) → [1]. remove(2): not in the map → false. insert(2) → [1, 2].",
      "insert(1): already in the map → false.",
      "remove(1): move the last element (2) into 1's slot and pop → [2]. insert(2) → false.",
      "getRandom would pick a random index of the array in O(1)."
    ],
    cons: ["-2³¹ ≤ val ≤ 2³¹ − 1", "At most 2 · 10⁵ calls are made.", "getRandom is only called when the set is not empty."]
  },
  "design-hit-counter": {
    body: [
      "Design a hit counter that counts the number of hits received in the past 5 minutes (the past 300 seconds).",
      "`hit(timestamp)` records a hit, and `getHits(timestamp)` returns the number of hits in the window (timestamp − 300, timestamp]. Calls arrive in chronological order (timestamps never decrease). " + DESIGN
    ],
    why: [
      "At time 4 there are 3 hits. At 300 there are 4. At 301 the hit from time 1 is more than 300 seconds old, so 3 remain."
    ],
    walk: [
      "Keep the hit times in a queue and drop old ones from the front.",
      "hit(1), hit(2), hit(3). getHits(4) → 3.",
      "hit(300). getHits(300): nothing is older than 300 seconds → 4.",
      "getHits(301): drop hits at time ≤ 1 → [2, 3, 300] → 3."
    ],
    cons: ["1 ≤ timestamp ≤ 2 · 10⁹", "Calls are made in chronological order.", "At most 300 calls are made."]
  },
  "design-twitter": {
    body: [
      "Design a simplified version of Twitter where users can post tweets, follow or unfollow another user, and see the 10 most recent tweets in their news feed.",
      "Implement `postTweet(userId, tweetId)`, `getNewsFeed(userId)` (the 10 most recent tweet ids from the user and the people they follow, newest first), `follow(followerId, followeeId)` and `unfollow(followerId, followeeId)`. " + DESIGN
    ],
    why: [
      "User 1 sees their tweet 5. After following user 2 (who posts 6), the feed is [6, 5]. After unfollowing, only [5] remains."
    ],
    walk: [
      "Store each user's tweets with a global time counter, and each user's followees in a set.",
      "postTweet(1, 5). getNewsFeed(1) → [5].",
      "follow(1, 2). postTweet(2, 6). getNewsFeed(1) merges users 1 and 2, newest first → [6, 5].",
      "unfollow(1, 2). getNewsFeed(1) → [5]."
    ],
    cons: ["1 ≤ userId, followerId, followeeId ≤ 500", "0 ≤ tweetId ≤ 10⁴", "All tweets have unique ids.", "At most 3 · 10⁴ calls are made."]
  },
  "snapshot-array": {
    body: [
      "Implement a `SnapshotArray` that supports `SnapshotArray(length)` (every element starts at 0), `set(index, val)`, `snap()` (takes a snapshot and returns its id, the number of times snap was called minus 1), and `get(index, snap_id)` (the value at index when that snapshot was taken).",
      "Copying the whole array on every snap would be too slow and use too much memory. " + DESIGN
    ],
    why: [
      "set index 0 to 5, take snapshot 0, then set index 0 to 6. In snapshot 0 the value was still 5."
    ],
    walk: [
      "Store, for each index, a list of (snap id, value) changes.",
      "set(0, 5) → index 0: [(0, 5)]. snap() → 0; the current snap id becomes 1.",
      "set(0, 6) → index 0: [(0, 5), (1, 6)].",
      "get(0, 0): binary search for the last change with snap id ≤ 0 → 5."
    ],
    cons: ["1 ≤ length ≤ 5 · 10⁴", "0 ≤ index < length", "0 ≤ val ≤ 10⁹", "0 ≤ snap_id < the number of snap calls", "At most 5 · 10⁴ calls are made."]
  },
  "moving-average": {
    body: [
      "Given a stream of integers and a window size, calculate the moving average of all integers in the sliding window.",
      "Implement `MovingAverage(size)` and `next(val)`, which adds val and returns the average of the last size values (or of all values, if fewer than size have arrived). Answers within 10⁻⁵ are accepted. " + DESIGN
    ],
    why: [
      "With size 3: 1 → 1. 10 → (1 + 10) / 2 = 5.5. 3 → (1 + 10 + 3) / 3 = 4.67. 5 → (10 + 3 + 5) / 3 = 6."
    ],
    walk: [
      "Keep a queue of at most 3 values and their running sum.",
      "next(1) → sum 1, count 1 → 1. next(10) → sum 11, count 2 → 5.5.",
      "next(3) → sum 14, count 3 → 4.667.",
      "next(5): the window is full, so drop 1 → sum 18, count 3 → 6."
    ],
    cons: ["1 ≤ size ≤ 1000", "-10⁵ ≤ val ≤ 10⁵", "At most 10⁴ calls to next."]
  }
};
