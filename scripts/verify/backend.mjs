/**
 * End-to-end check of the accounts backend against a running server and a real database.
 *
 *   1. Start the site with DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET set.
 *   2. BASE_URL=http://localhost:3000 npm run verify:backend      (reads the same .env.local)
 *
 * It creates two throwaway users, signs them in by minting session cookies with NEXTAUTH_SECRET
 * (so no Google round trip is needed), exercises every endpoint, and deletes the users again.
 */
import { encode } from "next-auth/jwt";
import pg from "pg";
import { readFileSync, existsSync } from "node:fs";

for (const f of [".env.local", ".env"]) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const BASE = (process.env.BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/+$/, "");
const { NEXTAUTH_SECRET, DATABASE_URL } = process.env;
if (!NEXTAUTH_SECRET || !DATABASE_URL) { console.error("Set NEXTAUTH_SECRET and DATABASE_URL (same values the server uses)."); process.exit(2); }

const COOKIE = BASE.startsWith("https://") ? "__Secure-next-auth.session-token" : "next-auth.session-token";
const db = new pg.Pool({ connectionString: DATABASE_URL, max: 2 });
let failed = 0, n = 0;
const ok = (cond, name, extra = "") => { n++; if (cond) console.log("  ok   " + name); else { failed++; console.log("  FAIL " + name + (extra ? "  → " + extra : "")); } };

const mkUser = async tag => {
  const id = `verify-${tag}-${Date.now()}`, email = `${id}@example.test`;
  const token = await encode({ token: { uid: id, sub: id, email, name: "Verify " + tag }, secret: NEXTAUTH_SECRET, maxAge: 600 });
  return { id, email, cookie: `${COOKIE}=${token}` };
};
const call = async (user, method, path, body, headers = {}) => {
  const res = await fetch(BASE + path, {
    method, redirect: "manual",
    headers: { ...(user ? { Cookie: user.cookie } : {}), ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...headers },
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body)
  });
  let data = null; try { data = await res.json(); } catch { /* not JSON */ }
  return { status: res.status, data, res };
};
const doc = extra => ({ done: {}, fav: {}, weak: {}, rev: {}, ps: {}, last: null, days: [], mist: [], fk: {}, eli: false, code: {}, subs: {}, pg: {}, pgLang: "javascript", lang: "javascript", ...extra });

