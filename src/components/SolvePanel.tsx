"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "./Editor";
import { JUDGE } from "@/content/judge";
import { STARTERS, JUDGE_LANGS } from "@/lib/drivers";
import { LANG, type LangId } from "@/lib/languages";
import { runJudge, verdictOf, expectedFor, type JudgeResult, type CaseResult } from "@/lib/runner";
import { useStore, update, today, getState } from "@/lib/store";
import type { JudgeSpec } from "@/lib/types";
import { toast } from "./Toast";

const showVal = (v: unknown): string => {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const o = v as Record<string, unknown>;
    if (o.__undef) return "undefined"; if (o.__str) return String(o.__str); if (o.__hash) return "(large output, checked by fingerprint)"; if (o.__map) return "Map " + JSON.stringify(o.__map);
  }
  const s = JSON.stringify(v); return s === undefined ? "undefined" : s.length > 400 ? s.slice(0, 400) + `… (${s.length} chars)` : s;
};
const showArgs = (sp: JudgeSpec, args: unknown[]) => sp.design
  ? `${JSON.stringify(args[0])}\n${JSON.stringify(args[1])}`
  : sp.params.map(([n, t], i) => t === "cycle" ? `head = ${JSON.stringify((args[i] as unknown[])[0])}, pos = ${(args[i] as unknown[])[1]}` : `${n} = ${JSON.stringify(args[i])}`).join("\n");

let serverCheck: Promise<boolean> | null = null;
const serverConfigured = () => (serverCheck = serverCheck || fetch("/api/execute").then(r => r.json()).then(d => !!d.configured).catch(() => false));

