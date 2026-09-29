// @ts-nocheck
/* Interactive visualizers. Each takes a container element and builds its own DOM (like a D3 chart).
   Wrapped by <VisualExplanation kind="..."> in src/components/VisualExplanation.tsx. */
import { esc } from "./highlight";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function parseNums(s, fallback) {
  const a = String(s).split(/[\s,]+/).filter(Boolean).map(Number).filter(n => !isNaN(n));
  return a.length ? a.slice(0, 14) : fallback;
}
function cellsHTML(arr, cls = {}, ptr = {}, opt = {}) {
  return `<div class="cells">${arr.map((v, i) => `<div class="cellw"><div class="ptr">${esc(ptr[i] || "")}</div><div class="cell${opt.sm ? " sm" : ""} ${cls[i] || ""}">${esc(v)}</div>${opt.noIdx ? "" : `<div class="idx">${i}</div>`}</div>`).join("")}</div>`;
}
function kvHTML(title, rows, cur) {
  return `<div class="kv"><div class="kvh">${esc(title)}</div>${rows.length ? rows.map(([k, v]) => `<div class="kvr${k === cur ? " cur" : ""}"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("") : `<div class="kvr faint"><span>empty</span></div>`}</div>`;
}
// Generic step player: frames = [{html, note}]
function player(root) {
  const P = { frames: [], i: 0, t: null };
  const stage = $(".viz-stage", root), note = $(".viz-note", root);
  const show = () => {
    const f = P.frames[P.i]; if (!f) return;
    stage.innerHTML = f.html;
    note.innerHTML = `<span class="stepn">${P.frames.length > 1 ? `STEP ${P.i + 1}/${P.frames.length}` : "›"}</span><span>${f.note}</span>`;
    const bar = $(".pl-bar", root);
    if (bar) bar.hidden = P.frames.length < 2;
    const pb = $("[data-pl=play]", root); if (pb) pb.textContent = P.t ? "❚❚ Pause" : "▶ Play";
  };
  const stop = () => { clearInterval(P.t); P.t = null; };
  P.load = (frames, autoplay = true) => { stop(); P.frames = frames; P.i = 0; show(); if (autoplay && frames.length > 1) P.play(); };
  P.play = () => {
    if (P.t) { stop(); show(); return; }
    if (P.i >= P.frames.length - 1) P.i = 0;
    const speed = +($(".pl-speed", root)?.value || 900);
    P.t = setInterval(() => { if (P.i < P.frames.length - 1) { P.i++; show(); } else { stop(); show(); } }, speed);
    show();
  };
  root.addEventListener("click", e => {
    const b = e.target.closest("[data-pl]"); if (!b) return;
    const a = b.dataset.pl;
    if (a === "play") P.play();
    if (a === "prev") { stop(); P.i = Math.max(0, P.i - 1); show(); }
    if (a === "next") { stop(); P.i = Math.min(P.frames.length - 1, P.i + 1); show(); }
    if (a === "first") { stop(); P.i = 0; show(); }
  });
  return P;
}
const PL_BAR = `<div class="viz-ctrl pl-bar" style="border-top:1px solid var(--line);border-bottom:0"><button class="btn sm" data-pl="first" aria-label="First step">⏮</button><button class="btn sm" data-pl="prev">◀ Prev</button><button class="btn sm pri" data-pl="play">▶ Play</button><button class="btn sm" data-pl="next">Next ▶</button><span style="flex:1"></span><label for="spd">Speed</label><select class="pl-speed" id="spd"><option value="1400">Slow</option><option value="900" selected>Normal</option><option value="450">Fast</option></select></div>`;
const vizShell = (ctrl, title) => `<div class="viz-ctrl"><b style="font:600 12px var(--f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-right:6px">${title}</b>${ctrl}</div><div class="viz-stage"></div><div class="viz-note"></div>${PL_BAR}`;

export const VIZ: Record<string, (root: HTMLElement) => void> = {};

VIZ.array = root => {
  let arr = [10, 20, 30, 40, 50];
  root.innerHTML = vizShell(`<label for="va-i">i</label><input id="va-i" type="number" value="2"><label for="va-v">value</label><input id="va-v" type="number" value="35">
    <button class="btn sm" data-op="access">Access</button><button class="btn sm" data-op="search">Search</button><button class="btn sm" data-op="insert">Insert</button><button class="btn sm" data-op="delete">Delete</button><button class="btn sm" data-op="update">Update</button><button class="btn sm ghost" data-op="reset">Reset</button>`, "Array");
  const P = player(root);
  const F = (a, cls, ptr, note) => ({ html: cellsHTML(a, cls, ptr), note });
  P.load([F(arr, {}, {}, "An array stores values side by side. Each has an index starting at 0. Pick an operation above.")], false);
  root.addEventListener("click", e => {
    const op = e.target.closest("[data-op]")?.dataset.op; if (!op) return;
    const i = Math.trunc(+$("#va-i", root).value), v = +$("#va-v", root).value;
    const fr = [];
    if (op === "reset") { arr = [10, 20, 30, 40, 50]; P.load([F(arr, {}, {}, "Reset to [10, 20, 30, 40, 50].")], false); return; }
    if (op === "access" || op === "update") {
      if (i < 0 || i >= arr.length) { P.load([F(arr, {}, {}, `Index ${i} is out of bounds. Valid indexes: 0 to ${arr.length - 1}. In JS, arr[${i}] returns undefined.`)], false); return; }
      fr.push(F(arr, { [i]: "cur" }, { [i]: "i=" + i }, `Address = start + ${i} × size. The computer jumps straight to index ${i}. No loop needed.`));
      if (op === "access") fr.push(F(arr, { [i]: "ok" }, { [i]: "arr[" + i + "]" }, `arr[${i}] = ${arr[i]}. One step regardless of array size → <b>O(1)</b>.`));
      else { const old = arr[i]; arr = arr.slice(); arr[i] = v; fr.push(F(arr, { [i]: "ok new" }, { [i]: "updated" }, `arr[${i}] changed from ${old} to ${v}. Jump + overwrite → <b>O(1)</b>.`)); }
    }
    if (op === "search") {
      let found = -1;
      for (let k = 0; k < arr.length; k++) {
        const cls = {}; for (let j = 0; j < k; j++) cls[j] = "no"; cls[k] = "cur";
        fr.push(F(arr, cls, { [k]: "check" }, `Is arr[${k}] (${arr[k]}) equal to ${v}? ${arr[k] === v ? "Yes!" : "No, move on."}`));
        if (arr[k] === v) { found = k; break; }
      }
      fr.push(found >= 0 ? F(arr, { [found]: "ok" }, { [found]: "found" }, `Found ${v} at index ${found} after ${found + 1} checks. Worst case checks all n → <b>O(n)</b>.`)
        : F(arr, Object.fromEntries(arr.map((_, k) => [k, "no"])), {}, `${v} is not in the array. We checked all ${arr.length} elements → <b>O(n)</b>.`));
    }
    if (op === "insert") {
      if (i < 0 || i > arr.length || arr.length >= 12) { P.load([F(arr, {}, {}, arr.length >= 12 ? "Array is full for this demo. Delete something first." : `Insert index must be between 0 and ${arr.length}.`)], false); return; }
      let a = arr.concat(["·"]);
      fr.push(F(a, { [a.length - 1]: "ghost" }, { [a.length - 1]: "new slot" }, `To insert ${v} at index ${i}, first make room at the end.`));
      for (let k = a.length - 1; k > i; k--) {
        a = a.slice(); a[k] = a[k - 1]; a[k - 1] = "·";
        fr.push(F(a, { [k]: "cur", [k - 1]: "ghost" }, { [k]: "shift →" }, `Shift ${a[k]} one step right (index ${k - 1} → ${k}).`));
      }
      a = a.slice(); a[i] = v; arr = a;
      fr.push(F(a, { [i]: "ok new" }, { [i]: "inserted" }, `Placed ${v} at index ${i}. It took ${a.length - 1 - i} shifts. Worst case (index 0) shifts all n → <b>O(n)</b>. At the end (push) → O(1).`));
    }
    if (op === "delete") {
      if (i < 0 || i >= arr.length) { P.load([F(arr, {}, {}, `Index ${i} does not exist.`)], false); return; }
      let a = arr.slice();
      fr.push(F(a, { [i]: "bad" }, { [i]: "delete" }, `Remove ${a[i]} at index ${i}. This leaves a gap.`));
      a[i] = "·";
      for (let k = i; k < a.length - 1; k++) {
        a = a.slice(); a[k] = a[k + 1]; a[k + 1] = "·";
        fr.push(F(a, { [k]: "cur", [k + 1]: "ghost" }, { [k]: "← shift" }, `Shift ${a[k]} one step left to close the gap.`));
      }
      a = a.slice(0, -1); arr = a;
      fr.push(F(a, {}, {}, `Done. ${arr.length - i} elements moved. Worst case (index 0) → <b>O(n)</b>. pop() at the end → O(1).`));
    }
    P.load(fr);
  });
};

VIZ.string = root => {
  root.innerHTML = vizShell(`<label for="vs-w">word</label><input id="vs-w" class="w" type="text" value="racecar"><button class="btn sm" data-op="pal">Palindrome check</button><button class="btn sm" data-op="rev">Reverse (two pointers)</button>`, "String");
  const P = player(root);
  const go = op => {
    const w = [...($("#vs-w", root).value || "level").slice(0, 14)];
    const fr = [];
    let l = 0, r = w.length - 1, a = w.slice();
    if (op === "pal") {
      while (l < r) {
        const same = a[l] === a[r];
        fr.push({ html: cellsHTML(a, { [l]: same ? "ok" : "bad", [r]: same ? "ok" : "bad" }, { [l]: "L", [r]: "R" }), note: `Compare '${a[l]}' and '${a[r]}': ${same ? "match, move both inward." : "mismatch → not a palindrome."}` });
        if (!same) break; l++; r--;
      }
      if (l >= r) fr.push({ html: cellsHTML(a, Object.fromEntries(a.map((_, i) => [i, "ok"]))), note: `Pointers met. Every pair matched → "${w.join("")}" is a palindrome. O(n) time, O(1) space.` });
    } else {
      while (l < r) {
        fr.push({ html: cellsHTML(a, { [l]: "cur", [r]: "cur" }, { [l]: "L", [r]: "R" }), note: `Swap '${a[l]}' and '${a[r]}'.` });
        a = a.slice(); [a[l], a[r]] = [a[r], a[l]];
        fr.push({ html: cellsHTML(a, { [l]: "ok", [r]: "ok" }, { [l]: "L", [r]: "R" }), note: `Swapped. Move L right and R left.` });
        l++; r--;
      }
      fr.push({ html: cellsHTML(a, {}), note: `Reversed: "${a.join("")}". JS strings are immutable, so real code does [...s] → swap → join("").` });
    }
    P.load(fr);
  };
  root.addEventListener("click", e => { const op = e.target.closest("[data-op]")?.dataset.op; if (op) go(op); });
  go("pal");
};

VIZ.hash = root => {
  root.innerHTML = vizShell(`<label for="vh-w">text</label><input id="vh-w" class="w" type="text" value="banana"><button class="btn sm" data-op="count">Count frequencies</button><button class="btn sm" data-op="dup">First repeated char</button>`, "Hash Map");
  const P = player(root);
  const go = op => {
    const w = [...($("#vh-w", root).value || "banana").slice(0, 14)];
    const m = new Map(), fr = [];
    for (let i = 0; i < w.length; i++) {
      const ch = w[i];
      if (op === "dup" && m.has(ch)) {
        fr.push({ html: `<div class="side-panel">${cellsHTML(w, { [i]: "ok" }, { [i]: "i" })}${kvHTML("Set (seen)", [...m.keys()].map(k => [k, "✓"]), ch)}</div>`, note: `'${ch}' is already in the set → first repeated character. Found with O(1) lookups instead of comparing every pair.` });
        return P.load(fr);
      }
      const before = m.get(ch) || 0; m.set(ch, before + 1);
      fr.push({ html: `<div class="side-panel">${cellsHTML(w, { [i]: "cur" }, { [i]: "i" })}${kvHTML(op === "dup" ? "Set (seen)" : "Map char → count", [...m].map(([k, v]) => [k, op === "dup" ? "✓" : v]), ch)}</div>`,
        note: op === "dup" ? `'${ch}' not seen before → add to the set.` : `map.set('${ch}', ${before} + 1). Hash '${ch}' → bucket → update in <b>O(1)</b>.` });
    }
    fr.push({ html: `<div class="side-panel">${cellsHTML(w, {})}${kvHTML(op === "dup" ? "Set (seen)" : "Final counts", [...m].map(([k, v]) => [k, op === "dup" ? "✓" : v]))}</div>`, note: op === "dup" ? "No character repeats." : `One pass, O(1) per update → <b>O(n)</b> total.` });
    P.load(fr);
  };
  root.addEventListener("click", e => { const op = e.target.closest("[data-op]")?.dataset.op; if (op) go(op); });
  go("count");
};

VIZ.twoptr = root => {
  root.innerHTML = vizShell(`<label for="vt-a">sorted</label><input id="vt-a" class="w" type="text" value="1, 3, 4, 6, 8, 11"><label for="vt-t">target</label><input id="vt-t" type="number" value="10"><button class="btn sm" data-op="go">Run</button>`, "Two Pointers");
  const P = player(root);
  const go = () => {
    const a = parseNums($("#vt-a", root).value, [1, 3, 4, 6, 8, 11]).sort((x, y) => x - y), t = +$("#vt-t", root).value;
    let l = 0, r = a.length - 1; const fr = [], gone = {};
    while (l < r) {
      const s = a[l] + a[r];
      const cls = { ...gone, [l]: s === t ? "ok" : "cur", [r]: s === t ? "ok" : "cur" };
      if (s === t) { fr.push({ html: cellsHTML(a, cls, { [l]: "L", [r]: "R" }), note: `${a[l]} + ${a[r]} = ${t}. Found the pair at indexes [${l}, ${r}]!` }); return P.load(fr); }
      fr.push({ html: cellsHTML(a, cls, { [l]: "L", [r]: "R" }), note: s < t ? `${a[l]} + ${a[r]} = ${s} < ${t}. Too small, and ${a[l]} can't work with anything smaller than ${a[r]} either → move L right.` : `${a[l]} + ${a[r]} = ${s} > ${t}. Too big, and ${a[r]} is too big even with the smallest left → move R left.` });
      if (s < t) gone[l++] = "no"; else gone[r--] = "no";
    }
    fr.push({ html: cellsHTML(a, gone), note: `Pointers met. No pair sums to ${t}. At most n steps → O(n).` });
    P.load(fr);
  };
  root.addEventListener("click", e => { if (e.target.closest("[data-op]")) go(); });
  go();
};

