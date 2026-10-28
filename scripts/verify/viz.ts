/**
 * Checks every pattern visualizer: runs each mode on its presets and on random inputs, then verifies
 *  - trace structure (code tags exist, explanations present, quiz answers valid, events typed),
 *  - correctness of the final answer against an independent brute-force reference.
 * Run: npm run verify:viz
 */
import { PVIZ } from "../../src/components/pv";
import type { Step } from "../../src/components/pv/types";

let fails = 0, checks = 0;
const fail = (m: string) => { fails++; console.error("✗ " + m); };
const ok = (c: boolean, m: string) => { checks++; if (!c) fail(m); };

function tagsOf(code: string) { const t = new Set<string>(); for (const l of code.split("\n")) { const m = l.match(/\/\/#([\w-]+)\s*$/); if (m) t.add(m[1]); } return t; }

function structure(name: string, code: string, steps: Step<unknown>[]) {
  const tags = tagsOf(code);
  ok(steps.length >= 2, `${name}: only ${steps.length} step(s)`);
  steps.forEach((s, i) => {
    const at = s.at === undefined ? [] : Array.isArray(s.at) ? s.at : [s.at];
    for (const t of at) ok(tags.has(t), `${name} step ${i + 1}: unknown code tag "${t}"`);
    ok(typeof s.what === "string" && s.what.length > 2, `${name} step ${i + 1}: missing "what"`);
    ok(typeof s.brief === "string" && s.brief.length > 1, `${name} step ${i + 1}: missing "brief"`);
    ok(Array.isArray(s.inspect) && s.inspect.length > 0, `${name} step ${i + 1}: empty inspector`);
    ok(!/undefined|NaN/.test(s.what + s.brief + (s.why ?? "") + (s.next ?? "")), `${name} step ${i + 1}: text contains undefined/NaN: ${s.what} | ${s.brief}`);
    ok(!s.inspect.some(([, v]) => v === "undefined" || (typeof v === "number" && Number.isNaN(v))), `${name} step ${i + 1}: inspector has undefined/NaN`);
    if (s.eval !== undefined) ok(at.length > 0, `${name} step ${i + 1}: eval without a code line`);
    if (s.quiz) {
      ok(s.quiz.answer >= 0 && s.quiz.answer < s.quiz.options.length, `${name} step ${i + 1}: quiz answer out of range`);
      ok(new Set(s.quiz.options).size === s.quiz.options.length, `${name} step ${i + 1}: duplicate quiz options ${JSON.stringify(s.quiz.options)}`);
    }
    if (s.decision) ok(!!s.decision.cond && !!s.decision.values && !!s.decision.action, `${name} step ${i + 1}: incomplete decision`);
  });
}

const last = (st: Step<unknown>[]) => st[st.length - 1];
const txt = (s: Step<unknown>) => s.what + " " + s.brief + " " + JSON.stringify(s.inspect);

// ---------- brute-force references, keyed by "<lesson>/<mode>" ----------
type Ref = (v: Record<string, string>, steps: Step<unknown>[]) => string | null; // returns an error message or null
const N = (s: string) => s.split(/[\s,\[\]]+/).filter(Boolean).map(Number);
const has = (steps: Step<unknown>[], needle: string) => txt(last(steps)).includes(needle);

const REFS: Record<string, Ref> = {
  "two-pointers/pair": (v, st) => {
    const a = N(v.a).sort((x, y) => x - y), t = +v.t; let any = false;
    for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] + a[j] === t) any = true;
    const m = last(st).brief.match(/return \[(\d+), (\d+)\]/i);
    if (!any) return m ? "found a pair where none exists" : null;
    if (!m) return "missed an existing pair";
    return a[+m[1]] + a[+m[2]] === t ? null : "returned pair doesn't sum to target";
  },
  "two-pointers/water": (v, st) => { const a = N(v.a); let b = 0; for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) b = Math.max(b, Math.min(a[i], a[j]) * (j - i)); return has(st, `return ${b}.`) ? null : `expected ${b}`; },
  "two-pointers/rev": (v, st) => has(st, "[" + N(v.a).reverse().join(", ") + "]") ? null : "not reversed",
  "sliding-window/fixed": (v, st) => { const a = N(v.a), k = +v.k; let b = -Infinity; for (let i = 0; i + k <= a.length; i++) b = Math.max(b, a.slice(i, i + k).reduce((x, y) => x + y, 0)); return has(st, `return ${b}.`) ? null : `expected ${b}`; },
  "sliding-window/var": (v, st) => { const s = [...v.s.trim()]; let b = 0; for (let i = 0; i < s.length; i++) for (let j = i; j < s.length; j++) if (new Set(s.slice(i, j + 1)).size === j - i + 1) b = Math.max(b, j - i + 1); return has(st, `return ${b}.`) ? null : `expected ${b}`; },
  "hashing/twosum": (v, st) => {
    const a = N(v.a), t = +v.t; let any = false; for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] + a[j] === t) any = true;
    const m = last(st).brief.match(/return \[(\d+), (\d+)\]/);
    if (!any) return m ? "found a pair where none exists" : null;
    if (!m) return "missed a pair"; return a[+m[1]] + a[+m[2]] === t && +m[1] !== +m[2] ? null : "bad pair";
  },
  "hashing/dup": (v, st) => { const a = N(v.a); const d = new Set(a).size !== a.length; return has(st, d ? "return true" : "return false") ? null : `expected ${d}`; },
  "hashing/freq": (v, st) => { const s = [...v.s.trim()]; const i = s.findIndex(c => s.filter(x => x === c).length === 1); return has(st, `return ${i}.`) ? null : `expected ${i}`; },
  "binary-search/find": (v, st) => { const a = N(v.a).sort((x, y) => x - y), t = +v.t; const m = last(st).brief.match(/return (-?\d+)/); if (!m) return "no return"; const r = +m[1]; return (r === -1 ? !a.includes(t) : a[r] === t) ? null : `bad index ${r}`; },
  "binary-search/lower": (v, st) => { const a = N(v.a).sort((x, y) => x - y), t = +v.t; let i = a.findIndex(x => x >= t); if (i < 0) i = a.length; return has(st, `return ${i}.`) ? null : `expected ${i}`; },
  "binary-search/answer": (v, st) => { const p = N(v.p), h = +v.h; let k = 1; while (p.reduce((s, x) => s + Math.ceil(x / k), 0) > h) k++; return has(st, `return ${k}.`) ? null : `expected ${k}`; },
  "prefix-sum/range": (v, st) => { const a = N(v.a); for (const q of v.q.split(",")) { const [i, j] = q.trim().split("-").map(Number); const s = a.slice(i, j + 1).reduce((x, y) => x + y, 0); if (!st.some(x => x.brief === `= ${s}.`)) return `query ${q} expected ${s}`; } return null; },
  "prefix-sum/k": (v, st) => { const a = N(v.a), k = +v.k; let c = 0; for (let i = 0; i < a.length; i++) { let s = 0; for (let j = i; j < a.length; j++) { s += a[j]; if (s === k) c++; } } return has(st, `return ${c}.`) ? null : `expected ${c}`; },
  "monotonic-stack/days": (v, st) => { const a = N(v.a); const r = a.map((x, i) => { const j = a.findIndex((y, k) => k > i && y > x); return j < 0 ? 0 : j - i; }); return has(st, `return [${r.join(", ")}]`) ? null : `expected [${r}]`; },
  "monotonic-stack/nge": (v, st) => { const a = N(v.a); const r = a.map((x, i) => { const j = a.findIndex((y, k) => k > i && y > x); return j < 0 ? -1 : a[j]; }); return has(st, `return [${r.join(", ")}]`) ? null : `expected [${r}]`; },
  "heap/topk": (v, st) => { const a = N(v.a), k = +v.k; const r = [...a].sort((x, y) => y - x)[k - 1]; return has(st, `return ${r}.`) ? null : `expected ${r}`; },
  "bfs/graph": (v, st) => {
    const edges = v.e.split(",").map(s => s.trim().split("-")); const adj = new Map<string, string[]>();
    for (const [a, b] of edges) { (adj.get(a) || adj.set(a, []).get(a)!).push(b); (adj.get(b) || adj.set(b, []).get(b)!).push(a); }
    const d: Record<string, number> = { [v.s]: 0 }, q = [v.s]; while (q.length) { const u = q.shift()!; for (const w of adj.get(u) || []) if (!(w in d)) { d[w] = d[u] + 1; q.push(w); } }
    const want = Object.entries(d).map(([k, x]) => `${k}=${x}`).sort().join(","); const got = (last(st).what.match(/: (.*?)\./)?.[1] || "").split(", ").sort().join(",");
    return want === got ? null : `dist ${got} vs ${want}`;
  },
  "bfs/grid": (v, st) => {
    const g = v.g.split("/").map(r => r.trim().split(/\s+/).map(Number)); const R = g.length, C = g[0].length; const t = g.map(r => r.map(x => (x === 2 ? 0 : x === 1 ? Infinity : -1)));
    let ch = true; while (ch) { ch = false; for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (t[r][c] >= 0 && t[r][c] < Infinity) for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nr = r + dr, nc = c + dc; if (nr >= 0 && nc >= 0 && nr < R && nc < C && t[nr][nc] > t[r][c] + 1 && g[nr][nc] === 1) { t[nr][nc] = t[r][c] + 1; ch = true; } } }
    const flat = t.flat(); const ans = flat.includes(Infinity) ? -1 : Math.max(0, ...flat.filter(x => x >= 0));
    return has(st, `return ${ans}.`) ? null : `expected ${ans}`;
  },
  "dfs/islands": (v, st) => {
    const g = v.g.split("/").map(r => r.trim().split(/\s+/)); const seen = new Set<string>(); let n = 0;
    const f = (r: number, c: number): void => { if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] !== "1" || seen.has(r + "," + c)) return; seen.add(r + "," + c); f(r + 1, c); f(r - 1, c); f(r, c + 1); f(r, c - 1); };
    g.forEach((row, r) => row.forEach((x, c) => { if (x === "1" && !seen.has(r + "," + c)) { n++; f(r, c); } }));
    return has(st, `return ${n}.`) ? null : `expected ${n}`;
  },
  "dfs/cycle": (v, st) => {
    const edges = v.e.split(",").map(s => s.trim().split(">")); const nodes = [...new Set(edges.flat())]; const adj = new Map(nodes.map(n => [n, edges.filter(e => e[0] === n).map(e => e[1])]));
    const reach = (a: string, b: string, seen = new Set<string>()): boolean => adj.get(a)!.some(x => x === b || (!seen.has(x) && (seen.add(x), reach(x, b, seen))));
    const cyc = nodes.some(n => reach(n, n)); return has(st, cyc ? "return true" : "return false") ? null : `expected ${cyc}`;
  },
  "dp/rob": (v, st) => { const a = N(v.a); let b = 0; for (let m = 0; m < 1 << a.length; m++) { if (m & (m >> 1)) continue; let s = 0; a.forEach((x, i) => { if (m >> i & 1) s += x; }); b = Math.max(b, s); } return has(st, `return ${b}.`) ? null : `expected ${b}`; },
  "dp/coins": (v, st) => { const cs = N(v.c), T = +v.t; const best = (a: number, d: number): number => (a === 0 ? 0 : d > T ? Infinity : Math.min(...cs.filter(c => c <= a).map(c => 1 + best(a - c, d + 1)), Infinity)); const r = best(T, 0); return has(st, r === Infinity ? "return -1." : `return ${r}.`) ? null : `expected ${r}`; },
  "dp/lcs": (v, st) => { const A = v.a, B = v.b; const f = (i: number, j: number): number => (i === A.length || j === B.length ? 0 : A[i] === B[j] ? 1 + f(i + 1, j + 1) : Math.max(f(i + 1, j), f(i, j + 1))); const r = f(0, 0); return has(st, `return ${r}.`) ? null : `expected ${r}`; },
  "fast-slow/cycle": (v, st) => { const p = +v.p; return has(st, p < 0 ? "return null" : `return node ${p}.`) ? null : `expected ${p}`; },
  "intervals/merge": (v, st) => { const iv = v.a.split(",").map(s => s.trim().split("-").map(Number)).sort((a, b) => a[0] - b[0]); const o: number[][] = []; for (const [s, e] of iv) { if (o.length && s <= o[o.length - 1][1]) o[o.length - 1][1] = Math.max(o[o.length - 1][1], e); else o.push([s, e]); } return has(st, `return ${o.length} intervals`) ? null : `expected ${o.length}`; },
  "intervals/rooms": (v, st) => { const iv = v.a.split(",").map(s => s.trim().split("-").map(Number)); let b = 0; for (const [s] of iv) b = Math.max(b, iv.filter(([x, y]) => x <= s && s < y).length); return has(st, `return ${b}.`) ? null : `expected ${b}`; },
  "backtracking/subsets": (v, st) => has(st, `${2 ** N(v.a).length} subsets`) ? null : "wrong count",
  "backtracking/combo": (v, st) => { const a = [...new Set(N(v.a))].sort((x, y) => x - y), T = +v.t; let c = 0; const f = (i: number, r: number) => { if (r === 0) { c++; return; } for (let k = i; k < a.length && a[k] <= r; k++) f(k, r - a[k]); }; f(0, T); return has(st, `${c} found`) ? null : `expected ${c}`; },
  "sorting/insert": (v, st) => has(st, "[" + N(v.a).sort((x, y) => x - y).join(", ") + "]") ? null : "not sorted",
  "sorting/quick": (v, st) => has(st, "[" + N(v.a).sort((x, y) => x - y).join(", ") + "]") ? null : "not sorted",
};

