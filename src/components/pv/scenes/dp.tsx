import type { Mode, PatternViz, Step } from "../types";
import { nums, int } from "../types";
import { Grid, Stat, Line, type GCell } from "../prims";
import { ArrayView, Calc, cells, type AS } from "./_kit";

const robber: Mode<AS> = {
  id: "rob", label: "House robber (1D)", task: "Max money without robbing two neighbours. dp[i] = best total using houses 0..i.",
  fields: [{ key: "a", label: "houses", wide: true }],
  presets: [{ label: "Classic", values: { a: "2, 7, 9, 3, 1" } }, { label: "Skip two", values: { a: "5, 1, 1, 5" } }, { label: "Longer", values: { a: "6, 2, 3, 10, 4, 1, 8, 5" } }],
  code: `function rob(nums) {
  const dp = [];                                     //#init
  for (let i = 0; i < nums.length; i++) {            //#loop
    const skip = i >= 1 ? dp[i - 1] : 0;             //#skip
    const take = nums[i] + (i >= 2 ? dp[i - 2] : 0); //#take
    dp[i] = Math.max(skip, take);                    //#max
  }
  return dp[nums.length - 1];                        //#ret
}`,
  legend: [["sky", "house i"], ["accent", "states dp[i] depends on"], ["vio", "memoised (already solved)"], ["good", "houses robbed in the best plan"]],
  counters: [["subproblems solved", ["UPDATE_DP"]], ["comparisons", ["COMPARE"]]],
  complexity: { time: "O(n)", space: "O(n)", why: "Each dp[i] is computed once from two stored answers. Plain recursion would recompute the same subproblems again and again: O(2ⁿ). (Only the last two values are ever needed, so space can drop to O(1).)" },
  run(v) {
    const a = nums(v.a, "houses", 10), out: Step<AS>[] = [];
    if (a.some(x => x < 0)) throw new Error("Money can't be negative.");
    const dp: (number | null)[] = a.map(() => null), took: boolean[] = [];
    const pic = (i: number, o: { deps?: boolean; top?: AS["top"]; path?: Set<number> } = {}): AS => ({
      top: o.top,
      rows: [
        { label: "house $", cells: cells(a, k => o.path ? (o.path.has(k) ? "ok" : "dim") : k === i ? "cur" : undefined) },
        { label: "dp", cells: dp.map((x, k) => ({ v: x ?? "?", st: x === null && k !== i ? "ghost" : o.path ? (o.path.has(k) ? "ok" : undefined) : k === i ? (x === null ? "ghost" : "ok") : o.deps && (k === i - 1 || k === i - 2) ? "cmp" : "mem" })), arcs: o.deps ? [...(i >= 1 ? [{ from: i - 1, to: i, tone: "sky" as const, label: "skip" }] : []), ...(i >= 2 ? [{ from: i - 2, to: i, tone: "accent" as const, label: `+${a[i]}` }] : [])] : [] },
      ],
    });
    const insp = (i: number, next: string, extra: [string, string | number][] = []): [string, string | number][] => [["i", i < 0 || i >= a.length ? "–" : i], ...extra, ["dp", "[" + dp.map(x => x ?? "?").join(", ") + "]"], ["next", next]];
    out.push({ ev: "INIT", s: pic(-1), at: "init", what: "dp[i] = the most money from houses 0..i.", why: "For every house there are only two choices: skip it (keep dp[i−1]) or rob it (its money + dp[i−2], since the neighbour is off-limits). Both are already solved when we get there.", next: "Fill dp left to right.", brief: "dp[i] = max(dp[i−1], nums[i] + dp[i−2]).", inspect: insp(-1, "solve dp[0]") });
    for (let i = 0; i < a.length; i++) {
      const skip = i >= 1 ? dp[i - 1]! : 0, take = a[i] + (i >= 2 ? dp[i - 2]! : 0), robIt = take > skip;
      out.push({ ev: "COMPARE", s: pic(i, { deps: true, top: <div className="pv-stats"><Calc parts={[`skip: dp[${i - 1}]`]} result={skip} /><Calc parts={[`$${a[i]}`, `dp[${i - 2}] ${i >= 2 ? dp[i - 2] : 0}`]} result={take} /></div> }), at: ["skip", "take"], eval: robIt, decision: { cond: "take > skip", values: `${take} > ${skip}`, result: robIt, action: robIt ? `rob house ${i}` : `skip house ${i}` },
        what: `House ${i} ($${a[i]}). **Skip** it: ${skip}. **Rob** it: ${a[i]} + ${i >= 2 ? dp[i - 2] : 0} = ${take}.`, why: "Both options reuse answers we already stored: no recomputation.", next: `dp[${i}] = max(${skip}, ${take}) = ${Math.max(skip, take)}.`, brief: `max(skip ${skip}, take ${take}).`, inspect: insp(i, "store the max", [["skip", skip], ["take", take]]),
        quiz: i > 0 ? { q: `House ${i}: skipping gives ${skip}, robbing gives ${take}. Which is dp[${i}]?`, options: [`${take} (rob)`, `${skip} (skip)`, `${skip + a[i]} (both)`], answer: robIt ? 0 : 1, why: `Take the bigger option: max(${skip}, ${take}) = ${Math.max(skip, take)}. "Both" would rob two neighbours.` } : undefined });
      dp[i] = Math.max(skip, take); took[i] = robIt;
      out.push({ ev: "UPDATE_DP", s: pic(i), at: "max", what: `dp[${i}] = **${dp[i]}** (${robIt ? "rob" : "skip"} house ${i}).`, why: "Stored, so later houses can reuse it.", next: i < a.length - 1 ? `Solve dp[${i + 1}].` : "All subproblems solved.", brief: `dp[${i}] = ${dp[i]}.`, inspect: insp(i, i < a.length - 1 ? `solve dp[${i + 1}]` : "return") });
    }
    const path = new Set<number>();
    for (let i = a.length - 1; i >= 0;) { if (took[i]) { path.add(i); i -= 2; } else i--; }
    out.push({ ev: "FOUND_RESULT", s: pic(a.length, { path }), at: "ret", tone: "ok", what: `Best total: **${dp[a.length - 1]}** by robbing houses ${[...path].sort((x, y) => x - y).join(", ")}.`, why: "Walking back through the choices shows which houses were taken; no two are neighbours.", next: "Return dp[n − 1].", brief: `return ${dp[a.length - 1]}. O(n).`, inspect: insp(a.length, "done") });
    return out;
  },
  View: ArrayView,
};