VIZ.window = root => {
  root.innerHTML = vizShell(`<label for="vw-a">array</label><input id="vw-a" class="w" type="text" value="2, 1, 5, 1, 3, 2, 7, 1"><label for="vw-k">k</label><input id="vw-k" type="number" value="3"><button class="btn sm" data-op="fixed">Max sum of k</button><button class="btn sm" data-op="var">Longest unique substring</button>`, "Sliding Window");
  const P = player(root);
  const go = op => {
    const fr = [];
    if (op === "fixed") {
      const a = parseNums($("#vw-a", root).value, [2, 1, 5, 1, 3, 2]);
      const k = Math.max(1, Math.min(a.length, Math.trunc(+$("#vw-k", root).value || 3)));
      let sum = 0, best = -Infinity, bestL = 0;
      for (let r = 0; r < a.length; r++) {
        sum += a[r];
        const l = r - k + 1;
        if (r >= k) sum -= a[r - k];
        const cls = {}; for (let j = Math.max(0, l); j <= r; j++) cls[j] = "win"; cls[r] = "cur";
        if (r >= k) cls[r - k] = "no";
        let note = r < k - 1 ? `Building the first window: add ${a[r]}. sum = ${sum}.` : (r === k - 1 ? `First window complete: sum = ${sum}.` : `Slide: +${a[r]} (entering), −${a[r - k]} (leaving). sum = ${sum}. Only 2 operations, not ${k}.`);
        if (l >= 0 && sum > best) { best = sum; bestL = l; note += ` New best = ${best}.`; }
        fr.push({ html: cellsHTML(a, cls, { ...(l >= 0 ? { [l]: "L" } : {}), [r]: "R" }) + `<div class="mono muted">window sum = <b style="color:var(--ink)">${sum}</b> · best = <b style="color:var(--accent)">${best === -Infinity ? "–" : best}</b></div>`, note });
      }
      const cls = {}; for (let j = bestL; j < bestL + k; j++) cls[j] = "ok";
      fr.push({ html: cellsHTML(a, cls) + `<div class="mono muted">best = <b style="color:var(--accent)">${best}</b></div>`, note: `Max sum of ${k} consecutive = ${best}. Each element added once and removed once → O(n).` });
    } else {
      const s = [...(($("#vw-a", root).value.match(/[a-z]/gi) || []).join("") || "abcabcbb").slice(0, 14)];
      const w = s.length >= 3 ? s : [..."abcabcbb"];
      const last = new Map(); let l = 0, best = 0;
      for (let r = 0; r < w.length; r++) {
        let note = `Add '${w[r]}'.`;
        if (last.has(w[r]) && last.get(w[r]) >= l) { note = `'${w[r]}' is already in the window (index ${last.get(w[r])}). Move L to ${last.get(w[r]) + 1}.`; l = last.get(w[r]) + 1; }
        last.set(w[r], r);
        if (r - l + 1 > best) { best = r - l + 1; note += ` New best length = ${best}.`; }
        const cls = {}; for (let j = 0; j < l; j++) cls[j] = "no"; for (let j = l; j <= r; j++) cls[j] = "win"; cls[r] = "cur";
        fr.push({ html: cellsHTML(w, cls, l === r ? { [l]: "L R" } : { [l]: "L", [r]: "R" }) + `<div class="mono muted">window "${w.slice(l, r + 1).join("")}" · best = <b style="color:var(--accent)">${best}</b></div>`, note });
      }
      fr.push({ html: cellsHTML(w, {}) + `<div class="mono muted">answer = <b style="color:var(--accent)">${best}</b></div>`, note: `Longest substring without repeats has length ${best}. (Tip: type letters in the box, e.g. "pwwkew", then run this.)` });
    }
    P.load(fr);
  };
  root.addEventListener("click", e => { const op = e.target.closest("[data-op]")?.dataset.op; if (op) go(op); });
  go("fixed");
};

