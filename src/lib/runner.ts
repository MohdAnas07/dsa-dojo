"use client";
/**
 * Code execution for the browser.
 *  - JavaScript runs in a throwaway Web Worker (no network, no page access, killed on timeout).
 *  - Other languages go to /api/execute.
 */
import { FMT_SRC, fmt } from "./fmt";
import { HARNESS_SRC, judgeCheck } from "./judge-core";
import { LANG, type LangId } from "./languages";
import { pyProgram, CASE_RESULT, CASE_START, PY_USER_OFFSET } from "./drivers/python";
import { JUDGE } from "@/content/judge";
import { PROBLEMS } from "@/content/problems";
import expected from "@/generated/expected.json";
import type { GenCase, JudgeSpec } from "./types";

export interface RunOutput { logs: string[]; error?: string; timeMs?: number }

// ---------- free-form runs ----------
const PLAY_WORKER = FMT_SRC + `
self.onmessage = function (e) {
  const logs = [];
  const log = function () { if (logs.length < 2000) logs.push([].slice.call(arguments).map(function (x) { return fmt(x); }).join(" ")); };
  const con = { log: log, info: log, warn: log, error: log, table: log, debug: log };
  try { new Function("console", e.data)(con); self.postMessage({ logs: logs }); }
  catch (err) { self.postMessage({ logs: logs, error: (err && err.name ? err.name + ": " : "") + (err && err.message || err) }); }
};`;
const urls: Record<string, string> = {};
function workerFor(src: string): Worker {
  urls[src] = urls[src] || URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
  return new Worker(urls[src]);
}

/** Run JavaScript in a sandboxed worker and collect console output. */
export function runJS(code: string, timeoutMs = 3000): Promise<RunOutput> {
  return new Promise(resolve => {
    const t0 = performance.now();
    let w: Worker;
    try { w = workerFor(PLAY_WORKER); }
    catch {
      const logs: string[] = [];
      const log = (...a: unknown[]) => logs.push(a.map(x => fmt(x)).join(" "));
      try { new Function("console", code)({ log, info: log, warn: log, error: log }); resolve({ logs }); }
      catch (err) { resolve({ logs, error: String(err) }); }
      return;
    }
    const timer = setTimeout(() => { w.terminate(); resolve({ logs: [], error: `Stopped after ${timeoutMs / 1000} seconds. Is there an infinite loop?` }); }, timeoutMs);
    w.onmessage = e => { clearTimeout(timer); w.terminate(); resolve({ ...e.data, timeMs: performance.now() - t0 }); };
    w.onerror = e => { e.preventDefault(); clearTimeout(timer); w.terminate(); resolve({ logs: [], error: e.message || "Syntax error" }); };
    w.postMessage(code);
  });
}

export interface ServerRun { stdout: string; stderr: string; exitCode: number | null; signal: string | null; compileOutput: string | null; timeMs: number; error?: string }
/** Run code in any server language through /api/execute. */
export async function runOnServer(language: LangId, code: string, stdin = ""): Promise<ServerRun> {
  try {
    const res = await fetch("/api/execute", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language, code, stdin }) });
    const data = await res.json().catch(() => ({ error: "Bad response from server." }));
    if (!res.ok || data.error) return { stdout: "", stderr: "", exitCode: null, signal: null, compileOutput: null, timeMs: 0, error: data.error || `Server error ${res.status}` };
    return data;
  } catch {
    return { stdout: "", stderr: "", exitCode: null, signal: null, compileOutput: null, timeMs: 0, error: "Could not reach /api/execute. Are you offline?" };
  }
}