// ---------- random inputs per mode ----------
let seed = 12345; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const ri = (lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1));
const arr = (n: number, lo: number, hi: number) => Array.from({ length: n }, () => ri(lo, hi));
const sortedArr = (n: number, lo: number, hi: number) => arr(n, lo, hi).sort((a, b) => a - b);
const letters = (n: number, k: number) => Array.from({ length: n }, () => "abcdefgh"[ri(0, k - 1)]).join("");
const grid = (r: number, c: number, vals: string) => Array.from({ length: r }, () => Array.from({ length: c }, () => vals[ri(0, vals.length - 1)]).join(" ")).join(" / ");
const GEN: Record<string, () => Record<string, string>> = {
  "two-pointers/pair": () => ({ a: sortedArr(ri(2, 9), -10, 20).join(", "), t: String(ri(-10, 30)) }),
  "two-pointers/water": () => ({ a: arr(ri(2, 10), 0, 12).join(", ") }),
  "two-pointers/rev": () => ({ a: arr(ri(1, 9), -5, 20).join(", ") }),
  "sliding-window/fixed": () => { const n = ri(1, 10); return { a: arr(n, -6, 12).join(", "), k: String(ri(1, n)) }; },
  "sliding-window/var": () => ({ s: letters(ri(1, 12), ri(1, 5)) }),
  "hashing/twosum": () => ({ a: arr(ri(1, 9), -5, 12).join(", "), t: String(ri(-5, 20)) }),
  "hashing/dup": () => ({ a: arr(ri(1, 9), -4, 9).join(", ") }),
  "hashing/freq": () => ({ s: letters(ri(1, 10), ri(1, 5)) }),
  "binary-search/find": () => ({ a: sortedArr(ri(1, 12), -20, 40).join(", "), t: String(ri(-25, 45)) }),
  "binary-search/lower": () => ({ a: sortedArr(ri(1, 12), 0, 10).join(", "), t: String(ri(-1, 12)) }),
  "binary-search/answer": () => { const p = arr(ri(1, 6), 1, 16); return { p: p.join(", "), h: String(ri(p.length, p.length + 10)) }; },
  "prefix-sum/range": () => { const n = ri(1, 10); const q = Array.from({ length: ri(1, 3) }, () => { const i = ri(0, n - 1); return `${i}-${ri(i, n - 1)}`; }); return { a: arr(n, -6, 12).join(", "), q: q.join(", ") }; },
  "prefix-sum/k": () => ({ a: arr(ri(1, 10), -3, 4).join(", "), k: String(ri(-2, 5)) }),
  "monotonic-stack/days": () => ({ a: arr(ri(1, 10), 50, 80).join(", ") }),
  "monotonic-stack/nge": () => ({ a: arr(ri(1, 10), 0, 9).join(", ") }),
  "heap/topk": () => { const n = ri(1, 12); return { a: arr(n, -5, 30).join(", "), k: String(ri(1, Math.min(7, n))) }; },
  "bfs/graph": () => { const ns = "ABCDEFGH".slice(0, ri(2, 8)).split(""); const e = new Set<string>(); for (let i = 1; i < ns.length; i++) e.add(`${ns[ri(0, i - 1)]}-${ns[i]}`); for (let k = 0; k < ri(0, 3); k++) { const a = ri(0, ns.length - 1), b = ri(0, ns.length - 1); if (a !== b && !e.has(`${ns[b]}-${ns[a]}`)) e.add(`${ns[a]}-${ns[b]}`); } return { e: [...e].join(", "), s: ns[ri(0, ns.length - 1)] }; },
  "bfs/grid": () => { let g = grid(ri(1, 4), ri(1, 5), "0112"); if (!g.includes("2")) g = g.replace(/[01]/, "2"); return { g }; },
  "dfs/graph": () => ({ e: "A-B, B-C, C-A, C-D", s: "A" }),
  "dfs/islands": () => ({ g: grid(ri(1, 5), ri(1, 6), "001") }),
  "dfs/cycle": () => { const ns = "ABCDEF".slice(0, ri(2, 6)).split(""); const e = new Set<string>(); for (let k = 0; k < ri(1, 7); k++) { const a = ri(0, ns.length - 1), b = ri(0, ns.length - 1); if (a !== b) e.add(`${ns[a]}>${ns[b]}`); } return { e: [...e].join(", ") || "A>B" }; },
  "dp/rob": () => ({ a: arr(ri(1, 10), 0, 15).join(", ") }),
  "dp/coins": () => ({ c: [...new Set(arr(ri(1, 3), 1, 6))].join(", "), t: String(ri(1, 13)) }),
  "dp/lcs": () => ({ a: letters(ri(1, 6), 4), b: letters(ri(1, 7), 4) }),
  "fast-slow/cycle": () => { const n = ri(2, 9); return { a: arr(n, 0, 9).join(", "), p: String(ri(-1, n - 1)) }; },
  "intervals/merge": () => ({ a: Array.from({ length: ri(1, 8) }, () => { const s = ri(0, 20); return `${s}-${s + ri(0, 6)}`; }).join(", ") }),
  "intervals/rooms": () => ({ a: Array.from({ length: ri(1, 8) }, () => { const s = ri(0, 20); return `${s}-${s + ri(1, 6)}`; }).join(", ") }),
  "backtracking/subsets": () => ({ a: arr(ri(1, 4), 1, 9).join(", ") }),
  "backtracking/combo": () => ({ a: [...new Set(arr(ri(1, 3), 2, 6))].join(", "), t: String(ri(1, 9)) }),
  "sorting/insert": () => ({ a: arr(ri(1, 10), -5, 20).join(", ") }),
  "sorting/quick": () => ({ a: arr(ri(1, 10), -5, 20).join(", ") }),
};