VIZ.bsearch = root => {
  root.innerHTML = vizShell(`<label for="vb-a">sorted</label><input id="vb-a" class="w" type="text" value="10, 20, 30, 40, 50, 60, 70, 80"><label for="vb-t">target</label><input id="vb-t" type="number" value="70"><button class="btn sm" data-op="go">Search</button>`, "Binary Search");
  const P = player(root);
  const go = () => {
    const a = parseNums($("#vb-a", root).value, [10, 20, 30, 40, 50, 60, 70, 80]).sort((x, y) => x - y), t = +$("#vb-t", root).value;
    let l = 0, r = a.length - 1, step = 0; const fr = [];
    const dim = (l, r) => Object.fromEntries(a.map((_, i) => [i, i < l || i > r ? "no" : ""]));
    while (l <= r) {
      step++;
      const m = Math.floor((l + r) / 2);
      const ptr = {}; ptr[l] = "L"; ptr[r] = (ptr[r] ? ptr[r] + " " : "") + "R"; ptr[m] = (ptr[m] ? ptr[m] + " " : "") + "M";
      fr.push({ html: cellsHTML(a, { ...dim(l, r), [m]: "cur" }, ptr), note: `Step ${step}: range [${l}..${r}], mid = floor((${l} + ${r}) / 2) = ${m}. Compare arr[${m}] = ${a[m]} with ${t}.` });
      if (a[m] === t) { fr.push({ html: cellsHTML(a, { ...dim(l, r), [m]: "ok" }, { [m]: "found" }), note: `Found ${t} at index ${m} in ${step} step${step > 1 ? "s" : ""}. Linear search would need ${m + 1}.` }); return P.load(fr); }
      if (a[m] < t) { fr.push({ html: cellsHTML(a, dim(m + 1, r), { [m + 1]: "L" }), note: `${a[m]} < ${t} → target must be on the right. Eliminate indexes ${l}..${m}. L = ${m + 1}.` }); l = m + 1; }
      else { fr.push({ html: cellsHTML(a, dim(l, m - 1), { [Math.max(0, m - 1)]: "R" }), note: `${a[m]} > ${t} → target must be on the left. Eliminate indexes ${m}..${r}. R = ${m - 1}.` }); r = m - 1; }
    }
    fr.push({ html: cellsHTML(a, dim(1, 0)), note: `L > R: the range is empty. ${t} is not in the array (checked in ${step} steps, about log₂(${a.length}) ≈ ${Math.ceil(Math.log2(a.length + 1))}).` });
    P.load(fr);
  };
  root.addEventListener("click", e => { if (e.target.closest("[data-op]")) go(); });
  go();
};

