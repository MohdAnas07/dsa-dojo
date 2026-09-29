"use client";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { Prec, type Extension } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { go } from "@codemirror/lang-go";
import { useMemo, useRef } from "react";
import type { LangId } from "@/lib/languages";

/** Syntax support per language. Add new languages here. */
const LANG_EXT: Record<LangId, () => Extension> = {
  javascript: () => javascript(),
  typescript: () => javascript({ typescript: true }),
  python: () => python(),
  java: () => java(),
  cpp: () => cpp(),
  c: () => cpp(),
  go: () => go()
};

const dojoHighlight = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.moduleKeyword, t.operatorKeyword, t.definitionKeyword, t.modifier], color: "#ff9ec4" },
  { tag: [t.string, t.special(t.string), t.regexp, t.character], color: "#a6e3a1" },
  { tag: [t.number, t.bool, t.null, t.atom], color: "#f5b56b" },
  { tag: [t.comment, t.lineComment, t.blockComment, t.docComment], color: "#687089", fontStyle: "italic" },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#8ec7ff" },
  { tag: [t.propertyName], color: "#d8c3ff" },
  { tag: [t.className, t.typeName, t.standard(t.variableName)], color: "#f5b56b" },
  { tag: [t.self], color: "#ff9ec4" }
]);
const dojoTheme = EditorView.theme({ "&": { backgroundColor: "#0c0e13", color: "#e6e8ef" }, ".cm-content": { caretColor: "#f0b44c" } }, { dark: true });

export interface CodeEditorProps { value: string; onChange: (v: string) => void; lang: LangId; onRun?: () => void; onSubmit?: () => void }

export default function CodeEditor({ value, onChange, lang, onRun, onSubmit }: CodeEditorProps) {
  const runRef = useRef(onRun); runRef.current = onRun;
  const subRef = useRef(onSubmit); subRef.current = onSubmit;
  const extensions = useMemo(() => [
    LANG_EXT[lang](),
    syntaxHighlighting(dojoHighlight),
    dojoTheme,
    keymap.of([indentWithTab]),
    Prec.highest(keymap.of([
      { key: "Mod-Enter", run: () => { runRef.current?.(); return true; } },
      { key: "Shift-Mod-Enter", run: () => { (subRef.current || runRef.current)?.(); return true; } }
    ]))
  ], [lang]);
  return (
    <CodeMirror value={value} onChange={onChange} extensions={extensions} theme="none" height="100%" style={{ height: "100%" }}
      basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: true, bracketMatching: true, closeBrackets: true, autocompletion: true, indentOnInput: true, tabSize: lang === "python" || lang === "java" || lang === "cpp" || lang === "c" ? 4 : 2 }}
      aria-label="Code editor" />
  );
}