const a = await mkUser("a"), b = await mkUser("b");
try {
  console.log(`Checking ${BASE}`);
  let r = await call(null, "GET", "/api/auth/session");
  ok(r.status === 200 && !r.data?.disabled, "accounts are switched on", JSON.stringify(r.data));
  ok(r.status === 200 && !r.data?.user, "no cookie → signed out");
  r = await call(null, "GET", "/api/auth/providers");
  ok(r.data?.google?.callbackUrl === BASE + "/api/auth/callback/google", "Google callback URL is " + BASE + "/api/auth/callback/google", JSON.stringify(r.data));

  r = await call(null, "GET", "/api/progress"); ok(r.status === 401, "GET progress without sign-in → 401");
  r = await call(null, "PUT", "/api/progress", { data: doc(), baseRev: 0 }); ok(r.status === 401, "PUT progress without sign-in → 401");
  r = await call({ cookie: `${COOKIE}=not-a-real-token` }, "GET", "/api/progress"); ok(r.status === 401, "forged cookie → 401");
  r = await call(null, "DELETE", "/api/account"); ok(r.status === 401, "DELETE account without sign-in → 401");

  r = await call(a, "GET", "/api/progress"); ok(r.status === 401 && r.data?.code === "account_missing", "valid session but no account row → 401 account_missing");
  await db.query("insert into users (id, email, name) values ($1,$2,'A'), ($3,$4,'B')", [a.id, a.email, b.id, b.email]);

  r = await call(a, "GET", "/api/auth/session"); ok(r.data?.user?.id === a.id && r.data.user.email === a.email, "session reports the signed-in user");
  ok((r.res.headers.get("set-cookie") || "").includes(COOKIE), "reading the session renews the cookie");
  r = await call(a, "GET", "/api/progress"); ok(r.status === 200 && r.data.data === null && r.data.rev === 0, "new account has nothing saved (rev 0)");
  const gen = r.data.gen; ok(typeof gen === "string" && gen.length > 10, "account has a generation id");
  r = await call(a, "GET", "/api/progress", undefined, { "X-Dojo-User": b.id }); ok(r.status === 401 && r.data.code === "user_changed", "a tab that thinks it is another user is refused (read)");
  r = await call(a, "PUT", "/api/progress", { data: doc({ ps: { x: "solved" } }), baseRev: 0 }, { "X-Dojo-User": b.id }); ok(r.status === 401 && r.data.code === "user_changed", "a tab that thinks it is another user is refused (write)");
  r = await call(a, "PUT", "/api/progress", { data: doc({ ps: { x: "solved" } }), baseRev: 0, gen: "00000000-0000-4000-8000-000000000000" }); ok(r.status === 401 && r.data.code === "user_changed", "a save from an earlier incarnation of the account is refused");

  r = await call(a, "PUT", "/api/progress", { data: doc({ ps: { "two-sum": "solved" }, days: ["2026-10-01"], code: { "two-sum:javascript": "x=1" } }), baseRev: 0 });
  ok(r.status === 200 && r.data.rev === 1, "first save → rev 1", JSON.stringify(r.data));
  r = await call(a, "GET", "/api/progress"); ok(r.data.rev === 1 && r.data.data.ps["two-sum"] === "solved" && r.data.data.code["two-sum:javascript"] === "x=1", "saved data reads back");
  r = await call(a, "PUT", "/api/progress", { data: doc({ ps: { "two-sum": "solved", "3sum": "attempted" } }), baseRev: 1 }); ok(r.status === 200 && r.data.rev === 2, "second save → rev 2");
  r = await call(a, "PUT", "/api/progress", { data: doc({ ps: { stale: "solved" } }), baseRev: 1 });
  ok(r.status === 409 && r.data.rev === 2 && r.data.data.ps["3sum"] === "attempted", "save based on an old revision → 409 with the newer copy");
  r = await call(a, "GET", "/api/progress"); ok(!r.data.data.ps.stale, "the stale save changed nothing");

  r = await call(b, "GET", "/api/progress"); ok(r.status === 200 && r.data.data === null, "another user cannot see it");
  r = await call(b, "PUT", "/api/progress", { data: doc({ ps: { "b-only": "solved" } }), baseRev: 0 }); ok(r.status === 200 && r.data.rev === 1, "another user saves their own copy");
  r = await call(a, "GET", "/api/progress"); ok(r.data.rev === 2 && !r.data.data.ps["b-only"], "users stay separate");

  r = await call(a, "PUT", "/api/progress", { baseRev: 2, data: { ps: { ok: "solved", bad: "hacked", ["__proto__"]: "solved" }, evil: { a: 1 }, days: ["2026-10-02", "nope", 7], mist: [{ id: "1" }], lang: "constructor", code: { k: "a\u0000b", n: 5 }, theme: "dark", done: "x" } });
  ok(r.status === 200, "save with junk mixed in is accepted");
  r = await call(a, "GET", "/api/progress"); const d = r.data.data;
  ok(d.ps.ok === "solved" && !("bad" in d.ps) && !("evil" in d) && !("theme" in d), "unknown keys and invalid values are dropped");
  ok(d.days.length === 1 && d.mist.length === 0 && d.lang === "javascript" && d.code.k === "ab" && !("n" in d.code) && Object.keys(d.done).length === 0, "bad types are cleaned");

  r = await call(a, "PUT", "/api/progress", "{not json"); ok(r.status === 400, "invalid JSON → 400");
  r = await call(a, "PUT", "/api/progress", { data: doc() }); ok(r.status === 400, "missing baseRev → 400");
  r = await call(a, "PUT", "/api/progress", { data: [], baseRev: 3 }); ok(r.status === 400, "data must be an object → 400");
  r = await call(a, "PUT", "/api/progress", { data: doc(), baseRev: 2147483648 }); ok(r.status === 400, "out-of-range baseRev → 400");
  r = await call(a, "PUT", "/api/progress", { data: doc({ ps: { ok: "solved" }, mist: [{ id: "m1", prob: "p", wrong: "w".repeat(12_000), right: "", pat: "", date: "2026-10-06" }], code: { big: "c".repeat(70_000) } }), baseRev: 3 });
  ok(r.status === 200 && r.data.rev === 4, "save with over-long text is accepted");
  r = await call(a, "GET", "/api/progress");
  ok(r.data.data.mist.length === 1 && r.data.data.mist[0].wrong.length === 10_000 && r.data.data.code.big.length === 65_536, "over-long text is shortened, not dropped");
  r = await fetch(BASE + "/api/progress", { method: "PUT", duplex: "half", headers: { Cookie: a.cookie, "Content-Type": "application/json" },
    body: new ReadableStream({ start(c) { const chunk = new TextEncoder().encode("x".repeat(1 << 20)); for (let i = 0; i < 8; i++) c.enqueue(chunk); c.close(); } }) }).catch(e => ({ status: "error " + e.message }));
  ok(r.status === 413, "oversized upload without a declared length → 413", String(r.status));
  r = await call(a, "PUT", "/api/progress", { data: doc({ pg: { javascript: "x".repeat(1_600_000) } }), baseRev: 3 }); ok(r.status === 413, "oversized save → 413");
  r = await call(a, "PUT", "/api/progress", { data: doc(), baseRev: 4 }, { Origin: "https://evil.example" }); ok(r.status === 403, "save from another website → 403");
  r = await call(a, "DELETE", "/api/account", undefined, { Origin: "https://evil.example" }); ok(r.status === 403, "delete from another website → 403");
  r = await call(a, "GET", "/api/progress"); ok(r.data.rev === 4, "none of the rejected requests changed anything");
  ok(r.res.headers.get("cache-control") === "no-store", "responses are not cacheable");

  r = await call(a, "DELETE", "/api/account"); ok(r.status === 200, "delete account → 200");
  const left = await db.query("select (select count(*) from users where id = $1) u, (select count(*) from progress where user_id = $1) p", [a.id]);
  ok(left.rows[0].u === "0" && left.rows[0].p === "0", "user and progress rows are gone");
  r = await call(a, "PUT", "/api/progress", { data: doc({ ps: { x: "solved" } }), baseRev: 0 }); ok(r.status === 401 && r.data.code === "account_missing", "old session cannot bring the account back");
  r = await call(b, "GET", "/api/progress"); ok(r.data.rev === 1, "the other user is untouched");
  await db.query("insert into users (id, email, name) values ($1,$2,'A')", [a.id, a.email]);
  r = await call(a, "GET", "/api/progress"); ok(r.data.gen && r.data.gen !== gen && r.data.rev === 0, "an account created again is a new, empty incarnation");
} finally {
  await db.query("delete from users where id = any($1)", [[a.id, b.id]]).catch(() => {});
  await db.end();
}
console.log(failed ? `\n${failed} of ${n} checks FAILED` : `\nAll ${n} checks passed`);
process.exit(failed ? 1 : 0);
