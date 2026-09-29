export const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

const KW = new Set("const let var function return if else for while do of in new class extends this null undefined true false break continue switch case default typeof instanceof try catch finally throw async await yield static".split(" "));
const BUILTIN = new Set("Math Map Set Array Number String Object Infinity console JSON Boolean BigInt Date".split(" "));
export function tokenize(code: string): [string, string][] {
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(\/(?![*\/])(?:\\.|\[[^\]\n]*\]|[^\/\\\n])+\/[gimsuy]*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([\s\S])/g;
  const out: [string, string][] = []; let m: RegExpExecArray | null, prev = "";
  while ((m = re.exec(code))) {
    const [t, com, str, rx, num, id, ws] = m;
    if (com) out.push(["c", t]);
    else if (str) out.push(["s", t]);
    else if (rx) {
      if (!prev || /[(,=:\[!&|?{};]$/.test(prev) || prev === "return") out.push(["s", t]);
      else { re.lastIndex = m.index + 1; out.push(["", "/"]); prev = "/"; continue; }
    }
    else if (num) out.push(["n", t]);
    else if (id) {
      let cls = "";
      if (KW.has(t)) cls = "k";
      else if (BUILTIN.has(t)) cls = "b";
      else if (/^\s*\(/.test(code.slice(re.lastIndex))) cls = "f";
      else if (prev === ".") cls = "p";
      out.push([cls, t]);
    } else out.push(["", t]);
    if (!ws) prev = t;
  }
  return out;
}
/** Returns one HTML string per line, with token spans. */
export function highlightLines(code: string): string[] {
  const lines = [""];
  for (const [cls, text] of tokenize(code)) {
    text.split("\n").forEach((piece, i) => {
      if (i > 0) lines.push("");
      if (piece) lines[lines.length - 1] += cls ? `<span class="tk-${cls}">${esc(piece)}</span>` : esc(piece);
    });
  }
  return lines;
}

