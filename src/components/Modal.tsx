"use client";
import { useEffect } from "react";

export default function Modal({ title, onClose, children, bare }: { title: string; onClose: () => void; children: React.ReactNode; bare?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="modal-bg" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-label={title}>
        {bare ? children : (<>
          <div className="modal-h"><h3 style={{ flex: 1 }}>{title}</h3><button className="iconbtn" onClick={onClose}>Close <span className="kbd">esc</span></button></div>
          <div className="modal-b">{children}</div>
        </>)}
      </div>
    </div>
  );
}
