import type { Lesson } from "@/lib/types";

const MEETINGS = "[[1, 4], [3, 5], [0, 6], [5, 7], [3, 9], [5, 9], [6, 10], [8, 11], [8, 12], [2, 14], [12, 16]]";

const greedy: Lesson = {
  what: "A greedy algorithm builds the answer step by step, always taking the choice that looks best right now, and never reconsidering. When the problem has the right structure, those local choices add up to the best overall answer.",
  analogy: { short: "Packing a day with meetings", text: "To fit as many meetings as possible into one room, keep picking the meeting that ends earliest among those that still fit. Finishing early leaves the most time for everything else, and it turns out this simple rule is always optimal." },
  eli5: "At every step you grab the best thing in front of you. Sometimes that's a great plan (picking the biggest coins to make change in dollars), sometimes it isn't (with strange coin values).",
  tech: "Greedy is correct only when two properties hold: the greedy-choice property (some optimal solution starts with the greedy choice) and optimal substructure (after making it, what's left is a smaller version of the same problem). You justify a greedy with an exchange argument: take any optimal solution, swap in the greedy choice, and show it's no worse. Most greedy solutions sort first (by end time, by size, by ratio), then make one pass: O(n log n). When greedy fails (coin change with arbitrary coins, 0/1 knapsack), use DP.",
  why: "When it works, greedy is the simplest and fastest solution: one sort and one pass. Interval scheduling, jump games, gas stations, assigning resources and many 'minimum number of …' questions are greedy.",
  how: ["Find a rule for the 'best next choice' (earliest end, smallest size, largest value …).", "Sort by that rule if needed.", "Scan once, taking each item that keeps the solution valid.", "Convince yourself with an exchange argument or a small counterexample search.", "If a counterexample exists, switch to DP."],
  props: ["Never undoes a choice", "Usually sort + one pass: O(n log n)", "Needs a proof (exchange argument)", "Often O(1) extra space"],
  use: ["Interval scheduling and merging", "Jump game / reachability", "Assigning resources (cookies, boats, rooms)", "Huffman coding, MST (Kruskal and Prim are greedy)", "Stock trading with unlimited transactions"],
  avoid: ["0/1 knapsack and arbitrary coin change (greedy can be wrong)", "Problems where an early choice changes what's possible later in complex ways"],
  viz: "array",
  cx: [["Sort + one pass", "O(n log n)", "Sorting dominates."], ["One pass, no sort", "O(n)", "Jump game, gas station, stock II."], ["Brute force over all subsets", "O(2ⁿ)", "What greedy avoids."]],
  space: "O(1) extra (besides sorting).",
  code: {
    c: `function maxMeetings(intervals) {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let count = 0, end = -Infinity;
  const chosen = [];
  for (const [s, e] of sorted) {
    if (s >= end) {
      count++;
      end = e;
      chosen.push([s, e]);
    }
  }
  return [count, chosen];
}
console.log(maxMeetings(${MEETINGS}));`,
    hl: [2, 6],
    ex: { 2: "The greedy rule: finish earliest first, leaving the most room for the rest.", 6: "Starts after the last chosen meeting ends: take it.", 8: "Never reconsidered: greedy commits to each choice." }
  },
  brute: { title: "Brute force: try every subset of meetings", c: `function maxMeetingsBrute(intervals) {
  let best = 0;
  const n = intervals.length;
  for (let mask = 0; mask < 1 << n; mask++) {
    const pick = intervals.filter((_, i) => mask & (1 << i)).sort((a, b) => a[0] - b[0]);
    if (pick.every((iv, i) => i === 0 || pick[i - 1][1] <= iv[0])) best = Math.max(best, pick.length);
  }
  return best;
}
console.log(maxMeetingsBrute([[1, 4], [3, 5], [0, 6], [5, 7], [8, 11], [12, 16]]));`, time: "O(2ⁿ · n log n)", space: "O(n)", ex: { 4: "Every bitmask is one subset of meetings: 2ⁿ of them." } },
  examples: [
    { lvl: "Easy", title: "Assign cookies", prob: "Each child needs a cookie at least as big as their greed. Maximize content children.", idea: "Sort both. Give each cookie, smallest first, to the least greedy child it can satisfy: a small cookie is never wasted on a big appetite.", c: `function findContentChildren(g, s) {
  g = [...g].sort((a, b) => a - b);
  s = [...s].sort((a, b) => a - b);
  let child = 0;
  for (const cookie of s) if (child < g.length && cookie >= g[child]) child++;
  return child;
}
console.log(findContentChildren([1, 2, 3], [1, 1]), findContentChildren([1, 2], [1, 2, 3]));`, time: "O(n log n)", space: "O(1)", ex: { 5: "If this cookie satisfies the least greedy waiting child, give it; otherwise it's too small for anyone left." } },
    { lvl: "Practical", title: "Jump game", prob: "nums[i] is the max jump from i. Can you reach the last index?", idea: "Track the farthest index reachable. If you ever stand beyond it, you're stuck.", c: `function canJump(nums) {
  let reach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]);
  }
  return true;
}
console.log(canJump([2, 3, 1, 1, 4]), canJump([3, 2, 1, 0, 4]));`, time: "O(n)", space: "O(1)", ex: { 4: "Index i can't be reached: every earlier jump falls short.", 5: "Greedy: keep only the farthest reach, not which jumps got there." } },
    { lvl: "Interview", title: "Gas station", prob: "Find the station to start from to drive around a circular route once, or −1.", idea: "If total gas ≥ total cost, a start exists. Whenever the running tank goes negative, no station up to here can be the start, so restart just after it.", c: `function canCompleteCircuit(gas, cost) {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    total += diff;
    tank += diff;
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return total >= 0 ? start : -1;
}
console.log(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]), canCompleteCircuit([2, 3, 4], [3, 4, 3]));`, time: "O(n)", space: "O(1)", ex: { 7: "Starting anywhere from start to i fails at i, so skip all of them.", 9: "Enough gas overall guarantees the remaining start works." } }
  ],
  signals: [["\"maximum number of non-overlapping …\"", "Greedy by earliest end"], ["\"minimum number of …\" to cover / reach", "Greedy (often sort first)"], ["\"can you reach the end\"", "Greedy farthest reach"], ["exchange-style pairing (heaviest with lightest)", "Sort + two pointers greedy"], ["greedy fails on a small example", "Switch to DP"]],
  mistakes: [["Using greedy without justification", "Test small cases or find an exchange argument; coin change with coins [1, 3, 4] breaks greedy for amount 6."], ["Sorting by the wrong key", "Meetings: by end time, not start time or length."], ["Forgetting ties and equal values", "Decide whether touching intervals overlap."], ["Mutating the input when sorting", "Copy first if the caller needs the original."]],
  js: ["Sort by end: arr.sort((a, b) => a[1] - b[1]).", "Math.max in a loop keeps a running best."],
  iq: { Beginner: ["Make change with the fewest coins using 25, 10, 5 and 1"], Easy: ["assign-cookies", "lemonade-change", "best-time-stock-ii", "maximum-units-truck"], Medium: ["jump-game", "jump-game-ii", "gas-station", "partition-labels", "non-overlapping-intervals", "task-scheduler", "two-city-scheduling"], Hard: ["candy", "ipo", "min-refuel-stops"] },
  rev: { s30: "Take the locally best choice and never look back. Usually sort + one pass. Only correct when an exchange argument proves it; otherwise use DP.", m2: ["Find the greedy rule (earliest end, smallest first…)", "Sort, then scan", "Prove with an exchange argument", "Counterexample ⇒ DP", "Intervals: sort by end to maximize count"] },
  cheat: `GREEDY CHEAT SHEET

sort by the greedy key
for item in sorted:
  if it fits: take it

Max non-overlapping intervals → sort by END
Jump game → track farthest reach
Gas station → reset start when tank < 0
Assign → sort both, two pointers

Proof: exchange argument
Fails? → DP`
};

export default greedy;
