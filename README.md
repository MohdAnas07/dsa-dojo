# DSA Dojo

A DSA learning and interview-prep platform: structured lessons with interactive visualizers, runnable code, 401 interview problems (93 easy, 262 medium, 46 hard; each tagged with every topic and pattern it trains, with linked similar problems) with a built-in judge (JavaScript and Python), a multi-language code playground, a pattern finder, flashcards, cheat sheets, a mistake notebook and a progress tracker.

Built with **Next.js 15 (App Router) + TypeScript**, CodeMirror 6, Framer Motion and Lucide icons.

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
```

`npm run dev` and `npm run build` first run `scripts/generate-expected.ts`, which executes every code sample and every reference solution and writes `src/generated/expected.json`. If any sample crashes or a test is inconsistent, the build stops and tells you which one.

Other scripts: `npm run build`, `npm start`, `npm run typecheck`, `npm run verify` (problems and starters), `npm run verify:backend` (accounts API).

## Deploy (JavaScript works everywhere)

**Vercel (recommended)**
1. Push this folder to a GitHub repository.
2. On vercel.com → **Add New → Project** → import the repo. The defaults are correct (framework: Next.js).
3. Click **Deploy**. Lessons, visualizers, progress tracking, the JavaScript judge and the JavaScript playground all work immediately.

Any host that runs Next.js works too (Netlify, Render, Railway, a VPS with `npm run build && npm start`).

Out of the box, progress is stored in each visitor's browser (`localStorage`), so the site works with no database. To let people sign in and keep their progress in an account, see the next section.

## Accounts: Google sign-in and saved progress

With four settings in place, visitors get a **Sign in** button. After signing in with Google, their progress (completed lessons, problem statuses, editor code, latest results, flashcards, mistake notes, streak, language setting) is saved to a Postgres database and follows them to any device. Without the settings, the button does not appear and the site behaves exactly as before.

### 1. Create a Postgres database

Any Postgres works. [Neon](https://neon.tech) has a free tier and takes about a minute: create a project, then copy the **pooled** connection string. It looks like `postgresql://user:password@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require`.

You do not need to create tables. The two tables (`users`, `progress`) are created automatically the first time someone signs in (see `src/lib/server/db.ts`).

### 2. Create Google sign-in credentials

