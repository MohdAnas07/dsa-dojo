/**
 * Sign-in with Google (next-auth).
 *
 * Sessions are signed cookies (JWT), so signing in needs no session table. The only thing
 * stored about a person is one row in `users` and one row in `progress`.
 *
 * Accounts are switched on only when all four settings exist. Without them the site
 * still works exactly as before, with progress kept in the browser.
 */
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DATABASE_URL, upsertUser } from "./db";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "";

export const authConfigured = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && NEXTAUTH_SECRET && DATABASE_URL);

/** Names of the settings that are still missing (shown in the server log, never to visitors). */
export const missingAuthEnv = (): string[] =>
  Object.entries({ GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, DATABASE_URL }).filter(([, v]) => !v).map(([k]) => k);

if (authConfigured && !process.env.NEXTAUTH_URL && !process.env.VERCEL && process.env.NODE_ENV === "production") {
  console.warn("[auth] NEXTAUTH_URL is not set. Set it to your site's address, or Google sign-in will redirect to the wrong place.");
}

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET || undefined,
  providers: [GoogleProvider({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    async signIn({ account, profile }) {
      const p = profile as { email?: string; email_verified?: boolean; name?: string; picture?: string } | undefined;
      if (account?.provider !== "google" || !account.providerAccountId || !p?.email || p.email_verified === false) return false;
      // If the database is down the visitor lands on /login with a plain message, instead of being
      // "signed in" to an account that cannot save anything. The real error stays in the server log.
      try { await upsertUser({ id: account.providerAccountId, email: p.email, name: p.name ?? null, image: p.picture ?? null }); }
      catch (e) { console.error("[auth] could not create the user:", (e as Error).message); return "/login?error=Callback"; }
      return true;
    },
    async jwt({ token, account }) {
      if (account) token.uid = account.providerAccountId;
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.uid === "string") session.user.id = token.uid;
      return session;
    }
  }
};

export interface SessionUser { id: string; email: string; name: string | null; image: string | null }

/** The signed-in user for the current request, or null. */
export async function currentUser(): Promise<SessionUser | null> {
  if (!authConfigured) return null;
  const s = await getServerSession(authOptions);
  const u = s?.user;
  return u?.id && u.email ? { id: u.id, email: u.email, name: u.name ?? null, image: u.image ?? null } : null;
}
