import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditProblem = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${backendUrl}/api/problems/${id}`)
      .then(res => {
        const p = res.data.problem;
        setTitle(p.title);
        setDescription(p.description);
        setDifficulty(p.difficulty);
        setTestCases(p.testCases.length ? p.testCases : [{ input: '', output: '' }]);
      });
  }, [backendUrl, id]);

  const handleTestCaseChange = (idx, field, value) => {
    const updated = [...testCases];
    updated[idx][field] = value;
    setTestCases(updated);
  };

  const addTestCase = () => setTestCases([...testCases, { input: '', output: '' }]);
  const removeTestCase = idx => setTestCases(testCases.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.patch(
        `${backendUrl}/api/problems/${id}`,
        { title, description, difficulty, testCases },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        navigate('/problems');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to update problem.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Edit Problem</h2>
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

        <label className="block mb-2 font-semibold">Test Cases</label>
        {testCases.map((tc, idx) => (
          <div key={idx} className="mb-4 flex gap-2 items-center">
            <input
              className="flex-1 p-2 border rounded"
              placeholder="Input"
              value={tc.input}
              onChange={e => handleTestCaseChange(idx, 'input', e.target.value)}
              required
            />
            <input
              className="flex-1 p-2 border rounded"
              placeholder="Output"
              value={tc.output}
              onChange={e => handleTestCaseChange(idx, 'output', e.target.value)}
              required
            />
            {testCases.length > 1 && (
              <button type="button" onClick={() => removeTestCase(idx)} className="text-red-500">Remove</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addTestCase} className="mb-4 px-2 py-1 bg-blue-200 rounded">Add Test Case</button>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProblem;
