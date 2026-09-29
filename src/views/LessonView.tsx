"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LESSONS } from "@/content/lessons";
import { PATTERNS } from "@/content/roadmap";
import { PROBLEMS } from "@/content/problems";
import { TOPIC, PROB, LESSON_PATH, GROUP_LABEL, PRI } from "@/lib/data";
import { useStore, update, today, nextTopic } from "@/lib/store";
import expected from "@/generated/expected.json";
import CodeBlock from "@/components/CodeBlock";
import VisualExplanation from "@/components/VisualExplanation";
import RevisionModal from "@/components/RevisionModal";
import { Bullets, PriPill, ProblemRow, STATUS } from "@/components/ui";
import { toast } from "@/components/Toast";

const OUT = expected.samples as Record<string, string>;
const SECS: [string, string][] = [["what", "What is it?"], ["analogy", "Real-world analogy"], ["visual", "Visual explanation"], ["why", "Why do we need it?"], ["how", "How it works"], ["complexity", "Complexity"], ["code", "Basic code"], ["examples", "Examples"], ["patterns", "Pattern recognition"], ["mistakes", "Common mistakes"], ["interview", "Interview questions"], ["revision", "Quick revision"]];

function Sec({ n, children }: { n: number; children: React.ReactNode }) {
  const [id, title] = SECS[n - 1];
  return <section className="sec" id={id}><div className="sec-h"><span className="sec-n">{String(n).padStart(2, "0")}</span><h2>{title}</h2></div>{children}</section>;
}

function Actions({ slug }: { slug: string }) {
  const s = useStore();
  return (
    <button className={"btn " + (s.done[slug] ? "on" : "pri")} onClick={() => {
      update(x => { if (x.done[slug]) delete x.done[slug]; else x.done[slug] = today(); }, { activity: true });
      toast(s.done[slug] ? "Marked incomplete" : `${TOPIC[slug].title} completed`);
    }}>{s.done[slug] ? "✓ Completed" : "Mark as complete"}</button>
  );
}

function TopicStub({ slug }: { slug: string }) {
  const s = useStore(); const t = TOPIC[slug];
  const pats = PATTERNS.filter(p => p.topic === slug);
  const probs = PROBLEMS.filter(p => p.topic === slug || pats.some(x => x.id === p.pat));
  return (
    <div className="stack">
      <div className="row"><span className="eyebrow">Level {t.level}</span><PriPill p={t.pri} /><span className="pill" style={{ borderStyle: "dashed" }}>Outline</span></div>
      <h1>{t.title}</h1><p className="lead">{t.blurb}</p>
      {t.pre.length > 0 && <div className="depchain faint"><span>Learn first:</span>{t.pre.map(p => <Link key={p} className={"chip" + (s.done[p] ? " done" : "")} href={`/learn/${p}`}>{TOPIC[p].title}</Link>)}</div>}
      <div className="card"><h3 style={{ marginBottom: 6 }}>This lesson is an outline for now</h3>
        <p className="muted">It sits at <b>{PRI[t.pri][1]}</b> in your roadmap. {t.pre.length ? "Finish its prerequisites first; " : ""}the full lesson can be added as <code>src/content/lessons/{slug}.ts</code> using the same 12-section format as the other topics.</p>
        <div className="row" style={{ marginTop: 12 }}><Actions slug={slug} /><Link className="btn" href={`/learn/${nextTopic(s)}`}>Go to your next lesson →</Link></div></div>
      {pats.map(p => <div key={p.id} className="card stack"><div className="row"><span className="eyebrow">Pattern template</span><h3>{p.name}</h3></div><p className="muted">{p.idea}</p><div className="row">{p.signals.map(x => <span key={x} className="pill">{x}</span>)}</div><CodeBlock sample={p.tpl} run={false} title="Template" /></div>)}
      {probs.length > 0 && <><h2>Related practice problems</h2><div className="plist">{probs.map(p => <ProblemRow key={p.id} p={p} />)}</div></>}
    </div>
  );
}

