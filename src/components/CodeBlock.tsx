"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { highlightLines } from "@/lib/highlight";
import { runJS } from "@/lib/runner";
import { update } from "@/lib/store";
import type { CodeSample } from "@/lib/types";
import { toast } from "./Toast";

/**
 * Code viewer: syntax colouring, line numbers, highlighted key lines, click-a-line explanations,
 * copy, edit, run (in a sandboxed worker), expected vs actual output, reset, open in playground.
 */
export default function CodeBlock({ sample, expected, run = true, title = "JavaScript" }: { sample: CodeSample | string; expected?: string; run?: boolean; title?: string }) {
  const s: CodeSample = typeof sample === "string" ? { c: sample } : sample;
  const router = useRouter();
  const [code, setCode] = useState(s.c);
  const [editing, setEditing] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [result, setResult] = useState<{ text: string; error?: string } | null>(null);
  const [running, setRunning] = useState(false);
  const edited = code !== s.c;
  const lines = useMemo(() => highlightLines(code), [code]);

  const doRun = async () => {
    setRunning(true); setEditing(false);
    const r = await runJS(code);
    setResult({ text: (r.logs || []).join("\n"), error: r.error }); setRunning(false);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); toast("Copied to clipboard"); } catch { setEditing(true); toast("Press Ctrl/⌘+C to copy"); }
  };
  const match = result && !result.error && expected !== undefined && result.text === expected;

  return (
    <div className="code">
      <div className="code-top">
        <span className="lang">{title}{edited ? " · edited" : ""}</span>
        <button onClick={copy} title="Copy code">Copy</button>
        <button onClick={() => { setEditing(v => !v); setSel(null); }}>{editing ? "Done" : "Edit"}</button>
        {edited && <button onClick={() => { setCode(s.c); setEditing(false); setResult(null); }}>Reset</button>}
        <button onClick={() => { update(st => { st.pg.javascript = code; st.pgLang = "javascript"; }); router.push("/playground"); }} title="Open in the playground">Playground</button>
        {run && <button className="run" onClick={doRun}>{running ? "Running…" : "▶ Run"}</button>}
      </div>
      {editing ? (
        <textarea className="ed" spellCheck={false} aria-label="Edit code" rows={Math.min(28, code.split("\n").length + 1)} value={code} autoFocus
          onChange={e => setCode(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Tab") { e.preventDefault(); const t = e.currentTarget, a = t.selectionStart; const v = t.value.slice(0, a) + "  " + t.value.slice(t.selectionEnd); setCode(v); requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = a + 2; }); }
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); doRun(); }
          }} />
      ) : (
        <div className="code-body">
          {lines.map((l, i) => {
            const n = i + 1, has = !edited && s.ex?.[n];
            return (
              <div key={i} className={"ln" + (!edited && s.hl?.includes(n) ? " hl" : "") + (sel === n ? " sel" : "") + (has ? " has" : "")} onClick={() => setSel(sel === n ? null : n)}>
                <i className="n">{n}</i><code dangerouslySetInnerHTML={{ __html: l || " " }} />
              </div>
            );
          })}
        </div>
      )}
      {sel !== null && !editing && (
        <div className="explain"><b>L{sel}</b><span>{(!edited && s.ex?.[sel]) || "No note for this line. Lines with a blue dot have explanations; highlighted lines are the key ones."}</span></div>
      )}
      {run && (expected !== undefined || result) && (
        <div className="io">
          <div><b>Expected output</b><pre>{expected ?? ""}</pre></div>
          <div><b>Actual output</b>
            {result ? <pre className={result.error ? "err" : match ? "match" : ""}>{result.text}{result.error ? (result.text ? "\n" : "") + result.error : ""}{match ? "\n✓ matches expected" : ""}</pre>
              : <pre style={{ color: "#6b7389" }}>Press Run to execute</pre>}
          </div>
        </div>
      )}
    </div>
  );
}
