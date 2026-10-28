/** Graph input parsing and a deterministic layered layout shared by the BFS / DFS scenes. */
export interface G { nodes: string[]; adj: Map<string, string[]>; edges: [string, string][]; directed: boolean }

export function parseGraph(text: string, directed = false, maxNodes = 10): G {
  const parts = String(text ?? "").split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
  if (!parts.length) throw new Error('Describe edges like "A-B, A-C, B-D".');
  const edges: [string, string][] = [], nodes: string[] = [];
  const add = (n: string) => { if (!nodes.includes(n)) nodes.push(n); };
  for (const p of parts) {
    const m = p.match(/^([A-Za-z0-9]{1,3})\s*(?:-+>?|>|→)\s*([A-Za-z0-9]{1,3})$/);
    if (m) { if (m[1] === m[2]) throw new Error(`Self-loops like ${p} aren't supported here.`); add(m[1]); add(m[2]); if (!edges.some(([a, b]) => (a === m[1] && b === m[2]) || (!directed && a === m[2] && b === m[1]))) edges.push([m[1], m[2]]); continue; }
    if (/^[A-Za-z0-9]{1,3}$/.test(p)) { add(p); continue; }
    throw new Error(`Can't read "${p}". Write edges like A-B${directed ? " (meaning A → B)" : ""}.`);
  }
  if (nodes.length > maxNodes) throw new Error(`Use at most ${maxNodes} nodes so the graph stays readable.`);
  const adj = new Map(nodes.map(n => [n, [] as string[]]));
  for (const [a, b] of edges) { adj.get(a)!.push(b); if (!directed) adj.get(b)!.push(a); }
  // Neighbours in a stable, readable order (alphabetical / numeric), like most textbook examples.
  const cmp = (x: string, y: string) => (/^\d+$/.test(x) && /^\d+$/.test(y) ? +x - +y : x.localeCompare(y));
  for (const l of adj.values()) l.sort(cmp);
  return { nodes, adj, edges, directed };
}

/** Columns by BFS distance from `start` (unreachable nodes go in a last column), rows ordered by parents' positions. */
export function layout(g: G, start: string, w0 = 110, h0 = 76): { pos: Map<string, { x: number; y: number }>; w: number; h: number } {
  const lvl = new Map<string, number>([[start, 0]]), q = [start];
  while (q.length) { const u = q.shift()!; for (const v of g.adj.get(u)!) if (!lvl.has(v)) { lvl.set(v, lvl.get(u)! + 1); q.push(v); } }
  const maxL = Math.max(0, ...lvl.values());
  for (const n of g.nodes) if (!lvl.has(n)) lvl.set(n, maxL + 1);
  const cols: string[][] = [];
  for (const n of g.nodes) (cols[lvl.get(n)!] ||= []).push(n);
  const pos = new Map<string, { x: number; y: number }>();
  const rowOf = new Map<string, number>();
  cols.forEach((col, c) => {
    if (!col) return;
    if (c > 0) {
      const bc = (n: string) => { const ps = g.nodes.filter(p => (lvl.get(p)! < c) && (g.adj.get(p)!.includes(n) || g.adj.get(n)!.includes(p)) && rowOf.has(p)).map(p => rowOf.get(p)!); return ps.length ? ps.reduce((a, b) => a + b, 0) / ps.length : 99; };
      col.sort((a, b) => bc(a) - bc(b));
    }
    col.forEach((n, r) => rowOf.set(n, r - (col.length - 1) / 2));
  });
  const tall = Math.max(...cols.filter(Boolean).map(c => c.length));
  const h = Math.max(150, tall * h0 + 20), w = Math.max(220, (cols.length - 1) * w0 + 70);
  for (const n of g.nodes) pos.set(n, { x: 35 + lvl.get(n)! * w0, y: h / 2 + rowOf.get(n)! * h0 });
  return { pos, w, h };
}

/** Grid input like "2 1 1 / 1 1 0 / 0 1 1" or one row per line. */
export function parseGrid(text: string, allowed: string, maxR = 6, maxC = 8): string[][] {
  const rows = String(text ?? "").split(/[\/\n|]+/).map(r => r.trim()).filter(Boolean).map(r => r.split(/[\s,]+/).filter(Boolean));
  if (!rows.length) throw new Error('Enter grid rows separated by "/", like "1 1 0 / 0 1 1".');
  const w = rows[0].length;
  if (rows.some(r => r.length !== w)) throw new Error("Every row needs the same number of cells.");
  if (rows.length > maxR || w > maxC) throw new Error(`Keep the grid at most ${maxR} rows × ${maxC} columns.`);
  for (const r of rows) for (const c of r) if (!allowed.includes(c)) throw new Error(`Cells can only be ${allowed.split("").join(", ")} (got "${c}").`);
  return rows;
}
