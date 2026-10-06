"use client";
import { useEffect, useState } from "react";

const subs = new Set<(m: string, ms: number) => void>();
/** Show a short confirmation message at the bottom of the screen. */
export function toast(msg: string, ms = 1800) { subs.forEach(f => f(msg, ms)); }

export function Toaster() {
  const [msg, setMsg] = useState(""); const [show, setShow] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const f = (m: string, ms: number) => { setMsg(m); setShow(true); clearTimeout(t); t = setTimeout(() => setShow(false), ms); };
    subs.add(f); return () => { subs.delete(f); };
  }, []);
  return <div className={"toast" + (show ? " show" : "")} role="status" aria-live="polite">{msg}</div>;
}
