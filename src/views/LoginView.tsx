"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GoogleButton, Avatar } from "@/components/Account";
import { useAccount } from "@/lib/sync";

// Messages for the error codes next-auth adds to the URL when sign-in does not complete.
const ERRORS: Record<string, string> = {
  AccessDenied: "Sign-in was cancelled, or that Google account cannot be used here.",
  Callback: "We could not set up your account just now. Please try again in a minute.",
  OAuthSignin: "Could not start sign-in with Google. Please try again.",
  OAuthCallback: "Google sign-in did not complete. Please try again.",
  Configuration: "Sign-in is not set up correctly on this site yet."
};

/** Only ever send people back to a page on this site. */
function safeReturn(v: string | null): string {
  if (!v || typeof window === "undefined") return "/";
  try {
    const u = new URL(v, window.location.origin);
    if (u.origin !== window.location.origin) return "/";
    // Collapse leading slashes: a link to "//host/…" would leave the site.
    const path = "/" + u.pathname.replace(/^[/\\]+/, "");
    return path.startsWith("/login") ? "/" : path + u.search + u.hash;
  } catch { return "/"; }
}

export default function LoginView() {
  const a = useAccount();
  const sp = useSearchParams();
  const back = safeReturn(sp.get("callbackUrl"));
  const err = sp.get("error");
  return (
    <div className="login">
      <div className="card stack" style={{ gap: 14, padding: 26 }}>
        <span className="eyebrow">Your account</span>
        {a.user ? <>
          <h1 style={{ fontSize: 28 }}>You are signed in</h1>
          <div className="row" style={{ flexWrap: "nowrap" }}><Avatar user={a.user} size={40} /><div style={{ minWidth: 0 }}><div className="nm">{a.user.name || "Signed in"}</div><div className="em">{a.user.email}</div></div></div>
          <p className="muted">Your progress is saved to this account as you go.</p>
          <div className="row"><Link className="btn pri" href={back}>Continue</Link><Link className="btn" href="/progress">Progress and account</Link></div>
        </> : a.status === "off" ? <>
          <h1 style={{ fontSize: 28 }}>Accounts are not switched on yet</h1>
          <p className="muted">This site is running without sign-in. Your progress is saved in this browser, and everything else works as usual.</p>
          <div className="row"><Link className="btn pri" href="/">Go to dashboard</Link></div>
        </> : <>
          <h1 style={{ fontSize: 28 }}>Sign in to save your progress</h1>
          <p className="muted">Lessons completed, problems solved, your code, mistakes and streak are saved to your account and follow you to any device.</p>
          {err && <p className="login-err" role="alert">{ERRORS[err] || "Something went wrong while signing in. Please try again."}</p>}
          <div><GoogleButton returnTo={back} /></div>
          <ul className="clean ok" style={{ fontSize: 14, color: "var(--muted)" }}>
            <li>Anything you have already done in this browser is kept and added to your account.</li>
            <li>We only receive your name, email address and profile picture from Google.</li>
            <li>You can keep using the site without an account.</li>
          </ul>
          <p className="faint" style={{ fontSize: 13 }}>See the <Link href="/privacy">privacy page</Link> for exactly what is stored and how to delete it.</p>
        </>}
      </div>
    </div>
  );
}