VIZ.linked = root => {
  let vals = [3, 7, 1, 9];
  root.innerHTML = vizShell(`<label for="vl-v">value</label><input id="vl-v" type="number" value="5"><button class="btn sm" data-op="head">Insert head</button><button class="btn sm" data-op="tail">Append</button><button class="btn sm" data-op="find">Search</button><button class="btn sm" data-op="del">Delete</button><button class="btn sm" data-op="rev">Reverse</button>`, "Linked List");
  const P = player(root);
  const draw = (v, cls = {}, lbl = {}, dirs = null, headIdx = 0) => {
    let h = `<div class="ll"><span class="nullbox" style="border-style:solid;color:var(--accent)">head→${v.length ? "" : " null"}</span><span class="link-arrow"></span>`;
    v.forEach((x, i) => {
      h += `<div style="display:flex;flex-direction:column;align-items:center;gap:3px"><div class="ptr" style="font:700 11px var(--f-mono);color:var(--accent);min-height:15px">${esc(lbl[i] || (i === headIdx && dirs ? "" : ""))}</div><div class="node ${cls[i] || ""}"><span class="v">${esc(x)}</span><span class="nx">next</span></div></div>`;
      if (i < v.length - 1) h += `<span class="link-arrow">${dirs ? (dirs[i] === "l" ? "←" : dirs[i] === "x" ? " " : "→") : "→"}</span>`;
    });
    h += v.length ? `<span class="link-arrow">${dirs && dirs[v.length - 1] === "l" ? "" : "→"}</span><span class="nullbox">null</span>` : "";
    return h + "</div>";
  };
  P.load([{ html: draw(vals), note: "Each node holds a value and a pointer to the next node. The last node points to null." }], false);
  root.addEventListener("click", e => {
    const op = e.target.closest("[data-op]")?.dataset.op; if (!op) return;
    const v = +$("#vl-v", root).value; const fr = [];
    if (op === "head") {
      if (vals.length >= 9) return P.load([{ html: draw(vals), note: "List is long enough for this demo; delete something first." }], false);
      vals = [v, ...vals];
      fr.push({ html: draw(vals, { 0: "ok" }, { 0: "new" }), note: `new node(${v}).next = old head; head = new node. Two pointer changes, nothing shifts → <b>O(1)</b>.` });
    }
    if (op === "tail") {
      if (vals.length >= 9) return P.load([{ html: draw(vals), note: "List is long enough for this demo; delete something first." }], false);
      for (let i = 0; i < vals.length; i++) fr.push({ html: draw(vals, { [i]: "cur" }, { [i]: "cur" }), note: `Walk to the end: at ${vals[i]}${i === vals.length - 1 ? ", its next is null → this is the tail." : "."}` });
      vals = [...vals, v];
      fr.push({ html: draw(vals, { [vals.length - 1]: "ok" }, { [vals.length - 1]: "new" }), note: `tail.next = new node(${v}). Walking took O(n); keeping a tail pointer would make append O(1).` });
    }
    if (op === "find" || op === "del") {
      let k = -1;
      for (let i = 0; i < vals.length; i++) {
        fr.push({ html: draw(vals, { [i]: "cur" }, { [i]: "cur" }), note: `cur.val = ${vals[i]}${vals[i] === v ? ` = ${v}. Found!` : ` ≠ ${v}. cur = cur.next.`}` });
        if (vals[i] === v) { k = i; break; }
      }
      if (k < 0) fr.push({ html: draw(vals), note: `Reached null. ${v} is not in the list. Search is O(n): no index jumping.` });
      else if (op === "del") {
        fr.push({ html: draw(vals, { [k]: "bad", ...(k > 0 ? { [k - 1]: "cur" } : {}) }, k > 0 ? { [k - 1]: "prev", [k]: "delete" } : { [k]: "head" }), note: k > 0 ? `prev.next = cur.next: skip over ${v}. Just one pointer change → O(1) once found.` : `Deleting the head: head = head.next.` });
        vals = vals.filter((_, i) => i !== k);
        fr.push({ html: draw(vals), note: `${v} removed. No other node moved in memory.` });
      }
    }
    if (op === "rev") {
      const n = vals.length, dirs = Array(n).fill("r");
      fr.push({ html: draw(vals, { 0: "cur" }, { 0: "cur" }, dirs), note: "prev = null, cur = head. We'll flip each arrow one at a time." });
      for (let i = 0; i < n; i++) {
        if (i > 0) dirs[i - 1] = "l";
        const lbl = { [i]: "cur" }; if (i > 0) lbl[i - 1] = "prev";
        fr.push({ html: draw(vals, { [i]: "cur", ...(i > 0 ? { [i - 1]: "ok" } : {}) }, lbl, dirs.slice()), note: i === 0 ? `Save next (${vals[1] ?? "null"}), then point ${vals[0]}.next to prev (null).` : `Save next, point ${vals[i]}.next back to ${vals[i - 1]}. Move prev and cur forward.` });
      }
      vals = vals.slice().reverse();
      fr.push({ html: draw(vals, Object.fromEntries(vals.map((_, i) => [i, "ok"]))), note: "cur is null → prev is the new head. Reversed in O(n) time, O(1) space." });
    }
    P.load(fr);
  });
};

