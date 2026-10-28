import { createElement as h } from "react";
import type { Mode, PatternViz, Step, Ev, Decision, Quiz } from "../types";
import { replay, show, isRef, arrOf, same, isTag, ents, type TraceFile, type State, type Enc, type TStep } from "./model";
import { TraceView, type TS } from "./TraceView";

export interface ProblemInfo { title: string; tc: string; sc: string; approach: string }

/** Stable positions for linked-list nodes across the whole example, so re-pointing `next` is visible as arrows changing. */
function listLayout(states: State[]) {
  const pos = new Map<number, { x: number; y: number }>(), used = new Set<string>();
  let rows = 0;
  for (const st of states) {
    const nodes = [...st.heap.entries()].filter(([, o]) => o.f.has("next") && !o.f.has("left"));
    const nextOf = (id: number) => { const n = st.heap.get(id)?.f.get("next"); return n && isRef(n) ? n.id : null; };
    const preds = new Map<number, number>(); for (const [id] of nodes) { const n = nextOf(id); if (n !== null) preds.set(n, id); }
    for (const [id] of nodes) {
      if (pos.has(id)) continue;
      let head = id; const guard = new Set<number>();
      while (preds.has(head) && !pos.has(preds.get(head)!) && !guard.has(head)) { guard.add(head); head = preds.get(head)!; }
      const p = preds.get(head), pp = p !== undefined ? pos.get(p) : undefined;
      let x = 0, y = rows;
      if (pp && !used.has(pp.x + 1 + "," + pp.y)) { x = pp.x + 1; y = pp.y; } else rows++;
      for (let cur: number | null = head, seen = new Set<number>(); cur !== null && !pos.has(cur) && !seen.has(cur); cur = nextOf(cur)) {
        seen.add(cur);
        while (used.has(x + "," + y)) x++;
        pos.set(cur, { x, y }); used.add(x + "," + y); x++;
      }
    }
  }
  return pos;
}

const evOf = (st: TStep): Ev[] => {
  switch (st.k) {
    case "x": return ["WRITE"];
    case "it": return ["ITER"];
    case "c": return st.loop ? ["ITER"] : ["COMPARE"];
    case "e": return ["PUSH"];
    case "r": case "o": return ["POP"];
    default: return ["DONE"];
  }
};

/** What changed between two states of the same call, in words. */
function effects(prev: State | undefined, cur: State): string[] {
  const out: string[] = [];
  const f = cur.frames[cur.frames.length - 1];
  const pf = prev && prev.frames.length >= cur.frames.length ? prev.frames[cur.frames.length - 1] : undefined;
  if (!pf) return out;
  for (const [k, v] of f.vars) {
    if (k === "this") continue;
    const was = pf.vars.get(k);
    if (was === undefined) { out.push(`\`${k}\` = ${show(v, cur.heap)}`); continue; }
    if (same(was, v)) continue;
    const a = arrOf(was), b = arrOf(v);
    if (a && b) {
      if (b.length === a.length + 1 && a.every((x, i) => same(x, b[i]))) out.push(`push ${show(b[b.length - 1], cur.heap)} onto \`${k}\``);
      else if (b.length === a.length - 1 && b.every((x, i) => same(x, a[i]))) out.push(`pop ${show(a[a.length - 1], prev!.heap)} from \`${k}\``);
      else if (b.length === a.length - 1 && b.every((x, i) => same(x, a[i + 1]))) out.push(`remove ${show(a[0], prev!.heap)} from the front of \`${k}\``);
      else if (b.length === a.length) {
        const diff = b.map((x, i) => (same(x, a[i]) ? -1 : i)).filter(i => i >= 0);
        if (diff.length <= 2) {
          for (const i of diff) {
            const ra = arrOf(a[i]), rb = arrOf(b[i]);
            if (ra && rb && ra.length === rb.length) { const j = rb.findIndex((x, jj) => !same(x, ra[jj])); out.push(`\`${k}[${i}][${j}]\` = ${show(rb[j], cur.heap)}`); }
            else out.push(`\`${k}[${i}]\` = ${show(b[i], cur.heap)}`);
          }
        } else out.push(`\`${k}\` updated (${diff.length} cells)`);
      } else out.push(`\`${k}\` is now ${show(v, cur.heap)}`);
      continue;
    }
    if ((isTag(v, "map") || isTag(v, "set") || isTag(v, "obj")) && (isTag(was, "map") || isTag(was, "set") || isTag(was, "obj"))) {
      const A = ents(was).map(x => JSON.stringify(x)), B = ents(v).map(x => JSON.stringify(x));
      const added = B.filter(x => !A.includes(x)).map(x => JSON.parse(x)), removed = A.filter(x => !B.includes(x)).map(x => JSON.parse(x));
      const key = (x: unknown) => (isTag(v, "set") ? show(x as Enc, cur.heap) : isTag(v, "obj") ? String((x as [string])[0]) : show((x as [Enc])[0], cur.heap));
      for (const x of added) out.push(isTag(v, "set") ? `add ${key(x)} to \`${k}\`` : `\`${k}\`[${key(x)}] = ${show((x as [Enc, Enc])[1], cur.heap)}`);
      for (const x of removed) if (!added.some(y => key(y) === key(x))) out.push(isTag(v, "set") ? `remove ${key(x)} from \`${k}\`` : `delete ${key(x)} from \`${k}\``);
      continue;
    }
    out.push(`\`${k}\`: ${show(was, prev!.heap)} → ${show(v, cur.heap)}`);
  }
  // pointer fields rewired (list.next, tree.left/right) and object fields (this.x)
  if (prev) for (const [id, o] of cur.heap) {
    const p = prev.heap.get(id); if (!p) continue;
    for (const [fld, val] of o.f) {
      const was = p.f.get(fld);
      if (was !== undefined && !same(was, val) && out.length < 6) {
        const label = o.f.has("val") ? `${o.c}(${show(o.f.get("val")!, cur.heap)})` : "this";
        out.push(`\`${label}.${fld}\` → ${show(val, cur.heap)}`);
      }
    }
  }
  return out.slice(0, 6);
}

