/**
 * Runtime side of the tracer: receives the calls inserted by instrument.ts and records a compact,
 * replayable trace. Each step stores only what changed (per-frame variable deltas and changed heap
 * objects), so the client can rebuild the full state of any step by replaying from the start.
 */
export type Enc = number | string | boolean | null | { $: string; [k: string]: unknown } | Enc[];
export interface TStep {
  k: "x" | "it" | "j" | "c" | "r" | "e" | "o"; // statement, loop iteration, jump, condition, return, enter, function end
  l: number; s?: number;
  v?: Record<string, Enc>; d?: string[]; h?: Record<string, { c: string; f: [string, Enc][] }>;
  res?: boolean; loop?: boolean; op?: string; a?: Enc; b?: Enc; val?: Enc; fn?: string; p?: string[];
}

const MAX_ITEMS = 60, MAX_DEPTH = 4, MAX_OBJ = 150;

export function makeRecorder(cap: number) {
  const steps: TStep[] = [];
  let truncated = false;
  const ids = new WeakMap<object, number>(); let nextId = 1;
  const heapLast = new Map<number, string>();
  type Frame = { last: Map<string, string>; returned: boolean };
  const frames: Frame[] = [{ last: new Map(), returned: false }];

  const enc = (v: unknown, refs: Set<object>, depth = 0): Enc | undefined => {
    if (v === null) return null;
    switch (typeof v) {
      case "number": return Number.isFinite(v) ? (Object.is(v, -0) ? 0 : v) : { $: Number.isNaN(v) ? "nan" : v > 0 ? "inf" : "-inf" };
      case "string": return v.length > 200 ? v.slice(0, 200) + "…" : v;
      case "boolean": return v;
      case "undefined": return { $: "u" };
      case "bigint": return { $: "big", v: String(v) };
      case "function": case "symbol": return undefined;
    }
    const o = v as object;
    if (depth >= MAX_DEPTH) return { $: "deep" };
    if (Array.isArray(o)) {
      const a = o.slice(0, MAX_ITEMS).map(x => enc(x, refs, depth + 1) ?? { $: "fn" });
      return o.length > MAX_ITEMS ? { $: "arr", e: a, n: o.length } : a;
    }
    if (o instanceof Map) return { $: "map", e: [...o.entries()].slice(0, MAX_ITEMS).map(([k, x]) => [enc(k, refs, depth + 1) ?? null, enc(x, refs, depth + 1) ?? { $: "fn" }]), n: o.size };
    if (o instanceof Set) return { $: "set", e: [...o].slice(0, MAX_ITEMS).map(x => enc(x, refs, depth + 1) ?? null), n: o.size };
    const proto = Object.getPrototypeOf(o);
    if (proto === Object.prototype || proto === null) return { $: "obj", e: Object.entries(o).slice(0, MAX_ITEMS).map(([k, x]) => [k, enc(x, refs, depth + 1) ?? { $: "fn" }]) };
    let id = ids.get(o); if (!id) { id = nextId++; ids.set(o, id); }
    refs.add(o);
    return { $: "ref", id, c: (proto && proto.constructor && proto.constructor.name) || "Object" };
  };

  const heap = (start: Set<object>): TStep["h"] => {
    const out: NonNullable<TStep["h"]> = {}, seen = new Set<object>(), q = [...start];
    let n = 0;
    while (q.length && n < MAX_OBJ) {
      const o = q.shift()!; if (seen.has(o)) continue; seen.add(o); n++;
      const refs = new Set<object>();
      const fields: [string, Enc][] = [];
      for (const [k, x] of Object.entries(o)) { const e = enc(x, refs, 1); if (e !== undefined) fields.push([k, e]); }
      const id = ids.get(o)!, c = Object.getPrototypeOf(o)?.constructor?.name || "Object";
      const json = JSON.stringify([c, fields]);
      if (heapLast.get(id) !== json) { heapLast.set(id, json); out[id] = { c, f: fields }; }
      for (const r of refs) if (!seen.has(r)) q.push(r);
    }
    return Object.keys(out).length ? out : undefined;
  };

  /** Reads the visible variables, returning only the ones that changed for the current frame. */
  const snap = (step: TStep, list: [string, () => unknown][], frame = frames[frames.length - 1]) => {
    const refs = new Set<object>(), now = new Map<string, string>(), v: Record<string, Enc> = {};
    for (const [name, get] of list) {
      let x: unknown; try { x = get(); } catch { continue; }
      if (typeof x === "function") continue;
      const e = enc(x, refs); if (e === undefined) continue;
      const j = JSON.stringify(e); now.set(name, j);
      if (frame.last.get(name) !== j) v[name] = e;
    }
    const d = [...frame.last.keys()].filter(k => !now.has(k));
    frame.last = now;
    if (Object.keys(v).length) step.v = v;
    if (d.length) step.d = d;
    const h = heap(refs); if (h) step.h = h;
  };
  const push = (s: TStep) => { if (steps.length >= cap) { truncated = true; return false; } steps.push(s); return true; };

  const api = {
    __t(kind: "x" | "it" | "j", l: number, s: number, list: [string, () => unknown][]) { if (truncated) return; const st: TStep = { k: kind, l, s }; snap(st, list); push(st); },
    __c(l: number, s: number, loop: boolean, value: unknown, list: [string, () => unknown][]) { if (!truncated) { const st: TStep = { k: "c", l, s, loop, res: !!value }; snap(st, list); push(st); } return value; },
    __k(l: number, s: number, loop: boolean, op: string, a: unknown, b: unknown, list: [string, () => unknown][]) {
      let r: boolean;
      switch (op) { case "<": r = (a as number) < (b as number); break; case "<=": r = (a as number) <= (b as number); break; case ">": r = (a as number) > (b as number); break; case ">=": r = (a as number) >= (b as number); break; case "===": r = a === b; break; case "!==": r = a !== b; break; case "==": r = a == b; break; default: r = a != b; } // eslint-disable-line eqeqeq
      if (!truncated) { const refs = new Set<object>(); const st: TStep = { k: "c", l, s, loop, res: r, op, a: enc(a, refs) ?? null, b: enc(b, refs) ?? null }; snap(st, list); push(st); }
      return r;
    },
    __r(l: number, s: number, value: unknown, list: [string, () => unknown][]) {
      const fr = frames[frames.length - 1]; fr.returned = true;
      if (!truncated) { const refs = new Set<object>(); const st: TStep = { k: "r", l, s, val: enc(value, refs) ?? { $: "u" } }; snap(st, list); const h = heap(refs); if (h) st.h = { ...(st.h || {}), ...h }; push(st); }
      return value;
    },
    __enter(l: number, fn: string, list: [string, () => unknown][], params: string[]) {
      const fr: Frame = { last: new Map(), returned: false };
      frames.push(fr);
      if (!truncated) { const st: TStep = { k: "e", l, fn, p: params }; snap(st, list, fr); push(st); }
      return fr;
    },
    __exit(fr: Frame) {
      if (frames[frames.length - 1] !== fr) return;
      if (!fr.returned && !truncated) push({ k: "o", l: 0 });
      frames.pop();
    },
  };
  return { api, result: () => ({ steps, truncated }) };
}
