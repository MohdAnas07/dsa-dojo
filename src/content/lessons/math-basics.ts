import type { Lesson } from "@/lib/types";

const mathBasics: Lesson = {
  what: "The handful of math tools that keep appearing in coding problems: divisibility and modulo, GCD and LCM, prime numbers, sums of series, working with digits, and how JavaScript numbers behave.",
  analogy: { short: "A pocket calculator's hidden buttons", text: "You don't need advanced math for interviews, but a few 'buttons' save enormous time: GCD instead of trying every divisor, n(n + 1) / 2 instead of a loop, % 10 to peel off digits. Knowing them turns long loops into one line." },
  eli5: "Little number tricks: sharing sweets evenly (division and remainders), finding the biggest number that divides two others, and adding 1 + 2 + … + 100 in one step.",
  tech: "Modulo: a % b is the remainder; in JS it keeps the sign of a, so normalize with ((a % b) + b) % b. Integer division has no operator: Math.floor(a / b) for non-negatives, Math.trunc to round toward zero. GCD by Euclid's algorithm, gcd(a, b) = gcd(b, a mod b), runs in O(log min(a, b)); LCM = a / gcd · b. A number n is prime if no d with d² ≤ n divides it (O(√n)); the Sieve of Eratosthenes finds all primes below n in O(n log log n). Sums: 1 + … + n = n(n + 1) / 2; a geometric series 1 + 2 + 4 + … + 2ᵏ = 2ᵏ⁺¹ − 1. Digits: x % 10 is the last digit, Math.floor(x / 10) drops it. JavaScript numbers are 64-bit floats: integers are exact up to 2⁵³ − 1; use BigInt (and % 1_000_000_007 when a problem says so) for bigger values.",
  why: "Many easy and medium problems are really math problems (palindrome numbers, reverse integer, missing number, count primes, power of x), and overflow or negative-modulo bugs are classic interview traps in JavaScript.",
  how: ["Remainder with %, normalized for negatives.", "GCD with Euclid; LCM through the GCD.", "Primality up to √n; many primes at once with a sieve.", "Closed-form sums instead of loops.", "Digits with % 10 and Math.floor(/ 10).", "Large results: take mod 10⁹ + 7 at every step, or use BigInt."],
  props: ["gcd(a, 0) = a", "a · b = gcd · lcm", "Only check divisors up to √n", "Sum 1…n = n(n + 1)/2", "JS integers are safe up to 2⁵³ − 1"],
  use: ["Divisibility, cycles and wrap-around (modulo)", "Fractions, ratios and periodic events (GCD/LCM)", "Prime counting and factorization", "Digit manipulation (reverse, palindrome, sum of digits)", "Missing number via the expected sum"],
  avoid: ["Floating-point equality checks (compare with a tolerance or stay in integers)", "Plain numbers beyond 2⁵³ (use BigInt)"],
  viz: "array",
  cx: [["gcd(a, b)", "O(log min(a, b))", "The numbers shrink at least as fast as Fibonacci numbers."], ["Primality by trial division", "O(√n)", "Divisors pair up around √n."], ["Sieve up to n", "O(n log log n)", "Each prime crosses out its multiples."], ["Digits of x", "O(log₁₀ x)", "One step per digit."]],
  space: "O(1), or O(n) for a sieve.",
  code: {
    c: `const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;
function isPrime(n) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}
console.log(gcd(48, 18), lcm(4, 6));
console.log([1, 2, 9, 17, 21, 29].filter(isPrime));
console.log(7 / 2, Math.floor(7 / 2), Math.trunc(-7 / 2), Math.floor(-7 / 2));
console.log(-7 % 3, ((-7 % 3) + 3) % 3);
const n = 100;
console.log(n * (n + 1) / 2);`,
    hl: [1, 5],
    ex: { 1: "Euclid: gcd(a, b) = gcd(b, a mod b), stopping when b is 0.", 2: "Divide before multiplying to keep the intermediate value small.", 5: "Only check divisors up to √n: a bigger factor would pair with a smaller one.", 10: "JS has no integer division: Math.trunc rounds toward 0, Math.floor rounds down.", 11: "% keeps the sign of the left operand; add the modulus back to get 0…k − 1.", 13: "1 + 2 + … + n = n(n + 1) / 2, no loop needed." }
  },
  examples: [
    { lvl: "Easy", title: "Count primes with a sieve", prob: "Count the primes below n.", idea: "Every composite number has a prime factor ≤ its square root. Starting from each prime p, cross out p², p² + p, …", c: `function countPrimes(n) {
  if (n < 3) return 0;
  const composite = new Uint8Array(n);
  let count = 0;
  for (let i = 2; i < n; i++) {
    if (composite[i]) continue;
    count++;
    for (let j = i * i; j < n; j += i) composite[j] = 1;
  }
  return count;
}
console.log(countPrimes(10), countPrimes(100), countPrimes(2));`, time: "O(n log log n)", space: "O(n)", ex: { 3: "A typed array of 0/1 flags is compact and fast.", 8: "Start at i², because smaller multiples were already crossed out by smaller primes." } },
    { lvl: "Practical", title: "Palindrome number without strings", prob: "Is an integer a palindrome? Don't convert it to a string.", idea: "Peel digits off the end with % 10 and build the reversed second half until it catches up with the first half.", c: `function isPalindrome(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let rev = 0;
  while (x > rev) {
    rev = rev * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return x === rev || x === Math.floor(rev / 10);
}
console.log(isPalindrome(121), isPalindrome(-121), isPalindrome(10), isPalindrome(1221));`, time: "O(log₁₀ x)", space: "O(1)", ex: { 2: "Negatives and numbers ending in 0 (except 0) can't be palindromes.", 5: "Move the last digit of x onto the end of rev.", 8: "Odd length: drop the middle digit from rev before comparing." } },
    { lvl: "Interview", title: "Modular exponentiation with BigInt", prob: "Compute baseᵉˣᵖ mod m for a huge exponent.", idea: "Square-and-multiply with the modulo applied at every step. BigInt keeps the products exact, since they can exceed 2⁵³ before the modulo.", c: `function modPow(base, exp, mod) {
  let result = 1n, b = BigInt(base) % BigInt(mod), e = BigInt(exp);
  const m = BigInt(mod);
  while (e > 0n) {
    if (e & 1n) result = (result * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return Number(result);
}
console.log(modPow(2, 10, 1000), modPow(3, 200, 13), modPow(2, 1000000, 1000000007));`, time: "O(log exp)", space: "O(1)", ex: { 5: "An odd exponent: multiply the current power into the result.", 6: "Square the base and halve the exponent.", 10: "3³ = 27 ≡ 1 (mod 13), so 3²⁰⁰ = 3^(3·66 + 2) ≡ 9." } }
  ],
  signals: [["\"divisible\", \"remainder\", wrap-around", "Modulo (normalize negatives)"], ["\"greatest common divisor\", ratios, repeating patterns", "GCD / LCM"], ["\"prime\", \"count primes below n\"", "Trial division up to √n, or a sieve"], ["\"reverse digits\", \"palindrome number\", \"sum of digits\"", "% 10 and Math.floor(/ 10)"], ["\"return the answer modulo 10⁹ + 7\"", "Take mod at every step; BigInt for products"]],
  mistakes: [["Assuming % is always non-negative", "-7 % 3 is -1 in JS. Use ((a % m) + m) % m."], ["Using / as integer division", "7 / 2 is 3.5; use Math.floor or Math.trunc."], ["Overflowing 2⁵³ silently", "Results stop being exact; use BigInt or take mod earlier."], ["Comparing floats with ===", "0.1 + 0.2 !== 0.3; compare with a small tolerance."]],
  js: ["Number.MAX_SAFE_INTEGER is 2⁵³ − 1 = 9007199254740991.", "BigInt literals end with n: 10n ** 18n.", "1_000_000_007 is valid syntax for readability."],
  iq: { Beginner: ["Check whether a number is prime"], Easy: ["fizz-buzz", "palindrome-number", "roman-to-integer", "excel-column-number", "add-binary", "plus-one"], Medium: ["count-primes", "reverse-integer", "pow-x-n", "multiply-strings", "integer-to-roman"], Hard: ["max-points-on-line"] },
  rev: { s30: "Modulo (normalize negatives), Euclid's GCD, primes up to √n or a sieve, n(n + 1)/2, digits with % 10. JS numbers are floats: no integer division, exact only to 2⁵³ − 1.", m2: ["((a % m) + m) % m", "gcd(a, b) = gcd(b, a % b)", "Trial division up to √n", "Math.floor / Math.trunc for integer division", "BigInt beyond 2⁵³"] },
  cheat: `MATH BASICS CHEAT SHEET

gcd(a, b) = b ? gcd(b, a % b) : a
lcm = a / gcd(a, b) * b
isPrime: d*d <= n
sieve: for i: for j = i*i; j < n; j += i
sum 1..n = n(n+1)/2

digits: last = x % 10; x = Math.floor(x / 10)
mod (negatives): ((a % m) + m) % m
int division: Math.floor / Math.trunc
safe up to 2^53 − 1 → BigInt beyond`
};

export default mathBasics;