1. Open [Google Cloud Console](https://console.cloud.google.com/) and create a project (or pick one).
2. **APIs & Services → OAuth consent screen**: choose **External**, enter the app name, your support email and your site's domain. The default scopes (email, profile, openid) are all this app uses.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID → Web application**:
   - Authorized JavaScript origins: `https://your-domain.com` and `http://localhost:3000`
   - Authorized redirect URIs: `https://your-domain.com/api/auth/callback/google` and `http://localhost:3000/api/auth/callback/google`
4. Copy the **Client ID** and **Client secret**.
5. While the app's publishing status is **Testing**, only the test users you list can sign in. Switch it to **In production** when you are ready for everyone. Google may ask for a privacy policy link; this site has one at `/privacy` (read it and adjust it to your situation first).

Google moves these screens around from time to time; the names above are the ones to look for.

### 3. Add the settings

Locally, put them in `.env.local` (see `.env.example`). On your host, add them as environment variables (Vercel → Project → Settings → Environment Variables) and redeploy.

```
DATABASE_URL=postgresql://...            # from step 1
GOOGLE_CLIENT_ID=....apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=...                      # a long random string: openssl rand -base64 32
NEXTAUTH_URL=https://your-domain.com     # locally: http://localhost:3000
```

`NEXTAUTH_URL` must be the exact address people use, and it must match the redirect URI you gave Google. Keep `NEXTAUTH_SECRET` and `GOOGLE_CLIENT_SECRET` private; changing `NEXTAUTH_SECRET` signs everyone out.

### 4. Check it

```bash
npm run dev                 # sign in at http://localhost:3000/login
npm run verify:backend      # in a second terminal: checks the API against your database
```

`verify:backend` reads `.env.local`, creates two throwaway users, tests saving, loading, conflicts, validation, cross-user isolation and account deletion, then removes them. Use `BASE_URL=https://your-domain.com npm run verify:backend` to check a deployed site (with that site's `DATABASE_URL` and `NEXTAUTH_SECRET`).

### How it works

- **Sign-in** is handled by [next-auth](https://next-auth.js.org) (`src/lib/server/auth.ts`). The session is a signed, http-only cookie that lasts 30 days from the last visit, so there is no session table.
- **The browser copy stays the working copy**, so pages stay static and fast, and the site keeps working offline. `src/lib/sync.ts` saves it to the account about 1.5 seconds after each change and loads the account's copy on page load and when you return to the tab.
- **First sign-in keeps what the visitor already did**: progress made before signing in is combined with the account (`mergeProgress` in `src/lib/progress.ts`).
- **Devices do not overwrite each other's work.** Every save carries the revision it was based on. If the account has moved on, the server answers `409` with its copy. The browser then takes that copy and re-applies only the things it changed itself since its last save (`applyLocalChanges`), so an old draft sitting on one device never replaces a newer one from another. The one case with a loser: if two devices change the *same* item (the same editor draft, the same problem's status) before either has synced, the one that saves last wins for that item.
- **Signing out** saves anything pending, clears the browser's copy and reloads the page, so the next person on that computer starts clean. If the last changes could not be saved (offline, database down), they are kept in the browser instead and saved at the next sign-in.
- **Other tabs follow along**: signing in, out, or switching account in one tab reloads the others, and the server refuses a request from a tab that still believes it is someone else.
- **Everything stored is validated** on the server (`sanitizeProgress`): unknown keys are dropped, types checked, sizes capped (1.5 MB per user; 64,000 characters per editor and 10,000 per note field, longer text is shortened).

| Endpoint | What it does |
|---|---|
| `GET /api/auth/session` | Who is signed in (also renews the session) |
| `GET /api/progress` | The signed-in user's saved progress and its revision |
| `PUT /api/progress` | Save progress: `{ data, baseRev }` → `{ rev }`, or `409` with the newer copy. `401` carries a `code`: `signed_out`, `account_missing` or `user_changed` |
| `DELETE /api/account` | Delete the signed-in user and all their saved progress |

Each user has one row in `users` (Google id, email, name, picture, first and last seen) and one row in `progress` (a JSON document plus a revision number). To see how many people have signed up: `select count(*) from users;`.

**Troubleshooting**
- *No Sign in button*: one of the four settings is missing. The server log names which.
- *Moving to a new database*: copy the `users` and `progress` tables across first. If people's accounts are missing from the new database they are signed out; their browser keeps its copy and it is saved again when they sign back in, but devices they do not use again have nothing to restore from.
- *Google shows `redirect_uri_mismatch`*: the redirect URI in Google Cloud does not exactly match `NEXTAUTH_URL` + `/api/auth/callback/google`.
- *Sign-in returns to `/login` with an error*: the database could not be reached; check `DATABASE_URL`. A "self-signed certificate" error means your provider's certificate is not publicly trusted; follow their Node.js instructions for the connection string.
- *Saves limited*: `SAVES_PER_MINUTE` (default 60 per user, per server instance) and `DATABASE_POOL_MAX` (default 5 connections) can be raised with environment variables.

## Enable other languages (Python, Java, C++, C, Go, TypeScript)

Server languages are sent from `/api/execute` to a **Piston** server, which runs each submission in an isolated sandbox with time and memory limits. Never run user code directly on your web server.

1. Get a small Linux VM with Docker (any VPS provider; 1–2 GB RAM is enough to start). Piston needs `privileged` containers, which most "serverless" hosts don't allow.
2. Copy `docker-compose.piston.yml` and `scripts/piston-install.mjs` to the VM, then:
   ```bash
   docker compose -f docker-compose.piston.yml up -d
   node scripts/piston-install.mjs http://localhost:2000
   ```
3. Make Piston reachable from your web app over HTTPS, protected so only your app can call it (for example a reverse proxy such as Caddy or Nginx with a secret header, or a private network). If you add a header check, put the same value in `PISTON_TOKEN`.
4. In your hosting dashboard (Vercel → Project → Settings → Environment Variables) set:
   ```
   PISTON_URL=https://your-piston-host
   PISTON_TOKEN=your-secret        # optional
   ```
5. Redeploy. The language menu on problems and in the playground now runs Python and the others.

Without `PISTON_URL`, the site still works and shows a note that server languages aren't configured.

**Local development without Docker:** `node scripts/dev-executor.mjs` starts a stand-in for Piston on `127.0.0.1:2000` that runs code with your locally installed `python3`, `node`, `g++`, `javac`, `go`. It is **not sandboxed**: use it only on your own machine. Then create `.env.local` with `PISTON_URL=http://127.0.0.1:2000`.

API limits are set by `RUN_TIMEOUT_MS` (default 10 s per run) and `RATE_LIMIT_PER_MINUTE` (default 30 per IP, per server instance). For multiple instances, replace the in-memory limiter in `src/app/api/execute/route.ts` with Redis/Upstash.

## How code runs

| Where | Language | How |
|---|---|---|
| Code samples in lessons, JS playground, JS judge | JavaScript | A throwaway Web Worker in the visitor's browser (no page or network access), killed after a timeout |
| Playground | Python, Java, C++, C, Go, TypeScript | `POST /api/execute` → Piston |
| Problem judge | Python | The Python driver (`src/lib/drivers/python.ts`) wraps the user's `class Solution`, reads the tests from stdin as JSON, and prints one result line per test. The browser compares results with the expected answers. |

Expected answers come from the JavaScript reference solutions at build time, so every language is checked against the same answers. Large hidden tests (100,000 elements) catch O(n²) solutions; each test also has a time limit (1 s in the browser, 2 s on the server).

## Project structure

```
src/
  app/                    routes (App Router): /, /learn/[slug], /problems/[id], /playground, /login, /privacy,
                          /api/execute, /api/auth/*, /api/progress, /api/account, …
  views/                  page components
  components/             AppShell (sidebar, search, shortcuts), CodeBlock, CodeEditor, SolvePanel, VisualExplanation, …
  content/
    lessons/<slug>.ts     one file per lesson (12-section format) + index.ts registry
    roadmap.ts            every roadmap topic, learning path, levels, patterns, decision tree, clue list
    problems-core.ts      the original 49 problems (+ judge-core-specs.ts)
    problemsets/*.ts      the other 352 problems, one file per area (ProblemDef format)
    catalog.ts            merges everything, builds tags, demo code and similar-problem links
    flashcards.ts, snippets.ts
  lib/
    languages.ts          language registry (browser vs server, Piston names)
    drivers/              judge drivers + starter-code generators per language
    runner.ts             browser sandbox, server calls, judging
    judge-core.ts         data-structure helpers + answer comparison (shared by browser, server and build)
    viz.ts                interactive visualizers
    store.ts              progress stored in localStorage (the working copy)
    progress.ts           which parts of the progress are saved to an account; validation and merging
    sync.ts               keeps the browser copy and the account in step
    server/               database (db.ts), sign-in (auth.ts), request helpers (http.ts); server-only
scripts/
  generate-expected.ts    build-time checker/generator
  dev-executor.mjs        local-only Piston stand-in
  piston-install.mjs      installs languages on a Piston server
```

## Extending

**Add a lesson** (e.g. Heap): create `src/content/lessons/heap.ts` exporting a `Lesson` (copy an existing one as a template), then register it in `src/content/lessons/index.ts`. The topic already exists in `roadmap.ts`, so the sidebar, roadmap, search and flashcards pick it up automatically. The build runs every code sample in it.

**Add a problem:** add a `ProblemDef` to the matching file in `src/content/problemsets/` (see `src/lib/types.ts`). Key fields: `tp` (every topic it uses), `pt` (every pattern), `sim` (optional hand-picked similar ids), `fn` + `params` (`"nums:number[], k:number"`), `ret`, `ex` (examples as `[...args, expected]`), `hid` (hidden test inputs; expected outputs are computed from `code`, the JavaScript reference solution), plus `cmp`/`check` when several answers are correct and `ctor`/`methods` for design problems. Parameter types: `number`, `double`, `number[]`, `number[][]`, `string`, `string[]`, `string[][]`, `character[][]`, `boolean`, `ListNode`, `ListNode[]`, `TreeNode`, `cycle`. Then run `npm run verify`: it runs every reference solution, checks the examples, validators, tags and timing, and makes sure every JS and Python starter parses.

**Add a language to the playground:** add it to `LANGUAGES` in `src/lib/languages.ts` with its Piston name (and optionally a CodeMirror highlighter in `src/components/CodeEditor.tsx`).

**Add judging for a language** (e.g. Java): write `src/lib/drivers/java.ts` with
1. a starter-code generator (`class Solution { public int[] twoSum(int[] nums, int target) { … } }`),
2. a program generator that combines helper classes, the user's code and a `main` that reads `{"spec", "cases"}` JSON from stdin and prints `@@DOJO_CASE@@<i>` and `@@DOJO_RESULT@@<json>` lines (see the Python driver for the exact protocol).

Then register the starter in `src/lib/drivers/index.ts`, set `judge: true` in `languages.ts`, and add a branch in `runJudge` in `src/lib/runner.ts`. Typed languages need a small JSON parser and per-type conversion; using each problem's `params` types keeps that generic.
