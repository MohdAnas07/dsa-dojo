"use client";
import { useEffect, useState } from "react";

const subs = new Set<(m: string) => void>();
/** Show a short confirmation message at the bottom of the screen. */
export function toast(msg: string) { subs.forEach(f => f(msg)); }

export function Toaster() {
  const [msg, setMsg] = useState(""); const [show, setShow] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const f = (m: string) => { setMsg(m); setShow(true); clearTimeout(t); t = setTimeout(() => setShow(false), 1800); };
    subs.add(f); return () => { subs.delete(f); };
  }, []);
  return <div className={"toast" + (show ? " show" : "")} role="status" aria-live="polite">{msg}</div>;
}
