/**
 * Installs the language packages DSA Dojo uses on a Piston server.
 * Usage: node scripts/piston-install.mjs http://localhost:2000
 * Piston package names: python, java, gcc (C and C++), go, typescript, node.
 */
const base = (process.argv[2] || "http://localhost:2000").replace(/\/+$/, "");
const WANT = ["python", "java", "gcc", "go", "typescript", "node"];
const cmpVer = (a, b) => a.split(".").map(Number).reduce((r, x, i) => r || x - (Number(b.split(".")[i]) || 0), 0);
const pkgs = await (await fetch(`${base}/api/v2/packages`)).json();
for (const name of WANT) {
  const versions = pkgs.filter(p => p.language === name);
  if (!versions.length) { console.log(`- ${name}: not available on this Piston server`); continue; }
  if (versions.some(p => p.installed)) { console.log(`✓ ${name} already installed`); continue; }
  const latest = versions.map(p => p.language_version).sort(cmpVer).pop();
  process.stdout.write(`… installing ${name} ${latest} `);
  const res = await fetch(`${base}/api/v2/packages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language: name, version: latest }) });
  console.log(res.ok ? "✓" : `failed (${res.status}): ${await res.text()}`);
}
console.log("Installed runtimes:", (await (await fetch(`${base}/api/v2/runtimes`)).json()).map(r => `${r.language} ${r.version}`).join(", "));
