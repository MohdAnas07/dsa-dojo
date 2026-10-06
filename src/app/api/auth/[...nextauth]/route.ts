import NextAuth from "next-auth";
import { authConfigured, authOptions, missingAuthEnv } from "@/lib/server/auth";
import { json } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Accounts are optional. Until the settings exist, the browser is told so (and keeps progress locally).
let warned = false;
const off = (req: Request) => {
  if (!warned) { warned = true; console.warn("[auth] Sign-in is off. Missing settings:", missingAuthEnv().join(", ")); }
  return req.method === "GET" ? json({ disabled: true }) : json({ error: "Sign-in is not set up on this site." }, 503);
};
const handler = authConfigured ? NextAuth(authOptions) : off;
export { handler as GET, handler as POST };
