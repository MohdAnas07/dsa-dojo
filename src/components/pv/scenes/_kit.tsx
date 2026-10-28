"use client";
import type { ComponentProps, ReactNode } from "react";
import { Row, Line, Stat, type Tone, type Cell } from "../prims";

/** A common scene shape: some stat readouts, one or more array rows, a caption, and optional side panels. */
export interface AS { stats?: [string, ReactNode, Tone?][]; rows: ComponentProps<typeof Row>[]; line?: ReactNode; side?: ReactNode; top?: ReactNode }
export function ArrayView({ s }: { s: AS }) {
  const main = <div className="pv-scene">{s.top}{s.rows.map((r, k) => <Row key={k} {...r} />)}{s.line !== undefined && <Line>{s.line}</Line>}</div>;
  return (
    <div className="pv-scene">
      {s.stats && <div className="pv-stats">{s.stats.map(([l, v, t]) => <Stat key={l} label={l} value={v} tone={t} />)}</div>}
      {s.side ? <div className="pv-side-by-side">{main}{s.side}</div> : main}
    </div>
  );
}
/** Builds cells from values with a state function. */
export const cells = (a: (number | string)[], st: (i: number) => string | undefined = () => undefined, extra?: (i: number) => Partial<Cell>): Cell[] =>
  a.map((v, i) => ({ v, st: st(i), ...(extra ? extra(i) : {}) }));
export const between = (i: number, lo: number, hi: number) => i >= lo && i <= hi;
export const sq = (a: unknown[]) => "[" + a.join(", ") + "]";

/** "a + b = sum" with how it compares to a target, e.g. 1 + 11 = 12 > 10. */
export function Calc({ parts, op = "+", result, vs, vsLabel }: { parts: ReactNode[]; op?: string; result: ReactNode; vs?: number; vsLabel?: ReactNode }) {
  const r = typeof result === "number" ? result : NaN;
  const cls = vs === undefined || Number.isNaN(r) ? "" : r < vs ? "lt" : r > vs ? "gt" : "eq";
  const sym = cls === "lt" ? "<" : cls === "gt" ? ">" : "=";
  return (
    <div className="pv-calc" aria-label="calculation">
      {parts.map((p, i) => <span key={i}>{i > 0 && <span className="op">{op} </span>}<span className="a">{p}</span></span>)}
      <span className="op">=</span><span className="res">{result}</span>
      {vs !== undefined && <span className={"vs " + cls}>{sym} {vsLabel ?? vs}</span>}
    </div>
  );
}
