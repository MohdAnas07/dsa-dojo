"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CloudAlert, CloudCheck, LogIn, LogOut, RefreshCw } from "lucide-react";
import { deleteAccount, signInWithGoogle, signOutHere, useAccount, type Account, type AccountUser } from "@/lib/sync";
import { toast } from "./Toast";

/** One-line description of where the user's progress currently stands. */
export function syncLabel(a: Account): string {
  if (a.status === "loading") return "Loading your saved progress…";
  if (a.status === "saving") return "Saving…";
  if (a.status === "error") return a.error || "Could not save. Retrying shortly.";
  return a.error ? `Saved. ${a.error}` : "All progress saved to your account";
}

function SyncIcon({ a }: { a: Account }) {
  if (a.status === "error") return <CloudAlert size={14} style={{ color: "var(--bad)" }} />;
  if (a.status === "saving" || a.status === "loading") return <RefreshCw size={14} className="spin" style={{ color: "var(--warn)" }} />;
  return <CloudCheck size={14} style={{ color: "var(--good)" }} />;
}

export function Avatar({ user, size = 24 }: { user: AccountUser; size?: number }) {
  const [broken, setBroken] = useState(false);
  const letter = (user.name || user.email).trim().charAt(0).toUpperCase();
  return user.image && !broken
    // eslint-disable-next-line @next/next/no-img-element
    ? <img className="avatar" src={user.image} alt="" width={size} height={size} referrerPolicy="no-referrer" onError={() => setBroken(true)} />
    : <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.48 }} aria-hidden="true">{letter}</span>;
}

/** Google's sign-in button, following their branding rules (logo on a white tile, "Continue with Google"). */
export function GoogleButton({ returnTo = "/" }: { returnTo?: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button className="gbtn" disabled={busy} onClick={async () => {
      setBusy(true);
      try { await signInWithGoogle(returnTo); } catch { setBusy(false); toast("Could not start sign-in. Check your connection and try again."); }
    }}>
      <span className="g"><svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg></span>
      {busy ? "Opening Google…" : "Continue with Google"}
    </button>
  );
}

async function doSignOut() {
  // On success the page reloads and shows the confirmation there.
  if (!(await signOutHere())) toast("Could not reach the server, so you are still signed in. Check your connection and try again.");
}

/** Top-bar control: "Sign in" when signed out, the user's picture and a small menu when signed in. */
export function AccountButton() {
  const a = useAccount();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  if (a.status === "checking" || a.status === "off") return null;
  if (!a.user) {
    if (path === "/login") return null;
    return <Link className="iconbtn signin" href={`/login?callbackUrl=${encodeURIComponent(path)}`}><LogIn size={15} />Sign in</Link>;
  }
  const u = a.user;
  return (
    <div className="acct" ref={ref}>
      <button className="iconbtn acct-btn" aria-haspopup="menu" aria-expanded={open} aria-label={`Account: ${u.name || u.email}. ${syncLabel(a)}`} onClick={() => setOpen(v => !v)}>
        <Avatar user={u} size={22} /><SyncIcon a={a} />
      </button>
      {open && (
        <div className="acct-menu" role="menu">
          <div className="row" style={{ gap: 10, flexWrap: "nowrap" }}>
            <Avatar user={u} size={34} />
            <div style={{ minWidth: 0 }}><div className="nm">{u.name || "Signed in"}</div><div className="em">{u.email}</div></div>
          </div>
          <div className={"sync-line" + (a.status === "error" ? " bad" : "")} role="status"><SyncIcon a={a} /><span>{syncLabel(a)}</span></div>
          <Link className="acct-item" role="menuitem" href="/progress">Your progress and account</Link>
          <button className="acct-item" role="menuitem" onClick={() => { setOpen(false); void doSignOut(); }}><LogOut size={14} />Sign out</button>
        </div>
      )}
    </div>
  );
}

/** Account section on the Progress page. */
export function AccountCard() {
  const a = useAccount();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  if (a.status === "checking" || a.status === "off") return null;
  if (!a.user) return (
    <div className="card acct-card">
      <div style={{ flex: 1, minWidth: 220 }}>
        <h3>Save your progress to your account</h3>
        <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>Right now your progress lives only in this browser. Sign in and everything you have done so far is saved to your account, so it is there on your phone, another laptop, or after clearing your browser.</p>
      </div>
      <GoogleButton returnTo="/progress" />
    </div>
  );
  const u = a.user;
  return (
    <div className="card acct-card">
      <Avatar user={u} size={44} />
      <div style={{ flex: 1, minWidth: 200 }}>
        <div className="nm" style={{ fontSize: 16 }}>{u.name || "Signed in"}</div>
        <div className="em">{u.email}</div>
        <div className={"sync-line" + (a.status === "error" ? " bad" : "")} role="status" style={{ border: 0, padding: "6px 0 0" }}><SyncIcon a={a} /><span>{syncLabel(a)}{a.status === "synced" && a.savedAt ? ` · last saved ${new Date(a.savedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}` : ""}</span></div>
      </div>
      {confirm ? (
        <span className="row">
          <b style={{ color: "var(--bad)" }}>Delete your account and all saved progress? This cannot be undone.</b>
          <button className="btn sm" disabled={busy} style={{ borderColor: "var(--bad)", color: "var(--bad)" }} onClick={async () => {
            setBusy(true);
            if (!(await deleteAccount())) { setBusy(false); setConfirm(false); toast("Could not delete the account. Check your connection and try again."); }
          }}>{busy ? "Deleting…" : "Yes, delete everything"}</button>
          <button className="btn sm" disabled={busy} onClick={() => setConfirm(false)}>Cancel</button>
        </span>
      ) : (
        <span className="row">
          <button className="btn sm" onClick={() => void doSignOut()}><LogOut size={14} />Sign out</button>
          <button className="btn sm ghost" onClick={() => setConfirm(true)}>Delete account</button>
        </span>
      )}
    </div>
  );
}
