/**
 * The part of the browser state that is saved to a signed-in user's account.
 * Safe to import on both server and client (no browser or Node APIs).
 *
 * Everything the server stores goes through `sanitizeProgress`, so a request can never
 * save arbitrary JSON: unknown keys are dropped, types are checked and sizes are capped.
 */
import { isLangId, type LangId } from "./languages";
import type { Mistake, PStatus, State, Submission } from "./store";

/** Keys synced to the account. `theme` and `navClosed` stay per-device on purpose. */
export const SYNC_KEYS = ["done", "fav", "weak", "rev", "ps", "last", "days", "mist", "fk", "eli", "code", "subs", "pg", "pgLang", "lang"] as const;
export type SyncKey = (typeof SYNC_KEYS)[number];
export type ProgressDoc = Pick<State, SyncKey>;

/** Largest request body the API accepts. */
export const MAX_DOC_BYTES = 1_500_000;
const MAX_KEYS = 5000, MAX_ID = 120, MAX_MISTAKES = 500, MAX_DAYS = 400;
/** Longest editor draft and longest mistake-note field that is saved. Longer text is cut to this length, never dropped. */
export const MAX_CODE = 64 * 1024, MAX_NOTE = 10_000;

export const emptyProgress = (): ProgressDoc => ({
  done: {}, fav: {}, weak: {}, rev: {}, ps: {}, last: null, days: [], mist: [], fk: {}, eli: false,
  code: {}, subs: {}, pg: {}, pgLang: "javascript", lang: "javascript"
});

export function pickProgress(s: State): ProgressDoc {
  const out = {} as Record<string, unknown>;
  for (const k of SYNC_KEYS) out[k] = s[k];
  return out as ProgressDoc;
}

/** True when there is nothing worth saving (a visitor who has not done anything yet). */
export function isEmptyProgress(d: ProgressDoc): boolean {
  return !d.days.length && !d.mist.length && !d.last
    && [d.done, d.fav, d.weak, d.rev, d.ps, d.fk, d.code, d.subs, d.pg].every(o => Object.keys(o).length === 0);
}

