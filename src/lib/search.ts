import { TOPICS, PATTERNS } from "@/content/roadmap";
import { LESSONS } from "@/content/lessons";
import { PROBLEMS } from "@/content/problems";
import { PAT, TOPIC, DIFF } from "./data";

export interface SearchItem { k: string; t: string; d: string; href: string; low: string; tl: string }
export const PAGES_INDEX: [string, string, string][] = [
  ["Dashboard", "Home, progress overview", "/"], ["Roadmap", "Full learning roadmap with levels", "/roadmap"],
  ["Which pattern should I use?", "Decision tree + clue list", "/which"], ["How to solve any DSA problem", "10-step framework", "/framework"],
  ["Code playground", "Run JavaScript, Python, Java, C++, Go", "/playground"], ["Big O visualizer", "Growth curves and time estimates", "/learn/big-o#visual"],
  ["Flashcards", "Flip cards for complexity, patterns, traps", "/flashcards"], ["Mistake notebook", "Save your own mistakes", "/mistakes"],
  ["Progress tracker", "Stats, streak, weak topics", "/progress"], ["Cheat sheets", "All quick revision sheets", "/revision"],
  ["Problem tracker", "Filter problems by topic, pattern, company", "/problems"], ["All patterns", "21 interview patterns with templates", "/patterns"]
];
let INDEX: SearchItem[] | null = null;
function build(): SearchItem[] {
  const idx: Omit<SearchItem, "low" | "tl">[] & { text?: string }[] = [];
  const add = (k: string, t: string, d: string, href: string, text: string) => (idx as unknown as { k: string; t: string; d: string; href: string; text: string }[]).push({ k, t, d, href, text });
  TOPICS.forEach(t => {
    const c = LESSONS[t.slug];
    const extra = c ? [c.what, c.signals.map(s => s.join(" ")).join(" "), c.cx.map(r => r.join(" ")).join(" ")].join(" ") : "";
    add("Topic", t.title, t.blurb, "/learn/" + t.slug, [t.title, t.kw, t.blurb, extra].join(" "));
    if (c) add("Cheat sheet", t.title + " cheat sheet", c.rev.s30, "/learn/" + t.slug + "#revision", [t.title, "cheat sheet revision", c.cheat].join(" "));
  });
  PATTERNS.forEach(p => add("Pattern", p.name, p.idea, "/patterns#" + p.id, [p.name, "pattern", p.signals.join(" "), p.idea].join(" ")));
  PROBLEMS.forEach(p => add("Problem", p.t, `${DIFF[p.d]} · ${PAT[p.pat]?.name || p.pat} · ${TOPIC[p.topic]?.title}`, "/problems/" + p.id,
    [p.t, "problem leetcode lc", DIFF[p.d], p.pat, PAT[p.pat]?.name, p.topic, p.co.join(" "), p.tc, p.s].join(" ")));
  PAGES_INDEX.forEach(([t, d, href]) => add("Page", t, d, href, t + " " + d));
  return (idx as unknown as { k: string; t: string; d: string; href: string; text: string }[]).map(x => ({ k: x.k, t: x.t, d: x.d, href: x.href, low: x.text.toLowerCase().replace(/²/g, "^2"), tl: x.t.toLowerCase() }));
}
export function search(q: string): SearchItem[] {
  INDEX = INDEX || build();
  const norm = q.toLowerCase().replace(/²/g, "^2").trim();
  if (!norm) return INDEX.filter(x => x.k === "Page" || (x.k === "Topic" && LESSONS[x.href.slice(7)])).slice(0, 14);
  const toks = norm.split(/\s+/).map(t => t.replace(/s$/, "")).filter(Boolean);
  const scored: [number, SearchItem][] = [];
  for (const x of INDEX) {
    let score = 0, ok = true;
    for (const t of toks) {
      if (x.tl.includes(t)) score += 10; else if (x.low.includes(t)) score += 2; else { ok = false; break; }
    }
    if (!ok) continue;
    if (x.tl.startsWith(norm)) score += 15;
    if (x.low.includes(norm)) score += norm.includes("(") ? 14 : 5;
    score += ({ Topic: 4, Pattern: 3, Page: 2, Problem: 1 } as Record<string, number>)[x.k] || 0;
    scored.push([score, x]);
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, 30).map(s => s[1]);
}
