"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PATTERNS } from "@/content/roadmap";
import { PROBLEMS } from "@/content/problems";
import { LESSONS } from "@/content/lessons";
import { LESSON_SLUGS, PAT, PROB, TOPIC } from "@/lib/data";
import { useStore, update, today } from "@/lib/store";
import { toast } from "@/components/Toast";

export default function MistakesView() {
  const s = useStore(); const q = useSearchParams();
  const [prob, setProb] = useState(""); const [pat, setPat] = useState(""); const [wrong, setWrong] = useState(""); const [right, setRight] = useState("");
  const wrongRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const id = q.get("problem"); if (id && PROB[id]) { setProb(PROB[id].t); setPat(PROB[id].pat); wrongRef.current?.focus(); } }, [q]);
  const common = LESSON_SLUGS.flatMap(k => LESSONS[k].mistakes.slice(0, 2).map(m => [k, m] as const));
  return (
    <div className="stack">
      <span className="eyebrow">Mistake notebook</span><h1>Never make the same mistake twice</h1>
      <p className="lead">Every time you get stuck or submit a wrong answer, write down what went wrong and the idea that fixes it. Review this list before interviews.</p>
      <form className="card stack" style={{ gap: 10 }} onSubmit={e => {
        e.preventDefault();
        if (!prob.trim() || !wrong.trim()) return toast("Add the problem and what went wrong");
        update(x => { x.mist.push({ id: Date.now().toString(36), prob: prob.trim(), wrong: wrong.trim(), right: right.trim(), pat, date: today() }); }, { activity: true });
        setProb(""); setPat(""); setWrong(""); setRight(""); toast("Mistake saved");
      }}>
        <div className="grid g2" style={{ gap: 10 }}>
          <div className="stack" style={{ gap: 4 }}><label htmlFor="m-prob" className="faint mono" style={{ fontSize: 12 }}>PROBLEM</label><input id="m-prob" type="text" list="m-probs" placeholder="e.g. Longest Substring Without Repeating Characters" value={prob} onChange={e => setProb(e.target.value)} /><datalist id="m-probs">{PROBLEMS.map(p => <option key={p.id} value={p.t} />)}</datalist></div>
          <div className="stack" style={{ gap: 4 }}><label htmlFor="m-pat" className="faint mono" style={{ fontSize: 12 }}>PATTERN</label><select id="m-pat" value={pat} onChange={e => setPat(e.target.value)}><option value="">Choose…</option>{PATTERNS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
        </div>
        <div className="stack" style={{ gap: 4 }}><label htmlFor="m-wrong" className="faint mono" style={{ fontSize: 12 }}>MY MISTAKE</label><textarea id="m-wrong" ref={wrongRef} rows={2} placeholder="I forgot to move the left pointer when a duplicate appeared." value={wrong} onChange={e => setWrong(e.target.value)} /></div>
        <div className="stack" style={{ gap: 4 }}><label htmlFor="m-right" className="faint mono" style={{ fontSize: 12 }}>CORRECT IDEA</label><textarea id="m-right" rows={2} placeholder="Maintain a sliding window with unique characters; jump left past the previous index." value={right} onChange={e => setRight(e.target.value)} /></div>
        <div className="row"><button className="btn pri" type="submit">Save mistake</button><span className="faint" style={{ fontSize: 13 }}>Saved in this browser.</span></div>
      </form>
      <h2 style={{ marginTop: 6 }}>Your mistakes ({s.mist.length})</h2>
      {s.mist.length ? <div className="stack" style={{ gap: 10 }}>{[...s.mist].reverse().map(m => (
        <article key={m.id} className="card stack" style={{ gap: 8 }}>
          <div className="row" style={{ justifyContent: "space-between" }}><h3>{m.prob}</h3><span className="row" style={{ gap: 6 }}>{m.pat && <span className="pill">{PAT[m.pat]?.name || m.pat}</span>}<span className="faint mono" style={{ fontSize: 11.5 }}>{m.date}</span><button className="btn sm ghost" onClick={() => { update(x => { x.mist = x.mist.filter(y => y.id !== m.id); }); toast("Deleted"); }}>Delete</button></span></div>
          <div className="mistake"><div><b>My mistake</b>{m.wrong}</div><div><b>Correct idea</b>{m.right || "—"}</div></div>
        </article>))}</div>
        : <div className="card muted">Nothing logged yet. A good entry: <b style={{ color: "var(--ink)" }}>Problem:</b> Longest Substring Without Repeating Characters · <b style={{ color: "var(--ink)" }}>Mistake:</b> I forgot to move the left pointer when a duplicate appeared · <b style={{ color: "var(--ink)" }}>Correct idea:</b> maintain a window of unique characters · <b style={{ color: "var(--ink)" }}>Pattern:</b> Sliding Window</div>}
      <h2 style={{ marginTop: 10 }}>Common beginner mistakes by topic</h2>
      <div className="stack" style={{ gap: 10 }}>{common.map(([k, m]) => <div key={k + m[0]}><div className="faint mono" style={{ fontSize: 11.5, marginBottom: 4 }}>{TOPIC[k].title.toUpperCase()}</div><div className="mistake"><div><b>Mistake</b>{m[0]}</div><div><b>Do this instead</b>{m[1]}</div></div></div>)}</div>
    </div>
  );
}