export function buildTraceViz(meta: TraceFile, info: ProblemInfo): PatternViz {
  const lines = meta.code.replace(/\n$/, "").split("\n");
  const code = lines.map((l, i) => l + "  //#L" + (i + 1)).join("\n");
  const T = (st: TStep) => (st.s !== undefined ? meta.texts[st.s] : lines[st.l - 1]?.trim() ?? "");
  const nextLine = (sts: State[], i: number) => { const n = sts[i + 1]; if (!n) return null; return n.step.l ? `line ${n.step.l}: \`${T(n.step).slice(0, 60)}\`` : null; };

  const mode: Mode<TS> = {
    id: "trace", label: "Reference solution", task: `${info.title}: the reference solution, line by line.`,
    fields: [],
    presets: meta.examples.map((_, i) => ({ label: `Example ${i + 1}`, values: { ex: String(i) } })),
    code,
    legend: [["sky", "pointer / current"], ["accent", "being compared"], ["good", "just changed"], ["vio", "stored"]],
    counters: [["lines run", ["WRITE"]], ["loop checks", ["ITER"]], ["if checks", ["COMPARE"]], ["function calls", ["PUSH"]]],
    complexity: { time: info.tc || "–", space: info.sc || "–", why: info.approach || "" },
    run(v) {
      const ex = meta.examples[+(v.ex ?? 0)] ?? meta.examples[0];
      const states = replay(ex);
      const nodeVars = new Set<string>();
      for (const s of states) for (const f of s.frames) for (const [k, x] of f.vars) if (isRef(x) && s.heap.get(x.id)?.f.has("val")) nodeVars.add(k);
      const lists = listLayout(states);
      const short = (x: unknown, n: number) => { const t = JSON.stringify(x); return t.length > n ? t.slice(0, n - 1) + "…" : t; };
      const design = ex.input[0]?.[0] === "operations";
      const header = design
        ? (() => {
            const ops = ex.input[0][1] as string[], args = ex.input[1][1] as unknown[][], outs = ex.output as unknown[];
            const calls = ops.map((op, i) => (i === 0 ? `new ${op}(${args[i].map(a => short(a, 20)).join(", ")})` : `${op}(${args[i].map(a => short(a, 20)).join(", ")})${outs[i] !== null && outs[i] !== undefined ? " → " + short(outs[i], 16) : ""}`));
            return h("div", { className: "pv-io" }, "Calls: ", h("b", null, calls.slice(0, 9).join("  ·  ") + (calls.length > 9 ? "  · …" : "")));
          })()
        : h("div", { className: "pv-io" }, "Input: ", ...ex.input.flatMap(([n, x], i) => [i ? ", " : "", n, " = ", h("b", { key: n }, short(x, 70))]), "  ·  Expected output: ", h("b", null, short(ex.output, 50)));
      const steps: Step<TS>[] = states.map((st, i) => {
        const s = st.step, prev = i > 0 ? states[i - 1] : undefined;
        const frame = st.frames[st.frames.length - 1], depth = st.frames.length - 1;
        const heap = st.heap;
        const fx = effects(prev, st);
        const next = nextLine(states, i);
        const txt = T(s);
        const inspect: [string, string][] = [...frame.vars.entries()].filter(([k]) => k !== "this").slice(0, 12).map(([k, x]) => [k, show(x, heap).slice(0, 48)]);
        if (depth > 1) inspect.push(["call stack", st.frames.slice(1).map(f => f.fn).join(" → ")]);
        const base = { ev: evOf(s), s: { st, prev, meta, lists, nodeVars, header } as TS, at: s.l ? "L" + s.l : undefined, inspect };
        let what = "", why: string | undefined, nxt: string | undefined = next ? `Then ${next}.` : undefined, brief = "", tone: Step<TS>["tone"], decision: Decision | undefined, quiz: Quiz | undefined, ev: boolean | undefined;
        switch (s.k) {
          case "e": {
            const args = frame.params.filter(k => frame.vars.has(k)).map(k => `${k} = ${show(frame.vars.get(k)!, heap)}`).join(", ");
            what = `Call **${s.fn}**${args ? ` with ${args.slice(0, 140)}` : ""}.`;
            why = depth > 1 ? `This call is ${depth} deep on the call stack; the caller waits until it returns.` : "The solution starts with the example input.";
            brief = `call ${s.fn}(${args.slice(0, 60)})`;
            break;
          }
          case "x": case "it": case "j": {
            what = s.k === "it" ? `Next iteration of \`${txt.slice(0, 70)}\`${fx.length ? `: ${fx.join(", ")}` : ""}.` : s.k === "j" ? `\`${txt}\`: ${/^break/.test(txt) ? "leave the loop now" : /^continue/.test(txt) ? "skip to the next iteration" : "stop here"}.` : `Run \`${txt.slice(0, 90)}\`${fx.length ? `: ${fx.join(", ")}` : "."}`;
            if (s.k === "x" && fx.length === 0) why = /\w\(/.test(txt) ? "The call finished without changing anything visible in this function." : "No value visible here changed.";
            brief = fx.length ? fx.join("; ") : txt.slice(0, 80);
            break;
          }
          case "c": {
            const vals = s.op ? `${show(s.a as Enc, heap)} ${s.op} ${show(s.b as Enc, heap)}` : `→ ${s.res}`;
            const action = s.loop ? (s.res ? "run the loop body" : "leave the loop") : (s.res ? "run the if-block" : "skip the if-block");
            decision = { cond: txt.slice(0, 70), values: vals, result: !!s.res, action };
            ev = !!s.res;
            what = `${s.loop ? "Loop check" : "Check"} \`${txt.slice(0, 80)}\`${s.op ? ` (${vals})` : ""}: **${s.res}**.${fx.length ? ` (${fx.join(", ")})` : ""}`;
            why = s.loop ? (s.res ? "The condition still holds, so another iteration runs." : "The condition failed, so the loop is over.") : s.res ? "The condition holds." : "The condition doesn't hold.";
            nxt = `So ${action}.` + (next ? ` Then ${next}.` : "");
            brief = `${txt.slice(0, 50)} → ${s.res}`;
            if (!s.loop) quiz = { q: `Is \`${txt.slice(0, 80)}\` true or false right now?${s.op ? ` (left side = ${show(s.a as Enc, heap)}, right side = ${show(s.b as Enc, heap)})` : ""}`, options: ["true", "false"], answer: s.res ? 0 : 1, why: s.op ? `${vals} is ${s.res}.` : `It evaluates to ${s.res} with the current values.` };
            break;
          }
          case "r": case "o": {
            const caller = st.frames[st.frames.length - 2];
            const none = s.k === "o" || isTag(s.val as Enc, "u");
            const val = none ? "nothing" : show(s.val as Enc, heap);
            what = none ? `\`${frame.fn}\` finishes (no return value).` : `\`${frame.fn}\` returns **${val}**.`;
            why = depth > 1 && caller ? `Control goes back to \`${caller.fn}\`, which continues where it called it.` : depth === 1 ? "That's the final answer for this example." : undefined;
            if (depth === 1) { tone = "ok"; nxt = undefined; }
            brief = none ? `${frame.fn} done` : `return ${val}`;
            break;
          }
        }
        if (s.k === "r" && depth === 1 && ex.truncated) why = (why || "") + " (Long trace: only the first 400 steps are shown.)";
        return { ...base, what, why, next: nxt, brief, decision, quiz, eval: ev, tone };
      });
      if (ex.truncated) steps.push({ ev: "DONE", s: steps[steps.length - 1].s, what: "This example takes more than 400 steps, so the replay stops here.", why: "Pick a shorter example above to watch it to the end.", brief: "trace cut at 400 steps", inspect: steps[steps.length - 1].inspect, tone: "bad" });
      return steps;
    },
    View: TraceView,
  };
  return { title: info.title, modes: [mode] };
}
