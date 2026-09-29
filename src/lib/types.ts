export type Priority = "now" | "next" | "later" | "adv";
export type Difficulty = "E" | "M" | "H";
export type VizKind = "array" | "string" | "hash" | "twoptr" | "window" | "bsearch" | "linked" | "stack" | "queue" | "recursion" | "tree" | "bigo";

export interface CodeSample {
  c: string;
  /** 1-based line numbers to highlight */
  hl?: number[];
  /** 1-based line number → explanation shown when the line is clicked */
  ex?: Record<number, string>;
}
export interface Example extends CodeSample {
  lvl: "Easy" | "Practical" | "Interview";
  title: string;
  prob: string;
  idea: string;
  time: string;
  space: string;
}
export interface Lesson {
  what: string;
  analogy: { short: string; text: string };
  eli5: string;
  tech: string;
  why: string;
  how: string[];
  props: string[];
  use: string[];
  avoid: string[];
  viz: VizKind;
  cxTitle?: string;
  /** [operation, complexity, why] */
  cx: [string, string, string][];
  space: string;
  code: CodeSample;
  brute?: CodeSample & { title: string; time: string; space: string };
  examples: Example[];
  /** [clue in the problem, what to think] */
  signals: [string, string][];
  /** [mistake, fix] */
  mistakes: [string, string][];
  js?: string[];
  /** Entries are problem ids (linked) or free-text questions */
  iq: Record<"Beginner" | "Easy" | "Medium" | "Hard", string[]>;
  rev: { s30: string; m2: string[] };
  cheat: string;
}
export interface Topic {
  slug: string;
  title: string;
  group: "start" | "ds" | "algo" | "pattern";
  level: number;
  pri: Priority;
  pre: string[];
  blurb: string;
  kw: string;
}
export interface Pattern { id: string; name: string; topic: string; signals: string[]; idea: string; tpl: string }
export interface Problem {
  id: string; t: string; d: Difficulty; topic: string; pat: string; co: string[]; lc: string;
  /** statement, example, hints, approach, reference solution (JS), time, space, follow-ups */
  s: string; eg: string; h: string[]; a: string; c: string; tc: string; sc: string; f: string[];
}
export type ParamType = "number" | "number[]" | "number[][]" | "string" | "string[]" | "character[][]" | "boolean" | "ListNode" | "TreeNode" | "cycle";
export interface GenCase { label: string; gen: string }
export interface JudgeSpec {
  fn: string;
  ref?: string;
  params: [string, string][];
  ret: string;
  cmp?: "unordered" | "groups" | "outer" | "float";
  inplace?: number;
  design?: boolean;
  note?: string;
  cases: unknown[][];
  hidden: (unknown[] | GenCase)[];
}
