"use client";
import Link from "next/link";
import { useState } from "react";
import { DTREE } from "@/content/roadmap";
import { PROBLEMS } from "@/content/problems";
import { PAT, TOPIC } from "@/lib/data";
import CodeBlock from "@/components/CodeBlock";
import { ClueGrid } from "./PatternsView";

export default function WhichView() {
  const [node, setNode] = useState("start");
  const [trail, setTrail] = useState<string[]>([]);
  const restart = () => { setNode("start"); setTrail([]); };
  const p = node.startsWith("@") ? PAT[node.slice(1)] : null;
  const n = p ? null : DTREE[node];
  return (
    <div className="stack">
      <span className="eyebrow">Pattern finder</span><h1>How do I know which DSA pattern to use?</h1>
      <p className="lead">Answer a few questions about the problem. Each answer narrows it down, like a real interview thought process.</p>
      <div className="dt">
        {trail.length > 0 && <div className="dt-trail"><span>Your answers:</span>{trail.map((t, i) => <span key={i} style={{ display: "contents" }}>{i > 0 && <span>→</span>}<span className="pill">{t}</span></span>)}<button className="btn sm ghost" onClick={restart}>Start over</button></div>}
        {p ? (
          <div className="dt-res"><span className="eyebrow">Try this pattern</span><h2 style={{ margin: "4px 0 8px" }}>{p.name}</h2><p>{p.idea}</p>
            <div className="row" style={{ margin: "10px 0" }}>{p.signals.map(x => <span key={x} className="pill">{x}</span>)}</div>
            <CodeBlock sample={p.tpl} run={false} title="Template" />
            <div className="row" style={{ marginTop: 12 }}>{TOPIC[p.topic] && <Link className="btn pri" href={`/learn/${p.topic}`}>Learn {TOPIC[p.topic].title} →</Link>}{PROBLEMS.filter(x => x.pat === p.id).slice(0, 3).map(x => <Link key={x.id} className="btn" href={`/problems/${x.id}`}>{x.t}</Link>)}<button className="btn ghost" onClick={restart}>Start over</button></div>
          </div>
        ) : n && (
          <div className="dt-q"><span className="eyebrow">Question {trail.length + 1}</span><h2 style={{ marginTop: 4 }}>{n.q}</h2>
            <div className="dt-opts">{n.o.map(([l, to]) => <button key={l} className="btn" onClick={() => { setTrail([...trail, l]); setNode(to); }}>{l}</button>)}</div></div>
        )}
      </div>
      <h2 style={{ marginTop: 14 }}>The same thinking as a diagram</h2>
      <pre className="cheat">{`What does the problem ask?
        ↓
Array / String?
        ↓
Is it contiguous?
   ↙          ↘
 YES           NO
  ↓             ↓
Sliding       Sorted?  → YES → Two Pointers / Binary Search
Window                  → NO  → Hashing

All combinations?            → Backtracking
Next greater / smaller?      → Monotonic Stack
Top K?                       → Heap
Overlapping subproblems?     → Dynamic Programming
Shortest path (unweighted)?  → BFS`}</pre>
      <h2 style={{ marginTop: 14 }}>Keyword clues</h2>
      <ClueGrid />
    </div>
  );
}
