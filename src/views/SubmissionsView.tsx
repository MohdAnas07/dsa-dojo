"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PROBLEMS } from "@/content/problems";
import { DIFF, PROB } from "@/lib/data";
import { LANG, LANGUAGES, type LangId } from "@/lib/languages";
import { useStore, update, type Attempt } from "@/lib/store";
import { toast } from "@/components/Toast";

const when = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};
const ago = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (!(s >= 0)) return "";
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  if (s < 86400) return Math.floor(s / 3600) + "h ago";
  return Math.floor(s / 86400) + "d ago";
};
const title = (id: string) => PROB[id]?.t || id;

export default function SubmissionsView() {
  const s = useStore(); const q = useSearchParams(); const router = useRouter();
  const [tab, setTab] = useState<"all" | "solved">(q.get("tab") === "solved" ? "solved" : "all");
  const [verdict, setVerdict] = useState<"" | "ok" | "bad">("");
  const [lang, setLang] = useState<"" | LangId>("");
  const [search, setSearch] = useState(q.get("problem") ? title(q.get("problem")!) : "");
  const [open, setOpen] = useState<string | null>(null);

  const hist = s.hist || [];
  const list = useMemo(() => {
    const term = search.trim().toLowerCase();
    return [...hist].reverse().filter(h => (!verdict || (verdict === "ok") === h.ok) && (!lang || h.lang === lang) && (!term || title(h.prob).toLowerCase().includes(term) || h.prob.includes(term)));
  }, [hist, verdict, lang, search]);

  // One row per solved problem: when it was first accepted, how many tries it took, and the latest attempt.
  const solved = useMemo(() => {
    const by: Record<string, Attempt[]> = {};
    for (const h of hist) (by[h.prob] ||= []).push(h);
    return PROBLEMS.filter(p => s.ps[p.id] === "solved" || s.ps[p.id] === "revise" || by[p.id]?.some(h => h.ok)).map(p => {
      const a = by[p.id] || [], first = a.find(h => h.ok);
      const firstAt = first?.at ?? (s.subs[p.id]?.ok ? s.subs[p.id].date : null);
      return { p, firstAt, tries: first ? a.indexOf(first) + 1 : null, total: a.length, last: a[a.length - 1] ?? null, best: a.filter(h => h.ok).sort((x, y) => x.ms - y.ms)[0] ?? null };
    }).sort((x, y) => (y.firstAt || "").localeCompare(x.firstAt || ""));
  }, [hist, s.ps, s.subs]);

  const accepted = hist.filter(h => h.ok).length;
  const openInEditor = (h: Attempt) => {
    update(x => { x.code[`${h.prob}:${h.lang}`] = h.code; x.lang = h.lang; });
    router.push(`/problems/${h.prob}`);
    toast("Loaded this submission into the editor");
  };

  return (
    <div className="stack">
      <span className="eyebrow">Submissions</span><h1>Your submission history</h1>
      <p className="lead">Every time you press Submit on a problem, the result and your code are saved here, along with when each problem was first solved.</p>
      <div className="grid g4">
        <div className="card stat"><span className="l">Submissions</span><span className="v">{hist.length}</span></div>
        <div className="card stat"><span className="l">Accepted</span><span className="v">{accepted}</span></div>
        <div className="card stat"><span className="l">Acceptance rate</span><span className="v">{hist.length ? Math.round((accepted / hist.length) * 100) + "%" : "—"}</span></div>
        <div className="card stat"><span className="l">Problems solved</span><span className="v">{solved.length} <small style={{ fontSize: 14, color: "var(--faint)" }}>/ {PROBLEMS.length}</small></span></div>
      </div>
      <div className="row" role="tablist" style={{ gap: 6 }}>
        <button role="tab" aria-selected={tab === "all"} className={`btn sm ${tab === "all" ? "pri" : "ghost"}`} onClick={() => setTab("all")}>All submissions ({hist.length})</button>
        <button role="tab" aria-selected={tab === "solved"} className={`btn sm ${tab === "solved" ? "pri" : "ghost"}`} onClick={() => setTab("solved")}>Solved problems ({solved.length})</button>
      </div>

      {tab === "all" ? <>
        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <input type="search" placeholder="Search problems…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: "1 1 220px", minWidth: 0 }} aria-label="Search problems" />
          <select value={verdict} onChange={e => setVerdict(e.target.value as "" | "ok" | "bad")} aria-label="Result"><option value="">All results</option><option value="ok">Accepted</option><option value="bad">Not accepted</option></select>
          <select value={lang} onChange={e => setLang(e.target.value as "" | LangId)} aria-label="Language"><option value="">All languages</option>{LANGUAGES.filter(l => l.judge).map(l => <option key={l.id} value={l.id}>{l.label}</option>)}</select>
        </div>
        {list.length ? <div className="card tw" style={{ padding: "6px 8px" }}><table className="t"><thead><tr><th>Submitted</th><th>Problem</th><th>Result</th><th>Language</th><th>Tests</th><th>Time</th><th /></tr></thead><tbody>
          {list.map(h => { const p = PROB[h.prob]; const isOpen = open === h.id; return [
            <tr key={h.id}>
              <td><span title={when(h.at)} className="mono" style={{ fontSize: 12.5, whiteSpace: "nowrap" }}>{when(h.at)}</span><div className="faint" style={{ fontSize: 11.5 }}>{ago(h.at)}</div></td>
              <td>{p ? <Link href={`/problems/${h.prob}`}>{p.t}</Link> : h.prob}{p && <> <span className={`pill ${p.d}`}>{DIFF[p.d]}</span></>}</td>
              <td><b style={{ color: h.ok ? "var(--good)" : "var(--bad)", whiteSpace: "nowrap" }}>{h.verdict}</b></td>
              <td>{LANG[h.lang]?.label || h.lang}</td>
              <td className="mono" style={{ fontSize: 12.5 }}>{h.total ? `${h.passed} / ${h.total}` : "—"}</td>
              <td className="mono" style={{ fontSize: 12.5 }}>{h.ms ? h.ms + " ms" : "—"}</td>
              <td style={{ textAlign: "right" }}><button className="btn sm ghost" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : h.id)}>{isOpen ? "Hide code" : "View code"}</button></td>
            </tr>,
            isOpen && <tr key={h.id + ":code"}><td colSpan={7} style={{ paddingTop: 0 }}>
              {h.code ? <div className="code"><div className="code-top"><span className="lang">{LANG[h.lang]?.label || h.lang}</span>
                <button onClick={() => { void navigator.clipboard?.writeText(h.code).then(() => toast("Copied"), () => toast("Could not copy")); }}>Copy</button>
                <button onClick={() => openInEditor(h)}>Open in editor</button>
                <button onClick={() => { update(x => { x.hist = x.hist.filter(y => y.id !== h.id); }); setOpen(null); toast("Submission deleted"); }}>Delete</button>
              </div><pre className="code-body" style={{ margin: 0, padding: "10px 14px", maxHeight: 420, overflow: "auto" }}>{h.code}</pre></div>
                : <div className="faint" style={{ fontSize: 13 }}>The code of this older submission was not kept, to stay within the storage limit.</div>}
            </td></tr>
          ]; })}
        </tbody></table></div>
          : <div className="card muted">{hist.length ? "No submissions match these filters." : <>No submissions yet. Open any problem from the <Link href="/problems">problem list</Link>, write a solution and press <b style={{ color: "var(--ink)" }}>Submit</b>. It will show up here.</>}</div>}
      </> : solved.length ? <div className="card tw" style={{ padding: "6px 8px" }}><table className="t"><thead><tr><th>Problem</th><th>First solved</th><th>Attempts to solve</th><th>Submissions</th><th>Fastest accepted</th><th>Last result</th></tr></thead><tbody>
        {solved.map(({ p, firstAt, tries, total, last, best }) => (
          <tr key={p.id}>
            <td><Link href={`/problems/${p.id}`}>{p.t}</Link> <span className={`pill ${p.d}`}>{DIFF[p.d]}</span></td>
            <td>{firstAt ? <><span className="mono" style={{ fontSize: 12.5 }}>{firstAt.length > 10 ? when(firstAt) : firstAt}</span>{firstAt.length > 10 && <div className="faint" style={{ fontSize: 11.5 }}>{ago(firstAt)}</div>}</> : <span className="faint" style={{ fontSize: 13 }}>marked by hand</span>}</td>
            <td className="mono" style={{ fontSize: 12.5 }}>{tries ?? "—"}</td>
            <td className="mono" style={{ fontSize: 12.5 }}>{total ? <button className="btn sm ghost" onClick={() => { setSearch(p.t); setVerdict(""); setLang(""); setTab("all"); }}>{total} · view</button> : "—"}</td>
            <td className="mono" style={{ fontSize: 12.5 }}>{best ? `${best.ms} ms · ${LANG[best.lang]?.label}` : "—"}</td>
            <td>{last ? <b style={{ color: last.ok ? "var(--good)" : "var(--bad)" }}>{last.verdict}</b> : "—"}</td>
          </tr>))}
      </tbody></table></div>
        : <div className="card muted">No problems solved yet. An accepted submission marks a problem as solved and records the date here.</div>}
    </div>
  );
}
