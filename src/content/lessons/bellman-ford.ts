import type { Lesson } from "@/lib/types";

const bellmanFord: Lesson = {
  what: "Bellman-Ford finds the shortest paths from one start node to every other node, even when some edges have negative weights. It also detects negative cycles, where going around the loop keeps lowering the cost.",
  analogy: { short: "Rumours improving round by round", text: "Each round, every town tells its neighbours 'you can reach the start through me for this cost'. A town updates whenever it hears a better offer. After enough rounds, no offer can improve anything. If offers keep improving forever, some loop is making things cheaper every time around." },
  eli5: "Everybody keeps checking 'can I get there cheaper by going through my neighbour?' over and over until nobody finds a better way.",
  tech: "Set dist[src] = 0 and everything else to Infinity, then relax every edge (if dist[u] + w < dist[v], lower dist[v]) in each of V − 1 rounds. A shortest path without cycles has at most V − 1 edges, so V − 1 rounds are enough. If a V-th round can still improve some distance, the graph has a negative cycle reachable from the source. Time O(V · E), slower than Dijkstra but it handles negative weights. Limiting the number of rounds to k + 1 (and relaxing from a copy of the previous round) gives the cheapest path using at most k + 1 edges.",
  why: "Negative weights show up as refunds, gains, or log-transformed exchange rates. Dijkstra assumes a settled node can't get cheaper later, which negative edges break. Bellman-Ford is also the go-to for 'at most k stops' questions.",
  how: ["dist[src] = 0, others Infinity.", "Repeat V − 1 times: for every edge u → v with weight w, if dist[u] + w < dist[v], set dist[v] = dist[u] + w.", "Stop early if a whole round changes nothing.", "Run one more round: any improvement means a negative cycle.", "For 'at most k edges', do k + 1 rounds and relax from the previous round's copy."],
  props: ["Handles negative edge weights", "Detects negative cycles", "O(V · E)", "Rounds = maximum number of edges in a path"],
  use: ["Shortest paths with negative weights", "Detecting negative cycles (arbitrage)", "Cheapest route with at most k stops", "Distance-vector routing protocols"],
  avoid: ["All weights non-negative and the graph is large (Dijkstra is faster)", "Unweighted graphs (BFS)"],
  viz: "array",
  cx: [["V − 1 rounds over all edges", "O(V · E)", "Each round relaxes every edge."], ["Negative cycle check", "O(E)", "One extra round."], ["Space", "O(V)", "The distance array."]],
  space: "O(V).",
  code: {
    c: `function bellmanFord(n, edges, src) {
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let round = 1; round < n; round++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; changed = true; }
    }
    if (!changed) break;
  }
  for (const [u, v, w] of edges) if (dist[u] + w < dist[v]) return "negative cycle";
  return dist;
}
console.log(bellmanFord(4, [[0, 1, 4], [0, 2, 5], [1, 2, -3], [2, 3, 2]], 0));
console.log(bellmanFord(3, [[0, 1, 1], [1, 2, -2], [2, 1, 1]], 0));`,
    hl: [7, 11],
    ex: { 4: "A shortest path uses at most n − 1 edges, so n − 1 rounds are enough.", 7: "Relax every edge in every round.", 9: "Nothing improved: we can stop early.", 11: "Still improving after n − 1 rounds ⇒ a negative cycle." }
  },
  examples: [
    { lvl: "Easy", title: "Shortest paths with a negative edge", prob: "Find the shortest distances from node 0 when one road has a negative cost.", idea: "Plain Bellman-Ford: relax all edges n − 1 times. The negative edge 2 → 1 makes the route through 2 cheaper.", c: `function shortest(n, edges, src) {
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let i = 1; i < n; i++)
    for (const [u, v, w] of edges) if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  return dist;
}
console.log(shortest(4, [[0, 1, 5], [0, 2, 2], [2, 1, -4], [1, 3, 1]], 0));`, time: "O(V · E)", space: "O(V)", ex: { 5: "0 → 2 → 1 costs 2 − 4 = −2, cheaper than the direct 5." } },
    { lvl: "Practical", title: "Cheapest flights within k stops", prob: "Find the cheapest price from src to dst using at most k stops.", idea: "k stops means at most k + 1 flights, so run exactly k + 1 rounds. Relax from the previous round's prices so one round adds only one flight.", c: `function findCheapestPrice(n, flights, src, dst, k) {
  let dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let i = 0; i <= k; i++) {
    const next = [...dist];
    for (const [u, v, w] of flights) if (dist[u] + w < next[v]) next[v] = dist[u] + w;
    dist = next;
  }
  return dist[dst] === Infinity ? -1 : dist[dst];
}
const flights = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]];
console.log(findCheapestPrice(4, flights, 0, 3, 1));
console.log(findCheapestPrice(4, flights, 0, 3, 2));`, time: "O(k · E)", space: "O(V)", ex: { 5: "Copy the previous round so a single round can't chain two flights.", 6: "Read from dist (last round), write into next (this round)." } },
    { lvl: "Interview", title: "Currency arbitrage (negative cycle)", prob: "Given exchange rates, can you trade around a loop and end up with more money?", idea: "A loop is profitable if the product of its rates is > 1. Taking −log of each rate turns 'product > 1' into 'sum < 0': a negative cycle.", c: `function hasArbitrage(n, rates) {
  const edges = rates.map(([u, v, r]) => [u, v, -Math.log(r)]);
  const dist = new Array(n).fill(0);
  for (let i = 1; i < n; i++)
    for (const [u, v, w] of edges) if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  return edges.some(([u, v, w]) => dist[u] + w < dist[v] - 1e-12);
}
console.log(hasArbitrage(3, [[0, 1, 0.9], [1, 2, 0.8], [2, 0, 1.4]]));
console.log(hasArbitrage(3, [[0, 1, 0.9], [1, 2, 0.8], [2, 0, 1.3]]));`, time: "O(V · E)", space: "O(V)", ex: { 2: "−log turns multiplying rates into adding weights.", 3: "Starting every node at 0 finds a negative cycle anywhere, not only near one source.", 6: "Still improving ⇒ negative cycle ⇒ arbitrage. (0.9 × 0.8 × 1.4 = 1.008 > 1.)" } }
  ],
  signals: [["negative edge weights", "Bellman-Ford"], ["\"at most k stops / edges\"", "k + 1 rounds of relaxation"], ["\"negative cycle\", \"arbitrage\", \"infinite profit\"", "One extra round after V − 1"], ["only non-negative weights, big graph", "Use Dijkstra instead"]],
  mistakes: [["Relaxing in place for 'at most k stops'", "One round could chain several flights. Relax from a copy of the previous round."], ["Running only one round", "Shortest paths can need up to V − 1 edges."], ["Forgetting the negative cycle check", "Without it, distances in a negative cycle are meaningless."], ["Floating-point comparisons with logs", "Use a small epsilon."]],
  js: ["Infinity + w stays Infinity, so unreached nodes never relax others.", "[...dist] copies the array for round-limited versions."],
  iq: { Beginner: ["Shortest paths when some roads have a negative cost"], Easy: ["Detect a negative cycle with one extra round"], Medium: ["cheapest-flights-k-stops", "network-delay-time"], Hard: ["Detect currency arbitrage"] },
  rev: { s30: "Relax every edge V − 1 times; handles negative weights in O(V · E). One extra improving round means a negative cycle. k + 1 rounds = at most k stops.", m2: ["dist[src] = 0", "V − 1 rounds of relaxing all edges", "Extra round improves ⇒ negative cycle", "k stops ⇒ k + 1 rounds on a copy", "Non-negative weights ⇒ Dijkstra is faster"] },
  cheat: `BELLMAN-FORD CHEAT SHEET

dist = [∞…], dist[s] = 0
repeat V−1 times:
  for (u, v, w) of edges:
    if dist[u] + w < dist[v]: dist[v] = dist[u] + w
one more round improves → negative cycle

O(V · E)  | handles negative weights
At most k stops: k+1 rounds, relax from a copy`
};

export default bellmanFord;