// ---------- judging ----------
const JUDGE_WORKER = FMT_SRC + "\n" + HARNESS_SRC + `
function __safe(v) {
  if (v === undefined) return { __undef: true };
  try { return JSON.parse(JSON.stringify(v, function (k, x) { return x instanceof Set ? [...x] : x instanceof Map ? { __map: [...x] } : typeof x === "bigint" ? String(x) : x; })); }
  catch (e) { return { __str: String(v) }; }
}
self.onmessage = function (e) {
  const d = e.data; let cur = -1; const logs = [];
  const log = function () { if (logs.length < 400) logs.push([cur, [].slice.call(arguments).map(function (x) { return fmt(x); }).join(" ")]); };
  const con = { log: log, info: log, warn: log, error: log, table: log, debug: log };
  const take = i => logs.filter(l => l[0] === i).map(l => l[1]);
  let fn;
  try { fn = new Function("console", d.code + "\\n;return typeof " + d.name + " !== 'undefined' ? " + d.name + " : undefined;")(con); }
  catch (err) { self.postMessage({ type: "compile", error: (err && err.name ? err.name + ": " : "") + (err && err.message || err), logs: take(-1) }); return; }
  if (typeof fn !== "function") { self.postMessage({ type: "compile", error: "Could not find a function or class named \\"" + d.name + "\\". Keep the name from the starter code.", logs: take(-1) }); return; }
  self.postMessage({ type: "ready", logs: take(-1) });
  for (let i = 0; i < d.cases.length; i++) {
    cur = i; const args = d.cases[i];
    const t0 = performance.now();
    try { const out = __runCase(fn, d.spec, args); self.postMessage({ type: "case", i: i, out: __safe(out), ms: performance.now() - t0, logs: take(i) }); }
    catch (err) { self.postMessage({ type: "case", i: i, error: (err && err.name ? err.name + ": " : "") + (err && err.message || err), ms: performance.now() - t0, logs: take(i) }); }
  }
  self.postMessage({ type: "done" });
};`;

export interface JudgeCase { args?: unknown[]; gen?: string; exp?: unknown; label: string; hidden?: boolean; big?: boolean; custom?: boolean }
export interface CaseResult { i: number; out?: unknown; error?: string; ms: number; logs?: string[]; tle?: boolean; pass?: boolean | null; exp?: unknown }
export interface JudgeResult { mode: "run" | "submit"; lang: LangId; cases: JudgeCase[]; results: CaseResult[]; logs: string[]; compile: string | null; serverError?: string }

const EXP = expected.judge as Record<string, { cases: unknown[]; hidden: unknown[] }>;
export const expectedFor = (id: string) => EXP[id];
const specPayload = (sp: JudgeSpec) => ({ fn: sp.fn, params: sp.params, ret: sp.ret, inplace: sp.inplace, design: sp.design });

export function judgeCases(id: string, mode: "run" | "submit", custom?: unknown[] | null): JudgeCase[] {
  const sp = JUDGE[id], ex = EXP[id];
  const vis: JudgeCase[] = sp.cases.map((a, i) => ({ args: a, exp: ex.cases[i], label: "Case " + (i + 1) }));
  if (mode === "run") return custom ? [...vis, { args: custom, custom: true, label: "Custom" }] : vis;
  return vis.concat(sp.hidden.map((c, i) => (c as GenCase).gen
    ? { gen: (c as GenCase).gen, exp: ex.hidden[i], label: (c as GenCase).label, hidden: true, big: true }
    : { args: c as unknown[], exp: ex.hidden[i], label: "Hidden test " + (i + 1), hidden: true }));
}
const materialize = (c: JudgeCase): unknown[] => (c.gen ? new Function("return (" + c.gen + ")")()() : c.args!);

/** Run cases in the JS worker. Used for JavaScript submissions and to compute custom-case answers from the reference solution. */
function judgeInWorker(code: string, name: string, sp: JudgeSpec, argsList: unknown[][], limitMs: number, stopOnFail?: (r: CaseResult) => boolean) {
  return new Promise<{ results: CaseResult[]; logs: string[]; compile: string | null }>(resolve => {
    const out = { results: [] as CaseResult[], logs: [] as string[], compile: null as string | null };
    let w: Worker;
    try { w = workerFor(JUDGE_WORKER); } catch { out.compile = "This browser blocked the code sandbox (Web Workers)."; return resolve(out); }
    const finish = () => { clearTimeout(timer); w.terminate(); resolve(out); };
    const timer = setTimeout(() => { if (out.results.length < argsList.length) out.results.push({ i: out.results.length, tle: true, ms: limitMs }); finish(); }, limitMs);
    w.onmessage = e => {
      const m = e.data;
      if (m.type === "compile") { out.compile = m.error; out.logs = m.logs || []; finish(); }
      else if (m.type === "ready") out.logs = m.logs || [];
      else if (m.type === "case") { out.results.push(m); if (stopOnFail && stopOnFail(m)) finish(); }
      else if (m.type === "done") finish();
    };
    w.onerror = ev => { ev.preventDefault(); out.compile = ev.message || "Syntax error"; finish(); };
    w.postMessage({ code, name, spec: specPayload(sp), cases: argsList });
  });
}

async function referenceAnswer(id: string, args: unknown[]): Promise<unknown> {
  const sp = JUDGE[id], p = PROBLEMS.find(x => x.id === id)!;
  const r = await judgeInWorker(p.c, sp.ref || sp.fn, sp, [args], 3000);
  const x = r.results[0];
  return x && !x.error && !x.tle ? x.out : { __str: "(the reference solution could not run this input: " + (x?.error || r.compile || "timeout") + ")" };
}

