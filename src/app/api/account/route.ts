import { currentUser } from "@/lib/server/auth";
import { deleteUser } from "@/lib/server/db";
import { json, rateLimited, sameOrigin } from "@/lib/server/http";

/** DELETE /api/account → removes the signed-in user and everything saved for them. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Cross-site request blocked." }, 403);
  const user = await currentUser();
  if (!user) return json({ error: "Sign in first." }, 401);
  if (rateLimited("del:" + user.id, 5)) return json({ error: "Too many requests." }, 429);
  try { await deleteUser(user.id); return json({ ok: true }); }
  catch (e) { console.error("[account]", (e as Error).message); return json({ error: "Could not reach the database. Try again in a moment." }, 503); }
}
