/**
 * Runs Python solutions for a representative set of problems through the real Python driver
 * (the same program the judge sends to Piston) and checks them against the expected answers.
 * Usage: npx tsx scripts/verify/python-samples.ts   (needs python3 on PATH)
 */
import { spawnSync } from "node:child_process";
import { JUDGE } from "../../src/content/judge";
import { pyProgram, CASE_RESULT } from "../../src/lib/drivers/python";
import { judgeCheck } from "../../src/lib/judge-core";
import expected from "../../src/generated/expected.json";

const PY: Record<string, string> = {
  "two-sum": `class Solution:
    def twoSum(self, nums, target):
        seen = {}
        for i, x in enumerate(nums):
            if target - x in seen: return [seen[target - x], i]
            seen[x] = i`,
  "sort-colors": `class Solution:
    def sortColors(self, nums):
        nums.sort()`,
  "rotate-image": `class Solution:
    def rotate(self, matrix):
        matrix[:] = [list(r) for r in zip(*matrix[::-1])]`,
  "reverse-list": `class Solution:
    def reverseList(self, head):
        prev = None
        while head: head.next, prev, head = prev, head, head.next
        return prev`,
  "merge-k-sorted-lists": `import heapq
class Solution:
    def mergeKLists(self, lists):
        h = [(n.val, i, n) for i, n in enumerate(lists) if n]
        heapq.heapify(h)
        dummy = t = ListNode(0)
        while h:
            v, i, n = heapq.heappop(h)
            t.next = n; t = n
            if n.next: heapq.heappush(h, (n.next.val, i, n.next))
        return dummy.next`,
  "linked-list-cycle-ii": `class Solution:
    def detectCycle(self, head):
        seen = {}
        i = 0
        while head:
            if id(head) in seen: return seen[id(head)]
            seen[id(head)] = i; head = head.next; i += 1
        return -1`,
  "invert-tree": `class Solution:
    def invertTree(self, root):
        if root: root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root`,
  "sorted-array-to-bst": `class Solution:
    def sortedArrayToBST(self, nums):
        if not nums: return None
        m = len(nums) // 2
        return TreeNode(nums[m], self.sortedArrayToBST(nums[:m]), self.sortedArrayToBST(nums[m+1:]))`,
  "flatten-tree": `class Solution:
    def flatten(self, root):
        cur = root
        while cur:
            if cur.left:
                p = cur.left
                while p.right: p = p.right
                p.right = cur.right; cur.right = cur.left; cur.left = None
            cur = cur.right`,
  "lru-cache": `from collections import OrderedDict
class LRUCache:
    def __init__(self, capacity):
        self.c = capacity; self.d = OrderedDict()
    def get(self, key):
        if key not in self.d: return -1
        self.d.move_to_end(key); return self.d[key]
    def put(self, key, value):
        self.d[key] = value; self.d.move_to_end(key)
        if len(self.d) > self.c: self.d.popitem(last=False)`,
  "bst-iterator": `class BSTIterator:
    def __init__(self, root):
        self.st = []; self._left(root)
    def _left(self, n):
        while n: self.st.append(n); n = n.left
    def next(self):
        n = self.st.pop(); self._left(n.right); return n.val
    def hasNext(self):
        return len(self.st) > 0`,
  "median-two-sorted": `class Solution:
    def findMedianSortedArrays(self, nums1, nums2):
        a = sorted(nums1 + nums2); n = len(a)
        return a[n // 2] if n % 2 else (a[n // 2 - 1] + a[n // 2]) / 2`,
  "moving-average": `from collections import deque
class MovingAverage:
    def __init__(self, size):
        self.q = deque(); self.size = size; self.s = 0
    def next(self, val):
        self.q.append(val); self.s += val
        if len(self.q) > self.size: self.s -= self.q.popleft()
        return self.s / len(self.q)`,
  "combination-sum": `class Solution:
    def combinationSum(self, candidates, target):
        res = []
        def bt(start, rem, path):
            if rem == 0: res.append(path[:]); return
            for i in range(start, len(candidates)):
                if candidates[i] <= rem:
                    path.append(candidates[i]); bt(i, rem - candidates[i], path); path.pop()
        bt(0, target, [])
        return res`,
  "course-schedule-ii": `from collections import deque
class Solution:
    def findOrder(self, numCourses, prerequisites):
        adj = [[] for _ in range(numCourses)]; indeg = [0] * numCourses
        for a, b in prerequisites: adj[b].append(a); indeg[a] += 1
        q = deque(i for i in range(numCourses) if indeg[i] == 0); out = []
        while q:
            u = q.popleft(); out.append(u)
            for v in adj[u]:
                indeg[v] -= 1
                if indeg[v] == 0: q.append(v)
        return out if len(out) == numCourses else []`,
  "min-size-subarray-sum": `class Solution:
    def minSubArrayLen(self, target, nums):
        l = s = 0; best = float("inf")
        for r, x in enumerate(nums):
            s += x
            while s >= target:
                best = min(best, r - l + 1); s -= nums[l]; l += 1
        return 0 if best == float("inf") else best`,
  "number-of-islands": `class Solution:
    def numIslands(self, grid):
        R, C = len(grid), len(grid[0]); n = 0
        def sink(r, c):
            if 0 <= r < R and 0 <= c < C and grid[r][c] == "1":
                grid[r][c] = "0"; sink(r+1, c); sink(r-1, c); sink(r, c+1); sink(r, c-1)
        for r in range(R):
            for c in range(C):
                if grid[r][c] == "1": n += 1; sink(r, c)
        return n`,
  "min-stack": `class MinStack:
    def __init__(self): self.s = []
    def push(self, val): self.s.append((val, min(val, self.s[-1][1]) if self.s else val))
    def pop(self): self.s.pop()
    def top(self): return self.s[-1][0]
    def getMin(self): return self.s[-1][1]`
};

const EXP = (expected as { judge: Record<string, { cases: unknown[]; hidden: unknown[] }> }).judge;
let failures = 0;
for (const [id, code] of Object.entries(PY)) {
  const sp = JUDGE[id];
  const all = [...sp.cases, ...sp.hidden].map(c => (c as { gen?: string }).gen ? new Function("return (" + (c as { gen: string }).gen + ")")()() : c);
  const exps = [...EXP[id].cases, ...EXP[id].hidden];
  const spec = { fn: sp.fn, params: sp.params, ret: sp.ret, inplace: sp.inplace, design: sp.design, ctor: sp.ctor };
  const t0 = Date.now();
  const r = spawnSync("python3", ["-c", pyProgram(code)], { input: JSON.stringify({ spec, cases: all }), encoding: "utf8", maxBuffer: 50e6 });
  const results = r.stdout.split("\n").filter(l => l.startsWith(CASE_RESULT)).map(l => JSON.parse(l.slice(CASE_RESULT.length)));
  const bad = results.filter(x => x.error || !judgeCheck(sp.cmp, exps[x.i], x.out, sp.check, all[x.i] as unknown[]));
  const ok = results.length === all.length && !bad.length;
  if (!ok) failures++;
  console.log(`${ok ? "✓" : "✗"} ${id.padEnd(24)} ${results.length}/${all.length} cases ${Date.now() - t0}ms${ok ? "" : "  " + JSON.stringify(bad.slice(0, 2)).slice(0, 300) + (r.stderr ? " | " + r.stderr.slice(-300) : "")}`);
}
console.log(failures ? `${failures} problem(s) failed` : "All Python samples passed");
process.exit(failures ? 1 : 0);
