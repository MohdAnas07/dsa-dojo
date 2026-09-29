# DSA Dojo

A DSA learning and interview-prep platform: structured lessons with interactive visualizers, runnable code, 401 interview problems (93 easy, 262 medium, 46 hard; each tagged with every topic and pattern it trains, with linked similar problems) with a built-in judge (JavaScript and Python), a multi-language code playground, a pattern finder, flashcards, cheat sheets, a mistake notebook and a progress tracker.

Built with **Next.js 15 (App Router) + TypeScript**, CodeMirror 6, Framer Motion and Lucide icons.

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
```

`npm run dev` and `npm run build` first run `scripts/generate-expected.ts`, which executes every code sample and every reference solution and writes `src/generated/expected.json`. If any sample crashes or a test is inconsistent, the build stops and tells you which one.

Other scripts: `npm run build`, `npm start`, `npm run typecheck`.

## Deploy (JavaScript works everywhere)

**Vercel (recommended)**
1. Push this folder to a GitHub repository.
2. On vercel.com → **Add New → Project** → import the repo. The defaults are correct (framework: Next.js).
3. Click **Deploy**. Lessons, visualizers, progress tracking, the JavaScript judge and the JavaScript playground all work immediately.

Any host that runs Next.js works too (Netlify, Render, Railway, a VPS with `npm run build && npm start`).

Progress is stored in each visitor's browser (`localStorage`), so there's no database to set up.

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
  app/                    routes (App Router): /, /learn/[slug], /problems/[id], /playground, /api/execute, …
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
    store.ts              progress stored in localStorage
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
