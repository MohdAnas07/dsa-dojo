"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PROBLEMS } from "@/content/problems";
import { PROB, PAT, TOPIC, DIFF } from "@/lib/data";
import { useStore, update, randomUnsolved } from "@/lib/store";
import expected from "@/generated/expected.json";
import CodeBlock from "@/components/CodeBlock";
import VisualizeButton from "@/components/pv/VisualizeButton";
import SolvePanel from "@/components/SolvePanel";
import { ResizeHandle, useStoredNumber, clamp } from "@/components/ResizeHandle";
import { JUDGE } from "@/content/judge";
import { STATEMENTS } from "@/content/statements";
import { expectedFor } from "@/lib/runner";
import { showArgs, showVal } from "@/lib/show";
import { STATUS, STATUS_ORDER, TopicLink } from "@/components/ui";
import { toast } from "@/components/Toast";

const DEFAULT_LEFT = 46.5; // matches the default 1 : 1.15 columns

export default function ProblemView({ id }: { id: string }) {
  const p = PROB[id];
  const s = useStore();
  const router = useRouter();
  // Width of the problem column, in % of the row (null = default). Drag the divider to change it.
  const gridRef = useRef<HTMLDivElement>(null);
  const [leftPct, setLeftPct] = useStoredNumber("dojo-split-left", null);
  const clampPct = (pct: number) => {
    const w = gridRef.current?.getBoundingClientRect().width || 1200;
    return clamp(pct, (320 / w) * 100, 100 - (420 / w) * 100); // keep at least 320px for the problem and 420px for the editor
  };
  const dragSplit = (x: number) => {
    const r = gridRef.current?.getBoundingClientRect(); if (!r) return;
    setLeftPct(clampPct(((x - r.left) / r.width) * 100));
  };
  const [open, setOpen] = useState(1);
  const [timer, setTimer] = useState<number | null>(null);
  const [rand, setRand] = useState<string | null>(null);
  const tRef = useRef<ReturnType<typeof setInterval>>(undefined);
  useEffect(() => { setOpen(1); setRand(randomUnsolved(s)); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);
  useEffect(() => () => clearInterval(tRef.current), []);
  const st = s.ps[id] || "todo";
  const idx = PROBLEMS.indexOf(p); const prev = PROBLEMS[idx - 1], next = PROBLEMS[idx + 1];
  const steps: [string, React.ReactNode][] = [
    ["Problem", <ProblemStatement id={id} summary={p.s} fallbackExample={p.eg} />],
    ["Think for yourself", <><p className="muted">Before any hint: restate the problem in your own words, write one small example by hand, and describe the brute force. What is its complexity? Then try coding it in the editor.</p>
      <div className="row" style={{ marginTop: 10 }}><button className="btn sm" onClick={() => {
        clearInterval(tRef.current); let left = 600; setTimer(left);
        tRef.current = setInterval(() => { left--; setTimer(left); if (left <= 0) clearInterval(tRef.current); }, 1000);
      }}>Start 10-min timer</button>{timer !== null && <span className="mono" style={{ color: "var(--accent)" }}>{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}{timer <= 0 ? " · time's up, reveal Hint 1" : ""}</span>}</div></>],
    ["Hint 1", <p>{p.h[0]}</p>],
    ["Hint 2", <p>{p.h[1]}</p>],
    ["Approach", <><p>{p.a}</p><p className="muted" style={{ marginTop: 8 }}>Patterns: {p.pats.map((x, i) => <span key={x}>{i > 0 && ", "}<Link href={`/patterns#${x}`}>{PAT[x]?.name || x}</Link></span>)} · Topics: {p.topics.map((x, i) => <span key={x}>{i > 0 && ", "}<TopicLink slug={x} /></span>)}</p></>],
    ["Reference solution", <><div className="viz-cta"><span>Not sure why it works? Watch it run on the examples, line by line.</span><VisualizeButton id={id} /></div><CodeBlock sample={p.c} expected={(expected.samples as Record<string, string>)[`problem.${id}`]} /></>],
    ["Complexity", <div className="row"><span className="pill">Time <b className="cx" style={{ marginLeft: 4 }}>{p.tc}</b></span><span className="pill">Space <b className="cx" style={{ marginLeft: 4 }}>{p.sc}</b></span></div>],
    ["Follow-up questions", <ul className="clean">{p.f.map(x => <li key={x}><span>{x}</span></li>)}</ul>]
  ];
  return (
    <div className="stack">
      <div className="row"><Link href="/problems" className="faint" style={{ fontSize: 13 }}>← All problems</Link></div>
      <div className="row" style={{ gap: 6 }}>
        <span className={`pill ${p.d}`}>{DIFF[p.d]}</span>
        {p.pats.map(x => <Link key={x} className="pill" href={`/problems?pat=${x}`} style={{ textDecoration: "none" }}>{PAT[x]?.name || x}</Link>)}
        {p.topics.map(x => <Link key={x} className="pill B" href={`/learn/${x}`} style={{ textDecoration: "none" }}>{TOPIC[x]?.title || x}</Link>)}
      </div>
      <h1>{p.t}</h1>
      <div className="row faint" style={{ fontSize: 13 }}>Commonly asked at: {p.co.join(", ")}{p.lc && <> · <a href={`https://leetcode.com/problems/${p.lc}/`} target="_blank" rel="noopener noreferrer">Open on LeetCode ↗</a></>}</div>
      <div className="statusset" role="group" aria-label="Status">
        {STATUS_ORDER.map(k => <button key={k} className={"btn sm" + (st === k ? " on" : "")} onClick={() => { update(x => { if (k === "todo") delete x.ps[id]; else x.ps[id] = k; }, { activity: true }); toast(`Marked ${STATUS[k][1].toLowerCase()}`); }}>{STATUS[k][0]} {STATUS[k][1]}</button>)}
        <span style={{ flex: 1 }} />
        <button className="btn sm ghost" onClick={() => router.push(`/mistakes?problem=${id}`)}>+ Log a mistake</button>
      </div>
      <div className="solve-grid resizable" ref={gridRef} style={leftPct !== null ? ({ "--left": leftPct + "%" } as React.CSSProperties) : undefined}>
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
          <div className="card" style={{ marginTop: 6 }}>
            <h3 style={{ marginBottom: 4 }}>This problem trains {p.topics.length + p.pats.length} skills</h3>
            <p className="muted" style={{ fontSize: 13.5, marginBottom: 10 }}>Solving it counts as practice for every topic and pattern below.</p>
            <div className="row" style={{ gap: 6 }}>
              {p.topics.map(x => <Link key={x} className={"chip" + (s.done[x] ? " done" : "")} href={`/learn/${x}`}>{s.done[x] && <span className="ck">✓</span>}{TOPIC[x]?.title || x}</Link>)}
              {p.pats.map(x => <Link key={x} className="chip" href={`/patterns#${x}`}><span className="faint mono" style={{ fontSize: 10.5 }}>PATTERN</span>{PAT[x]?.name || x}</Link>)}
            </div>
          </div>
          {p.similar.length > 0 && <div className="card">
            <h3 style={{ marginBottom: 10 }}>Similar problems</h3>
            <div className="stack" style={{ gap: 8 }}>{p.similar.map(id => { const q = PROB[id]; if (!q) return null; const shared = q.pats.filter(x => p.pats.includes(x)).map(x => PAT[x]?.name); return (
              <div key={id} className="row" style={{ justifyContent: "space-between", gap: 8 }}>
                <span className="row" style={{ gap: 8 }}><span className={`pill ${q.d}`}>{DIFF[q.d]}</span><Link href={`/problems/${id}`}>{q.t}</Link>{s.ps[id] && <span className="faint mono" style={{ fontSize: 12 }}>{STATUS[s.ps[id]][0]}</span>}</span>
                <span className="faint" style={{ fontSize: 12 }}>{shared.length ? "shares " + shared.join(", ") : "related topics"}</span>
              </div>); })}</div>
          </div>}
        </div>
        <div className="split-gutter"><ResizeHandle dir="x" label="Resize problem and code panels" onMove={dragSplit} onStep={d => setLeftPct(clampPct((leftPct ?? DEFAULT_LEFT) + d * 2))} onReset={() => setLeftPct(null)} /></div>
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

/** Renders `inline code` inside statement text. */
function Rich({ text }: { text: string }) {
  return <>{text.split(/(`[^`]+`)/g).map((part, i) => part.startsWith("`") && part.endsWith("`") && part.length > 1 ? <code key={i}>{part.slice(1, -1)}</code> : part)}</>;
}

/** LeetCode-style statement: description, every visible example with an explanation, constraints. */
function ProblemStatement({ id, summary, fallbackExample }: { id: string; summary: string; fallbackExample: string }) {
  const st = STATEMENTS[id];
  const sp = JUDGE[id];
  const answers = expectedFor(id)?.cases || [];
  const cases = sp?.cases || [];
  return (
    <div className="pstmt">
      {(st?.body || [summary]).map((para, i) => <p key={i}><Rich text={para} /></p>)}
      {cases.length ? cases.map((args, i) => (
        <div key={i} className="pex">
          <div className="pex-h">Example {i + 1}</div>
          <pre className="pex-b"><b>Input:</b>{sp.design ? "\n" : " "}{showArgs(sp, args as unknown[]).split("\n").join(sp.design ? "\n" : ", ")}{"\n"}<b>Output:</b> {showVal(answers[i])}{st?.why?.[i] ? <>{"\n"}<b>Explanation:</b> {st.why[i]}</> : null}</pre>
        </div>
      )) : <pre className="cheat" style={{ marginTop: 10 }}>{fallbackExample}</pre>}
      {!!st?.walk?.length && cases.length > 0 && <>
        <div className="pex-h">Walkthrough of Example 1</div>
        <ol className="pwalk">{st.walk.map((w, i) => <li key={i}><Rich text={w} /></li>)}</ol>
      </>}
      {!!st?.cons?.length && <>
        <div className="pex-h">Constraints</div>
        <ul className="pcons">{st.cons.map((c, i) => <li key={i}><Rich text={c} /></li>)}</ul>
      </>}
    </div>
  );
}
