"use client";
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { highlightLines } from "@/lib/highlight";
import type { Ev, Mode, PatternViz, Step, VarVal } from "./types";

/** Renders **bold** and `code` in explanations without using innerHTML. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return <>{parts.map((p, i) => p.startsWith("**") && p.endsWith("**") && p.length > 4 ? <b key={i}>{p.slice(2, -2)}</b> : p.startsWith("`") && p.endsWith("`") && p.length > 2 ? <code key={i}>{p.slice(1, -1)}</code> : <Fragment key={i}>{p}</Fragment>)}</>;
}

/** Strips `//#tag` markers from the code and remembers which line each tag is on. */
function parseCode(code: string) {
  const tags: Record<string, number> = {};
  const clean = code.replace(/\n$/, "").split("\n").map((line, i) => {
    const m = line.match(/\s*\/\/#([\w-]+)\s*$/);
    if (m) { tags[m[1]] = i; return line.slice(0, m.index); }
    return line;
  });
  return { lines: highlightLines(clean.join("\n")), tags };
}

const fmt = (v: VarVal) => v === null || v === undefined ? "–" : String(v);
const SPEEDS: [string, number][] = [["0.5×", 2200], ["1×", 1250], ["2×", 650], ["4×", 320]];
const evs = (s: Step<unknown>): Ev[] => Array.isArray(s.ev) ? s.ev : [s.ev];

type Prefs = { explain: "beginner" | "interview"; predict: boolean; speed: number };
const PREFS_KEY = "dsa-dojo-viz";
function readPrefs(): Prefs {
  const d: Prefs = { explain: "beginner", predict: false, speed: 1250 };
  try { const p = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}"); return { explain: p.explain === "interview" ? "interview" : "beginner", predict: p.predict === true, speed: SPEEDS.some(([, ms]) => ms === p.speed) ? p.speed : d.speed }; } catch { return d; }
}
function savePrefs(p: Prefs) { try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch { /* storage unavailable: preferences just aren't remembered */ } }

export default function Player({ viz, initialMode = 0 }: { viz: PatternViz; initialMode?: number }) {
  const [mi, setMi] = useState(initialMode);
  const mode = viz.modes[mi] as Mode<unknown>;
  const [vals, setVals] = useState<Record<string, string>>(mode.presets[0].values);
  const [steps, setSteps] = useState<Step<unknown>[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ explain: "beginner", predict: false, speed: 1250 });
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const root = useRef<HTMLDivElement>(null), codeRef = useRef<HTMLDivElement>(null), seen = useRef(false);
  const reduced = useRef(false);

  useEffect(() => { setPrefs(readPrefs()); reduced.current = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches; }, []);
  const setPref = (p: Partial<Prefs>) => setPrefs(cur => { const n = { ...cur, ...p }; savePrefs(n); return n; });

  const load = useCallback((m: Mode<unknown>, v: Record<string, string>, autoplay: boolean) => {
    try { const st = m.run(v); if (!st.length) throw new Error("Nothing to show for this input."); setSteps(st); setErr(null); setI(0); setAnswers({}); setPlaying(autoplay && st.length > 1 && !reduced.current); }
    catch (e) { setErr((e as Error).message); setSteps([]); setPlaying(false); }
  }, []);
  useEffect(() => { load(mode, vals, false); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Start playing the first time the visualizer scrolls into view, unless the user prefers less motion.
  useEffect(() => {
    const el = root.current; if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting && !seen.current) { seen.current = true; io.disconnect(); if (!reduced.current) setPlaying(true); } }, { threshold: 0.5 });
    io.observe(el); return () => io.disconnect();
  }, []);

  const step = steps[i];
  const locked = !!(prefs.predict && step?.quiz && answers[i] === undefined);

  // One timer at a time, derived from (playing, i, speed): changing any of them cancels the old timer, so rapid clicks can't stack.
  useEffect(() => {
    if (!playing) return;
    if (locked || i >= steps.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setI(x => Math.min(x + 1, steps.length - 1)), prefs.speed);
    return () => clearTimeout(t);
  }, [playing, i, steps.length, prefs.speed, locked]);

  const code = useMemo(() => parseCode(mode.code), [mode.code]);
  const counts = useMemo(() => {
    const out: number[][] = []; const acc = mode.counters.map(() => 0);
    for (const s of steps) { const e = evs(s); mode.counters.forEach(([, list], k) => { acc[k] += e.filter(x => list.includes(x)).length; }); out.push([...acc]); }
    return out;
  }, [steps, mode.counters]);
  const prev = i > 0 ? steps[i - 1] : undefined;
  const onLines = (step?.at ? (Array.isArray(step.at) ? step.at : [step.at]) : []).map(t => code.tags[t]).filter((n): n is number => n !== undefined);
  const on = new Set(onLines), evalLine = onLines[0];

  useEffect(() => {
    const box = codeRef.current, ln = box?.querySelector<HTMLElement>(".l.on"); if (!box || !ln) return;
    const top = ln.offsetTop;
    if (top < box.scrollTop + 16 || top > box.scrollTop + box.clientHeight - 36) box.scrollTo({ top: Math.max(0, top - box.clientHeight / 3), behavior: reduced.current ? "auto" : "smooth" });
  }, [i, mi]);

  const go = (n: number) => { setPlaying(false); setI(Math.max(0, Math.min(steps.length - 1, n))); };
  const toggle = () => { if (playing) setPlaying(false); else { if (i >= steps.length - 1) { setI(0); setAnswers({}); } setPlaying(true); } };
  const reset = () => { setPlaying(false); setI(0); setAnswers({}); };
  const pickMode = (k: number) => { const m = viz.modes[k] as Mode<unknown>; setMi(k); setVals(m.presets[0].values); load(m, m.presets[0].values, true); };
  const onKey = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest("input,select,textarea,button")) return;
    const k = e.key;
    if (k === "ArrowRight") go(i + 1); else if (k === "ArrowLeft") go(i - 1);
    else if (k === " " || k === "k") toggle(); else if (k === "Home") go(0); else if (k === "End") go(steps.length - 1);
    else if (k === "r") reset(); else return;
    e.preventDefault();
  };
  const View = mode.View;
  const pct = steps.length > 1 ? (i / (steps.length - 1)) * 100 : 100;
  const presetOn = mode.presets.findIndex(p => Object.keys(p.values).every(k => p.values[k] === vals[k]));
  const dec = step?.decision, ans = answers[i], quiz = step?.quiz;
  const interview = prefs.explain === "interview";

  return (
    <div className="pv" ref={root} tabIndex={0} onKeyDown={onKey} aria-label={`${viz.title} visualizer. Arrow keys step, Space plays or pauses, R resets.`}>
      <div className="pv-head">
        <div className="pv-title"><b>{viz.title}</b><span>{mode.task}</span></div>
        {viz.modes.length > 1 && <div className="pv-modes" role="tablist" aria-label="Scenario">{viz.modes.map((m, k) => <button key={m.id} role="tab" aria-selected={k === mi} className={k === mi ? "on" : ""} onClick={() => pickMode(k)}>{m.label}</button>)}</div>}
      </div>
      <form className="pv-inputs" onSubmit={e => { e.preventDefault(); load(mode, vals, true); }}>
        {mode.fields.map(f => <label key={f.key} className="pv-field"><span>{f.label}</span><input className={f.wide ? "w" : ""} value={vals[f.key] ?? ""} placeholder={f.placeholder} spellCheck={false} autoComplete="off" onChange={e => setVals(v => ({ ...v, [f.key]: e.target.value }))} /></label>)}
        {mode.fields.length > 0 && <button className="btn sm pri" type="submit">Visualize</button>}
        {mode.presets.length > (mode.fields.length ? 1 : 0) && <span className={"pv-presets" + (mode.fields.length ? "" : " solo")}><span className="faint">{mode.fields.length ? "Try" : "Run on"}</span>{mode.presets.map((p, k) => <button type="button" key={p.label} className={"pv-chip" + (k === presetOn ? " on" : "")} onClick={() => { setVals(p.values); load(mode, p.values, true); }}>{p.label}</button>)}</span>}
      </form>
      <div className="pv-body">
        <div className="pv-main">
          <div className="pv-stage">
            {err ? <div className="pv-err" role="alert">{err}</div> : step ? <>
              <div className="pv-dec-slot">{dec && <DecisionCard d={dec} hide={locked} />}</div>
              <Fit><View s={step.s} /></Fit>
            </> : null}
          </div>
          {mode.legend && !err && <div className="pv-legend" aria-label="Legend">{mode.legend.map(([t, l]) => <span key={l}><i className={"sw t-" + t} />{l}</span>)}</div>}
        </div>
        <aside className="pv-side" aria-label="Code and state">
          <div className="pv-side-h"><span>Code</span><span className="faint">synced to the step</span></div>
          <div className="pv-code" ref={codeRef}>{code.lines.map((h, n) => <div key={n} className={"l" + (on.has(n) ? " on" : "")}><span className="n">{n + 1}</span><span className="c" dangerouslySetInnerHTML={{ __html: h || " " }} />{n === evalLine && step?.eval !== undefined && !locked && <em className={"pv-eval " + (step.eval ? "t" : "f")}>{step.eval ? "true" : "false"}</em>}</div>)}</div>
          <div className="pv-side-h"><span>State</span><span className="faint">changed values glow</span></div>
          <div className="pv-vars">{step?.inspect.map(([k, v]) => { const pv = prev?.inspect.find(([pk]) => pk === k); const chg = !!prev && (!pv || fmt(pv[1]) !== fmt(v)); return <Fragment key={k}><span>{k}</span><b key={k + fmt(v) + i} className={chg ? "chg" : ""}>{fmt(v)}</b></Fragment>; })}</div>
        </aside>
      </div>
      <div className={"pv-explain" + (step?.tone && !locked ? " " + step.tone : "")} aria-live="polite">
        <div className="pv-explain-h">
          <span className="pv-stepn">{err ? "!" : `Step ${i + 1} / ${steps.length || 1}`}</span>
          <div className="pv-toggle" role="group" aria-label="Explanation style">
            <button className={!interview ? "on" : ""} onClick={() => setPref({ explain: "beginner" })}>Beginner</button>
            <button className={interview ? "on" : ""} onClick={() => setPref({ explain: "interview" })}>Interview</button>
          </div>
          <label className="pv-check"><input type="checkbox" checked={prefs.predict} onChange={e => { setPref({ predict: e.target.checked }); setAnswers({}); }} />Predict next step</label>
        </div>
        {err ? <p className="pv-x">Fix the input above and press Visualize.</p> : step && (locked || (quiz && prefs.predict && ans !== undefined)) ? <QuizBox quiz={quiz!} what={step.what} chosen={ans} onPick={k => setAnswers(a => ({ ...a, [i]: k }))} onContinue={() => { if (i < steps.length - 1) { setI(i + 1); setPlaying(true); } }} />
          : step && (interview
            ? <p className="pv-x pv-brief"><Rich text={step.brief} /></p>
            : <div className="pv-wwn">
                <div><span>What</span><p><Rich text={step.what} /></p></div>
                {step.why && <div><span>Why</span><p><Rich text={step.why} /></p></div>}
                {step.next && <div><span>Next</span><p><Rich text={step.next} /></p></div>}
              </div>)}
      </div>
      {!err && <div className="pv-insights">
        {mode.counters.map(([l], k) => <span key={l} className="pv-count"><b key={l + (counts[i]?.[k] ?? 0)} className={prev && counts[i - 1]?.[k] !== counts[i]?.[k] ? "chg" : ""}>{counts[i]?.[k] ?? 0}</b>{l}</span>)}
        <span className="pv-cx" tabIndex={0}><b>Time {mode.complexity.time}</b><b>Space {mode.complexity.space}</b><span className="pv-cx-why">{mode.complexity.why}</span></span>
      </div>}
      <div className="pv-ctrl">
        <button className="pv-ib" onClick={reset} aria-label="Reset" title="Reset (R)">↺</button>
        <button className="pv-ib" onClick={() => go(0)} aria-label="Jump to start" title="Start (Home)" disabled={i === 0}>⏮</button>
        <button className="pv-ib" onClick={() => go(i - 1)} aria-label="Previous step" title="Previous (←)" disabled={i === 0}>◀</button>
        <button className="pv-play" onClick={toggle} aria-label={playing ? "Pause" : "Play"} title="Play / pause (Space)" disabled={!steps.length}>{playing ? "❚❚" : "▶"}</button>
        <button className="pv-ib" onClick={() => go(i + 1)} aria-label="Next step" title="Next (→)" disabled={i >= steps.length - 1}>▶</button>
        <button className="pv-ib" onClick={() => go(steps.length - 1)} aria-label="Jump to end" title="End (End)" disabled={i >= steps.length - 1}>⏭</button>
        <input className="pv-scrub" type="range" min={0} max={Math.max(0, steps.length - 1)} value={i} onChange={e => go(+e.target.value)} aria-label="Timeline" aria-valuetext={`Step ${i + 1} of ${steps.length}`} style={{ "--p": pct + "%" } as React.CSSProperties} />
        <div className="pv-speed" role="group" aria-label="Speed">{SPEEDS.map(([l, ms]) => <button key={l} aria-pressed={prefs.speed === ms} className={prefs.speed === ms ? "on" : ""} onClick={() => setPref({ speed: ms })}>{l}</button>)}</div>
      </div>
    </div>
  );
}

