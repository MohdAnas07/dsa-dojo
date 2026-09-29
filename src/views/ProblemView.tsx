"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PROBLEMS } from "@/content/problems";
import { PROB, PAT, TOPIC, DIFF } from "@/lib/data";
import { useStore, update, randomUnsolved } from "@/lib/store";
import expected from "@/generated/expected.json";
import CodeBlock from "@/components/CodeBlock";
import SolvePanel from "@/components/SolvePanel";
import { STATUS, STATUS_ORDER, TopicLink } from "@/components/ui";
import { toast } from "@/components/Toast";

export default function ProblemView({ id }: { id: string }) {
  const p = PROB[id];
  const s = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(1);
  const [timer, setTimer] = useState<number | null>(null);
  const [rand, setRand] = useState<string | null>(null);
  const tRef = useRef<ReturnType<typeof setInterval>>(undefined);
  useEffect(() => { setOpen(1); setRand(randomUnsolved(s)); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);
  useEffect(() => () => clearInterval(tRef.current), []);
  const st = s.ps[id] || "todo";
  const idx = PROBLEMS.indexOf(p); const prev = PROBLEMS[idx - 1], next = PROBLEMS[idx + 1];
  const steps: [string, React.ReactNode][] = [
    ["Problem", <><p style={{ fontSize: 15.5 }}>{p.s}</p><pre className="cheat" style={{ marginTop: 10 }}>{p.eg}</pre></>],
    ["Think for yourself", <><p className="muted">Before any hint: restate the problem in your own words, write one small example by hand, and describe the brute force. What is its complexity? Then try coding it in the editor.</p>
      <div className="row" style={{ marginTop: 10 }}><button className="btn sm" onClick={() => {
        clearInterval(tRef.current); let left = 600; setTimer(left);
        tRef.current = setInterval(() => { left--; setTimer(left); if (left <= 0) clearInterval(tRef.current); }, 1000);
      }}>Start 10-min timer</button>{timer !== null && <span className="mono" style={{ color: "var(--accent)" }}>{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}{timer <= 0 ? " · time's up, reveal Hint 1" : ""}</span>}</div></>],
    ["Hint 1", <p>{p.h[0]}</p>],
    ["Hint 2", <p>{p.h[1]}</p>],
    ["Approach", <><p>{p.a}</p><p className="muted" style={{ marginTop: 8 }}>Pattern: <Link href={`/patterns#${p.pat}`}>{PAT[p.pat]?.name || p.pat}</Link> · Topic: <TopicLink slug={p.topic} /></p></>],
    ["Reference solution", <CodeBlock sample={p.c} expected={(expected.samples as Record<string, string>)[`problem.${id}`]} />],
    ["Complexity", <div className="row"><span className="pill">Time <b className="cx" style={{ marginLeft: 4 }}>{p.tc}</b></span><span className="pill">Space <b className="cx" style={{ marginLeft: 4 }}>{p.sc}</b></span></div>],
    ["Follow-up questions", <ul className="clean">{p.f.map(x => <li key={x}><span>{x}</span></li>)}</ul>]
  ];
  return (
    <div className="stack">
      <div className="row"><Link href="/problems" className="faint" style={{ fontSize: 13 }}>← All problems</Link></div>
      <div className="row"><span className={`pill ${p.d}`}>{DIFF[p.d]}</span><span className="pill">{PAT[p.pat]?.name}</span><span className="pill B">{TOPIC[p.topic].title}</span></div>
      <h1>{p.t}</h1>
      <div className="row faint" style={{ fontSize: 13 }}>Asked at: {p.co.join(", ")} · <a href={`https://leetcode.com/problems/${p.lc}/`} target="_blank" rel="noopener noreferrer">Open on LeetCode ↗</a></div>
      <div className="statusset" role="group" aria-label="Status">
        {STATUS_ORDER.map(k => <button key={k} className={"btn sm" + (st === k ? " on" : "")} onClick={() => { update(x => { if (k === "todo") delete x.ps[id]; else x.ps[id] = k; }, { activity: true }); toast(`Marked ${STATUS[k][1].toLowerCase()}`); }}>{STATUS[k][0]} {STATUS[k][1]}</button>)}
        <span style={{ flex: 1 }} />
        <button className="btn sm ghost" onClick={() => router.push(`/mistakes?problem=${id}`)}>+ Log a mistake</button>
      </div>
      <div className="solve-grid">
        <div className="stack" style={{ gap: 10 }}>
          <div className="card" style={{ padding: "12px 16px", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <b style={{ fontFamily: "var(--f-display)" }}>Interview mode</b><span className="muted" style={{ fontSize: 14, flex: 1, minWidth: 180 }}>Steps unlock one at a time.</span>
            <button className="btn sm" onClick={() => open < steps.length ? setOpen(open + 1) : toast("Everything is revealed")}>Reveal next step</button>
            <button className="btn sm ghost" onClick={() => setOpen(steps.length)}>Reveal all</button>
          </div>
          {steps.map(([h, body], i) => (
            <div key={h} className={"step" + (i < open ? " open" : " locked")}>
              <div className="step-h"><span className="num">{i + 1}</span><h3 style={{ flex: 1 }}>{h}</h3>{i >= open && <button className="btn sm ghost" onClick={() => setOpen(i + 1)}>Reveal</button>}</div>
              {i < open && <div className="step-b">{body}</div>}
            </div>
          ))}
        </div>
        <div className="solve-col"><SolvePanel id={id} /></div>
      </div>
      <div className="row" style={{ justifyContent: "space-between", borderTop: "1px solid var(--line)", paddingTop: 16 }}>
        {prev ? <Link className="btn" href={`/problems/${prev.id}`}>← {prev.t}</Link> : <span />}
        {rand && <Link className="btn" href={`/problems/${rand}`}>Random problem</Link>}
        {next ? <Link className="btn" href={`/problems/${next.id}`}>{next.t} →</Link> : <span />}
      </div>
    </div>
  );
}
