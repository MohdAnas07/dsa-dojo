"use client";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { LESSONS } from "@/content/lessons";
import { TOPIC } from "@/lib/data";
import { update, today } from "@/lib/store";
import { Bullets } from "./ui";

/** 30-second / 2-minute / 10-minute revision for one lesson. Opening it records a revision. */
export default function RevisionModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const c = LESSONS[slug];
  const [tab, setTab] = useState<"s30" | "m2" | "m10">("s30");
  useEffect(() => { update(s => { s.rev[slug] = today(); }, { activity: true }); }, [slug]);
  return (
    <Modal title={`Quick revision · ${TOPIC[slug].title}`} onClose={onClose}>
      <div className="tabs" role="tablist">
        {([["s30", "30 seconds"], ["m2", "2 minutes"], ["m10", "10 minutes"]] as const).map(([k, l]) =>
          <button key={k} role="tab" className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      {tab === "s30" && <p style={{ fontSize: 17, lineHeight: 1.6 }}>{c.rev.s30}</p>}
      {tab === "m2" && <>
        <Bullets items={c.rev.m2} size={15} />
        <div className="card tw" style={{ padding: "4px 8px", marginTop: 14 }}><table className="t"><tbody>{c.cx.map(r => <tr key={r[0]}><td>{r[0]}</td><td className="cx">{r[1]}</td></tr>)}</tbody></table></div>
      </>}
      {tab === "m10" && <div className="stack">
        <div><h3 style={{ marginBottom: 6 }}>Examples</h3><ul className="clean" style={{ fontSize: 14.5 }}>{c.examples.map(e => <li key={e.title}><span><b>{e.title}</b> <span className="cx">{e.time}</span><br /><span className="muted">{e.idea}</span></span></li>)}</ul></div>
        <div><h3 style={{ marginBottom: 6 }}>Pattern clues</h3>{c.signals.map(([a, b]) => <div key={a} className="signal" style={{ marginBottom: 6 }}><span className="clue">{a}</span><span className="arrow">→</span><span className="think">{b}</span></div>)}</div>
        <div><h3 style={{ marginBottom: 6 }}>Mistakes to avoid</h3><ul className="clean x" style={{ fontSize: 14 }}>{c.mistakes.map(m => <li key={m[0]}><span>{m[0]} → <span className="muted">{m[1]}</span></span></li>)}</ul></div>
        <pre className="cheat">{c.cheat}</pre>
      </div>}
    </Modal>
  );
}
