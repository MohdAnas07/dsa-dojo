import type { JudgeSpec } from "./types";

/** How test inputs and answers are printed (problem page examples, test-case panel, results). */
export const showVal = (v: unknown): string => {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const o = v as Record<string, unknown>;
    if (o.__undef) return "undefined"; if (o.__str) return String(o.__str); if (o.__hash) return "(large output, checked by fingerprint)"; if (o.__map) return "Map " + JSON.stringify(o.__map);
  }
  const s = JSON.stringify(v); return s === undefined ? "undefined" : s.length > 400 ? s.slice(0, 400) + `… (${s.length} chars)` : s;
};
export const showArgs = (sp: JudgeSpec, args: unknown[]) => sp.design
  ? `${JSON.stringify(args[0])}\n${JSON.stringify(args[1])}`
  : sp.params.map(([n, t], i) => t === "cycle" ? `head = ${JSON.stringify((args[i] as unknown[])[0])}, pos = ${(args[i] as unknown[])[1]}` : `${n} = ${JSON.stringify(args[i])}`).join("\n");
