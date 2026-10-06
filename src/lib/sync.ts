"use client";
/**
 * Keeps a signed-in user's progress in step with their account.
 *
 * The browser copy (localStorage) stays the working copy, so the site is instant and keeps
 * working offline. This module only decides when to send that copy up and when to take the
 * account's copy instead:
 *
 *  - On page load it asks who is signed in, then loads their saved progress.
 *  - Progress made before signing in is combined with the account the first time.
 *  - Every change is saved about a second and a half after the last edit.
 *  - The browser remembers exactly which things it changed since its last save ("touched").
 *    When the account has moved on (another device saved first), it takes the account's copy
 *    and re-applies only those things. A newer draft from another device is therefore never
 *    replaced by an older one that was merely sitting in this browser.
 *  - Each save says which revision it was based on; the server refuses a save based on an old
 *    revision (409), which triggers the step above.
 *  - Coming back to the tab re-checks the account, so two devices stay in step.
 */
import { useSyncExternalStore } from "react";
import { getState, replaceFromRemote, setChangeListener, type State } from "./store";
import { applyLocalChanges, canon, diffPaths, emptyProgress, isEmptyProgress, mergeProgress, pickProgress, sanitizeProgress, type ProgressDoc } from "./progress";

export interface AccountUser { id: string; email: string; name: string | null; image: string | null }
/** off: accounts not configured · anon: signed out · loading/saving/synced/error: signed in */
export type SyncStatus = "checking" | "off" | "anon" | "loading" | "saving" | "synced" | "error";
export interface Account { status: SyncStatus; user: AccountUser | null; savedAt: number | null; error: string | null }

/**
 * What this browser knows about its last sync. Lives in localStorage so all tabs share it.
 *   uid      whose progress the browser copy is
 *   rev      the account revision the browser copy was last in step with
 *   gen      the account's generation id (changes if the account is deleted and created again)
 *   touched  things changed here since then: path → sequence number of the change
 *   full     the browser copy has never been reconciled with the account (first sign-in), so
 *            everything in it counts as unsaved and is combined with the account, not replaced by it
 */
interface Meta { uid: string; rev: number; gen: string | null; seq: number; touched: Record<string, number>; full: boolean }
const META_KEY = "dsa-dojo-sync", FLASH_KEY = "dsa-dojo-flash";
const SAVE_DELAY = 1500, RECHECK_AFTER = 30_000, RETRY = [4000, 15_000, 60_000];

function parseMeta(raw: string | null): Meta | null {
  try {
    const m = JSON.parse(raw || "null");
    if (!m || typeof m.uid !== "string" || !Number.isInteger(m.rev)) return null;
    const touched: Record<string, number> = {};
    if (m.touched && typeof m.touched === "object") for (const [k, v] of Object.entries(m.touched)) if (typeof v === "number") touched[k] = v;
    return { uid: m.uid, rev: m.rev, gen: typeof m.gen === "string" ? m.gen : null, seq: Number.isInteger(m.seq) ? m.seq : 0, touched, full: !!m.full };
  } catch { return null; }
}
function readMeta(): Meta | null { try { return parseMeta(localStorage.getItem(META_KEY)); } catch { return null; } }
function writeMeta(m: Meta | null) {
  try { if (m) localStorage.setItem(META_KEY, JSON.stringify(m)); else localStorage.removeItem(META_KEY); } catch { /* ignore */ }
}
const unsaved = (m: Meta | null): boolean => !!m && (m.full || Object.keys(m.touched).length > 0);

let account: Account = { status: "checking", user: null, savedAt: null, error: null };
const SERVER_ACCOUNT: Account = account;
const subs = new Set<() => void>();
function set(patch: Partial<Account>) { account = { ...account, ...patch }; subs.forEach(f => f()); }
export function useAccount(): Account {
  return useSyncExternalStore(cb => { subs.add(cb); return () => subs.delete(cb); }, () => account, () => SERVER_ACCOUNT);
}

let started = false;
let saveTimer: ReturnType<typeof setTimeout> | undefined;
let retryTimer: ReturnType<typeof setTimeout> | undefined;
let busy: Promise<void> | null = null;
let again = false;
let failures = 0;
let pulled = false;   // the account's copy has been loaded at least once in this tab
let leaving = false;  // the page is about to reload; stop reacting to events
let lastPull = 0;

