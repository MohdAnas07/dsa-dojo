/**
 * Postgres access. Works with any Postgres (Neon, Supabase, Railway, RDS, a local server):
 * set DATABASE_URL and the two tables below are created automatically on first use.
 */
import { Pool, type QueryResultRow } from "pg";
import type { ProgressDoc } from "../progress";

export const DATABASE_URL = process.env.DATABASE_URL || "";

const SCHEMA = `
create table if not exists users (
  id           text primary key,               -- Google account id ("sub")
  email        text not null,
  name         text,
  image        text,
  gen          uuid not null default gen_random_uuid(),  -- new value whenever the account is created again after a delete
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
create table if not exists progress (
  user_id    text primary key references users(id) on delete cascade,
  data       jsonb not null,                   -- see ProgressDoc in src/lib/progress.ts
  rev        integer not null default 1,       -- goes up by one on every save
  updated_at timestamptz not null default now()
);`;

// One pool per server process. Kept on globalThis so dev hot-reloads do not open new pools.
const g = globalThis as unknown as { __dojoPool?: Pool; __dojoSchema?: Promise<void> };

function pool(): Pool {
  if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");
  if (!g.__dojoPool) {
    g.__dojoPool = new Pool({ connectionString: DATABASE_URL, max: Number(process.env.DATABASE_POOL_MAX || 5), idleTimeoutMillis: 20_000, connectionTimeoutMillis: 10_000 });
    g.__dojoPool.on("error", e => console.error("[db] idle client error:", e.message));
  }
  return g.__dojoPool;
}

function ready(): Promise<void> {
  if (!g.__dojoSchema) {
    // pg_advisory_xact_lock: several server instances starting at once create the tables one at a time.
    g.__dojoSchema = (async () => {
      const c = await pool().connect();
      try { await c.query("begin"); await c.query("select pg_advisory_xact_lock(727274)"); await c.query(SCHEMA); await c.query("commit"); }
      catch (e) { await c.query("rollback").catch(() => {}); throw e; }
      finally { c.release(); }
    })().catch(e => { g.__dojoSchema = undefined; throw e; });
  }
  return g.__dojoSchema;
}

async function q<T extends QueryResultRow>(text: string, params: unknown[] = []): Promise<T[]> {
  await ready();
  return (await pool().query<T>(text, params)).rows;
}

export interface UserRow { id: string; email: string; name: string | null; image: string | null }

/** Creates the user on first sign-in; afterwards refreshes their profile and last-seen time. */
export async function upsertUser(u: UserRow): Promise<void> {
  await q(
    `insert into users (id, email, name, image) values ($1, $2, $3, $4)
     on conflict (id) do update set email = excluded.email, name = excluded.name, image = excluded.image, last_seen_at = now()`,
    [u.id, u.email, u.name, u.image]
  );
}

export interface SavedProgress { data: ProgressDoc | null; rev: number; updatedAt: string | null; gen: string }

/** The user's saved copy (data is null before the first save). Null when the user row no longer exists. */
export async function getProgress(userId: string): Promise<SavedProgress | null> {
  const rows = await q<{ gen: string; data: ProgressDoc | null; rev: number | null; updated_at: Date | null }>(
    "select u.gen, p.data, p.rev, p.updated_at from users u left join progress p on p.user_id = u.id where u.id = $1", [userId]);
  const r = rows[0];
  if (!r) return null;
  return r.data && r.rev && r.updated_at ? { data: r.data, rev: r.rev, updatedAt: r.updated_at.toISOString(), gen: r.gen } : { data: null, rev: 0, updatedAt: null, gen: r.gen };
}

/** Marks the user as active and returns the account's generation id. Null when the user row no longer exists. */
export async function touchUser(userId: string): Promise<string | null> {
  const rows = await q<{ gen: string }>("update users set last_seen_at = now() where id = $1 returning gen", [userId]);
  return rows[0]?.gen ?? null;
}

/**
 * Saves progress only if the caller last saw revision `baseRev` (0 = "I have never seen a saved copy").
 * Returns the new revision, or null when someone else saved in between; the caller then
 * reads the newer copy, merges and tries again. This is what keeps two devices from
 * silently overwriting each other.
 */
export async function saveProgress(userId: string, data: ProgressDoc, baseRev: number): Promise<{ rev: number; updatedAt: string } | null> {
  const rows = await q<{ rev: number; updated_at: Date }>(
    `insert into progress (user_id, data, rev) values ($1, $2::jsonb, 1)
     on conflict (user_id) do update set data = excluded.data, rev = progress.rev + 1, updated_at = now()
       where progress.rev = $3
     returning rev, updated_at`,
    [userId, JSON.stringify(data), baseRev]
  );
  return rows[0] ? { rev: rows[0].rev, updatedAt: rows[0].updated_at.toISOString() } : null;
}

/** Deletes the user and, through the foreign key, their saved progress. */
export async function deleteUser(userId: string): Promise<void> {
  await q("delete from users where id = $1", [userId]);
}
