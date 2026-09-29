"use client";
import Link from "next/link";
import { useEffect } from "react";
import { PATTERNS, CLUES } from "@/content/roadmap";
import { PROBLEMS } from "@/content/problems";
import { LESSONS } from "@/content/lessons";
import { PAT, TOPIC } from "@/lib/data";
import CodeBlock from "@/components/CodeBlock";

export function ClueGrid() {
  return <div className="grid g2" style={{ gap: 8 }}>{CLUES.map(([c, p]) => <Link key={c} className="signal" href={`/patterns#${p}`} style={{ textDecoration: "none", color: "inherit" }}><span className="clue">&quot;{c}&quot;</span><span className="arrow">→</span><span className="think">{PAT[p].name}</span></Link>)}</div>;
}
export default function PatternsView() {
  useEffect(() => { const h = location.hash.slice(1); if (h) setTimeout(() => document.getElementById(h)?.scrollIntoView({ block: "start" }), 60); }, []);
  return (
    <div className="stack">
      <span className="eyebrow">Interview patterns</span><h1>{PATTERNS.length} patterns that cover most interviews</h1>
      <p className="lead">Most interview problems are a known pattern in disguise. Learn the clues, then the template.</p>
      <div className="row"><Link className="btn pri" href="/which">Open the decision tree →</Link></div>
      <h2 style={{ marginTop: 6 }}>Quick clue lookup</h2>
      <ClueGrid />
      <h2 style={{ marginTop: 10 }}>All patterns</h2>
      <div className="grid g2">{PATTERNS.map(p => {
        const n = PROBLEMS.filter(x => x.pat === p.id);
        return (
          <article key={p.id} className="card stack" id={p.id} style={{ scrollMarginTop: 70, gap: 10 }}>
            <div className="row" style={{ justifyContent: "space-between" }}><h3>{p.name}</h3>{TOPIC[p.topic] && <Link href={`/learn/${p.topic}`} style={{ fontSize: 13 }}>{LESSONS[p.topic] ? "Full lesson" : "Topic outline"} →</Link>}</div>
            <p className="muted" style={{ fontSize: 14.5 }}>{p.idea}</p>
            <div className="row" style={{ gap: 6 }}>{p.signals.map(s => <span key={s} className="pill">{s}</span>)}</div>
            <CodeBlock sample={p.tpl} run={false} title="Template" />
            {n.length > 0 && <div style={{ fontSize: 13.5 }}><span className="faint">Practice:</span> {n.map((x, i) => <span key={x.id}>{i > 0 && ", "}<Link href={`/problems/${x.id}`}>{x.t}</Link></span>)}</div>}
          </article>);
      })}</div>
    </div>
  );
}
