import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import Compiler from './Compiler';
import SubmissionHistory from './SubmissionHistory';

const ProblemDetails = () => {
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [tab, setTab] = useState('description');

  useEffect(() => {
    axios.get(`${backendUrl}/api/problems/${id}`)
      .then(res => setProblem(res.data.problem))
      .catch(() => setProblem(null));
  }, [backendUrl, id]);

  if (!problem) return <div className="p-8">Loading...</div>;

  const getDifficultyBadge = (difficulty) => {
    if (difficulty === 'Easy')
      return 'bg-green-100 text-green-700 border border-green-400';
    if (difficulty === 'Medium')
      return 'bg-yellow-100 text-yellow-700 border border-yellow-400';
    return 'bg-red-100 text-red-700 border border-red-400';
  };

  // Filter sample test cases
  const sampleTestCases = problem.testCases?.filter(tc => tc.isSample);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left: Problem Info and Tabs */}
      <div className="w-full md:w-1/2 border-r bg-white overflow-y-auto">
        {/* Back Button with divider */}
        <div className="p-4 pb-0 bg-white sticky top-0 z-20">
          <button
            onClick={() => navigate('/problems')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-indigo-700 font-bold hover:bg-indigo-50 active:bg-indigo-100 transition"
            style={{ boxShadow: '0 1px 4px rgba(99,102,241,0.04)' }}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Problems
          </button>
          {/* Divider */}
          <div className="mt-4 mb-2 border-b border-gray-200" />
          {/* Tabs */}
          <div className="flex border-b bg-white">
            <button
              onClick={() => setTab('description')}
              className={`px-4 py-2 font-semibold transition ${
                tab === 'description'
                  ? 'border-b-2 border-indigo-600 text-indigo-700'
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setTab('submissions')}
              className={`px-4 py-2 font-semibold transition ${
                tab === 'submissions'
                  ? 'border-b-2 border-indigo-600 text-indigo-700'
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              Submissions
            </button>
          </div>
        </div>
        {/* Tab Content */}
        <div className="p-6">
          {tab === 'description' && (
            <>
              <h2 className="text-2xl font-extrabold mb-2 text-indigo-700">{problem.title}</h2>
              <div className="mb-4 text-gray-800 whitespace-pre-line text-lg">{problem.description}</div>
              <div className="mb-4 flex items-center gap-2">
                <span className="font-semibold text-gray-600">Difficulty:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getDifficultyBadge(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </div>
              {/* Sample Test Cases */}
              {sampleTestCases && sampleTestCases.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-indigo-700 mb-4">Sample Test Cases</h3>
                  {sampleTestCases.map((tc, idx) => (
                    <div key={idx} className="mb-6">
                      <div className="font-semibold text-indigo-600 mb-1">Sample {idx + 1}</div>
                      <div className="bg-gray-50 p-3 rounded mb-2">
                        <span className="font-bold">Input:</span>
                        <pre className="whitespace-pre-wrap mt-1">{tc.input}</pre>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <span className="font-bold">Output:</span>
                        <pre className="whitespace-pre-wrap mt-1">{tc.output}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {tab === 'submissions' && (
            <SubmissionHistory problemId={problem._id} />
          )}
        </div>
      </div>
      {/* Right: Code Editor */}
      <div className="w-full md:w-1/2 bg-[#18181b] flex flex-col">
        <Compiler problem={problem} />
      </div>
    </div>
  );
};

export default ProblemDetails;
