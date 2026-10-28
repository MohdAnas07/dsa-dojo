import type { Mode, PatternViz, Step } from "../types";
import { Stat } from "../prims";

interface Iv { id: number; s: number; e: number }
interface TS { lo: number; hi: number; rows: { id: number; s: number; e: number; st?: string; label?: string }[]; out: { id: string; s: number; e: number; st?: string }[]; outTitle: string; lanes?: boolean; stats: [string, string | number, ("good" | "sky" | "vio" | "accent" | "bad")?][]; marker?: number }

const W = 520, PADL = 8;
function TimeView({ s }: { s: TS }) {
  const X = (t: number) => PADL + ((t - s.lo) / Math.max(1, s.hi - s.lo)) * W;
  const ticks: number[] = []; const step = Math.max(1, Math.ceil((s.hi - s.lo) / 12));
  for (let t = s.lo; t <= s.hi; t += step) ticks.push(t);
  const rowH = 30, outRows = s.lanes ? Math.max(1, ...s.out.map(o => +o.id.split(":")[0] + 1)) : 1;
  return (
    <div className="pv-scene">
      <div className="pv-stats">{s.stats.map(([l, v, t]) => <Stat key={l} label={l} value={v} tone={t} />)}</div>
      <div className="pv-tl" style={{ width: W + PADL * 2 + 40 }}>
        <div className="pv-cap" style={{ textAlign: "left" }}>input{s.rows.some(r => r.label) ? " (sorted by start)" : ""}</div>
        <div className="pv-tl-area" style={{ height: s.rows.length * rowH + 4 }}>
          {s.rows.map((r, k) => <div key={r.id} className={"pv-bar " + (r.st || "")} style={{ transform: `translate(${X(r.s)}px, ${k * rowH}px)`, width: Math.max(6, X(r.e) - X(r.s)) }}><span>[{r.s}, {r.e}]</span></div>)}
          {s.marker !== undefined && <div className="pv-tl-mark" style={{ transform: `translateX(${X(s.marker)}px)` }} />}
        </div>
        <div className="pv-tl-axis">{ticks.map(t => <span key={t} style={{ transform: `translateX(${X(t)}px)` }}>{t}</span>)}</div>
        <div className="pv-cap" style={{ textAlign: "left", marginTop: 12 }}>{s.outTitle}</div>
        <div className="pv-tl-area out" style={{ height: outRows * rowH + 4 }}>
          {s.lanes && Array.from({ length: outRows }, (_, k) => <div key={"lane" + k} className="pv-lane" style={{ transform: `translateY(${k * rowH}px)` }}><em>room {k + 1}</em></div>)}
          {s.out.map(o => <div key={o.id} className={"pv-bar out " + (o.st || "")} style={{ transform: `translate(${X(o.s)}px, ${(s.lanes ? +o.id.split(":")[0] : 0) * rowH}px)`, width: Math.max(6, X(o.e) - X(o.s)) }}><span>[{o.s}, {o.e}]</span></div>)}
        </div>
      </div>
    </div>
  );
}

function parseIv(text: string): Iv[] {
  const parts = String(text ?? "").split(/[,;]\s*(?![^\[]*\])/).map(s => s.trim()).filter(Boolean);
  const out: Iv[] = [];
  for (const p of parts.length ? parts : []) {
    const m = p.replace(/[\[\]\s]/g, "").match(/^(-?\d+)(?:-|\.\.|,)(-?\d+)$/);
    if (!m) throw new Error(`Write intervals like "1-3, 2-6" (got "${p}").`);
    const s = +m[1], e = +m[2]; if (e < s) throw new Error(`Interval ${p}: end must be ≥ start.`);
    out.push({ id: out.length, s, e });
  }
  if (!out.length) throw new Error('Enter intervals like "1-3, 2-6, 8-10".');
  if (out.length > 8) throw new Error("Use at most 8 intervals.");
  if (out.some(x => Math.abs(x.s) > 999 || Math.abs(x.e) > 999)) throw new Error("Keep times between -999 and 999.");
  return out;
}

