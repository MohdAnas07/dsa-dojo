import type { ProblemDef } from "@/lib/types";
import { ARRAYS_HASHING } from "./arrays-hashing";
import { POINTERS_WINDOW } from "./pointers-window";
import { SEARCH_SORT_INTERVALS } from "./search-sort-intervals";
import { STACK_QUEUE } from "./stack-queue";
import { LINKED_LIST } from "./linked-list";
import { TREES } from "./trees";
import { BST_TRIE } from "./bst-trie";
import { HEAP_GREEDY } from "./heap-greedy";
import { BACKTRACKING } from "./backtracking";
import { GRAPHS } from "./graphs";
import { DYNAMIC_PROGRAMMING } from "./dynamic-programming";
import { BITS_MATH_DESIGN } from "./bits-math-design";

/** Every problem set. Add a new file here to add problems. */
export const PROBLEM_SETS: ProblemDef[][] = [
  ARRAYS_HASHING,
  POINTERS_WINDOW,
  SEARCH_SORT_INTERVALS,
  STACK_QUEUE,
  LINKED_LIST,
  TREES,
  BST_TRIE,
  HEAP_GREEDY,
  BACKTRACKING,
  GRAPHS,
  DYNAMIC_PROGRAMMING,
  BITS_MATH_DESIGN
];