const coins: Mode<AS> = {
  id: "coins", label: "Coin change", task: "Fewest coins to make an amount. dp[a] = fewest coins for amount a.",
  fields: [{ key: "c", label: "coins" }, { key: "t", label: "amount" }],
  presets: [{ label: "1, 2, 5 → 11", values: { c: "1, 2, 5", t: "11" } }, { label: "Greedy fails", values: { c: "1, 3, 4", t: "6" } }, { label: "Impossible", values: { c: "3, 5", t: "7" } }],
  code: `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity); //#init
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)             //#loop
    for (const c of coins)                      //#coin
      if (c <= a && dp[a - c] + 1 < dp[a])      //#check
        dp[a] = dp[a - c] + 1;                  //#set
  return dp[amount] === Infinity ? -1 : dp[amount]; //#ret
}`,
  legend: [["sky", "amount a"], ["accent", "dp[a − coin]"], ["vio", "solved"], ["good", "coins used"]],
  counters: [["subproblems", ["ITER"]], ["transitions tried", ["COMPARE"]], ["dp improvements", ["UPDATE_DP"]]],
  complexity: { time: "O(amount × coins)", space: "O(amount)", why: "Every amount from 1 up tries every coin once, each using an answer that's already stored. Greedy (biggest coin first) is faster but wrong: try coins 1, 3, 4 for 6." },
  run(v) {
    const cs = [...new Set(nums(v.c, "coins", 4))].sort((x, y) => x - y), T = int(v.t, "amount", 1, 13), out: Step<AS>[] = [];
    if (cs.some(c => c <= 0 || !Number.isInteger(c))) throw new Error("Coins must be positive whole numbers.");
    const dp: number[] = Array(T + 1).fill(Infinity); dp[0] = 0;
    const via: number[] = Array(T + 1).fill(0);
    const show = (x: number) => (x === Infinity ? "∞" : x);
    const pic = (a: number, o: { src?: number; c?: number; path?: Set<number>; top?: AS["top"] } = {}): AS => ({
      top: o.top,
      stats: [["coins", cs.join(", ")], ["amount", T, "sky"]],
      rows: [{ label: "dp", size: 46, gap: 7, cells: dp.map((x, k) => ({ v: show(x), st: o.path ? (o.path.has(k) ? "ok" : "dim") : k === a ? "cur" : k === o.src ? "cmp" : k < a ? "mem" : "ghost" })), arcs: o.src !== undefined ? [{ from: o.src, to: a, tone: "accent", label: `+${o.c}` }] : [] }],
    });
    const insp = (a: number, next: string, extra: [string, string | number][] = []): [string, string | number][] => [["a", a > T ? "–" : a], ...extra, ["dp[a]", a <= T ? show(dp[a]) : "–"], ["next", next]];
    out.push({ ev: "INIT", s: pic(0), at: "init", what: "dp[0] = 0: zero coins make 0. Everything else starts at ∞ (not possible yet).", why: "The best way to make amount a ends with some coin c, after the best way to make a − c. So dp[a] = 1 + min over coins of dp[a − c].", next: "Solve amounts 1, 2, … in order.", brief: "dp[a] = 1 + min(dp[a − c]).", inspect: insp(0, "a = 1") });
    for (let a = 1; a <= T; a++) {
      let first = true;
      for (const c of cs) {
        if (c > a) continue;
        const cand = dp[a - c] + 1, better = cand < dp[a];
        out.push({ ev: first ? ["ITER", "COMPARE"] : "COMPARE", s: pic(a, { src: a - c, c, top: <Calc parts={[`dp[${a - c}] ${show(dp[a - c])}`, "1 coin"]} result={show(cand)} vs={dp[a] === Infinity ? undefined : dp[a]} vsLabel={`current ${show(dp[a])}`} /> }), at: ["coin", "check"], eval: better, decision: { cond: "dp[a − c] + 1 < dp[a]", values: `${show(cand)} < ${show(dp[a])}`, result: better, action: better ? `dp[${a}] = ${cand}` : "keep current" },
          what: `Amount ${a}, coin ${c}: make ${a - c} (${show(dp[a - c])} coin${dp[a - c] === 1 ? "" : "s"}) then add one ${c}.`, why: dp[a - c] === Infinity ? `${a - c} can't be made, so neither can this route.` : better ? `${cand} coins beats ${show(dp[a])}.` : `${cand} isn't fewer than ${dp[a]}.`, next: better ? `dp[${a}] = ${cand}.` : "Try the next coin.", brief: `${show(cand)} vs ${show(dp[a])}.`, inspect: insp(a, better ? "update" : "next coin", [["coin", c], ["dp[a − c]", show(dp[a - c])]]),
          quiz: dp[a] !== Infinity && cand !== Infinity ? { q: `dp[${a}] is ${dp[a]} so far. Using coin ${c} gives ${cand}. Update?`, options: [`Yes: dp[${a}] = ${cand}`, `No: keep ${dp[a]}`], answer: better ? 0 : 1, why: better ? "Fewer coins is better." : "It isn't fewer." } : undefined });
        first = false;
        if (better) { dp[a] = cand; via[a] = c; out.push({ ev: "UPDATE_DP", s: pic(a, { src: a - c, c }), at: "set", what: `dp[${a}] = **${cand}**.`, why: `Best so far for ${a}: ${a - c} plus a ${c}.`, next: "Try the remaining coins.", brief: `dp[${a}] = ${cand}.`, inspect: insp(a, "next coin") }); }
      }
      if (first) out.push({ ev: "ITER", s: pic(a), at: "loop", what: `No coin fits in ${a}.`, why: "Every coin is bigger than the amount.", next: "dp stays ∞.", brief: `dp[${a}] = ∞.`, inspect: insp(a, "next amount") });
    }
    const path = new Set<number>(), used: number[] = [];
    if (dp[T] !== Infinity) for (let a = T; a > 0; a -= via[a]) { path.add(a); used.push(via[a]); }
    path.add(0);
    out.push({ ev: dp[T] === Infinity ? "NOT_FOUND" : "FOUND_RESULT", s: pic(T + 1, { path }), at: "ret", tone: dp[T] === Infinity ? "bad" : "ok", what: dp[T] === Infinity ? `${T} can't be made with coins ${cs.join(", ")}.` : `**${dp[T]} coins**: ${used.join(" + ")} = ${T}.`, why: dp[T] === Infinity ? "dp[amount] stayed ∞." : "Following the coin chosen at each amount walks back to 0.", next: dp[T] === Infinity ? "Return -1." : `Return ${dp[T]}.`, brief: dp[T] === Infinity ? "return -1." : `return ${dp[T]}. O(amount·coins).`, inspect: insp(T, "done") });
    return out;
  },
  View: ArrayView,
};

