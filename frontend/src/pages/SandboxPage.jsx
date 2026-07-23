import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Background from "../components/Background";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";

export default function SandboxPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Load Skulpt dynamically for full Python support in the browser
    const script1 = document.createElement("script");
    script1.src = "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js";
    script1.async = true;
    
    script1.onload = () => {
      const script2 = document.createElement("script");
      script2.src = "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js";
      script2.async = true;
      document.body.appendChild(script2);
      window._skulptStdLibScript = script2;
    };

    document.body.appendChild(script1);

    return () => {
      if (document.body.contains(script1)) document.body.removeChild(script1);
      if (window._skulptStdLibScript && document.body.contains(window._skulptStdLibScript)) {
        document.body.removeChild(window._skulptStdLibScript);
      }
    };
  }, []);
  const languageTemplates = {
    python: `# Python 3 execution sandbox\ndef greet(name):\n    return "Hello, " + name + "! Welcome to SkillSphere."\n\nprint(greet("Student"))`,
    cpp: `// C++ execution sandbox\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from C++ compiler!" << endl;\n    return 0;\n}`,
    c: `// C execution sandbox\n#include <stdio.h>\n\nint main() {\n    printf("Hello from C compiler!\\n");\n    return 0;\n}`,
    java: `// Java execution sandbox\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java compiler!");\n    }\n}`
  };

  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [editorCode, setEditorCode] = useState(languageTemplates.python);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setEditorCode(languageTemplates[lang]);
  };

  const translatePythonToJS = (code) => {
    let jsLines = [];
    const lines = code.split("\n");
    let indentLevels = [];

    for (let line of lines) {
      const rawLine = line;
      const trimmed = line.trim();
      if (!trimmed) {
        jsLines.push("");
        continue;
      }
      if (trimmed.startsWith("#")) {
        jsLines.push("// " + trimmed.slice(1));
        continue;
      }

      const indentCount = rawLine.length - rawLine.trimStart().length;

      while (indentLevels.length > 0 && indentCount <= indentLevels[indentLevels.length - 1]) {
        jsLines.push(" ".repeat(indentLevels[indentLevels.length - 1]) + "}");
        indentLevels.pop();
      }

      let translated = trimmed;

      const defMatch = trimmed.match(/^def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*?)\)\s*:/);
      if (defMatch) {
        translated = `function ${defMatch[1]}(${defMatch[2]}) {`;
        indentLevels.push(indentCount);
      } else {
        if (trimmed.endsWith(":")) {
          if (trimmed.startsWith("if ")) {
            translated = `if (${trimmed.slice(3, -1).trim()}) {`;
            indentLevels.push(indentCount);
          } else if (trimmed.startsWith("elif ")) {
            translated = `else if (${trimmed.slice(5, -1).trim()}) {`;
            indentLevels.push(indentCount);
          } else if (trimmed.startsWith("else")) {
            translated = `else {`;
            indentLevels.push(indentCount);
          } else if (trimmed.startsWith("for ") && trimmed.includes(" in ")) {
            const forMatch = trimmed.match(/^for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+range\((.*?)\)\s*:/);
            if (forMatch) {
              const varName = forMatch[1];
              const rangeVal = forMatch[2].trim();
              translated = `for (let ${varName} = 0; ${varName} < ${rangeVal}; ${varName}++) {`;
              indentLevels.push(indentCount);
            }
          }
        }
      }

      translated = translated.replace(/\bf(['"])(.*?)\1/g, (match, quote, content) => {
        return '`' + content.replace(/\{(.*?)\}/g, '${$1}') + '`';
      });

      translated = translated.replace(/\bprint\(([\s\S]*?)\)/g, "console.log($1)");
      translated = translated.replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false");
      translated = translated.replace(/\band\b/g, "&&").replace(/\bor\b/g, "||").replace(/\bnot\b/g, "!");

      jsLines.push(" ".repeat(indentCount) + translated);
    }

    while (indentLevels.length > 0) {
      jsLines.push(" ".repeat(indentLevels[indentLevels.length - 1]) + "}");
      indentLevels.pop();
    }

    return jsLines.join("\n");
  };

  const translateCPlusPlusJavaToJS = (code, language) => {
    let js = code;

    // 1. Remove comments
    js = js.replace(/\/\*[\s\S]*?\*\//g, ""); // multi-line comments
    js = js.replace(/\/\/.*/g, ""); // single-line comments

    // 2. Remove standard namespaces, libraries and headers
    js = js.replace(/#include\s*<.*?>/g, "");
    js = js.replace(/using\s+namespace\s+\w+\s*;/g, "");
    js = js.replace(/import\s+[\w.]+(\.\*)?\s*;/g, "");
    js = js.replace(/package\s+[\w.]+\s*;/g, "");
    js = js.replace(/\bstd::/g, "");

    // Remove Java static modifiers and class headers
    js = js.replace(/\b(?:public|private|protected|static|final|class)\s+\w+\s*\{([\s\S]*)\}/g, "$1");
    js = js.replace(/\b(?:public|private|protected|static|final)\b/g, "");

    // 3. Translate print functions to console.log
    js = js.replace(/System\.out\.println\s*\(([\s\S]*?)\)\s*;/g, "console.log($1);");
    js = js.replace(/System\.out\.print\s*\(([\s\S]*?)\)\s*;/g, "console.log($1);");

    // Replace printf(...)
    js = js.replace(/printf\s*\(\s*(['"])(.*?)\1\s*(?:,\s*([\s\S]*?))?\)\s*;/g, (match, quote, fmt, args) => {
      let fmtStr = fmt.replace(/\\n/g, "");
      if (!args) return `console.log(${quote}${fmtStr}${quote});`;
      
      const argList = args.split(",");
      let jsExpr = `${quote}${fmtStr}${quote}`;
      for (let arg of argList) {
        arg = arg.trim();
        jsExpr = jsExpr.replace(/%[d|f|s|c|x]/, `" + ${arg} + "`);
      }
      jsExpr = jsExpr.replace(/^""\s*\+\s*/, "").replace(/\s*\+\s*""$/, "");
      return `console.log(${jsExpr});`;
    });

    // Replace cout << ... << endl;
    js = js.replace(/cout\s*<<\s*([\s\S]*?)\s*;/g, (match, content) => {
      const parts = content.split("<<");
      const evalParts = [];
      for (let part of parts) {
        part = part.trim();
        if (part === "endl") {
          evalParts.push('""');
        } else {
          evalParts.push(part);
        }
      }
      return `console.log(${evalParts.filter(p => p !== "").join(" + ")});`;
    });

    // 4. Replace type definitions (including array types): int, float, double, char, String, boolean, bool, void
    const types = ["int", "float", "double", "char", "String", "boolean", "bool", "void"];
    for (let type of types) {
      js = js.replace(new RegExp(`\\b${type}(?:\\s*\\[\\s*\\])?\\s+([a-zA-Z_][a-zA-Z0-9_]*)\\b`, 'g'), "let $1");
    }

    // Replace function definitions
    js = js.replace(/let\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([\s\S]*?)\)\s*\{/g, "function $1($2) {");

    // Clean up "let" and array brackets inside parentheses (function parameter types)
    js = js.replace(/\(([\s\S]*?)\)/g, (match, params) => {
      return `(${params.replace(/\blet\s*\[\s*\]\s+/g, "").replace(/\blet\s+/g, "")})`;
    });

    // 5. Auto call main
    js += "\nif (typeof main === 'function') { main(); }";

    return js;
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput("Compiling and executing code...");

    setTimeout(() => {
      const code = editorCode;
      const outputLines = [];

      // 1. Python Execution via Skulpt if loaded, else fallback to Python-to-JS translator
      if (selectedLanguage === "python") {
        if (window.Sk) {
          let preprocessedCode = code;
          
          // Preprocess and mock missing system modules (sys, os) for Skulpt sandbox compatibility
          if (preprocessedCode.includes("sys")) {
            preprocessedCode = preprocessedCode.replace(/import\s+sys/g, "# Mock sys\nclass DummySys:\n    argv = ['main.py']\n    def exit(self, code=0):\n        pass\nsys = DummySys()");
            preprocessedCode = preprocessedCode.replace(/from\s+sys\s+import\s+\*/g, "# Mock sys\nargv = ['main.py']");
            preprocessedCode = preprocessedCode.replace(/from\s+sys\s+import\s+([\w,\s]+)/g, (match, imports) => {
              return imports.split(",").map(imp => `${imp.trim()} = None`).join("\n");
            });
          }
          if (preprocessedCode.includes("os")) {
            preprocessedCode = preprocessedCode.replace(/import\s+os/g, "# Mock os\nclass DummyOs:\n    name = 'posix'\n    environ = {}\n    def getcwd(self):\n        return '/'\nos = DummyOs()");
          }

          window.Sk.configure({
            output: (text) => {
              outputLines.push(text);
            },
            read: (x) => {
              if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles["files"][x] === undefined) {
                throw "File not found: '" + x + "'";
              }
              return window.Sk.builtinFiles["files"][x];
            }
          });
          try {
            window.Sk.importMainWithBody("<stdin>", false, preprocessedCode, true);
            const output = outputLines.join("");
            setConsoleOutput(output || "Process exited with code 0.");
          } catch (err) {
            setConsoleOutput("Runtime Error: " + err.toString());
          }
          setIsRunning(false);
          return;
        } else {
          // Fallback to client-side JS translation of Python code (runs offline/no-CDN/no-API-key)
          const logLines = [];
          const originalLog = console.log;
          console.log = (...args) => {
            logLines.push(args.join(" "));
          };
          try {
            const translatedJs = translatePythonToJS(code);
            Function(`"use strict"; ${translatedJs}`)();
            const output = logLines.join("\n");
            setConsoleOutput(output || "Process exited with code 0.");
          } catch (err) {
            setConsoleOutput("Runtime Error: " + err.message);
          } finally {
            console.log = originalLog;
            setIsRunning(false);
          }
          return;
        }
      }

      // 2. C/C++/Java Execution via Translation to JS
      const logLines = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logLines.push(args.join(" "));
      };

      try {
        const translatedJs = translateCPlusPlusJavaToJS(code, selectedLanguage);
        Function(`"use strict"; ${translatedJs}`)();
        const output = logLines.join("\n");
        setConsoleOutput(output || "Process exited with code 0 (No output produced).");
      } catch (err) {
        setConsoleOutput("Runtime Error: " + err.message);
      } finally {
        console.log = originalLog;
        setIsRunning(false);
      }
    }, 1000);
  };

  return (
    <div className="sandbox-page-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
      <Background />
      <Navbar 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
        showSidebarToggle={true} 
      />
      <DashboardSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main style={{ 
        flex: 1, 
        maxWidth: '1200px', 
        width: '100%', 
        margin: '0 auto', 
        padding: '120px 20px 60px 20px', 
        zIndex: 10,
        transition: 'padding-left 0.3s ease',
        paddingLeft: isSidebarOpen ? '280px' : '20px'
      }}>
        
        {/* Header Title */}
        <section style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ 
            fontFamily: "'Orbitron', sans-serif", 
            fontSize: '48px', 
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            background: 'linear-gradient(90deg, #00e5ff, #8a2eff)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            marginBottom: '20px' 
          }}>
            SkillSphere Online Sandbox
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '18px', 
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: '500',
            maxWidth: '700px', 
            margin: '0 auto', 
            lineHeight: '1.6' 
          }}>
            Experiment with code execution directly in your browser. Select a language below and press "Run Code" to compile and view terminal logs.
          </p>
        </section>

        {/* Editor & Terminal Widget */}
        <div style={{
          background: 'rgba(18, 18, 30, 0.75)',
          backdropFilter: 'blur(12px)',
          border: "1px solid var(--border-color)",
          borderRadius: '24px',
          padding: '30px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: '700', fontSize: '20px', color: 'var(--text-primary)', margin: 0 }}>Code Workspace</h3>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label htmlFor="sandbox-lang" style={{ fontSize: '15px', fontFamily: "'Rajdhani', sans-serif", fontWeight: '600', color: 'var(--text-secondary)' }}>Select Language:</label>
              <select 
                id="sandbox-lang"
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                style={{
                  background: 'rgba(18, 18, 30, 0.75)',
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  padding: '8px 16px',
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="python" style={{ fontFamily: "'Rajdhani', sans-serif", background: 'var(--bg-secondary)' }}>Python 3</option>
                <option value="cpp" style={{ fontFamily: "'Rajdhani', sans-serif", background: 'var(--bg-secondary)' }}>C++</option>
                <option value="c" style={{ fontFamily: "'Rajdhani', sans-serif", background: 'var(--bg-secondary)' }}>C</option>
                <option value="java" style={{ fontFamily: "'Rajdhani', sans-serif", background: 'var(--bg-secondary)' }}>Java</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
            
            {/* Editor Area */}
            <div style={{ position: 'relative' }}>
              <textarea
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                placeholder="Write your code here..."
                style={{
                  width: '100%',
                  height: '280px',
                  background: 'var(--bg-secondary)',
                  border: "1px solid var(--border-color)",
                  borderRadius: '16px',
                  padding: '20px',
                  color: '#39ff14',
                  fontFamily: 'Courier New, Courier, monospace',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  outline: 'none',
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.9)'
                }}
              />
              <div style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setEditorCode(languageTemplates[selectedLanguage])}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'var(--text-secondary)',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Reset Template
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  style={{
                    background: isRunning ? 'rgba(57, 255, 20, 0.3)' : 'rgba(57, 255, 20, 0.1)',
                    border: '1px solid #39ff14',
                    boxShadow: '0 0 10px rgba(57, 255, 20, 0.3)',
                    borderRadius: '8px',
                    color: '#39ff14',
                    padding: '8px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: "'Orbitron', sans-serif",
                    cursor: isRunning ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isRunning ? 'Running...' : 'Run Code 🚀'}
                </button>
              </div>
            </div>

            {/* Terminal Screen */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(0, 229, 255, 0.1)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                paddingBottom: '10px',
                marginBottom: '15px'
              }}>
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: '700', fontSize: '13px', color: '#00e5ff', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Terminal Output</span>
                <button
                  onClick={() => setConsoleOutput("")}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '13px',
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: '700',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Clear Console
                </button>
              </div>
              <pre style={{
                margin: 0,
                minHeight: '100px',
                color: consoleOutput.includes('Error') ? '#ef4444' : '#e2e8f0',
                fontFamily: 'Courier New, Courier, monospace',
                fontSize: '14px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {consoleOutput || 'Click "Run Code" to view execution output...'}
              </pre>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