const merge: Mode<TS> = {
  id: "merge", label: "Merge intervals", task: "Sort by start, then each interval either extends the last merged one or starts a new one.",
  fields: [{ key: "a", label: "intervals", wide: true }],
  presets: [{ label: "Classic", values: { a: "1-3, 8-10, 2-6, 15-18" } }, { label: "Chain", values: { a: "5-7, 1-4, 4-5, 6-9, 12-13" } }, { label: "Nested", values: { a: "2-9, 3-4, 1-2, 5-7" } }],
  code: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);            //#sort
  const out = [intervals[0]];                       //#first
  for (const [s, e] of intervals.slice(1)) {        //#loop
    const last = out[out.length - 1];
    if (s <= last[1]) last[1] = Math.max(last[1], e); //#overlap
    else out.push([s, e]);                          //#push
  }
  return out;                                       //#ret
}`,
  legend: [["sky", "current interval"], ["accent", "last merged interval"], ["vio", "processed"], ["good", "result"]],
  counters: [["intervals read", ["ITER"]], ["overlap checks", ["COMPARE"]], ["merges", ["WRITE"]], ["new groups", ["PUSH"]]],
  complexity: { time: "O(n log n)", space: "O(n)", why: "Sorting dominates. After sorting, a single pass works because an interval can only overlap the group right before it: everything earlier ended even sooner." },
  run(v) {
    const iv = parseIv(v.a), out: Step<TS>[] = [];
    const lo = Math.min(...iv.map(x => x.s)), hi = Math.max(...iv.map(x => x.e));
    let rows = iv.map(x => ({ ...x })), sorted = false;
    const res: { id: string; s: number; e: number }[] = [];
    const snap = (o: { cur?: number; last?: boolean; done?: boolean } = {}): TS => ({ lo, hi, rows: rows.map((r, k) => ({ ...r, label: sorted ? "s" : undefined, st: o.done ? "dim" : k === o.cur ? "cur" : o.cur !== undefined && k < o.cur ? "mem" : undefined })), out: res.map((r, k) => ({ ...r, st: o.done ? "ok" : o.last && k === res.length - 1 ? "cmp" : "mem" })), outTitle: "merged", stats: [["merged groups", res.length, "good"]] });
    const insp = (next: string, extra: [string, string | number][] = []): [string, string | number][] => [...extra, ["out", res.map(r => `[${r.s},${r.e}]`).join(" ") || "[]"], ["next", next]];
    out.push({ ev: "INIT", s: snap(), at: "sort", what: "Here are the intervals in the order given.", why: "Unsorted, an interval could overlap something far away in the list.", next: "Sort by start time.", brief: "sort by start.", inspect: insp("sort") });
    rows = [...rows].sort((a, b) => a.s - b.s || a.e - b.e); sorted = true;
    out.push({ ev: "SWAP", s: snap(), at: "sort", what: "Sorted by start.", why: "Now any interval that overlaps the current group must come right after it.", next: "Start the result with the first interval.", brief: `sorted: ${rows.map(r => `[${r.s},${r.e}]`).join(" ")}.`, inspect: insp("take the first") });
    res.push({ id: "m" + rows[0].id, s: rows[0].s, e: rows[0].e });
    out.push({ ev: "PUSH", s: snap({ cur: 0, last: true }), at: "first", what: `Start with [${rows[0].s}, ${rows[0].e}].`, why: "It has the earliest start, so it opens the first group.", next: "Look at the next interval.", brief: "out = [first].", inspect: insp("next interval") });
    for (let k = 1; k < rows.length; k++) {
      const { s, e } = rows[k], last = res[res.length - 1], ov = s <= last.e;
      out.push({ ev: ["ITER", "COMPARE"], s: { ...snap({ cur: k, last: true }), marker: last.e }, at: "overlap", eval: ov, decision: { cond: "s <= last.end", values: `${s} <= ${last.e}`, result: ov, action: ov ? `extend last to ${Math.max(last.e, e)}` : "start a new group" }, what: `[${s}, ${e}] vs the last group [${last.s}, ${last.e}].`, why: ov ? `It starts at ${s}, before the group ends (${last.e}): they overlap.` : `It starts at ${s}, after the group ends (${last.e}): there's a gap.`, next: ov ? `End = max(${last.e}, ${e}) = ${Math.max(last.e, e)}.` : `Push [${s}, ${e}] as a new group.`, brief: ov ? `${s} ≤ ${last.e} ⇒ merge.` : `${s} > ${last.e} ⇒ new.`, inspect: insp(ov ? "merge" : "push", [["current", `[${s}, ${e}]`], ["last", `[${last.s}, ${last.e}]`]]),
        quiz: { q: `Last group is [${last.s}, ${last.e}]. Next is [${s}, ${e}]. What happens?`, options: [`Merge into [${last.s}, ${Math.max(last.e, e)}]`, `Start a new group [${s}, ${e}]`], answer: ov ? 0 : 1, why: ov ? `${s} ≤ ${last.e}, so they overlap (touching counts).` : `${s} > ${last.e}: there's a gap between them.` } });
      if (ov) { last.e = Math.max(last.e, e); out.push({ ev: "WRITE", s: snap({ cur: k, last: true }), at: "overlap", what: `Merged: the group is now **[${last.s}, ${last.e}]**.`, why: e <= last.e && e < Math.max(last.e, e) ? "" : "Its end grows to cover both.", next: "Next interval.", brief: `last = [${last.s},${last.e}].`, inspect: insp("next") }); }
      else { res.push({ id: "m" + rows[k].id, s, e }); out.push({ ev: "PUSH", s: snap({ cur: k, last: true }), at: "push", what: `New group **[${s}, ${e}]**.`, why: "Nothing earlier can overlap it.", next: "Next interval.", brief: `push [${s},${e}].`, inspect: insp("next") }); }
    }
    out.push({ ev: "DONE", s: snap({ done: true }), at: "ret", tone: "ok", what: `Result: ${res.map(r => `[${r.s}, ${r.e}]`).join(", ")}.`, why: `${iv.length} intervals became ${res.length}.`, next: "Return out.", brief: `return ${res.length} intervals. O(n log n).`, inspect: insp("done") });
    return out;
  },
  View: TimeView,
};

