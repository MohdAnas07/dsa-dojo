"use client";
import Link from "next/link";
import { PRI, TOPIC, PAT, DIFF, shortTitle } from "@/lib/data";
import { LESSONS } from "@/content/lessons";
import { PATH, LEVELS, TOPICS } from "@/content/roadmap";
import { update, useStore, type PStatus } from "@/lib/store";
import type { Priority, Problem } from "@/lib/types";
import { toast } from "./Toast";

export const PriPill = ({ p }: { p: Priority }) => <span className={`pill ${p}`}>{PRI[p][0]} {PRI[p][1]}</span>;
export const TopicLink = ({ slug }: { slug: string }) => TOPIC[slug] ? <Link href={`/learn/${slug}`}>{TOPIC[slug].title}</Link> : <>{slug}</>;

export const STATUS: Record<"todo" | PStatus, [string, string]> = { todo: ["☐", "Not started"], attempted: ["◐", "Attempted"], solved: ["✓", "Solved"], revise: ["★", "Revise"] };
export const STATUS_ORDER = ["todo", "attempted", "solved", "revise"] as const;

export function StatusButton({ id, title }: { id: string; title: string }) {
  const s = useStore(); const st = s.ps[id] || "todo";
  return (
    <button className={`sbtn ${st}`} title={`${STATUS[st][1]} (click to change)`} aria-label={`Status: ${STATUS[st][1]}`}
      onClick={() => {
        const nx = STATUS_ORDER[(STATUS_ORDER.indexOf(st) + 1) % 4];
        update(x => { if (nx === "todo") delete x.ps[id]; else x.ps[id] = nx; }, { activity: true });
        toast(`${title}: ${STATUS[nx][1]}`);
      }}>{STATUS[st][0]}</button>
  );
}

export function ProblemRow({ p }: { p: Problem }) {
  return (
    <div className="prow">
      <StatusButton id={p.id} title={p.t} />
      <div style={{ minWidth: 0 }}>
        <Link className="ttl" href={`/problems/${p.id}`}>{p.t}</Link>
        <div className="meta">
          <span className={`pill ${p.d}`}>{DIFF[p.d]}</span>
          {p.pats.slice(0, 2).map(x => <span key={x} className="pill">{PAT[x]?.name || x}</span>)}
          {p.topics.slice(0, 3).map(x => <span key={x} className="pill B">{shortTitle(TOPIC[x]?.title || x)}</span>)}
          {p.topics.length > 3 && <span className="faint" style={{ fontSize: 12 }}>+{p.topics.length - 3}</span>}
          <span className="faint hide-sm" style={{ fontSize: 12 }}>{p.co.slice(0, 3).join(" · ")}</span>
        </div>
      </div>
      <Link className="btn sm" href={`/problems/${p.id}`}>Solve →</Link>
    </div>
  );
}

export function PathChain({ here }: { here: string }) {
  const s = useStore();
  return (
    <div className="path">
      {PATH.map((k, i) => (
        <span key={k} style={{ display: "contents" }}>
          {i > 0 && <span className="sep">→</span>}
          <Link href={`/learn/${k}`} className={(s.done[k] ? "done" : "") + (k === here ? " here" : "")}>
            {s.done[k] ? "✓ " : <span className={`dot ${TOPIC[k].pri}${LESSONS[k] ? "" : " empty"}`} />}{shortTitle(TOPIC[k].title)}
          </Link>
        </span>
      ))}
    </div>
  );
}

export function Levels() {
  const s = useStore();
  return (
    <div className="grid g2">
      {LEVELS.map(L => {
        const items = TOPICS.filter(t => t.level === L.n);
        const done = items.filter(t => s.done[t.slug]).length;
        return (
          <div className="lvl" key={L.n}>
            <div className="lvl-h"><div><span className="eyebrow">Level {L.n}</span><h3>{L.name}</h3></div><span className="mono faint" style={{ fontSize: 12 }}>{done}/{items.length}</span></div>
            <p className="faint" style={{ fontSize: 13, marginBottom: 10 }}>{L.desc}</p>
            <div className="lvl-items">
              {items.map(t => (
                <Link key={t.slug} className={"chip" + (LESSONS[t.slug] ? "" : " soon") + (s.done[t.slug] ? " done" : "")} href={`/learn/${t.slug}`} title={PRI[t.pri][1] + (LESSONS[t.slug] ? "" : " · outline only")}>
                  <span className={`dot ${t.pri}`} />{t.title}{s.done[t.slug] && <span className="ck"> ✓</span>}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const Bullets = ({ items, cls = "", size = 14.5 }: { items: string[]; cls?: string; size?: number }) =>
  <ul className={"clean " + cls} style={{ fontSize: size }}>{items.map((x, i) => <li key={i}><span>{x}</span></li>)}</ul>;
