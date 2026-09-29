"use client";
import Link from "next/link";
import { useState } from "react";
import { LESSONS } from "@/content/lessons";
import { LESSON_SLUGS, TOPIC } from "@/lib/data";
import { useStore } from "@/lib/store";
import RevisionModal from "@/components/RevisionModal";

export default function RevisionView() {
  const s = useStore(); const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="stack">
      <span className="eyebrow">Revision</span><h1>Cheat sheets</h1>
      <p className="lead">One screen per topic. Read these the night before an interview. Use Quick revision for the 30s / 2m / 10m versions.</p>
      <div className="grid g2">{LESSON_SLUGS.map(k => (
        <div key={k} className="stack" style={{ gap: 8 }}>
          <div className="row" style={{ justifyContent: "space-between" }}><Link href={`/learn/${k}`}><h3>{TOPIC[k].title}</h3></Link>
            <span className="row" style={{ gap: 6 }}><span className="faint mono" style={{ fontSize: 11.5 }}>{s.rev[k] ? "revised " + s.rev[k] : "not revised yet"}</span><button className="btn sm" onClick={() => setOpen(k)}>⚡ Quick revision</button></span></div>
          <pre className="cheat" style={{ flex: 1 }}>{LESSONS[k].cheat}</pre>
        </div>))}</div>
      {open && <RevisionModal slug={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
