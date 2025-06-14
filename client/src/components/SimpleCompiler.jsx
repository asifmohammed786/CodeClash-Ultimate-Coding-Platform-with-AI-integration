import React, { useState, useContext } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const starterTemplates = {
  cpp: `// Write C++ code here
#include <iostream>
using namespace std;

int main() {
    // your code here
    return 0;
}`,
  java: `// Write Java code here
public class Main {
    public static void main(String[] args) {
        // your code here
    }
}`,
  python: `# Write Python code here
def main():
    # your code here
    pass

if __name__ == "__main__":
    main()`
};

const SimpleCompiler = () => {
  const { backendUrl } = useContext(AppContext);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(starterTemplates["cpp"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(starterTemplates[lang]);
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      const { data } = await axios.post(`${backendUrl}/api/compiler/execute`, {
        code,
        input,
        language,
      });
      setOutput(data.output);
    } catch (err) {
      setOutput(err.response?.data?.error || "Compilation error");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-start min-h-[90vh] w-full bg-gray-100 py-8">
      <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">Try Code Instantly</h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Code Editor and Language Selector */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-4 mb-2">
              <label className="font-bold text-indigo-500">Language:</label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="border rounded px-2 py-1"
              >
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
            </div>
            <div className="rounded-lg border border-indigo-300 overflow-hidden mb-4" style={{ minHeight: "350px", height: "50vh" }}>
              <Editor
                height="100%"
                width="100%"
                language={language === "cpp" ? "cpp" : language}
                value={code}
                onChange={value => setCode(value ?? "")}
                options={{
                  fontSize: 16,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontFamily: "Fira Mono, Menlo, monospace",
                  fontWeight: "bold",
                  readOnly: false,
                  wordWrap: "on",
                }}
                theme="vs-dark"
              />
            </div>
          </div>
          {/* Input/Output Panel */}
          <div className="flex-1 flex flex-col">
            <label className="block mb-1 font-bold text-indigo-500">Custom Input</label>
            <textarea
              className="w-full h-24 p-2 border border-indigo-300 rounded mb-4 font-mono"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter custom input"
              spellCheck={false}
            />
            <button
              onClick={runCode}
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded shadow transition mb-4"
              disabled={loading}
            >
              {loading ? "Running..." : "Run Code"}
            </button>
            <label className="block mb-1 font-bold text-indigo-500">Output</label>
            <div className="bg-gray-100 p-3 rounded min-h-[48px] text-green-700 border border-gray-300 shadow-inner h-32 overflow-auto">
              <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCompiler;
