import { NextResponse } from "next/server";

/** JSON response that is never cached by browsers or CDNs (every answer here is per-user). */
export const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Rejects requests that change data when they come from another website.
 * Browsers always send Origin on cross-site POST/PUT/DELETE, so comparing it with our own
 * host blocks cross-site request forgery (the session cookie is SameSite=Lax as well).
 */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin navigations and non-browser clients send none
  let host: string;
  try { host = new URL(origin).host; } catch { return false; }
  const ours = [req.headers.get("x-forwarded-host"), req.headers.get("host")];
  try { if (process.env.NEXTAUTH_URL) ours.push(new URL(process.env.NEXTAUTH_URL).host); } catch { /* ignore a malformed setting */ }
  return ours.includes(host);
}

// Simple per-key limit (per server instance). Use Redis/Upstash if you run many instances.
const hits = new Map<string, number[]>();
export function rateLimited(key: string, perMinute: number): boolean {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter(t => now - t < 60_000);
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 10_000) hits.clear();
  return arr.length > perMinute;
}

/**
 * Reads a request body as text, giving up as soon as it passes `maxBytes`.
 * (`req.text()` would first buffer the whole upload, however large, into memory.)
 * Returns null when the body is too large.
 */
export async function readBody(req: Request, maxBytes: number): Promise<string | null> {
  if (Number(req.headers.get("content-length") || 0) > maxBytes) return null;
  if (!req.body) return "";
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) { await reader.cancel().catch(() => {}); return null; }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}
