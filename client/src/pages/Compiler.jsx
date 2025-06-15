import React, { useState, useContext, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { AppContext } from '../context/AppContext';

const starterTemplates = {
  cpp: `// Write C++ code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}`,
  java: `// Write Java code here\npublic class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}`,
  python: `# Write Python code here\ndef main():\n    # your code here\n    pass\n\nif __name__ == "__main__":\n    main()`
};

const CodeReviewer = ({ code, language, problem, backendUrl }) => {
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    setReview('');
    setShowReview(true);
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

      {showReview && (
        <div className="relative mt-3 p-3 bg-gray-100 rounded border text-black max-h-64 overflow-y-auto prose">
          <button
            onClick={() => setShowReview(false)}
            className="absolute top-1 right-2 text-black text-xl font-bold hover:text-red-600"
          >
            ×
          </button>
          <strong>AI Code Review:</strong>
          <ReactMarkdown>{review}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

const Compiler = ({
  problem,
  setUserCode,
  setLanguage: setParentLanguage,
  setLastFailCase,
  setLastFailOutput
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

  useEffect(() => {
    if (setUserCode) setUserCode(code);
  }, [code]);

  useEffect(() => {
    if (setParentLanguage) setParentLanguage(language);
  }, [language]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(starterTemplates[lang]);
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

    if (data.error) {
      // ✅ Time Limit Exceeded / Output Limit / Compilation / Runtime
      if (data.error.includes("Time Limit Exceeded")) {
        setVerdict("Time Limit Exceeded");
        setOutput("❗ Error: Time Limit Exceeded");
      } else if (data.error.includes("Output Limit Exceeded")) {
        setVerdict("Output Limit Exceeded");
        setOutput("❗ Error: Output Limit Exceeded");
      } else if (data.error.toLowerCase().includes("compilation")) {
        setVerdict("Compilation Error");
        setOutput(`❗ Compilation Error:\n${data.error}`);
      } else {
        setVerdict("Runtime Error");
        setOutput(`❗ Runtime Error:\n${data.error}`);
      }
    } else {
      setOutput(data.output || '');
    }

    if (setLastFailOutput) {
      setLastFailOutput(data.output || data.error || '');
    }

  } catch (err) {
    const errMsg = err.response?.data?.error || '❗ Unknown server error occurred';
    setOutput(`❗ Error: ${errMsg}`);
    setVerdict("Server Error");
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

      if (data.output?.includes("Time Limit Exceeded")) {
        setVerdict("Time Limit Exceeded");
      } else {
        setVerdict(data.verdict);
      }

      setErrorMsg(data.error || '');

      if (data.verdict !== 'Accepted' && setLastFailCase && setLastFailOutput) {
        setLastFailCase(data.failingTestCase || null);
        setLastFailOutput(data.error || data.output || '');
      }
    } catch (err) {
      const msg = err.response?.data?.error || '';
      setVerdict(err.response?.data?.verdict || 'Submission failed');
      setErrorMsg(msg);
      if (setLastFailOutput) setLastFailOutput(msg);
    }
    setSubmitLoading(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-[#18181b] to-[#23272f]">
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-orange-400 to-green-400" />
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

      <CodeReviewer
        code={code}
        language={language}
        problem={problem}
        backendUrl={backendUrl}
      />

      <div className="flex-1 min-h-[350px] max-h-[60vh] border-b border-gray-700 bg-[#1e1e1e]">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
          options={{
            fontSize: 16,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            fontWeight: '500',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-6 bg-[#23272f] text-gray-100">
        <div className="flex-1 space-y-4">
          <label className="font-bold text-indigo-300 uppercase tracking-wide">Custom Input</label>
          <textarea
            className="w-full h-24 p-2 border border-indigo-400 rounded bg-[#18181b] text-gray-100"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter custom input here"
          />
          <div className="flex gap-4">
            <button
              onClick={runCode}
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded"
              disabled={runLoading || submitLoading}
            >
              {runLoading ? 'Running...' : 'Run Code'}
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded"
              disabled={runLoading || submitLoading}
            >
              {submitLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <label className="font-bold text-indigo-300 uppercase tracking-wide">Output</label>
          <div className="bg-[#18181b] p-3 rounded text-green-200 border border-gray-700">
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>

          {verdict && (
            <div className={`p-3 rounded font-bold shadow border-2 ${
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
