import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';

const Problems = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/problems`);
        setProblems(data.problems || []);
      } catch (err) {
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [backendUrl]);

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

  const filteredProblems = problems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const getDifficultyBadge = (difficulty) => {
    if (difficulty === 'Easy')
      return 'bg-green-100 text-green-700 border border-green-400';
    if (difficulty === 'Medium')
      return 'bg-yellow-100 text-yellow-700 border border-yellow-400';
    return 'bg-red-100 text-red-700 border border-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white relative px-4">
      {/* Home button */}
      <div className="absolute left-0 top-0 m-4 z-10">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 shadow"
          onClick={() => navigate('/')}
        >
          ← Home
        </button>
      </div>

      {/* Add Problem button */}
      {userData?.isAdmin && (
        <div className="absolute right-0 top-0 m-4 z-10">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 shadow"
            onClick={() => navigate('/add-problem')}
          >
            Add Problem
          </button>
        </div>
      )}

      <div className="flex flex-col items-center pt-20 pb-12 max-w-2xl mx-auto transition-all duration-300">
        <h1 className="text-4xl font-bold mb-8 text-center drop-shadow-lg">Problems</h1>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Find problem..."
          className="mb-8 px-4 py-2 border border-indigo-200 rounded w-full shadow focus:ring-2 focus:ring-indigo-300"
        />

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-500 border-solid"></div>
            <span className="ml-4 text-indigo-600 font-medium">Loading problems...</span>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-gray-500 text-center animate-pulse">No problems found.</div>
        ) : (
          <div className="space-y-4 w-full">
            {filteredProblems.map(p => (
              <div
                key={p._id}
                className="flex items-center justify-between p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-indigo-100"
              >
                <div>
                  <Link
                    to={`/problems/${p._id}`}
                    className="font-bold text-lg text-indigo-700 hover:underline"
                  >
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;
