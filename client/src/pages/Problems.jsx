import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';

const Problems = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Fetch all problems on mount
  useEffect(() => {
    axios.get(backendUrl + '/api/problems')
      .then(res => setProblems(res.data.problems || []))
      .catch(() => setProblems([]));
  }, [backendUrl]);

  // Handler for delete (admin only)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/api/problems/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProblems(problems.filter(p => p._id !== id));
    } catch (err) {
      alert("Failed to delete problem.");
    }
  };

  // Filter problems by search
  const filteredProblems = problems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  // Difficulty badge color
  const getDifficultyBadge = (difficulty) => {
    if (difficulty === 'Easy')
      return 'bg-green-100 text-green-700 border border-green-400';
    if (difficulty === 'Medium')
      return 'bg-yellow-100 text-yellow-700 border border-yellow-400';
    return 'bg-red-100 text-red-700 border border-red-400';
  };

  return (
    <div className="p-8 max-w-3xl mx-auto relative">
      {/* Home button at top-left */}
      <div className="absolute left-0 top-0">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mt-2 ml-2"
          onClick={() => navigate('/')}
        >
          ← Home
        </button>
      </div>
      {/* Add Problem button at top-right (if admin) */}
      {userData?.isAdmin && (
        <div className="absolute right-0 top-0">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mt-2 mr-2"
            onClick={() => navigate('/add-problem')}
          >
            Add Problem
          </button>
        </div>
      )}
      {/* Main content */}
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 mt-6 text-center">Problems</h1>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Find problem..."
          className="mb-6 px-3 py-2 border rounded w-full"
        />
        <div className="space-y-4 w-full">
          {filteredProblems.length === 0 ? (
            <div className="text-gray-500 text-center">No problems found.</div>
          ) : (
            filteredProblems.map(p => (
              <div
                key={p._id}
                className="flex items-center justify-between p-4 bg-white rounded shadow hover:shadow-md transition"
              >
                <div>
                  <Link to={`/problems/${p._id}`} className="font-semibold text-indigo-700 hover:underline text-lg">
                    {p.title}
                  </Link>
                  <span
                    className={`ml-4 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${getDifficultyBadge(p.difficulty)}`}
                  >
                    {p.difficulty}
                  </span>
                </div>
                {userData?.isAdmin && (
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      onClick={() => navigate(`/edit-problem/${p._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;
