/**
 * Turns a reference solution into (1) the code shown to the learner and (2) an instrumented copy that
 * reports every step to a recorder: statements, conditions (with both sides of a comparison), returns,
 * and function entry/exit. Line numbers always refer to the displayed code.
 */
import ts from "typescript";
const f = ts.factory;

export interface Static {
  /** Displayed code (examples, console.log calls and unused helpers removed). */
  code: string;
  /** Source text of each traced statement / condition, referenced by index from the trace. */
  texts: string[];
  /** Variables used to index each array/string: nums[i] → { nums: ["i"] }. */
  idx: Record<string, string[]>;
  /** Pairs used to index 2D arrays: grid[r][c] → { grid: [["r", "c"]] }. */
  idx2: Record<string, [string, string][]>;
}

const CMP = new Set([ts.SyntaxKind.LessThanToken, ts.SyntaxKind.LessThanEqualsToken, ts.SyntaxKind.GreaterThanToken, ts.SyntaxKind.GreaterThanEqualsToken, ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken]);
const parse = (src: string) => ts.createSourceFile("s.js", src, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);

/** Names declared by a top-level statement. */
function declared(s: ts.Statement): string[] {
  if ((ts.isFunctionDeclaration(s) || ts.isClassDeclaration(s)) && s.name) return [s.name.text];
  if (ts.isVariableStatement(s)) return s.declarationList.declarations.flatMap(d => bindingNames(d.name));
  return [];
}
function bindingNames(n: ts.BindingName): string[] {
  if (ts.isIdentifier(n)) return [n.text];
  return n.elements.flatMap(e => (ts.isOmittedExpression(e) ? [] : bindingNames(e.name)));
}
function identifiersIn(n: ts.Node, out = new Set<string>()): Set<string> {
  const walk = (x: ts.Node) => {
    if (ts.isIdentifier(x)) {
      const p = x.parent;
      if (p && ts.isPropertyAccessExpression(p) && p.name === x) return; // obj.prop: "prop" isn't a variable
      out.add(x.text);
    }
    ts.forEachChild(x, walk);
  };
  walk(n); return out;
}

/** Keeps only the top-level declarations the entry point needs (drops examples, console.log, build/show helpers). */
export function displayCode(src: string, entry: string): string {
  const sf = parse(src);
  const decl = new Map<string, ts.Statement>();
  for (const s of sf.statements) for (const n of declared(s)) decl.set(n, s);
  const keep = new Set<ts.Statement>(), todo = [entry];
  while (todo.length) {
    const n = todo.pop()!, s = decl.get(n);
    if (!s || keep.has(s)) continue;
    keep.add(s);
    for (const id of identifiersIn(s)) if (decl.has(id)) todo.push(id);
  }
  // A ListNode/TreeNode class the solution defines itself is replaced by the judge's identical one, unless it's used by name.
  const parts: string[] = [];
  for (const s of sf.statements) if (keep.has(s)) parts.push(s.getFullText(sf).replace(/^\s*\n/, "").replace(/^\s*\/\/ *Examples?\b.*$/gim, "").trimEnd());
  return parts.join("\n\n").replace(/^\n+/, "") + "\n";
}

