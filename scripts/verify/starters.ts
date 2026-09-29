/** Checks that the generated starter code of every problem parses in JavaScript and Python. */
import { spawnSync } from "node:child_process";
import { JUDGE } from "../../src/content/judge";
import { jsStarter } from "../../src/lib/drivers/javascript";
import { pyStarter, pyProgram } from "../../src/lib/drivers/python";

let bad = 0; const py: string[] = [];
for (const [id, sp] of Object.entries(JUDGE)) {
  try { new Function(jsStarter(sp) + "\n;return " + sp.fn); } catch (e) { bad++; console.log("JS", id, (e as Error).message); }
  py.push(`# ${id}\ntry:\n    compile(${JSON.stringify(pyProgram(pyStarter(sp)))}, "${id}", "exec")\nexcept SyntaxError as e:\n    print("PY", "${id}", e)\n`);
}
const r = spawnSync("python3", ["-"], { input: py.join("\n"), encoding: "utf8", maxBuffer: 50e6 });
if (r.stdout.trim()) { bad++; console.log(r.stdout.trim()); }
if (r.stderr.trim()) { bad++; console.log(r.stderr.trim().slice(-500)); }
console.log(bad ? "Starter problems found" : `✓ ${Object.keys(JUDGE).length} JavaScript and Python starters parse`);
process.exit(bad ? 1 : 0);
