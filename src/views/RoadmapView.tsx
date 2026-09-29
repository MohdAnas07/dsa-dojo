"use client";
import Link from "next/link";
import { useStore, nextTopic } from "@/lib/store";
import { PRI } from "@/lib/data";
import { TOPICS } from "@/content/roadmap";
import { LESSONS } from "@/content/lessons";
import { PathChain, Levels, PriPill, TopicLink } from "@/components/ui";
import type { Priority } from "@/lib/types";

export default function RoadmapView() {
  const s = useStore();
  return (
    <div className="stack">
      <span className="eyebrow">Roadmap</span><h1>From zero to interview-ready</h1>
      <p className="lead">Don&apos;t study everything at once. Follow the colour: finish the green topics, then yellow, then blue. Red is advanced material for after you&apos;re comfortable. Solid chips have full lessons; dashed chips are outlines ready to be filled in.</p>
      <div className="row">{(Object.keys(PRI) as Priority[]).map(k => <PriPill key={k} p={k} />)}</div>
      <h2 style={{ marginTop: 10 }}>Dependency chain</h2>
      <PathChain here={nextTopic(s)} />
      <div className="card" style={{ marginTop: 6 }}>
        <h3 style={{ marginBottom: 8 }}>Why this order?</h3>
        <ul className="clean" style={{ fontSize: 14.5 }}>
          <li><span><b>Arrays → Strings → Hashing</b>: almost every problem stores data in one of these three.</span></li>
          <li><span><b>Two Pointers → Sliding Window → Binary Search</b>: the three techniques that turn O(n²) into O(n) or O(log n) on arrays.</span></li>
          <li><span><b>Linked List, Stack, Queue</b>: pointer manipulation and order of processing; queue unlocks BFS.</span></li>
          <li><span><b>Recursion → Trees → Graphs</b>: trees are recursion practice; graphs are trees with cycles.</span></li>
          <li><span><b>Greedy → Dynamic Programming</b>: last, because DP is recursion + memory and needs everything above.</span></li>
        </ul>
      </div>
      <h2 style={{ marginTop: 10 }}>All levels</h2>
      <Levels />
      <h2 style={{ marginTop: 10 }}>Every topic and what it needs first</h2>
      <div className="card tw" style={{ padding: "6px 8px" }}>
        <table className="t"><thead><tr><th>Topic</th><th>Priority</th><th>Needs first</th><th>Status</th></tr></thead>
          <tbody>{[...TOPICS].sort((a, b) => a.level - b.level).map(t => (
            <tr key={t.slug}>
              <td><TopicLink slug={t.slug} /><div className="faint" style={{ fontSize: 12.5 }}>{t.blurb}</div></td>
              <td><PriPill p={t.pri} /></td>
              <td style={{ fontSize: 13.5 }}>{t.pre.length ? t.pre.map((p, i) => <span key={p}>{i > 0 && ", "}<TopicLink slug={p} /></span>) : <span className="faint">nothing</span>}</td>
              <td>{s.done[t.slug] ? <span className="pill E">✓ done</span> : LESSONS[t.slug] ? <span className="pill">lesson ready</span> : <span className="pill" style={{ borderStyle: "dashed" }}>outline</span>}</td>
            </tr>))}
          </tbody>
        </table>
      </div>
      <p className="faint" style={{ fontSize: 13 }}>Want the next lesson? <Link href="/learn/heap">Heap</Link> and <Link href="/learn/graph">Graph</Link> are outlines ready to be written in the same 12-section format.</p>
    </div>
  );
}
