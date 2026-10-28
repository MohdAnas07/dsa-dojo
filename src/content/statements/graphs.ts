import type { Statement } from "./types";

export const GRAPHS_STATEMENTS: Record<string, Statement> = {
  "flood-fill": {
    body: [
      "An image is represented by an m × n integer grid `image`, where image[i][j] is a pixel's color. You are also given a starting pixel (sr, sc) and a new `color`.",
      "Perform a flood fill: change the starting pixel and every pixel connected to it (up, down, left or right, through pixels of the same original color) to the new color. Return the modified image."
    ],
    why: [
      "Starting at the centre (color 1), every 1 connected to it becomes 2. The 1 in the bottom-right corner touches the region only diagonally, so it stays.",
      "The new color equals the original color, so nothing changes."
    ],
    walk: [
      "The original color at (1,1) is 1. DFS from (1,1), recoloring every 1 it can reach.",
      "(1,1) → 2. Its neighbours (0,1) and (1,0) are 1 → recolor them, then spread further to (0,0), (0,2) and (2,0).",
      "(1,2) and (2,1) are 0, so the fill stops there.",
      "(2,2) is 1 but is not connected up/down/left/right, so it stays 1."
    ],
    cons: ["m == image.length", "n == image[i].length", "1 ≤ m, n ≤ 50", "0 ≤ image[i][j], color < 2¹⁶", "0 ≤ sr < m, 0 ≤ sc < n"]
  },
  "max-area-island": {
    body: [
      "You are given an m × n binary matrix `grid`. An island is a group of 1s (land) connected 4-directionally (horizontally or vertically). Assume all four edges of the grid are surrounded by water.",
      "The area of an island is the number of cells with value 1 in it. Return the maximum area of an island in grid, or 0 if there is no island."
    ],
    why: [
      "The largest island has 6 cells (around columns 8–10 in rows 3–5). Diagonal cells don't connect, so the other groups are smaller.",
      "There is no land."
    ],
    walk: [
      "Scan every cell. When you find unvisited land, DFS from it, marking cells as visited and counting them.",
      "Each DFS returns the size of one island; keep the largest.",
      "The island at (3,8), (4,8), (4,9), (4,10), (3,10), (5,10) gives 6.",
      "No other island is bigger. The answer is 6."
    ],
    cons: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 50", "grid[i][j] is 0 or 1."]
  },
  "island-perimeter": {
    body: [
      "You are given a `grid` of size row × col where grid[i][j] = 1 is land and 0 is water. Cells connect horizontally and vertically (not diagonally).",
      "The grid contains exactly one island and no lakes (water inside the island that isn't connected to the outside). Each cell is a square with side length 1. Return the perimeter of the island."
    ],
    why: [
      "The island's outline has 16 unit edges.",
      "A single square has 4 sides.",
      "A single square has 4 sides."
    ],
    walk: [
      "Each land cell has 4 edges, and every pair of neighbouring land cells hides 2 edges (one each).",
      "There are 7 land cells → 28 edges.",
      "Neighbouring pairs: (0,1)-(1,1), (1,0)-(1,1), (1,1)-(1,2), (1,1)-(2,1), (2,1)-(3,1), (3,0)-(3,1) → 6 pairs.",
      "Perimeter = 28 − 2 × 6 = 16."
    ],
    cons: ["row == grid.length", "col == grid[i].length", "1 ≤ row, col ≤ 100", "grid[i][j] is 0 or 1.", "There is exactly one island."]
  },
  "surrounded-regions": {
    body: [
      "You are given an m × n matrix `board` containing 'X' and 'O'. A region is a group of 'O' cells connected horizontally or vertically.",
      "A region is surrounded if none of its cells is on the edge of the board. Capture every surrounded region by replacing its 'O's with 'X's, in place."
    ],
    why: [
      "The three connected 'O's in the middle don't touch the edge, so they are captured. The 'O' at the bottom edge stays.",
      "There is no 'O'."
    ],
    walk: [
      "Instead of finding surrounded regions, find the safe ones: start DFS from every 'O' on the border and mark everything it reaches as safe.",
      "The only border 'O' is (3,1). Mark it safe; it has no 'O' neighbours.",
      "Sweep the board: every 'O' that is not marked safe becomes 'X' → (1,1), (1,2), (2,2).",
      "Safe cells stay 'O'. The result keeps only (3,1)."
    ],
    cons: ["m == board.length", "n == board[i].length", "1 ≤ m, n ≤ 200", "board[i][j] is 'X' or 'O'."]
  },
  "number-of-enclaves": {
    body: [
      "You are given an m × n binary matrix `grid`, where 0 is a sea cell and 1 is a land cell. A move is a walk from one land cell to an adjacent land cell (up, down, left or right), or off the edge of the grid.",
      "Return the number of land cells from which you cannot walk off the edge of the grid in any number of moves."
    ],
    why: [
      "(1,2), (2,1) and (2,2) are enclosed by sea. (1,0) is on the edge.",
      "All the land connects to the top edge."
    ],
    walk: [
      "From every land cell on the border, DFS and sink (set to 0) everything reachable: those cells can escape.",
      "(1,0) is on the border; sink it. It has no land neighbours.",
      "Count the remaining land: (1,2), (2,1), (2,2).",
      "The answer is 3."
    ],
    cons: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 500", "grid[i][j] is 0 or 1."]
  },
  "pacific-atlantic": {
    body: [
      "There is an m × n island bordering two oceans: the Pacific touches the top and left edges, and the Atlantic touches the bottom and right edges. heights[r][c] is the height above sea level of each cell.",
      "Rain water flows from a cell to a neighbouring cell (up, down, left or right) whose height is less than or equal to the current one, and from edge cells into the adjacent ocean. Return the coordinates of all cells from which water can reach both oceans, in any order."
    ],
    why: [
      "For example (2,2) with height 5 can flow left and up to the Pacific, and down and right to the Atlantic. Seven cells can reach both.",
      "The single cell touches both oceans."
    ],
    walk: [
      "Work backwards from each ocean: water reaching a cell from a neighbour means the neighbour is at least as high, so climb up or stay level.",
      "DFS from all Pacific edge cells (top row, left column), climbing to cells with height ≥ current. Mark them 'reaches Pacific'.",
      "Do the same from the Atlantic edges (bottom row, right column).",
      "The answer is the cells marked by both: (0,4), (1,3), (1,4), (2,2), (3,0), (3,1), (4,0)."
    ],
    cons: ["m == heights.length", "n == heights[r].length", "1 ≤ m, n ≤ 200", "0 ≤ heights[r][c] ≤ 10⁵"]
  },
  "course-schedule": {
    body: [
      "There are a total of `numCourses` courses you have to take, labeled from 0 to numCourses − 1. You are given an array `prerequisites` where prerequisites[i] = [a, b] means you must take course b before course a.",
      "Return `true` if you can finish all courses, otherwise return `false`. It is impossible exactly when the prerequisites form a cycle."
    ],
    why: [
      "Take course 0, then course 1.",
      "Course 1 needs course 0 and course 0 needs course 1: a cycle."
    ],
    walk: [
      "Count each course's unmet prerequisites (its in-degree): course 0 → 0, course 1 → 1.",
      "Start with the courses that have none: queue [0].",
      "Take 0. Course 1's count drops to 0, so add it to the queue. Take 1.",
      "We took 2 courses, which is all of them: return true."
    ],
    cons: ["1 ≤ numCourses ≤ 2000", "0 ≤ prerequisites.length ≤ 5000", "prerequisites[i].length == 2", "All prerequisite pairs are unique."]
  },
  "course-schedule-ii": {
    body: [
      "There are `numCourses` courses labeled 0 to numCourses − 1, and `prerequisites` where [a, b] means you must take course b before course a.",
      "Return an ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible, return an empty array."
    ],
    why: [
      "Course 0 must come before course 1.",
      "Courses 1 and 2 need 0, and course 3 needs both 1 and 2. [0, 2, 1, 3] is also accepted.",
      "One course with no prerequisites."
    ],
    walk: [
      "In-degrees: course 0 → 0, course 1 → 1.",
      "Queue the courses with no prerequisites: [0].",
      "Take 0 → order [0]. Course 1's count drops to 0 → queue it.",
      "Take 1 → order [0, 1]. Every course is placed, so return [0, 1]."
    ],
    cons: ["1 ≤ numCourses ≤ 2000", "0 ≤ prerequisites.length ≤ numCourses × (numCourses − 1)", "All prerequisite pairs are distinct."]
  },
  "alien-dictionary": {
    body: [
      "There is a new alien language that uses English letters, but the order of the letters is unknown. You receive a list of strings `words` that are sorted lexicographically by the rules of this language.",
      "Return a string of the unique letters in the new alien language sorted in increasing order by its rules. If there is no valid order, return \"\". If several orders are valid, any of them is accepted."
    ],
    why: [
      "Comparing neighbouring words gives t < f, w < e, r < t and e < r, so the order is w, e, r, t, f.",
      "'z' comes before 'x'.",
      "z < x and x < z can't both be true."
    ],
    walk: [
      "Compare each pair of neighbouring words at their first different letter.",
      "wrt / wrf → t before f. wrf / er → w before e. er / ett → r before t. ett / rftt → e before r.",
      "Topologically sort the letters: w (nothing before it) → e → r → t → f.",
      "Result: 'wertf'."
    ],
    cons: ["1 ≤ words.length ≤ 100", "1 ≤ words[i].length ≤ 100", "`words[i]` consists of lowercase English letters."]
  },
  "number-connected-components": {
    body: [
      "You have a graph of `n` nodes labeled 0 to n − 1. You are given an array `edges` where edges[i] = [a, b] indicates an undirected edge between nodes a and b.",
      "Return the number of connected components in the graph."
    ],
    why: [
      "{0, 1, 2} and {3, 4}.",
      "All five nodes are linked in a chain."
    ],
    walk: [
      "Start with 5 separate groups (Union-Find).",
      "Edge 0–1 joins two groups → 4. Edge 1–2 → 3.",
      "Edge 3–4 → 2.",
      "2 components."
    ],
    cons: ["1 ≤ n ≤ 2000", "1 ≤ edges.length ≤ 5000", "edges[i].length == 2", "No repeated edges."]
  },
  "number-of-provinces": {
    body: [
      "There are n cities. Cities connected directly or through other cities form a province.",
      "You are given an n × n matrix `isConnected` where isConnected[i][j] = 1 if cities i and j are directly connected, and 0 otherwise. Return the total number of provinces."
    ],
    why: [
      "Cities 0 and 1 are connected; city 2 is on its own.",
      "No city is connected to another."
    ],
    walk: [
      "Go through the cities; each unvisited city starts a new province, and DFS marks everything connected to it.",
      "City 0: new province 1. DFS visits city 1.",
      "City 1 is already visited.",
      "City 2: new province 2. The answer is 2."
    ],
    cons: ["1 ≤ n ≤ 200", "isConnected[i][j] is 1 or 0.", "isConnected[i][i] == 1", "isConnected[i][j] == isConnected[j][i]"]
  },
  "graph-valid-tree": {
    body: [
      "You have a graph of `n` nodes labeled 0 to n − 1 and a list of undirected `edges`.",
      "Return `true` if the edges make up a valid tree, and `false` otherwise. A valid tree is connected and has no cycles, which means it has exactly n − 1 edges and they connect everything."
    ],
    why: [
      "4 edges for 5 nodes, all connected, no cycle.",
      "Edges 1–2, 2–3 and 1–3 form a cycle."
    ],
    walk: [
      "A tree on 5 nodes has exactly 4 edges. There are 4 ✓.",
      "Union the ends of each edge: 0–1, 0–2, 0–3, 1–4. No edge joins two nodes that were already in the same group, so there is no cycle.",
      "4 edges without a cycle on 5 nodes means everything is connected.",
      "Return true."
    ],
    cons: ["1 ≤ n ≤ 2000", "0 ≤ edges.length ≤ 5000", "No self-loops or repeated edges."]
  },
  "redundant-connection": {
    body: [
      "A tree is an undirected graph that is connected and has no cycles. You are given a graph that started as a tree with n nodes labeled 1 to n, with one additional edge added.",
      "The graph is given as an array `edges`. Return an edge that can be removed so that the result is a tree. If there are multiple answers, return the one that occurs last in the input."
    ],
    why: [
      "1–2, 1–3 and 2–3 form a cycle. Removing [2,3], the last of them, leaves a tree.",
      "1–2–3–4–1 is a cycle, and [1,4] is its last edge in the input."
    ],
    walk: [
      "Union-Find over the edges in order.",
      "[1,2]: different groups → join. [1,3]: different groups → join.",
      "[2,3]: 2 and 3 are already connected through 1. This edge closes a cycle.",
      "Return [2, 3]."
    ],
    cons: ["n == edges.length", "3 ≤ n ≤ 1000", "1 ≤ aᵢ < bᵢ ≤ n", "No repeated edges; the graph is connected."]
  },
  "satisfiability-equations": {
    body: [
      "You are given an array of strings `equations` that describe relationships between variables. Each string is 4 characters long and looks like 'x==y' or 'x!=y', where x and y are lowercase letters (not necessarily different) naming one-letter variables.",
      "Return `true` if it is possible to assign integers to the variables so that all the given equations hold, or `false` otherwise."
    ],
    why: [
      "a == b and b != a contradict each other.",
      "Both equations say the same thing.",
      "a, b and c can all be equal."
    ],
    walk: [
      "First pass: union the letters of every '==' equation. a == b → a and b are in one group.",
      "Second pass: check every '!=' equation.",
      "b != a, but b and a are in the same group.",
      "Contradiction: return false."
    ],
    cons: ["1 ≤ equations.length ≤ 500", "equations[i].length == 4", "equations[i][1] is '=' or '!', and equations[i][2] is '='."]
  },
  "most-stones-removed": {
    body: [
      "On a 2D plane, we place n stones at some integer coordinate points. Each coordinate point has at most one stone.",
      "A stone can be removed if it shares either the same row or the same column with another stone that has not been removed. Given `stones` where stones[i] = [xᵢ, yᵢ], return the largest possible number of stones that can be removed."
    ],
    why: [
      "All six stones are linked through shared rows and columns, so five can be removed, leaving one.",
      "The four corner stones form one group and the centre stone is alone: 5 − 2 groups = 3 removals.",
      "A single stone can't be removed."
    ],
    walk: [
      "Stones linked by shared rows or columns form groups. Each group can be removed down to its last stone.",
      "[0,0]–[0,1] share row 0, [0,0]–[1,0] share column 0, [1,0]–[1,2] share row 1, [0,1]–[2,1] share column 1, [2,1]–[2,2] share row 2.",
      "So all 6 stones form 1 group.",
      "Removable = stones − groups = 6 − 1 = 5."
    ],
    cons: ["1 ≤ stones.length ≤ 1000", "0 ≤ xᵢ, yᵢ ≤ 10⁴", "No two stones are at the same point."]
  },
  "word-ladder": {
    body: [
      "A transformation sequence from `beginWord` to `endWord` using a dictionary `wordList` is a sequence of words where each adjacent pair differs by a single letter, and every word after beginWord is in wordList. beginWord doesn't need to be in wordList.",
      "Return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists."
    ],
    why: [
      "hit → hot → dot → dog → cog: 5 words.",
      "'cog' is not in the word list, so it can't be reached."
    ],
    walk: [
      "BFS: each level changes one letter.",
      "Level 1: hit. Level 2: hot.",
      "Level 3: dot, lot.",
      "Level 4: dog, log. Level 5: cog, the end word.",
      "The sequence has 5 words."
    ],
    cons: ["1 ≤ beginWord.length ≤ 10", "endWord.length == beginWord.length", "1 ≤ wordList.length ≤ 5000", "All words have the same length and are lowercase; wordList words are unique."]
  },
  "open-the-lock": {
    body: [
      "You have a lock with 4 circular wheels, each with the digits 0–9. The wheels wrap around: '9' turns to '0' and '0' to '9'. Each move turns one wheel by one slot. The lock starts at '0000'.",
      "You are given a list of `deadends`: if the lock ever shows one of them, it gets stuck. Given a `target`, return the minimum total number of turns required to open the lock, or −1 if it is impossible."
    ],
    why: [
      "One shortest route is 0000 → 1000 → 1100 → 1200 → 1201 → 1202 → 0202. The obvious 0000 → 0001 → 0002 → 0102 → 0202 passes the dead end 0102.",
      "Turn the last wheel backward once: 0000 → 0009.",
      "Every neighbour of 8888 is a dead end, so it can never be reached."
    ],
    walk: [
      "BFS over lock states, skipping dead ends. Each state has 8 neighbours (4 wheels × up or down).",
      "Level 1 from 0000: 1000, 9000, 0100, 0900, 0010, 0090, 0001, 0009.",
      "Keep expanding level by level. Routes through 0101, 0102, 0201 and 2002 are blocked.",
      "0202 first appears at level 6, so the answer is 6."
    ],
    cons: ["1 ≤ deadends.length ≤ 500", "deadends[i].length == 4", "target.length == 4", "target is not in deadends.", "All strings consist of digits only."]
  },
  "shortest-path-binary-matrix": {
    body: [
      "Given an n × n binary matrix `grid`, return the length of the shortest clear path in the matrix. If there is no clear path, return −1.",
      "A clear path goes from the top-left cell to the bottom-right cell through cells that are all 0, moving in any of the 8 directions (including diagonals). Its length is the number of cells visited."
    ],
    why: [
      "Go diagonally from (0,0) to (1,1): 2 cells.",
      "(0,0) → (0,1) → (1,2) → (2,2): 4 cells.",
      "The starting cell is blocked."
    ],
    walk: [
      "BFS from (0,0), which counts as length 1.",
      "Its 0 neighbours: (1,1), diagonally. (0,1) and (1,0) are 1s.",
      "(1,1) is the bottom-right cell, reached at length 2.",
      "Return 2."
    ],
    cons: ["n == grid.length == grid[i].length", "1 ≤ n ≤ 100", "grid[i][j] is 0 or 1."]
  },
  "zero-one-matrix": {
    body: [
      "Given an m × n binary matrix `mat`, return the distance of the nearest 0 for each cell.",
      "The distance between two adjacent cells (sharing an edge) is 1. There is at least one 0 in mat."
    ],
    why: [
      "The only 1, in the centre, is next to a 0.",
      "The bottom-middle 1 is two steps from the nearest 0; the other 1s are next to a 0."
    ],
    walk: [
      "Multi-source BFS: put every 0 in the queue at distance 0.",
      "Level 1 reaches the centre cell (1,1) from any of its zero neighbours → distance 1.",
      "Every cell now has a distance.",
      "Result: [[0,0,0],[0,1,0],[0,0,0]]."
    ],
    cons: ["m == mat.length", "n == mat[i].length", "1 ≤ m, n ≤ 10⁴, and m × n ≤ 10⁴", "mat[i][j] is 0 or 1; there is at least one 0."]
  },
  "as-far-from-land": {
    body: [
      "Given an n × n `grid` containing only 0 (water) and 1 (land), find a water cell such that its distance to the nearest land cell is maximized, and return the distance.",
      "The distance is the Manhattan distance |x₀ − x₁| + |y₀ − y₁|. If no land or no water exists in the grid, return −1."
    ],
    why: [
      "The centre cell (1,1) is 2 away from every corner, where the land is.",
      "The bottom-right corner (2,2) is 4 away from the only land at (0,0)."
    ],
    walk: [
      "Multi-source BFS from all land cells at once: the last water cell reached is the farthest from land.",
      "Level 0: the four corners.",
      "Level 1: the edge middles (0,1), (1,0), (1,2), (2,1).",
      "Level 2: the centre (1,1). That is the last level, so the answer is 2."
    ],
    cons: ["n == grid.length == grid[i].length", "1 ≤ n ≤ 100", "grid[i][j] is 0 or 1."]
  },
  "network-delay-time": {
    body: [
      "You are given a network of `n` nodes, labeled from 1 to n, and `times`, a list of travel times as directed edges times[i] = (u, v, w): a signal takes w to travel from node u to node v.",
      "We send a signal from node `k`. Return the minimum time it takes for all n nodes to receive the signal. If some node can't be reached, return −1."
    ],
    why: [
      "From node 2: nodes 1 and 3 get the signal at time 1, and node 4 (via 3) at time 2.",
      "Node 2 gets the signal at time 1.",
      "There is no edge into node 1, so it never gets the signal."
    ],
    walk: [
      "Dijkstra from k = 2: always settle the closest unsettled node.",
      "Node 2 at time 0. Push 1 (time 1) and 3 (time 1).",
      "Settle node 1 at 1 (it has no outgoing edges). Settle node 3 at 1, then push 4 at 1 + 1 = 2.",
      "Settle node 4 at 2. All 4 nodes are reached; the latest is 2."
    ],
    cons: ["1 ≤ k ≤ n ≤ 100", "1 ≤ times.length ≤ 6000", "1 ≤ uᵢ, vᵢ ≤ n, uᵢ ≠ vᵢ", "0 ≤ wᵢ ≤ 100", "All (uᵢ, vᵢ) pairs are unique."]
  },
  "cheapest-flights-k-stops": {
    body: [
      "There are `n` cities connected by some number of flights. You are given an array `flights` where flights[i] = [from, to, price].",
      "Given three integers `src`, `dst` and `k`, return the cheapest price from src to dst with at most k stops in between. If there is no such route, return −1."
    ],
    why: [
      "0 → 1 → 3 costs 700 with 1 stop. 0 → 1 → 2 → 3 is cheaper (400) but uses 2 stops.",
      "0 → 1 → 2 costs 200 with 1 stop.",
      "With 0 stops only the direct flight (500) is allowed."
    ],
    walk: [
      "Bellman-Ford limited to k + 1 = 2 rounds: each round allows one more flight. Use the previous round's prices so a round adds only one flight.",
      "Start: city 0 costs 0.",
      "Round 1 (1 flight): city 1 → 100.",
      "Round 2 (2 flights): from city 1, city 2 → 200 and city 3 → 700.",
      "The cheapest price for city 3 is 700."
    ],
    cons: ["1 ≤ n ≤ 100", "0 ≤ flights.length ≤ n × (n − 1) / 2", "1 ≤ priceᵢ ≤ 10⁴", "No duplicate flights or self-loops.", "0 ≤ src, dst, k < n, src ≠ dst"]
  },
  "path-min-effort": {
    body: [
      "You are a hiker. You are given `heights`, a 2D array of size rows × columns, where heights[row][col] is the height of a cell. You start at the top-left cell and want to reach the bottom-right cell, moving up, down, left or right.",
      "A route's effort is the maximum absolute difference in heights between two consecutive cells of the route. Return the minimum effort required."
    ],
    why: [
      "The route 1 → 3 → 5 → 3 → 5 has a maximum step of 2. Every other route has a bigger step somewhere.",
      "The route 1 → 2 → 3 → 4 → 5 has steps of 1.",
      "A route through only 1s has effort 0."
    ],
    walk: [
      "Dijkstra, where a path's cost is its largest step instead of its total.",
      "From 1: going down to 3 costs 2, going right to 2 costs 1.",
      "Exploring the cheapest options first, every route along the top hits the 8 or a jump of 3 to the final 5.",
      "The route down the left (1 → 3 → 5) and along the bottom (→ 3 → 5) never needs more than 2.",
      "The minimum effort is 2."
    ],
    cons: ["rows == heights.length", "columns == heights[i].length", "1 ≤ rows, columns ≤ 100", "1 ≤ heights[i][j] ≤ 10⁶"]
  },
  "swim-rising-water": {
    body: [
      "You are given an n × n integer matrix `grid` where grid[i][j] is the elevation at (i, j). Rain starts to fall: at time t, the water depth everywhere is t.",
      "You can swim from a cell to a neighbouring cell (up, down, left or right) if both elevations are at most t, and you swim instantly. Return the least time until you can reach the bottom-right cell starting from the top-left cell."
    ],
    why: [
      "The bottom-right cell has elevation 3, so you can't stand on it before time 3.",
      "You have to wait until 16, when the cheapest route through the spiral opens."
    ],
    walk: [
      "Always expand the reachable cell with the lowest elevation (a min-heap). The answer is the highest elevation you had to step on.",
      "Start at (0,0) = 0. Neighbours: (0,1) = 2, (1,0) = 1.",
      "Take (1,0) = 1 → time 1. Its neighbour (1,1) = 3 joins the heap.",
      "Take (0,1) = 2 → time 2. Then take (1,1) = 3 → time 3, and it is the destination.",
      "The answer is 3."
    ],
    cons: ["n == grid.length == grid[i].length", "1 ≤ n ≤ 50", "0 ≤ grid[i][j] < n²", "Each value grid[i][j] is unique."]
  },
  "min-cost-connect-points": {
    body: [
      "You are given an array `points` representing integer coordinates of some points on a 2D plane, where points[i] = [xᵢ, yᵢ].",
      "The cost of connecting two points is their Manhattan distance |xᵢ − xⱼ| + |yᵢ − yⱼ|. Return the minimum cost to make all points connected, so that there is exactly one simple path between any two points (a minimum spanning tree)."
    ],
    why: [
      "The cheapest set of connections costs 4 + 3 + 4 + 9 = 20.",
      "Connect (3,12)–(−2,5) for 12 and (−2,5)–(−4,1) for 6: 18."
    ],
    walk: [
      "Prim's algorithm: grow the tree from (0,0), each time adding the closest point not yet in it.",
      "From (0,0): the closest is (2,2) at distance 4. Total 4.",
      "Now the closest is (5,2), 3 from (2,2). Total 7.",
      "Then (7,0), 4 from (5,2). Total 11.",
      "Finally (3,10), 9 from (2,2). Total 20."
    ],
    cons: ["1 ≤ points.length ≤ 1000", "-10⁶ ≤ xᵢ, yᵢ ≤ 10⁶", "All points are distinct."]
  },
  "evaluate-division": {
    body: [
      "You are given an array of variable pairs `equations` and an array of real numbers `values`, where equations[i] = [Aᵢ, Bᵢ] and values[i] represent the equation Aᵢ / Bᵢ = values[i]. Each variable is a string.",
      "You are also given `queries`, where queries[j] = [Cⱼ, Dⱼ] asks for Cⱼ / Dⱼ. Return the answers to all queries. If an answer can't be determined (for example, a variable never appears), return −1.0 for it. Answers within 10⁻⁵ are accepted."
    ],
    why: [
      "a / c = (a / b) × (b / c) = 2 × 3 = 6. b / a = 1 / 2. 'e' and 'x' never appear, so those answers are −1. a / a = 1.",
      "a / c = 1.5 × 2.5 = 3.75 and c / b = 1 / 2.5 = 0.4. bc / cd = 5 and its inverse is 0.2."
    ],
    walk: [
      "Build a weighted graph: a → b with weight 2 and b → a with weight 1/2; b → c with weight 3 and c → b with weight 1/3.",
      "Query a / c: DFS from a to c, multiplying weights: a → b (× 2) → c (× 3) = 6.",
      "Query b / a: the edge b → a has weight 0.5.",
      "Queries with an unknown variable return −1; a / a returns 1 when a is known."
    ],
    cons: ["1 ≤ equations.length ≤ 20", "1 ≤ variable length ≤ 5", "0.0 < values[i] ≤ 20.0", "1 ≤ queries.length ≤ 20", "The equations never contradict each other."]
  },
  "find-town-judge": {
    body: [
      "In a town, there are `n` people labeled from 1 to n. There is a rumor that one of these people is secretly the town judge. If the judge exists, the judge trusts nobody, everybody else trusts the judge, and exactly one person satisfies both rules.",
      "You are given `trust`, where trust[i] = [a, b] means person a trusts person b. Return the label of the town judge if they exist and can be identified, or −1 otherwise."
    ],
    why: [
      "Person 1 trusts 2, and 2 trusts nobody.",
      "Persons 1 and 2 both trust 3, and 3 trusts nobody.",
      "3 is trusted by everyone else, but 3 also trusts 1, so 3 can't be the judge."
    ],
    walk: [
      "Give each person a score: +1 for every person who trusts them, −1 for every person they trust.",
      "[1, 2] → person 1: −1, person 2: +1.",
      "The judge must have score n − 1 = 1. Person 2 has it.",
      "Return 2."
    ],
    cons: ["1 ≤ n ≤ 1000", "0 ≤ trust.length ≤ 10⁴", "All trust pairs are unique.", "aᵢ ≠ bᵢ"]
  },
  "is-graph-bipartite": {
    body: [
      "There is an undirected graph with n nodes, numbered 0 to n − 1. `graph[u]` is the list of nodes adjacent to u. There are no self-edges or parallel edges, and the graph may not be connected.",
      "A graph is bipartite if the nodes can be split into two sets A and B such that every edge connects a node in A with a node in B. Return `true` if the graph is bipartite."
    ],
    why: [
      "Nodes 0, 1 and 2 are all connected to each other (a triangle), so two of them would end up in the same set.",
      "Put {0, 2} in one set and {1, 3} in the other; every edge crosses between them."
    ],
    walk: [
      "Two-color with BFS: neighbours must get the opposite color.",
      "Color 0 red. Its neighbours 1, 2 and 3 get blue.",
      "Node 1 is blue, but its neighbour 2 is also blue.",
      "Conflict: return false."
    ],
    cons: ["graph.length == n", "1 ≤ n ≤ 100", "0 ≤ graph[u].length < n", "If v is in graph[u], then u is in graph[v]."]
  },
  "possible-bipartition": {
    body: [
      "We want to split a group of `n` people (labeled from 1 to n) into two groups of any size. Each person may dislike some other people, and they should not go into the same group.",
      "Given n and the array `dislikes` where dislikes[i] = [a, b] means person a dislikes person b, return `true` if it is possible to split everyone into two groups this way."
    ],
    why: [
      "Group 1 = {1, 4} and group 2 = {2, 3}.",
      "1, 2 and 3 all dislike each other; with only two groups, two of them must share one."
    ],
    walk: [
      "Treat each dislike as an edge and try to 2-color the graph.",
      "Put 1 in group A. 2 and 3 (disliked by 1) go to group B.",
      "4 (disliked by 2) goes to group A.",
      "No conflicts, so return true."
    ],
    cons: ["1 ≤ n ≤ 2000", "0 ≤ dislikes.length ≤ 10⁴", "1 ≤ aᵢ < bᵢ ≤ n", "All pairs are unique."]
  },
  "keys-and-rooms": {
    body: [
      "There are n rooms labeled from 0 to n − 1, and all the rooms are locked except for room 0. Your goal is to visit all the rooms. You can't enter a locked room without its key.",
      "When you visit a room, you find the keys listed in `rooms[i]`; each key unlocks one room. Return `true` if you can visit all the rooms, or `false` otherwise."
    ],
    why: [
      "Room 0 has the key to 1, room 1 the key to 2, and room 2 the key to 3.",
      "The only key to room 2 is inside room 2."
    ],
    walk: [
      "DFS from room 0, following keys.",
      "Room 0 → key 1. Room 1 → key 2. Room 2 → key 3. Room 3 has no keys.",
      "Visited rooms: 0, 1, 2, 3, which is all of them.",
      "Return true."
    ],
    cons: ["n == rooms.length", "2 ≤ n ≤ 1000", "0 ≤ rooms[i].length ≤ 1000", "All keys are distinct, and their total is at most 3000."]
  },
  "all-paths-source-target": {
    body: [
      "Given a directed acyclic graph (DAG) of n nodes labeled from 0 to n − 1, find all possible paths from node 0 to node n − 1 and return them in any order.",
      "graph[i] is the list of nodes you can visit directly from node i."
    ],
    why: [
      "Two paths: 0 → 1 → 3 and 0 → 2 → 3.",
      "Five different paths lead from 0 to 4."
    ],
    walk: [
      "DFS from 0, keeping the current path, and record it when you reach node 3.",
      "0 → 1 → 3 ✓ record [0, 1, 3].",
      "Back to 0 → 2 → 3 ✓ record [0, 2, 3].",
      "Two paths."
    ],
    cons: ["n == graph.length", "2 ≤ n ≤ 15", "graph[i] contains unique nodes, never i itself.", "The graph is a DAG."]
  },
  "longest-increasing-path-matrix": {
    body: [
      "Given an m × n integers `matrix`, return the length of the longest increasing path in it.",
      "From each cell you can move left, right, up or down (not diagonally, and not off the grid). Each step must go to a strictly larger value."
    ],
    why: [
      "The longest path is 1 → 2 → 6 → 9.",
      "The longest path is 3 → 4 → 5 → 6.",
      "A single cell is a path of length 1."
    ],
    walk: [
      "longest(cell) = 1 + the largest longest(neighbour) over neighbours with a bigger value. Memoize, since each cell's answer never changes.",
      "9 has no bigger neighbour → 1. 6 (1,0) can go to 9 → 2.",
      "2 (2,0) can go to 6 → 3.",
      "1 (2,1) can go to 2 → 4. Nothing beats that, so the answer is 4."
    ],
    cons: ["m == matrix.length", "n == matrix[i].length", "1 ≤ m, n ≤ 200", "0 ≤ matrix[i][j] ≤ 2³¹ − 1"]
  },
  "minimum-height-trees": {
    body: [
      "A tree is an undirected graph in which any two vertices are connected by exactly one path. Given a tree of `n` nodes labeled 0 to n − 1 and its `edges`, you can choose any node as the root.",
      "Among all possible rooted trees, those with minimum height are called minimum height trees (MHTs). Return the labels of all MHT roots, in any order. Height is the number of edges on the longest downward path from the root."
    ],
    why: [
      "Rooting at 1 gives height 1; any other root gives height 2.",
      "Rooting at 3 or 4 gives height 2."
    ],
    walk: [
      "Peel off leaves layer by layer, like an onion. The last one or two nodes left are the centres.",
      "Leaves (degree 1): 0, 2, 3. Remove them.",
      "Only node 1 is left.",
      "Return [1]."
    ],
    cons: ["1 ≤ n ≤ 2 · 10⁴", "edges.length == n − 1", "The input is guaranteed to be a tree."]
  },
  "reconstruct-itinerary": {
    body: [
      "You are given a list of airline `tickets` where tickets[i] = [from, to] is a flight. Reconstruct the itinerary in order and return it.",
      "All of the tickets belong to a man who departs from 'JFK', so the itinerary must begin with 'JFK'. You must use all the tickets once and only once. If there are multiple valid itineraries, return the one with the smallest lexical order when read as a single string. At least one valid itinerary exists."
    ],
    why: [
      "The only way to use all tickets is JFK → MUC → LHR → SFO → SJC.",
      "JFK → SFO → ATL → JFK → ATL → SFO is also valid, but the answer starts JFK → ATL, which comes first alphabetically."
    ],
    walk: [
      "Sort each airport's destinations, then DFS: always take the smallest unused ticket, and add an airport to the route only once it has no tickets left (post-order).",
      "JFK → MUC → LHR → SFO → SJC. SJC has no tickets: add it, then back up.",
      "SFO, LHR, MUC and JFK each have no tickets left, so they are added in turn.",
      "Reverse the order they were added: JFK, MUC, LHR, SFO, SJC."
    ],
    cons: ["1 ≤ tickets.length ≤ 300", "Each airport code is 3 uppercase letters.", "fromᵢ ≠ toᵢ"]
  },
  "critical-connections": {
    body: [
      "There are `n` servers numbered from 0 to n − 1 connected by undirected server-to-server `connections`, forming a network where any server can reach any other.",
      "A critical connection is a connection that, if removed, will make some servers unable to reach some other server. Return all critical connections in the network, in any order."
    ],
    why: [
      "0, 1 and 2 form a triangle, so any one of those links can be removed. Removing 1–3 cuts server 3 off.",
      "The only connection is critical."
    ],
    walk: [
      "DFS while recording each server's discovery time and its `low`: the earliest discovery time reachable through its subtree plus one back edge.",
      "Visit 0 (time 0), 1 (time 1), 2 (time 2). 2 has an edge back to 0, so low[2] = 0, and that passes up to low[1] = 0.",
      "Visit 3 (time 3) from 1. It has no other edges, so low[3] = 3.",
      "low[3] = 3 > time[1] = 1: nothing below 3 reaches back above 1, so 1–3 is a bridge."
    ],
    cons: ["2 ≤ n ≤ 10⁵", "n − 1 ≤ connections.length ≤ 10⁵", "No repeated connections; the network is connected."]
  },
  "walls-and-gates": {
    body: [
      "You are given an m × n grid `rooms` with three possible values: −1 for a wall or obstacle, 0 for a gate, and 2147483647 (INF) for an empty room.",
      "Fill each empty room with the distance to its nearest gate, moving up, down, left or right. If a gate can't be reached, leave the room as INF. Modify the grid in place."
    ],
    why: [
      "Each room gets its shortest walking distance to either gate, going around the walls.",
      "There are no rooms to fill."
    ],
    walk: [
      "Multi-source BFS from both gates, (0,2) and (3,0), at the same time.",
      "Distance 1: (0,3) and (1,2) from the top gate, (2,0) from the bottom gate.",
      "Distance 2: (1,1) and (2,2), and (1,0).",
      "Distance 3: (0,0) and (3,2). Distance 4: (3,3).",
      "Every reachable room is filled."
    ],
    cons: ["m == rooms.length", "n == rooms[i].length", "1 ≤ m, n ≤ 250", "rooms[i][j] is −1, 0 or 2³¹ − 1."]
  }
};
