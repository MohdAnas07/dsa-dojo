import type { Statement } from "./types";

export const SEARCH_SORT_INTERVALS_STATEMENTS: Record<string, Statement> = {
  "find-min-rotated": {
    body: [
      "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, [0,1,2,4,5,6,7] rotated 4 times becomes [4,5,6,7,0,1,2]. Rotating n times gives back the original array.",
      "Given the rotated array `nums` of unique elements, return the minimum element. You must write an algorithm that runs in O(log n) time."
    ],
    why: [
      "The original array was [1,2,3,4,5], rotated 3 times.",
      "The original array was [0,1,2,4,5,6,7], rotated 4 times.",
      "The array was rotated 4 times (its full length), so it is back in order and the minimum is the first element."
    ],
    walk: [
      "lo = 0, hi = 4. Compare the middle with the last element.",
      "mid = 2 (value 5) > nums[hi] = 2, so the drop to the minimum is to the right of mid → lo = 3.",
      "mid = 3 (value 1) ≤ nums[hi] = 2, so the minimum is at mid or to its left → hi = 3.",
      "lo == hi == 3. The minimum is nums[3] = 1."
    ],
    cons: ["n == nums.length", "1 ≤ n ≤ 5000", "-5000 ≤ nums[i] ≤ 5000", "All the integers of `nums` are unique.", "`nums` is sorted and rotated between 1 and n times."]
  },
  "search-rotated-ii": {
    body: [
      "There is an integer array `nums` sorted in non-decreasing order (not necessarily with distinct values) that has been rotated at an unknown pivot, for example [0,1,2,4,4,4,5,6,6,7] might become [4,5,6,6,7,0,1,2,4,4].",
      "Given the array after the rotation and an integer `target`, return `true` if target is in nums, or `false` if it is not. Duplicates can hide which half is sorted, so the worst case is O(n)."
    ],
    why: [
      "0 appears at indices 3 and 4.",
      "3 does not appear."
    ],
    walk: [
      "lo = 0, hi = 6.",
      "mid = 3: nums[3] = 0, which is the target. Return true.",
      "(If nums[lo], nums[mid] and nums[hi] were all equal, we couldn't tell which half is sorted, so we would shrink both ends by one and try again.)"
    ],
    cons: ["1 ≤ nums.length ≤ 5000", "-10⁴ ≤ nums[i], target ≤ 10⁴", "`nums` is a non-decreasing array that is possibly rotated."]
  },
  "search-2d-matrix": {
    body: [
      "You are given an m × n integer matrix with two properties: each row is sorted in non-decreasing order, and the first integer of each row is greater than the last integer of the previous row.",
      "Given an integer `target`, return `true` if target is in the matrix, or `false` otherwise. You must write a solution in O(log(m · n)) time."
    ],
    why: [
      "3 is in the first row.",
      "13 would sit between 11 and 16, but it isn't there."
    ],
    walk: [
      "Read the matrix as one sorted list of 12 values: index i is row ⌊i / 4⌋, column i % 4.",
      "lo = 0, hi = 11. mid = 5 → (1, 1) = 11 > 3 → hi = 4.",
      "mid = 2 → (0, 2) = 5 > 3 → hi = 1.",
      "mid = 0 → (0, 0) = 1 < 3 → lo = 1.",
      "mid = 1 → (0, 1) = 3. Found: return true."
    ],
    cons: ["m == matrix.length", "n == matrix[i].length", "1 ≤ m, n ≤ 100", "-10⁴ ≤ matrix[i][j], target ≤ 10⁴"]
  },
  "search-2d-matrix-ii": {
    body: [
      "Write an efficient algorithm that searches for a value `target` in an m × n integer matrix.",
      "The integers in each row are sorted in ascending order from left to right, and the integers in each column are sorted in ascending order from top to bottom. Unlike Search a 2D Matrix, a row can start below the previous row's end."
    ],
    why: [
      "5 is at row 1, column 1.",
      "20 is not in the matrix."
    ],
    walk: [
      "Start at the top-right corner, 15. Everything to its left is smaller and everything below it is bigger.",
      "15 > 5: the whole column below is too big, so move left to 11. 11 > 5: move left to 7. 7 > 5: move left to 4.",
      "4 < 5: the whole row to the left is too small, so move down to 5.",
      "5 == 5. Found: return true."
    ],
    cons: ["m == matrix.length", "n == matrix[i].length", "1 ≤ n, m ≤ 300", "-10⁹ ≤ matrix[i][j], target ≤ 10⁹", "Every row and every column is sorted in ascending order."]
  },
  "first-last-position": {
    body: [
      "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.",
      "If target is not found in the array, return [−1, −1]. You must write an algorithm with O(log n) runtime complexity."
    ],
    why: [
      "The two 8s are at indices 3 and 4.",
      "There is no 6.",
      "The array is empty."
    ],
    walk: [
      "Binary search for the first index whose value is ≥ 8: index 3 (nums[3] = 8, so 8 is present).",
      "Binary search for the first index whose value is > 8: index 5 (value 10).",
      "The last 8 is just before it, at index 4. Return [3, 4]."
    ],
    cons: ["0 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i], target ≤ 10⁹", "`nums` is sorted in non-decreasing order."]
  },
  "peak-element": {
    body: [
      "A peak element is an element that is strictly greater than its neighbours. Given an integer array `nums`, find a peak element and return its index. If the array contains multiple peaks, returning any of them is accepted.",
      "You may imagine that nums[−1] = nums[n] = −∞, so the first and last elements only need to beat their one real neighbour. No two neighbours are equal. You must write an algorithm that runs in O(log n) time."
    ],
    why: [
      "3 at index 2 is bigger than both 2 and 1.",
      "Both index 1 (value 2) and index 5 (value 6) are peaks; either answer is accepted."
    ],
    walk: [
      "lo = 0, hi = 3.",
      "mid = 1: nums[1] = 2 < nums[2] = 3. The values rise to the right, so a peak must exist there → lo = 2.",
      "mid = 2: nums[2] = 3 > nums[3] = 1. A peak is at mid or to its left → hi = 2.",
      "lo == hi == 2. Return 2."
    ],
    cons: ["1 ≤ nums.length ≤ 1000", "-2³¹ ≤ nums[i] ≤ 2³¹ − 1", "nums[i] != nums[i + 1] for all valid i."]
  },
  "sqrtx": {
    body: [
      "Given a non-negative integer `x`, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative as well.",
      "You must not use any built-in exponent function or operator, such as Math.sqrt or x ** 0.5."
    ],
    why: [
      "√4 = 2 exactly.",
      "√8 ≈ 2.83, which rounds down to 2.",
      "√0 = 0."
    ],
    walk: [
      "Binary search for the largest m with m · m ≤ x. lo = 0, hi = 4.",
      "m = 2: 2 · 2 = 4 ≤ 4, so 2 works. Try bigger: lo = 3.",
      "m = 3: 9 > 4, too big → hi = 2.",
      "The search ends. The largest m that worked is 2."
    ],
    cons: ["0 ≤ x ≤ 2³¹ − 1"]
  },
  "valid-perfect-square": {
    body: [
      "Given a positive integer `num`, return `true` if num is a perfect square or `false` otherwise.",
      "A perfect square is an integer that is the square of an integer. You must not use any built-in library function, such as sqrt."
    ],
    why: [
      "16 = 4 × 4.",
      "3 × 3 = 9 and 4 × 4 = 16, so no integer squares to 14."
    ],
    walk: [
      "Binary search m in [1, 16].",
      "m = 8: 64 > 16 → hi = 7.",
      "m = 4: 16 == 16. Return true."
    ],
    cons: ["1 ≤ num ≤ 2³¹ − 1"]
  },
  "capacity-ship-packages": {
    body: [
      "A conveyor belt has packages that must be shipped from one port to another within `days` days. The i-th package has a weight of `weights[i]`.",
      "Each day, we load the ship with packages in the order given by weights, without going over the ship's maximum weight capacity. Return the least weight capacity of the ship that will result in all the packages being shipped within days days."
    ],
    why: [
      "With capacity 15: [1,2,3,4,5], [6,7], [8], [9], [10] = 5 days. With 14 it takes 6 days. The order can't change, so [1,2,…] can't be regrouped freely.",
      "With capacity 6: [3,2], [2,4], [1,4].",
      "With capacity 3: [1,2], [3], [1,1]. A capacity below 3 could never carry the package that weighs 3."
    ],
    walk: [
      "The capacity is at least the heaviest package (10) and at most the total (55). Binary search that range, counting days greedily.",
      "32 → 2 days ≤ 5, works → hi = 32. 21 → 3 days → hi = 21.",
      "15 → [1–5], [6,7], [8], [9], [10] = 5 days → hi = 15.",
      "12 → 6 days, too many → lo = 13. 14 → 6 days → lo = 15.",
      "lo == hi == 15."
    ],
    cons: ["1 ≤ days ≤ weights.length ≤ 5 · 10⁴", "1 ≤ weights[i] ≤ 500"]
  },
  "split-array-largest-sum": {
    body: [
      "Given an integer array `nums` and an integer `k`, split nums into k non-empty contiguous subarrays such that the largest sum of any subarray is as small as possible.",
      "Return that minimized largest sum."
    ],
    why: [
      "Split into [7,2,5] and [10,8]: the sums are 14 and 18, so the largest is 18. Every other split has a bigger maximum.",
      "Split into [1,2,3] and [4,5]: the largest sum is 9.",
      "Each element is its own part: the largest is 4."
    ],
    walk: [
      "Binary search the answer S between max(nums) = 10 and sum(nums) = 32. For a given S, greedily cut whenever a part would exceed S, and count the parts.",
      "S = 21: [7,2,5], [10,8] = 2 parts ≤ k → works, hi = 21.",
      "S = 15: [7,2,5], [10], [8] = 3 parts > k → lo = 16.",
      "S = 18: [7,2,5], [10,8] = 2 parts → hi = 18. S = 17: 3 parts → lo = 18.",
      "The answer is 18."
    ],
    cons: ["1 ≤ nums.length ≤ 1000", "0 ≤ nums[i] ≤ 10⁶", "1 ≤ k ≤ min(50, nums.length)"]
  },
  "median-two-sorted": {
    body: [
      "Given two sorted arrays `nums1` and `nums2` of size m and n respectively, return the median of the two sorted arrays combined.",
      "The median is the middle value; with an even count it is the average of the two middle values. The overall run time complexity should be O(log(m + n)). Answers within 10⁻⁵ are accepted."
    ],
    why: [
      "Merged: [1, 2, 3]. The middle value is 2.",
      "Merged: [1, 2, 3, 4]. The median is (2 + 3) / 2 = 2.5."
    ],
    walk: [
      "Split both arrays so the left side holds half of all elements: (3 + 1) / 2 = 2 elements.",
      "Binary search on how many come from the shorter array, nums2 = [2]. Try taking 1 from nums2 and 1 from nums1: left = {1, 2}, right = {3}.",
      "Check: the largest on the left (2) ≤ the smallest on the right (3). The split is valid.",
      "The total is odd, so the median is the largest value on the left: 2."
    ],
    cons: ["nums1.length == m, nums2.length == n", "0 ≤ m, n ≤ 1000", "1 ≤ m + n ≤ 2000", "-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶"]
  },
  "time-based-kv-store": {
    body: [
      "Design a time-based key-value data structure that can store multiple values for the same key at different timestamps, and retrieve a key's value at a certain timestamp.",
      "Implement `TimeMap`: `set(key, value, timestamp)` stores the value at that time, and `get(key, timestamp)` returns the value set with the largest timestamp ≤ timestamp, or \"\" if there is none. The timestamps passed to set are strictly increasing.",
      "The example lists the calls on one line and their arguments on the next."
    ],
    why: [
      "get('foo', 1) → 'bar'. get('foo', 3): nothing was set at 3, and the latest earlier value is 'bar' (time 1). After set('foo', 'bar2', 4), get at 4 and at 5 both return 'bar2'."
    ],
    walk: [
      "Keep, for each key, a list of (timestamp, value) pairs. They arrive in increasing time order, so the list is sorted.",
      "set('foo', 'bar', 1) → foo: [(1, bar)]. get('foo', 1): the latest timestamp ≤ 1 is 1 → 'bar'.",
      "get('foo', 3): binary search finds timestamp 1 as the latest ≤ 3 → 'bar'.",
      "set('foo', 'bar2', 4) → foo: [(1, bar), (4, bar2)]. get at 4 → 'bar2'. get at 5 → latest ≤ 5 is 4 → 'bar2'."
    ],
    cons: ["1 ≤ key.length, value.length ≤ 100", "1 ≤ timestamp ≤ 10⁷", "The timestamps of set calls are strictly increasing.", "At most 2 · 10⁵ calls are made."]
  },
  "kth-smallest-sorted-matrix": {
    body: [
      "Given an n × n `matrix` where each of the rows and columns is sorted in ascending order, return the k-th smallest element in the matrix.",
      "It is the k-th smallest in sorted order, not the k-th distinct element. Try to use less than O(n²) memory."
    ],
    why: [
      "In sorted order the elements are [1, 5, 9, 10, 11, 12, 13, 13, 15]. The 8th is 13.",
      "The only element is −5."
    ],
    walk: [
      "Binary search on the value. For a guess v, count how many elements are ≤ v (walking the staircase takes O(n)).",
      "v = 8: only 1 and 5 → count 2 < 8 → lo = 9.",
      "v = 12: 1, 5, 9, 10, 11, 12 → count 6 < 8 → lo = 13.",
      "v = 14: count 8 ≥ 8 → hi = 14. v = 13: count 8 ≥ 8 → hi = 13.",
      "lo == hi == 13."
    ],
    cons: ["n == matrix.length == matrix[i].length", "1 ≤ n ≤ 300", "-10⁹ ≤ matrix[i][j] ≤ 10⁹", "1 ≤ k ≤ n²"]
  },
  "find-k-closest": {
    body: [
      "Given a sorted integer array `arr`, two integers `k` and `x`, return the k closest integers to x in the array. The result should also be sorted in ascending order.",
      "An integer a is closer to x than b if |a − x| < |b − x|, or if the distances are equal and a < b."
    ],
    why: [
      "Distances to 3: 1 → 2, 2 → 1, 3 → 0, 4 → 1, 5 → 2. Take 3, 2, 4, then 1 and 5 tie, and the smaller one (1) wins.",
      "x is to the left of everything, so the first four numbers are the closest.",
      "Same idea: the first four numbers, including both 1s."
    ],
    walk: [
      "The answer is a block of k consecutive elements. Binary search its start in [0, n − k] = [0, 1].",
      "Try start 0: compare x − arr[0] = 2 with arr[0 + k] − x = 5 − 3 = 2.",
      "The left end is not farther than the element just past the block, so start 0 is at least as good → hi = 0.",
      "The block starting at 0 is [1, 2, 3, 4]."
    ],
    cons: ["1 ≤ k ≤ arr.length ≤ 10⁴", "`arr` is sorted in ascending order.", "-10⁴ ≤ arr[i], x ≤ 10⁴"]
  },
  "single-element-sorted": {
    body: [
      "You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.",
      "Return the single element. Your solution must run in O(log n) time and O(1) space."
    ],
    why: [
      "Every value has a partner except 2.",
      "Every value has a partner except 10."
    ],
    walk: [
      "Before the single element, each pair starts at an even index. After it, pairs start at odd indices.",
      "lo = 0, hi = 8. mid = 4 (even): nums[4] = 3 but nums[5] = 4, so the pair is broken. The single is at or before 4 → hi = 4.",
      "mid = 2 (even): nums[2] = 2, nums[3] = 3, broken → hi = 2.",
      "mid = 1 → use the even index 0: nums[0] = nums[1] = 1, a good pair → lo = 2.",
      "lo == hi == 2: the single element is 2."
    ],
    cons: ["1 ≤ nums.length ≤ 10⁵", "0 ≤ nums[i] ≤ 10⁵"]
  },
  "min-days-bouquets": {
    body: [
      "You are given an integer array `bloomDay`, an integer `m` and an integer `k`. You want to make m bouquets. To make a bouquet, you need to use k adjacent flowers from the garden.",
      "The garden has n flowers; flower i blooms on day bloomDay[i] and can then be used in exactly one bouquet. Return the minimum number of days you need to wait to make m bouquets. If it is impossible, return −1."
    ],
    why: [
      "On day 3, flowers 0, 2 and 4 have bloomed. Each bouquet needs only 1 flower, so that makes 3 bouquets.",
      "3 bouquets of 2 flowers need 6 flowers, but there are only 5.",
      "On day 7, all but flower 4 have bloomed: [x, x, x, x, _, x, x]. That makes only one group of 3. On day 12 every flower is out, which gives 2 bouquets."
    ],
    walk: [
      "Binary search the day between 1 and 10. For a day d, count how many bouquets of k adjacent bloomed flowers you can make.",
      "d = 5: flowers 0, 2 and 4 have bloomed → 3 bouquets ≥ 3 → hi = 5.",
      "d = 3: still flowers 0, 2 and 4 → 3 → hi = 3.",
      "d = 2: only flowers 0 and 4 → 2 < 3 → lo = 3.",
      "The answer is day 3."
    ],
    cons: ["bloomDay.length == n", "1 ≤ n ≤ 10⁵", "1 ≤ bloomDay[i] ≤ 10⁹", "1 ≤ m ≤ 10⁶", "1 ≤ k ≤ n"]
  },
  "insert-interval": {
    body: [
      "You are given an array of non-overlapping intervals `intervals`, sorted by start, and a `newInterval`.",
      "Insert newInterval into intervals so that the result is still sorted by start and has no overlapping intervals; merge overlapping intervals if necessary. Return the result."
    ],
    why: [
      "[2,5] overlaps [1,3], so they merge into [1,5].",
      "[4,8] overlaps [3,5], [6,7] and [8,10], so all four merge into [3,10]."
    ],
    walk: [
      "Phase 1: copy the intervals that end before newInterval starts (2). [1,3] ends at 3, so none.",
      "Phase 2: merge every interval that overlaps [2,5]. [1,3] overlaps → [1,5]. [6,9] starts after 5, so stop.",
      "Add the merged [1,5].",
      "Phase 3: copy the rest: [6,9]. Result: [[1,5], [6,9]]."
    ],
    cons: ["0 ≤ intervals.length ≤ 10⁴", "intervals[i].length == 2", "0 ≤ startᵢ ≤ endᵢ ≤ 10⁵", "`intervals` is sorted by startᵢ and has no overlaps.", "newInterval.length == 2"]
  },
  "non-overlapping-intervals": {
    body: [
      "Given an array of intervals where intervals[i] = [startᵢ, endᵢ], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
      "Intervals that only touch at a point, like [1,2] and [2,3], do not overlap."
    ],
    why: [
      "Remove [1,3]; the rest only touch each other.",
      "Two of the three identical intervals must go.",
      "They only touch, so nothing needs to be removed."
    ],
    walk: [
      "Sort by end: [1,2], [2,3], [1,3], [3,4]. Keep an interval when it starts at or after the last kept end.",
      "Keep [1,2] (end 2). Keep [2,3]: 2 ≥ 2 (end 3).",
      "[1,3] starts at 1 < 3: it overlaps, so remove it (count 1).",
      "Keep [3,4]: 3 ≥ 3. One removal in total."
    ],
    cons: ["1 ≤ intervals.length ≤ 10⁵", "intervals[i].length == 2", "-5 · 10⁴ ≤ startᵢ < endᵢ ≤ 5 · 10⁴"]
  },
  "meeting-rooms": {
    body: [
      "Given an array of meeting time intervals where intervals[i] = [startᵢ, endᵢ], determine if a person could attend all meetings.",
      "A meeting that starts exactly when another ends does not conflict with it."
    ],
    why: [
      "[0,30] overlaps both other meetings.",
      "After sorting: [2,4], then [7,10]. No overlap."
    ],
    walk: [
      "Sort by start: [0,30], [5,10], [15,20].",
      "Compare each meeting with the one before it: [5,10] starts at 5, before [0,30] ends at 30.",
      "That is a conflict, so return false."
    ],
    cons: ["0 ≤ intervals.length ≤ 10⁴", "intervals[i].length == 2", "0 ≤ startᵢ < endᵢ ≤ 10⁶"]
  },
  "meeting-rooms-ii": {
    body: [
      "Given an array of meeting time intervals where intervals[i] = [startᵢ, endᵢ], return the minimum number of conference rooms required so that all meetings can take place.",
      "A meeting that starts exactly when another ends can reuse its room."
    ],
    why: [
      "[0,30] overlaps both others, but [5,10] and [15,20] can share a room: 2 rooms.",
      "The meetings don't overlap, so 1 room is enough."
    ],
    walk: [
      "Sort the start times [0, 5, 15] and the end times [10, 20, 30] separately.",
      "Start at 0: no meeting has ended yet → 1 room.",
      "Start at 5: the earliest end is 10, which is still in the future → 2 rooms.",
      "Start at 15: the meeting ending at 10 is over, so reuse its room → still 2. The maximum is 2."
    ],
    cons: ["1 ≤ intervals.length ≤ 10⁴", "0 ≤ startᵢ < endᵢ ≤ 10⁶"]
  },
  "car-pooling": {
    body: [
      "There is a car with `capacity` empty seats. The vehicle only drives east (it cannot turn around and drive west).",
      "You are given the integer capacity and an array `trips` where trips[i] = [numPassengers, from, to]: the i-th trip has numPassengers passengers, picked up at kilometre `from` and dropped off at kilometre `to`. Return `true` if it is possible to pick up and drop off all passengers for all the given trips, or `false` otherwise."
    ],
    why: [
      "Between kilometres 3 and 5, both trips are in the car: 2 + 3 = 5 passengers > 4 seats.",
      "With 5 seats, the busiest stretch (5 passengers) fits."
    ],
    walk: [
      "Record the change in passengers at each location: +2 at 1, −2 at 5, +3 at 3, −3 at 7.",
      "Sweep east. At 1: 2 passengers.",
      "At 3: 2 + 3 = 5 > 4. Return false."
    ],
    cons: ["1 ≤ trips.length ≤ 1000", "trips[i].length == 3", "1 ≤ numPassengersᵢ ≤ 100", "0 ≤ fromᵢ < toᵢ ≤ 1000", "1 ≤ capacity ≤ 10⁵"]
  },
  "min-arrows-balloons": {
    body: [
      "Some spherical balloons are taped onto a flat wall. Each balloon is given as [xstart, xend], its horizontal extent.",
      "Arrows are shot straight up from different points on the x-axis. An arrow shot at x bursts every balloon with xstart ≤ x ≤ xend. Return the minimum number of arrows that must be shot to burst all balloons."
    ],
    why: [
      "An arrow at 6 bursts [2,8] and [1,6]; an arrow at 11 bursts [10,16] and [7,12].",
      "No two balloons overlap, so each needs its own arrow.",
      "An arrow at 2 bursts [1,2] and [2,3]; one at 4 bursts [3,4] and [4,5]. Touching counts as overlapping here."
    ],
    walk: [
      "Sort by end: [1,6], [2,8], [7,12], [10,16].",
      "Shoot the first arrow at 6 (the first end). [2,8] starts at 2 ≤ 6, so it bursts too.",
      "[7,12] starts after 6: shoot a new arrow at 12. [10,16] starts at 10 ≤ 12, so it bursts.",
      "2 arrows in total."
    ],
    cons: ["1 ≤ points.length ≤ 10⁵", "points[i].length == 2", "-2³¹ ≤ xstart < xend ≤ 2³¹ − 1"]
  },
  "interval-list-intersections": {
    body: [
      "You are given two lists of closed intervals, `firstList` and `secondList`. Each list is pairwise disjoint and sorted.",
      "Return the intersection of these two interval lists. A closed interval [a, b] includes both ends, so two intervals that touch at a point intersect in that point, like [5,5]."
    ],
    why: [
      "Each pair of overlapping intervals contributes its overlap; for example [0,2] and [1,5] give [1,2], and [5,10] and [1,5] give [5,5].",
      "The second list is empty, so there is no intersection."
    ],
    walk: [
      "Pointers i and j. The overlap of two intervals is [max of starts, min of ends], if that is non-empty.",
      "[0,2] & [1,5] → [1,2]. [0,2] ends first, so move i.",
      "[5,10] & [1,5] → [5,5]. Move j. [5,10] & [8,12] → [8,10]. Move i.",
      "[13,23] & [8,12] → nothing. Move j. [13,23] & [15,24] → [15,23]. Move i.",
      "[24,25] & [15,24] → [24,24]. Move j. [24,25] & [25,26] → [25,25]. Done."
    ],
    cons: ["0 ≤ firstList.length, secondList.length ≤ 1000", "0 ≤ startᵢ < endᵢ ≤ 10⁹", "Each list is sorted and pairwise disjoint."]
  },
  "sort-array": {
    body: [
      "Given an array of integers `nums`, sort the array in ascending order and return it.",
      "You must solve the problem without using any built-in sort function, in O(n log n) time. This is a good place to practise merge sort."
    ],
    why: [
      "Sorted ascending.",
      "Duplicates stay, in sorted order."
    ],
    walk: [
      "Merge sort: split [5, 2, 3, 1] into [5, 2] and [3, 1].",
      "Split again into single elements and merge back: [2, 5] and [1, 3].",
      "Merge [2, 5] with [1, 3] by repeatedly taking the smaller front: 1, 2, 3, 5.",
      "Result: [1, 2, 3, 5]."
    ],
    cons: ["1 ≤ nums.length ≤ 5 · 10⁴", "-5 · 10⁴ ≤ nums[i] ≤ 5 · 10⁴"]
  },
  "largest-number": {
    body: [
      "Given a list of non-negative integers `nums`, arrange them such that they form the largest number and return it.",
      "The result may be very large, so return a string instead of an integer."
    ],
    why: [
      "'2' + '10' = '210' beats '10' + '2' = '102'.",
      "Put 9 first, then 5, then 34, 3, 30: '9534330'.",
      "'00' is just '0'."
    ],
    walk: [
      "Sort with a custom rule: a goes before b if a + b (as strings) > b + a.",
      "Compare 10 and 2: '102' vs '210'. '210' is bigger, so 2 goes first.",
      "Join: '210'. (If the first piece is '0', every piece is 0, so return '0'.)"
    ],
    cons: ["1 ≤ nums.length ≤ 100", "0 ≤ nums[i] ≤ 10⁹"]
  },
  "reverse-pairs": {
    body: [
      "Given an integer array `nums`, return the number of reverse pairs in the array.",
      "A reverse pair is a pair (i, j) where 0 ≤ i < j < nums.length and nums[i] > 2 · nums[j]."
    ],
    why: [
      "(1, 4): 3 > 2 · 1 and (3, 4): 3 > 2 · 1.",
      "(1, 4): 4 > 2, (2, 4): 3 > 2 and (3, 4): 5 > 2."
    ],
    walk: [
      "For each j, count the earlier values bigger than 2 · nums[j].",
      "j = 1 (3): need > 6 → none. j = 2 (2): need > 4 → none. j = 3 (3): need > 6 → none.",
      "j = 4 (1): need > 2 → the 3 at index 1 and the 3 at index 3 → 2.",
      "Total 2. Merge sort does this counting in O(n log n): before merging two sorted halves, count pairs across them with two pointers."
    ],
    cons: ["1 ≤ nums.length ≤ 5 · 10⁴", "-2³¹ ≤ nums[i] ≤ 2³¹ − 1"]
  },
  "count-of-smaller": {
    body: [
      "Given an integer array `nums`, return an integer array `counts` where counts[i] is the number of smaller elements to the right of nums[i]."
    ],
    why: [
      "To the right of 5 are 2 and 1 (2 smaller). Right of 2: only 1. Right of 6: only 1. Nothing is right of the last 1.",
      "Nothing is to the right.",
      "Equal values are not smaller."
    ],
    walk: [
      "Scan from the right, keeping the values seen so far in sorted order.",
      "1: nothing seen yet → 0. Seen: [1].",
      "6: 1 is smaller → 1. Seen: [1, 6].",
      "2: 1 is smaller → 1. Seen: [1, 2, 6].",
      "5: 1 and 2 are smaller → 2. Result: [2, 1, 1, 0]. (Merge sort on indices does this in O(n log n).)"
    ],
    cons: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"]
  },
  "h-index": {
    body: [
      "Given an array of integers `citations` where citations[i] is the number of citations a researcher received for their i-th paper, return the researcher's h-index.",
      "The h-index is the maximum value of h such that the researcher has published at least h papers that have each been cited at least h times."
    ],
    why: [
      "3 papers (with 3, 6 and 5 citations) have at least 3 citations each. There aren't 4 papers with at least 4.",
      "Only 1 paper has at least 2 citations, so h = 1."
    ],
    walk: [
      "Sort descending: [6, 5, 3, 1, 0].",
      "Paper 1 has 6 ≥ 1 ✓. Paper 2 has 5 ≥ 2 ✓. Paper 3 has 3 ≥ 3 ✓.",
      "Paper 4 has 1 ≥ 4 ✗. Stop.",
      "h = 3."
    ],
    cons: ["n == citations.length", "1 ≤ n ≤ 5000", "0 ≤ citations[i] ≤ 1000"]
  },
  "car-fleet": {
    body: [
      "There are n cars going to the same destination along a one-lane road, at mile `target`. Car i starts at position[i] and drives at speed[i] miles per hour.",
      "A car can never pass another car, but it can catch up and then drive bumper to bumper at the slower car's speed. A group of cars driving together is a fleet (a single car is also a fleet). A car that catches up exactly at the target joins the fleet. Return the number of fleets that arrive at the destination."
    ],
    why: [
      "The cars at 10 and 8 meet at the target and arrive as one fleet. The car at 0 never catches anyone. The cars at 5 and 3 meet at mile 6 and drive together. 3 fleets.",
      "One car is one fleet.",
      "The car at 0 catches the car at 2, and together they catch the car at 4 before the target: 1 fleet."
    ],
    walk: [
      "Work out each car's arrival time if it drove freely: pos 10 → 1 h, pos 8 → 1 h, pos 5 → 7 h, pos 3 → 3 h, pos 0 → 12 h.",
      "Go from the car closest to the target. Car 10 (1 h) starts fleet 1.",
      "Car 8 (1 h) would arrive no later, so it catches up and joins fleet 1.",
      "Car 5 (7 h) is slower: it starts fleet 2. Car 3 (3 h) catches up and joins it.",
      "Car 0 (12 h) is slower still: fleet 3. Answer: 3."
    ],
    cons: ["n == position.length == speed.length", "1 ≤ n ≤ 10⁵", "0 < target ≤ 10⁶", "0 ≤ position[i] < target", "All positions are unique.", "0 < speed[i] ≤ 10⁶"]
  }
};
