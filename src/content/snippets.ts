/** Starter snippets for the JavaScript playground. */
export const PG_SNIPPETS: Record<string, string> = {
  "Blank": `// Write any JavaScript and press Run (Ctrl/⌘ + Enter).\n// console.log shows up in the output panel.\n\nconsole.log("Hello, DSA!");\n`,
  "Arrays & loops": `const nums = [5, 3, 8, 1, 9, 2];\n\nconsole.log("max:", Math.max(...nums));\nconsole.log("sum:", nums.reduce((a, b) => a + b, 0));\nconsole.log("sorted:", [...nums].sort((a, b) => a - b));\nconsole.log("evens:", nums.filter(n => n % 2 === 0));\n\n// Trap: default sort compares strings!\nconsole.log([10, 9, 1].sort());\n`,
  "Map & Set": `const words = ["apple", "banana", "apple", "cherry", "banana", "apple"];\n\nconst count = new Map();\nfor (const w of words) count.set(w, (count.get(w) || 0) + 1);\nconsole.log(count);\n\nconst unique = new Set(words);\nconsole.log(unique.size, [...unique]);\n\n// Most frequent word\nconst [top] = [...count].sort((a, b) => b[1] - a[1]);\nconsole.log("most frequent:", top);\n`,
  "Linked list": `// ListNode, buildList(array) and listToArray(head) are built in.\nconst head = buildList([1, 2, 3, 4, 5]);\n\nfunction reverse(head) {\n  let prev = null, cur = head;\n  while (cur) {\n    const next = cur.next;\n    cur.next = prev;\n    prev = cur;\n    cur = next;\n  }\n  return prev;\n}\n\nconsole.log(listToArray(reverse(head)));\n`,
  "Binary tree": `// TreeNode, buildTree(levelOrderArray) and treeToArray(root) are built in.\nconst root = buildTree([4, 2, 7, 1, 3, 6, 9]);\n\nconst inorder = (n, out = []) => {\n  if (!n) return out;\n  inorder(n.left, out); out.push(n.val); inorder(n.right, out);\n  return out;\n};\nconst height = n => (n ? 1 + Math.max(height(n.left), height(n.right)) : 0);\n\nconsole.log("inorder:", inorder(root));\nconsole.log("height:", height(root));\n`,
  "Big O race": `// Feel the difference between O(n²) and O(n)\nconst n = 5000;\nconst arr = Array.from({ length: n }, (_, i) => i);\n\nlet t = performance.now();\nlet dupSlow = false;\nfor (let i = 0; i < n; i++)\n  for (let j = i + 1; j < n; j++)\n    if (arr[i] === arr[j]) dupSlow = true;\nconsole.log("O(n²):", (performance.now() - t).toFixed(1), "ms");\n\nt = performance.now();\nconst seen = new Set();\nlet dupFast = false;\nfor (const x of arr) { if (seen.has(x)) dupFast = true; seen.add(x); }\nconsole.log("O(n): ", (performance.now() - t).toFixed(1), "ms");\n\n// Try n = 20000 and run again.\n`
};

/** Python snippets (run on the execution server). */
export const PY_SNIPPETS: Record<string, string> = {
  "Hello": 'print("Hello, DSA!")\n',
  "Read input": "# Type input in the box below the editor, then Run.\nn = int(input())\nnums = list(map(int, input().split()))\nprint(\"n =\", n, \"sum =\", sum(nums))\n",
  "Collections": "from collections import Counter, deque, defaultdict\n\nwords = \"apple banana apple cherry banana apple\".split()\nprint(Counter(words).most_common(2))\n\nq = deque([1, 2, 3])\nq.appendleft(0); q.pop()\nprint(list(q))\n\ngroups = defaultdict(list)\nfor w in [\"eat\", \"tea\", \"tan\", \"ate\"]:\n    groups[\"\".join(sorted(w))].append(w)\nprint(dict(groups))\n",
  "Heap (Top K)": "import heapq\n\nnums = [5, 1, 8, 3, 9, 2]\nk = 3\nprint(heapq.nlargest(k, nums))\n\nheap = []\nfor x in nums:\n    heapq.heappush(heap, x)\n    if len(heap) > k:\n        heapq.heappop(heap)\nprint(sorted(heap, reverse=True))\n"
};
