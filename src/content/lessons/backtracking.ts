import type { Lesson } from "@/lib/types";

const backtracking: Lesson = {
  what: "Backtracking builds a solution one choice at a time. After each choice it explores further, and when it reaches a dead end (or a finished solution) it undoes the last choice and tries the next option. It systematically explores every possibility, skipping branches that can't work.",
  analogy: { short: "Trying combinations on a lock with notes", text: "You try a first digit, then a second, and so on. When you realise a path can't work, you go back one digit and try the next value, instead of starting over. Each step back is the 'backtrack'." },
  eli5: "Walking through a maze, at every fork you pick a path. If you hit a wall, you walk back to the last fork and pick a different path.",
  tech: "The template is choose → explore → un-choose, inside a recursive function. The state (the current path, used flags, counts) is shared and changed in place, then restored after the recursive call. Record a copy of the path when it is complete. Pruning skips branches that can't lead to a valid answer (sum already too big, queen under attack), which is what keeps backtracking practical. Running time is usually exponential (2ⁿ subsets, n! permutations), but it is the right tool when you must list or count every valid configuration.",
  why: "'Generate all…', 'find every…' and constraint puzzles (N-Queens, Sudoku, word search) have no shortcut: you must explore the choices. Backtracking does it with little memory and lets you cut away impossible branches early.",
  how: ["Define what a partial solution is (a path) and when it is complete.", "In the recursive function: if complete, record a copy and return.", "Loop over the possible next choices.", "Skip choices that break the rules (pruning).", "Choose (add to the path, mark used), recurse, then un-choose (remove, unmark)."],
  props: ["Depth-first exploration of a decision tree", "Shared state, modified and restored", "Pruning cuts dead branches early", "Usually exponential time, O(depth) extra space"],
  use: ["Subsets, combinations, permutations", "Constraint puzzles: N-Queens, Sudoku", "Word search on a grid", "Partitioning strings or arrays", "Generating valid expressions (parentheses)"],
  avoid: ["You only need a count or an optimum and subproblems repeat (use DP)", "A greedy choice is provably optimal"],
  viz: "recursion",
  cx: [["Subsets of n items", "O(2ⁿ · n)", "2ⁿ subsets, each copied."], ["Permutations of n items", "O(n! · n)", "n! orders, each copied."], ["N-Queens", "O(n!)", "Each row has fewer options than the last; pruning cuts most of them."], ["Space", "O(n)", "The recursion depth and the current path."]],
  space: "O(n) for the path and the recursion (plus the output).",
  code: {
    c: `function permutations(nums) {
  const out = [], path = [], used = new Array(nums.length).fill(false);
  function backtrack() {
    if (path.length === nums.length) { out.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      backtrack();
      path.pop();
      used[i] = false;
    }
  }
  backtrack();
  return out;
}
console.log(permutations([1, 2, 3]));`,
    hl: [7, 10],
    ex: { 4: "A complete choice: save a copy, because path keeps changing.", 6: "Each number can be used once per permutation.", 7: "Choose…", 9: "…explore with that choice…", 10: "…un-choose, so the next option starts from a clean state." }
  },
  examples: [
    { lvl: "Easy", title: "All subsets", prob: "Return every subset of an array of distinct numbers.", idea: "Every node of the decision tree is a valid subset. Only pick numbers after the current position so each subset appears once.", c: `function subsets(nums) {
  const out = [], path = [];
  function backtrack(start) {
    out.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }
  backtrack(0);
  return out;
}
console.log(subsets([1, 2, 3]));`, time: "O(2ⁿ · n)", space: "O(n)", ex: { 4: "Every partial path is itself a subset.", 7: "i + 1: later numbers only, so [2, 1] never repeats [1, 2]." } },
    { lvl: "Practical", title: "Combination sum (with pruning)", prob: "All combinations of candidates (reusable) that sum to target.", idea: "Sort the candidates so that once one is too big, all later ones are too: break out of the loop. Passing i (not i + 1) allows reusing the same number.", c: `function combinationSum(candidates, target) {
  const out = [], path = [];
  candidates = [...candidates].sort((a, b) => a - b);
  function backtrack(start, remaining) {
    if (remaining === 0) { out.push([...path]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break;
      path.push(candidates[i]);
      backtrack(i, remaining - candidates[i]);
      path.pop();
    }
  }
  backtrack(0, target);
  return out;
}
console.log(combinationSum([2, 3, 6, 7], 7));`, time: "Exponential, heavily pruned", space: "O(target)", ex: { 7: "Pruning: sorted input means every later candidate is too big as well.", 9: "Pass i, not i + 1: the same number may be used again." } },
    { lvl: "Interview", title: "N-Queens (count the solutions)", prob: "How many ways can n queens be placed so none attack each other?", idea: "Place one queen per row. Sets of used columns and diagonals (r − c and r + c) make the safety check O(1).", c: `function totalNQueens(n) {
  const cols = new Set(), d1 = new Set(), d2 = new Set();
  let count = 0;
  function place(r) {
    if (r === n) { count++; return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
      cols.add(c); d1.add(r - c); d2.add(r + c);
      place(r + 1);
      cols.delete(c); d1.delete(r - c); d2.delete(r + c);
    }
  }
  place(0);
  return count;
}
console.log(totalNQueens(4), totalNQueens(6), totalNQueens(8));`, time: "O(n!)", space: "O(n)", ex: { 7: "Same column, or the same diagonal (r − c) or anti-diagonal (r + c): skip.", 10: "Undo the placement before trying the next column." } }
  ],
  signals: [["\"all\", \"every\", \"generate\", \"list\" combinations/permutations", "Backtracking"], ["puzzle with rules (queens, sudoku)", "Backtracking with pruning"], ["word on a grid, each cell used once", "DFS + backtracking (mark/unmark cells)"], ["\"partition into …\" with all ways", "Backtracking over cut positions"], ["only the count or best value, repeated states", "DP instead"]],
  mistakes: [["Pushing path itself into the result", "path keeps changing. Push a copy: [...path]."], ["Forgetting to undo the choice", "Every push needs a pop, and every mark an unmark."], ["Generating duplicates when the input has duplicates", "Sort, and skip a value equal to the previous one at the same level."], ["No pruning", "Cut branches as early as possible (sum too big, invalid prefix)."]],
  js: ["Closures over out and path keep the recursive helper short.", "Sets give O(1) checks for used columns, diagonals and cells."],
  iq: { Beginner: ["Print all subsets of [1, 2, 3]"], Easy: ["binary-tree-paths"], Medium: ["subsets", "permutations", "combination-sum", "combination-sum-ii", "generate-parentheses", "word-search", "palindrome-partitioning", "subsets-ii"], Hard: ["n-queens", "sudoku-solver", "word-search-ii"] },
  rev: { s30: "Build solutions choice by choice: choose, explore, un-choose. Record copies of complete paths and prune impossible branches. Exponential, but the right tool for 'generate all'.", m2: ["Template: choose → recurse → undo", "Push [...path], not path", "start index avoids duplicate combinations", "Sort + skip equal siblings for duplicate inputs", "Prune early"] },
  cheat: `BACKTRACKING CHEAT SHEET

function bt(state):
  if complete: out.push(copy); return
  for choice of options:
    if invalid: continue          // prune
    make(choice)
    bt(next state)
    undo(choice)

Subsets: record every node; loop from start
Combos:  loop from start (i to reuse, i+1 not)
Perms:   used[] array
Dupes:   sort + skip a[i] == a[i-1] at same level`
};

export default backtracking;