/** Scales the scene down (never up) so it fits narrow screens; below 55% it scrolls instead. */
function Fit({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null), inner = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1), [h, setH] = useState<number | undefined>(undefined);
  useLayoutEffect(() => {
    const o = outer.current, n = inner.current; if (!o || !n) return;
    const measure = () => {
      const need = n.scrollWidth, have = o.clientWidth;
      const next = need > have && have > 0 ? Math.max(0.55, have / need) : 1;
      setK(next); setH(next < 1 ? n.scrollHeight * next : undefined);
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(o); ro.observe(n);
    return () => ro.disconnect();
  }, []);
  return <div ref={outer} className="pv-fit" style={{ height: h }}><div ref={inner} className="pv-fit-in" style={k < 1 ? { transform: `scale(${k})` } : undefined}>{children}</div></div>;
}

function DecisionCard({ d, hide }: { d: NonNullable<Step<unknown>["decision"]>; hide: boolean }) {
  return (
    <div className={"pv-dec " + (hide ? "q" : d.result ? "t" : "f")} key={d.cond + d.values}>
      <span className="pv-dec-k">if</span>
      <code className="pv-dec-c">{d.cond}</code>
      <span className="pv-dec-v">{d.values}</span>
      <span className="pv-dec-r">{hide ? "?" : d.result ? "✓ true" : "✗ false"}</span>
      <span className="pv-dec-a">→ {hide ? "your call" : d.action}</span>
    </div>
  );
}

function QuizBox({ quiz, what, chosen, onPick, onContinue }: { quiz: NonNullable<Step<unknown>["quiz"]>; what: string; chosen?: number; onPick: (k: number) => void; onContinue: () => void }) {
  const done = chosen !== undefined, right = chosen === quiz.answer;
  return (
    <div className="pv-quiz">
      <p className="pv-x"><Rich text={what} /></p>
      <p className="pv-quiz-q"><b>Predict:</b> <Rich text={quiz.q} /></p>
      <div className="pv-quiz-o">{quiz.options.map((o, k) => <button key={k} disabled={done} onClick={() => onPick(k)} className={done ? (k === quiz.answer ? "ok" : k === chosen ? "bad" : "") : ""}><i>{String.fromCharCode(65 + k)}</i><Rich text={o} />{done && k === quiz.answer && <em>✓ correct</em>}{done && k === chosen && !right && <em>✗ your pick</em>}</button>)}</div>
      {done && <div className={"pv-quiz-f " + (right ? "ok" : "bad")}><b>{right ? "Correct." : "Not quite."}</b> <Rich text={quiz.why} /> <button className="btn sm pri" onClick={onContinue}>Continue ▶</button></div>}
    </div>
  );
}
