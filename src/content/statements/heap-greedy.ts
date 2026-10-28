import type { Statement } from "./types";

export const HEAP_GREEDY_STATEMENTS: Record<string, Statement> = {
  "kth-largest-stream": {
    body: [
      "Design a class to find the k-th largest element in a stream of numbers. It is the k-th largest in sorted order, not the k-th distinct element.",
      "Implement `KthLargest(k, nums)`, which starts with the numbers in nums, and `add(val)`, which adds val to the stream and returns the current k-th largest element. The example lists the calls on one line and their arguments on the next."
    ],
    why: [
      "With k = 3 and [4,5,8,2]: add 3 → the top three are 8, 5, 4 → 4. add 5 → 8, 5, 5 → 5. add 10 → 10, 8, 5 → 5. add 9 → 10, 9, 8 → 8. add 4 → still 8."
    ],
    walk: [
      "Keep a min-heap of the k largest numbers; its smallest element is the k-th largest.",
      "Start: keep [4, 5, 8] (2 is too small).",
      "add(3): 3 < 4, ignore → 4. add(5): replace 4 → [5, 5, 8] → 5.",
      "add(10): replace 5 → [5, 8, 10] → 5. add(9): replace 5 → [8, 9, 10] → 8.",
      "add(4): smaller than 8, ignore → 8."
    ],
    cons: ["1 ≤ k ≤ 10⁴", "0 ≤ nums.length ≤ 10⁴", "-10⁴ ≤ nums[i], val ≤ 10⁴", "At most 10⁴ calls to add; there are always at least k numbers when add returns."]
  },
  "last-stone-weight": {
    body: [
      "You are given an array of integers `stones` where stones[i] is the weight of the i-th stone.",
      "Each turn, choose the two heaviest stones and smash them together. If they weigh the same, both are destroyed; otherwise the lighter one is destroyed and the heavier one's weight becomes the difference. Return the weight of the last remaining stone, or 0 if none is left."
    ],
    why: [
      "8 and 7 → 1. 4 and 2 → 2. 2 and 1 → 1. 1 and 1 → both gone. One stone of weight 1 is left.",
      "Only one stone, so nothing is smashed."
    ],
    walk: [
      "Use a max-heap so the two heaviest are always on top. [8, 7, 4, 2, 1, 1].",
      "Smash 8 and 7 → 1. Stones: [4, 2, 1, 1, 1].",
      "Smash 4 and 2 → 2. Stones: [2, 1, 1, 1].",
      "Smash 2 and 1 → 1. Stones: [1, 1, 1]. Smash 1 and 1 → nothing. Stones: [1].",
      "The answer is 1."
    ],
    cons: ["1 ≤ stones.length ≤ 30", "1 ≤ stones[i] ≤ 1000"]
  },
  "k-closest-points": {
    body: [
      "Given an array of `points` where points[i] = [xᵢ, yᵢ] is a point on the X-Y plane and an integer `k`, return the k closest points to the origin (0, 0).",
      "Distance is the usual Euclidean distance √(x² + y²); comparing x² + y² is enough. You may return the answer in any order. The answer is guaranteed to be unique."
    ],
    why: [
      "(1, 3) has squared distance 10 and (−2, 2) has 8, so (−2, 2) is closer.",
      "Squared distances: (3, 3) → 18, (5, −1) → 26, (−2, 4) → 20. The two closest are (3, 3) and (−2, 4)."
    ],
    walk: [
      "Compute each point's squared distance: (1, 3) → 10, (−2, 2) → 8.",
      "Keep the k = 1 smallest (a max-heap of size k does this for big inputs).",
      "The closest point is (−2, 2)."
    ],
    cons: ["1 ≤ k ≤ points.length ≤ 10⁴", "-10⁴ ≤ xᵢ, yᵢ ≤ 10⁴"]
  },
  "task-scheduler": {
    body: [
      "You are given an array of CPU `tasks`, each labeled with a letter from A to Z, and a number `n`. Each CPU interval can complete one task or be idle. Tasks can be done in any order.",
      "Two tasks with the same label must be separated by at least n intervals. Return the minimum number of intervals required to complete all tasks."
    ],
    why: [
      "A → B → idle → A → B → idle → A → B: 8 intervals.",
      "No two equal tasks need idle time between them with n = 1, for example A → B → C → A → D → B: 6 intervals.",
      "A → B → idle → idle → A → B → idle → idle → A → B: 10 intervals."
    ],
    walk: [
      "The most frequent task, A (3 times), sets the frame: A _ _ A _ _ A, with n = 2 slots between each copy.",
      "That is (3 − 1) frames of size n + 1 = 3, plus the last row.",
      "B also appears 3 times, so the last row is 'A B': (3 − 1) × 3 + 2 = 8.",
      "The answer is the larger of 8 and the number of tasks (6): 8."
    ],
    cons: ["1 ≤ tasks.length ≤ 10⁴", "tasks[i] is an uppercase English letter.", "0 ≤ n ≤ 100"]
  },
  "find-median-stream": {
    body: [
      "The median is the middle value in an ordered list of integers. If the list has an even size, there is no single middle value, and the median is the mean of the two middle values.",
      "Implement `MedianFinder` with `addNum(num)`, which adds a number from the data stream, and `findMedian()`, which returns the median of all numbers so far. Answers within 10⁻⁵ are accepted. The example lists the calls on one line and their arguments on the next."
    ],
    why: [
      "After 1 and 2, the median is (1 + 2) / 2 = 1.5. After adding 3, the list is [1, 2, 3] and the median is 2."
    ],
    walk: [
      "Keep the smaller half in a max-heap `low` and the larger half in a min-heap `high`, with low the same size as high or one bigger.",
      "addNum(1) → low [1]. addNum(2) → high [2].",
      "findMedian(): the sizes are equal, so (1 + 2) / 2 = 1.5.",
      "addNum(3) → high [2, 3]. high is now bigger, so move its smallest (2) to low → low [1, 2], high [3].",
      "findMedian(): low has the extra element, so the median is its top, 2."
    ],
    cons: ["-10⁵ ≤ num ≤ 10⁵", "findMedian is only called after at least one addNum.", "At most 5 · 10⁴ calls are made."]
  },
  "reorganize-string": {
    body: [
      "Given a string `s`, rearrange the characters of s so that any two adjacent characters are not the same.",
      "Return any possible rearrangement of s, or return \"\" if it is not possible."
    ],
    why: [
      "'aba' has no equal neighbours.",
      "'a' makes up 3 of the 4 characters. However you place them, two 'a's end up side by side."
    ],
    walk: [
      "Count the letters: a → 2, b → 1. If some letter appeared more than ⌈n / 2⌉ times, it would be impossible.",
      "Place the most frequent letter at the even positions first: 'a _ a'.",
      "Fill the remaining positions with the other letters: 'a b a'.",
      "Result: 'aba'."
    ],
    cons: ["1 ≤ s.length ≤ 500", "`s` consists of lowercase English letters."]
  },
  "ugly-number-ii": {
    body: [
      "An ugly number is a positive integer whose prime factors are limited to 2, 3 and 5. By convention, 1 is the first ugly number.",
      "Given an integer `n`, return the n-th ugly number."
    ],
    why: [
      "The first ten ugly numbers are 1, 2, 3, 4, 5, 6, 8, 9, 10, 12. (7 and 11 are prime factors not allowed.)",
      "The first ugly number is 1."
    ],
    walk: [
      "Every ugly number is a smaller ugly number times 2, 3 or 5. Keep one pointer per factor into the list built so far.",
      "Start [1]. Candidates 2, 3, 5 → take 2. Then 4, 3, 5 → 3. Then 4, 6, 5 → 4. Then 5.",
      "Next 6 (from both 3 × 2 and 2 × 3; advance both pointers). Then 8, 9, 10.",
      "Then 12. That is the 10th number."
    ],
    cons: ["1 ≤ n ≤ 1690"]
  },
  "ipo": {
    body: [
      "You want to raise your company's capital before an IPO. You can finish at most `k` distinct projects. You start with capital `w`.",
      "Project i requires at least capital[i] to start and, when finished, adds profits[i] to your capital (the required capital is not spent). Choose projects to maximize your final capital and return it."
    ],
    why: [
      "With 0 capital only project 0 is possible → capital 1. Now projects 1 and 2 are possible; pick the bigger profit, 3 → capital 4.",
      "Project 0 → 1, then project 1 (needs 1) → 3, then project 2 (needs 2) → 6."
    ],
    walk: [
      "Sort projects by required capital. Each round, add every affordable project's profit to a max-heap, then take the best.",
      "Round 1, capital 0: only project 0 is affordable → heap [1]. Take 1 → capital 1.",
      "Round 2, capital 1: projects 1 and 2 become affordable → heap [2, 3]. Take 3 → capital 4.",
      "k = 2 rounds are done. The answer is 4."
    ],
    cons: ["1 ≤ k ≤ 10⁵", "0 ≤ w ≤ 10⁹", "n == profits.length == capital.length", "1 ≤ n ≤ 10⁵", "0 ≤ profits[i] ≤ 10⁴", "0 ≤ capital[i] ≤ 10⁹"]
  },
  "connect-sticks": {
    body: [
      "You have some sticks with positive integer lengths, given in the array `sticks`.",
      "You can connect any two sticks of lengths x and y into one stick by paying a cost of x + y. Repeat until there is one stick. Return the minimum cost of connecting all the sticks."
    ],
    why: [
      "Join 2 + 3 = 5 (cost 5), then 5 + 4 = 9 (cost 9): total 14.",
      "Join 1 + 3 = 4, then 4 + 5 = 9, then 9 + 8 = 17: total 4 + 9 + 17 = 30.",
      "There is only one stick, so no cost."
    ],
    walk: [
      "Always join the two shortest sticks (a min-heap), because early joins are paid again in later ones.",
      "Sticks [2, 3, 4]: join 2 and 3 → 5, cost 5. Sticks [4, 5].",
      "Join 4 and 5 → 9, cost 9.",
      "Total 5 + 9 = 14."
    ],
    cons: ["1 ≤ sticks.length ≤ 10⁴", "1 ≤ sticks[i] ≤ 10⁴"]
  },
  "jump-game": {
    body: [
      "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element represents your maximum jump length from that position.",
      "Return `true` if you can reach the last index, or `false` otherwise."
    ],
    why: [
      "Jump 1 step from index 0 to 1, then 3 steps to the last index.",
      "Every route lands on index 3, whose jump length is 0, so the last index can't be reached."
    ],
    walk: [
      "Track the farthest index reachable so far.",
      "i = 0: reach max(0, 0 + 2) = 2.",
      "i = 1: reach max(2, 1 + 3) = 4, which is the last index.",
      "Return true."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁴", "0 ≤ nums[i] ≤ 10⁵"]
  },
  "jump-game-ii": {
    body: [
      "You are given an integer array `nums`, starting at index 0. Each element nums[i] is the maximum length of a forward jump from index i.",
      "Return the minimum number of jumps to reach the last index. The test cases are generated so that you can always reach it."
    ],
    why: [
      "Jump 1 step to index 1, then 3 steps to the last index: 2 jumps.",
      "Same route: index 0 → 1 → 4."
    ],
    walk: [
      "Think in rounds: each round covers every index reachable with one more jump.",
      "With 0 jumps you are at index 0, which reaches up to index 2.",
      "With 1 jump you can stand on index 1 or 2. From those you reach up to max(1 + 3, 2 + 1) = 4.",
      "Index 4 is the last one, so 2 jumps."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁴", "0 ≤ nums[i] ≤ 1000", "The last index is always reachable."]
  },
  "video-stitching": {
    body: [
      "You are given a series of video clips from a sporting event that lasted `time` seconds. Each clip is [startᵢ, endᵢ]. Clips can overlap and can be cut into pieces freely.",
      "Return the minimum number of clips needed to cover the whole event [0, time]. If it can't be done, return −1."
    ],
    why: [
      "[0,2] + [1,9] + [8,10] cover 0–10.",
      "Nothing covers anything after 2.",
      "[0,4] + [4,7] + [6,9] cover 0–9."
    ],
    walk: [
      "Greedy: from the point covered so far, pick the clip that starts within it and reaches farthest.",
      "Covered up to 0. Clips starting at 0: [0,2] → covered up to 2 (1 clip).",
      "Clips starting at ≤ 2: [1,9] reaches farthest → covered up to 9 (2 clips).",
      "Clips starting at ≤ 9: [8,10] → covered up to 10 (3 clips). Done: 3."
    ],
    cons: ["1 ≤ clips.length ≤ 100", "0 ≤ startᵢ ≤ endᵢ ≤ 100", "1 ≤ time ≤ 100"]
  },
  "gas-station": {
    body: [
      "There are n gas stations along a circular route, where station i has gas[i] fuel. Your car has an unlimited tank, and it costs cost[i] fuel to drive from station i to station i + 1. You start with an empty tank at one of the stations.",
      "Return the starting station's index if you can travel around the circuit once in the clockwise direction, otherwise return −1. If a solution exists, it is unique."
    ],
    why: [
      "Start at station 3 with 4 fuel: after each leg the tank holds 3, 6, 4, 2, then 0 back at station 3.",
      "There is 9 fuel in total but the trip costs 10, so no start works."
    ],
    walk: [
      "If total gas ≥ total cost, a start exists. Keep a running tank; whenever it goes negative, no station so far can be the start, so restart after it.",
      "Station 0: 1 − 3 = −2 < 0 → start = 1, tank 0. Station 1: 2 − 4 < 0 → start = 2.",
      "Station 2: 3 − 5 < 0 → start = 3.",
      "Station 3: 4 − 1 = 3. Station 4: 3 + 5 − 2 = 6. The tank never goes negative again.",
      "Total gas 15 ≥ total cost 15, so the answer is 3."
    ],
    cons: ["n == gas.length == cost.length", "1 ≤ n ≤ 10⁵", "0 ≤ gas[i], cost[i] ≤ 10⁴"]
  },
  "hand-of-straights": {
    body: [
      "Alice has some number of cards and wants to rearrange them into groups so that each group has size `groupSize` and consists of groupSize consecutive cards.",
      "Given the array `hand` (the value on each card) and groupSize, return `true` if she can rearrange the cards this way, or `false` otherwise."
    ],
    why: [
      "The groups [1,2,3], [2,3,4] and [6,7,8] use every card.",
      "5 cards can't be split into groups of 4."
    ],
    walk: [
      "The smallest remaining card must start a group. Count the cards: {1: 1, 2: 2, 3: 2, 4: 1, 6: 1, 7: 1, 8: 1}.",
      "Smallest is 1 → use 1, 2, 3.",
      "Smallest left is 2 → use 2, 3, 4.",
      "Smallest left is 6 → use 6, 7, 8. Every card is used, so return true."
    ],
    cons: ["1 ≤ hand.length ≤ 10⁴", "0 ≤ hand[i] ≤ 10⁹", "1 ≤ groupSize ≤ hand.length"]
  },
  "merge-triplets": {
    body: [
      "A triplet is an array of three integers. You are given a 2D array `triplets` and a `target` triplet.",
      "You may repeatedly choose two triplets i and j and update triplet j to [max(aᵢ, aⱼ), max(bᵢ, bⱼ), max(cᵢ, cⱼ)]. Return `true` if it is possible to obtain the target triplet as an element of triplets, or `false` otherwise."
    ],
    why: [
      "Merge [2,5,3] and [1,7,5] → [2,7,5]. [1,8,4] can't be used: its 8 would overshoot 7.",
      "Every triplet has a value bigger than the target in some position, so none can be used.",
      "Merge [2,5,3], [1,2,5] and [5,2,3] → [5,5,5]."
    ],
    walk: [
      "Merging only takes maximums, so a triplet with any value above the target can never be used. Drop those.",
      "[2,5,3] ✓, [1,8,4] ✗ (8 > 7), [1,7,5] ✓.",
      "Position 0 needs a 2: [2,5,3] has it. Position 1 needs a 7: [1,7,5]. Position 2 needs a 5: [1,7,5].",
      "Every position can be matched, so return true."
    ],
    cons: ["1 ≤ triplets.length ≤ 10⁵", "triplets[i].length == target.length == 3", "1 ≤ values ≤ 1000"]
  },
  "candy": {
    body: [
      "There are n children standing in a line. Each child has a rating value given in the integer array `ratings`.",
      "You give candies to these children with two rules: each child gets at least one candy, and a child with a higher rating than a neighbour gets more candies than that neighbour. Return the minimum number of candies you need."
    ],
    why: [
      "Give 2, 1, 2 candies: 5 in total.",
      "Give 1, 2, 1. The last child's rating equals its neighbour's, so it doesn't need more: 4 in total."
    ],
    walk: [
      "Start everyone at 1. Left to right: if a child beats their left neighbour, give them left + 1 → [1, 1, 2].",
      "Right to left: if a child beats their right neighbour, make sure they have right + 1.",
      "Child 0 (rating 1) beats child 1 (rating 0) → max(1, 1 + 1) = 2 → [2, 1, 2].",
      "Total 5."
    ],
    cons: ["n == ratings.length", "1 ≤ n ≤ 2 · 10⁴", "0 ≤ ratings[i] ≤ 2 · 10⁴"]
  },
  "assign-cookies": {
    body: [
      "You want to give your children some cookies, but each child gets at most one cookie. Child i is content with a cookie of size ≥ g[i] (their greed factor); cookie j has size s[j].",
      "Maximize the number of content children and return it."
    ],
    why: [
      "Both cookies have size 1, so only the child with greed 1 can be made content.",
      "Cookies 1 and 2 (or 3) satisfy both children."
    ],
    walk: [
      "Sort both lists. Give the smallest cookie that satisfies the least greedy child still waiting.",
      "Child greed 1, cookie 1: content (1 child).",
      "Child greed 2, cookie 1: too small. No cookies are left.",
      "1 content child."
    ],
    cons: ["1 ≤ g.length ≤ 3 · 10⁴", "0 ≤ s.length ≤ 3 · 10⁴", "1 ≤ g[i], s[j] ≤ 2³¹ − 1"]
  },
  "lemonade-change": {
    body: [
      "At a lemonade stand, each lemonade costs $5. Customers stand in a queue and order one at a time, paying with a $5, $10 or $20 bill, given in the array `bills`.",
      "You must give each customer the correct change so that they pay exactly $5. You start with no change at all. Return `true` if you can give every customer correct change, or `false` otherwise."
    ],
    why: [
      "The first three pay $5. The fourth pays $10 and gets $5 back. The fifth pays $20 and gets $10 + $5 back.",
      "After two $10s you have no $5 left, so you can't give the last customer $15 in change."
    ],
    walk: [
      "Count your $5 and $10 bills.",
      "$5, $5, $5 → three $5s.",
      "$10 → give back $5: two $5s, one $10.",
      "$20 → give back $10 + $5 (keep $5s for later when possible): one $5, no $10s. Everyone was served, so return true."
    ],
    cons: ["1 ≤ bills.length ≤ 10⁵", "bills[i] is 5, 10 or 20."]
  },
  "best-time-stock-ii": {
    body: [
      "You are given an integer array `prices` where prices[i] is the price of a given stock on day i.",
      "On each day you may buy and/or sell the stock. You can hold at most one share at any time, but you can buy and sell again on the same day. Return the maximum profit you can achieve."
    ],
    why: [
      "Buy at 1, sell at 5 (+4); buy at 3, sell at 6 (+3): 7.",
      "Buy at 1 and sell at 5: 4. (Selling every day and buying again gives the same.)",
      "Prices only fall, so don't trade."
    ],
    walk: [
      "Every rise from one day to the next can be captured, so add up the positive differences.",
      "7 → 1: down. 1 → 5: +4.",
      "5 → 3: down. 3 → 6: +3.",
      "6 → 4: down. Total 7."
    ],
    cons: ["1 ≤ prices.length ≤ 3 · 10⁴", "0 ≤ prices[i] ≤ 10⁴"]
  },
  "queue-reconstruction": {
    body: [
      "You are given an array of people, `people`, which describes people standing in a queue (in a scrambled order). Each people[i] = [hᵢ, kᵢ] means person i has height hᵢ and exactly kᵢ people in front of them have a height greater than or equal to hᵢ.",
      "Reconstruct and return the queue as an array in the same format, where the first element is the person at the front."
    ],
    why: [
      "For example [4,4] has four people of height ≥ 4 in front (5, 7, 5, 6), and [7,1] has exactly one (the 7 at the front).",
      "Every person's k value matches the people in front of them."
    ],
    walk: [
      "Sort by height descending, and by k ascending for equal heights: [7,0], [7,1], [6,1], [5,0], [5,2], [4,4].",
      "Insert each person at index k. Taller people are already placed, and shorter ones inserted later don't affect them.",
      "[7,0] → [[7,0]]. [7,1] → [[7,0],[7,1]]. [6,1] → [[7,0],[6,1],[7,1]].",
      "[5,0] → index 0. [5,2] → index 2. [4,4] → index 4.",
      "Result: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]."
    ],
    cons: ["1 ≤ people.length ≤ 2000", "0 ≤ hᵢ ≤ 10⁶", "0 ≤ kᵢ < people.length", "A valid queue always exists."]
  },
  "min-refuel-stops": {
    body: [
      "A car travels from a starting position to a destination `target` miles east. It starts with `startFuel` liters of fuel and uses one liter per mile. Along the way there are gas stations: stations[i] = [positionᵢ, fuelᵢ].",
      "When the car reaches a station, it may stop and take all of that station's fuel. Return the minimum number of refueling stops needed to reach the destination, or −1 if it can't be reached. Arriving with 0 fuel still counts as arriving."
    ],
    why: [
      "The car already has enough fuel for 1 mile.",
      "With 1 liter the car can't even reach the first station at mile 10.",
      "Stop at mile 10 (60 liters) and mile 60 (40 liters): 2 stops."
    ],
    walk: [
      "Drive as far as possible. Remember the fuel of every station passed (a max-heap); when stuck, pretend you stopped at the best one.",
      "10 liters reach mile 10. Heap: [60]. Stuck → take 60 (1 stop) → can reach mile 70.",
      "Pass the stations at 20, 30 and 60 → heap [30, 30, 40]. 70 < 100, stuck → take 40 (2 stops) → can reach mile 110.",
      "110 ≥ 100. The answer is 2."
    ],
    cons: ["1 ≤ target, startFuel ≤ 10⁹", "0 ≤ stations.length ≤ 500", "1 ≤ positionᵢ < positionᵢ₊₁ < target", "1 ≤ fuelᵢ < 10⁹"]
  },
  "maximum-units-truck": {
    body: [
      "You are assigned to put some boxes onto one truck. boxTypes[i] = [numberOfBoxesᵢ, numberOfUnitsPerBoxᵢ].",
      "The truck can hold at most `truckSize` boxes. Return the maximum total number of units that can be put on the truck."
    ],
    why: [
      "Take 1 box of 3 units, 2 boxes of 2 units and 1 box of 1 unit: 3 + 4 + 1 = 8.",
      "Take 5 boxes of 10 (50), 3 boxes of 9 (27) and 2 boxes of 7 (14): 91."
    ],
    walk: [
      "Load the boxes with the most units first.",
      "1 box × 3 units → 3 units, 3 spaces left.",
      "2 boxes × 2 units → 7 units, 1 space left.",
      "1 box × 1 unit → 8 units. The truck is full."
    ],
    cons: ["1 ≤ boxTypes.length ≤ 1000", "1 ≤ numberOfBoxesᵢ, numberOfUnitsPerBoxᵢ ≤ 1000", "1 ≤ truckSize ≤ 10⁶"]
  },
  "two-city-scheduling": {
    body: [
      "A company is planning to interview 2n people. costs[i] = [aCostᵢ, bCostᵢ]: flying person i to city A costs aCostᵢ, and flying them to city B costs bCostᵢ.",
      "Return the minimum cost to fly every person to a city such that exactly n people arrive in each city."
    ],
    why: [
      "Send the first two people to A (10 + 30) and the last two to B (50 + 20): 110.",
      "The cheapest split gives 1859."
    ],
    walk: [
      "Sort people by how much cheaper A is than B (aCost − bCost): [30,200] (−170), [10,20] (−10), [30,20] (+10), [400,50] (+350).",
      "Send the first n = 2 to A: 30 + 10 = 40.",
      "Send the rest to B: 20 + 50 = 70.",
      "Total 110."
    ],
    cons: ["2n == costs.length", "2 ≤ costs.length ≤ 100", "costs.length is even", "1 ≤ aCostᵢ, bCostᵢ ≤ 1000"]
  },
  "furthest-building": {
    body: [
      "You are given an integer array `heights` representing the heights of buildings, some `bricks`, and some `ladders`. You start at building 0 and move to the next building one at a time.",
      "Moving to a building that is not taller costs nothing. Climbing up needs either (next height − current height) bricks or one ladder. Return the furthest building index (0-indexed) you can reach using the given ladders and bricks optimally."
    ],
    why: [
      "Climb 2 → 7 with 5 bricks and 6 → 9 with the ladder. 9 → 14 needs 5 more bricks, but none are left, so you stop at index 4.",
      "Using the ladders on the two biggest climbs lets you reach index 7.",
      "The one climb, 3 → 19, needs 16 of the 17 bricks, so you reach the last building, index 3."
    ],
    walk: [
      "Use ladders on the biggest climbs. Keep the climbs so far in a min-heap of size ≤ ladders; the smallest extra climb is paid with bricks.",
      "4 → 2: down. 2 → 7: climb 5 → heap [5] (it uses the ladder for now).",
      "7 → 6: down. 6 → 9: climb 3 → heap [3, 5] is too big → pay the smallest, 3, with bricks (5 − 3 = 2 left).",
      "9 → 14: climb 5 → heap [5, 5] → pay 5 with bricks → 2 − 5 < 0. Stop.",
      "The furthest building is index 4."
    ],
    cons: ["1 ≤ heights.length ≤ 10⁵", "1 ≤ heights[i] ≤ 10⁶", "0 ≤ bricks ≤ 10⁹", "0 ≤ ladders ≤ heights.length"]
  },
  "find-k-pairs-smallest-sums": {
    body: [
      "You are given two integer arrays `nums1` and `nums2` sorted in non-decreasing order and an integer `k`. A pair (u, v) has one element from nums1 and one from nums2.",
      "Return the k pairs with the smallest sums, in any order."
    ],
    why: [
      "The smallest sums are 1 + 2 = 3, 1 + 4 = 5 and 1 + 6 = 7.",
      "nums1 has two 1s, so the pair [1, 1] appears twice."
    ],
    walk: [
      "Pair every nums1 value with nums2[0] in a min-heap by sum: (1,2) = 3, (7,2) = 9, (11,2) = 13.",
      "Pop (1,2) = 3 → record it, push its next partner (1,4) = 5.",
      "Pop (1,4) = 5 → record it, push (1,6) = 7.",
      "Pop (1,6) = 7 → record it. That is k = 3 pairs."
    ],
    cons: ["1 ≤ nums1.length, nums2.length ≤ 10⁵", "-10⁹ ≤ nums1[i], nums2[i] ≤ 10⁹", "Both arrays are sorted in non-decreasing order.", "1 ≤ k ≤ 10⁴ and k ≤ nums1.length × nums2.length"]
  },
  "single-threaded-cpu": {
    body: [
      "You are given n tasks labeled 0 to n − 1, as a 2D array `tasks` where tasks[i] = [enqueueTimeᵢ, processingTimeᵢ]: task i becomes available at enqueueTimeᵢ and takes processingTimeᵢ to finish.",
      "A single-threaded CPU processes one task at a time and never stops a task midway. When idle with tasks available, it picks the one with the shortest processing time (ties go to the smallest index). If no tasks are available, it waits. Return the order in which the CPU processes the tasks."
    ],
    why: [
      "Task 0 starts at time 1. At time 3, tasks 1 and 2 wait; 2 is shorter. At time 5, task 3 (length 1) beats task 1. Task 1 runs last.",
      "All tasks arrive at time 7, so they run shortest first: 4 (2), 3 (4), 2 (5), 0 (10), 1 (12)."
    ],
    walk: [
      "Sort tasks by arrival time, and use a min-heap of (processing time, index) for the available ones.",
      "Time 1: task 0 is available → run it, 1 to 3.",
      "Time 3: tasks 1 (4) and 2 (2) are available → run task 2, 3 to 5.",
      "Time 5: tasks 1 (4) and 3 (1) → run task 3, 5 to 6. Then task 1.",
      "Order: [0, 2, 3, 1]."
    ],
    cons: ["1 ≤ tasks.length ≤ 10⁵", "1 ≤ enqueueTimeᵢ, processingTimeᵢ ≤ 10⁹"]
  }
};
