/**
 * Language registry. Safe to import on both server and client.
 *
 * runtime "browser" → runs in a Web Worker in the visitor's browser (no server needed)
 * runtime "server"  → sent to /api/execute, which forwards to a Piston code-execution server
 *
 * To add a language:
 *   1. Add an entry here. `piston.language` is the runtime name Piston reports in /api/v2/runtimes,
 *      `piston.pkg` the package that provides it (see scripts/piston-install.mjs).
 *   2. Install the package on your Piston server: npm run piston:install
 *   3. Add a CodeMirror highlighter in src/components/CodeEditor.tsx.
 *   4. For judging problems, add a driver in src/lib/drivers/ and set `judge: true`.
 */
export type LangId = "javascript" | "python" | "java" | "cpp" | "go";

export interface Language {
  id: LangId;
  label: string;
  runtime: "browser" | "server";
  /** Piston runtime name + version ("*" = latest installed), main file name, and the package that provides it */
  piston?: { language: string; version: string; file: string; pkg: string };
  /** A problem driver exists, so problems can be judged in this language */
  judge: boolean;
  /** Indent width in the editor */
  tab: number;
  hello: string;
}

export const LANGUAGES: Language[] = [
  { id: "javascript", label: "JavaScript", runtime: "browser", judge: true, tab: 2, hello: 'console.log("Hello, DSA!");\n' },
  { id: "python", label: "Python 3", runtime: "server", judge: true, tab: 4, piston: { language: "python", version: "*", file: "main.py", pkg: "python" }, hello: 'print("Hello, DSA!")\n' },
  { id: "java", label: "Java", runtime: "server", judge: false, tab: 4, piston: { language: "java", version: "*", file: "Main.java", pkg: "java" }, hello: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, DSA!");\n    }\n}\n' },
  { id: "cpp", label: "C++", runtime: "server", judge: false, tab: 4, piston: { language: "c++", version: "*", file: "main.cpp", pkg: "gcc" }, hello: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    cout << "Hello, DSA!" << endl;\n    return 0;\n}\n' },
  { id: "go", label: "Go", runtime: "server", judge: false, tab: 4, piston: { language: "go", version: "*", file: "main.go", pkg: "go" }, hello: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, DSA!")\n}\n' }
];

export const LANG = Object.fromEntries(LANGUAGES.map(l => [l.id, l])) as Record<LangId, Language>;
export const isLangId = (x: unknown): x is LangId => typeof x === "string" && Object.prototype.hasOwnProperty.call(LANG, x);
