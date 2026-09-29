"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PROBLEMS } from "@/content/problems";
import { PAT, TOPIC, DIFF } from "@/lib/data";
import { useStore, stats } from "@/lib/store";
import { ProblemRow, STATUS, STATUS_ORDER } from "@/components/ui";

const EMPTY = { topic: "", pat: "", d: "", st: "", co: "", q: "" };
export default function ProblemsView() {
  const s = useStore();
  const sp = useSearchParams();
  const [f, setF] = useState(EMPTY);
  useEffect(() => { setF(x => ({ ...x, d: sp.get("d") || "" })); }, [sp]);
  const st = stats(s);
  const cos = [...new Set(PROBLEMS.flatMap(p => p.co))].sort();
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const Sel = ({ k, label, opts }: { k: keyof typeof EMPTY; label: string; opts: [string, string][] }) =>
    <select aria-label={label} value={f[k]} onChange={set(k)}><option value="">{label}: all</option>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>;
  const list = PROBLEMS.filter(p => (!f.d || p.d === f.d) && (!f.topic || p.topic === f.topic) && (!f.pat || p.pat === f.pat) && (!f.co || p.co.includes(f.co)) && (!f.st || (s.ps[p.id] || "todo") === f.st) && (!f.q || p.t.toLowerCase().includes(f.q.toLowerCase())));
  return (
    <div className="stack">
      <span className="eyebrow">Problem tracker</span><h1>Practice problems</h1>
      <p className="lead">Open a problem to code it in JavaScript or Python and run it against real tests. Click the status box to cycle: ☐ Not started → ◐ Attempted → ✓ Solved → ★ Revise.</p>
      <div className="grid g3">{(["E", "M", "H"] as const).map(k => <div key={k} className="card stat"><span className="l">{DIFF[k]}</span><span className="v" style={{ fontSize: 24 }}>{st.byD[k][0]} <small style={{ fontSize: 14, color: "var(--faint)" }}>/ {st.byD[k][1]}</small></span><div className="bar good"><i style={{ width: `${(st.byD[k][0] / st.byD[k][1]) * 100}%` }} /></div></div>)}</div>
      <div className="filters">
        <input type="search" placeholder="Filter by name…" aria-label="Filter by name" value={f.q} onChange={set("q")} />
        <Sel k="d" label="Difficulty" opts={[["E", "Easy"], ["M", "Medium"], ["H", "Hard"]]} />
        <Sel k="topic" label="Topic" opts={[...new Set(PROBLEMS.map(p => p.topic))].map(k => [k, TOPIC[k].title])} />
        <Sel k="pat" label="Pattern" opts={[...new Set(PROBLEMS.map(p => p.pat))].map(k => [k, PAT[k]?.name || k])} />
        <Sel k="st" label="Status" opts={STATUS_ORDER.map(k => [k, STATUS[k][1]])} />
        <Sel k="co" label="Company" opts={cos.map(c => [c, c])} />
        <button className="btn ghost sm" onClick={() => setF(EMPTY)}>Clear</button>
      </div>
      {list.length ? <><p className="faint" style={{ fontSize: 13 }}>{list.length} problem{list.length === 1 ? "" : "s"}</p><div className="plist">{list.map(p => <ProblemRow key={p.id} p={p} />)}</div></>
        : <div className="card muted">No problems match these filters.</div>}
    </div>
  );
}
