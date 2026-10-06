import { currentUser } from "@/lib/server/auth";
import { getProgress, saveProgress, touchUser } from "@/lib/server/db";
import { json, rateLimited, readBody, sameOrigin } from "@/lib/server/http";
import { MAX_DOC_BYTES, sanitizeProgress } from "@/lib/progress";

/**
 * GET /api/progress                         → { data, rev, updatedAt, gen }   (data is null and rev is 0 before the first save)
 * PUT /api/progress { data, baseRev, gen? } → { rev, updatedAt, gen }
 *                                           → 409 { data, rev, updatedAt, gen } when the account holds a newer copy
 *
 * Both need a signed-in user and only ever touch that user's own row.
 *
 * 401 codes:
 *   signed_out       no valid session
 *   account_missing  the session is valid but the account was deleted
 *   user_changed     the browser tab thinks it is someone else (it sends the user id it believes in as
 *                    X-Dojo-User), or it last synced with an earlier incarnation of this account (`gen`).
 *                    Either way it must reload before it may read or write anything.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SAVES_PER_MINUTE = Number(process.env.SAVES_PER_MINUTE || 60);
const unavailable = (e: unknown) => { console.error("[progress]", (e as Error).message); return json({ error: "Could not reach the database. Try again in a moment." }, 503); };
const signedOut = () => json({ error: "Sign in to save progress.", code: "signed_out" }, 401);
const gone = () => json({ error: "This account no longer exists. Sign in again.", code: "account_missing" }, 401);
const changed = () => json({ error: "A different account is signed in now. Reload the page.", code: "user_changed" }, 401);
const expects = (req: Request, userId: string) => { const want = req.headers.get("x-dojo-user"); return !want || want === userId; };

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) return signedOut();
  if (!expects(req, user.id)) return changed();
  try {
    const saved = await getProgress(user.id);
    if (!saved) return gone();
    return json({ ...saved, data: saved.data ? sanitizeProgress(saved.data) : null });
  } catch (e) { return unavailable(e); }
}

export async function PUT(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Cross-site request blocked." }, 403);
  const user = await currentUser();
  if (!user) return signedOut();
  if (!expects(req, user.id)) return changed();
  if (rateLimited(user.id, SAVES_PER_MINUTE)) return json({ error: "Saving too often. It will retry shortly." }, 429);

  const raw = await readBody(req, MAX_DOC_BYTES);
  if (raw === null) return json({ error: "Saved data is too large." }, 413);
  let body: { data?: unknown; baseRev?: unknown; gen?: unknown };
  try { body = JSON.parse(raw); } catch { return json({ error: "Invalid JSON body." }, 400); }
  if (!body || typeof body !== "object" || !body.data || typeof body.data !== "object" || Array.isArray(body.data)) return json({ error: "Missing progress data." }, 400);
  const baseRev = body.baseRev;
  if (typeof baseRev !== "number" || !Number.isInteger(baseRev) || baseRev < 0 || baseRev > 2147483647) return json({ error: "Missing or invalid baseRev." }, 400);

  try {
    const gen = await touchUser(user.id);
    if (!gen) return gone();
    if (typeof body.gen === "string" && body.gen !== gen) return changed();
    const saved = await saveProgress(user.id, sanitizeProgress(body.data), baseRev);
    if (saved) return json({ ...saved, gen });
    const current = await getProgress(user.id);
    if (!current) return gone();
    return json({ ...current, data: current.data ? sanitizeProgress(current.data) : null }, 409);
  } catch (e) { return unavailable(e); }
}
