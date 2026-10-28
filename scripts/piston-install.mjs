/**
 * Installs the language packages DSA Dojo uses on a Piston server.
 * Usage: node scripts/piston-install.mjs [http://localhost:2000] [extra-package ...]
 *
 * Piston package names differ from language names in a few places:
 *   gcc → c++.
 * Keep this list in sync with the `piston.pkg` fields in src/lib/languages.ts.
 */
const args = process.argv.slice(2);
const base = (args[0] && /^https?:\/\//.test(args[0]) ? args.shift() : "http://localhost:2000").replace(/\/+$/, "");
const WANT = ["python", "java", "gcc", "go", ...args];
const headers = { "Content-Type": "application/json", ...(process.env.PISTON_TOKEN ? { Authorization: process.env.PISTON_TOKEN } : {}) };
const cmpVer = (a, b) => a.split(".").map(Number).reduce((r, x, i) => r || x - (Number(b.split(".")[i]) || 0), 0);

// Piston takes a few seconds to start after `docker compose up`, so wait up to 90 s for it.
let pkgs;
for (let i = 0; ; i++) {
  try { pkgs = await (await fetch(`${base}/api/v2/packages`, { headers })).json(); break; }
  catch {
    if (i >= 45) {
      console.error(`\nCould not reach Piston at ${base}.\n- Is Docker Desktop open and running?\n- Start Piston with: npm run piston:up   (check it with: docker ps)\n- See its log with: npm run piston:logs`);
      process.exit(1);
    }
    if (i === 0) process.stdout.write(`Waiting for Piston at ${base} `); else process.stdout.write(".");
    await new Promise(r => setTimeout(r, 2000));
  }
}
console.log(pkgs && process.stdout.isTTY ? "\nConnected to Piston." : "Connected to Piston.");

let failed = 0;
for (const name of WANT) {
  const versions = pkgs.filter(p => p.language === name);
  if (!versions.length) { console.log(`- ${name}: not available on this Piston server`); failed++; continue; }
  if (versions.some(p => p.installed)) { console.log(`✓ ${name} already installed`); continue; }
  const latest = versions.map(p => p.language_version).sort(cmpVer).pop();
  process.stdout.write(`… installing ${name} ${latest} (can take a few minutes) `);
  const res = await fetch(`${base}/api/v2/packages`, { method: "POST", headers, body: JSON.stringify({ language: name, version: latest }) });
  if (res.ok) console.log("✓"); else { failed++; console.log(`failed (${res.status}): ${await res.text()}`); }
}
const runtimes = await (await fetch(`${base}/api/v2/runtimes`, { headers })).json();
console.log("\nInstalled runtimes:", runtimes.map(r => `${r.language} ${r.version}`).join(", "));
process.exit(failed ? 1 : 0);