export default function LessonView({ slug }: { slug: string }) {
  const s = useStore();
  const [rev, setRev] = useState(false);
  const t = TOPIC[slug], c = LESSONS[slug];
  useEffect(() => { update(x => { x.last = slug; }, { activity: true }); }, [slug]);
  useEffect(() => { const f = () => c && setRev(true); window.addEventListener("dojo:revision", f); return () => window.removeEventListener("dojo:revision", f); }, [c]);
  if (!c) return <TopicStub slug={slug} />;
  const eli = s.eli;
  const pi = LESSON_PATH.indexOf(slug);
  const prev = pi > 0 ? LESSON_PATH[pi - 1] : null, next = pi >= 0 && pi < LESSON_PATH.length - 1 ? LESSON_PATH[pi + 1] : null;
  const probs = PROBLEMS.filter(p => p.topic === slug);
  const beginner = <div className="eli"><div className="eyebrow">Explain like I&apos;m new</div><p style={{ fontSize: 16 }}>{c.eli5}</p></div>;
  const technical = <div className="prose"><p style={{ fontSize: 16 }}>{c.what}</p><p className="muted" style={{ marginTop: 10 }}>{c.tech}</p></div>;
  const toggle = (k: "fav" | "weak") => update(x => { if (x[k][slug]) delete x[k][slug]; else x[k][slug] = 1; });

  return (
    <div>
      <header className="t-head">
        <div className="row"><span className="eyebrow">Level {t.level} · {GROUP_LABEL[t.group]}</span><PriPill p={t.pri} />{s.done[slug] && <span className="pill E">✓ Completed</span>}</div>
        <h1>{t.title}</h1>
        <p className="lead">{t.blurb}</p>
        {t.pre.length > 0 && <div className="depchain faint"><span>Learn first:</span>{t.pre.map(p => <Link key={p} className={"chip" + (s.done[p] ? " done" : "")} href={`/learn/${p}`}>{s.done[p] && <span className="ck">✓</span>}{TOPIC[p].title}</Link>)}</div>}
        <div className="row">
          <Actions slug={slug} />
          <button className="btn" onClick={() => setRev(true)}>⚡ Quick revision</button>
          <button className={"btn " + (eli ? "on" : "")} title="Shortcut: E" onClick={() => update(x => { x.eli = !x.eli; })}>{eli ? "ELI5 mode: on" : "Explain like I'm new"}</button>
          <button className={"btn ghost " + (s.fav[slug] ? "on" : "")} onClick={() => toggle("fav")}>{s.fav[slug] ? "★ Favourite" : "☆ Favourite"}</button>
          <button className={"btn ghost " + (s.weak[slug] ? "on" : "")} onClick={() => toggle("weak")}>{s.weak[slug] ? "⚑ Marked weak" : "⚑ Mark weak"}</button>
        </div>
      </header>
      <nav className="t-toolbar" aria-label="Sections"><div className="toc">{SECS.map(([id, n], i) => <a key={id} href={`#${id}`}>{i + 1}. {n.replace("?", "")}</a>)}</div></nav>

      <Sec n={1}>{eli
        ? <div className="stack">{beginner}<details><summary className="muted" style={{ cursor: "pointer" }}>Show the technical explanation</summary><div style={{ marginTop: 10 }}>{technical}</div></details></div>
        : <div className="stack">{technical}{beginner}</div>}</Sec>
      <Sec n={2}><div className="card analogy"><span className="big">≈</span><div><h3 style={{ marginBottom: 4 }}>{c.analogy.short}</h3><p className="muted">{c.analogy.text}</p></div></div></Sec>
      <Sec n={3}><VisualExplanation kind={c.viz} /><p className="faint" style={{ fontSize: 13, marginTop: 8 }}>Change the inputs and run operations. Use ◀ ▶ to step through at your own pace.</p></Sec>
      <Sec n={4}>
        <div className="prose"><p style={{ fontSize: 15.5 }}>{c.why}</p></div>
        <div className="grid g2" style={{ marginTop: 14 }}>
          <div className="card"><h3 style={{ marginBottom: 10, color: "var(--good)" }}>Use it when</h3><Bullets items={c.use} cls="ok" /></div>
          <div className="card"><h3 style={{ marginBottom: 10, color: "var(--bad)" }}>Don&apos;t use it when</h3><Bullets items={c.avoid} cls="x" /></div>
        </div>
      </Sec>
      <Sec n={5}><div className="grid g2">
        <div className="card"><h3 style={{ marginBottom: 10 }}>Step by step</h3><div className="flow" style={{ fontSize: 14.5 }}>{c.how.map(x => <div key={x}><span style={{ paddingTop: 4 }}>{x}</span></div>)}</div></div>
        <div className="card"><h3 style={{ marginBottom: 10 }}>Important properties</h3><Bullets items={c.props} /></div>
      </div></Sec>
      <Sec n={6}>
        <div className="card tw" style={{ padding: "6px 8px" }}><table className="t"><thead><tr><th>{c.cxTitle ? "Class" : "Operation"}</th><th>{c.cxTitle ? "n = 10⁶" : "Time"}</th><th>Why</th></tr></thead>
          <tbody>{c.cx.map(r => <tr key={r[0]}><td style={{ fontWeight: 500 }}>{r[0]}</td><td className="cx">{r[1]}</td><td className="muted" style={{ fontSize: 14 }}>{r[2]}</td></tr>)}</tbody></table></div>
        <p className="muted" style={{ marginTop: 10, fontSize: 14 }}><b style={{ color: "var(--ink)" }}>Space:</b> {c.space}</p>
      </Sec>
      <Sec n={7}><div className="stack">
        <CodeBlock sample={c.code} expected={OUT[`lesson.${slug}.code`]} />
        <p className="faint" style={{ fontSize: 13 }}>Click any line to see what it does. Highlighted lines are the important ones.</p>
        {c.brute && <>
          <h3 style={{ marginTop: 8 }}>Brute force → optimized</h3>
          <div className="grid g2">
            <div className="stack"><div className="row"><b>{c.brute.title}</b><span className="pill H">{c.brute.time}</span></div><CodeBlock sample={c.brute} expected={OUT[`lesson.${slug}.brute`]} /></div>
            <div className="stack"><div className="row"><b>Optimized (above)</b><span className="pill E">{c.cx[0][1]}</span></div><p className="muted" style={{ fontSize: 14 }}>{c.how.slice(0, 3).join(" ")}</p></div>
          </div>
        </>}
        {c.js && <div className="card"><h3 style={{ marginBottom: 8 }}>JavaScript notes</h3><Bullets items={c.js} size={14} /></div>}
      </div></Sec>
      <Sec n={8}><div className="stack">{c.examples.map((ex, i) => (
        <article className="ex" key={ex.title}>
          <div className="ex-h"><span className={`pill ${["E", "M", "H"][i] || "H"}`}>Example {i + 1} · {ex.lvl === "Easy" ? "Very easy" : ex.lvl === "Practical" ? "Practical" : "Interview style"}</span><h3>{ex.title}</h3><span className="cx">T {ex.time} · S {ex.space}</span></div>
          <div className="ex-b"><p><b>Problem.</b> {ex.prob}</p><p className="muted"><b style={{ color: "var(--ink)" }}>Idea.</b> {ex.idea}</p><CodeBlock sample={ex} expected={OUT[`lesson.${slug}.ex.${i}`]} /></div>
        </article>))}</div></Sec>
      <Sec n={9}>
        <p className="muted" style={{ marginBottom: 12 }}>When the problem says this… think about this.</p>
        <div className="stack" style={{ gap: 8 }}>{c.signals.map(([clue, think]) => <div key={clue} className="signal"><span className="clue">{clue}</span><span className="arrow">→</span><span className="think">{think}</span></div>)}</div>
        <p style={{ marginTop: 12 }}><Link href="/which">Not sure? Use the pattern decision tree →</Link></p>
      </Sec>
      <Sec n={10}><div className="stack" style={{ gap: 10 }}>{c.mistakes.map(([w, r]) => <div key={w} className="mistake"><div><b>Mistake</b>{w}</div><div><b>Do this instead</b>{r}</div></div>)}</div></Sec>
      <Sec n={11}>
        <div className="grid g2">{Object.entries(c.iq).map(([lvl, arr]) => (
          <div className="card" key={lvl}>
            <div className="row" style={{ marginBottom: 10 }}><span className={`pill ${({ Beginner: "B", Easy: "E", Medium: "M", Hard: "H" } as Record<string, string>)[lvl]}`}>{lvl}</span></div>
            <ul className="clean" style={{ fontSize: 14.5 }}>{arr.map(q => PROB[q]
              ? <li key={q}><span style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><Link href={`/problems/${q}`}>{PROB[q].t}</Link>{s.ps[q] && <span className="faint mono" style={{ fontSize: 12 }}>{STATUS[s.ps[q]][0]} {STATUS[s.ps[q]][1]}</span>}</span></li>
              : <li key={q}><span>{q}</span></li>)}</ul>
          </div>))}</div>
        {probs.length > 0 && <><h3 style={{ margin: "18px 0 10px" }}>Practice problems in this topic ({probs.length})</h3><div className="plist">{probs.map(p => <ProblemRow key={p.id} p={p} />)}</div></>}
      </Sec>
      <Sec n={12}><div className="revgrid">
        <pre className="cheat">{c.cheat}</pre>
        <div className="stack">
          <div className="card"><h3 style={{ marginBottom: 6 }}>30-second summary</h3><p className="muted">{c.rev.s30}</p></div>
          <button className="btn pri" onClick={() => setRev(true)}>⚡ Open 30s / 2m / 10m revision</button>
          <div className="card"><h3 style={{ marginBottom: 8 }}>Can you answer these?</h3><Bullets size={13.5} items={["What is it?", "Why does it exist?", "When should I use it, and when not?", "How do I recognize it in a problem?", "Brute force vs optimized?", "What's the complexity, and why?", "What are the common mistakes?"]} /></div>
        </div>
      </div></Sec>
      <nav className="row" style={{ justifyContent: "space-between", borderTop: "1px solid var(--line)", paddingTop: 18 }}>
        {prev ? <Link className="btn" href={`/learn/${prev}`}>← {TOPIC[prev].title}</Link> : <span />}
        <Actions slug={slug} />
        {next ? <Link className="btn" href={`/learn/${next}`}>{TOPIC[next].title} →</Link> : <span />}
      </nav>
      {rev && <RevisionModal slug={slug} onClose={() => setRev(false)} />}
    </div>
  );
}
