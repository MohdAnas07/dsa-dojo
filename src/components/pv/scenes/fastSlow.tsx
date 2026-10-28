import type { Mode, PatternViz, Step } from "../types";
import { nums, int } from "../types";
import { Net, Stat, type NNode, type NEdge } from "../prims";

interface FS { vals: number[]; pos: number; xy: [number, number][]; w: number; h: number; slow: number | null; fast: number | null; met?: number; start?: number; phase: 1 | 2; trail: number[]; stats: [string, string | number, ("good" | "sky" | "vio" | "accent" | "bad")?][] }

function shape(n: number, pos: number) {
  const gap = 78, R = 26;
  if (pos < 0) { const xy: [number, number][] = Array.from({ length: n }, (_, i) => [40 + i * gap, 70]); return { xy, w: 40 + (n - 1) * gap + 50, h: 140 }; }
  const loop = n - pos, rad = Math.max(62, (loop * (2 * R + 26)) / (2 * Math.PI));
  const cx = 40 + pos * gap + rad, cy = rad + 34;
  const xy: [number, number][] = [];
  for (let i = 0; i < pos; i++) xy.push([40 + i * gap, cy]);
  for (let k = 0; k < loop; k++) { const t = Math.PI + (2 * Math.PI * k) / loop; xy.push([cx + rad * Math.cos(t), cy + rad * Math.sin(t)]); }
  return { xy, w: cx + rad + 45, h: cy + rad + 40 };
}

function View({ s }: { s: FS }) {
  const n = s.vals.length;
  const nodes: NNode[] = s.vals.map((v, i) => ({ id: i, x: s.xy[i][0], y: s.xy[i][1], v, st: i === s.met ? "ok" : i === s.start ? "ok" : i === s.slow && i === s.fast ? "cmp" : i === s.slow || i === s.fast ? "cur" : s.trail.includes(i) ? "mem" : undefined, sub: i === 0 ? "head" : undefined }));
  const edges: NEdge[] = s.vals.map((_, i) => ({ a: i, b: i + 1 < n ? i + 1 : s.pos, dir: true, st: i === n - 1 && s.pos >= 0 ? "vis" : undefined })).filter(e => e.b !== -1 && e.b !== undefined && (e.b as number) < n);
  const tag = (i: number | null, name: string, tone: "sky" | "vio", dy: number) => i === null ? null : { id: name, x: s.xy[i][0], y: s.xy[i][1] - 26 - dy, text: name, tone };
  const both = s.slow !== null && s.slow === s.fast;
  const tags = [tag(s.slow, "slow ×1", "sky", 0), tag(s.fast, "fast ×2", "vio", both ? 22 : 0)].filter(Boolean) as { id: string; x: number; y: number; text: string; tone: "sky" | "vio" }[];
  return (
    <div className="pv-scene">
      <div className="pv-stats">{s.stats.map(([l, v, t]) => <Stat key={l} label={l} value={v} tone={t} />)}</div>
      <div style={{ paddingTop: 30 }}><Net nodes={nodes} edges={edges} w={s.w} h={s.h} r={22} tags={tags} /></div>
    </div>
  );
}