VIZ.stack = root => {
  let st = [4, 9];
  root.innerHTML = vizShell(`<label for="vk-v">value</label><input id="vk-v" type="number" value="7"><button class="btn sm" data-op="push">Push</button><button class="btn sm" data-op="pop">Pop</button><button class="btn sm" data-op="peek">Peek</button><span style="width:10px"></span><label for="vk-b">brackets</label><input id="vk-b" class="w" type="text" value="{[()]}"><button class="btn sm" data-op="br">Check</button>`, "Stack");
  const P = player(root);
  const draw = (s, cur = -1, extra = "") => `<div class="side-panel" style="align-items:flex-end">${extra}<div style="display:flex;flex-direction:column;align-items:center;gap:6px"><div class="ptr" style="font:700 11px var(--f-mono);color:var(--accent)">${s.length ? "top ↓" : ""}</div><div class="stackbox">${s.map((x, i) => `<div class="sitem${i === cur ? " cur" : ""}">${esc(x)}</div>`).join("")}</div><div class="faint mono" style="font-size:11px">stack (${s.length})</div></div></div>`;
  P.load([{ html: draw(st, st.length - 1), note: "Last In, First Out. You can only touch the top." }], false);
  root.addEventListener("click", e => {
    const op = e.target.closest("[data-op]")?.dataset.op; if (!op) return;
    const v = +$("#vk-v", root).value;
    if (op === "push") { if (st.length >= 8) return P.load([{ html: draw(st), note: "Stack full for this demo. Pop something." }], false); st = [...st, v]; P.load([{ html: draw(st, st.length - 1), note: `push(${v}) → placed on top. O(1).` }], false); }
    if (op === "pop") { if (!st.length) return P.load([{ html: draw(st), note: "Stack is empty. pop() would return undefined in JS: always check length first." }], false); const x = st[st.length - 1]; st = st.slice(0, -1); P.load([{ html: draw(st, st.length - 1), note: `pop() → returned ${x}, the most recently pushed value. O(1).` }], false); }
    if (op === "peek") P.load([{ html: draw(st, st.length - 1), note: st.length ? `peek() → ${st[st.length - 1]} (not removed). O(1).` : "Empty stack: nothing to peek." }], false);
    if (op === "br") {
      const s = [...($("#vk-b", root).value || "{[()]}").slice(0, 14)], pair = { ")": "(", "]": "[", "}": "{" }; let k = []; const fr = [];
      for (let i = 0; i < s.length; i++) {
        const c = s[i], line = cellsHTML(s, { [i]: "cur" }, { [i]: "i" }, { sm: true });
        if ("([{".includes(c)) { k = [...k, c]; fr.push({ html: draw(k, k.length - 1, line), note: `'${c}' is an opener → push.` }); }
        else if (pair[c]) {
          const top = k[k.length - 1];
          if (top !== pair[c]) { fr.push({ html: draw(k, k.length - 1, cellsHTML(s, { [i]: "bad" }, { [i]: "i" }, { sm: true })), note: `'${c}' needs '${pair[c]}' on top but found ${top ? "'" + top + "'" : "an empty stack"} → invalid.` }); return P.load(fr); }
          k = k.slice(0, -1); fr.push({ html: draw(k, k.length - 1, cellsHTML(s, { [i]: "ok" }, { [i]: "i" }, { sm: true })), note: `'${c}' matches top '${top}' → pop.` });
        }
      }
      fr.push({ html: draw(k, -1, cellsHTML(s, {}, {}, { sm: true })), note: k.length ? `End of string but ${k.length} opener(s) never closed → invalid.` : "End of string and the stack is empty → valid!" });
      P.load(fr);
    }
  });
};

