"use client";
import type { ReactNode } from "react";
import { Row, Stack, Queue, Net, Grid, Table, Stat, type Cell, type Ptr, type NNode, type NEdge } from "../prims";
import { type Enc, type State, type TraceFile, type HeapObj, isRef, isTag, arrOf, isPrim, show, same, ents } from "./model";

export interface TS { st: State; prev?: State; meta: TraceFile; lists: Map<number, { x: number; y: number }>; nodeVars: Set<string>; header: ReactNode }

const STACK_RE = /^(st|stk|stack\w*|\w*Stack|mono\w*)$/i, QUEUE_RE = /^(q|queue\w*|\w*Queue|que|frontier|level)$/i;
const isInt = (v: Enc | undefined): v is number => typeof v === "number" && Number.isInteger(v);
const cellText = (v: Enc, heap: Map<number, HeapObj>): string => {
  if (typeof v === "boolean") return v ? "T" : "F";
  if (isTag(v, "inf")) return "∞"; if (isTag(v, "-inf")) return "-∞";
  if (typeof v === "string") return v.length <= 12 ? v : v.slice(0, 11) + "…";
  if (isRef(v)) { const o = heap.get(v.id); const val = o?.f.get("val"); return val !== undefined && isPrim(val) ? show(val) : "•"; }
  if (Array.isArray(v)) return "[" + v.length + "]";
  return show(v, heap);
};
/** Box width that fits the longest label (strings like "google.com" need wider boxes than digits). */
const sizeFor = (labels: string[], base: number) => Math.min(118, Math.max(base, ...labels.map(t => 12 + t.length * 8.4)));
const kindOf = (o: HeapObj | undefined): "list" | "tree" | "obj" => (!o ? "obj" : o.f.has("next") && !o.f.has("left") ? "list" : o.f.has("left") || o.f.has("right") ? "tree" : "obj");

/** Every heap object reachable from the given values. */
function reach(vals: Enc[], heap: Map<number, HeapObj>): Set<number> {
  const seen = new Set<number>(), q: Enc[] = [...vals];
  while (q.length) {
    const v = q.pop()!;
    if (isRef(v)) { if (seen.has(v.id)) continue; seen.add(v.id); const o = heap.get(v.id); if (o) q.push(...o.f.values()); }
    else if (Array.isArray(v)) q.push(...v);
    else for (const x of ents(v)) Array.isArray(x) ? q.push(...(x as Enc[])) : q.push(x as Enc);
  }
  return seen;
}

