"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore, stats, nextTopic, continueTopic, randomUnsolved } from "@/lib/store";
import { TOPIC, FLASHCARDS } from "@/lib/data";
import { TOPICS } from "@/content/roadmap";
import { PROBLEMS } from "@/content/problems";
import { PathChain, Levels } from "@/components/ui";

export default function HomeView() {
  const s = useStore();
  const st = stats(s), nt = nextTopic(s), cont = continueTopic(s);
  const [rand, setRand] = useState("two-sum");
  useEffect(() => setRand(randomUnsolved(s)), [s]);
  const barLen = 22, filled = Math.round((st.pct / 100) * barLen);
  const tools: [string, string, string][] = [
    ["/which", "Which pattern do I use?", "Answer 2–3 questions and get the pattern, with templates."],
    ["/framework", "How to solve any problem", "The 10-step method interviewers want to see, with worked examples."],
    [`/problems/${rand}`, "Interview mode", "A random unsolved problem: code it in the editor, hints one at a time."],
    ["/playground", "Code playground", "Run JavaScript in your browser; Python, Java, C++ and Go via the server."],
    ["/flashcards", "Flashcards", `${FLASHCARDS.length} cards: complexities, patterns, JS traps.`],
    ["/mistakes", "Mistake notebook", "Write down what went wrong so it never happens twice."]
  ];
  return (
    <>
      <section className="hero">
        <div className="stack">
          <span className="eyebrow">Your DSA dojo</span>
          <h1>Master DSA,<br /><em>one pattern</em> at a time.</h1>
          <p className="lead">From zero to interview-ready with simple explanations, step-by-step visualizations, patterns, and hands-on problems you can code and test right here.</p>
          <div className="row">
            <Link className="btn pri" href={`/learn/${cont}`}>Continue: {TOPIC[cont].title} →</Link>
            <Link className="btn" href="/roadmap">See the roadmap</Link>
            <Link className="btn ghost" href="/which">Which pattern?</Link>
          </div>
        </div>
        <div className="term" aria-label="Progress summary"><span className="c">{"// DSA Progress"}</span>{"\n"}<span className="a">{"█".repeat(filled)}</span><span style={{ color: "#3a4152" }}>{"░".repeat(barLen - filled)}</span> <b>{st.pct}%</b>{"\n\n"}Topics completed : <span className="g">{st.topicsDone}</span> / {TOPICS.length}{"\n"}Problems solved  : <span className="g">{st.solved}</span> / {PROBLEMS.length}{"\n"}Current streak   : <span className="g">{st.streak}</span> day{st.streak === 1 ? "" : "s"}{"\n"}Next up          : <span className="a">{TOPIC[nt].title}</span></div>
      </section>
      <section className="grid g4" style={{ marginBottom: 26 }}>
        <div className="card stat"><span className="l">Your progress</span><span className="v">{st.pct}%</span><div className="bar"><i style={{ width: `${st.pct}%` }} /></div></div>
        <Link className="card stat link" href={`/learn/${cont}`} style={{ color: "inherit", textDecoration: "none" }}><span className="l">Continue learning</span><span className="v" style={{ fontSize: 20, lineHeight: 1.25 }}>→ {TOPIC[cont].title}</span><span className="faint" style={{ fontSize: 12.5 }}>{s.last ? "Last studied: " + (TOPIC[s.last]?.title || "") : "Start here"}</span></Link>
        <div className="card stat"><span className="l">Current streak</span><span className="v">{st.streak} <small style={{ fontSize: 14, color: "var(--faint)" }}>days</small></span><span className="faint" style={{ fontSize: 12.5 }}>Study or solve something daily</span></div>
        <Link className="card stat link" href="/problems" style={{ color: "inherit", textDecoration: "none" }}><span className="l">Problems solved</span><span className="v">{st.solved}</span><span className="faint" style={{ fontSize: 12.5 }}>E {st.byD.E[0]} · M {st.byD.M[0]} · H {st.byD.H[0]}</span></Link>
        <Link className="card stat link" href="/progress" style={{ color: "inherit", textDecoration: "none" }}><span className="l">Topics mastered</span><span className="v">{st.topicsDone}</span><span className="faint" style={{ fontSize: 12.5 }}>of {TOPICS.length} on the roadmap</span></Link>
      </section>
      <section className="stack" style={{ marginBottom: 28 }}>
        <div className="row" style={{ justifyContent: "space-between" }}><h2>Recommended learning path</h2><span className="faint" style={{ fontSize: 13 }}>Each topic builds on the one before it</span></div>
        <PathChain here={cont} />
      </section>
      <section className="stack" style={{ marginBottom: 28 }}>
        <div className="row" style={{ justifyContent: "space-between" }}><h2>Learning roadmap</h2><Link href="/roadmap" className="btn sm">Open full roadmap</Link></div>
        <Levels />
      </section>
      <section className="stack">
        <h2>Tools</h2>
        <div className="grid g3">
          {tools.map(([h, t, d]) => <Link key={t} className="card link" href={h} style={{ color: "inherit", textDecoration: "none" }}><h3>{t}</h3><p className="muted" style={{ fontSize: 14, marginTop: 6 }}>{d}</p></Link>)}
        </div>
      </section>
    </>
  );
}
