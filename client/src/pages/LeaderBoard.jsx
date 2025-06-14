import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/users/leaderboard`);
        setUsers(data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-center p-8">Loading leaderboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <button
        className="flex items-center gap-2 px-4 py-2 mb-6 bg-gray-100 rounded hover:bg-gray-200 transition"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <h1 className="text-3xl font-bold bg-indigo-600 text-white p-6">Leaderboard</h1>
        
        <div className="p-6">
          <div className="grid grid-cols-5 gap-4 font-semibold border-b pb-2 mb-2">
            <div>Rank</div>
            <div className="col-span-2">User</div>
            <div>Total Solved</div>
            <div>Breakdown</div>
          </div>

          {users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-5 gap-4 p-4 ${
                userData?.userId === user._id ? 'bg-indigo-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-bold">#{index + 1}</div>
              <div className="col-span-2 flex items-center">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-3">
                  {user.name[0]}
                </div>
                {user.name}
              </div>
              <div className="text-2xl font-bold text-indigo-600">
                {user.totalSolved || 0}
              </div>
              <div className="flex gap-2">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                  {user.problemsSolved?.easy || 0}E
                </span>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
                  {user.problemsSolved?.medium || 0}M
                </span>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                  {user.problemsSolved?.hard || 0}H
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