interface LS { A: string; B: string; dp: (number | null)[][]; cur?: [number, number]; deps: [number, number][]; arrows: { from: [number, number]; to: [number, number]; tone?: "accent" | "good" | "sky" }[]; path?: Set<string>; match?: boolean; lcs?: string }
function LcsView({ s }: { s: LS }) {
  const rows: GCell[][] = s.dp.map((row, i) => row.map((x, j) => {
    const k = i + "," + j, cur = s.cur && s.cur[0] === i && s.cur[1] === j;
    return { v: x ?? "", st: s.path ? (s.path.has(k) ? "ok" : "dim") : cur ? "cur" : s.deps.some(([a, b]) => a === i && b === j) ? "cmp" : x === null ? "ghost" : "mem" };
  }));
  return (
    <div className="pv-scene">
      <div className="pv-stats"><Stat label="a" value={`"${s.A}"`} tone="sky" /><Stat label="b" value={`"${s.B}"`} tone="sky" />{s.lcs !== undefined && <Stat label="LCS" value={`"${s.lcs}"`} tone="good" />}</div>
      {s.cur && <Line>comparing <b>a[{s.cur[0] - 1}] = &apos;{s.A[s.cur[0] - 1]}&apos;</b> and <b>b[{s.cur[1] - 1}] = &apos;{s.B[s.cur[1] - 1]}&apos;</b> → <b className={s.match ? "pv-hit" : "pv-miss"}>{s.match ? "match" : "different"}</b></Line>}
      <Grid size={40} rows={rows} rowLabels={["", ...s.A.split("")]} colLabels={["", ...s.B.split("")]} arrows={s.arrows} corner="a\b" />
    </div>
  );
}
const lcs: Mode<LS> = {
  id: "lcs", label: "Longest common subsequence (2D)", task: "dp[i][j] = LCS length of a's first i letters and b's first j letters.",
  fields: [{ key: "a", label: "a" }, { key: "b", label: "b" }],
  presets: [{ label: "abcde / ace", values: { a: "abcde", b: "ace" } }, { label: "stone / longest", values: { a: "stone", b: "longe" } }, { label: "No match", values: { a: "abc", b: "xyz" } }],
  code: `function lcs(a, b) {
  const dp = grid(a.length + 1, b.length + 1, 0); //#init
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)          //#loop
      if (a[i - 1] === b[j - 1])                 //#match
        dp[i][j] = dp[i - 1][j - 1] + 1;         //#diag
      else
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); //#max
  return dp[a.length][b.length];                 //#ret
}`,
  legend: [["sky", "cell being filled"], ["accent", "cells it depends on"], ["vio", "memoised"], ["good", "traceback path"]],
  counters: [["cells filled", ["UPDATE_DP"]], ["matches", ["FOUND_RESULT"]], ["char comparisons", ["COMPARE"]]],
  complexity: { time: "O(m × n)", space: "O(m × n)", why: "One cell per pair of prefixes, each filled in O(1) from up to three neighbours. Trying every subsequence would be exponential." },
  run(v) {
    const A = String(v.a ?? "").trim(), B = String(v.b ?? "").trim();
    if (!A || !B) throw new Error("Enter two words.");
    if (A.length > 6 || B.length > 7) throw new Error("Keep a ≤ 6 letters and b ≤ 7 letters so the table fits.");
    const m = A.length, n = B.length, out: Step<LS>[] = [];
    const dp: (number | null)[][] = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 || j === 0 ? 0 : null)));
    const snap = (o: Partial<LS> = {}): LS => ({ A, B, dp: dp.map(r => [...r]), deps: [], arrows: [], ...o });
    const insp = (i: number, j: number, next: string, extra: [string, string | number][] = []): [string, string | number][] => [["i", i], ["j", j], ["a[i−1]", i > 0 && i <= m ? `'${A[i - 1]}'` : "–"], ["b[j−1]", j > 0 && j <= n ? `'${B[j - 1]}'` : "–"], ...extra, ["next", next]];
    out.push({ ev: "INIT", s: snap(), at: "init", what: "Row 0 and column 0 are 0: an empty prefix has nothing in common with anything.", why: "Each other cell is built from cells above, to the left, or diagonally up-left, which are always filled first.", next: "Fill row by row.", brief: "dp[i][j] from dp[i−1][j−1], dp[i−1][j], dp[i][j−1].", inspect: insp(0, 0, "fill (1, 1)") });
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
      const match = A[i - 1] === B[j - 1];
      if (match) {
        dp[i][j] = dp[i - 1][j - 1]! + 1;
        out.push({ ev: ["COMPARE", "FOUND_RESULT", "UPDATE_DP"], s: snap({ cur: [i, j], match, deps: [[i - 1, j - 1]], arrows: [{ from: [i - 1, j - 1], to: [i, j], tone: "good" }] }), at: ["match", "diag"], eval: true, decision: { cond: "a[i−1] === b[j−1]", values: `'${A[i - 1]}' === '${B[j - 1]}'`, result: true, action: `dp = diagonal + 1 = ${dp[i][j]}` }, what: `'${A[i - 1]}' matches. dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = **${dp[i][j]}**.`, why: "A shared letter extends the best answer for both prefixes without it.", next: "Next cell.", brief: `match ⇒ ${dp[i][j]}.`, inspect: insp(i, j, "next cell", [["dp[i][j]", dp[i][j]!]]),
          quiz: { q: `'${A[i - 1]}' and '${B[j - 1]}' are equal. Where does dp[${i}][${j}] come from?`, options: [`diagonal + 1 = ${dp[i][j]}`, `max(up, left) = ${Math.max(dp[i - 1][j]!, dp[i][j - 1]!)}`], answer: 0, why: "Matching letters extend the LCS of both shorter prefixes (the diagonal cell)." } });
      } else {
        const up = dp[i - 1][j]!, left = dp[i][j - 1]!; dp[i][j] = Math.max(up, left);
        const from: [number, number] = up >= left ? [i - 1, j] : [i, j - 1];
        out.push({ ev: ["COMPARE", "UPDATE_DP"], s: snap({ cur: [i, j], match, deps: [[i - 1, j], [i, j - 1]], arrows: [{ from: [i - 1, j], to: [i, j], tone: up >= left ? "accent" : "sky" }, { from: [i, j - 1], to: [i, j], tone: left > up ? "accent" : "sky" }] }), at: ["match", "max"], eval: false, decision: { cond: "a[i−1] === b[j−1]", values: `'${A[i - 1]}' === '${B[j - 1]}'`, result: false, action: `max(up ${up}, left ${left}) = ${dp[i][j]}` }, what: `'${A[i - 1]}' ≠ '${B[j - 1]}'. dp[${i}][${j}] = max(${up}, ${left}) = **${dp[i][j]}**.`, why: `Drop the last letter of one word: keep whichever gives more (taken from ${from[0] === i - 1 ? "above" : "the left"}).`, next: "Next cell.", brief: `≠ ⇒ max(${up}, ${left}) = ${dp[i][j]}.`, inspect: insp(i, j, "next cell", [["up", up], ["left", left], ["dp[i][j]", dp[i][j]!]]),
          quiz: i + j > 3 ? { q: `'${A[i - 1]}' ≠ '${B[j - 1]}'. Up = ${up}, left = ${left}. What is dp[${i}][${j}]?`, options: [`max(up, left) = ${Math.max(up, left)}`, `diagonal + 1 = ${dp[i - 1][j - 1]! + 1}`, `up + left = ${up + left}`].filter((o, k, arr) => arr.findIndex(x => x.split(" = ")[1] === o.split(" = ")[1]) === k), answer: 0, why: "The letters differ, so neither can extend a match: take the better of the two smaller problems." } : undefined });
      }
    }
    const path = new Set<string>(); let i = m, j = n, res = "";
    const arrows: LS["arrows"] = [];
    while (i > 0 && j > 0) {
      path.add(i + "," + j);
      if (A[i - 1] === B[j - 1]) { res = A[i - 1] + res; arrows.push({ from: [i, j], to: [i - 1, j - 1], tone: "good" }); i--; j--; }
      else if (dp[i - 1][j]! >= dp[i][j - 1]!) { arrows.push({ from: [i, j], to: [i - 1, j], tone: "good" }); i--; } else { arrows.push({ from: [i, j], to: [i, j - 1], tone: "good" }); j--; }
    }
    path.add(i + "," + j);
    out.push({ ev: "DONE", s: snap({ path, arrows, lcs: res }), at: "ret", tone: "ok", what: `LCS length = **${dp[m][n]}**${res ? `: "${res}"` : ""}.`, why: "Walking back from the bottom-right corner: every diagonal step is a matched letter.", next: "Return dp[m][n].", brief: `return ${dp[m][n]}. O(m·n).`, inspect: insp(m, n, "done", [["LCS", `"${res}"`]]) });
    return out;
  },
  View: LcsView,
};

export const dpViz: PatternViz = { title: "Dynamic Programming", modes: [robber, coins, lcs] };
