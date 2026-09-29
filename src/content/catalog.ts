/**
 * The problem catalog: the original core problems + every problem set in ./problemsets,
 * normalized into Problem (what the pages show) and JudgeSpec (what the judge runs).
 */
import type { JudgeSpec, Problem, ProblemDef } from "@/lib/types";
import { CORE_PROBLEMS } from "./problems-core";
import { CORE_JUDGE } from "./judge-core-specs";
import { PROBLEM_SETS } from "./problemsets";

/** Extra topic/pattern tags for the original problems (primary tag stays first). */
const CORE_TAGS: Record<string, [string[], string[]]> = {
  "two-sum": [["hashing", "arrays"], ["hashing", "frequency-counter"]],
  "contains-duplicate": [["hashing", "arrays", "sorting"], ["hashing"]],
  "best-time-stock": [["arrays", "sliding-window", "greedy", "dp"], ["sliding-window", "greedy"]],
  "move-zeroes": [["arrays", "two-pointers"], ["two-pointers"]],
  "max-subarray": [["arrays", "dp", "divide-conquer"], ["dp", "greedy"]],
  "product-except-self": [["arrays", "prefix-sum"], ["prefix-sum"]],
  "rotate-array": [["arrays", "two-pointers"], ["two-pointers"]],
  "trapping-rain-water": [["arrays", "two-pointers", "stack", "dp"], ["two-pointers", "monotonic-stack"]],
  "valid-palindrome": [["strings", "two-pointers"], ["two-pointers"]],
  "valid-anagram": [["strings", "hashing", "sorting"], ["frequency-counter"]],
  "longest-substring": [["sliding-window", "strings", "hashing"], ["sliding-window", "hashing"]],
  "group-anagrams": [["hashing", "strings", "sorting"], ["hashing", "frequency-counter"]],
  "top-k-frequent": [["hashing", "heap", "sorting"], ["top-k", "frequency-counter"]],
  "subarray-sum-k": [["hashing", "prefix-sum", "arrays"], ["prefix-sum", "hashing"]],
  "longest-consecutive": [["hashing", "arrays", "union-find"], ["hashing"]],
  "container-water": [["two-pointers", "arrays", "greedy"], ["two-pointers", "greedy"]],
  "three-sum": [["two-pointers", "arrays", "sorting"], ["two-pointers"]],
  "max-avg-subarray": [["sliding-window", "arrays"], ["sliding-window"]],
  "min-window-substring": [["sliding-window", "strings", "hashing"], ["sliding-window", "frequency-counter"]],
  "binary-search": [["binary-search", "arrays"], ["binary-search"]],
  "search-insert": [["binary-search", "arrays"], ["binary-search"]],
  "search-rotated": [["binary-search", "arrays"], ["binary-search"]],
  "koko-bananas": [["binary-search", "arrays"], ["binary-search"]],
  "reverse-list": [["linked-list", "recursion"], ["two-pointers", "recursion"]],
  "merge-sorted-lists": [["linked-list", "recursion"], ["two-pointers"]],
  "linked-list-cycle": [["linked-list", "fast-slow", "hashing"], ["fast-slow"]],
  "remove-nth": [["linked-list", "two-pointers"], ["two-pointers", "fast-slow"]],
  "valid-parentheses": [["stack", "strings"], ["monotonic-stack"]],
  "min-stack": [["stack"], ["monotonic-stack"]],
  "daily-temperatures": [["stack", "arrays", "monotonic-stack"], ["monotonic-stack"]],
  "eval-rpn": [["stack", "math-basics"], ["recursion"]],
  "level-order": [["trees", "queue", "bfs"], ["bfs", "tree-traversal"]],
  "rotting-oranges": [["bfs", "queue", "graph"], ["bfs", "graph-traversal"]],
  "number-of-islands": [["dfs", "bfs", "graph", "union-find"], ["dfs", "graph-traversal"]],
  "fibonacci": [["recursion", "dp", "math-basics"], ["dp", "recursion"]],
  "climbing-stairs": [["dp", "recursion"], ["dp"]],
  "power-of-two": [["bit-manipulation", "math-basics", "recursion"], ["bit-manipulation"]],
  "subsets": [["backtracking", "recursion", "bit-manipulation"], ["backtracking"]],
  "permutations": [["backtracking", "recursion"], ["backtracking"]],
  "max-depth": [["trees", "recursion", "dfs"], ["tree-traversal", "dfs"]],
  "invert-tree": [["trees", "recursion"], ["tree-traversal"]],
  "same-tree": [["trees", "recursion"], ["tree-traversal"]],
  "validate-bst": [["bst", "trees", "recursion"], ["tree-traversal", "dfs"]],
  "lca-bst": [["bst", "trees"], ["tree-traversal", "binary-search"]],
  "merge-intervals": [["intervals", "sorting", "arrays"], ["merge-intervals", "intervals"]],
  "kth-largest": [["heap", "sorting", "divide-conquer"], ["top-k"]],
  "single-number": [["bit-manipulation", "arrays"], ["bit-manipulation"]],
  "house-robber": [["dp", "arrays"], ["dp"]],
  "coin-change": [["dp", "bfs"], ["dp"]]
};
const CORE_EXTRA: Record<string, Partial<JudgeSpec>> = {
  "min-stack": { methods: [{ name: "push", params: [["val", "number"]], ret: "void" }, { name: "pop", params: [], ret: "void" }, { name: "top", params: [], ret: "number" }, { name: "getMin", params: [], ret: "number" }] }
};

