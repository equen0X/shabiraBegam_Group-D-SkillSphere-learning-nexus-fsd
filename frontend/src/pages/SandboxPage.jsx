import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Background from "../components/Background";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";

export default function SandboxPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const languageTemplates = {
    python: `# Python 3 execution sandbox\ndef greet(name):\n    return f"Hello, {name}! Welcome to SkillSphere."\n\nprint(greet("Student"))`,
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

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput("Compiling and executing code...");

    setTimeout(() => {
      let output = "";
      const code = editorCode;

      if (selectedLanguage === "python") {
        const printRegex = /print\((['"])(.*?)\1\)/g;
        let match;
        const matches = [];
        while ((match = printRegex.exec(code)) !== null) {
          matches.push(match[2]);
        }
        if (matches.length > 0) {
          output = matches.join("\n");
        } else {
          output = "Process exited with code 0 (No output produced).";
        }
      } else if (selectedLanguage === "cpp") {
        const coutRegex = /cout\s*<<\s*(['"])(.*?)\1/g;
        let match;
        const matches = [];
        while ((match = coutRegex.exec(code)) !== null) {
          matches.push(match[2]);
        }
        if (matches.length > 0) {
          output = matches.join("\n");
        } else {
          output = "Process exited with code 0 (No output produced).";
        }
      } else if (selectedLanguage === "c") {
        const printfRegex = /printf\((['"])(.*?)\\n?\1\)/g;
        let match;
        const matches = [];
        while ((match = printfRegex.exec(code)) !== null) {
          matches.push(match[2]);
        }
        if (matches.length > 0) {
          output = matches.join("\n");
        } else {
          output = "Process exited with code 0 (No output produced).";
        }
      } else if (selectedLanguage === "java") {
        const javaRegex = /System\.out\.println\((['"])(.*?)\1\)/g;
        let match;
        const matches = [];
        while ((match = javaRegex.exec(code)) !== null) {
          matches.push(match[2]);
        }
        if (matches.length > 0) {
          output = matches.join("\n");
        } else {
          output = "Process exited with code 0 (No output produced).";
        }
      }

      setConsoleOutput(output);
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="sandbox-page-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0b10', color: '#ffffff' }}>
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
            color: '#94a3b8', 
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
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
          padding: '30px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: '700', fontSize: '20px', color: '#ffffff', margin: 0 }}>Code Workspace</h3>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label htmlFor="sandbox-lang" style={{ fontSize: '15px', fontFamily: "'Rajdhani', sans-serif", fontWeight: '600', color: '#94a3b8' }}>Select Language:</label>
              <select 
                id="sandbox-lang"
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                style={{
                  background: 'rgba(18, 18, 30, 0.75)',
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  padding: '8px 16px',
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="python" style={{ fontFamily: "'Rajdhani', sans-serif", background: '#0d0e15' }}>Python 3</option>
                <option value="cpp" style={{ fontFamily: "'Rajdhani', sans-serif", background: '#0d0e15' }}>C++</option>
                <option value="c" style={{ fontFamily: "'Rajdhani', sans-serif", background: '#0d0e15' }}>C</option>
                <option value="java" style={{ fontFamily: "'Rajdhani', sans-serif", background: '#0d0e15' }}>Java</option>
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
                  background: '#0d0e15',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
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
                    color: '#94a3b8',
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
              background: '#040508',
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
