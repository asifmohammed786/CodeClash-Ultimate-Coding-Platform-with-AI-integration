import React, { useState, useContext, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

// Starter code templates for each language
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

// Gemini Assistant Component
const GeminiAssistant = ({ code, problem, backendUrl }) => {
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setAiResponse('');
    try {
      const prompt = `Explain the following code:\n${code}\n\nProblem:\n${problem?.title}\n${problem?.description}`;
      const res = await axios.post(`${backendUrl}/api/ai/ask`, { prompt });
      setAiResponse(res.data.text);
    } catch (err) {
      setAiResponse("Error: " + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="my-4">
      <button
        onClick={handleAsk}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Asking Gemini..." : "Ask Gemini AI"}
      </button>
      {aiResponse && (
        <div className="mt-3 p-3 bg-gray-100 rounded border text-black max-h-64 overflow-y-auto">
          <strong>Gemini AI:</strong>
          <pre className="whitespace-pre-wrap">{aiResponse}</pre>
        </div>
      )}
    </div>
  );
};

// AI Code Reviewer Component
const CodeReviewer = ({ code, language, problem, backendUrl }) => {
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    setReview('');
    try {
      const res = await axios.post(`${backendUrl}/api/ai/review`, {
        code,
        language,
        problem: { title: problem?.title }
      });
      setReview(res.data.text);
    } catch (err) {
      setReview("Error: " + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="my-4">
      <button
        onClick={handleReview}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        {loading ? "Reviewing..." : "Review My Code"}
      </button>
      {review && (
        <div className="mt-3 p-3 bg-gray-100 rounded border text-black max-h-64 overflow-y-auto">
          <strong>AI Code Review:</strong>
          <pre className="whitespace-pre-wrap">{review}</pre>
        </div>
      )}
    </div>
  );
};

const Compiler = ({
  problem,
  setUserCode,        // callback from parent to track latest code
  setLanguage: setParentLanguage, // callback from parent to track language
  setLastFailCase,    // callback from parent to track failing test case
  setLastFailOutput   // callback from parent to track user's output/error
}) => {
  const { backendUrl } = useContext(AppContext);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(starterTemplates['cpp']);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [verdict, setVerdict] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Keep parent in sync for AI Bug Finder
  useEffect(() => {
    if (setUserCode) setUserCode(code);
  }, [code, setUserCode]);
  useEffect(() => {
    if (setParentLanguage) setParentLanguage(language);
  }, [language, setParentLanguage]);

  // Update code template when language changes
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(starterTemplates[lang]);
    if (setParentLanguage) setParentLanguage(lang);
  };

  const runCode = async () => {
    setRunLoading(true);
    setOutput('');
    setVerdict('');
    setErrorMsg('');
    try {
      const { data } = await axios.post(`${backendUrl}/api/compiler/execute`, {
        code,
        input,
        language
      });
      setOutput(data.output);
      if (setLastFailOutput) setLastFailOutput(data.output);
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Compilation error';
      setOutput(errMsg);
      if (setLastFailOutput) setLastFailOutput(errMsg);
    }
    setRunLoading(false);
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setVerdict('');
    setErrorMsg('');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${backendUrl}/api/compiler/submit`, {
        code,
        problemId: problem?._id,
        language
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVerdict(data.verdict);
      setErrorMsg(data.error || '');
      if (data.verdict !== 'Accepted' && setLastFailCase && setLastFailOutput) {
        setLastFailCase(data.failingTestCase || null); // expects backend to send this
        setLastFailOutput(data.error || data.output || '');
      }
    } catch (err) {
      setVerdict(err.response?.data?.verdict || 'Submission failed');
      setErrorMsg(err.response?.data?.error || '');
      if (setLastFailOutput) setLastFailOutput(err.response?.data?.error || '');
    }
    setSubmitLoading(false);
  };

  return (
    <div className="flex flex-col h-full w-full p-0 bg-gradient-to-br from-[#18181b] to-[#23272f]">
      {/* Brand Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-orange-400 to-green-400" />
      {/* Language Dropdown */}
      <div className="flex items-center gap-4 px-4 py-2 bg-[#23272f] border-b border-gray-700">
        <label className="font-bold text-indigo-300">Language:</label>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="border rounded px-2 py-1 bg-[#18181b] text-white"
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>
      
      {/* AI Code Reviewer */}
      <CodeReviewer code={code} language={language} problem={problem} backendUrl={backendUrl} />
      {/* Editor Panel */}
      <div className="flex-1 min-h-[350px] max-h-[60vh] border-b border-gray-700 bg-[#1e1e1e] shadow-lg">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontFamily: 'Fira Mono, Menlo, monospace',
            fontWeight: 'bold',
          }}
        />
      </div>
      {/* Controls and Output */}
      <div className="flex flex-col md:flex-row gap-6 p-6 bg-[#23272f] text-gray-100">
        <div className="flex-1 space-y-4">
          <label className="block mb-1 font-bold text-indigo-300 uppercase tracking-wide">Custom Input</label>
          <textarea
            className="w-full h-24 p-2 border border-indigo-400 rounded bg-[#18181b] text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter custom input here"
          />
          <div className="flex gap-4 mt-2">
            <button
              onClick={runCode}
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded shadow transition"
              disabled={runLoading || submitLoading}
            >
              {runLoading ? 'Running...' : 'Run Code'}
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded shadow transition"
              disabled={runLoading || submitLoading}
            >
              {submitLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <label className="block mb-1 font-bold text-indigo-300 uppercase tracking-wide">Output</label>
          <div className="bg-[#18181b] p-3 rounded min-h-[48px] text-green-200 border border-gray-700 shadow-inner">
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
          {verdict && (
            <div className={`p-3 rounded font-bold mt-2 shadow border-2 ${
              verdict === 'Accepted' ? 'bg-green-700 text-green-100 border-green-400' :
              verdict === 'Wrong Answer' ? 'bg-red-700 text-red-100 border-red-400' :
              'bg-yellow-700 text-yellow-100 border-yellow-400'
            }`}>
              Verdict: {verdict}
              {errorMsg && (
                <pre className="mt-2 text-xs whitespace-pre-wrap text-white">{errorMsg}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compiler;
