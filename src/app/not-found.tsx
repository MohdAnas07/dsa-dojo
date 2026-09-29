import Link from "next/link";
export default function NotFound() {
  return <div className="stack"><h1>Page not found</h1><p className="lead">That link doesn&apos;t match anything here.</p><Link className="btn pri" href="/">Go to dashboard</Link></div>;
}
