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
};
