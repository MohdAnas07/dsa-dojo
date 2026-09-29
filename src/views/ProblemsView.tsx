"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PROBLEMS } from "@/content/problems";
import { PATTERNS, TOPICS } from "@/content/roadmap";
import { PAT, TOPIC, DIFF } from "@/lib/data";
import { useStore, stats, isSolved } from "@/lib/store";
import { ProblemRow, STATUS, STATUS_ORDER } from "@/components/ui";

const EMPTY = { topic: "", pat: "", d: "", st: "", co: "", q: "", sort: "" };
type F = typeof EMPTY;
const PAGE = 50;

export default function ProblemsView() {
  const s = useStore();
  const sp = useSearchParams();
  const [f, setF] = useState<F>(EMPTY);
  const [shown, setShown] = useState(PAGE);
  useEffect(() => { setF({ ...EMPTY, d: sp.get("d") || "", topic: sp.get("topic") || "", pat: sp.get("pat") || "" }); setShown(PAGE); }, [sp]);
  const st = stats(s);
  const cos = useMemo(() => [...new Set(PROBLEMS.flatMap(p => p.co))].sort(), []);
  const topicOpts = useMemo(() => TOPICS.filter(t => PROBLEMS.some(p => p.topics.includes(t.slug))).map(t => [t.slug, `${t.title} (${PROBLEMS.filter(p => p.topics.includes(t.slug)).length})`] as [string, string]), []);
  const patCounts = useMemo(() => PATTERNS.map(p => [p.id, PROBLEMS.filter(x => x.pats.includes(p.id)).length] as [string, number]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]), []);
  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { setF({ ...f, [k]: e.target.value }); setShown(PAGE); };
  const Sel = ({ k, label, opts }: { k: keyof F; label: string; opts: [string, string][] }) =>
    <select aria-label={label} value={f[k]} onChange={set(k)}><option value="">{label}: all</option>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>;

  const list = useMemo(() => {
    const q = f.q.toLowerCase();
    const out = PROBLEMS.filter(p => (!f.d || p.d === f.d) && (!f.topic || p.topics.includes(f.topic)) && (!f.pat || p.pats.includes(f.pat)) && (!f.co || p.co.includes(f.co))
      && (!f.st || (s.ps[p.id] || "todo") === f.st) && (!q || p.t.toLowerCase().includes(q) || p.s.toLowerCase().includes(q)));
    if (f.sort === "diff") out.sort((a, b) => "EMH".indexOf(a.d) - "EMH".indexOf(b.d));
    if (f.sort === "title") out.sort((a, b) => a.t.localeCompare(b.t));
    if (f.sort === "coverage") out.sort((a, b) => b.topics.length + b.pats.length - (a.topics.length + a.pats.length));
    if (f.sort === "unsolved") out.sort((a, b) => Number(isSolved(s, a.id)) - Number(isSolved(s, b.id)));
    return out;
  }, [f, s]);

  const heading = f.topic ? `Problems that use ${TOPIC[f.topic]?.title}` : f.pat ? `${PAT[f.pat]?.name} problems` : f.d ? `${DIFF[f.d as "E"]} problems` : "Practice problems";
  return (
    <div className="stack">
      <span className="eyebrow">Problem tracker · {PROBLEMS.length} problems</span><h1>{heading}</h1>
      <p className="lead">Each problem is tagged with every topic and pattern it uses, so solving one moves several topics forward. Open a problem to code it in JavaScript or Python against real tests; similar problems are linked at the bottom of each one.</p>
      <div className="grid g3">{(["E", "M", "H"] as const).map(k => <div key={k} className="card stat"><span className="l">{DIFF[k]}</span><span className="v" style={{ fontSize: 24 }}>{st.byD[k][0]} <small style={{ fontSize: 14, color: "var(--faint)" }}>/ {st.byD[k][1]}</small></span><div className="bar good"><i style={{ width: `${(st.byD[k][0] / st.byD[k][1]) * 100}%` }} /></div></div>)}</div>
      <div>
        <div className="faint mono" style={{ fontSize: 11.5, letterSpacing: ".08em", marginBottom: 6 }}>BROWSE BY PATTERN</div>
        <div className="row" style={{ gap: 6 }}>
          {patCounts.map(([id, n]) => (
            <button key={id} className={"chip" + (f.pat === id ? " done" : "")} style={f.pat === id ? { borderColor: "var(--accent)", background: "var(--accent-soft)" } : undefined}
              onClick={() => { setF({ ...f, pat: f.pat === id ? "" : id }); setShown(PAGE); }}>
              {PAT[id].name} <span className="faint mono" style={{ fontSize: 11 }}>{n}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="filters">
        <input type="search" placeholder="Search name or statement…" aria-label="Filter by name" value={f.q} onChange={set("q")} />
        <Sel k="d" label="Difficulty" opts={[["E", "Easy"], ["M", "Medium"], ["H", "Hard"]]} />
        <Sel k="topic" label="Topic" opts={topicOpts} />
        <Sel k="pat" label="Pattern" opts={patCounts.map(([id, n]) => [id, `${PAT[id].name} (${n})`])} />
        <Sel k="st" label="Status" opts={STATUS_ORDER.map(k => [k, STATUS[k][1]])} />
        <Sel k="co" label="Company" opts={cos.map(c => [c, c])} />
        <select aria-label="Sort" value={f.sort} onChange={set("sort")}><option value="">Sort: recommended</option><option value="diff">Easy → Hard</option><option value="coverage">Most topics covered</option><option value="unsolved">Unsolved first</option><option value="title">A → Z</option></select>
        <button className="btn ghost sm" onClick={() => { setF(EMPTY); setShown(PAGE); }}>Clear</button>
      </div>
      {list.length ? <>
        <p className="faint" style={{ fontSize: 13 }}>{list.length} problem{list.length === 1 ? "" : "s"} · {list.filter(p => isSolved(s, p.id)).length} solved</p>
        <div className="plist">{list.slice(0, shown).map(p => <ProblemRow key={p.id} p={p} />)}</div>
        {shown < list.length && <button className="btn" style={{ alignSelf: "center" }} onClick={() => setShown(shown + PAGE)}>Show {Math.min(PAGE, list.length - shown)} more ({list.length - shown} left)</button>}
      </> : <div className="card muted">No problems match these filters.</div>}
      <p className="faint" style={{ fontSize: 12.5 }}>Company names reflect where each problem is commonly reported in interviews; treat them as a rough guide.</p>
    </div>
  );
}
