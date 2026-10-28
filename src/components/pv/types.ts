import type { FC } from "react";

/*
 * Architecture
 *   1. Algorithm + trace:  each Mode.run() executes the real algorithm on the user's input and emits
 *      typed Step events. Every step carries a full snapshot (`s`) of what is on screen, so any step can
 *      be shown on its own: going back, scrubbing and restarting never depend on earlier animation state.
 *   2. Playback:           Player.tsx only holds an index into the trace (plus play/speed/quiz UI state).
 *   3. Renderers:          each mode has its own View that draws a snapshot with the primitives in prims.tsx.
 *   4. Explanations:       what / why / next (beginner) and a one-line `brief` (interview), a decision card,
 *                          and optional "predict the next step" quizzes, all written from the real values.
 */

export type Ev =
  | "INIT" | "ITER" | "COMPARE" | "POINTER_MOVE" | "WINDOW_EXPAND" | "WINDOW_SHRINK"
  | "HASH_LOOKUP" | "HASH_INSERT" | "SWAP" | "VISIT_NODE" | "ENQUEUE" | "DEQUEUE"
  | "PUSH" | "POP" | "UPDATE_DP" | "WRITE" | "FOUND_RESULT" | "NOT_FOUND" | "DONE";

export type VarVal = string | number | boolean | null | undefined;

/** A condition the algorithm evaluated, with the real values plugged in. */
export interface Decision { cond: string; values: string; result: boolean; action: string }
export interface Quiz { q: string; options: string[]; answer: number; why: string }

export interface Step<S> {
  ev: Ev | Ev[];
  s: S;
  /** Tag(s) of the code line(s) to highlight. Lines are tagged in the code with a trailing `//#tag`. */
  at?: string | string[];
  /** Result of the condition on the highlighted line, shown as true/false next to it. */
  eval?: boolean;
  /** Beginner explanation. Supports **bold** and `code`. */
  what: string; why?: string; next?: string;
  /** Interview-mode explanation: one concise line. */
  brief: string;
  decision?: Decision;
  /** State inspector rows, in display order. Values that changed since the previous step are highlighted. */
  inspect: [string, VarVal][];
  /** Asked when this step is reached in Predict mode, before the reveal (decision result, next, eval). */
  quiz?: Quiz;
  tone?: "ok" | "bad" | "find";
}

export interface Field { key: string; label: string; wide?: boolean; placeholder?: string }

export interface Mode<S> {
  id: string;
  label: string;
  task: string;
  fields: Field[];
  presets: { label: string; values: Record<string, string> }[];
  code: string;
  run: (v: Record<string, string>) => Step<S>[];
  View: FC<{ s: S }>;
  legend?: [tone: string, label: string][];
  /** Counters shown under the stage, each counting trace events up to the current step. */
  counters: [label: string, events: Ev[]][];
  complexity: { time: string; space: string; why: string };
}

export interface PatternViz { title: string; modes: Mode<any>[] } // eslint-disable-line @typescript-eslint/no-explicit-any

/** Input parsing helpers. They throw an Error with a message the learner can act on. */
export const nums = (s: string, name = "array", max = 14): number[] => {
  const parts = String(s ?? "").split(/[\s,\[\]]+/).filter(Boolean);
  if (!parts.length) throw new Error(`Enter at least one number for ${name}.`);
  const a = parts.map(Number);
  if (a.some(x => !Number.isFinite(x))) throw new Error(`${name} must be numbers separated by commas.`);
  if (a.some(x => Math.abs(x) > 9999)) throw new Error(`Keep ${name} values between -9999 and 9999 so they fit in the boxes.`);
  if (a.length > max) throw new Error(`Use at most ${max} numbers for ${name} so everything fits on screen.`);
  return a;
};
export const int = (s: string, name: string, lo = -9999, hi = 9999): number => {
  const n = Number(String(s ?? "").trim());
  if (String(s ?? "").trim() === "" || !Number.isInteger(n)) throw new Error(`${name} must be a whole number.`);
  if (n < lo || n > hi) throw new Error(`${name} must be between ${lo} and ${hi}.`);
  return n;
};
