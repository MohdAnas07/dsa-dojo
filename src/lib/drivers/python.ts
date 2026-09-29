import type { JudgeSpec } from "@/lib/types";

/**
 * Python judge driver.
 * The generated program = helpers + the user's code + a runner that reads
 * {"spec": ..., "cases": [...]} from stdin, runs every case, and prints one
 * JSON result line per case between markers so user prints can be separated.
 */
export const CASE_START = "@@DOJO_CASE@@";
export const CASE_RESULT = "@@DOJO_RESULT@@";

const PY_TYPES: Record<string, string> = {
  number: "int", "number[]": "List[int]", "number[][]": "List[List[int]]", string: "str", "string[]": "List[str]",
  "string[][]": "List[List[str]]", "character[][]": "List[List[str]]", boolean: "bool", ListNode: "Optional[ListNode]",
  TreeNode: "Optional[TreeNode]", cycle: "Optional[ListNode]", void: "None", "any[]": "List"
};

export function pyStarter(sp: JudgeSpec): string {
  if (sp.design) {
    return `class ${sp.fn}:\n\n    def __init__(self):\n        pass\n\n    def push(self, val: int) -> None:\n        pass\n\n    def pop(self) -> None:\n        pass\n\n    def top(self) -> int:\n        pass\n\n    def getMin(self) -> int:\n        pass\n`;
  }
  const list = sp.params.some(p => p[1] === "ListNode" || p[1] === "cycle") || sp.ret === "ListNode";
  const tree = sp.params.some(p => p[1] === "TreeNode") || sp.ret === "TreeNode";
  const helper = list
    ? "# Provided (don't redeclare):\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\n\n"
    : tree ? "# Provided (don't redeclare):\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\n\n" : "";
  const params = sp.params.map(([n, t]) => `${n}: ${PY_TYPES[t] || "object"}`).join(", ");
  const note = sp.inplace !== undefined ? `        # modify ${sp.params[sp.inplace][0]} in place, don't return anything\n` : "";
  return `${helper}class Solution:\n    def ${sp.fn}(self, ${params}) -> ${PY_TYPES[sp.ret] || "object"}:\n${note}        pass\n`;
}

const PY_HARNESS = `import sys, json, time
from typing import *
from collections import *
import heapq, math, bisect, itertools, functools
sys.setrecursionlimit(20000)

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def __dojo_to_list(a):
    head = None
    for v in reversed(a):
        head = ListNode(v, head)
    return head

def __dojo_from_list(h):
    out, n = [], 0
    while h is not None and n < 100000:
        out.append(h.val); h = h.next; n += 1
    if h is not None:
        raise ValueError("Returned list has a cycle or is too long")
    return out

def __dojo_to_tree(a):
    if not a or a[0] is None:
        return None
    root = TreeNode(a[0]); q = [root]; i = 1; h = 0
    while i < len(a) and h < len(q):
        n = q[h]; h += 1
        if i < len(a) and a[i] is not None:
            n.left = TreeNode(a[i]); q.append(n.left)
        i += 1
        if i < len(a) and a[i] is not None:
            n.right = TreeNode(a[i]); q.append(n.right)
        i += 1
    return root

def __dojo_from_tree(r):
    out, q, h = [], [r], 0
    while h < len(q):
        n = q[h]; h += 1
        if n is not None:
            out.append(n.val); q.append(n.left); q.append(n.right)
        else:
            out.append(None)
    while out and out[-1] is None:
        out.pop()
    return out

def __dojo_cycle(arg):
    vals, pos = arg
    h = __dojo_to_list(vals)
    if h is not None and pos >= 0:
        t, p, i = h, None, 0
        while True:
            if i == pos: p = t
            if t.next is None: break
            t = t.next; i += 1
        t.next = p
    return h

def __dojo_in(t, v):
    if t == "ListNode": return __dojo_to_list(v)
    if t == "TreeNode": return __dojo_to_tree(v)
    if t == "cycle": return __dojo_cycle(v)
    return json.loads(json.dumps(v))

def __dojo_out(t, v):
    if t == "ListNode": return __dojo_from_list(v)
    if t == "TreeNode": return __dojo_from_tree(v)
    return v

def __dojo_default(o):
    if isinstance(o, (set, frozenset, tuple)): return list(o)
    if isinstance(o, (deque,)): return list(o)
    return str(o)
`;

const PY_RUNNER = `

def __dojo_run(spec, args):
    g = globals()
    if spec.get("design"):
        cls = g.get(spec["fn"])
        if cls is None: raise NameError("Class " + spec["fn"] + " was not found")
        ops, vals = args
        obj, out = None, []
        for i, op in enumerate(ops):
            if i == 0:
                obj = cls(*vals[0]); out.append(None); continue
            r = getattr(obj, op)(*vals[i])
            out.append(r)
        return out
    fn = None
    if "Solution" in g and hasattr(g["Solution"], spec["fn"]):
        fn = getattr(g["Solution"](), spec["fn"])
    elif spec["fn"] in g:
        fn = g[spec["fn"]]
    if fn is None: raise NameError("Method " + spec["fn"] + " was not found. Keep the name from the starter code.")
    a = [__dojo_in(p[1], args[i]) for i, p in enumerate(spec["params"])]
    r = fn(*a)
    if spec.get("inplace") is not None:
        return a[spec["inplace"]]
    return __dojo_out(spec["ret"], r)

def __dojo_main():
    data = json.loads(sys.stdin.read())
    spec = data["spec"]
    for i, args in enumerate(data["cases"]):
        print("${CASE_START}" + str(i), flush=True)
        t0 = time.perf_counter()
        try:
            out = __dojo_run(spec, args)
            res = {"i": i, "out": out, "ms": (time.perf_counter() - t0) * 1000}
        except Exception as e:
            res = {"i": i, "error": type(e).__name__ + ": " + str(e), "ms": (time.perf_counter() - t0) * 1000}
        try:
            line = json.dumps(res, default=__dojo_default)
        except Exception as e:
            line = json.dumps({"i": i, "error": "Could not serialize the return value: " + str(e), "ms": res["ms"]})
        print("${CASE_RESULT}" + line, flush=True)

__dojo_main()
`;

/** Number of lines before the user's code, so error line numbers can be mapped back. */
export const PY_USER_OFFSET = PY_HARNESS.split("\n").length;

export function pyProgram(userCode: string): string {
  return PY_HARNESS + "# ---- your code ----\n" + userCode + "\n" + PY_RUNNER;
}