/** JSON with object keys sorted, so two copies with the same content always produce the same text. */
export function canon(v: unknown): string {
  return JSON.stringify(v, (_k, x) => (x && typeof x === "object" && !Array.isArray(x)
    ? Object.fromEntries(Object.keys(x).sort().map(k => [k, (x as Record<string, unknown>)[k]])) : x));
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
/** Postgres jsonb cannot hold NUL characters or unpaired surrogates, so text is cleaned of both. */
const clean = (v: string): string => {
  const t = v.includes("\u0000") ? v.replace(/\u0000/g, "") : v;
  const wf = (t as unknown as { toWellFormed?: () => string }).toWellFormed;
  return typeof wf === "function" ? wf.call(t) : t;
};
const str = (v: unknown, max: number): string | null => typeof v === "string" && v.length <= max ? clean(v) : null;
/** Like `str`, but for text the user wrote: too-long text is shortened rather than thrown away. */
const text = (v: unknown, max: number): string | null => typeof v === "string" ? clean(v.length > max ? v.slice(0, max) : v) : null;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const STATUS: PStatus[] = ["attempted", "solved", "revise"];

/** Copies entries of a plain object that pass `conv`, dropping the rest. */
function mapOf<T>(v: unknown, conv: (x: unknown, key: string) => T | null): Record<string, T> {
  const out: Record<string, T> = {};
  if (!isObj(v)) return out;
  let n = 0;
  for (const [k, x] of Object.entries(v)) {
    // "__proto__" is skipped so a crafted key can never reach an object's prototype.
    if (k.length > MAX_ID || k === "__proto__" || clean(k) !== k || n >= MAX_KEYS) continue;
    const c = conv(x, k);
    if (c !== null) { out[k] = c; n++; }
  }
  return out;
}

/** Returns a clean ProgressDoc built only from the valid parts of `input`. Never throws. */
export function sanitizeProgress(input: unknown): ProgressDoc {
  const d = emptyProgress();
  if (!isObj(input)) return d;
  d.done = mapOf(input.done, x => str(x, 40));
  d.rev = mapOf(input.rev, x => str(x, 40));
  d.fav = mapOf(input.fav, x => (x ? 1 : null));
  d.weak = mapOf(input.weak, x => (x ? 1 : null));
  d.ps = mapOf(input.ps, x => (STATUS.includes(x as PStatus) ? (x as PStatus) : null));
  d.fk = mapOf(input.fk, x => (x === "known" || x === "again" ? x : null));
  d.code = mapOf(input.code, x => text(x, MAX_CODE));
  d.subs = mapOf(input.subs, (x): Submission | null => {
    if (!isObj(x)) return null;
    const verdict = str(x.verdict, 200), date = str(x.date, 40);
    return verdict !== null && date !== null && isLangId(x.lang) ? { verdict, ok: x.ok === true, date, lang: x.lang } : null;
  });
  d.pg = mapOf(input.pg, (x, k) => (isLangId(k) ? text(x, MAX_CODE) : null)) as Partial<Record<LangId, string>>;
  d.last = str(input.last, MAX_ID);
  d.eli = input.eli === true;
  if (isLangId(input.pgLang)) d.pgLang = input.pgLang;
  if (isLangId(input.lang)) d.lang = input.lang;
  if (Array.isArray(input.days)) d.days = [...new Set(input.days.filter((x): x is string => typeof x === "string" && DAY.test(x)))].sort().slice(-MAX_DAYS);
  if (Array.isArray(input.mist)) {
    const seen = new Set<string>();
    for (const m of input.mist) {
      if (!isObj(m)) continue;
      const id = str(m.id, 40), prob = text(m.prob, MAX_NOTE), wrong = text(m.wrong, MAX_NOTE), right = text(m.right, MAX_NOTE), pat = str(m.pat, MAX_ID), date = str(m.date, 40);
      if (id === null || prob === null || wrong === null || right === null || pat === null || date === null || seen.has(id)) continue;
      seen.add(id); d.mist.push({ id, prob, wrong, right, pat, date });
    }
    d.mist = d.mist.slice(-MAX_MISTAKES); // notes are appended, so this keeps the newest
  }
  return d;
}

const RANK: Record<PStatus, number> = { attempted: 1, solved: 2, revise: 3 };
const later = (a: string, b: string) => (a >= b ? a : b);
const earlier = (a: string, b: string) => (a <= b ? a : b);

/**
 * Combines two copies of a user's progress so that nothing either copy has is lost.
 * Used when progress made before signing in meets an existing account, and when two
 * devices saved at the same time. Where both copies hold different text for the same
 * thing (an editor draft), `mine` wins because it is what the user is looking at.
 * `prefs` says whose settings to keep.
 */
export function mergeProgress(mine: ProgressDoc, theirs: ProgressDoc, prefs: "mine" | "theirs" = "mine"): ProgressDoc {
  const out = emptyProgress();
  const union = <T>(a: Record<string, T>, b: Record<string, T>, pick: (x: T, y: T) => T) => {
    const r: Record<string, T> = { ...b };
    for (const [k, v] of Object.entries(a)) r[k] = Object.prototype.hasOwnProperty.call(b, k) ? pick(v, b[k]) : v;
    return r;
  };
  out.done = union(mine.done, theirs.done, earlier);
  out.rev = union(mine.rev, theirs.rev, later);
  out.fav = union(mine.fav, theirs.fav, x => x);
  out.weak = union(mine.weak, theirs.weak, x => x);
  out.ps = union(mine.ps, theirs.ps, (x, y) => (RANK[x] >= RANK[y] ? x : y));
  out.fk = union(mine.fk, theirs.fk, x => x);
  out.code = union(mine.code, theirs.code, x => x);
  out.pg = union(mine.pg as Record<string, string>, theirs.pg as Record<string, string>, x => x) as ProgressDoc["pg"];
  out.subs = union(mine.subs, theirs.subs, (x, y) => (x.date >= y.date ? x : y));
  out.days = [...new Set([...theirs.days, ...mine.days])].sort().slice(-MAX_DAYS);
  const ids = new Set(mine.mist.map(m => m.id));
  out.mist = [...theirs.mist.filter((m: Mistake) => !ids.has(m.id)), ...mine.mist].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)).slice(-MAX_MISTAKES);
  out.last = mine.last ?? theirs.last;
  // Settings (language, explanation mode) have no "both": one side is chosen.
  const p = prefs === "mine" ? mine : theirs;
  out.eli = p.eli; out.pgLang = p.pgLang; out.lang = p.lang;
  return out;
}