export function TraceView({ s }: { s: TS }) {
  const { st, prev, meta } = s, heap = st.heap;
  const frame = st.frames[st.frames.length - 1];
  // The same call one step earlier (same depth in the call stack); undefined right after entering a new call.
  const pframe = prev && prev.frames.length >= st.frames.length ? prev.frames[st.frames.length - 1] : undefined;
  const before = (k: string) => pframe?.vars.get(k);
  const cond = st.step.k === "c";
  const vars = [...frame.vars.entries()].filter(([k]) => !k.startsWith("__"));
  const usedAsPtr = new Set<string>();
  const blocks: ReactNode[] = [], tables: ReactNode[] = [], side: ReactNode[] = [];

  // ---- arrays, strings, grids ----
  for (const [name, v] of vars) {
    const arr = arrOf(v);
    const idxNames = (meta.idx[name] || []).filter(n => isInt(frame.vars.get(n)));
    if (arr) {
      const prevArr = (() => { const p = before(name); return p !== undefined ? arrOf(p) : null; })();
      const changed = (i: number) => !!prevArr && (i >= prevArr.length || !same(prevArr[i], arr[i]));
      const is2D = arr.length > 0 && arr.every(r => { const a = arrOf(r); return !!a && a.length === (arrOf(arr[0]) || []).length && a.every(isPrim); }) && (arrOf(arr[0]) || []).length > 0;
      if (is2D && arr.length * (arrOf(arr[0]) || []).length <= 200) {
        const hot = new Set<string>();
        // Prefer the index pair that belongs to the current call (grid[r][c] inside dfs(r, c)) over outer ones (grid[sr][sc]).
        const pairs = (meta.idx2[name] || []).filter(([a, b]) => isInt(frame.vars.get(a)) && isInt(frame.vars.get(b)));
        const own = pairs.filter(([a, b]) => frame.params.includes(a) && frame.params.includes(b));
        for (const [a, b] of own.length ? own : pairs) { hot.add(frame.vars.get(a) + "," + frame.vars.get(b)); usedAsPtr.add(a); usedAsPtr.add(b); }
        const prev2 = prevArr?.map(r => arrOf(r));
        blocks.push(<div key={name} className="pv-tv-block"><div className="pv-cap">{name}</div><Grid size={arr.length > 6 || (arrOf(arr[0]) || []).length > 8 ? 32 : 38} rows={arr.map((r, i) => (arrOf(r) || []).map((x, j) => ({ v: cellText(x, heap), st: prev2 && prev2[i] && !same(prev2[i]![j], x) ? "ok" : hot.has(i + "," + j) ? (cond ? "cmp" : "cur") : undefined })))} rowLabels={arr.map((_, i) => i)} colLabels={(arrOf(arr[0]) || []).map((_, j) => j)} /></div>);
        continue;
      }
      const allPrim = arr.every(x => isPrim(x) || isRef(x));
      if (!allPrim) { tables.push(<Table key={name} title={name} rows={arr.slice(0, 14).map((x, i) => [i, show(x, heap)])} hot={arr.map((_, i) => i).filter(changed)} w={130} empty="[]" />); continue; }
      if (STACK_RE.test(name) && arr.length <= 14) { side.push(<Stack key={name} title={name} items={arr.map((x, i) => ({ id: name + i + ":" + JSON.stringify(x), v: cellText(x, heap), st: changed(i) ? "ok" : "mem" }))} min={3} w={96} />); continue; }
      if (QUEUE_RE.test(name) && arr.length <= 14) { blocks.push(<Queue key={name} title={name} w={46} items={arr.map((x, i) => ({ id: name + i + ":" + JSON.stringify(x), v: cellText(x, heap), st: changed(i) ? "ok" : "mem" }))} />); continue; }
      const shown = arr.slice(0, 30);
      const ptrs: Ptr[] = idxNames.map(n => { const at = frame.vars.get(n) as number, was = before(n); usedAsPtr.add(n); return { name: n, at: Math.max(-1, Math.min(shown.length, at)), tone: "sky" as const, from: isInt(was) && was !== at ? was : undefined }; }).filter(p => p.at >= 0 && p.at < shown.length);
      const pset = new Set(ptrs.map(p => p.at));
      const cells: Cell[] = shown.map((x, i) => ({ v: cellText(x, heap), st: changed(i) ? "ok" : pset.has(i) ? (cond ? "cmp" : "cur") : undefined }));
      blocks.push(<Row key={name} label={name} cells={cells} ptrs={ptrs} size={sizeFor(cells.map(c => String(c.v)), shown.length > 14 ? 38 : 46)} gap={shown.length > 14 ? 5 : 8} />);
      if (arr.length > 30) blocks.push(<div key={name + "more"} className="pv-line">… {arr.length - 30} more</div>);
      continue;
    }
    if (typeof v === "string" && meta.idx[name] && v.length >= 1 && v.length <= 30) {
      const ptrs: Ptr[] = idxNames.map(n => { const at = frame.vars.get(n) as number, was = before(n); usedAsPtr.add(n); return { name: n, at, tone: "sky" as const, from: isInt(was) && was !== at ? was : undefined }; }).filter(p => p.at >= 0 && p.at < v.length);
      const pset = new Set(ptrs.map(p => p.at));
      blocks.push(<Row key={name} label={name} cells={[...v].map((c, i) => ({ v: c === " " ? "␣" : c, st: pset.has(i) ? (cond ? "cmp" : "cur") : undefined }))} ptrs={ptrs} size={v.length > 14 ? 34 : 42} gap={5} />);
      continue;
    }
    if (isTag(v, "map") || isTag(v, "set") || isTag(v, "obj")) {
      const p = before(name);
      const rows = ents(v);
      const prevRows = p && typeof p === "object" && !Array.isArray(p) ? ents(p).map(x => JSON.stringify(x)) : [];
      const fmtRows: [ReactNode, ReactNode][] = isTag(v, "set") ? (rows as Enc[]).map(x => [show(x, heap), "✓"]) : (rows as [Enc, Enc][]).map(([k, x]) => [isTag(v, "obj") ? String(k) : show(k, heap), show(x, heap)]);
      const n = (v as { n?: number }).n;
      tables.push(<Table key={name} title={`${name}${isTag(v, "set") ? " (set)" : isTag(v, "map") ? " (map)" : ""}${n && n > rows.length ? ` · ${n}` : ""}`} rows={fmtRows.slice(0, 16)} hot={rows.map((x, i) => (prevRows.includes(JSON.stringify(x)) ? -1 : i)).filter(i => i >= 0)} w={140} />);
    }
  }

  // ---- linked lists and trees (heap objects) ----
  const allVals = st.frames.flatMap(f => [...f.vars.values()]);
  const live = reach(allVals, heap);
  const listIds = [...live].filter(id => kindOf(heap.get(id)) === "list");
  const treeIds = [...live].filter(id => kindOf(heap.get(id)) === "tree");
  const tagsFor = (ids: Set<number>) => {
    const by = new Map<number, string[]>();
    for (const [k, v] of vars) if (isRef(v) && ids.has(v.id)) (by.get(v.id) || by.set(v.id, []).get(v.id)!).push(k);
    const self = frame.vars.get("this");
    if (self && isRef(self)) { const o = heap.get(self.id); for (const [k, v] of o?.f ?? []) if (isRef(v) && ids.has(v.id)) (by.get(v.id) || by.set(v.id, []).get(v.id)!).push("this." + k); }
    return by;
  };
  if (listIds.length) {
    const ids = new Set(listIds), P = s.lists, G = 84;
    const nodes: NNode[] = [], edges: NEdge[] = [];
    let maxX = 0, maxY = 0;
    for (const id of listIds) {
      const p = P.get(id) ?? { x: 0, y: 0 }, o = heap.get(id)!, was = prev?.heap.get(id);
      maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
      nodes.push({ id, x: 34 + p.x * G, y: 50 + p.y * 92, v: cellText(o.f.get("val") ?? null, heap), st: was && !same(JSON.parse(JSON.stringify([...was.f])), JSON.parse(JSON.stringify([...o.f]))) ? "ok" : undefined });
      for (const fld of ["next", "prev", "random"]) { const t = o.f.get(fld); if (t && isRef(t) && ids.has(t.id)) edges.push({ a: id, b: t.id, dir: true, st: fld === "next" ? (was && !same(was.f.get(fld), t) ? "ok" : undefined) : "dim" }); }
    }
    const tags = tagsFor(ids);
    const pos = new Map(nodes.map(n => [n.id as number, n]));
    const tagEls = [...tags.entries()].map(([id, names]) => ({ id: "t" + id, x: pos.get(id)!.x, y: pos.get(id)!.y - 26, text: names.join(", "), tone: "sky" as const }));
    for (const n of nodes) { const t = tags.get(n.id as number); if (t) { n.st = n.st || (cond ? "cmp" : "cur"); } }
    const nulls = vars.filter(([k, v]) => v === null && s.nodeVars.has(k)).map(([k]) => k);
    blocks.push(<div key="lists" className="pv-tv-block"><Net nodes={nodes} edges={edges} w={68 + maxX * G + 40} h={50 + maxY * 92 + 50} r={22} tags={tagEls} />{nulls.length > 0 && <div className="pv-line">{nulls.map(n => <span key={n} className="pv-null">{n} → null</span>)}</div>}</div>);
  }
  if (treeIds.length) {
    const ids = new Set(treeIds), isChild = new Set<number>();
    for (const id of treeIds) for (const f of ["left", "right"]) { const c = heap.get(id)!.f.get(f); if (c && isRef(c)) isChild.add(c.id); }
    const roots = treeIds.filter(id => !isChild.has(id)).sort((a, b) => a - b);
    const xy = new Map<number, { x: number; d: number }>(); let k = 0, maxD = 0;
    const walk = (id: number, d: number, seen: Set<number>) => {
      if (seen.has(id)) return; seen.add(id);
      const o = heap.get(id)!; const L = o.f.get("left"), R = o.f.get("right");
      if (L && isRef(L) && ids.has(L.id)) walk(L.id, d + 1, seen);
      xy.set(id, { x: k++, d }); maxD = Math.max(maxD, d);
      if (R && isRef(R) && ids.has(R.id)) walk(R.id, d + 1, seen);
    };
    const seen = new Set<number>();
    for (const r of roots) { walk(r, 0, seen); k++; }
    const GX = treeIds.length > 15 ? 34 : 46, GY = 62;
    const tags = tagsFor(ids);
    const nodes: NNode[] = [...xy.entries()].map(([id, p]) => { const was = prev?.heap.get(id), o = heap.get(id)!; return { id, x: 28 + p.x * GX, y: 46 + p.d * GY, v: cellText(o.f.get("val") ?? null, heap), r: 18, st: tags.has(id) ? (cond ? "cmp" : "cur") : was && JSON.stringify([...was.f]) !== JSON.stringify([...o.f]) ? "ok" : undefined }; });
    const edges: NEdge[] = [];
    for (const id of xy.keys()) for (const f of ["left", "right"]) { const c = heap.get(id)!.f.get(f); if (c && isRef(c) && xy.has(c.id)) edges.push({ a: id, b: c.id }); }
    const pos = new Map(nodes.map(n => [n.id as number, n]));
    const tagEls = [...tags.entries()].filter(([id]) => pos.has(id)).map(([id, names]) => ({ id: "t" + id, x: pos.get(id)!.x, y: pos.get(id)!.y - 22, text: names.join(", "), tone: "sky" as const }));
    const nulls = vars.filter(([k2, v]) => v === null && s.nodeVars.has(k2)).map(([k2]) => k2);
    blocks.push(<div key="trees" className="pv-tv-block"><Net nodes={nodes} edges={edges} w={56 + Math.max(0, k - 1) * GX} h={46 + maxD * GY + 40} r={18} tags={tagEls} />{nulls.length > 0 && <div className="pv-line">{nulls.map(n => <span key={n} className="pv-null">{n} → null</span>)}</div>}</div>);
  }
  // Other objects (a class instance like LRUCache, a Trie node): show their fields.
  const self = frame.vars.get("this");
  if (self && isRef(self)) {
    const o = heap.get(self.id);
    if (o && kindOf(o) === "obj") for (const [k, v] of o.f) {
      const a = arrOf(v);
      if (isTag(v, "map") || isTag(v, "set") || isTag(v, "obj")) tables.push(<Table key={"this." + k} title={"this." + k} rows={ents(v).slice(0, 16).map(x => (isTag(v, "set") ? [show(x as Enc, heap), "✓"] : [show((x as [Enc, Enc])[0], heap), show((x as [Enc, Enc])[1], heap)]) as [ReactNode, ReactNode])} w={140} />);
      else if (a && a.every(x => isPrim(x))) {
        // Pointers on a field array: this.pages[this.cur] → "this.cur" (or a local) points into this.pages.
        const fieldVal = (n: string) => (n.startsWith("this.") ? o.f.get(n.slice(5)) : frame.vars.get(n));
        const prevO = prev?.heap.get(self.id);
        const ptrs: Ptr[] = (meta.idx["this." + k] || []).filter(n => isInt(fieldVal(n))).map(n => { const at = fieldVal(n) as number; const was = n.startsWith("this.") ? prevO?.f.get(n.slice(5)) : before(n); return { name: n.replace(/^this\./, ""), at, tone: "sky" as const, from: isInt(was) && was !== at ? was : undefined }; }).filter(p2 => p2.at >= 0 && p2.at < Math.min(a.length, 24));
        const pa = prevO?.f.get(k), prevArr = pa !== undefined ? arrOf(pa) : null;
        const pset = new Set(ptrs.map(p2 => p2.at));
        const cells = a.slice(0, 24).map((x, i) => ({ v: cellText(x, heap), st: prevArr && (i >= prevArr.length || !same(prevArr[i], x)) ? "ok" : pset.has(i) ? "cur" : undefined }));
        blocks.push(<Row key={"this." + k} label={"this." + k} cells={cells} ptrs={ptrs} size={sizeFor(cells.map(c => String(c.v)), 42)} gap={6} />);
      }
    }
  }

  // ---- scalars ----
  const scal = vars.filter(([k, v]) => k !== "this" && !usedAsPtr.has(k) && (isPrim(v) && !(v === null && s.nodeVars.has(k))) && (typeof v !== "string" || !meta.idx[k] || v.length > 30));
  const thisScal = self && isRef(self) ? [...(heap.get(self.id)?.f ?? [])].filter(([, v]) => isPrim(v)).map(([k, v]) => ["this." + k, v] as [string, Enc]) : [];
  const chips = [...scal, ...thisScal].slice(0, 10);

  // ---- call stack ----
  const calls = st.frames.slice(1);
  if (calls.length > 1) side.push(<Stack key="calls" title="call stack" items={calls.map((f, i) => ({ id: "f" + i + f.fn, v: f.fn.replace(/^.*\./, "") + "(" + f.params.map(k => show(f.vars.get(k) ?? null, heap)).join(", ").slice(0, 22) + ")", st: i === calls.length - 1 ? "cur" : "mem" }))} min={3} w={150} />);

  return (
    <div className="pv-scene">
      {s.header}
      {chips.length > 0 && <div className="pv-stats">{chips.map(([k, v]) => <Stat key={k} label={k} value={show(v, heap).slice(0, 14)} tone={pframe && !same(before(k), v) ? "accent" : "mute"} />)}</div>}
      <div className="pv-side-by-side">
        <div className="pv-scene">{blocks.length ? blocks : !tables.length && !side.length ? <div className="pv-line">Only simple values so far: see the boxes above.</div> : null}</div>
        {(tables.length > 0 || side.length > 0) && <div className="pv-side-by-side">{tables}{side}</div>}
      </div>
    </div>
  );
}
