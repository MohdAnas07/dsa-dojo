"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Modal({ title, onClose, children, bare, wide }: { title: string; onClose: () => void; children: React.ReactNode; bare?: boolean; wide?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  // Rendered into <body> so a transformed ancestor (page animations) can't trap the fixed overlay.
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => { setHost(document.body); }, []);
  if (!host) return null;
  return createPortal(
    <div className="modal-bg" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={"modal" + (wide ? " wide" : "")} role="dialog" aria-modal="true" aria-label={title}>
        {bare ? children : (<>
          <div className="modal-h"><h3 style={{ flex: 1 }}>{title}</h3><button className="iconbtn" onClick={onClose}>Close <span className="kbd">esc</span></button></div>
          <div className="modal-b">{children}</div>
        </>)}
      </div>
    </div>, host
  );
}