const detect: Mode<FS> = {
  id: "cycle", label: "Find the cycle start", task: "Floyd's tortoise and hare: if there's a loop, the fast pointer laps the slow one. Then find where the loop begins.",
  fields: [{ key: "a", label: "values", wide: true }, { key: "p", label: "tail → index", placeholder: "-1 = no cycle" }],
  presets: [{ label: "Loop at 2", values: { a: "3, 2, 0, -4, 7, 5", p: "2" } }, { label: "Loop at 0", values: { a: "1, 2, 3, 4", p: "0" } }, { label: "No cycle", values: { a: "1, 2, 3, 4, 5", p: "-1" } }, { label: "Long tail", values: { a: "9, 8, 7, 6, 5, 4, 3", p: "4" } }],
  code: `function detectCycle(head) {
  let slow = head, fast = head;                //#init
  while (fast && fast.next) {                  //#loop
    slow = slow.next; fast = fast.next.next;   //#move
    if (slow === fast) break;                  //#meet
  }
  if (!fast || !fast.next) return null;        //#none
  slow = head;                                 //#reset
  while (slow !== fast) {                      //#phase2
    slow = slow.next; fast = fast.next;        //#step
  }
  return slow;                                 //#ret
}`,
  legend: [["sky", "slow / fast pointer"], ["accent", "both on the same node"], ["vio", "visited by slow"], ["good", "meeting point / cycle start"]],
  counters: [["moves", ["POINTER_MOVE"]], ["comparisons", ["COMPARE"]]],
  complexity: { time: "O(n)", space: "O(1)", why: "Once both are in the loop, fast gains one node per step, so it catches slow within one lap. Phase 2 walks at most n more steps. No hash set of visited nodes is needed: just two pointers." },
  run(v) {
    const vals = nums(v.a, "values", 9), pos = int(v.p, "tail → index", -1, vals.length - 1), n = vals.length, out: Step<FS>[] = [];
    if (n < 2) throw new Error("Use at least 2 nodes.");
    const L = shape(n, pos);
    const next = (i: number | null) => (i === null ? null : i + 1 < n ? i + 1 : pos >= 0 ? pos : null);
    let slow: number | null = 0, fast: number | null = 0, steps = 0;
    const trail = new Set<number>([0]);
    const snap = (o: Partial<FS> = {}): FS => ({ vals, pos, xy: L.xy, w: L.w, h: L.h, slow, fast, phase: 1, trail: [...trail], stats: [["phase", o.phase === 2 ? "2: find start" : "1: detect", "sky"], ["steps", steps], ["fast is ahead by", o.phase === 2 ? "–" : `${steps} node${steps === 1 ? "" : "s"}`, "vio"]], ...o });
    const where = (i: number | null) => (i === null ? "null" : `node ${i} (${vals[i]})`);
    const insp = (next_: string, extra: [string, string | number][] = []): [string, string | number][] => [["slow", where(slow)], ["fast", where(fast)], ...extra, ["next", next_]];
    out.push({ ev: "INIT", s: snap(), at: "init", what: "Both pointers start at the head.", why: "slow moves 1 node per step, fast moves 2. On a straight list fast just runs off the end; in a loop it must eventually catch slow from behind.", next: "Move them.", brief: "slow = fast = head.", inspect: insp("move") });
    let met = false;
    for (;;) {
      const canMove = fast !== null && next(fast) !== null;
      if (!canMove) break;
      steps++;
      const ps = slow, pf = fast;
      slow = next(slow); fast = next(next(fast));
      if (slow !== null) trail.add(slow);
      out.push({ ev: ["POINTER_MOVE", "POINTER_MOVE"], s: snap(), at: ["loop", "move"], what: `slow: ${ps} → **${slow}**. fast: ${pf} → ${next(pf)} → **${fast ?? "null"}**.`, why: "fast covers twice the distance.", next: fast === null ? "fast fell off the end." : "Have they met?", brief: `slow=${slow}, fast=${fast ?? "null"}.`, inspect: insp("compare") });
      if (fast === null) break;
      const eq = slow === fast;
      out.push({ ev: "COMPARE", s: snap({ met: eq ? slow! : undefined }), at: "meet", eval: eq, tone: eq ? "find" : undefined, decision: { cond: "slow === fast", values: `${slow} === ${fast}`, result: eq, action: eq ? "they met: there is a cycle" : "keep going" }, what: eq ? `They meet at **node ${slow}**.` : `Not the same node yet (slow ${slow}, fast ${fast}).`, why: eq ? "A pointer can only catch up from behind if the list loops back." : "fast closes the gap by one node every step.", next: eq ? "Phase 2: find where the loop starts." : "Move again.", brief: eq ? `meet at ${slow}.` : "≠.", inspect: insp(eq ? "phase 2" : "move"),
        quiz: steps === 1 && !eq ? { q: "fast moves 2 nodes per step, slow moves 1. If there is a loop, what must happen?", options: ["fast eventually lands on slow", "fast can jump over slow forever", "they never meet"], answer: 0, why: "Inside the loop the gap shrinks by exactly 1 each step, so it hits 0; fast can't skip over slow." } : undefined });
      if (eq) { met = true; break; }
    }
    if (!met) { out.push({ ev: "NOT_FOUND", s: snap(), at: "none", tone: "bad", what: "fast reached the end of the list: **no cycle**.", why: "A list with a loop never ends.", next: "Return null.", brief: "return null. O(n), O(1).", inspect: insp("return null") }); return out; }
    const meet = slow!;
    slow = 0; trail.clear(); trail.add(0);
    out.push({ ev: "POINTER_MOVE", s: snap({ phase: 2, met: meet }), at: "reset", what: `Put slow back at the head; fast stays at the meeting point (node ${meet}).`, why: "Math fact: the distance from the head to the loop start equals the distance from the meeting point to the loop start (going around). So if both now move 1 step at a time, they meet exactly at the start.", next: "Move both one step at a time.", brief: "slow = head; both ×1.", inspect: insp("phase 2"),
      quiz: { q: "In phase 2, how fast should each pointer move?", options: ["Both 1 step", "slow 1, fast 2", "Only slow moves"], answer: 0, why: "Moving at the same speed, they cover equal distances and arrive at the loop start together." } });
    while (slow !== fast) {
      steps++;
      slow = next(slow); fast = next(fast);
      out.push({ ev: ["POINTER_MOVE", "POINTER_MOVE", "COMPARE"], s: snap({ phase: 2 }), at: ["phase2", "step"], eval: slow !== fast, decision: { cond: "slow !== fast", values: `${slow} !== ${fast}`, result: slow !== fast, action: slow !== fast ? "step both again" : "stop: this is the start" }, what: `Both step: slow → ${slow}, fast → ${fast}.`, why: slow === fast ? "Same node." : "Not yet.", next: slow === fast ? "That's the cycle start." : "Step again.", brief: `slow=${slow}, fast=${fast}.`, inspect: insp(slow === fast ? "return" : "step") });
    }
    out.push({ ev: "FOUND_RESULT", s: snap({ phase: 2, start: slow!, slow, fast }), at: "ret", tone: "ok", what: `The cycle starts at **node ${slow}** (value ${vals[slow!]}).`, why: `That's where the tail points back to (index ${pos}).`, next: "Return it.", brief: `return node ${slow}. O(n) time, O(1) space.`, inspect: insp("done") });
    return out;
  },
  View,
};

export const fastSlowViz: PatternViz = { title: "Fast & Slow Pointers", modes: [detect] };
