"use client";
import Link from "next/link";
import { useState } from "react";
import { PROBLEMS } from "@/content/problems";
import { TOPICS } from "@/content/roadmap";
import { LESSON_SLUGS, TOPIC, DIFF } from "@/lib/data";
import { useStore, stats, update, defaults } from "@/lib/store";
import { TopicLink } from "@/components/ui";
import RevisionModal from "@/components/RevisionModal";
import { toast } from "@/components/Toast";

export default function ProgressView() {
  const s = useStore(); const st = stats(s);
  const [confirm, setConfirm] = useState(false); const [rev, setRev] = useState<string | null>(null);
  const days: [string, boolean][] = []; const d = new Date(); d.setDate(d.getDate() - 34);
  for (let i = 0; i < 35; i++) { const k = d.toISOString().slice(0, 10); days.push([k, s.days.includes(k)]); d.setDate(d.getDate() + 1); }
  const favs = Object.keys(s.fav).filter(k => TOPIC[k]), weak = Object.keys(s.weak).filter(k => TOPIC[k]);
  const toRevise = PROBLEMS.filter(p => s.ps[p.id] === "revise");
  return (
    <div className="stack">
      <span className="eyebrow">Progress tracker</span><h1>Your DSA progress</h1>
      <div className="card stack" style={{ gap: 10 }}><div className="row" style={{ justifyContent: "space-between" }}><b style={{ fontFamily: "var(--f-display)", fontSize: 18 }}>Overall</b><span className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{st.pct}%</span></div><div className="bar" style={{ height: 12 }}><i style={{ width: `${st.pct}%` }} /></div><span className="faint" style={{ fontSize: 13 }}>Counts completed lessons ({LESSON_SLUGS.length}) and solved problems ({PROBLEMS.length}).</span></div>
      <div className="grid g4">
        <div className="card stat"><span className="l">Topics completed</span><span className="v">{st.topicsDone} <small style={{ fontSize: 14, color: "var(--faint)" }}>/ {TOPICS.length}</small></span></div>
        <div className="card stat"><span className="l">Problems solved</span><span className="v">{st.solved} <small style={{ fontSize: 14, color: "var(--faint)" }}>/ {PROBLEMS.length}</small></span></div>
        <div className="card stat"><span className="l">Current streak</span><span className="v">{st.streak} <small style={{ fontSize: 14, color: "var(--faint)" }}>days</small></span></div>
        <div className="card stat"><span className="l">Last studied</span><span className="v" style={{ fontSize: 18, lineHeight: 1.3 }}>{s.last ? <TopicLink slug={s.last} /> : "—"}</span></div>
      </div>
      <div className="grid g2">
        <div className="card"><h3 style={{ marginBottom: 12 }}>Problems by difficulty</h3>{(["E", "M", "H"] as const).map(k => <div key={k} style={{ marginBottom: 10 }}><div className="row" style={{ justifyContent: "space-between", fontSize: 13.5 }}><span>{DIFF[k]}</span><span className="mono">{st.byD[k][0]} / {st.byD[k][1]}</span></div><div className="bar good"><i style={{ width: `${(st.byD[k][0] / st.byD[k][1]) * 100}%` }} /></div></div>)}</div>
        <div className="card"><h3 style={{ marginBottom: 12 }}>Activity · last 5 weeks</h3><div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5, maxWidth: 260 }}>{days.map(([k, on]) => <div key={k} title={k} style={{ aspectRatio: "1", borderRadius: 4, background: on ? "var(--accent)" : "var(--panel2)", border: "1px solid var(--line)" }} />)}</div></div>
      </div>
      <div className="card tw" style={{ padding: "6px 8px" }}><table className="t"><thead><tr><th>Topic</th><th>Status</th><th>Revision</th><th /></tr></thead><tbody>
        {LESSON_SLUGS.map(k => { const r = s.rev[k]; const age = r ? Math.floor((Date.now() - new Date(r).getTime()) / 864e5) : null; return (
          <tr key={k}><td><TopicLink slug={k} />{s.weak[k] && <> <span className="pill H">weak</span></>}{s.fav[k] && <> <span className="pill M">★</span></>}</td>
            <td>{s.done[k] ? <span className="pill E">✓ done</span> : <span className="pill">in progress</span>}</td>
            <td>{age !== null ? <span className={`pill ${age > 7 ? "H" : age > 3 ? "M" : "E"}`}>{age === 0 ? "today" : age + "d ago"}{age > 7 ? " · due" : ""}</span> : <span className="faint" style={{ fontSize: 13 }}>never</span>}</td>
            <td><button className="btn sm" onClick={() => setRev(k)}>Revise</button></td></tr>); })}
      </tbody></table></div>
      <div className="grid g3">
        <div className="card"><h3 style={{ marginBottom: 8 }}>Weak topics</h3>{weak.length ? <ul className="clean">{weak.map(k => <li key={k}><TopicLink slug={k} /></li>)}</ul> : <p className="faint" style={{ fontSize: 14 }}>Mark topics as weak from their lesson page.</p>}</div>
        <div className="card"><h3 style={{ marginBottom: 8 }}>Favourite topics</h3>{favs.length ? <ul className="clean">{favs.map(k => <li key={k}><TopicLink slug={k} /></li>)}</ul> : <p className="faint" style={{ fontSize: 14 }}>Star topics from their lesson page.</p>}</div>
        <div className="card"><h3 style={{ marginBottom: 8 }}>Problems to revise</h3>{toRevise.length ? <ul className="clean">{toRevise.map(p => <li key={p.id}><Link href={`/problems/${p.id}`}>{p.t}</Link></li>)}</ul> : <p className="faint" style={{ fontSize: 14 }}>Mark problems with ★ Revise to see them here.</p>}</div>
      </div>
      <div className="card row" style={{ justifyContent: "space-between" }}><span className="muted" style={{ fontSize: 14 }}>Progress is saved in this browser. Clearing site data resets it.</span>
        {confirm ? <span className="row"><b style={{ color: "var(--bad)" }}>Erase all progress?</b><button className="btn sm" style={{ borderColor: "var(--bad)", color: "var(--bad)" }} onClick={() => { update(x => { const th = x.theme; Object.assign(x, defaults()); x.theme = th; }); setConfirm(false); toast("Progress erased"); }}>Yes, erase</button><button className="btn sm" onClick={() => setConfirm(false)}>Cancel</button></span>
          : <button className="btn sm ghost" onClick={() => setConfirm(true)}>Reset progress</button>}</div>
      {rev && <RevisionModal slug={rev} onClose={() => setRev(null)} />}
    </div>
  );
}
