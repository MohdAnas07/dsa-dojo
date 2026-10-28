/* Trace file format (written by scripts/generate-traces.ts) and replay into full per-step states. */
export type Enc = number | string | boolean | null | { $: string; [k: string]: unknown } | Enc[];
export interface TStep {
  k: "x" | "it" | "j" | "c" | "r" | "e" | "o";
  l: number; s?: number;
  v?: Record<string, Enc>; d?: string[]; h?: Record<string, { c: string; f: [string, Enc][] }>;
  res?: boolean; loop?: boolean; op?: string; a?: Enc; b?: Enc; val?: Enc; fn?: string; p?: string[];
}
export interface TExample { input: [string, unknown][]; output: unknown; steps: TStep[]; truncated: boolean }
export interface TraceFile { id: string; entry: string; code: string; texts: string[]; idx: Record<string, string[]>; idx2: Record<string, [string, string][]>; examples: TExample[] }

export interface Frame { fn: string; vars: Map<string, Enc>; line: number; params: string[] }
export type HeapObj = { c: string; f: Map<string, Enc> };
export interface State { frames: Frame[]; heap: Map<number, HeapObj>; step: TStep; i: number; popped?: Frame }

/** Replays the deltas into a full state for every step. Frames and the heap are copied on write. */
export function replay(ex: TExample): State[] {
  const out: State[] = [];
  let frames: Frame[] = [{ fn: "(start)", vars: new Map(), line: 0, params: [] }];
  let heap = new Map<number, HeapObj>();
  let pendingPop = false;
  ex.steps.forEach((st, i) => {
    let popped: Frame | undefined;
    if (pendingPop && frames.length > 1) { popped = frames[frames.length - 1]; frames = frames.slice(0, -1); }
    pendingPop = false;
    if (st.k === "e") frames = [...frames, { fn: st.fn || "fn", vars: new Map(), line: st.l, params: st.p || [] }];
    const top = frames[frames.length - 1];
    if (st.v || st.d || st.l) {
      const vars = new Map(top.vars);
      for (const [k, v] of Object.entries(st.v || {})) vars.set(k, v);
      for (const k of st.d || []) vars.delete(k);
      frames = [...frames.slice(0, -1), { ...top, vars, line: st.l || top.line }];
    }
    if (st.h) { heap = new Map(heap); for (const [id, o] of Object.entries(st.h)) heap.set(+id, { c: o.c, f: new Map(o.f) }); }
    if (st.k === "r" || st.k === "o") pendingPop = true;
    out.push({ frames, heap, step: st, i, popped });
  });
  return out;
}

// ---------- value helpers ----------
export const isRef = (v: Enc): v is { $: "ref"; id: number; c: string } => !!v && typeof v === "object" && !Array.isArray(v) && (v as { $: string }).$ === "ref";
export const isTag = (v: Enc, t: string) => !!v && typeof v === "object" && !Array.isArray(v) && (v as { $: string }).$ === t;
/** The entries of an encoded array/map/set/object ({ $, e: [...] }). */
export const ents = (v: Enc | undefined): unknown[] => { const e = v && typeof v === "object" && !Array.isArray(v) ? v.e : undefined; return Array.isArray(e) ? e : []; };
export const arrOf = (v: Enc): Enc[] | null => (Array.isArray(v) ? v : isTag(v, "arr") ? (ents(v) as Enc[]) : null);
export const isPrim = (v: Enc) => v === null || typeof v !== "object" || isTag(v, "u") || isTag(v, "inf") || isTag(v, "-inf") || isTag(v, "nan") || isTag(v, "big");

/** Short human-readable form of an encoded value. Heap references show the node's value when it has one. */
export function show(v: Enc, heap?: Map<number, HeapObj>, depth = 0): string {
  if (v === null) return "null";
  if (typeof v === "string") return JSON.stringify(v);
  if (typeof v !== "object") return String(v);
  if (Array.isArray(v)) return depth > 1 ? `[…${v.length}]` : "[" + v.slice(0, 12).map(x => show(x, heap, depth + 1)).join(", ") + (v.length > 12 ? ", …" : "") + "]";
  switch (v.$) {
    case "u": return "undefined";
    case "inf": return "Infinity";
    case "-inf": return "-Infinity";
    case "nan": return "NaN";
    case "big": return String(v.v) + "n";
    case "deep": return "…";
    case "fn": return "ƒ";
    case "arr": { const e = v.e as Enc[]; return "[" + e.slice(0, 12).map(x => show(x, heap, depth + 1)).join(", ") + `, … (${v.n})]`; }
    case "map": return depth > 1 ? "Map(…)" : "Map{" + (v.e as [Enc, Enc][]).slice(0, 8).map(([k, x]) => `${show(k, heap, depth + 1)}→${show(x, heap, depth + 1)}`).join(", ") + ((v.n as number) > 8 ? ", …" : "") + "}";
    case "set": return depth > 1 ? "Set(…)" : "Set{" + (v.e as Enc[]).slice(0, 10).map(x => show(x, heap, depth + 1)).join(", ") + ((v.n as number) > 10 ? ", …" : "") + "}";
    case "obj": return depth > 1 ? "{…}" : "{" + (v.e as [string, Enc][]).slice(0, 8).map(([k, x]) => `${k}: ${show(x, heap, depth + 1)}`).join(", ") + "}";
    case "ref": {
      const o = heap?.get(v.id as number);
      const val = o?.f.get("val");
      return val !== undefined && isPrim(val) ? `${v.c}(${show(val)})` : `${v.c}#${v.id}`;
    }
  }
  return "?";
}
export const same = (a: Enc | undefined, b: Enc | undefined) => JSON.stringify(a) === JSON.stringify(b);
