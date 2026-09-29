"use client";
import dynamic from "next/dynamic";

/** Client-only code editor (CodeMirror doesn't render on the server). */
const Editor = dynamic(() => import("./CodeEditor"), {
  ssr: false,
  loading: () => <div style={{ padding: 16, color: "#6b7389", fontFamily: "var(--f-mono)", fontSize: 13 }}>Loading editor…</div>
});
export default Editor;