VIZ.queue = root => {
  let q = ["A", "B", "C"], next = 68;
  root.innerHTML = vizShell(`<button class="btn sm" data-op="enq">Enqueue</button><button class="btn sm" data-op="deq">Dequeue</button><button class="btn sm" data-op="peek">Peek</button>`, "Queue");
  const P = player(root);
  const draw = (arr, hi = -1) => `<div style="display:flex;align-items:center;gap:10px"><span class="mono faint" style="font-size:12px">front ←</span><div class="queuebox">${arr.map((x, i) => `<div class="sitem${i === hi ? " cur" : ""}" style="min-width:40px">${x}</div>`).join("") || `<span class="faint mono" style="font-size:12px">empty</span>`}</div><span class="mono faint" style="font-size:12px">← back</span></div>`;
  P.load([{ html: draw(q, 0), note: "First In, First Out. Join at the back, leave from the front." }], false);
  root.addEventListener("click", e => {
    const op = e.target.closest("[data-op]")?.dataset.op; if (!op) return;
    if (op === "enq") { if (q.length >= 8) return P.load([{ html: draw(q), note: "Queue full for this demo." }], false); const x = String.fromCharCode(next++ > 90 ? (next = 66, 65) : next - 1); q = [...q, x]; P.load([{ html: draw(q, q.length - 1), note: `enqueue('${x}') → joins at the back. O(1).` }], false); }
    if (op === "deq") { if (!q.length) return P.load([{ html: draw(q), note: "Empty queue." }], false); const x = q[0]; q = q.slice(1); P.load([{ html: draw(q, 0), note: `dequeue() → '${x}' leaves from the front. With a head index this is O(1); arr.shift() would be O(n).` }], false); }
    if (op === "peek") P.load([{ html: draw(q, 0), note: q.length ? `peek() → '${q[0]}' is next to be served.` : "Empty." }], false);
  });
};

VIZ.recursion = root => {
  root.innerHTML = vizShell(`<label for="vr-n">n</label><input id="vr-n" type="number" value="4" min="1" max="7"><button class="btn sm" data-op="fact">factorial(n)</button><button class="btn sm" data-op="sum">sum(1..n)</button>`, "Call Stack");
  const P = player(root);
  const go = op => {
    const n = Math.max(1, Math.min(7, Math.trunc(+$("#vr-n", root).value || 4)));
    const name = op === "fact" ? "factorial" : "sum", sym = op === "fact" ? "×" : "+";
    const stack = [], fr = [];
    const draw = (retIdx = -1) => `<div class="frames">${stack.map((f, i) => `<div class="frame${i === stack.length - 1 && retIdx < 0 ? " top" : ""}${i === retIdx ? " ret" : ""}">${esc(f)}</div>`).join("")}</div><div class="faint mono" style="font-size:11px">call stack (top = currently running)</div>`;
    for (let k = n; k >= 1; k--) {
      stack.push(`${name}(${k})${k === 1 ? "  → base case" : `  waits for ${name}(${k - 1})`}`);
      fr.push({ html: draw(), note: k === 1 ? `${name}(1) hits the base case and returns 1 directly. No more calls.` : `${name}(${k}) needs ${name}(${k - 1}) first, so a new frame is pushed.` });
    }
    let val = 1;
    for (let k = 1; k <= n; k++) {
      const prev = val; if (k > 1) val = op === "fact" ? k * prev : k + prev;
      stack[stack.length - 1] = k === 1 ? `${name}(1) = 1` : `${name}(${k}) = ${k} ${sym} ${prev} = ${val}`;
      fr.push({ html: draw(stack.length - 1), note: k === 1 ? "Now the stack unwinds: each frame gets its answer and returns it to the caller below." : `${name}(${k}) receives ${prev}, computes ${k} ${sym} ${prev} = ${val}, and returns.` });
      stack.pop();
    }
    fr.push({ html: draw() + `<div class="mono" style="font-size:15px">result = <b style="color:var(--accent)">${val}</b></div>`, note: `Done: ${name}(${n}) = ${val}. There were ${n} frames on the stack at the deepest point → O(n) space.` });
    P.load(fr);
  };
  root.addEventListener("click", e => { const op = e.target.closest("[data-op]")?.dataset.op; if (op) go(op); });
  go("fact");
};

