"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import Modal from "@/components/Modal";
import { PROB } from "@/lib/data";

// Loaded on first click, so problem pages don't pay for the visualizer up front.
const SolutionViz = dynamic(() => import("./SolutionViz"), { ssr: false, loading: () => <div className="card muted">Loading the visualizer…</div> });

export default function VisualizeButton({ id, label = "▶ Visualize the solution", className = "btn sm pri" }: { id: string; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const p = PROB[id];
  if (!p) return null;
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>{label}</button>
      {open && <Modal wide title={`${p.t}: visual explanation`} onClose={() => setOpen(false)}><SolutionViz p={p} /></Modal>}
    </>
  );
}
