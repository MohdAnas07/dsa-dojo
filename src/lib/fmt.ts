/** Source of the console.log formatter used inside sandboxes (kept as a string so it can be injected into Workers). */
export const FMT_SRC = `function fmt(v, top, depth) {
  top = top !== false; depth = depth || 0;
  if (typeof v === "string") return top ? v : JSON.stringify(v);
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "number") return Object.is(v, -0) ? "-0" : String(v);
  if (typeof v === "bigint") return v + "n";
  if (typeof v === "function") return "[Function" + (v.name ? ": " + v.name : "") + "]";
  if (typeof v !== "object") return String(v);
  if (depth > 4) return Array.isArray(v) ? "[Array]" : "[Object]";
  if (Array.isArray(v)) return "[" + v.map(x => fmt(x, false, depth + 1)).join(", ") + "]";
  if (v instanceof Map) return "Map(" + v.size + ") {" + [...v].map(([k, x]) => fmt(k, false, depth + 1) + " => " + fmt(x, false, depth + 1)).join(", ") + "}";
  if (v instanceof Set) return "Set(" + v.size + ") {" + [...v].map(x => fmt(x, false, depth + 1)).join(", ") + "}";
  const name = v.constructor && v.constructor.name && v.constructor.name !== "Object" ? v.constructor.name + " " : "";
  return name + "{" + Object.keys(v).map(k => k + ": " + fmt(v[k], false, depth + 1)).join(", ") + "}";
}`;

export const fmt: (v: unknown) => string = new Function(FMT_SRC + "; return fmt;")();
