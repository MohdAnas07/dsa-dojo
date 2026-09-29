"use client";
import { useEffect, useRef } from "react";
import { VIZ } from "@/lib/viz";
import type { VizKind } from "@/lib/types";

/** Mounts one of the interactive visualizers (array, binary search, tree traversal, Big O chart…). */
export default function VisualExplanation({ kind }: { kind: VizKind }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el || !VIZ[kind]) return;
    const fresh = document.createElement("div");
    el.replaceChildren(fresh);
    VIZ[kind](fresh);
    return () => { el.replaceChildren(); };
  }, [kind]);
  return <div className="viz" ref={ref} />;
}
