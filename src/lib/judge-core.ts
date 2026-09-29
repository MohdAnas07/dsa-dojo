/* Shared by the browser, the server driver generator and the build script. */
// Runs in the worker AND at build time: data-structure helpers + one test-case runner.
export const HARNESS_SRC = `class ListNode { constructor(val = 0, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }
function __toList(a) { let h = null; for (let i = a.length - 1; i >= 0; i--) h = new ListNode(a[i], h); return h; }
function __fromList(h) { const o = []; let n = 0; while (h && n++ < 100000) { o.push(h.val); h = h.next; } if (h) throw new Error("Returned list has a cycle or is too long"); return o; }
function __toTree(a) {
  if (!a || !a.length || a[0] === null) return null;
  const root = new TreeNode(a[0]), q = [root]; let i = 1, h = 0;
  while (i < a.length && h < q.length) {
    const n = q[h++];
    if (i < a.length && a[i] !== null) { n.left = new TreeNode(a[i]); q.push(n.left); } i++;
    if (i < a.length && a[i] !== null) { n.right = new TreeNode(a[i]); q.push(n.right); } i++;
  }
  return root;
}
function __fromTree(r) {
  const o = [], q = [r]; let h = 0;
  while (h < q.length && o.length < 200000) { const n = q[h++]; if (n) { o.push(n.val); q.push(n.left, n.right); } else o.push(null); }
  while (o.length && o[o.length - 1] === null) o.pop();
  return o;
}
function __cycle(arg) {
  const vals = arg[0], pos = arg[1], h = __toList(vals);
  if (h && pos >= 0) { let t = h, p = null, i = 0; while (true) { if (i === pos) p = t; if (!t.next) break; t = t.next; i++; } t.next = p; }
  return h;
}
function __in(type, v) {
  if (type === "ListNode") return __toList(v);
  if (type === "TreeNode") return __toTree(v);
  if (type === "cycle") return __cycle(v);
  if (type === "ListNode[]") return v.map(__toList);
  return v === undefined ? v : JSON.parse(JSON.stringify(v));
}
function __out(type, v) {
  if (type === "ListNode") return __fromList(v);
  if (type === "TreeNode") return __fromTree(v);
  return v;
}
function __runCase(fn, spec, args) {
  if (spec.design) {
    const ops = args[0], vals = args[1], out = []; let obj = null;
    for (let i = 0; i < ops.length; i++) {
      if (i === 0) { obj = new fn(...vals[0].map((v, j) => __in(spec.ctor && spec.ctor[j] ? spec.ctor[j][1] : "", v))); out.push(null); continue; }
      if (typeof obj[ops[i]] !== "function") throw new TypeError("Your class has no method " + ops[i] + "()");
      const r = obj[ops[i]](...vals[i]); out.push(r === undefined ? null : r);
    }
    return out;
  }
  const a = spec.params.map((p, i) => __in(p[1], args[i]));
  const r = fn(...a);
  if (spec.inplace !== undefined && spec.inplace !== null) return __out(spec.params[spec.inplace][1], a[spec.inplace]);
  return __out(spec.ret, r);
}`;

// Comparison, shared by the page and the build step
export function judgeNorm(cmp: string | undefined, v: unknown): unknown {
  const byVal = (a: unknown, b: unknown) => (JSON.stringify(a) < JSON.stringify(b) ? -1 : JSON.stringify(a) > JSON.stringify(b) ? 1 : 0);
  if (cmp === "float") { const r = (x: unknown): unknown => typeof x === "number" ? Math.round(x * 1e5) / 1e5 + 0 : Array.isArray(x) ? x.map(r) : x; return r(v); }
  if (!Array.isArray(v)) return v;
  if (cmp === "unordered") return [...v].sort(byVal);
  if (cmp === "outer") return [...v].sort(byVal);
  if (cmp === "groups") return v.map(x => (Array.isArray(x) ? [...x].sort(byVal) : x)).sort(byVal);
  return v;
}
export function judgeEqual(cmp: string | undefined, a: unknown, b: unknown): boolean {
  try { return JSON.stringify(judgeNorm(cmp, a)) === JSON.stringify(judgeNorm(cmp, b)); } catch (e) { return false; }
}
// Large expected outputs are stored as a fingerprint of their normalized JSON
export function judgeHash(str: string): string { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16) + ":" + str.length; }
const checkCache = new Map<string, (args: unknown[], out: unknown, exp: unknown) => boolean>();
/** Compile a validator for problems with several correct answers: (args, out, exp) => boolean */
export function compileCheck(src: string) {
  if (!checkCache.has(src)) checkCache.set(src, new Function("return (" + src + ")")());
  return checkCache.get(src)!;
}
export function judgeCheck(cmp: string | undefined, expected: unknown, got: unknown, check?: string, args?: unknown[]): boolean {
  if (check && args) { try { return !!compileCheck(check)(JSON.parse(JSON.stringify(args)), got, expected); } catch { return false; } }
  if (expected && typeof expected === "object" && !Array.isArray(expected) && (expected as { __hash?: string }).__hash) {
    try { return judgeHash(JSON.stringify(judgeNorm(cmp, got))) === (expected as { __hash: string }).__hash; } catch (e) { return false; }
  }
  return judgeEqual(cmp, expected, got);
}
