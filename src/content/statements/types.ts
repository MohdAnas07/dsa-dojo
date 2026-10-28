/**
 * The full, LeetCode-style statement of a problem. Kept apart from the problem definitions so the
 * judge data stays compact. Text may use `backticks` for inline code.
 *
 *  body  paragraphs describing the task (replaces the one-line summary on the problem page)
 *  why   one explanation per visible example, in the same order as the Run cases (null = no explanation)
 *  walk  step-by-step walkthrough of Example 1 (what happens, in order, until the answer appears)
 *  cons  constraints, e.g. "1 ≤ nums.length ≤ 10⁴"
 */
export interface Statement { body: string[]; why?: (string | null)[]; walk?: string[]; cons?: string[] }
