import { TOPICS, PATH, PATTERNS } from "@/content/roadmap";
import { LESSONS } from "@/content/lessons";
import { PROBLEMS } from "@/content/problems";
import { FLASH_MANUAL } from "@/content/flashcards";
import type { Priority, Difficulty } from "./types";

export const TOPIC = Object.fromEntries(TOPICS.map(t => [t.slug, t]));
export const PROB = Object.fromEntries(PROBLEMS.map(p => [p.id, p]));
export const PAT = Object.fromEntries(PATTERNS.map(p => [p.id, p]));
export const LESSON_SLUGS = TOPICS.filter(t => LESSONS[t.slug]).map(t => t.slug);
export const LESSON_PATH = PATH.filter(k => LESSONS[k]);
export const PRI: Record<Priority, [string, string]> = { now: ["🟢", "Learn Now"], next: ["🟡", "Learn Next"], later: ["🔵", "Learn Later"], adv: ["🔴", "Advanced"] };
export const DIFF: Record<Difficulty, string> = { E: "Easy", M: "Medium", H: "Hard" };
export const GROUP_LABEL = { start: "Getting started", ds: "Data structure", algo: "Algorithm", pattern: "Pattern" } as const;

export interface Flashcard { id: string; cat: string; q: string; a: string; why: string; topic?: string }
export const FLASHCARDS: Flashcard[] = [
  ...FLASH_MANUAL.map(([cat, q, a, why], i) => ({ id: "m" + i, cat, q, a, why })),
  ...LESSON_SLUGS.filter(s => s !== "big-o").flatMap(slug =>
    LESSONS[slug].cx.map((r, i) => ({ id: `${slug}-cx${i}`, cat: "Complexity", q: `${TOPIC[slug].title}: ${r[0]}?`, a: r[1], why: r[2], topic: slug })))
];
export const shortTitle = (t: string) => t.replace(" & Complexity", "").replace(" / Priority Queue", "").replace("Trees & Binary Trees", "Trees");
