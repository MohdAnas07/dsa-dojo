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
  id: string; t: string; d: Difficulty;
  /** primary topic/pattern (first of topics/pats) */
  topic: string; pat: string;
  /** every topic and pattern this problem exercises */
  topics: string[]; pats: string[];
  /** related problem ids (curated first, then computed from shared patterns/topics) */
  similar: string[];
  co: string[]; lc: string;
  /** statement, example, hints, approach, reference solution (JS), time, space, follow-ups */
  s: string; eg: string; h: string[]; a: string; c: string; tc: string; sc: string; f: string[];
}
export type ParamType = "number" | "double" | "number[]" | "number[][]" | "string" | "string[]" | "string[][]" | "character[][]" | "boolean" | "ListNode" | "ListNode[]" | "TreeNode" | "cycle";
export interface GenCase { label: string; gen: string }
export interface JudgeSpec {
  fn: string;
  ref?: string;
  params: [string, string][];
  ret: string;
  cmp?: "unordered" | "groups" | "outer" | "float";
  inplace?: number;
  design?: boolean;
  /** design problems: constructor params and methods */
  ctor?: [string, string][];
  methods?: { name: string; params: [string, string][]; ret: string }[];
  /** validator source "(args, out, exp) => boolean" for problems with several correct answers */
  check?: string;
  note?: string;
  cases: unknown[][];
  /** known correct answers for the visible cases (checked against the reference at build time) */
  known?: unknown[];
  hidden: (unknown[] | GenCase)[];
}

/** Compact authoring format for problems (see src/content/problemsets). */
export interface ProblemDef {
  id: string; t: string; d: Difficulty;
  /** topics (roadmap slugs) and patterns (pattern ids); the first of each is primary */
  tp: string[]; pt: string[];
  co: string[]; lc: string;
  s: string; h: [string, string]; a: string; tc: string; sc: string; f?: string[]; sim?: string[];
  /** function or class name, "name:type, name:type" params, return type */
  fn: string; params?: string; ret?: string;
  cmp?: JudgeSpec["cmp"]; inplace?: number; check?: string; note?: string;
  /** design problems: constructor params and "method(a:type):ret; other():ret" */
  ctor?: string; methods?: string;
  /** visible examples: [...args, expectedAnswer] */
  ex: unknown[][];
  hid?: (unknown[] | GenCase)[];
  /** JavaScript reference solution (no console.log; examples are appended automatically) */
  code: string;
}
