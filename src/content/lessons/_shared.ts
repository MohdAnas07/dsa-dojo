/**
 * Small helpers pasted at the top of lesson code samples (each sample runs on its own).
 * Keep each helper's line count fixed: examples refer to their own lines by number.
 */

/** A 4-line binary heap. less(x, y) = "x should be closer to the top than y". Followed by a comment line. */
export const HEAP = `class Heap { constructor(less) { this.a = []; this.less = less; } get size() { return this.a.length; } peek() { return this.a[0]; }
  push(x) { const a = this.a; a.push(x); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (!this.less(a[i], a[p])) break; [a[i], a[p]] = [a[p], a[i]]; i = p; } }
  pop() { const a = this.a, top = a[0], last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && this.less(a[l], a[m])) m = l; if (r < a.length && this.less(a[r], a[m])) m = r; if (m === i) break; [a[i], a[m]] = [a[m], a[i]]; i = m; } } return top; }
}
// ↑ a small binary heap (see the Heap lesson). less(x, y) decides who goes on top.
`;
/** Number of lines HEAP adds before your code starts. */
export const HEAP_LINES = 5;

/** A 4-line union-find with path halving and union by size. Followed by a comment line. */
export const DSU = `class DSU { constructor(n) { this.p = Array.from({ length: n }, (_, i) => i); this.sz = new Array(n).fill(1); }
  find(x) { while (this.p[x] !== x) { this.p[x] = this.p[this.p[x]]; x = this.p[x]; } return x; }
  union(a, b) { let x = this.find(a), y = this.find(b); if (x === y) return false; if (this.sz[x] < this.sz[y]) [x, y] = [y, x]; this.p[y] = x; this.sz[x] += this.sz[y]; return true; }
}
// ↑ a small union-find (see the Union Find lesson): find(x) gives x's group, union(a, b) merges two groups.
`;