export default function SolvePanel({ id }: { id: string }) {
  const sp = JUDGE[id];
  const s = useStore();
  const lang: LangId = JUDGE_LANGS.includes(s.lang) ? s.lang : "javascript";
  const key = `${id}:${lang}`;
  const starter = useMemo(() => STARTERS[lang]!(sp), [lang, sp]);
  const [code, setCode] = useState<string>(starter);
  const [tab, setTab] = useState<"cases" | "result" | "console">("cases");
  const [caseIdx, setCaseIdx] = useState(0);
  const [customOn, setCustomOn] = useState(false);
  const [customText, setCustomText] = useState(() => sp.design ? showArgs(sp, sp.cases[0]) : sp.params.map((_, i) => JSON.stringify(sp.cases[0][i])).join("\n"));
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [resIdx, setResIdx] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [server, setServer] = useState<boolean | null>(null);
  const saveT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const panelRef = useRef<HTMLElement>(null);

  // load saved draft when problem or language changes
  useEffect(() => { setCode(getState().code[key] ?? starter); setResult(null); setTab("cases"); }, [key, starter]);
  useEffect(() => { if (LANG[lang].runtime === "server") serverConfigured().then(setServer); }, [lang]);

  const onChange = (v: string) => {
    setCode(v);
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => update(x => { x.code[key] = v; }), 400);
  };
  const judge = async (mode: "run" | "submit") => {
    if (running) return;
    let custom: unknown[] | null = null;
    if (mode === "run" && customOn) {
      try {
        const lines = customText.split("\n").map(l => l.trim()).filter(Boolean);
        const need = sp.design ? 2 : sp.params.length;
        if (lines.length !== need) throw new Error(`Expected ${need} line${need > 1 ? "s" : ""}, got ${lines.length}.`);
        custom = lines.map(l => JSON.parse(l));
      } catch (e) { setResult({ mode, lang, cases: [], results: [], logs: [], compile: "Custom input is not valid JSON: " + (e as Error).message }); setTab("result"); return; }
    }
    update(x => { x.code[key] = code; }, { activity: true });
    setRunning(true); setTab("result"); setResIdx(null);
    const r = await runJudge(id, lang, mode, code, custom);
    setRunning(false); setResult(r);
    requestAnimationFrame(() => panelRef.current?.querySelector(".solve-bottom")?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
    if (mode === "submit" && !r.serverError) {
      const [v, cls] = verdictOf(r);
      update(x => {
        x.subs[id] = { verdict: v, ok: cls === "good", date: today(), lang };
        const cur = x.ps[id];
        if (cls === "good" && cur !== "solved" && cur !== "revise") x.ps[id] = "solved";
        if (cls !== "good" && !cur) x.ps[id] = "attempted";
      }, { activity: true });
      toast(cls === "good" ? "Accepted! Marked as solved" : v);
    }
  };
  const sub = s.subs[id];
  const hasGen = sp.hidden.some(h => (h as { gen?: string }).gen);

  function resultView(r: JudgeResult) {
    const [v, cls] = verdictOf(r);
    if (r.serverError) return <><div className="verdict bad"><b>{v}</b></div><pre className="io-box err">{r.serverError}</pre></>;
    const passed = r.results.filter(x => x.pass).length, total = r.cases.length;
    const maxMs = r.results.reduce((a, x) => Math.max(a, x.ms || 0), 0);
    if (r.compile) return <><div className="verdict bad"><b>{v}</b></div><pre className="io-box err">{r.compile}</pre><p style={{ fontSize: 12.5, marginTop: 6, color: "#8a92a8" }}>Check for typos, missing brackets, or a renamed function.</p></>;
    const failIdx = r.results.findIndex(x => x.pass === false || x.error || x.tle);
    const customI = r.cases.findIndex(cc => cc.custom);
    const showI = resIdx ?? (failIdx >= 0 ? r.results[failIdx].i : customI >= 0 ? customI : 0);
    const x: CaseResult | undefined = r.results.find(y => y.i === showI) || r.results[0];
    const c = x ? r.cases[x.i] : null;
    return (
      <>
        <div className={`verdict ${cls}`}><b>{v}</b><span>{passed} / {total} tests passed{r.results.length ? ` · slowest ${maxMs < 1 ? "<1" : Math.round(maxMs)} ms` : ""}</span></div>
        <div className="row" style={{ gap: 6, marginBottom: 10 }}>
          {r.cases.map((cc, i) => {
            const y = r.results.find(z => z.i === i);
            const st = !y ? "skip" : y.tle || y.error ? "bad" : y.pass === null ? "neutral" : y.pass ? "ok" : "bad";
            return <button key={i} className={`tchip ${st}${showI === i ? " on" : ""}`} disabled={!y} onClick={() => setResIdx(i)} title={cc.label}>
              {st === "ok" ? "✓" : st === "bad" ? "✕" : st === "skip" ? "·" : "?"} {cc.hidden ? (cc.big ? "Large" : "H" + (i - sp.cases.length + 1)) : cc.label}</button>;
          })}
        </div>
        {x && c && <div className="stack" style={{ gap: 4 }}>
          <div className="io-lbl">Input</div><pre className="io-box">{c.big ? `(${c.label})` : showArgs(sp, c.args!)}</pre>
          {x.tle ? <pre className="io-box err">Your code ran longer than the time limit{x.ms ? ` (${Math.round(x.ms)} ms)` : ""}. Look for nested loops over the input or an infinite loop. Is there an O(n) or O(n log n) approach?</pre>
            : x.error ? <><div className="io-lbl">Error</div><pre className="io-box err">{x.error}</pre></>
            : <><div className="io-lbl">Your output</div><pre className={"io-box" + (x.pass === false ? " err" : "")}>{showVal(x.out)}</pre></>}
          {x.exp !== undefined && !x.tle && <><div className="io-lbl">Expected{c.custom ? " (reference solution)" : ""}</div><pre className="io-box">{showVal(x.exp)}</pre></>}
          {!!x.logs?.length && <><div className="io-lbl">Stdout</div><pre className="io-box">{x.logs.join("\n")}</pre></>}
        </div>}
      </>
    );
  }

  return (
    <section className="solve" aria-label="Code editor" ref={panelRef}>
      <div className="solve-top">
        <select className="lang-select" aria-label="Language" value={lang} onChange={e => update(x => { x.lang = e.target.value as LangId; })}>
          {JUDGE_LANGS.map(l => <option key={l} value={l}>{LANG[l].label}</option>)}
        </select>
        <span className="mono" style={{ fontSize: 11.5, color: "#6b7389" }}>{s.code[key] ? "draft saved" : "starter code"}</span>
        <span style={{ flex: 1 }} />
        {sub && <span className={`pill ${sub.ok ? "E" : "H"}`} title={`Last submission: ${sub.verdict} (${sub.date})`}>{sub.ok ? "✓ Accepted" : "✕ " + (({ "Wrong Answer": "WA", "Time Limit Exceeded": "TLE", "Runtime Error": "RE" } as Record<string, string>)[sub.verdict] || "Error")}</span>}
        <button className="btn sm ghost" onClick={() => {
          if (!confirmReset) { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 3000); return; }
          update(x => { delete x.code[key]; }); setCode(starter); setConfirmReset(false); toast("Editor reset to starter code");
        }}>{confirmReset ? "Click again to erase your code" : "Reset"}</button>
        <button className="btn sm" disabled={running} onClick={() => judge("run")} title="Ctrl/⌘ + Enter">▶ Run</button>
        <button className="btn sm pri" disabled={running} onClick={() => judge("submit")} title="Ctrl/⌘ + Shift + Enter">Submit</button>
      </div>
      {sp.note && <div className="solve-note">{sp.note}</div>}
      {LANG[lang].runtime === "server" && server === false && <div className="solve-note" style={{ color: "#f6c85f" }}>{LANG[lang].label} runs on a code-execution server, which isn&apos;t set up for this site yet (see README → &quot;Enable other languages&quot;). JavaScript works right away.</div>}
      <div className="editor-host"><Editor value={code} onChange={onChange} lang={lang} onRun={() => judge("run")} onSubmit={() => judge("submit")} /></div>
      <div className="solve-bottom">
        <div className="tabs" role="tablist" style={{ margin: "0 0 10px" }}>
          {(["cases", "result", "console"] as const).map(t => <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t === "cases" ? "Testcases" : t === "result" ? "Result" : "Console"}</button>)}
          <span style={{ flex: 1 }} /><span style={{ fontSize: 12, alignSelf: "center", color: "#6b7389" }}><span className="kbd">Ctrl</span>+<span className="kbd">Enter</span> run</span>
        </div>
        {running ? <div style={{ padding: "10px 2px", color: "#8a92a8" }}>Running your code{LANG[lang].runtime === "server" ? " on the server" : ""}…</div>
          : tab === "cases" ? (
            <>
              <div className="row" style={{ gap: 6, marginBottom: 10 }}>
                {sp.cases.map((_, i) => <button key={i} className={"btn sm" + (caseIdx === i && !customOn ? " on" : "")} onClick={() => { setCustomOn(false); setCaseIdx(i); }}>Case {i + 1}</button>)}
                <button className={"btn sm" + (customOn ? " on" : "")} onClick={() => setCustomOn(true)}>+ Custom</button>
              </div>
              {customOn ? <>
                <label className="io-lbl" htmlFor="sv-custom" style={{ display: "block" }}>One line per {sp.design ? "list (operations, then arguments)" : "parameter: " + sp.params.map(p => p[0]).join(", ")}, as JSON</label>
                <textarea id="sv-custom" className="io-box" rows={Math.max(2, sp.params.length + 1)} spellCheck={false} value={customText} onChange={e => setCustomText(e.target.value)} />
                <p style={{ fontSize: 12.5, marginTop: 6, color: "#8a92a8" }}>Run to see your output next to the reference solution&apos;s answer.{sp.params.some(p => p[1] === "TreeNode") ? " Trees use level order with null, e.g. [3,9,20,null,null,15,7]." : ""}{sp.params.some(p => p[1] === "cycle") ? " Cycle input is [[values], pos]." : ""}</p>
              </> : <>
                <pre className="io-box">{showArgs(sp, sp.cases[caseIdx])}</pre>
                <div className="io-lbl">Expected</div><pre className="io-box">{showVal(expectedFor(id).cases[caseIdx])}</pre>
              </>}
              <p style={{ fontSize: 12.5, marginTop: 8, color: "#8a92a8" }}>Run checks {sp.cases.length} example case{sp.cases.length > 1 ? "s" : ""}. Submit also checks {sp.hidden.length} hidden tests{hasGen ? ", including a large one that needs an efficient solution" : ""}.</p>
            </>
          ) : !result ? <div style={{ padding: "10px 2px", color: "#8a92a8" }}>Press <b>Run</b> to test the examples, or <b>Submit</b> to run every test.</div>
          : tab === "console" ? <pre className="io-box" style={{ minHeight: 80 }}>{[...result.logs.map(l => "(global) " + l), ...result.results.flatMap(x => (x.logs || []).map(l => `[${result.cases[x.i]?.label}] ${l}`))].join("\n") || "No printed output."}</pre>
          : resultView(result)}
      </div>
    </section>
  );
}
