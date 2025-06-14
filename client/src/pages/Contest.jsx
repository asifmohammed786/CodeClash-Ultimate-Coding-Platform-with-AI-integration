import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import contestLottie from '../assets/contest-lottie.json';



const Contest = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState("");
  const [deleting, setDeleting] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${backendUrl}/api/contests`)
      .then(res => setContests(res.data))
      .finally(() => setLoading(false));
  }, [backendUrl]);

  const handleRegister = async (contestId) => {
    setRegistering(contestId);
    await axios.post(`${backendUrl}/api/contests/${contestId}/register`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setRegistering("");
    alert("Registered successfully!");
  };

  const handleDelete = async (contestId) => {
    if (!window.confirm("Are you sure you want to delete this contest?")) return;
    setDeleting(contestId);
    try {
      await axios.delete(`${backendUrl}/api/contests/${contestId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setContests(contests.filter(c => c._id !== contestId));
      alert("Contest deleted!");
    } catch (err) {
      alert("Failed to delete contest.");
    }
    setDeleting("");
  };

  if (loading) return <div className="text-center p-8">Loading contests...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <button
        className="absolute top-6 left-6 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="flex flex-col items-center mt-16"
      >
        <div className="w-40 h-40 mb-2">
          <Lottie animationData={contestLottie} loop={true} />
        </div>
        <h1 className="text-4xl font-extrabold text-indigo-800 drop-shadow-lg mb-2 text-center">
          Contests
        </h1>
        <p className="text-lg text-gray-700 mb-4 text-center">
          Compete, climb the leaderboard, and win prizes!
        </p>
      </motion.div>
      {/* List of contests */}
      <div className="w-full max-w-2xl mt-6">
        {contests.map(contest => (
          <motion.div
            key={contest._id}
            className="bg-white shadow rounded-lg p-6 mb-6 flex flex-col gap-2 cursor-pointer hover:bg-indigo-50 transition"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/contest/${contest._id}`)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-indigo-700">{contest.name}</h2>
                <p className="text-gray-600">{contest.description}</p>
                <div className="text-sm text-gray-500">
                  {new Date(contest.startTime).toLocaleString()} — {new Date(contest.endTime).toLocaleString()}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button
                  className="px-4 py-2 bg-indigo-500 text-white rounded font-bold hover:bg-indigo-600 transition"
                  onClick={e => {
                    e.stopPropagation();
                    handleRegister(contest._id);
                  }}
                  disabled={registering === contest._id || contest.registeredUsers.includes(userData.userId)}
                >
                  {contest.registeredUsers.includes(userData.userId)
                    ? 'Registered'
                    : registering === contest._id
                      ? 'Registering...'
                      : 'Register'}
                </button>
                {userData?.isAdmin && (
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-bold mt-2"
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(contest._id);
                    }}
                    disabled={deleting === contest._id}
                  >
                    {deleting === contest._id ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {contests.length === 0 && (
          <div className="text-center text-gray-500 mt-10 text-xl">No contests yet. Stay tuned!</div>
        )}
      </div>
    </div>
  );
};

export default Contest;
