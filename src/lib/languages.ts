/**
 * Language registry. Safe to import on both server and client.
 *
 * runtime "browser" → runs in a Web Worker in the visitor's browser (no server needed)
 * runtime "server"  → sent to /api/execute, which forwards to a Piston code-execution server
 *
 * To add a language:
 *   1. Add an entry here (piston name must match a package installed on your Piston server).
 *   2. For the free-form playground that's all you need.
 *   3. For judging problems, add a driver in src/lib/drivers/ and set `judge: true`.
 *   4. Add a CodeMirror highlighter in src/components/CodeEditor.tsx (optional).
 */
export type LangId = "javascript" | "python" | "java" | "cpp" | "c" | "go" | "typescript";

export interface Language {
  id: LangId;
  label: string;
  runtime: "browser" | "server";
  /** Piston language name + version ("*" = latest installed) */
  piston?: { language: string; version: string; file: string };
  /** A problem driver exists, so problems can be judged in this language */
  judge: boolean;
  hello: string;
}

export const LANGUAGES: Language[] = [
  { id: "javascript", label: "JavaScript", runtime: "browser", judge: true, hello: 'console.log("Hello, DSA!");\n' },
  { id: "python", label: "Python 3", runtime: "server", judge: true, piston: { language: "python", version: "*", file: "main.py" }, hello: 'print("Hello, DSA!")\n' },
  { id: "java", label: "Java", runtime: "server", judge: false, piston: { language: "java", version: "*", file: "Main.java" }, hello: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, DSA!");\n    }\n}\n' },
  { id: "cpp", label: "C++", runtime: "server", judge: false, piston: { language: "c++", version: "*", file: "main.cpp" }, hello: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    cout << "Hello, DSA!" << endl;\n    return 0;\n}\n' },
  { id: "c", label: "C", runtime: "server", judge: false, piston: { language: "c", version: "*", file: "main.c" }, hello: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello, DSA!\\n");\n    return 0;\n}\n' },
  { id: "go", label: "Go", runtime: "server", judge: false, piston: { language: "go", version: "*", file: "main.go" }, hello: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, DSA!")\n}\n' },
  { id: "typescript", label: "TypeScript", runtime: "server", judge: false, piston: { language: "typescript", version: "*", file: "main.ts" }, hello: 'const greet = (name: string): string => `Hello, ${name}!`;\nconsole.log(greet("DSA"));\n' }
];

export const LANG = Object.fromEntries(LANGUAGES.map(l => [l.id, l])) as Record<LangId, Language>;
export const isLangId = (x: unknown): x is LangId => typeof x === "string" && Object.prototype.hasOwnProperty.call(LANG, x);
