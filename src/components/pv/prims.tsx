"use client";
import type { CSSProperties, ReactNode } from "react";

/* Drawing pieces shared by all pattern scenes. Everything is absolutely positioned and keyed,
   so when a step moves a pointer or swaps two values, CSS transitions animate the change. */

export type Tone = "accent" | "sky" | "good" | "bad" | "vio" | "warn" | "mute";
const tx = (x: number, y = 0): CSSProperties => ({ transform: `translate(${x}px, ${y}px)` });

// ---------- array / bar row ----------
export interface Cell { v: ReactNode; id?: string | number; st?: string; sub?: ReactNode; h?: number }
/** A labelled pointer. `from` is where it was on the previous step: a trail arrow shows the move. */
export interface Ptr { name: string; at: number; tone?: Tone; below?: boolean; from?: number }
export interface Range { from: number; to: number; tone?: Tone; label?: string; h?: number }
export interface Arc { from: number; to: number; tone?: Tone; label?: string }

export function Row({ cells, ptrs = [], ranges = [], arcs = [], label, size = 52, gap = 9, bars, barMax = 150, idx = true, idxFrom = 0 }:
  { cells: Cell[]; ptrs?: Ptr[]; ranges?: Range[]; arcs?: Arc[]; label?: ReactNode; size?: number; gap?: number; bars?: boolean; barMax?: number; idx?: boolean; idxFrom?: number }) {
  const pitch = size + gap, n = cells.length, W = Math.max(n * pitch - gap, size);
  const slot = (p: Ptr) => ptrs.filter(q => q.at === p.at && !!q.below === !!p.below).indexOf(p);
  const depth = (below: boolean) => Math.max(0, ...ptrs.filter(p => !!p.below === below).map(p => ptrs.filter(q => q.at === p.at && !!q.below === below).length));
  const labH = ranges.some(r => r.label) ? 20 : 0, topH = labH + depth(false) * 25 + 6;
  const cellH = bars ? barMax : size, y0 = topH + 4;
  const idxY = y0 + cellH + 7, botY = idxY + (idx ? 18 : 2);
  const hasSub = cells.some(c => c.sub !== undefined && c.sub !== null && c.sub !== "");
  const subY = botY + depth(true) * 25;
  const arcY = subY + (hasSub ? 22 : 0);
  const arcH = arcs.length ? 46 : 0;
  const H = arcY + arcH;
  const hOf = (c: Cell) => bars ? Math.max(24, Math.round((c.h ?? 0) * barMax)) : size;
  return (
    <div className="pv-row">
      {label !== undefined && <div className="pv-lab" style={{ paddingTop: y0 + (bars ? barMax - 30 : size / 2 - 9) }}>{label}</div>}
      <div className="pv-arr" style={{ width: W, height: H }}>
        {ranges.map((r, k) => {
          const lo = Math.max(0, Math.min(r.from, r.to)), hi = Math.min(n - 1, Math.max(r.from, r.to)), empty = r.to < r.from;
          const h = r.h !== undefined ? Math.max(4, r.h * barMax) : cellH + 10;
          const y = r.h !== undefined ? y0 + barMax - h : y0 - 5;
          return [<div key={"r" + k} className={"pv-range t-" + (r.tone || "sky") + (r.h !== undefined ? " fill" : "")} style={{ ...tx(lo * pitch - 5, y), width: empty ? 0 : (hi - lo) * pitch + size + 10, height: h, opacity: empty || n === 0 ? 0 : 1 }} />,
            r.label ? <div key={"rl" + k} className={"pv-rlab t-" + (r.tone || "sky")} style={{ ...tx(lo * pitch - 5, 0), width: Math.max(size, (hi - lo) * pitch + size + 10), opacity: empty ? 0 : 1 }}>{r.label}</div> : null];
        })}
        {cells.map((c, i) => <div key={c.id ?? i} className={"pv-cell " + (c.st || "") + (bars ? " bar" : "")} style={{ ...tx(i * pitch, y0 + cellH - hOf(c)), width: size, height: hOf(c) }}><span>{c.v}</span></div>)}
        {idx && cells.map((_, i) => <div key={"i" + i} className="pv-idx" style={{ ...tx(i * pitch, idxY), width: size }}>{i + idxFrom}</div>)}
        {hasSub && cells.map((c, i) => <div key={"s" + (c.id ?? i)} className="pv-sub" style={{ ...tx(i * pitch, subY), width: size }}>{c.sub}</div>)}
        {ptrs.map(p => {
          const k = slot(p), x = p.at * pitch + size / 2;
          const y = p.below ? botY + k * 25 : topH - 25 - k * 25 + 2;
          const moved = p.from !== undefined && p.from !== p.at, left = moved && p.from! > p.at;
          return <div key={"p" + p.name} className={"pv-ptr t-" + (p.tone || "sky") + (p.below ? " up" : "") + (p.at < 0 || p.at >= n ? " off" : "")} style={tx(x, y)}><span>{moved && left && <b aria-hidden>◀</b>}{p.name}{moved && !left && <b aria-hidden>▶</b>}</span></div>;
        })}
        {ptrs.filter(p => p.from !== undefined && p.from !== p.at).map(p => {
          // Dashed arrow from the old index to just outside the pointer's badge at its new index.
          const a = p.from! * pitch + size / 2, b = p.at * pitch + size / 2, k = slot(p), gapX = 18;
          const badgeY = p.below ? botY + k * 25 + 5 : topH - 25 - k * 25 + 2;
          const lo = b > a ? a : b + gapX, w = Math.max(10, Math.abs(b - a) - gapX);
          return <div key={"t" + p.name + p.from + ">" + p.at} className={"pv-trail t-" + (p.tone || "sky") + (b < a ? " l" : "")} style={{ ...tx(lo, badgeY + 3), width: w }} aria-hidden />;
        })}
        {arcs.length > 0 && <svg className="pv-arcs" width={W} height={arcH} style={{ top: arcY }} aria-hidden>
          <defs>{(["accent", "sky", "good", "bad", "vio", "warn", "mute"] as Tone[]).map(t => <marker key={t} id={"pva-" + t} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" className={"pv-mk t-" + t} /></marker>)}</defs>
          {arcs.map((a, k) => {
            const x1 = a.from * pitch + size / 2, x2 = a.to * pitch + size / 2, d = Math.min(40, 12 + Math.abs(x2 - x1) / 6);
            return <g key={k} className={"pv-arc t-" + (a.tone || "accent")}><path d={`M${x1},2 Q${(x1 + x2) / 2},${d * 2} ${x2},4`} markerEnd={`url(#pva-${a.tone || "accent"})`} />{a.label && <text x={(x1 + x2) / 2} y={d + 10} textAnchor="middle">{a.label}</text>}</g>;
          })}
        </svg>}
      </div>
    </div>
  );
}

// ---------- vertical stack ----------
export interface Item { id: string | number; v: ReactNode; sub?: ReactNode; st?: string }
export function Stack({ items, title = "stack", min = 5, w = 120 }: { items: Item[]; title?: ReactNode; min?: number; w?: number }) {
  const sh = 38, H = Math.max(min, items.length) * sh + 6;
  return (
    <div className="pv-stack">
      <div className="pv-cap">{title}</div>
      <div className="pv-well" style={{ height: H, width: w }}>
        {items.map((it, k) => <div key={it.id} className={"pv-sitem " + (it.st || "")} style={{ ...tx(0, H - (k + 1) * sh), width: w - 10 }}><b>{it.v}</b>{it.sub !== undefined && <span>{it.sub}</span>}{k === items.length - 1 && <em>top</em>}</div>)}
        {!items.length && <div className="pv-empty">empty</div>}
      </div>
    </div>
  );
}

// ---------- horizontal queue / list of chips ----------
export function Queue({ items, title = "queue", front = "front", w = 52 }: { items: Item[]; title?: ReactNode; front?: string | null; w?: number }) {
  const pitch = w + 8, W = Math.max(items.length * pitch - 8, 160);
  return (
    <div className="pv-queue">
      <div className="pv-cap">{title}</div>
      <div className="pv-qwell" style={{ width: W + 16 }}>
        {items.map((it, k) => <div key={it.id} className={"pv-qitem " + (it.st || "")} style={{ ...tx(k * pitch, 0), width: w }}><b>{it.v}</b>{it.sub !== undefined && <span>{it.sub}</span>}</div>)}
        {!items.length && <div className="pv-empty">empty</div>}
        {front && items.length > 0 && <div className="pv-front">{front} ↑</div>}
      </div>
    </div>
  );
}

// ---------- nodes and edges (graphs, heaps, decision trees, linked lists) ----------
export interface NNode { id: string | number; x: number; y: number; v: ReactNode; st?: string; badge?: ReactNode; sub?: ReactNode; r?: number }
export interface NEdge { a?: string | number; b?: string | number; x1?: number; y1?: number; x2?: number; y2?: number; st?: string; dir?: boolean; label?: ReactNode }
export function Net({ nodes, edges, w, h, r = 21, tags }: { nodes: NNode[]; edges: NEdge[]; w: number; h: number; r?: number; tags?: { x: number; y: number; text: ReactNode; tone?: Tone; id: string }[] }) {
  const pos = new Map(nodes.map(n => [n.id, n]));
  return (
    <div className="pv-net" style={{ width: w, height: h }}>
      <svg width={w} height={h} aria-hidden>
        <defs><marker id="pvn-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke" /></marker></defs>
        {edges.map((e, k) => {
          const A = e.a !== undefined ? pos.get(e.a) : undefined, B = e.b !== undefined ? pos.get(e.b) : undefined;
          let x1 = A?.x ?? e.x1 ?? 0, y1 = A?.y ?? e.y1 ?? 0, x2 = B?.x ?? e.x2 ?? 0, y2 = B?.y ?? e.y2 ?? 0;
          const len = Math.hypot(x2 - x1, y2 - y1) || 1, ra = (A?.r ?? r) + 1, rb = (B?.r ?? r) + (e.dir ? 4 : 1);
          if (A || B) { const ux = (x2 - x1) / len, uy = (y2 - y1) / len; x1 += ux * ra; y1 += uy * ra; x2 -= ux * rb; y2 -= uy * rb; }
          return <g key={k} className={"pv-edge " + (e.st || "")}><line x1={x1} y1={y1} x2={x2} y2={y2} markerEnd={e.dir ? "url(#pvn-arrow)" : undefined} />{e.label !== undefined && <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} textAnchor="middle">{e.label}</text>}</g>;
        })}
      </svg>
      {nodes.map(n => { const rr = n.r ?? r; return (
        <div key={n.id} className={"pv-node " + (n.st || "")} style={{ ...tx(n.x - rr, n.y - rr), width: rr * 2, height: rr * 2 }}>
          <span>{n.v}</span>
          {n.badge !== undefined && n.badge !== null && n.badge !== "" && <i className="pv-badge">{n.badge}</i>}
          {n.sub !== undefined && <em className="pv-nsub">{n.sub}</em>}
        </div>); })}
      {tags?.map(t => <div key={t.id} className={"pv-tag t-" + (t.tone || "accent")} style={tx(t.x, t.y)}><span>{t.text}</span></div>)}
    </div>
  );
}

// ---------- grid (DP tables, BFS/DFS on a grid) ----------
export interface GCell { v: ReactNode; st?: string }
export function Grid({ rows, rowLabels, colLabels, size = 40, arrows = [], corner }: { rows: GCell[][]; rowLabels?: ReactNode[]; colLabels?: ReactNode[]; size?: number; arrows?: { from: [number, number]; to: [number, number]; tone?: Tone }[]; corner?: ReactNode }) {
  const gap = 4, p = size + gap, offX = rowLabels ? 30 : 0, offY = colLabels ? 24 : 0;
  const W = offX + (rows[0]?.length || 0) * p, H = offY + rows.length * p;
  const c = (r: number, k: number) => [offX + k * p + size / 2, offY + r * p + size / 2];
  return (
    <div className="pv-grid" style={{ width: W, height: H }}>
      {corner && <div className="pv-glab" style={{ ...tx(0, 0), width: offX, height: offY }}>{corner}</div>}
      {colLabels?.map((l, k) => <div key={"c" + k} className="pv-glab" style={{ ...tx(offX + k * p, 0), width: size, height: offY - 4 }}>{l}</div>)}
      {rowLabels?.map((l, r) => <div key={"r" + r} className="pv-glab" style={{ ...tx(0, offY + r * p), width: offX - 6, height: size }}>{l}</div>)}
      {rows.map((row, r) => row.map((cell, k) => <div key={r + ":" + k} className={"pv-gcell " + (cell.st || "")} style={{ ...tx(offX + k * p, offY + r * p), width: size, height: size }}><span>{cell.v}</span></div>))}
      {arrows.length > 0 && <svg className="pv-garrows" width={W} height={H} aria-hidden>
        <defs><marker id="pvg-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke" /></marker></defs>
        {arrows.map((a, k) => { const [x1, y1] = c(...a.from), [x2, y2] = c(...a.to); const len = Math.hypot(x2 - x1, y2 - y1) || 1, sh = size * 0.36; const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
          return <line key={k} className={"t-" + (a.tone || "accent")} x1={x1 + ux * sh} y1={y1 + uy * sh} x2={x2 - ux * sh} y2={y2 - uy * sh} markerEnd="url(#pvg-arrow)" />; })}
      </svg>}
    </div>
  );
}

/** A small key → value table (hash maps, sets, answers). */
export function Table({ title, rows, hot, w = 150, empty = "empty" }: { title: ReactNode; rows: [ReactNode, ReactNode][]; hot?: number[]; w?: number; empty?: string }) {
  return (
    <div className="pv-table" style={{ minWidth: w }}>
      <div className="pv-cap">{title}</div>
      <div className="pv-tbody">{rows.length ? rows.map(([k, v], i) => <div key={i} className={"pv-trow" + (hot?.includes(i) ? " hot" : "")}><span>{k}</span><b>{v}</b></div>) : <div className="pv-empty">{empty}</div>}</div>
    </div>
  );
}

/** A big readout like "best = 9". */
export function Stat({ label, value, tone = "accent" }: { label: ReactNode; value: ReactNode; tone?: Tone }) {
  return <div className={"pv-stat t-" + tone}><span>{label}</span><b>{value}</b></div>;
}
export const Line = ({ children }: { children: ReactNode }) => <div className="pv-line">{children}</div>;
