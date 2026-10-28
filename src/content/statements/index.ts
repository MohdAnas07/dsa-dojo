import type { Statement } from "./types";
import { CORE_STATEMENTS } from "./core";
import { ARRAYS_HASHING_STATEMENTS } from "./arrays-hashing";
import { POINTERS_WINDOW_STATEMENTS } from "./pointers-window";
import { SEARCH_SORT_INTERVALS_STATEMENTS } from "./search-sort-intervals";
import { STACK_QUEUE_STATEMENTS } from "./stack-queue";
import { LINKED_LIST_STATEMENTS } from "./linked-list";
import { TREES_STATEMENTS } from "./trees";
import { BST_TRIE_STATEMENTS } from "./bst-trie";
import { HEAP_GREEDY_STATEMENTS } from "./heap-greedy";
import { BACKTRACKING_STATEMENTS } from "./backtracking";
import { GRAPHS_STATEMENTS } from "./graphs";
import { DP_STATEMENTS_1 } from "./dp-1";
import { DP_STATEMENTS_2 } from "./dp-2";
import { BITS_MATH_DESIGN_STATEMENTS } from "./bits-math-design";

export type { Statement };

/** Full statements by problem id. Problems without one fall back to their short summary. */
export const STATEMENTS: Record<string, Statement> = {
  ...CORE_STATEMENTS,
  ...ARRAYS_HASHING_STATEMENTS,
  ...POINTERS_WINDOW_STATEMENTS,
  ...SEARCH_SORT_INTERVALS_STATEMENTS,
  ...STACK_QUEUE_STATEMENTS,
  ...LINKED_LIST_STATEMENTS,
  ...TREES_STATEMENTS,
  ...BST_TRIE_STATEMENTS,
  ...HEAP_GREEDY_STATEMENTS,
  ...BACKTRACKING_STATEMENTS,
  ...GRAPHS_STATEMENTS,
  ...DP_STATEMENTS_1,
  ...DP_STATEMENTS_2,
  ...BITS_MATH_DESIGN_STATEMENTS
};