// ---------- tracking what changed in this browser ----------
// A "path" names one saved thing: "ps/two-sum" (one problem's status), "code/two-sum:javascript"
// (one editor draft), "days/2026-10-06", "mist/<id>", or a whole setting such as "lang".

const MAPS = ["done", "fav", "weak", "rev", "ps", "fk", "code", "subs", "pg"] as const;
const SETTINGS = ["last", "eli", "pgLang", "lang"] as const;
const own = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);
const same = (a: unknown, b: unknown) => a === b || (typeof a === "object" && typeof b === "object" && JSON.stringify(a) === JSON.stringify(b));

/** Paths whose value differs between two copies (added, changed or removed). */
export function diffPaths(a: ProgressDoc, b: ProgressDoc): string[] {
  const out: string[] = [];
  for (const k of MAPS) {
    const x = (a[k] || {}) as Record<string, unknown>, y = (b[k] || {}) as Record<string, unknown>;
    for (const e of new Set([...Object.keys(x), ...Object.keys(y)])) if (own(x, e) !== own(y, e) || !same(x[e], y[e])) out.push(k + "/" + e);
  }
  for (const k of SETTINGS) if (a[k] !== b[k]) out.push(k);
  const da = new Set(a.days || []), db = new Set(b.days || []);
  for (const d of new Set([...da, ...db])) if (da.has(d) !== db.has(d)) out.push("days/" + d);
  const ma = new Map((a.mist || []).map(m => [m.id, m])), mb = new Map((b.mist || []).map(m => [m.id, m]));
  for (const id of new Set([...ma.keys(), ...mb.keys()])) if (!same(ma.get(id), mb.get(id))) out.push("mist/" + id);
  return out;
}

/**
 * Starts from the account's copy and re-applies only the things this browser changed since it
 * last synced (`paths`), including removals. Everything else comes from the account, so a newer
 * draft written on another device is never replaced by an older one that merely sat here.
 */
export function applyLocalChanges(theirs: ProgressDoc, mine: ProgressDoc, paths: string[]): ProgressDoc {
  const out = JSON.parse(JSON.stringify(theirs)) as ProgressDoc;
  for (const p of paths) {
    const i = p.indexOf("/"), k = i < 0 ? p : p.slice(0, i), e = i < 0 ? null : p.slice(i + 1);
    if (e === null) {
      if ((SETTINGS as readonly string[]).includes(k)) (out as Record<string, unknown>)[k] = mine[k as (typeof SETTINGS)[number]];
    } else if (e === "__proto__") {
      continue;
    } else if ((MAPS as readonly string[]).includes(k)) {
      const src = mine[k as (typeof MAPS)[number]] as Record<string, unknown>, dst = out[k as (typeof MAPS)[number]] as Record<string, unknown>;
      if (own(src, e)) dst[e] = src[e]; else delete dst[e];
    } else if (k === "days") {
      out.days = out.days.filter(d => d !== e);
      if (mine.days.includes(e)) out.days.push(e);
    } else if (k === "mist") {
      const m = mine.mist.find(x => x.id === e);
      out.mist = out.mist.filter(x => x.id !== e);
      if (m) out.mist.push(m);
    }
  }
  out.days = [...new Set(out.days)].sort().slice(-MAX_DAYS);
  out.mist = out.mist.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).slice(-MAX_MISTAKES);
  return out;
}
