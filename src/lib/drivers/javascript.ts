import type { JudgeSpec } from "@/lib/types";

const jsType = (t: string) => (t === "cycle" ? "ListNode" : t === "ListNode" || t === "TreeNode" ? t + "|null" : t);

export function jsStarter(sp: JudgeSpec): string {
  if (sp.design) {
    const doc = (ps: [string, string][], ret?: string) => {
      const lines = [...ps.map(([n, t]) => ` @param {${jsType(t)}} ${n}`), ...(ret && ret !== "void" ? [` @return {${jsType(ret)}}`] : [])];
      return lines.length ? `  /**\n${lines.map(l => "   *" + l).join("\n")}\n   */\n` : "";
    };
    const ctor = sp.ctor || [];
    const tree = ctor.some(p => p[1] === "TreeNode") ? "// Provided: class TreeNode { val, left, right }\n\n" : "";
    const methods = (sp.methods || []).map(m => `${doc(m.params, m.ret)}  ${m.name}(${m.params.map(p => p[0]).join(", ")}) {\n    \n  }\n`).join("\n");
    return `${tree}class ${sp.fn} {\n${doc(ctor)}  constructor(${ctor.map(p => p[0]).join(", ")}) {\n    \n  }\n\n${methods}}\n`;
  }
  const list = sp.params.some(p => p[1] === "ListNode" || p[1] === "cycle") || sp.ret === "ListNode";
  const tree = sp.params.some(p => p[1] === "TreeNode") || sp.ret === "TreeNode";
  const helper = list
    ? "/**\n * Provided (don't redeclare):\n * class ListNode { constructor(val = 0, next = null) { this.val = val; this.next = next; } }\n */\n"
    : tree ? "/**\n * Provided (don't redeclare):\n * class TreeNode { constructor(val = 0, left = null, right = null) { ... } }\n */\n" : "";
  const docs = sp.params.map(([n, t]) => ` * @param {${jsType(t)}} ${n}`).join("\n");
  const inplace = sp.inplace !== undefined ? `// modify ${sp.params[sp.inplace][0]} in place\n  ` : "";
  return `${helper}/**\n${docs}\n * @return {${sp.ret === "void" ? "void" : jsType(sp.ret)}}\n */\nfunction ${sp.fn}(${sp.params.map(p => p[0]).join(", ")}) {\n  ${inplace}\n}\n`;
}
