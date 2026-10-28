import type { ReactNode } from "react";
import type { Mode, PatternViz, Step } from "../types";
import { nums, int } from "../types";
import { Row, Stat, Line, type Arc } from "../prims";

const M = 7;
const hashOf = (k: number | string) => typeof k === "number" ? ((k % M) + M) % M : [...k].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % M, 0);
const hashText = (k: number | string) => typeof k === "number" ? `${k} mod ${M} = ${hashOf(k)}` : `hash('${k}') mod ${M} = ${hashOf(k)}`;

interface Entry { k: number | string; v?: ReactNode }
interface HS {
  arr: (number | string)[]; at: number; st?: Record<number, string>; arcs?: Arc[];
  entries: Entry[]; probe?: { key: number | string; hit: boolean | null }; wrote?: number | string;
  stats: [string, ReactNode, ("good" | "bad" | "sky" | "accent" | "vio")?][]; kind: "map" | "set"; line?: ReactNode;
}

function Buckets({ s }: { s: HS }) {
  const b = s.probe ? hashOf(s.probe.key) : s.wrote !== undefined ? hashOf(s.wrote) : -1;
  return (
    <div className="pv-buckets" aria-label={s.kind === "map" ? "hash map buckets" : "hash set buckets"}>
      <div className="pv-cap">{s.kind === "map" ? "hash map" : "hash set"} · {M} buckets</div>
      {Array.from({ length: M }, (_, i) => {
        const items = s.entries.filter(e => hashOf(e.k) === i);
        const hot = i === b, miss = hot && s.probe?.hit === false;
        return (
          <div key={i} className={"pv-bucket" + (hot ? (miss ? " miss" : s.probe?.hit ? " hit" : " hot") : "")}>
            <span className="pv-bi">{i}</span>
            <div className="pv-bchain">
              {items.map(e => {
                const isHit = hot && s.probe?.hit && e.k === s.probe.key, isNew = s.wrote !== undefined && e.k === s.wrote;
                return <span key={String(e.k)} className={"pv-entry" + (isHit ? " hit" : isNew ? " new" : "")}><b>{typeof e.k === "string" ? `'${e.k}'` : e.k}</b>{e.v !== undefined && <><i>→</i>{e.v}</>}</span>;
              })}
              {hot && s.probe && s.probe.hit === false && <span className="pv-entry ghost">{typeof s.probe.key === "string" ? `'${s.probe.key}'` : s.probe.key}? not here</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HashView({ s }: { s: HS }) {
  return (
    <div className="pv-scene">
      <div className="pv-stats">{s.stats.map(([l, v, t]) => <Stat key={l} label={l} value={v} tone={t} />)}</div>
      <div className="pv-side-by-side">
        <div className="pv-scene">
          <Row cells={s.arr.map((x, i) => ({ v: typeof x === "string" ? `'${x}'` : x, st: s.st?.[i] ?? (i === s.at ? "cur" : i < s.at ? "mem" : undefined) }))} ptrs={s.at >= 0 && s.at < s.arr.length ? [{ name: "i", at: s.at, tone: "sky" }] : []} arcs={s.arcs} />
          {(s.probe || s.wrote !== undefined) && <Line>{s.probe ? <>lookup {typeof s.probe.key === "string" ? `'${s.probe.key}'` : s.probe.key}: {hashText(s.probe.key)} → bucket {hashOf(s.probe.key)} → <b className={s.probe.hit ? "pv-hit" : s.probe.hit === false ? "pv-miss" : ""}>{s.probe.hit === null ? "…" : s.probe.hit ? "hit" : "miss"}</b></> : <>insert {typeof s.wrote === "string" ? `'${s.wrote}'` : s.wrote}: {hashText(s.wrote!)} → bucket {hashOf(s.wrote!)}</>}</Line>}
          {s.line && <Line>{s.line}</Line>}
        </div>
        <Buckets s={s} />
      </div>
    </div>
  );
}

const twoSum: Mode<HS> = {
  id: "twosum", label: "Two Sum (map)", task: "For each number, ask the map: have I already seen the partner that completes the target?",
  fields: [{ key: "a", label: "nums", wide: true }, { key: "t", label: "target" }],
  presets: [{ label: "Classic", values: { a: "2, 7, 11, 15", t: "9" } }, { label: "Later pair", values: { a: "3, 9, 4, 12, 8, 5", t: "13" } }, { label: "Duplicates", values: { a: "3, 5, 3, 1", t: "6" } }, { label: "No pair", values: { a: "1, 2, 4, 8", t: "7" } }],
  code: `function twoSum(nums, target) {
  const seen = new Map(); // value → index          //#init
  for (let i = 0; i < nums.length; i++) {           //#loop
    const need = target - nums[i];                  //#need
    if (seen.has(need)) return [seen.get(need), i]; //#look
    seen.set(nums[i], i);                           //#set
  }
  return [];                                        //#none
}`,
  legend: [["sky", "current number"], ["vio", "already stored"], ["good", "hit / the pair"], ["bad", "miss"]],
  counters: [["iterations", ["ITER"]], ["lookups", ["HASH_LOOKUP"]], ["inserts", ["HASH_INSERT"]]],
  complexity: { time: "O(n)", space: "O(n)", why: "One pass. Each lookup and insert is O(1) on average because the hash sends you straight to one bucket instead of scanning everything. The map can hold up to n entries." },
  run(v) {
    const a = nums(v.a, "nums", 10), t = int(v.t, "target"), out: Step<HS>[] = [], seen = new Map<number, number>();
    const entries = (): Entry[] => [...seen.entries()].map(([k, i]) => ({ k, v: i }));
    const base = (i: number, o: Partial<HS> = {}): HS => ({ arr: a, at: i, entries: entries(), kind: "map", stats: [["target", t], ["entries", seen.size, "vio"]], ...o });
    const insp = (i: number, next: string, extra: [string, string | number][] = []): [string, string | number][] => [["i", i < 0 ? "–" : i], ["nums[i]", i >= 0 && i < a.length ? a[i] : "–"], ...extra, ["stored entries", seen.size ? [...seen.entries()].map(([k, x]) => `${k}→${x}`).join(", ") : "none"], ["next", next]];
    out.push({ ev: "INIT", s: base(-1), at: "init", what: "Start with an empty map from **value → index**.", why: "Checking every pair is O(n²). If we remember what we've seen, each number only needs one question: is my partner already here?", next: "Visit nums[0].", brief: "seen = new Map().", inspect: insp(-1, "visit nums[0]") });
    for (let i = 0; i < a.length; i++) {
      const need = t - a[i];
      out.push({ ev: "ITER", s: base(i, { line: <>need = {t} − {a[i]} = <b>{need}</b></> }), at: "need", what: `nums[${i}] = **${a[i]}**. Its partner must be ${t} − ${a[i]} = **${need}**.`, why: "If `need` appeared earlier, the pair is (need, nums[i]).", next: `Look up ${need} in the map.`, brief: `need = ${need}.`, inspect: insp(i, `lookup ${need}`, [["current key", need]]) });
      const hit = seen.has(need);
      out.push({ ev: "HASH_LOOKUP", s: base(i, { probe: { key: need, hit }, st: hit ? { [seen.get(need)!]: "ok", [i]: "ok" } : undefined, arcs: hit ? [{ from: seen.get(need)!, to: i, tone: "good", label: `${need} + ${a[i]} = ${t}` }] : undefined }), at: "look", eval: hit, tone: hit ? "ok" : undefined,
        decision: { cond: "seen.has(need)", values: `seen.has(${need})`, result: hit, action: hit ? `return [${seen.get(need)}, ${i}]` : `store ${a[i]} → ${i}` },
        what: `Look up ${need}: ${hashText(need)}, so check bucket ${hashOf(need)}. ${hit ? `**Hit**: ${need} is at index ${seen.get(need)}.` : "**Miss**: not there."}`,
        why: hit ? `${need} + ${a[i]} = ${t}.` : `No earlier number pairs with ${a[i]}. The hash sent us to one bucket, so we didn't scan all ${seen.size} entries.`,
        next: hit ? `Return **[${seen.get(need)}, ${i}]**.` : `Store ${a[i]} → ${i}, so a later number can find it.`,
        brief: hit ? `hit: return [${seen.get(need)}, ${i}].` : `miss on ${need}.`, inspect: insp(i, hit ? "return" : `insert ${a[i]} → ${i}`, [["current key", need], ["lookup result", hit ? `hit (index ${seen.get(need)})` : "miss"]]),
        quiz: { q: `need = ${need}. The map holds: ${seen.size ? [...seen.keys()].join(", ") : "nothing yet"}. What happens?`, options: [`Hit: return the pair`, `Miss: store ${a[i]} → ${i} and continue`], answer: hit ? 0 : 1, why: hit ? `${need} is in the map (index ${seen.get(need)}), so we found the pair.` : `${need} isn't stored yet, so ${a[i]} has no partner so far. Remember it and move on.` } });
      if (hit) { out.push({ ev: "FOUND_RESULT", s: base(a.length, { st: Object.fromEntries(a.map((_, k) => [k, k === seen.get(need) || k === i ? "ok" : "dim"])), arcs: [{ from: seen.get(need)!, to: i, tone: "good", label: `${need} + ${a[i]} = ${t}` }] }), at: "look", tone: "ok", what: `Pair found: indexes **[${seen.get(need)}, ${i}]** (${need} + ${a[i]} = ${t}).`, why: `Only ${i + 1} lookup${i ? "s" : ""}, no nested loop.`, next: "Done.", brief: `return [${seen.get(need)}, ${i}]. O(n) time, O(n) space.`, inspect: insp(i, "done") }); return out; }
      const dup = seen.has(a[i]);
      seen.set(a[i], i);
      out.push({ ev: "HASH_INSERT", s: base(i, { wrote: a[i] }), at: "set", what: `${dup ? "Update" : "Insert"} **${a[i]} → ${i}** into bucket ${hashOf(a[i])}.`, why: dup ? `${a[i]} was already stored; keeping the latest index is fine.` : "Now any later number that needs it can find it in O(1).", next: i < a.length - 1 ? "Visit the next number." : "That was the last number.", brief: `seen.set(${a[i]}, ${i}).`, inspect: insp(i, i < a.length - 1 ? "next number" : "return []", [["operation", dup ? "update" : "insert"]]) });
    }
    out.push({ ev: "NOT_FOUND", s: base(a.length), at: "none", tone: "bad", what: `No two numbers add up to ${t}.`, why: "Every number asked for its partner, and none was there.", next: "Return []", brief: "return []. O(n) time, O(n) space.", inspect: insp(a.length, "done") });
    return out;
  },
  View: HashView,
};

const dupes: Mode<HS> = {
  id: "dup", label: "Contains duplicate (set)", task: "A set answers 'have I seen this before?' in O(1).",
  fields: [{ key: "a", label: "nums", wide: true }],
  presets: [{ label: "Has duplicate", values: { a: "4, 11, 7, 18, 2, 7, 9" } }, { label: "All unique", values: { a: "5, 1, 9, 3, 8, 12" } }, { label: "Collisions", values: { a: "3, 10, 17, 24, 10" } }],
  code: `function containsDuplicate(nums) {
  const seen = new Set();                 //#init
  for (const x of nums) {                 //#loop
    if (seen.has(x)) return true;         //#look
    seen.add(x);                          //#add
  }
  return false;                           //#none
}`,
  legend: [["sky", "current number"], ["vio", "in the set"], ["good", "hit"], ["bad", "miss / duplicate pair"]],
  counters: [["iterations", ["ITER"]], ["lookups", ["HASH_LOOKUP"]], ["inserts", ["HASH_INSERT"]]],
  complexity: { time: "O(n)", space: "O(n)", why: "One pass with O(1) average set operations. Sorting first would be O(n log n); comparing all pairs would be O(n²)." },
  run(v) {
    const a = nums(v.a, "nums", 10), out: Step<HS>[] = [], set = new Set<number>(), first = new Map<number, number>();
    const base = (i: number, o: Partial<HS> = {}): HS => ({ arr: a, at: i, entries: [...set].map(k => ({ k })), kind: "set", stats: [["set size", set.size, "vio"]], ...o });
    const insp = (i: number, next: string, extra: [string, string | number][] = []): [string, string | number][] => [["x", i >= 0 && i < a.length ? a[i] : "–"], ...extra, ["set", set.size ? "{" + [...set].join(", ") + "}" : "{}"], ["next", next]];
    out.push({ ev: "INIT", s: base(-1), at: "init", what: "Start with an empty set.", why: "A set stores each value once and can tell you instantly whether it holds a value.", next: "Look at the first number.", brief: "seen = new Set().", inspect: insp(-1, "visit nums[0]") });
    for (let i = 0; i < a.length; i++) {
      const x = a[i], hit = set.has(x);
      out.push({ ev: ["ITER", "HASH_LOOKUP"], s: base(i, { probe: { key: x, hit }, st: hit ? { [first.get(x)!]: "bad", [i]: "bad" } : undefined, arcs: hit ? [{ from: first.get(x)!, to: i, tone: "bad", label: "same value" }] : undefined }), at: "look", eval: hit, tone: hit ? "ok" : undefined,
        decision: { cond: "seen.has(x)", values: `seen.has(${x})`, result: hit, action: hit ? "return true" : `seen.add(${x})` },
        what: `x = **${x}**: ${hashText(x)}, check bucket ${hashOf(x)}. ${hit ? "**Hit**." : "**Miss**."}`,
        why: hit ? `${x} was already added at index ${first.get(x)}: it's a duplicate.` : `${set.size && [...set].some(k => hashOf(k) === hashOf(x)) ? "That bucket has other values (a collision), but not " + x + "." : "That bucket doesn't hold " + x + "."}`,
        next: hit ? "Return **true**." : `Add ${x} to the set.`, brief: hit ? `${x} ∈ set ⇒ return true.` : `${x} ∉ set ⇒ add.`, inspect: insp(i, hit ? "return true" : `add ${x}`, [["lookup result", hit ? "hit" : "miss"]]),
        quiz: { q: `The set holds {${[...set].join(", ")}}. Is **${x}** a duplicate?`, options: ["Yes: return true", `No: add ${x} and continue`], answer: hit ? 0 : 1, why: hit ? `${x} is already in the set.` : `${x} isn't in the set yet.` } });
      if (hit) { out.push({ ev: "FOUND_RESULT", s: base(a.length, { st: Object.fromEntries(a.map((_, k) => [k, k === first.get(x) || k === i ? "bad" : "dim"])), arcs: [{ from: first.get(x)!, to: i, tone: "bad", label: `${x} twice` }] }), at: "look", tone: "ok", what: `Duplicate found: **${x}** at indexes ${first.get(x)} and ${i}.`, why: `Stopped after ${i + 1} of ${a.length} numbers.`, next: "Return true.", brief: "return true. O(n) time, O(n) space.", inspect: insp(i, "done") }); return out; }
      set.add(x); first.set(x, i);
      out.push({ ev: "HASH_INSERT", s: base(i, { wrote: x }), at: "add", what: `Add **${x}** to bucket ${hashOf(x)}.`, why: "Now any later copy of it will be a hit.", next: i < a.length - 1 ? "Next number." : "That was the last number.", brief: `seen.add(${x}).`, inspect: insp(i, i < a.length - 1 ? "next number" : "return false", [["operation", "insert"]]) });
    }
    out.push({ ev: "NOT_FOUND", s: base(a.length), at: "none", tone: "ok", what: "All values are different.", why: "No lookup ever hit.", next: "Return **false**.", brief: "return false. O(n) time, O(n) space.", inspect: insp(a.length, "done") });
    return out;
  },
  View: HashView,
};

const freq: Mode<HS> = {
  id: "freq", label: "Frequency count", task: "Count how often each character appears, then find the first one that appears once.",
  fields: [{ key: "s", label: "string", wide: true }],
  presets: [{ label: "leetcode", values: { s: "leetcode" } }, { label: "loveleet", values: { s: "loveleet" } }, { label: "aabb", values: { s: "aabb" } }],
  code: `function firstUniqChar(s) {
  const count = new Map();                       //#init
  for (const c of s)                             //#loop
    count.set(c, (count.get(c) || 0) + 1);       //#count
  for (let i = 0; i < s.length; i++)             //#scan
    if (count.get(s[i]) === 1) return i;         //#check
  return -1;                                     //#none
}`,
  legend: [["sky", "current character"], ["vio", "counted"], ["good", "answer"], ["bad", "repeats"]],
  counters: [["passes", ["ITER"]], ["lookups", ["HASH_LOOKUP"]], ["writes", ["HASH_INSERT"]]],
  complexity: { time: "O(n)", space: "O(k)", why: "Two passes over the string with O(1) map operations. The map holds one entry per distinct character (k ≤ alphabet size)." },
  run(v) {
    const s = [...String(v.s ?? "").trim()];
    if (!s.length) throw new Error("Type a string."); if (s.length > 12) throw new Error("Use at most 12 characters.");
    const out: Step<HS>[] = [], count = new Map<string, number>();
    const base = (i: number, o: Partial<HS> = {}): HS => ({ arr: s, at: i, entries: [...count.entries()].map(([k, c]) => ({ k, v: <b className="pv-cnt">×{c}</b> })), kind: "map", stats: [["distinct", count.size, "vio"]], ...o });
    const insp = (i: number, next: string, extra: [string, string | number][] = []): [string, string | number][] => [["i", i < 0 || i >= s.length ? "–" : i], ["c", i >= 0 && i < s.length ? `'${s[i]}'` : "–"], ...extra, ["counts", count.size ? [...count.entries()].map(([k, c]) => `${k}:${c}`).join(" ") : "none"], ["next", next]];
    out.push({ ev: "INIT", s: base(-1), at: "init", what: "Pass 1 counts every character in a map.", why: "Then pass 2 can ask \"how many times does this appear?\" in O(1) instead of rescanning the string.", next: "Count s[0].", brief: "count = new Map().", inspect: insp(-1, "count s[0]") });
    s.forEach((c, i) => {
      const before = count.get(c) || 0;
      count.set(c, before + 1);
      out.push({ ev: ["ITER", "HASH_LOOKUP", "HASH_INSERT"], s: base(i, { wrote: c }), at: "count", what: `'${c}': ${before ? `already counted ${before}×` : "first time"} → **${before + 1}**.`, why: `${hashText(c)}, so it lives in bucket ${hashOf(c)}.`, next: i < s.length - 1 ? "Next character." : "Counting is done; start pass 2.", brief: `count['${c}'] = ${before + 1}.`, inspect: insp(i, i < s.length - 1 ? "count next" : "start pass 2", [["operation", before ? "update" : "insert"]]) });
    });
    for (let i = 0; i < s.length; i++) {
      const c = s[i], n = count.get(c)!;
      const st: Record<number, string> = {}; for (let k = 0; k < i; k++) st[k] = "bad";
      out.push({ ev: ["ITER", "HASH_LOOKUP"], s: base(i, { probe: { key: c, hit: true }, st: { ...st, [i]: n === 1 ? "ok" : "cmp" } }), at: "check", eval: n === 1, tone: n === 1 ? "ok" : undefined, decision: { cond: "count.get(s[i]) === 1", values: `count('${c}') = ${n}`, result: n === 1, action: n === 1 ? `return ${i}` : "keep scanning" },
        what: `Pass 2, index ${i}: '${c}' appears **${n}×**.`, why: n === 1 ? "It's the first character that appears exactly once." : "It repeats, so it can't be the answer.", next: n === 1 ? `Return **${i}**.` : "Check the next character.", brief: n === 1 ? `return ${i}.` : `'${c}' ×${n}.`, inspect: insp(i, n === 1 ? `return ${i}` : "next", [["count", n]]),
        quiz: { q: `count('${c}') = ${n}. What now?`, options: [`Return ${i}`, "Keep scanning"], answer: n === 1 ? 0 : 1, why: n === 1 ? "It appears exactly once and nothing before it did." : "It appears more than once." } });
      if (n === 1) return out;
    }
    out.push({ ev: "NOT_FOUND", s: base(s.length, { st: Object.fromEntries(s.map((_, k) => [k, "bad"])) }), at: "none", tone: "bad", what: "Every character repeats.", why: "No count was 1.", next: "Return **-1**.", brief: "return -1.", inspect: insp(s.length, "done") });
    return out;
  },
  View: HashView,
};

export const hashingViz: PatternViz = { title: "HashMap / HashSet", modes: [twoSum, dupes, freq] };
