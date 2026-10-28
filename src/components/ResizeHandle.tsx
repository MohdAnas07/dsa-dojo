"use client";
import { useEffect, useRef, useState } from "react";

/**
 * A draggable divider (like LeetCode's panel splitters).
 *  dir "x" → vertical bar, drag left/right.   dir "y" → horizontal bar, drag up/down.
 * `onMove` gets the pointer position (clientX or clientY); the parent turns it into a size.
 * Arrow keys nudge by `step`, double-click (or Enter) calls `onReset`.
 */
export function ResizeHandle({ dir, onMove, onStep, onReset, label, className = "" }: {
  dir: "x" | "y";
  onMove: (pos: number) => void;
  onStep: (delta: number) => void;
  onReset: () => void;
  label: string;
  className?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const move = useRef(onMove); move.current = onMove;

  useEffect(() => {
    if (!dragging) return;
    const cls = dir === "x" ? "resizing-x" : "resizing-y";
    document.body.classList.add("resizing", cls);
    const onPointerMove = (e: PointerEvent) => { e.preventDefault(); move.current(dir === "x" ? e.clientX : e.clientY); };
    const stop = () => setDragging(false);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    window.addEventListener("blur", stop);
    return () => {
      document.body.classList.remove("resizing", cls);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      window.removeEventListener("blur", stop);
    };
  }, [dragging, dir]);

  return (
    <div
      role="separator"
      aria-orientation={dir === "x" ? "vertical" : "horizontal"}
      aria-label={label}
      title={`Drag to resize · double-click to reset`}
      tabIndex={0}
      className={`rz rz-${dir}${dragging ? " on" : ""} ${className}`}
      onPointerDown={e => { if (e.button !== 0) return; e.preventDefault(); setDragging(true); }}
      onDoubleClick={onReset}
      onKeyDown={e => {
        const back = dir === "x" ? "ArrowLeft" : "ArrowUp", fwd = dir === "x" ? "ArrowRight" : "ArrowDown";
        if (e.key === back || e.key === fwd) { e.preventDefault(); onStep(e.key === fwd ? 1 : -1); }
        else if (e.key === "Enter") { e.preventDefault(); onReset(); }
      }}
    ><span className="rz-grip" /></div>
  );
}

/** A number remembered in this browser (falls back to the default if storage is unavailable). */
export function useStoredNumber(key: string, fallback: number | null) {
  const [v, setV] = useState<number | null>(fallback);
  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw !== null && Number.isFinite(Number(raw))) setV(Number(raw)); } catch { /* ignore */ }
  }, [key]);
  const set = (n: number | null) => {
    setV(n);
    try { if (n === null) localStorage.removeItem(key); else localStorage.setItem(key, String(Math.round(n * 10) / 10)); } catch { /* ignore */ }
  };
  return [v, set] as const;
}

export const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), Math.max(lo, hi));