const local = (): ProgressDoc => pickProgress(getState());
const adopt = (doc: ProgressDoc) => replaceFromRemote(doc);

/** A message to show after the page reloads (sign-out and account deletion reload the page). */
function flash(message: string) { try { sessionStorage.setItem(FLASH_KEY, message); } catch { /* ignore */ } }
export function takeFlash(): string | null {
  try { const m = sessionStorage.getItem(FLASH_KEY); if (m) sessionStorage.removeItem(FLASH_KEY); return m; } catch { return null; }
}
function reload(to?: string) { leaving = true; clearTimeout(saveTimer); clearTimeout(retryTimer); if (to) window.location.assign(to); else window.location.reload(); }

async function api(method: "GET" | "PUT", user: AccountUser, body?: unknown, keepalive = false): Promise<{ status: number; data: any }> {
  const res = await fetch("/api/progress", {
    method, cache: "no-store", credentials: "same-origin", keepalive,
    // The server compares this with the session and refuses if a different account is signed in now.
    headers: { "X-Dojo-User": user.id, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

/** Handles a 401. The session ended (expired or signed out elsewhere), the account was deleted, or someone else is signed in now. */
async function unauthorized(code?: string) {
  clearTimeout(saveTimer); clearTimeout(retryTimer);
  // Another account is signed in (or this account was re-created): this tab's idea of who it is is stale.
  if (code === "user_changed") return reload();
  pulled = false;
  if (code === "account_missing") {
    // Keep the browser copy (it may be the only one left, for example after the site moved to a new database),
    // but forget which revision it matched so a later sign-in combines it instead of trusting old numbers.
    const m = readMeta();
    if (m) writeMeta({ ...m, gen: null, full: true });
    await endSession();
  }
  // Otherwise the session simply expired: the browser copy and its unsaved marks stay, and are saved on the next sign-in.
  set({ status: "anon", user: null, savedAt: null, error: null });
}

function fail(message: string) {
  set({ status: "error", error: message });
  clearTimeout(retryTimer);
  retryTimer = setTimeout(() => { void run(pulled ? push : pull); }, RETRY[Math.min(failures, RETRY.length - 1)]);
  failures++;
}

/** Runs one sync step at a time. A save requested while a step is in flight runs right after it. */
function run(step: () => Promise<void>): Promise<void> {
  if (leaving) return Promise.resolve();
  if (busy) { again = true; return busy; }
  busy = step()
    .catch(() => fail("You appear to be offline. Changes are kept in this browser and will be saved when you are back."))
    .finally(() => { busy = null; if (again) { again = false; if (account.user && pulled && unsaved(readMeta())) schedule(0); } });
  return busy;
}

/** Sends the browser copy to the account, if anything in it is unsaved. */
async function push(keepalive = false): Promise<void> {
  const user = account.user; if (!user) return;
  for (let attempt = 0; attempt < 4; attempt++) {
    const meta = readMeta();
    if (!meta || meta.uid !== user.id) return;
    if (!unsaved(meta)) { if (account.status !== "synced") set({ status: "synced", error: null }); return; }
    // Send exactly what the server will keep. If that differs from the browser copy (text over the
    // size limit was shortened), the browser copy is brought in line so the two never drift apart.
    const raw = local(), doc = sanitizeProgress(raw);
    let shortened = false;
    if (canon(doc) !== canon(raw)) { adopt(doc); shortened = true; }
    const sentSeq = meta.seq;
    set({ status: "saving", error: null });
    // keepalive lets a save finish while the page is closing, but browsers cap those bodies at 64 KB.
    const r = await api("PUT", user, { data: doc, baseRev: meta.rev, gen: meta.gen ?? undefined }, keepalive && JSON.stringify(doc).length < 60_000);
    const now = readMeta() ?? meta; // another tab may have added changes while the request was in flight
    if (r.status === 200) {
      failures = 0;
      // Changes made after the copy was sent (higher sequence numbers) are still unsaved.
      const touched = Object.fromEntries(Object.entries(now.touched).filter(([, seq]) => seq > sentSeq));
      const next: Meta = { ...now, rev: r.data.rev, gen: r.data.gen ?? now.gen, full: false, touched };
      writeMeta(next);
      set({ status: "synced", savedAt: Date.now(), error: shortened ? "Some very long text was shortened to fit the account's size limit." : null });
      if (unsaved(next)) schedule();
      return;
    }
    if (r.status === 409) {
      // The account changed since this browser last looked. Take its copy, put this browser's own changes back on top, save again.
      const theirs = r.data.data ? sanitizeProgress(r.data.data) : emptyProgress();
      adopt(now.full ? mergeProgress(local(), theirs) : applyLocalChanges(theirs, local(), Object.keys(now.touched)));
      writeMeta({ ...now, rev: r.data.rev, gen: r.data.gen ?? now.gen });
      continue;
    }
    if (r.status === 401) return unauthorized(r.data.code);
    if (r.status === 413) { set({ status: "error", error: "Your saved code is too large to store in your account. Reset a few editors you no longer need." }); return; }
    return fail(r.data.error || "Could not save. Retrying shortly.");
  }
  fail("Could not save. Retrying shortly.");
}

/** Loads the account's copy and reconciles it with the browser copy. */
async function pull(): Promise<void> {
  const user = account.user; if (!user) return;
  if (!pulled) set({ status: "loading", error: null });
  const r = await api("GET", user);
  if (r.status === 401) return unauthorized(r.data.code);
  if (r.status !== 200) return fail(r.data.error || "Could not load your saved progress. Retrying shortly.");
  lastPull = Date.now(); failures = 0; pulled = true;
  const rev: number = r.data.rev, gen: string | null = typeof r.data.gen === "string" ? r.data.gen : null;
  const theirs: ProgressDoc | null = r.data.data ? sanitizeProgress(r.data.data) : null;
  const meta = readMeta();
  const mine = local();
  const clean: Meta = { uid: user.id, rev, gen, seq: meta?.seq ?? 0, touched: {}, full: false };
  let next: Meta;

  if (meta && (meta.uid !== user.id || (meta.gen && gen && meta.gen !== gen))) {
    // This browser last held someone else's progress, or progress of an account that has since been
    // deleted and created again. Never mix: the signed-in account's copy replaces it.
    adopt(theirs ?? emptyProgress());
    next = clean;
  } else if (!theirs) {
    // Nothing saved in the account yet: this browser's copy becomes the account's.
    next = { ...clean, full: !isEmptyProgress(mine) };
  } else if (!meta || meta.full) {
    // First time this browser meets the account (progress made before signing in): keep everything from both.
    // A browser that never synced only has default settings, so there the account's settings win.
    if (isEmptyProgress(mine)) adopt(theirs); else adopt(mergeProgress(mine, theirs, meta ? "mine" : "theirs"));
    next = { ...clean, full: canon(local()) !== canon(theirs) };
  } else if (rev === meta.rev) {
    // The account has not changed since this browser last synced, so every difference is a change made here.
    const paths = diffPaths(theirs, mine);
    next = { ...clean, seq: meta.seq + 1, touched: Object.fromEntries(paths.map(p => [p, meta.touched[p] ?? meta.seq + 1])) };
  } else {
    // The account changed on another device: take its copy and put this browser's own unsaved changes back on top.
    const paths = Object.keys(meta.touched);
    if (paths.length) adopt(applyLocalChanges(theirs, mine, paths)); else adopt(theirs);
    next = { ...clean, touched: Object.fromEntries(diffPaths(theirs, local()).map(p => [p, meta.touched[p] ?? meta.seq])) };
  }
  writeMeta(next);
  if (unsaved(next)) return push();
  set({ status: "synced", savedAt: r.data.updatedAt ? new Date(r.data.updatedAt).getTime() : null, error: null });
}

function schedule(delay = SAVE_DELAY) {
  if (leaving) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { void run(push); }, delay);
}

function onLocalChange(prev: State, next: State) {
  if (leaving) return;
  const meta = readMeta();
  // Before the first sync there is nothing to compare against: the whole copy counts as unsaved (see `full`).
  if (!meta) return;
  // Changes to things that are not saved to the account (theme, collapsed menu groups) produce no paths.
  const paths = diffPaths(pickProgress(prev), pickProgress(next));
  if (!paths.length) return;
  // Recorded even while signed out, so edits made after a session expires are saved on the next sign-in.
  const seq = meta.seq + 1;
  for (const p of paths) meta.touched[p] = seq;
  writeMeta({ ...meta, seq });
  const user = account.user;
  if (user && pulled && meta.uid === user.id) schedule();
}
// Registered as soon as this module loads, so no early change (a page marking itself "last visited") is missed.
if (typeof window !== "undefined") setChangeListener(onLocalChange);

/** Starts account sync. Safe to call more than once. */
export function startSync() {
  if (started || typeof window === "undefined") return;
  started = true;
  document.addEventListener("visibilitychange", () => {
    if (!account.user || !pulled) return;
    if (document.visibilityState === "hidden") { if (unsaved(readMeta())) { clearTimeout(saveTimer); void run(() => push(true)); } }
    else if (Date.now() - lastPull > RECHECK_AFTER) void run(pull);
  });
  window.addEventListener("online", () => { if (account.user) void run(pulled ? push : pull); });
  // Another tab signed in, signed out or switched account: this tab's idea of who is signed in is stale, so start over.
  window.addEventListener("storage", e => {
    if (e.key !== META_KEY || leaving) return;
    if ((parseMeta(e.oldValue)?.uid ?? null) !== (parseMeta(e.newValue)?.uid ?? null)) reload();
  });
  void refreshAccount();
}

/**
 * Asks the server who is signed in, then loads their progress.
 * Reading the session also renews it, so people who keep visiting stay signed in.
 */
export async function refreshAccount(): Promise<void> {
  try {
    const res = await fetch("/api/auth/session", { cache: "no-store", credentials: "same-origin" });
    const me = await res.json();
    if (me?.disabled) return set({ status: "off", user: null });
    const u = me?.user;
    if (!u?.id || !u.email) return set({ status: "anon", user: null });
    set({ status: "loading", user: { id: u.id, email: u.email, name: u.name ?? null, image: u.image ?? null } });
    await run(pull);
  } catch {
    // Offline on first load: behave as signed out for now and look again when the connection returns.
    set({ status: "anon", user: null });
    window.addEventListener("online", () => { void refreshAccount(); }, { once: true });
  }
}

/** Sends the visitor to Google and brings them back to `returnTo`. */
export async function signInWithGoogle(returnTo = "/") {
  const { signIn } = await import("next-auth/react");
  await signIn("google", { callbackUrl: returnTo });
}

/** Ends the session and confirms the server agrees. (next-auth's signOut does not report failure.) */
async function endSession(): Promise<boolean> {
  try {
    const { signOut } = await import("next-auth/react");
    await signOut({ redirect: false });
    const me = await (await fetch("/api/auth/session", { cache: "no-store", credentials: "same-origin" })).json();
    return !me?.user;
  } catch { return false; }
}

/**
 * Signs out. Returns false (and stays signed in) only if the server could not be reached.
 *
 * Unsaved changes are sent first. When everything is safely in the account, this browser's copy is
 * cleared so the next person on this computer starts clean. If something could not be saved, the
 * copy is left in this browser instead of being thrown away, and is saved on the next sign-in.
 */
export async function signOutHere(): Promise<boolean> {
  clearTimeout(saveTimer); clearTimeout(retryTimer);
  if (busy) await busy;
  const user = account.user;
  let saved = false;
  if (user) {
    if (!pulled) await run(pull); else if (unsaved(readMeta())) await run(push);
    const m = readMeta();
    saved = pulled && !!m && m.uid === user.id && !unsaved(m);
  }
  if (!(await endSession())) return false;
  if (saved) { adopt(emptyProgress()); writeMeta(null); }
  flash(saved ? "Signed out. Your progress is safe in your account."
    : "Signed out. Your latest changes could not be saved yet, so they are kept in this browser and will be saved the next time you sign in.");
  // A full reload, so nothing of the previous user (an open editor, for instance) stays on screen.
  reload("/");
  return true;
}

/** Deletes the account and everything saved for it, then signs out. */
export async function deleteAccount(): Promise<boolean> {
  clearTimeout(saveTimer); clearTimeout(retryTimer);
  if (busy) await busy;
  try {
    const res = await fetch("/api/account", { method: "DELETE", credentials: "same-origin" });
    if (!res.ok) return false;
  } catch { return false; }
  // If ending the session fails, the cookie is left behind, but the server rejects it ("account_missing").
  await endSession();
  adopt(emptyProgress()); writeMeta(null);
  flash("Account and saved progress deleted");
  reload("/");
  return true;
}
