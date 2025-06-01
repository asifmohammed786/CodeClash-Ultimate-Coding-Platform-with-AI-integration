import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProblem = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  // Separate state for sample and hidden test cases
  const [sampleTestCases, setSampleTestCases] = useState([{ input: '', output: '' }]);
  const [hiddenTestCases, setHiddenTestCases] = useState([{ input: '', output: '' }]);
  const [loading, setLoading] = useState(false);

  // Handlers for sample test cases
  const handleSampleChange = (idx, field, value) => {
    const updated = [...sampleTestCases];
    updated[idx][field] = value;
    setSampleTestCases(updated);
  };
  const addSample = () => setSampleTestCases([...sampleTestCases, { input: '', output: '' }]);
  const removeSample = idx => setSampleTestCases(sampleTestCases.filter((_, i) => i !== idx));

  // Handlers for hidden test cases
  const handleHiddenChange = (idx, field, value) => {
    const updated = [...hiddenTestCases];
    updated[idx][field] = value;
    setHiddenTestCases(updated);
  };
  const addHidden = () => setHiddenTestCases([...hiddenTestCases, { input: '', output: '' }]);
  const removeHidden = idx => setHiddenTestCases(hiddenTestCases.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Merge both arrays with isSample flag
      const testCases = [
        ...sampleTestCases.filter(tc => tc.input && tc.output).map(tc => ({ ...tc, isSample: true })),
        ...hiddenTestCases.filter(tc => tc.input && tc.output).map(tc => ({ ...tc, isSample: false })),
      ];
      const { data } = await axios.post(
        backendUrl + '/api/problems',
        { title, description, difficulty, testCases },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        navigate('/problems');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to add problem.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Add New Problem</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Title</label>
        <input
          className="w-full mb-4 p-2 border rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          className="w-full mb-4 p-2 border rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={5}
          required
        />

        <label className="block mb-2 font-semibold">Difficulty</label>
        <select
          className="w-full mb-4 p-2 border rounded"
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        {/* Sample Test Cases */}
        <label className="block mb-2 font-semibold text-green-700">Sample Test Cases (Visible to user)</label>
        {sampleTestCases.map((tc, idx) => (
          <div key={idx} className="mb-4 flex gap-2 items-center">
            <textarea
              className="flex-1 p-2 border rounded"
              placeholder="Sample Input"
              value={tc.input}
              onChange={e => handleSampleChange(idx, 'input', e.target.value)}
              rows={3}
              required
            />
            <input
              className="flex-1 p-2 border rounded"
              placeholder="Sample Output"
              value={tc.output}
              onChange={e => handleSampleChange(idx, 'output', e.target.value)}
              required
            />
            {sampleTestCases.length > 1 && (
              <button type="button" onClick={() => removeSample(idx)} className="text-red-500">Remove</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addSample} className="mb-4 px-2 py-1 bg-green-200 rounded">Add Sample Test Case</button>

        {/* Hidden Test Cases */}
        <label className="block mb-2 font-semibold text-orange-700 mt-6">Hidden Test Cases (Not shown to user)</label>
        {hiddenTestCases.map((tc, idx) => (
          <div key={idx} className="mb-4 flex gap-2 items-center">
            <textarea
              className="flex-1 p-2 border rounded"
              placeholder="Hidden Input"
              value={tc.input}
              onChange={e => handleHiddenChange(idx, 'input', e.target.value)}
              rows={3}
              required
            />
            <input
              className="flex-1 p-2 border rounded"
              placeholder="Hidden Output"
              value={tc.output}
              onChange={e => handleHiddenChange(idx, 'output', e.target.value)}
              required
            />
            {hiddenTestCases.length > 1 && (
              <button type="button" onClick={() => removeHidden(idx)} className="text-red-500">Remove</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addHidden} className="mb-4 px-2 py-1 bg-orange-200 rounded">Add Hidden Test Case</button>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Problem"}
        </button>
      </form>
    </div>
  );
};

export default AddProblem;
