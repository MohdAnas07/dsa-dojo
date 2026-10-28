import type { Lesson } from "@/lib/types";

const intervals: Lesson = {
  what: "Interval problems work with ranges [start, end]: meetings, bookings, time slots, number ranges. Most of them start the same way: sort the intervals, then sweep through them once.",
  analogy: { short: "A shared calendar", text: "Put every meeting on one timeline. Overlapping meetings stack up; merging them gives the busy blocks; counting how many overlap at once tells you how many rooms you need." },
  eli5: "Each interval is a stick on a ruler. You line the sticks up from left to right, then see which ones overlap.",
  tech: "Two intervals [a, b] and [c, d] overlap when a ≤ d and c ≤ b (decide whether touching ends count). Sorting by start puts overlapping intervals next to each other, so merging is one pass: extend the last merged interval while the next one starts before it ends. Sorting by end is the greedy key for keeping the maximum number of non-overlapping intervals. For 'how many at once' (meeting rooms), sweep over sorted start and end times or use a min-heap of end times. Everything is O(n log n) for the sort plus O(n).",
  why: "Scheduling, booking systems, calendars, range merging and resource allocation are common real-world problems and a favourite interview family because one idea (sort, then sweep) solves many variations.",
  how: ["Decide the overlap rule: does [1,2] overlap [2,3]?", "Sort by start (merging, inserting) or by end (keeping the most intervals).", "Sweep once, comparing each interval with the last kept/merged one.", "Merging: if it overlaps, extend the end with Math.max; otherwise start a new block.", "Counting simultaneous intervals: sort starts and ends separately and sweep."],
  props: ["Sort first: O(n log n)", "Overlap: start ≤ other end and other start ≤ end", "Merging needs Math.max (an interval can sit inside another)", "Touching ends: decide and be consistent"],
  use: ["Merging overlapping ranges", "Inserting a new booking", "Minimum rooms / platforms / resources", "Maximum non-overlapping set (greedy)", "Intersections of two schedules"],
  avoid: ["Point lookups in a huge set of changing intervals (interval tree)", "Intervals that change often (a sweep would be re-run each time)"],
  viz: "array",
  cx: [["Sort", "O(n log n)", "Dominates the run time."], ["Sweep", "O(n)", "One pass after sorting."], ["Rooms with a min-heap", "O(n log n)", "One heap operation per meeting."]],
  space: "O(n) for the output (or the sorted copy).",
  code: {
    c: `function merge(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [s, e] of sorted) {
    const last = out[out.length - 1];
    if (last && s <= last[1]) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
  }
  return out;
}
console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]]));
console.log(merge([[1, 4], [4, 5]]));
console.log(merge([[1, 10], [2, 3], [4, 5]]));`,
    hl: [2, 6],
    ex: { 2: "Sort by start so overlapping intervals end up next to each other.", 6: "Overlaps the last merged block: extend it. Math.max handles intervals that sit fully inside.", 7: "A gap: start a new block.", 13: "[2,3] and [4,5] are inside [1,10], so its end must not shrink." }
  },
  examples: [
    { lvl: "Easy", title: "Can one person attend every meeting?", prob: "Return false if any two meetings overlap.", idea: "After sorting by start, only neighbours can overlap.", c: `function canAttendMeetings(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < sorted.length; i++) if (sorted[i][0] < sorted[i - 1][1]) return false;
  return true;
}
console.log(canAttendMeetings([[0, 30], [5, 10], [15, 20]]), canAttendMeetings([[7, 10], [2, 4]]));`, time: "O(n log n)", space: "O(n)", ex: { 3: "A meeting starting before the previous one ends is a conflict (touching is fine)." } },
    { lvl: "Practical", title: "Insert an interval", prob: "Insert a new interval into a sorted, non-overlapping list and merge where needed.", idea: "Three phases: copy the intervals that end before it, merge everything that overlaps it, copy the rest.", c: `function insert(intervals, [s, e]) {
  const out = [];
  let i = 0;
  while (i < intervals.length && intervals[i][1] < s) out.push(intervals[i++]);
  while (i < intervals.length && intervals[i][0] <= e) {
    s = Math.min(s, intervals[i][0]);
    e = Math.max(e, intervals[i][1]);
    i++;
  }
  out.push([s, e]);
  while (i < intervals.length) out.push(intervals[i++]);
  return out;
}
console.log(insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]));`, time: "O(n)", space: "O(n)", ex: { 4: "Phase 1: entirely before the new interval.", 5: "Phase 2: overlapping, so grow the new interval to cover them.", 11: "Phase 3: entirely after it." } },
    { lvl: "Interview", title: "Minimum meeting rooms", prob: "How many rooms are needed so that all meetings can happen?", idea: "Sort start times and end times separately. Walk through the starts; every meeting that has already ended frees a room.", c: `function minMeetingRooms(intervals) {
  const starts = intervals.map(x => x[0]).sort((a, b) => a - b);
  const ends = intervals.map(x => x[1]).sort((a, b) => a - b);
  let rooms = 0, best = 0, j = 0;
  for (const s of starts) {
    while (ends[j] <= s) { j++; rooms--; }
    rooms++;
    best = Math.max(best, rooms);
  }
  return best;
}
console.log(minMeetingRooms([[0, 30], [5, 10], [15, 20]]), minMeetingRooms([[7, 10], [2, 4]]));`, time: "O(n log n)", space: "O(n)", ex: { 6: "Meetings that ended by now free their rooms.", 7: "This meeting takes a room.", 8: "The most rooms in use at once is the answer." } }
  ],
  signals: [["\"merge overlapping\"", "Sort by start, extend the last block"], ["\"minimum rooms / platforms / overlapping at once\"", "Sweep starts and ends (or a heap of ends)"], ["\"remove the fewest to make non-overlapping\"", "Greedy: sort by end"], ["\"insert\" into a sorted list", "Three-phase linear scan"], ["two sorted lists of intervals", "Two pointers, advance the one that ends first"]],
  mistakes: [["Not sorting first", "Overlaps can be far apart in unsorted input."], ["Replacing the end instead of taking the max", "[1,10] merged with [2,3] must stay [1,10]."], ["Inconsistent touching rule", "Decide whether [1,2] and [2,3] overlap, and use < vs ≤ accordingly."], ["Mutating input intervals unexpectedly", "Copy when the caller still needs them."]],
  js: ["Sort pairs: arr.sort((a, b) => a[0] - b[0]).", "Destructure in loops: for (const [s, e] of intervals)."],
  iq: { Beginner: ["Check whether two intervals overlap"], Easy: ["meeting-rooms"], Medium: ["merge-intervals", "insert-interval", "non-overlapping-intervals", "meeting-rooms-ii", "min-arrows-balloons", "interval-list-intersections", "car-pooling"], Hard: ["Find free time common to every employee's schedule"] },
  rev: { s30: "Sort, then sweep. Merge: sort by start, extend with max. Keep the most: sort by end. Rooms: sweep sorted starts and ends. O(n log n).", m2: ["Overlap: a ≤ d && c ≤ b", "Merge with Math.max", "Max non-overlapping: sort by end", "Rooms: two sorted arrays or a heap", "Pick a touching rule"] },
  cheat: `INTERVALS CHEAT SHEET

overlap([a,b],[c,d]) = a <= d && c <= b

Merge:
  sort by start
  for [s,e]: if s <= last.end: last.end = max(last.end, e)
             else push [s,e]

Max non-overlapping: sort by END, greedy
Rooms: sort starts & ends, sweep
O(n log n)`
};

export default intervals;
