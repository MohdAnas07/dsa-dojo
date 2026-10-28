"use client";
import { useEffect, useRef, useState } from "react";
import Editor from "@/components/Editor";
import { LANGUAGES, LANG, type LangId } from "@/lib/languages";
import { HARNESS_SRC } from "@/lib/judge-core";
import { runJS, runOnServer } from "@/lib/runner";
import { useStore, update, getState, useRemoteEpoch } from "@/lib/store";
import { PG_SNIPPETS, PY_SNIPPETS } from "@/content/snippets";

const JS_PRELUDE = HARNESS_SRC + "\nconst buildList = __toList, listToArray = __fromList, buildTree = __toTree, treeToArray = __fromTree;\n";
const snippetsFor = (l: LangId): Record<string, string> => l === "javascript" ? PG_SNIPPETS : l === "python" ? PY_SNIPPETS : { Hello: LANG[l].hello };

export default function PlaygroundView() {
  const s = useStore();
  const lang = s.pgLang;
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [out, setOut] = useState<{ text: string; err?: string; info?: string } | null>(null);
  const [running, setRunning] = useState(false);
  const [server, setServer] = useState<boolean | null>(null);
  const [available, setAvailable] = useState<LangId[] | null>(null);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const epoch = useRemoteEpoch();
  // What this editor last loaded from, or wrote to, the saved state (see SolvePanel for why).
  const synced = useRef(""); const shown = useRef("");
  shown.current = code;
  const loadSaved = () => { const v = getState().pg[lang] ?? (lang === "javascript" ? PG_SNIPPETS["Blank"] : LANG[lang].hello); synced.current = v; setCode(v); };
  useEffect(() => { loadSaved(); setOut(null); }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (epoch && shown.current === synced.current) loadSaved(); }, [epoch]); // eslint-disable-line react-hooks/exhaustive-deps
  // Re-check on every language switch, so a language installed after the page loaded stops showing as missing.
  useEffect(() => { if (LANG[lang].runtime !== "server") return; fetch("/api/execute").then(r => r.json()).then(d => { setServer(!!d.configured); setAvailable(Array.isArray(d.available) ? d.available : null); }).catch(() => setServer(false)); }, [lang]);
  const missing = LANG[lang].runtime === "server" && server === true && available !== null && !available.includes(lang);
  const onChange = (v: string) => { setCode(v); clearTimeout(t.current); t.current = setTimeout(() => { synced.current = v; update(x => { x.pg[lang] = v; }); }, 400); };

  const run = async () => {
    if (running) return;
    clearTimeout(t.current); synced.current = code;
    update(x => { x.pg[lang] = code; }, { activity: true });
    setRunning(true); setOut({ text: "", info: "Running…" });
    if (LANG[lang].runtime === "browser") {
      const r = await runJS(JS_PRELUDE + "\n{\n" + code + "\n}", 5000);
      setOut({ text: r.logs.join("\n"), err: r.error, info: `finished in ${Math.round(r.timeMs || 0)} ms · ran in your browser` });
    } else {
      const r = await runOnServer(lang, code, stdin);
      if (r.error) setOut({ text: "", err: r.error });
      else {
        if (available && !available.includes(lang)) setAvailable([...available, lang]); // it ran, so it is installed
        setOut({ text: r.stdout, err: [r.compileOutput || r.stderr, r.message || (r.signal === "SIGKILL" ? "Stopped: time or memory limit exceeded." : "")].filter(Boolean).join("\n") || undefined, info: `exit code ${r.exitCode ?? "–"} · ${r.timeMs} ms round trip` });
      }
    }
    setRunning(false);
  };

  return (
    <div className="stack">
      <span className="eyebrow">Code playground</span><h1>Write code, run it, see the output</h1>
      <p className="lead">JavaScript runs instantly in your browser, with <code>ListNode</code>, <code>TreeNode</code>, <code>buildList</code>, <code>listToArray</code>, <code>buildTree</code> and <code>treeToArray</code> ready to use. Other languages run in a sandbox on the execution server. Your code is saved automatically.</p>
      {LANG[lang].runtime === "server" && server === false && <div className="banner">{LANG[lang].label} needs the code-execution server, which isn&apos;t configured on this deployment yet. See README → &quot;Enable other languages&quot;.</div>}
      {missing && <div className="banner">{LANG[lang].label} isn&apos;t installed on the execution server yet. Run <code>npm run piston:install</code> (Piston package <code>{LANG[lang].piston!.pkg}</code>).</div>}
      <div className="row">
        <label htmlFor="pg-lang" className="faint mono" style={{ fontSize: 12 }}>LANGUAGE</label>
        <select id="pg-lang" value={lang} onChange={e => update(x => { x.pgLang = e.target.value as LangId; })}>{LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}{l.runtime === "browser" ? " (in browser)" : available && server && !available.includes(l.id) ? " (not installed)" : ""}</option>)}</select>
        <label htmlFor="pg-snip" className="faint mono" style={{ fontSize: 12 }}>START FROM</label>
        <select id="pg-snip" value="" onChange={e => { if (e.target.value) onChange(snippetsFor(lang)[e.target.value]); }}><option value="">Choose a snippet…</option>{Object.keys(snippetsFor(lang)).map(k => <option key={k}>{k}</option>)}</select>
        <span style={{ flex: 1 }} />
        <button className="btn sm ghost" onClick={() => setOut(null)}>Clear output</button>
        <button className="btn pri" onClick={run} disabled={running}>▶ Run <span className="kbd" style={{ marginLeft: 4, background: "transparent", color: "inherit", borderColor: "currentColor" }}>Ctrl ↵</span></button>
      </div>
      <div className="pg-grid">
        <div className="solve" style={{ minWidth: 0 }}>
          <div className="solve-top"><span className="lang">{LANG[lang].label}</span></div>
          <div className="editor-host tall"><Editor value={code} onChange={onChange} lang={lang} onRun={run} /></div>
          {LANG[lang].runtime === "server" && <div className="pg-stdin"><label className="io-lbl" htmlFor="pg-in" style={{ display: "block" }}>Input (stdin)</label><textarea id="pg-in" className="io-box" rows={3} spellCheck={false} value={stdin} onChange={e => setStdin(e.target.value)} placeholder="Text your program reads from stdin (input(), cin, Scanner, readLine(), gets, …)" /></div>}
        </div>
        <div className="solve" style={{ minWidth: 0 }}>
          <div className="solve-top"><span className="lang">Output</span><span className="mono" style={{ fontSize: 11.5, color: "#6b7389" }}>{out?.info}</span></div>
          <pre className="pg-out">{out ? <>{out.text}{out.err && <span className="err-line">{out.text ? "\n" : ""}{out.err}</span>}{!out.text && !out.err && !running && <span style={{ color: "#6b7389" }}>(no output: print something to see it here)</span>}</> : <span style={{ color: "#6b7389" }}>Press Run to see output here.</span>}</pre>
        </div>
      </div>
    </div>
  );
}
