import type { JudgeSpec } from "@/lib/types";
import type { LangId } from "@/lib/languages";
import { jsStarter } from "./javascript";
import { pyStarter } from "./python";

/** Starter code per judged language. Add a language by adding a driver + starter here. */
export const STARTERS: Partial<Record<LangId, (sp: JudgeSpec) => string>> = {
  javascript: jsStarter,
  python: pyStarter
};
export const JUDGE_LANGS = Object.keys(STARTERS) as LangId[];
