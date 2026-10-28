"use client";
import { useEffect, useMemo, useState } from "react";
import Player from "./Player";
import { PVIZ, PROBLEM_VIZ, PATTERN_VIZ } from "./index";
import { buildTraceViz } from "./trace/build";
import type { TraceFile } from "./trace/model";
import type { Problem } from "@/lib/types";
import { PAT } from "@/lib/data";

type Tab = "trace" | "walk" | "pattern";

/** "Visualize the solution": the reference solution traced line by line, plus a hand-made walkthrough or the pattern's visualizer when there is one. */
export default function SolutionViz({ p }: { p: Problem }) {
  const walk = PROBLEM_VIZ[p.id];
  const pat = !walk ? p.pats.map(x => [x, PATTERN_VIZ[x]] as const).find(([, v]) => v) : undefined;
  const [tab, setTab] = useState<Tab>(walk ? "walk" : "trace");
  const [data, setData] = useState<TraceFile | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    fetch(`/traces/${p.id}.json`).then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(d => { if (live) setData(d); }).catch(() => { if (live) setErr("The step-by-step trace for this problem isn't available right now."); });
    return () => { live = false; };
  }, [p.id]);
  const viz = useMemo(() => (data ? buildTraceViz(data, { title: p.t, tc: p.tc, sc: p.sc, approach: p.a }) : null), [data, p]);
  const tabs: [Tab, string][] = [...(walk ? [["walk", "Guided walkthrough"] as [Tab, string]] : []), ["trace", "Reference solution, line by line"], ...(pat ? [["pattern", `Pattern: ${PAT[pat[0]]?.name ?? pat[0]}`] as [Tab, string]] : [])];
  return (
    <div className="stack" style={{ gap: 10 }}>
      {tabs.length > 1 && <div className="pv-modes" role="tablist" aria-label="Visualization" style={{ alignSelf: "flex-start" }}>{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}</div>}
      {tab === "walk" && walk && <Player key="walk" viz={PVIZ[walk[0]]} initialMode={walk[1]} />}
      {tab === "pattern" && pat && <Player key="pattern" viz={PVIZ[pat[1]![0]]} initialMode={pat[1]![1]} />}
      {tab === "trace" && (viz ? <Player key="trace" viz={viz} /> : <div className="card muted">{err ?? "Loading the trace…"}</div>)}
      <p className="faint" style={{ fontSize: 12.5, margin: 0 }}>{tab === "trace" ? "Recorded from the actual reference solution running on the problem's examples. Use ← → or the timeline; turn on Predict to guess each condition before it's revealed." : tab === "walk" ? "A guided walkthrough of this problem's algorithm. The line-by-line trace of the reference solution is in the next tab." : "This problem uses this pattern. The line-by-line trace of this problem's own solution is in the other tab."}</p>
    </div>
  );
}
