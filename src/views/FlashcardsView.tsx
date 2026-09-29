"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FLASHCARDS, TOPIC } from "@/lib/data";
import { useStore, update } from "@/lib/store";

export default function FlashcardsView() {
  const s = useStore();
  const [cat, setCat] = useState("");
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [order, setOrder] = useState<string[] | null>(null);
  const cats = [...new Set(FLASHCARDS.map(c => c.cat))];
  const deck = useMemo(() => {
    let d = FLASHCARDS.filter(c => cat === "__again" ? s.fk[c.id] !== "known" : !cat || c.cat === cat);
    if (order) { const pos = new Map(order.map((id, k) => [id, k])); d = [...d].sort((a, b) => (pos.get(a.id) ?? 1e9) - (pos.get(b.id) ?? 1e9)); }
    return d;
  }, [cat, order, s.fk]);
  const idx = Math.min(i, Math.max(0, deck.length - 1));
  const c = deck[idx];
  const act = useCallback((a: "flip" | "known" | "again" | "prev" | "next" | "shuffle") => {
    if (a === "flip") return setFlip(f => !f);
    if (a === "shuffle") { setOrder(FLASHCARDS.map(x => x.id).sort(() => Math.random() - 0.5)); setI(0); setFlip(false); return; }
    if (!c) return;
    if (a === "known" || a === "again") update(x => { x.fk[c.id] = a; }, { activity: true });
    if (a === "prev") setI(Math.max(0, idx - 1));
    else if (!(cat === "__again" && a === "known")) setI((idx + 1) % Math.max(1, deck.length));
    setFlip(false);
  }, [c, idx, cat, deck.length]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input,textarea,select") || document.querySelector(".modal-bg")) return;
      if (e.key === " ") { e.preventDefault(); act("flip"); } else if (e.key === "ArrowRight") act("known"); else if (e.key === "ArrowLeft") act("again");
    };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [act]);
  const known = deck.filter(x => s.fk[x.id] === "known").length;
  return (
    <div className="stack">
      <span className="eyebrow">Flashcards</span><h1>Flip, answer, repeat</h1>
      <p className="lead">Say the answer out loud before flipping. Mark cards you knew; the &quot;Needs work&quot; deck shows the rest.</p>
      <div className="filters">
        <select aria-label="Deck" value={cat} onChange={e => { setCat(e.target.value); setI(0); setFlip(false); }}><option value="">All decks</option>{cats.map(x => <option key={x}>{x}</option>)}<option value="__again">Needs work</option></select>
        <button className="btn sm" onClick={() => act("shuffle")}>Shuffle</button>
        <span className="faint" style={{ fontSize: 13, alignSelf: "center" }}>Keys: <span className="kbd">space</span> flip · <span className="kbd">→</span> knew it · <span className="kbd">←</span> again</span>
      </div>
      {!c ? <div className="card muted">No cards here. Everything in this deck is marked as known.</div> : (
        <div className="stack" style={{ alignItems: "center" }}>
          <div className="row" style={{ width: "100%", maxWidth: 620, justifyContent: "space-between" }}><span className="mono faint" style={{ fontSize: 12.5 }}>{idx + 1} / {deck.length} · {c.cat}{c.topic ? " · " + TOPIC[c.topic].title : ""}</span><span className="mono" style={{ fontSize: 12.5, color: "var(--good)" }}>{known} known</span></div>
          <div className="bar good" style={{ width: "100%", maxWidth: 620 }}><i style={{ width: `${(known / deck.length) * 100}%` }} /></div>
          <div className="fc-wrap"><div className={"fc" + (flip ? " flip" : "")} role="button" tabIndex={0} aria-label="Flip card" onClick={() => act("flip")}>
            <div className="front"><span className="eyebrow">{c.cat}</span><div className="q">{c.q}</div><span className="faint" style={{ fontSize: 13 }}>click or press space to flip</span></div>
            <div className="back"><div className="a">{c.a}</div><div className="why">{c.why}</div></div>
          </div></div>
          <div className="row"><button className="btn" onClick={() => act("prev")}>← Prev</button><button className="btn" style={{ borderColor: "var(--bad)" }} onClick={() => act("again")}>Again</button><button className="btn pri" onClick={() => act("known")}>Knew it ✓</button><button className="btn" onClick={() => act("next")}>Next →</button></div>
        </div>
      )}
    </div>
  );
}
