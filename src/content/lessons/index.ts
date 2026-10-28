import type { Lesson } from "@/lib/types";
import bigO from "./big-o";
import arrays from "./arrays";
import strings from "./strings";
import hashing from "./hashing";
import twoPointers from "./two-pointers";
import slidingWindow from "./sliding-window";
import binarySearch from "./binary-search";
import linkedList from "./linked-list";
import stack from "./stack";
import queue from "./queue";
import recursion from "./recursion";
import trees from "./trees";
import heap from "./heap";
import graph from "./graph";
import trie from "./trie";
import bst from "./bst";
import sorting from "./sorting";
import searching from "./searching";
import bfs from "./bfs";
import dfs from "./dfs";
import topoSort from "./topo-sort";
import unionFind from "./union-find";
import dijkstra from "./dijkstra";
import mst from "./mst";
import bellmanFord from "./bellman-ford";
import floydWarshall from "./floyd-warshall";
import dp from "./dp";
import backtracking from "./backtracking";
import greedy from "./greedy";
import divideConquer from "./divide-conquer";
import prefixSum from "./prefix-sum";
import intervals from "./intervals";
import monotonicStack from "./monotonic-stack";
import fastSlow from "./fast-slow";
import bitManipulation from "./bit-manipulation";
import mathBasics from "./math-basics";
import jsForDsa from "./js-for-dsa";

/** Every lesson with full content. To add a lesson: create a file here and register it below. */
export const LESSONS: Record<string, Lesson> = {
  "big-o": bigO,
  "arrays": arrays,
  "strings": strings,
  "hashing": hashing,
  "two-pointers": twoPointers,
  "sliding-window": slidingWindow,
  "binary-search": binarySearch,
  "linked-list": linkedList,
  "stack": stack,
  "queue": queue,
  "recursion": recursion,
  "trees": trees,
  "heap": heap,
  "graph": graph,
  "trie": trie,
  "bst": bst,
  "sorting": sorting,
  "searching": searching,
  "bfs": bfs,
  "dfs": dfs,
  "topo-sort": topoSort,
  "union-find": unionFind,
  "dijkstra": dijkstra,
  "mst": mst,
  "bellman-ford": bellmanFord,
  "floyd-warshall": floydWarshall,
  "dp": dp,
  "backtracking": backtracking,
  "greedy": greedy,
  "divide-conquer": divideConquer,
  "prefix-sum": prefixSum,
  "intervals": intervals,
  "monotonic-stack": monotonicStack,
  "fast-slow": fastSlow,
  "bit-manipulation": bitManipulation,
  "math-basics": mathBasics,
  "js-for-dsa": jsForDsa,
};