const rooms: Mode<TS> = {
  id: "rooms", label: "Meeting rooms", task: "Minimum rooms: give each meeting the room that frees up earliest, or open a new one.",
  fields: [{ key: "a", label: "meetings", wide: true }],
  presets: [{ label: "Classic", values: { a: "0-30, 5-10, 15-20" } }, { label: "Busy morning", values: { a: "9-10, 9-12, 10-11, 11-13, 12-14, 9-11" } }, { label: "Back to back", values: { a: "1-3, 3-5, 5-7" } }],
  code: `function minRooms(meetings) {
  meetings.sort((a, b) => a[0] - b[0]);          //#sort
  const ends = new MinHeap(); // end time per room
  for (const [s, e] of meetings) {               //#loop
    if (ends.size && ends.peek() <= s) ends.pop(); //#reuse
    ends.push(e);                                //#push
  }
  return ends.size;                              //#ret
}`,
  legend: [["sky", "meeting being placed"], ["accent", "room that frees up earliest"], ["vio", "booked"]],
  counters: [["meetings", ["ITER"]], ["rooms reused", ["POP"]], ["rooms opened", ["WRITE"]]],
  complexity: { time: "O(n log n)", space: "O(n)", why: "Sorting plus one heap operation per meeting. The heap keeps the earliest-ending room on top, so checking for a free room is O(1) and updating it O(log n)." },
  run(v) {
    const iv = parseIv(v.a), out: Step<TS>[] = [];
    const lo = Math.min(...iv.map(x => x.s)), hi = Math.max(...iv.map(x => x.e));
    const rows = [...iv].sort((a, b) => a.s - b.s || a.e - b.e);
    const roomEnd: number[] = [], placed: { id: string; s: number; e: number }[] = [];
    const snap = (o: { cur?: number; room?: number; done?: boolean } = {}): TS => ({ lo, hi, lanes: true, rows: rows.map((r, k) => ({ ...r, label: "s", st: k === o.cur ? "cur" : o.cur !== undefined && k < o.cur ? "mem" : o.done ? "mem" : undefined })), out: placed.map(p => ({ ...p, st: o.done ? "ok" : +p.id.split(":")[0] === o.room && o.room !== undefined ? "cmp" : "mem" })), outTitle: "rooms", stats: [["rooms", roomEnd.length, "good"]] });
    const insp = (next: string, extra: [string, string | number][] = []): [string, string | number][] => [...extra, ["room end times", roomEnd.map((e, k) => `r${k + 1}:${e}`).join(" ") || "none"], ["next", next]];
    out.push({ ev: "INIT", s: snap(), at: "sort", what: "Meetings sorted by start time.", why: "We'll place them in the order they begin.", next: "Place the first meeting.", brief: "sort by start.", inspect: insp("place") });
    rows.forEach((r, k) => {
      let best = -1; roomEnd.forEach((e, j) => { if (best < 0 || e < roomEnd[best]) best = j; });
      const free = best >= 0 && roomEnd[best] <= r.s;
      out.push({ ev: ["ITER", "COMPARE"], s: { ...snap({ cur: k, room: best >= 0 ? best : undefined }), marker: best >= 0 ? roomEnd[best] : undefined }, at: "reuse", eval: free, decision: { cond: "earliest end <= start", values: best >= 0 ? `${roomEnd[best]} <= ${r.s}` : "no rooms yet", result: free, action: free ? `reuse room ${best + 1}` : "open a new room" }, what: `Meeting [${r.s}, ${r.e}]. ${best >= 0 ? `The room that frees up earliest is room ${best + 1}, at ${roomEnd[best]}.` : "No rooms exist yet."}`, why: free ? `It's free by ${r.s}.` : best >= 0 ? `Even the earliest room is busy until ${roomEnd[best]}, so every room is busy at ${r.s}.` : "", next: free ? `Put it in room ${best + 1}.` : "Open a new room.", brief: free ? `reuse r${best + 1}.` : `new room #${roomEnd.length + 1}.`, inspect: insp(free ? "reuse" : "open room", [["meeting", `[${r.s}, ${r.e}]`]]),
        quiz: best >= 0 ? { q: `Earliest free time is ${roomEnd[best]} (room ${best + 1}); the meeting starts at ${r.s}. What happens?`, options: [`Reuse room ${best + 1}`, "Open a new room"], answer: free ? 0 : 1, why: free ? `${roomEnd[best]} ≤ ${r.s}: that room is empty when the meeting starts.` : `${roomEnd[best]} > ${r.s}: even the earliest room is still busy.` } : undefined });
      const room = free ? best : roomEnd.length;
      roomEnd[room] = r.e; placed.push({ id: `${room}:${r.id}`, s: r.s, e: r.e });
      out.push({ ev: free ? ["POP", "PUSH"] : ["WRITE", "PUSH"], s: snap({ cur: k, room }), at: "push", what: `Meeting [${r.s}, ${r.e}] → **room ${room + 1}**, busy until ${r.e}.`, why: free ? "No new room needed." : `We now need ${roomEnd.length} rooms.`, next: k < rows.length - 1 ? "Next meeting." : "All placed.", brief: `r${room + 1} until ${r.e}.`, inspect: insp("next") });
    });
    out.push({ ev: "DONE", s: snap({ done: true }), at: "ret", tone: "ok", what: `**${roomEnd.length} room${roomEnd.length > 1 ? "s" : ""}** are enough.`, why: "A new room was only opened when every existing room was busy.", next: "Return the count.", brief: `return ${roomEnd.length}. O(n log n).`, inspect: insp("done") });
    return out;
  },
  View: TimeView,
};

export const intervalsViz: PatternViz = { title: "Intervals", modes: [merge, rooms] };