export function instrument(code: string): { js: string; meta: Static } {
  const sf = parse(code);
  const texts: string[] = [];
  const idx: Record<string, Set<string>> = {}, idx2: Record<string, Set<string>> = {};
  const line = (n: ts.Node) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
  const text = (n: ts.Node) => { texts.push(n.getText(sf).replace(/\s+/g, " ").slice(0, 160)); return texts.length - 1; };
  const num = (n: number) => f.createNumericLiteral(n);
  const str = (s: string) => f.createStringLiteral(s);
  const call = (name: string, args: ts.Expression[]) => f.createCallExpression(f.createIdentifier(name), undefined, args);
  const stmt = (e: ts.Expression) => f.createExpressionStatement(e);

  // ---- static index analysis ----
  const single = (e: ts.Expression): string | null => { const ids = [...identifiersIn(e)].filter(x => !/^(Math|length|Number|undefined|Infinity|NaN)$/.test(x)); return ids.length === 1 ? ids[0] : null; };
  const scan = (n: ts.Node) => {
    if (ts.isElementAccessExpression(n)) {
      const obj = n.expression, arg = n.argumentExpression;
      // nums[i] and this.pages[this.cur]: record which variables (or this.fields) index which array
      const objName = ts.isIdentifier(obj) ? obj.text : ts.isPropertyAccessExpression(obj) && obj.expression.kind === ts.SyntaxKind.ThisKeyword ? "this." + obj.name.text : null;
      if (objName) {
        for (const id of identifiersIn(arg)) if (id !== objName && !/^(Math|length)$/.test(id)) (idx[objName] ||= new Set()).add(id);
        const thisRefs = (x: ts.Node): void => { if (ts.isPropertyAccessExpression(x) && x.expression.kind === ts.SyntaxKind.ThisKeyword) (idx[objName] ||= new Set()).add("this." + x.name.text); ts.forEachChild(x, thisRefs); };
        thisRefs(arg);
      }
      else if (ts.isElementAccessExpression(obj) && ts.isIdentifier(obj.expression)) {
        const a = single(obj.argumentExpression), b = single(arg);
        if (a && b) (idx2[obj.expression.text] ||= new Set()).add(a + "," + b);
      }
    }
    // i < nums.length, j <= s.length - 1 …: i is an index into nums / s
    if (ts.isBinaryExpression(n) && CMP.has(n.operatorToken.kind)) {
      const lenOf = (e: ts.Expression): string | null => {
        let x = e; while (ts.isParenthesizedExpression(x)) x = x.expression;
        if (ts.isBinaryExpression(x)) return lenOf(x.left);
        return ts.isPropertyAccessExpression(x) && x.name.text === "length" && ts.isIdentifier(x.expression) ? x.expression.text : null;
      };
      const pairs: [ts.Expression, ts.Expression][] = [[n.left, n.right], [n.right, n.left]];
      for (const [a, b] of pairs) { const arr = lenOf(b); if (arr && ts.isIdentifier(a)) (idx[arr] ||= new Set()).add(a.text); }
    }
    ts.forEachChild(n, scan);
  };
  scan(sf);

  // ---- instrumentation ----
  type Scope = { names: string[] };
  const scopes: Scope[] = [{ names: [] }];
  const visible = () => {
    const seen = new Set<string>(), out: string[] = [];
    for (let i = scopes.length - 1; i >= 0; i--) for (let k = scopes[i].names.length - 1; k >= 0; k--) { const n = scopes[i].names[k]; if (!seen.has(n)) { seen.add(n); out.push(n); } }
    return out.reverse();
  };
  // [["name", () => name], …]: each read is wrapped separately so a variable in its temporal dead zone can't break the others.
  const vars = () => f.createArrayLiteralExpression(visible().map(n => f.createArrayLiteralExpression([str(n), f.createArrowFunction(undefined, undefined, [], undefined, f.createToken(ts.SyntaxKind.EqualsGreaterThanToken), n === "this" ? f.createThis() : f.createIdentifier(n))])));
  const trace = (n: ts.Node, kind: "x" | "it" | "j") => stmt(call("__t", [str(kind), num(line(n)), num(text(n)), vars()]));

  const wrapCond = (cond: ts.Expression, node: ts.Node, loop: boolean): ts.Expression => {
    const c = visitExpr(cond);
    let x = cond; while (ts.isParenthesizedExpression(x)) x = x.expression;
    const id = text(cond);
    if (ts.isBinaryExpression(x) && CMP.has(x.operatorToken.kind)) {
      const inner = c as ts.Expression; let y = inner; while (ts.isParenthesizedExpression(y)) y = y.expression;
      const b = y as ts.BinaryExpression;
      return call("__k", [num(line(node)), num(id), loop ? f.createTrue() : f.createFalse(), str(ts.tokenToString(x.operatorToken.kind)!), b.left, b.right, vars()]);
    }
    return call("__c", [num(line(node)), num(id), loop ? f.createTrue() : f.createFalse(), c, vars()]);
  };

  const asBlock = (s: ts.Statement): ts.Block => (ts.isBlock(s) ? s : f.createBlock([s], true));
  const isSortCallback = (fn: ts.Node) => { const p = fn.parent; return !!p && ts.isCallExpression(p) && p.arguments.includes(fn as ts.Expression) && ts.isPropertyAccessExpression(p.expression) && /^(sort|toSorted)$/.test(p.expression.name.text); };
  const isCallback = (fn: ts.Node) => { const p = fn.parent; return !!p && (ts.isCallExpression(p) || ts.isNewExpression(p)) && ((p.arguments ?? []) as readonly ts.Node[]).includes(fn); };

  function fnName(fn: ts.FunctionLikeDeclaration): string {
    if (fn.name && ts.isIdentifier(fn.name)) {
      const cls = fn.parent && ts.isClassLike(fn.parent) && fn.parent.name ? fn.parent.name.text + "." : "";
      return cls + fn.name.text;
    }
    if (ts.isConstructorDeclaration(fn)) return (fn.parent.name?.text ?? "class") + " constructor";
    const p = fn.parent;
    if (p && ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return p.name.text;
    if (p && ts.isPropertyAssignment(p) && ts.isIdentifier(p.name)) return p.name.text;
    if (p && ts.isBinaryExpression(p) && ts.isPropertyAccessExpression(p.left)) return p.left.name.text;
    return "callback";
  }

  /** Instruments a function body. Frames (enter/exit) for named functions; callbacks only get their statements traced. */
  function visitFunction<T extends ts.FunctionLikeDeclaration>(fn: T): ts.Block | ts.ConciseBody | undefined {
    if (!fn.body) return fn.body;
    if (isSortCallback(fn)) return fn.body;
    const callback = isCallback(fn);
    if (!ts.isBlock(fn.body) && callback) return fn.body; // x => x * 2 inside map/filter: not worth a step each
    const params = fn.parameters.flatMap(p => bindingNames(p.name));
    const isMethod = ts.isMethodDeclaration(fn) || ts.isConstructorDeclaration(fn) || ts.isGetAccessor(fn);
    scopes.push({ names: [...(isMethod ? ["this"] : []), ...params] });
    let inner: ts.Statement[];
    if (ts.isBlock(fn.body)) inner = visitStatements(fn.body.statements);
    else inner = [f.createReturnStatement(f.createCallExpression(f.createIdentifier("__r"), undefined, [num(line(fn.body)), num(text(fn.body)), visitExpr(fn.body), vars()]))];
    const enterVars = vars();
    scopes.pop();
    if (callback) return f.createBlock(inner, true);
    const enter = f.createVariableStatement(undefined, f.createVariableDeclarationList([f.createVariableDeclaration("__fr", undefined, undefined, call("__enter", [num(line(fn)), str(fnName(fn)), enterVars, f.createArrayLiteralExpression(params.map(str))]))], ts.NodeFlags.Const));
    return f.createBlock([enter, f.createTryStatement(f.createBlock(inner, true), undefined, f.createBlock([stmt(call("__exit", [f.createIdentifier("__fr")]))], true))], true);
  }

  const exprVisitor = (n: ts.Node): ts.Node => {
    if (ts.isFunctionExpression(n) || ts.isArrowFunction(n)) {
      const body = visitFunction(n);
      return ts.isArrowFunction(n) ? f.updateArrowFunction(n, n.modifiers, n.typeParameters, n.parameters, n.type, n.equalsGreaterThanToken, body as ts.ConciseBody)
        : f.updateFunctionExpression(n, n.modifiers, n.asteriskToken, n.name, n.typeParameters, n.parameters, n.type, body as ts.Block);
    }
    if (ts.isClassExpression(n)) return visitClass(n);
    return ts.visitEachChild(n, exprVisitor, undefined);
  };
  const visitExpr = (e: ts.Expression) => ts.visitNode(e, exprVisitor) as ts.Expression;

  function visitClass<T extends ts.ClassLikeDeclaration>(c: T): T {
    const members = c.members.map(m => {
      if (ts.isMethodDeclaration(m)) return f.updateMethodDeclaration(m, m.modifiers, m.asteriskToken, m.name, m.questionToken, m.typeParameters, m.parameters, m.type, visitFunction(m) as ts.Block);
      if (ts.isConstructorDeclaration(m)) return f.updateConstructorDeclaration(m, m.modifiers, m.parameters, visitFunction(m) as ts.Block);
      if (ts.isGetAccessor(m)) return f.updateGetAccessorDeclaration(m, m.modifiers, m.name, m.parameters, m.type, visitFunction(m) as ts.Block);
      return m;
    });
    return (ts.isClassDeclaration(c) ? f.updateClassDeclaration(c, c.modifiers, c.name, c.typeParameters, c.heritageClauses, members) : f.updateClassExpression(c as ts.ClassExpression, c.modifiers, c.name, c.typeParameters, c.heritageClauses, members)) as unknown as T;
  }

  function visitStatements(list: readonly ts.Statement[]): ts.Statement[] {
    const out: ts.Statement[] = [];
    const scope = scopes[scopes.length - 1];
    // Hoisted names (functions, classes, var) are visible from the start of the block.
    for (const s of list) if (ts.isFunctionDeclaration(s) && s.name) scope.names.push(s.name.text);
    for (const s of list) out.push(...visitStatement(s));
    return out;
  }

  function block(s: ts.Statement, extra: string[] = []): ts.Block {
    scopes.push({ names: [...extra] });
    const b = asBlock(s);
    const r = f.updateBlock(b, visitStatements(b.statements));
    scopes.pop();
    return r;
  }

  function visitStatement(s: ts.Statement): ts.Statement[] {
    const scope = scopes[scopes.length - 1];
    if (ts.isFunctionDeclaration(s)) return [f.updateFunctionDeclaration(s, s.modifiers, s.asteriskToken, s.name, s.typeParameters, s.parameters, s.type, visitFunction(s) as ts.Block)];
    if (ts.isClassDeclaration(s)) { if (s.name) scope.names.push(s.name.text); return [visitClass(s)]; }
    if (ts.isVariableStatement(s)) {
      const v = ts.visitEachChild(s, exprVisitor, undefined);
      for (const d of s.declarationList.declarations) scope.names.push(...bindingNames(d.name));
      // A variable that only holds a function (const dfs = (…) => …) gets no "after" step of its own.
      const onlyFns = s.declarationList.declarations.every(d => d.initializer && (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer)));
      return onlyFns ? [v] : [v, trace(s, "x")];
    }
    if (ts.isExpressionStatement(s)) return [f.updateExpressionStatement(s, visitExpr(s.expression)), trace(s, "x")];
    if (ts.isReturnStatement(s)) return [f.updateReturnStatement(s, call("__r", [num(line(s)), num(text(s)), s.expression ? visitExpr(s.expression) : f.createIdentifier("undefined"), vars()]))];
    if (ts.isBreakStatement(s) || ts.isContinueStatement(s)) return [trace(s, "j"), s];
    if (ts.isThrowStatement(s)) return [trace(s, "j"), ts.visitEachChild(s, exprVisitor, undefined)];
    if (ts.isBlock(s)) return [block(s)];
    if (ts.isIfStatement(s)) return [f.updateIfStatement(s, wrapCond(s.expression, s, false), block(s.thenStatement), s.elseStatement ? (ts.isIfStatement(s.elseStatement) ? f.createBlock(visitStatement(s.elseStatement), true) : block(s.elseStatement)) : undefined)];
    if (ts.isWhileStatement(s)) return [f.updateWhileStatement(s, wrapCond(s.expression, s, true), block(s.statement))];
    if (ts.isDoStatement(s)) return [f.updateDoStatement(s, block(s.statement), wrapCond(s.expression, s, true))];
    if (ts.isForStatement(s)) {
      const init = s.initializer, names = init && ts.isVariableDeclarationList(init) ? init.declarations.flatMap(d => bindingNames(d.name)) : [];
      scopes.push({ names });
      const r = f.updateForStatement(s, init ? (ts.isVariableDeclarationList(init) ? ts.visitEachChild(init, exprVisitor, undefined) : visitExpr(init as ts.Expression)) : undefined,
        s.condition ? wrapCond(s.condition, s, true) : undefined, s.incrementor ? visitExpr(s.incrementor) : undefined, block(s.statement));
      scopes.pop();
      return [r];
    }
    if (ts.isForOfStatement(s) || ts.isForInStatement(s)) {
      const init = s.initializer, names = ts.isVariableDeclarationList(init) ? init.declarations.flatMap(d => bindingNames(d.name)) : [];
      // Each iteration starts with an "it" step that already sees the new loop variable.
      scopes.push({ names });
      const head = trace(s, "it");
      const b = block(s.statement);
      scopes.pop();
      const body = f.updateBlock(b, [head, ...b.statements]);
      return [ts.isForOfStatement(s) ? f.updateForOfStatement(s, s.awaitModifier, init, visitExpr(s.expression), body) : f.updateForInStatement(s, init, visitExpr(s.expression), body)];
    }
    if (ts.isSwitchStatement(s)) {
      return [f.updateSwitchStatement(s, visitExpr(s.expression), f.updateCaseBlock(s.caseBlock, s.caseBlock.clauses.map(c => {
        scopes.push({ names: [] }); const st = visitStatements(c.statements); scopes.pop();
        return ts.isCaseClause(c) ? f.updateCaseClause(c, visitExpr(c.expression), st) : f.updateDefaultClause(c, st);
      })))];
    }
    if (ts.isTryStatement(s)) return [f.updateTryStatement(s, block(s.tryBlock), s.catchClause ? f.updateCatchClause(s.catchClause, s.catchClause.variableDeclaration, block(s.catchClause.block, s.catchClause.variableDeclaration ? bindingNames(s.catchClause.variableDeclaration.name) : [])) : undefined, s.finallyBlock ? block(s.finallyBlock) : undefined)];
    if (ts.isLabeledStatement(s)) { const inner = visitStatement(s.statement); return inner.length === 1 ? [f.updateLabeledStatement(s, s.label, inner[0])] : [f.updateLabeledStatement(s, s.label, f.createBlock(inner, true))]; }
    return [ts.visitEachChild(s, exprVisitor, undefined)];
  }

  const top = visitStatements(sf.statements);
  const printer = ts.createPrinter({ removeComments: true });
  const js = printer.printFile(f.updateSourceFile(sf, top));
  const toObj = (m: Record<string, Set<string>>) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, [...v]]));
  return { js, meta: { code, texts, idx: toObj(idx), idx2: Object.fromEntries(Object.entries(idx2).map(([k, v]) => [k, [...v].map(x => x.split(",") as [string, string])])) } };
}