VIZ.tree = root => {
  let vals = [50, 30, 70, 20, 40, 60, 80];
  root.innerHTML = vizShell(`<label for="vtr-v">value</label><input id="vtr-v" type="number" value="65"><button class="btn sm" data-op="ins">BST insert</button><button class="btn sm" data-op="find">BST search</button><span style="width:8px"></span><button class="btn sm" data-op="pre">Preorder</button><button class="btn sm" data-op="in">Inorder</button><button class="btn sm" data-op="post">Postorder</button><button class="btn sm" data-op="level">Level order</button><button class="btn sm ghost" data-op="reset">Reset</button>`, "Tree");
  const P = player(root);
  const build = () => { let r = null; const ins = v => { const n = { v, l: null, r: null }; if (!r) return (r = n); let c = r; while (true) { if (v < c.v) { if (!c.l) return (c.l = n); c = c.l; } else { if (!c.r) return (c.r = n); c = c.r; } } }; vals.forEach(ins); return r; };
  const svg = (rt, cls = {}, out = []) => {
    const pos = new Map(); let x = 0, maxD = 0;
    (function lay(n, d) { if (!n) return; lay(n.l, d + 1); pos.set(n, [x++, d]); maxD = Math.max(maxD, d); lay(n.r, d + 1); })(rt, 0);
    const W = Math.max(1, x) * 52 + 20, H = (maxD + 1) * 62 + 16, P2 = n => { const [a, d] = pos.get(n); return [a * 52 + 36, d * 62 + 28]; };
    let lines = "", nodes = "";
    pos.forEach((_, n) => {
      const [x1, y1] = P2(n);
      [n.l, n.r].forEach(c => { if (c) { const [x2, y2] = P2(c); lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--line2)" stroke-width="1.5"/>`; } });
      const c = cls[n.v];
      const fill = c === "cur" ? "var(--accent)" : c === "ok" ? "var(--good)" : c === "vis" ? "var(--sky)" : c === "no" ? "var(--panel2)" : "var(--panel2)";
      const tc = c === "cur" || c === "ok" || c === "vis" ? "var(--bg)" : "var(--ink)";
      nodes += `<g opacity="${c === "no" ? .35 : 1}"><circle cx="${x1}" cy="${y1}" r="19" fill="${fill}" stroke="${c ? fill : "var(--line2)"}" stroke-width="1.5"/><text x="${x1}" y="${y1 + 4.5}" text-anchor="middle" font-size="13" font-weight="600" fill="${tc}">${n.v}</text></g>`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="max-width:none">${lines}${nodes}</svg>` + (out ? `<div class="mono muted" style="font-size:13px">output: [<b style="color:var(--ink)">${out.join(", ")}</b>]</div>` : "");
  };
  P.load([{ html: svg(build(), {}, null), note: "A Binary Search Tree: everything left of a node is smaller, everything right is bigger." }], false);
  root.addEventListener("click", e => {
    const op = e.target.closest("[data-op]")?.dataset.op; if (!op) return;
    const v = Math.trunc(+$("#vtr-v", root).value); let rt = build(); const fr = [];
    if (op === "reset") { vals = [50, 30, 70, 20, 40, 60, 80]; return P.load([{ html: svg(build(), {}, null), note: "Reset." }], false); }
    if (op === "ins" || op === "find") {
      let c = rt, depth = 0; const seen = {};
      while (c) {
        seen[c.v] = "vis";
        if (c.v === v) { fr.push({ html: svg(rt, { ...seen, [c.v]: "ok" }, null), note: op === "find" ? `Found ${v} after ${depth + 1} comparisons. BST search is O(h).` : `${v} already exists. (This BST ignores duplicates.)` }); return P.load(fr); }
        fr.push({ html: svg(rt, { ...seen, [c.v]: "cur" }, null), note: `${v} ${v < c.v ? "<" : ">"} ${c.v} → go ${v < c.v ? "left" : "right"}.` });
        c = v < c.v ? c.l : c.r; depth++;
      }
      if (op === "find") fr.push({ html: svg(rt, seen, null), note: `Reached an empty spot: ${v} is not in the tree.` });
      else if (vals.length >= 15) fr.push({ html: svg(rt, seen, null), note: "Tree is full for this demo. Press Reset." });
      else { vals = [...vals, v]; rt = build(); fr.push({ html: svg(rt, { ...seen, [v]: "ok" }, null), note: `Empty spot found: insert ${v} here. Took ${depth} steps = height of the path → O(h).` }); }
      return P.load(fr);
    }
    const order = [];
    if (op === "level") { const q = [rt]; for (let h = 0; h < q.length; h++) { if (!q[h]) continue; order.push(q[h].v); q.push(q[h].l, q[h].r); } }
    else (function t(n) { if (!n) return; if (op === "pre") order.push(n.v); t(n.l); if (op === "in") order.push(n.v); t(n.r); if (op === "post") order.push(n.v); })(rt);
    const desc = { pre: "Preorder: Node → Left → Right", in: "Inorder: Left → Node → Right (sorted for a BST!)", post: "Postorder: Left → Right → Node", level: "Level order: row by row using a queue (BFS)" }[op];
    const done = {};
    order.forEach((x, i) => {
      done[x] = "vis";
      fr.push({ html: svg(rt, { ...done, [x]: "cur" }, order.slice(0, i + 1)), note: `${desc}. Visit ${x}.` });
    });
    fr.push({ html: svg(rt, Object.fromEntries(order.map(x => [x, "ok"])), order), note: `${desc}. Every node visited once → O(n).` });
    P.load(fr);
  });
};

VIZ.bigo = root => {
  const CURVES = [
    ["O(1)", n => 1, "#4fd1a0"], ["O(log n)", n => Math.log2(Math.max(n, 1)), "#79b8ff"], ["O(n)", n => n, "#c3a6ff"],
    ["O(n log n)", n => n * Math.log2(Math.max(n, 1)), "#f0b44c"], ["O(n²)", n => n * n, "#ff9e64"], ["O(2ⁿ)", n => Math.pow(2, n), "#ff7a85"], ["O(n!)", n => n < 2 ? 1 : Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n), "#ff4f9a"]
  ];
  const EX = { "O(1)": "Taking the first element of an array", "O(log n)": "Binary search in a sorted list", "O(n)": "Checking every element once", "O(n log n)": "Sorting with merge sort / Array.sort", "O(n²)": "Comparing every element with every other", "O(2ⁿ)": "Trying every subset", "O(n!)": "Trying every ordering (permutation)" };
  const on = new Set(CURVES.map(c => c[0]));
  let N = 20, bigN = 1e5;
  root.innerHTML = `<div class="viz-ctrl"><b style="font:600 12px var(--f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-right:6px">Growth</b><label for="bo-n">chart n = <span id="bo-nv">20</span></label><input id="bo-n" type="range" min="4" max="40" value="20" style="width:160px;padding:0"><div class="bigo-legend" id="bo-leg"></div></div><div class="viz-stage" id="bo-stage" style="align-items:stretch"></div>
  <div style="padding:14px 16px;border-top:1px solid var(--line)"><div class="row" style="margin-bottom:10px"><b style="font-family:var(--f-display)">How long at real sizes?</b><span class="faint" style="font-size:13px">assuming ~10⁸ simple operations per second</span><span style="flex:1"></span><label for="bo-big" class="mono faint" style="font-size:12px">n =</label><select id="bo-big"><option value="10">10</option><option value="100">100</option><option value="1000">1,000</option><option value="100000" selected>100,000</option><option value="1000000">1,000,000</option></select></div><div class="tw" id="bo-table"></div></div>`;
  const fmtOps = x => !isFinite(x) || x > 1e300 ? "∞" : x >= 1e15 ? x.toExponential(1).replace("e+", "×10^") : Math.round(x).toLocaleString();
  const fmtT = ops => { const s = ops / 1e8; if (!isFinite(s) || s > 3.15e7 * 1e6) return ["longer than the universe", "bad"]; if (s < 1e-3) return ["instant", "good"]; if (s < 1) return [(s * 1000).toFixed(s < .01 ? 2 : 0) + " ms", "good"]; if (s < 60) return [s.toFixed(1) + " s", "warn"]; if (s < 3600) return [(s / 60).toFixed(0) + " min", "bad"]; if (s < 86400 * 365) return [(s / 3600).toFixed(0) + " hours", "bad"]; return [(s / 3.15e7).toExponential(1) + " years", "bad"]; };
  const draw = () => {
    $("#bo-nv", root).textContent = N;
    $("#bo-leg", root).innerHTML = CURVES.map(([k, , c]) => `<button class="${on.has(k) ? "" : "off"}" data-k="${k}"><i style="background:${c}"></i>${k}</button>`).join("");
    const W = 640, H = 300, L = 48, B = 34, T = 12, R = 16, yMax = N * N * 1.05;
    const X = n => L + (n - 1) / (N - 1) * (W - L - R), Y = y => H - B - Math.min(y, yMax * 1.5) / yMax * (H - B - T);
    let g = "";
    for (let i = 0; i <= 4; i++) { const yv = yMax * i / 4, y = Y(yv); g += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-dasharray="${i ? "3 4" : ""}"/><text x="${L - 8}" y="${y + 4}" text-anchor="end" font-size="10.5" fill="var(--faint)">${Math.round(yv)}</text>`; }
    [1, Math.round(N / 4), Math.round(N / 2), Math.round(3 * N / 4), N].forEach(n => { g += `<text x="${X(n)}" y="${H - B + 18}" text-anchor="middle" font-size="10.5" fill="var(--faint)">${n}</text>`; });
    g += `<text x="${(W + L) / 2}" y="${H - 3}" text-anchor="middle" font-size="11" fill="var(--muted)">input size n</text><text x="12" y="${(H - B) / 2}" text-anchor="middle" font-size="11" fill="var(--muted)" transform="rotate(-90 12 ${(H - B) / 2})">operations</text>`;
    let paths = ""; const labels = [];
    CURVES.forEach(([k, f, c]) => {
      if (!on.has(k)) return;
      let d = "", lastPt = null;
      for (let s = 0; s <= 120; s++) { const n = 1 + (N - 1) * s / 120, y = f(n); const py = Y(y); d += (s ? "L" : "M") + X(n).toFixed(1) + " " + py.toFixed(1); lastPt = [X(n), py]; if (y > yMax * 1.5) break; }
      paths += `<path d="${d}" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" pathLength="1" class="bo-line"/>`;
      if (lastPt && lastPt[1] > T) labels.push([Math.min(lastPt[0] - 4, W - R - 2), Math.max(lastPt[1] - 6, T + 8), c, k]);
      else if (lastPt) labels.push([lastPt[0] + 4, T + 10, c, k, "start"]);
    });
    labels.sort((a, b) => b[1] - a[1]);
    for (let i = 1; i < labels.length; i++) if (labels[i][4] !== "start" && labels[i - 1][1] - labels[i][1] < 13) labels[i][1] = labels[i - 1][1] - 13;
    labels.forEach(([x, y, c, k, anchor]) => { y = Math.max(y, T + 10); paths += `<text x="${x}" y="${y}" font-size="10.5" fill="${c}" text-anchor="${anchor || "end"}">${k}</text>`; });
    $("#bo-stage", root).innerHTML = `<div class="tw" style="width:100%"><svg viewBox="0 0 ${W} ${H}" style="width:100%;min-width:480px;height:auto" role="img" aria-label="Growth curves"><defs><clipPath id="boclip"><rect x="${L}" y="${T - 4}" width="${W - L - R}" height="${H - B - T + 4}"/></clipPath></defs>${g}<g clip-path="url(#boclip)">${paths}</g></svg></div>`;
    $("#bo-table", root).innerHTML = `<table class="t"><thead><tr><th>Complexity</th><th>Real-world example</th><th style="text-align:right">Operations</th><th>Time</th></tr></thead><tbody>${CURVES.map(([k, f]) => { const ops = f(bigN); const [t, cl] = fmtT(ops); return `<tr><td class="cx">${k}</td><td>${EX[k]}</td><td class="mono" style="text-align:right;font-variant-numeric:tabular-nums">${fmtOps(ops)}</td><td><span class="pill ${cl === "good" ? "E" : cl === "warn" ? "M" : "H"}">${t}</span></td></tr>`; }).join("")}</tbody></table>`;
  };
  root.addEventListener("input", e => { if (e.target.id === "bo-n") { N = +e.target.value; draw(); } });
  root.addEventListener("change", e => { if (e.target.id === "bo-big") { bigN = +e.target.value; draw(); } });
  root.addEventListener("click", e => { const b = e.target.closest("[data-k]"); if (!b) return; const k = b.dataset.k; on.has(k) ? on.delete(k) : on.add(k); draw(); });
  draw();
};
