import type { PatternViz } from "./types";
import { twoPointersViz } from "./scenes/twoPointers";
import { slidingWindowViz } from "./scenes/slidingWindow";
import { hashingViz } from "./scenes/hashing";
import { binarySearchViz } from "./scenes/binarySearch";
import { prefixSumViz } from "./scenes/prefixSum";
import { monotonicStackViz } from "./scenes/monotonicStack";
import { heapViz } from "./scenes/heap";
import { bfsViz } from "./scenes/bfs";
import { dfsViz } from "./scenes/dfs";
import { dpViz } from "./scenes/dp";
import { fastSlowViz } from "./scenes/fastSlow";
import { intervalsViz } from "./scenes/intervals";
import { backtrackingViz } from "./scenes/backtracking";
import { sortingViz } from "./scenes/sorting";

/** Lesson slug → pattern visualizer. Lessons listed here show it in their "Visual explanation" section. */
export const PVIZ: Record<string, PatternViz> = {
  "two-pointers": twoPointersViz,
  "sliding-window": slidingWindowViz,
  hashing: hashingViz,
  "binary-search": binarySearchViz,
  "prefix-sum": prefixSumViz,
  "monotonic-stack": monotonicStackViz,
  heap: heapViz,
  bfs: bfsViz,
  dfs: dfsViz,
  dp: dpViz,
  "fast-slow": fastSlowViz,
  intervals: intervalsViz,
  backtracking: backtrackingViz,
  sorting: sortingViz,
};

/** Pattern id (from the roadmap) → [lesson slug, scenario index] for the "Visualize" button on /patterns. */
export const PATTERN_VIZ: Record<string, [string, number]> = {
  "frequency-counter": ["hashing", 2], hashing: ["hashing", 0], "two-pointers": ["two-pointers", 0], "sliding-window": ["sliding-window", 0],
  "fast-slow": ["fast-slow", 0], "prefix-sum": ["prefix-sum", 0], "binary-search": ["binary-search", 0], "monotonic-stack": ["monotonic-stack", 0],
  "top-k": ["heap", 0], intervals: ["intervals", 1], "merge-intervals": ["intervals", 0], backtracking: ["backtracking", 0],
  bfs: ["bfs", 0], dfs: ["dfs", 0], "graph-traversal": ["bfs", 0], dp: ["dp", 0],
};

/** Problems with a hand-made walkthrough of their exact algorithm: problem id → [lesson slug, scenario index]. */
export const PROBLEM_VIZ: Record<string, [string, number]> = {
  "two-sum": ["hashing", 0], "contains-duplicate": ["hashing", 1], "first-unique-char": ["hashing", 2],
  "two-sum-ii": ["two-pointers", 0], "container-water": ["two-pointers", 1],
  "longest-substring": ["sliding-window", 1],
  "binary-search": ["binary-search", 0], "search-insert": ["binary-search", 1], "first-last-position": ["binary-search", 1], "koko-bananas": ["binary-search", 2],
  "range-sum-query": ["prefix-sum", 0], "subarray-sum-k": ["prefix-sum", 1],
  "daily-temperatures": ["monotonic-stack", 0], "kth-largest": ["heap", 0],
  "rotting-oranges": ["bfs", 1], "number-of-islands": ["dfs", 1], "course-schedule": ["dfs", 2],
  "house-robber": ["dp", 0], "coin-change": ["dp", 1], "longest-common-subsequence": ["dp", 2],
  "linked-list-cycle-ii": ["fast-slow", 0], "merge-intervals": ["intervals", 0], "meeting-rooms-ii": ["intervals", 1],
  subsets: ["backtracking", 0], "combination-sum": ["backtracking", 1], "sort-array": ["sorting", 1],
};
