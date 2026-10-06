import Link from "next/link";

export const metadata = { title: "Terms of service" };

// Plain terms for a free learning site. If you run this site, read them, add your contact details
// (NEXT_PUBLIC_CONTACT_EMAIL) and adjust anything that does not match how you operate it.
const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function Page() {
  return (
    <div className="stack" style={{ maxWidth: 760 }}>
      <span className="eyebrow">Terms of service</span>
      <h1>Rules for using this site</h1>
      <p className="lead">The short version: this is a free tool for learning data structures and algorithms. Use it to learn, do not abuse it, and understand that it comes with no guarantees.</p>

      <div className="card stack" style={{ gap: 10 }}>
        <h3>Using the site</h3>
        <p className="muted">You can read the lessons, solve the problems and run code without an account. By using the site you agree to these terms. If you do not agree, please do not use it.</p>
      </div>

      <div className="card stack" style={{ gap: 10 }}>
        <h3>Accounts</h3>
        <p className="muted">Signing in with Google is optional and only used to save your progress so it follows you between devices. You are responsible for what happens under your account. What we store, and how to delete it, is described on the <Link href="/privacy">privacy page</Link>.</p>
      </div>

      <div className="card stack" style={{ gap: 10 }}>
        <h3>Fair use</h3>
        <p className="muted">The code runner is for practising the problems on this site. Do not use it to attack this site or anyone else, to send spam, to mine cryptocurrency, to try to break out of the sandbox, or to run automated traffic that overloads the service. Do not try to access other people&apos;s accounts or data.</p>
        <p className="muted">We may limit, suspend or remove access for anyone who does these things.</p>
      </div>

      <div className="card stack" style={{ gap: 10 }}>
        <h3>Your code and notes</h3>
        <p className="muted">The code and notes you write here stay yours. We store them only to show them back to you. The lessons, explanations and reference solutions are provided for your personal learning.</p>
        <p className="muted">Some problems link to other websites for extra practice. Those sites are run by other people and have their own terms.</p>
      </div>

      <div className="card stack" style={{ gap: 10 }}>
        <h3>No guarantees</h3>
        <p className="muted">The site is provided as it is, free of charge. We try to keep the content correct and the service running, but we do not promise that it is free of mistakes, always available, or that your saved progress can never be lost. Using it does not guarantee any interview or job outcome.</p>
      </div>

      <div className="card stack" style={{ gap: 10 }}>
        <h3>Changes</h3>
        <p className="muted">We may change the site or these terms. If you keep using the site after a change, the new terms apply. You can stop using the site and delete your account at any time from <Link href="/progress">Progress</Link>.</p>
        {CONTACT && <p className="muted">Questions: <a href={`mailto:${CONTACT}`}>{CONTACT}</a></p>}
      </div>
    </div>
  );
}
