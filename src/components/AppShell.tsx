"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, Boxes, ChevronDown, Code2, Compass, Keyboard, ListChecks, Menu, Moon, Repeat, Search, Workflow } from "lucide-react";
import { useStore, update, type State } from "@/lib/store";
import { TOPIC, PROB, LESSON_PATH } from "@/lib/data";
import { LESSONS } from "@/content/lessons";
import { PROBLEMS } from "@/content/problems";
import { search, type SearchItem } from "@/lib/search";
import { startSync, takeFlash } from "@/lib/sync";
import { AccountButton } from "./Account";
import Modal from "./Modal";
import { Toaster, toast } from "./Toast";

type NavItem = [label: string, href: string];
const NAV: [string, React.ComponentType<{ size?: number }>, NavItem[]][] = [
  ["Getting Started", Compass, [["Dashboard", "/"], ["Roadmap", "/roadmap"], ["Big O", "/learn/big-o"], ["Problem Solving", "/framework"], ["Code Playground", "/playground"], ["JS for DSA", "/learn/js-for-dsa"]]],
  ["Data Structures", Boxes, [["Arrays", "/learn/arrays"], ["Strings", "/learn/strings"], ["HashMap / Set", "/learn/hashing"], ["Linked List", "/learn/linked-list"], ["Stack", "/learn/stack"], ["Queue", "/learn/queue"], ["Trees", "/learn/trees"], ["Heap", "/learn/heap"], ["Graph", "/learn/graph"], ["Trie", "/learn/trie"]]],
  ["Algorithms", Workflow, [["Searching", "/learn/binary-search"], ["Sorting", "/learn/sorting"], ["Recursion", "/learn/recursion"], ["Backtracking", "/learn/backtracking"], ["Greedy", "/learn/greedy"], ["Graph Algorithms", "/learn/bfs"], ["Dynamic Programming", "/learn/dp"]]],
  ["Patterns", BookOpen, [["Which pattern?", "/which"], ["All patterns", "/patterns"], ["Two Pointers", "/learn/two-pointers"], ["Sliding Window", "/learn/sliding-window"], ["Prefix Sum", "/learn/prefix-sum"], ["Binary Search", "/learn/binary-search"], ["Monotonic Stack", "/patterns#monotonic-stack"], ["Heap / Top K", "/patterns#top-k"], ["BFS", "/patterns#bfs"], ["DFS", "/patterns#dfs"], ["DP", "/patterns#dp"]]],
  ["Problems", ListChecks, [["All problems", "/problems"], ["Easy", "/problems?d=E"], ["Medium", "/problems?d=M"], ["Hard", "/problems?d=H"], ["Interview mode", "/interview"]]],
  ["Revision", Repeat, [["Cheat Sheets", "/revision"], ["Flashcards", "/flashcards"], ["Mistakes", "/mistakes"], ["Progress", "/progress"]]]
];

function crumbs(path: string) {
  const [, a, b] = path.split("/");
  if (a === "learn" && b) return <>Learn / <b>{TOPIC[b]?.title || b}</b></>;
  if (a === "problems" && b) return <>Problems / <b>{PROB[b]?.t || b}</b></>;
  const names: Record<string, string> = { "": "Dashboard", roadmap: "Roadmap", patterns: "Patterns", which: "Which pattern?", framework: "How to solve any problem", problems: "Problems", flashcards: "Flashcards", revision: "Cheat sheets", mistakes: "Mistake notebook", progress: "Progress", playground: "Code playground", login: "Sign in", privacy: "Privacy" };
  return <b>{names[a] ?? "DSA Dojo"}</b>;
}