const parseParams = (s = ""): [string, string][] => s.split(",").map(x => x.trim()).filter(Boolean).map(x => { const i = x.indexOf(":"); return [x.slice(0, i).trim(), x.slice(i + 1).trim()]; });
const parseMethods = (s = "") => s.split(";").map(x => x.trim()).filter(Boolean).map(m => {
  const mm = m.match(/^(\w+)\((.*)\)\s*:\s*(.+)$/);
  if (!mm) throw new Error("Bad method signature: " + m);
  return { name: mm[1], params: parseParams(mm[2]), ret: mm[3].trim() };
});
const PLAIN = new Set(["number", "double", "number[]", "number[][]", "string", "string[]", "string[][]", "character[][]", "boolean"]);
const LIST_HELPERS = `class ListNode { constructor(val = 0, next = null) { this.val = val; this.next = next; } }
const buildList = a => a.reduceRight((n, v) => new ListNode(v, n), null);
const listToArray = h => { const o = []; while (h) { o.push(h.val); h = h.next; } return o; };
`;
const TREE_HELPERS = `class TreeNode { constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }
function buildTree(a) { if (!a.length || a[0] === null) return null; const r = new TreeNode(a[0]), q = [r]; let i = 1, h = 0;
  while (i < a.length) { const n = q[h++]; if (a[i] != null) q.push(n.left = new TreeNode(a[i])); i++; if (i < a.length && a[i] != null) q.push(n.right = new TreeNode(a[i])); i++; } return r; }
function treeToArray(r) { const o = [], q = [r]; for (let h = 0; h < q.length; h++) { const n = q[h]; if (n) { o.push(n.val); q.push(n.left, n.right); } else o.push(null); } while (o.length && o[o.length - 1] === null) o.pop(); return o; }
`;
const j = (v: unknown) => JSON.stringify(v);