export async function runJudge(id: string, lang: LangId, mode: "run" | "submit", code: string, custom?: unknown[] | null): Promise<JudgeResult> {
  const sp = JUDGE[id], cases = judgeCases(id, mode, custom);
  let argsList: unknown[][];
  try { argsList = cases.map(materialize); }
  catch (e) { return { mode, lang, cases, results: [], logs: [], compile: "Bad test input: " + (e as Error).message }; }
  const customIdx = cases.findIndex(c => c.custom);
  if (customIdx >= 0) cases[customIdx].exp = await referenceAnswer(id, argsList[customIdx]);

  // Per-test time limit: an O(n²) solution on the large hidden tests should fail, not just be slow.
  const perCaseMs = LANG[lang].runtime === "browser" ? 1000 : 2000;
  const grade = (r: CaseResult): CaseResult => {
    const c = cases[r.i]; if (!c) return r;
    if (!r.error && !r.tle && r.ms > perCaseMs) return { ...r, tle: true, pass: false, exp: c.exp };
    const exp = c.exp;
    const pass = r.error || r.tle ? false : exp && typeof exp === "object" && (exp as { __str?: string }).__str ? null : judgeCheck(sp.cmp, exp, r.out);
    return { ...r, pass, exp };
  };

  if (LANG[lang].runtime === "browser") {
    const limit = mode === "submit" ? 8000 : 5000;
    const r = await judgeInWorker(code, sp.fn, sp, argsList, limit, m => mode === "submit" && grade(m).pass === false);
    return { mode, lang, cases, results: r.results.map(grade), logs: r.logs, compile: r.compile };
  }

  // Server languages: currently Python has a driver.
  if (lang !== "python") return { mode, lang, cases, results: [], logs: [], compile: `${LANG[lang].label} judging isn't set up yet. Use the Playground for free-form ${LANG[lang].label} code.` };
  const run = await runOnServer("python", pyProgram(code), JSON.stringify({ spec: specPayload(sp), cases: argsList }));
  if (run.error) return { mode, lang, cases, results: [], logs: [], compile: null, serverError: run.error };
  const results: CaseResult[] = []; const logs: string[] = [];
  let cur = -1; const perCase: Record<number, string[]> = {};
  for (const line of run.stdout.split("\n")) {
    if (line.startsWith(CASE_START)) { cur = Number(line.slice(CASE_START.length)); continue; }
    if (line.startsWith(CASE_RESULT)) {
      try { const m = JSON.parse(line.slice(CASE_RESULT.length)); results.push(grade({ ...m, logs: perCase[m.i] || [] })); } catch { /* ignore */ }
      continue;
    }
    if (line === "" ) continue;
    if (cur < 0) logs.push(line); else (perCase[cur] = perCase[cur] || []).push(line);
  }
  const stderr = (run.stderr || "").replace(/File "[^"]*", line (\d+)/g, (_, n) => `line ${Math.max(1, Number(n) - PY_USER_OFFSET)}`);
  if (!results.length && (run.exitCode !== 0 || stderr)) return { mode, lang, cases, results: [], logs, compile: stderr.trim() || "Your program exited with an error." };
  if (results.length < cases.length) {
    const killed = run.signal === "SIGKILL" || /Timeout|timed out/i.test(stderr);
    results.push({ i: results.length, ms: 0, ...(killed ? { tle: true } : { error: stderr.trim().split("\n").slice(-3).join("\n") || "Program stopped early." }), pass: false });
  }
  if (mode === "submit") { const f = results.findIndex(r => r.pass === false); if (f >= 0) results.splice(f + 1); }
  return { mode, lang, cases, results, logs, compile: null };
}

export function verdictOf(r: JudgeResult): [string, "good" | "bad"] {
  if (r.serverError) return ["Execution server unavailable", "bad"];
  if (r.compile) return [r.lang === "python" ? "Error" : "Compile Error", "bad"];
  if (r.results.find(x => x.tle)) return ["Time Limit Exceeded", "bad"];
  if (r.results.find(x => x.error)) return ["Runtime Error", "bad"];
  if (r.results.find(x => x.pass === false)) return ["Wrong Answer", "bad"];
  if (r.results.length < r.cases.length) return ["Stopped", "bad"];
  return [r.mode === "submit" ? "Accepted" : "All example tests passed", "good"];
}