let runs = 0;
for (const [lesson, viz] of Object.entries(PVIZ)) for (const mode of viz.modes) {
  const key = `${lesson}/${mode.id}`;
  const inputs = [...mode.presets.map(p => p.values), ...Array.from({ length: GEN[key] ? 120 : 0 }, () => GEN[key]())];
  ok(!!GEN[key], `${key}: no random generator`);
  ok(!!REFS[key] || key === "dfs/graph", `${key}: no reference check`);
  for (const v of inputs) {
    let st: Step<unknown>[];
    try { st = mode.run(v); runs++; } catch (e) {
      if (e instanceof Error && !/is not|Cannot read|undefined|null|stack|NaN/i.test(e.message)) { if (mode.presets.some(p => p.values === v)) fail(`${key}: preset ${JSON.stringify(v)} rejected: ${e.message}`); continue; }
      fail(`${key} ${JSON.stringify(v)} crashed: ${(e as Error).stack?.split("\n").slice(0, 3).join(" | ")}`); continue;
    }
    structure(`${key} ${JSON.stringify(v)}`, mode.code, st);
    const r = REFS[key]?.(v, st); if (r) fail(`${key} ${JSON.stringify(v)}: ${r} | last: ${last(st).brief}`); else checks++;
  }
  // bad inputs must give a friendly message, not a crash
  for (const bad of [{}, Object.fromEntries(mode.fields.map(f => [f.key, ""])), Object.fromEntries(mode.fields.map(f => [f.key, "x, y"]))]) {
    try { mode.run(bad as Record<string, string>); } catch (e) { ok(e instanceof Error && !/Cannot read|undefined is not|is not a function/.test(e.message), `${key}: bad input ${JSON.stringify(bad)} gave an unfriendly error: ${(e as Error).message}`); }
  }
}
console.log(`${runs} traces, ${checks} checks, ${fails} failures`);
if (fails) process.exit(1);
