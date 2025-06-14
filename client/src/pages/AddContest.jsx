import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const defaultProblem = () => ({
  title: '',
  description: '',
  difficulty: 'Easy',
  testCases: [
    { input: '', output: '', isSample: false }
  ]
});

const AddContest = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    problems: [defaultProblem()]
  });
  const [loading, setLoading] = useState(false);

  if (!userData?.isAdmin) {
    return <div className="p-8 text-center text-red-600">Only admins can add contests.</div>;
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProblemChange = (idx, field, value) => {
    const updated = [...form.problems];
    updated[idx][field] = value;
    setForm({ ...form, problems: updated });
  };

  const handleTestCaseChange = (pIdx, tIdx, field, value) => {
    const updated = [...form.problems];
    updated[pIdx].testCases[tIdx][field] = value;
    setForm({ ...form, problems: updated });
  };

  const addProblem = () => setForm({ ...form, problems: [...form.problems, defaultProblem()] });
  const removeProblem = idx => setForm({ ...form, problems: form.problems.filter((_, i) => i !== idx) });

  const addTestCase = (pIdx) => {
    const updated = [...form.problems];
    updated[pIdx].testCases.push({ input: '', output: '', isSample: false });
    setForm({ ...form, problems: updated });
  };
  const removeTestCase = (pIdx, tIdx) => {
    const updated = [...form.problems];
    updated[pIdx].testCases = updated[pIdx].testCases.filter((_, i) => i !== tIdx);
    setForm({ ...form, problems: updated });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create all problems in the DB
      const problemIds = [];
      for (const prob of form.problems) {
        const { data } = await axios.post(`${backendUrl}/api/problems`, prob, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        problemIds.push(data.problem._id);
      }
      // 2. Create the contest with the new problem IDs
      await axios.post(`${backendUrl}/api/contests`, {
        name: form.name,
        description: form.description,
        startTime: form.startTime,
        endTime: form.endTime,
        problems: problemIds
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Contest created!');
      navigate('/contest');
    } catch (err) {
      alert('Error creating contest');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-lg shadow p-8">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">Add New Contest</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="name"
          placeholder="Contest Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />

        {/* Problems Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-indigo-700">Problems for this Contest:</span>
            <button type="button" className="px-3 py-1 bg-green-600 text-white rounded" onClick={addProblem}>
              + Add Problem
            </button>
          </div>
          {form.problems.map((prob, pIdx) => (
            <div key={pIdx} className="border rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Problem {pIdx + 1}</span>
                {form.problems.length > 1 && (
                  <button type="button" className="text-red-600" onClick={() => removeProblem(pIdx)}>
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Title"
                value={prob.title}
                onChange={e => handleProblemChange(pIdx, 'title', e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
                required
              />
              <textarea
                placeholder="Description"
                value={prob.description}
                onChange={e => handleProblemChange(pIdx, 'description', e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
                required
              />
              <select
                value={prob.difficulty}
                onChange={e => handleProblemChange(pIdx, 'difficulty', e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              {/* Test Cases */}
              <div className="mb-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Test Cases</span>
                  <button type="button" className="text-green-600" onClick={() => addTestCase(pIdx)}>
                    + Add Test Case
                  </button>
                </div>
                {prob.testCases.map((tc, tIdx) => (
                  <div key={tIdx} className="border rounded p-2 my-2">
                    <label className="block text-xs font-semibold">Input</label>
                    <textarea
                      className="w-full border rounded px-2 py-1 mb-1"
                      value={tc.input}
                      onChange={e => handleTestCaseChange(pIdx, tIdx, 'input', e.target.value)}
                      required
                    />
                    <label className="block text-xs font-semibold">Output</label>
                    <textarea
                      className="w-full border rounded px-2 py-1 mb-1"
                      value={tc.output}
                      onChange={e => handleTestCaseChange(pIdx, tIdx, 'output', e.target.value)}
                      required
                    />
                    <label className="inline-flex items-center mt-1">
                      <input
                        type="checkbox"
                        checked={tc.isSample}
                        onChange={e => handleTestCaseChange(pIdx, tIdx, 'isSample', e.target.checked)}
                        className="mr-2"
                      />
                      Sample Test Case
                    </label>
                    {prob.testCases.length > 1 && (
                      <button
                        type="button"
                        className="ml-2 text-red-500 text-xs"
                        onClick={() => removeTestCase(pIdx, tIdx)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-indigo-500 text-white rounded font-bold hover:bg-indigo-600 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Contest"}
        </button>
      </form>
    </div>
  );
};

export default AddContest;