function Sidebar({ s, path, onNavigate }: { s: State; path: string; onNavigate: () => void }) {
  return (
    <nav id="nav" aria-label="Roadmap">
      {NAV.map(([group, Icon, items]) => (
        <div key={group} className={"nav-group" + (s.navClosed[group] ? " closed" : "")}>
          <button className="nav-h" aria-expanded={!s.navClosed[group]} onClick={() => update(st => { st.navClosed[group] = !st.navClosed[group]; })}>
            <span className="lbl"><Icon size={13} />{group}</span><ChevronDown className="chev" size={13} />
          </button>
          <div className="nav-items">
            {items.map(([label, href]) => {
              let dot: React.ReactNode = null, right: React.ReactNode = null;
              if (href.startsWith("/learn/")) {
                const k = href.slice(7), t = TOPIC[k];
                dot = <span className={`dot ${t.pri}${LESSONS[k] ? "" : " empty"}`} />;
                if (s.done[k]) right = <span className="st done">✓</span>;
              }
              if (href.startsWith("/problems?d=")) {
                const d = href.slice(-1); const n = PROBLEMS.filter(p => p.d === d);
                right = <span className="st">{n.filter(p => s.ps[p.id] === "solved" || s.ps[p.id] === "revise").length}/{n.length}</span>;
              }
              if (href === "/mistakes" && s.mist.length) right = <span className="st">{s.mist.length}</span>;
              return <Link key={href} href={href} onClick={onNavigate} className={"nav-a" + (path === href ? " on" : "")}>{dot}{label}{right}</Link>;
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SearchCommand({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState(""); const [sel, setSel] = useState(0);
  const res: SearchItem[] = search(q);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => { listRef.current?.querySelector(".on")?.scrollIntoView({ block: "nearest" }); }, [sel]);
  const go = (href: string) => { onClose(); router.push(href); };
  return (
    <Modal title="Search" onClose={onClose} bare>
      <div className="modal-h"><Search size={16} className="faint" />
        <input autoFocus className="s-in" type="search" placeholder="Search topics, patterns, problems, O(log n)…" aria-label="Search" value={q}
          onChange={e => { setQ(e.target.value); setSel(0); }}
          onKeyDown={e => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSel(v => Math.min(res.length - 1, v + 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setSel(v => Math.max(0, v - 1)); }
            if (e.key === "Enter" && res[sel]) go(res[sel].href);
          }} />
        <span className="kbd">esc</span></div>
      <div className="s-res" ref={listRef}>
        {res.length ? res.map((r, i) => (
          <a key={r.href + r.k} className={"s-item" + (i === sel ? " on" : "")} href={r.href} onClick={e => { e.preventDefault(); go(r.href); }}>
            <span className="k">{r.k}</span><span style={{ minWidth: 0 }}><div className="tt">{r.t}</div><div className="ds">{r.d}</div></span>
          </a>
        )) : <div className="muted" style={{ padding: 18 }}>No matches. Try &quot;window&quot;, &quot;sorted&quot;, &quot;O(n)&quot;, or a company name.</div>}
      </div>
    </Modal>
  );
}

const SHORTCUTS: [string, string][] = [["/ or Ctrl+K", "Search everything"], ["E", "Toggle Explain-like-I'm-new mode"], ["[ and ]", "Previous / next lesson"], ["R", "Quick revision for this lesson"], ["G then H", "Go to dashboard"], ["G then P", "Go to problems"], ["T", "Toggle light / dark theme"], ["Ctrl+Enter", "Run code in an editor"], ["Ctrl+Shift+Enter", "Submit a solution"], ["Space, ← →", "Flashcards: flip, again, knew it"], ["?", "Show this help"], ["Esc", "Close dialogs"]];

export function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme");
  const dark = cur ? cur === "dark" : !matchMedia("(prefers-color-scheme: light)").matches;
  const next = dark ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  update(s => { s.theme = next; });
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const s = useStore();
  const path = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [keysOpen, setKeysOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const gRef = useRef(false);
  const wide = path === "/revision" || path === "/patterns" || path === "/playground";
  const xwide = path.startsWith("/problems/");

  const onKey = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen(true); return; }
    const t = e.target as HTMLElement;
    if (t.closest("input,textarea,select,[contenteditable=true],.cm-editor") || e.ctrlKey || e.metaKey || e.altKey) return;
    if (document.querySelector(".modal-bg")) return;
    if (gRef.current) { gRef.current = false; if (e.key === "h") router.push("/"); if (e.key === "p") router.push("/problems"); return; }
    if (e.key === "g") { gRef.current = true; setTimeout(() => (gRef.current = false), 900); return; }
    if (e.key === "/") { e.preventDefault(); setSearchOpen(true); }
    else if (e.key === "?") setKeysOpen(true);
    else if (e.key === "t") toggleTheme();
    else if (e.key === "e") { update(st => { st.eli = !st.eli; }); toast("Explanation mode switched"); }
    else if ((e.key === "[" || e.key === "]") && path.startsWith("/learn/")) {
      const i = LESSON_PATH.indexOf(path.slice(7)); const to = LESSON_PATH[i + (e.key === "]" ? 1 : -1)];
      if (i >= 0 && to) router.push("/learn/" + to);
    } else if (e.key === "r" && path.startsWith("/learn/")) window.dispatchEvent(new CustomEvent("dojo:revision"));
  }, [path, router]);
  useEffect(() => { window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [onKey]);
  useEffect(() => { setNavOpen(false); }, [path]);
  useEffect(() => { startSync(); const m = takeFlash(); if (m) setTimeout(() => toast(m, 5000), 300); }, []);

  return (
    <div className={navOpen ? "nav-open-wrap" : ""}>
      <div className="app">
        <aside className="side" aria-label="Roadmap navigation" style={navOpen ? { transform: "none" } : undefined}>
          <Link className="brand" href="/" style={{ color: "inherit", textDecoration: "none" }}><span className="brand-mark">{"{ }"}</span><span><b>DSA Dojo</b><small>Learn · Practice · Revise</small></span></Link>
          <button className="searchbtn" onClick={() => setSearchOpen(true)}><Search size={14} /><span>Search</span><span className="kbd">/</span></button>
          <Sidebar s={s} path={path} onNavigate={() => setNavOpen(false)} />
          <div className="faint" style={{ fontSize: 11.5, padding: "14px 8px 0", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span><span className="dot now" style={{ display: "inline-block" }} /> Now</span><span><span className="dot next" style={{ display: "inline-block" }} /> Next</span><span><span className="dot later" style={{ display: "inline-block" }} /> Later</span><span><span className="dot adv" style={{ display: "inline-block" }} /> Advanced</span>
          </div>
          <div className="faint" style={{ fontSize: 11.5, padding: "10px 8px 0" }}><Link href="/privacy" style={{ color: "inherit" }}>Privacy</Link> · <Link href="/term-of-service" style={{ color: "inherit" }}>Terms</Link></div>
        </aside>
        {navOpen && <div className="scrim" style={{ display: "block", position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 40 }} onClick={() => setNavOpen(false)} />}
        <div className="main">
          <header className="topbar">
            <button className="iconbtn menubtn" onClick={() => setNavOpen(v => !v)} aria-label="Open navigation"><Menu size={16} /></button>
            <div className="crumbs">{crumbs(path)}</div>
            <button className="iconbtn" onClick={() => setSearchOpen(true)} aria-label="Search"><Search size={15} /><span className="hide-sm">Search</span><span className="kbd hide-sm">/</span></button>
            <Link className="iconbtn hide-sm" href="/playground" aria-label="Code playground"><Code2 size={15} />Playground</Link>
            <button className="iconbtn hide-sm" onClick={() => setKeysOpen(true)} aria-label="Keyboard shortcuts"><Keyboard size={15} /></button>
            <button className="iconbtn" onClick={toggleTheme} aria-label="Toggle theme"><Moon size={15} /></button>
            <AccountButton />
          </header>
          <main id="content" className={"content" + (xwide ? " xwide" : wide ? " wide" : "")}>{children}</main>
        </div>
      </div>
      {searchOpen && <SearchCommand onClose={() => setSearchOpen(false)} />}
      {keysOpen && <Modal title="Keyboard shortcuts" onClose={() => setKeysOpen(false)}><table className="t"><tbody>{SHORTCUTS.map(([k, d]) => <tr key={k}><td><span className="kbd">{k}</span></td><td>{d}</td></tr>)}</tbody></table></Modal>}
      <Toaster />
    </div>
  );
}
