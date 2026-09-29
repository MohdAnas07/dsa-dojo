import type { JudgeSpec } from "@/lib/types";

const jsType = (t: string) => (t === "cycle" ? "ListNode" : t === "ListNode" || t === "TreeNode" ? t + "|null" : t);

export function jsStarter(sp: JudgeSpec): string {
  if (sp.design) {
    return `class ${sp.fn} {\n  constructor() {\n    \n  }\n\n  /** @param {number} val */\n  push(val) {\n    \n  }\n\n  pop() {\n    \n  }\n\n  /** @return {number} */\n  top() {\n    \n  }\n\n  /** @return {number} */\n  getMin() {\n    \n  }\n}\n`;
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
