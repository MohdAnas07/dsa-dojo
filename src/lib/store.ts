"use client";
import { useSyncExternalStore } from "react";
import type { LangId } from "./languages";
import { PROBLEMS } from "@/content/problems";
import { TOPIC, LESSON_SLUGS, LESSON_PATH } from "./data";
import { LESSONS } from "@/content/lessons";
import { PATH } from "@/content/roadmap";

export type PStatus = "attempted" | "solved" | "revise";
export interface Mistake { id: string; prob: string; wrong: string; right: string; pat: string; date: string }
export interface Submission { verdict: string; ok: boolean; date: string; lang: LangId }
export interface State {
  done: Record<string, string>; fav: Record<string, 1>; weak: Record<string, 1>; rev: Record<string, string>;
  ps: Record<string, PStatus>; last: string | null; days: string[]; mist: Mistake[]; fk: Record<string, "known" | "again">;
  eli: boolean; theme: "light" | "dark" | null; navClosed: Record<string, boolean>;
  /** saved editor drafts: `${problemId}:${lang}` → code */
  code: Record<string, string>; subs: Record<string, Submission>;
  pg: Partial<Record<LangId, string>>; pgLang: LangId; lang: LangId;
}
const KEY = "dsa-dojo-v2";
export const defaults = (): State => ({ done: {}, fav: {}, weak: {}, rev: {}, ps: {}, last: null, days: [], mist: [], fk: {}, eli: false, theme: null, navClosed: {}, code: {}, subs: {}, pg: {}, pgLang: "javascript", lang: "javascript" });
const SERVER = defaults();
let state: State = SERVER;
let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

function read(): State | null {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem("dsa-dojo-v1");
    return raw ? { ...defaults(), ...JSON.parse(raw) } : null;
  } catch { return null; /* storage unavailable or corrupt: keep what we have */ }
}
function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  state = read() ?? state;
  // Another tab of this site changed the saved state: show the same thing here.
  window.addEventListener("storage", e => {
    if (e.key !== KEY) return;
    state = read() ?? defaults();
    epoch++; emit(); remoteListeners.forEach(l => l());
  });
}
function persist() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }
export const today = () => new Date().toISOString().slice(0, 10);

/** Called after every local change. The account sync (src/lib/sync.ts) uses it to schedule a save. */
let onChange: ((prev: State, next: State) => void) | null = null;
export function setChangeListener(fn: ((prev: State, next: State) => void) | null) { onChange = fn; }

export function update(fn: (s: State) => void, opts: { activity?: boolean } = {}) {
  load();
  const next: State = structuredClone(state);
  fn(next);
  if (opts.activity) { const d = today(); if (!next.days.includes(d)) next.days = [...next.days, d].slice(-400); }
  const prev = state;
  state = next; persist();
  emit();
  onChange?.(prev, next);
}
export function getState(): State { load(); return state; }
export function useStore(): State {
  return useSyncExternalStore(
    cb => { listeners.add(cb); return () => listeners.delete(cb); },
    () => { load(); return state; },
    () => SERVER
  );
}

/**
 * Replaces part of the state with data that came from somewhere else (the user's account,
 * or another tab). Does not count as a local change, so it never triggers a save.
 */
export function replaceFromRemote(patch: Partial<State>) {
  load();
  state = { ...state, ...structuredClone(patch) };
  persist();
  epoch++; emit(); remoteListeners.forEach(l => l());
}
let epoch = 0;
const remoteListeners = new Set<() => void>();
/**
 * A number that goes up whenever state arrives from outside this tab. Editors keep their own
 * copy of the text, so they watch this to pick up a draft that was loaded after they opened.
 */
export function useRemoteEpoch(): number {
  return useSyncExternalStore(cb => { remoteListeners.add(cb); return () => remoteListeners.delete(cb); }, () => epoch, () => 0);
}

export function streak(s: State): number {
  const set = new Set(s.days); let n = 0; const d = new Date();
  if (!set.has(today())) d.setDate(d.getDate() - 1);
  while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
export const isSolved = (s: State, id: string) => s.ps[id] === "solved" || s.ps[id] === "revise";
export function stats(s: State) {
  const topicsDone = Object.keys(s.done).filter(k => TOPIC[k]).length;
  const solved = PROBLEMS.filter(p => isSolved(s, p.id)).length;
  const byD = { E: [0, 0], M: [0, 0], H: [0, 0] } as Record<"E" | "M" | "H", [number, number]>;
  PROBLEMS.forEach(p => { byD[p.d][1]++; if (isSolved(s, p.id)) byD[p.d][0]++; });
  const num = LESSON_SLUGS.filter(k => s.done[k]).length + solved;
  return { topicsDone, solved, byD, pct: Math.round((num / (LESSON_SLUGS.length + PROBLEMS.length)) * 100), streak: streak(s) };
}
export function nextTopic(s: State): string {
  return LESSON_PATH.find(k => !s.done[k]) || PATH.find(k => !s.done[k]) || "big-o";
}
export function continueTopic(s: State): string {
  return s.last && LESSONS[s.last] && !s.done[s.last] ? s.last : nextTopic(s);
}
export function randomUnsolved(s: State): string {
  const pool = PROBLEMS.filter(p => !isSolved(s, p.id));
  const list = pool.length ? pool : PROBLEMS;
  return list[Math.floor(Math.random() * list.length)].id;
}
