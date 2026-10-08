import Link from "next/link";

export const metadata = { title: "Privacy" };

// Plain description of what this code stores. If you run this site, add your contact details
// below and adjust the text if you add analytics, ads or anything else that handles personal data.
const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function Page() {
  return (
    <div className="stack" style={{ maxWidth: 760 }}>
      <span className="eyebrow">Privacy</span>
      <h1>What this site stores about you</h1>
      <p className="lead">The short version: without an account, nothing leaves your browser. With an account, we store your Google profile basics and your learning progress, and you can delete both at any time.</p>

      <div className="card stack" style={{ gap: 10 }}>
        <h3>If you do not sign in</h3>
        <p className="muted">Your progress (completed lessons, solved problems, code you write, notes, streak and settings) is kept in your browser&apos;s local storage on your device. It is not sent to our servers. Clearing your browser data removes it.</p>
      </div>

      <div className="card stack" style={{ gap: 10 }}>
        <h3>If you sign in with Google</h3>
        <p className="muted">Google tells us your name, email address, profile picture and a Google account identifier. We do not receive your password and we do not get access to your Gmail, Drive, contacts or anything else in your Google account.</p>
        <p className="muted">We store that profile information together with your learning progress: completed lessons, problem statuses, the code in your editors, your latest result for each problem, flashcard answers, mistake notes, the days you were active, and your language setting. This is used only to show your progress back to you on any device.</p>
        <p className="muted">Signing in sets a few cookies that keep you signed in (for 30 days after your last visit) and protect the sign-in step. They are not used for advertising or tracking.</p>
      </div>

      <div className="card stack" style={{ gap: 10 }}>
        <h3>Visitor statistics</h3>
        <p className="muted">To see how many people use the site, we count page visits with Vercel Web Analytics. It records which page was opened, the referring site, your country, and your browser and device type. It does not use cookies, does not store your IP address, and cannot identify you. We only see totals, such as visitors per day.</p>
      </div>

      <div className="card stack" style={{ gap: 10 }}>
        <h3>Running your code</h3>
        <p className="muted">JavaScript runs inside your own browser. Code in other languages is sent to a code-execution server, run in an isolated sandbox, and the output is returned to you. Running code does not save it anywhere new: the only saved copy is the editor draft described above.</p>
      </div>

      <div className="card stack" style={{ gap: 10 }}>
        <h3>Deleting your data</h3>
        <p className="muted">Open <Link href="/progress">Progress</Link> and choose <b>Delete account</b>. This permanently removes your profile and all saved progress from our database. You can also remove this site&apos;s access from your Google account settings at any time.</p>
        {CONTACT && <p className="muted">Questions: <a href={`mailto:${CONTACT}`}>{CONTACT}</a></p>}
      </div>
    </div>
  );
}