/** Runnable demo shown under "Reference solution": the solution + console.log for each example. */
function demoCode(d: ProblemDef, params: [string, string][], cases: unknown[][]): string {
  const types = params.map(p => p[1]);
  const usesList = types.some(t => t === "ListNode" || t === "cycle" || t === "ListNode[]") || d.ret === "ListNode";
  const usesTree = types.some(t => t === "TreeNode") || d.ret === "TreeNode" || parseParams(d.ctor).some(p => p[1] === "TreeNode");
  const conv = (t: string, v: unknown) => t === "ListNode" ? `buildList(${j(v)})` : t === "TreeNode" ? `buildTree(${j(v)})` : t === "ListNode[]" ? `${j(v)}.map(buildList)`
    : t === "cycle" ? `(() => { const h = buildList(${j((v as unknown[])[0])}); let t = h, p = null, i = 0; while (t) { if (i++ === ${(v as unknown[])[1]}) p = t; if (!t.next) break; t = t.next; } if (t && p) t.next = p; return h; })()` : j(v);
  const outConv = (t: string | undefined, e: string) => t === "ListNode" ? `listToArray(${e})` : t === "TreeNode" ? `treeToArray(${e})` : e;
  let lines: string[];
  if (d.methods) {
    const ctor = parseParams(d.ctor);
    lines = cases.map(c => {
      const [ops, vals] = c as [string[], unknown[][]];
      return `{\n  const obj = new ${d.fn}(${vals[0].map((v, i) => conv(ctor[i]?.[1] || "", v)).join(", ")});\n  console.log(${j(ops.slice(1))}.map((op, i) => obj[op](...${j(vals.slice(1))}[i]) ?? null));\n}`;
    });
  } else if (d.inplace !== undefined) {
    lines = cases.map(c => `{\n  const args = [${c.map((v, i) => conv(types[i], v)).join(", ")}];\n  ${d.fn}(...args);\n  console.log(${outConv(types[d.inplace!], "args[" + d.inplace + "]")});\n}`);
  } else {
    lines = cases.map(c => `console.log(${outConv(d.ret, `${d.fn}(${c.map((v, i) => conv(types[i], v)).join(", ")})`)});`);
  }
  const plain = !usesList && !usesTree;
  return (usesList ? LIST_HELPERS : "") + (usesTree ? TREE_HELPERS : "") + (plain ? "" : "\n") + d.code.trim() + "\n\n// Examples\n" + lines.join("\n") + "\n";
}
function exampleText(params: [string, string][], c: unknown[], exp: unknown, design: boolean): string {
  if (design) return `${j(c[0])}\n${j(c[1])}\n→ ${j(exp)}`;
  return params.map(([n, t], i) => t === "cycle" ? `head = ${j((c[i] as unknown[])[0])}, pos = ${(c[i] as unknown[])[1]}` : `${n} = ${j(c[i])}`).join(", ") + ` → ${j(exp)}`;
}

const problems: Problem[] = [];
const judge: Record<string, JudgeSpec> = {};
const curated: Record<string, string[]> = {};

for (const p of CORE_PROBLEMS) {
  const [tp, pt] = CORE_TAGS[p.id] || [[p.topic], [p.pat]];
  problems.push({ ...p, topics: tp, pats: pt, similar: [] });
  judge[p.id] = { ...CORE_JUDGE[p.id], ...(CORE_EXTRA[p.id] || {}) };
}
for (const d of PROBLEM_SETS.flat()) {
  if (judge[d.id]) throw new Error("Duplicate problem id: " + d.id);
  const design = !!d.methods;
  const params: [string, string][] = design ? [["operations", "string[]"], ["arguments", "any[][]"]] : parseParams(d.params);
  const cases = d.ex.map(e => e.slice(0, -1));
  const known = d.ex.map(e => e[e.length - 1]);
  judge[d.id] = {
    fn: d.fn, params, ret: design ? "any[]" : d.ret || "void", cmp: d.cmp, inplace: d.inplace, check: d.check, note: d.note,
    design: design || undefined, ctor: design ? parseParams(d.ctor) : undefined, methods: design ? parseMethods(d.methods) : undefined,
    cases, known, hidden: d.hid || []
  };
  problems.push({
    id: d.id, t: d.t, d: d.d, topic: d.tp[0], pat: d.pt[0], topics: d.tp, pats: d.pt, similar: [], co: d.co, lc: d.lc,
    s: d.s, eg: exampleText(params, cases[0], known[0], design), h: d.h, a: d.a, c: demoCode(d, params, cases), tc: d.tc, sc: d.sc, f: d.f || []
  });
  if (d.sim) curated[d.id] = d.sim;
}

// Similar problems: curated first, then the best overlap of patterns (weight 3) and topics (weight 1).
const byId = Object.fromEntries(problems.map(p => [p.id, p]));
for (const p of problems) {
  const scored = problems.filter(q => q.id !== p.id).map(q => {
    const sp = q.pats.filter(x => p.pats.includes(x)).length, st = q.topics.filter(x => p.topics.includes(x)).length;
    const primary = (q.pat === p.pat ? 2 : 0) + (q.topic === p.topic ? 1 : 0);
    return [sp * 3 + st + primary + (q.d === p.d ? 0.3 : 0), q.id] as [number, string];
  }).filter(x => x[0] >= 4).sort((a, b) => b[0] - a[0]).map(x => x[1]);
  const cur = (curated[p.id] || []).filter(id => byId[id]);
  p.similar = [...new Set([...cur, ...scored])].slice(0, 6);
}

export const PROBLEMS = problems;
export const JUDGE = judge;
