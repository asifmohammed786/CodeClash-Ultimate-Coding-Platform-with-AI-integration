import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiXCircle, FiArrowLeft, FiEdit2 } from 'react-icons/fi';
import Lottie from 'lottie-react';
import codeMascot from '../assets/code-mascot.json';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { backendUrl } = useContext(AppContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfile(data);
        setEditName(data.name);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to load profile');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [backendUrl, showEditModal]);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendUrl}/api/user/edit`, { name: editName }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success("Profile updated!");
      setShowEditModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    }
  };

  // For a LeetCode-style heatmap: show last 1 year, with month labels
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  if (loading) return <div className="text-center p-8">Loading profile...</div>;
  if (!profile) return <div className="text-center p-8">Profile not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Inline CSS for LeetCode-style heatmap */}
      <style>{`
        .react-calendar-heatmap {
          width: 100%;
          max-width: 760px;
          margin: 0 auto 1rem auto;
        }
        .react-calendar-heatmap .react-calendar-heatmap-week rect {
          rx: 3px;
          ry: 3px;
          stroke: #e5e7eb;
          stroke-width: 1;
        }
        .react-calendar-heatmap rect {
          width: 12px;
          height: 12px;
        }
        .react-calendar-heatmap text {
          font-size: 13px;
          font-weight: 600;
          fill: #333;
        }
        .react-calendar-heatmap .color-empty { fill: #f3f4f6; }
        .react-calendar-heatmap .color-github-1 { fill: #9be9a8; }
        .react-calendar-heatmap .color-github-2 { fill: #40c463; }
        .react-calendar-heatmap .color-github-3 { fill: #30a14e; }
        .react-calendar-heatmap .color-github-4 { fill: #216e39; }
        .react-calendar-heatmap .react-calendar-heatmap-month-label {
          font-size: 13px;
          font-weight: 700;
          fill: #222;
          letter-spacing: 1px;
        }
      `}</style>

      {/* Back Button */}
      <button
        className="flex items-center gap-2 px-4 py-2 mb-6 bg-gray-100 rounded hover:bg-gray-200 transition"
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft />
        Back
      </button>

      {/* Animated Mascot and Title */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="w-24 h-24 mb-2">
          <Lottie animationData={codeMascot} loop={true} />
        </div>
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-3xl font-extrabold text-indigo-800 drop-shadow-lg mb-2 text-center"
        >
          Profile
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-md text-gray-700 mb-2 text-center"
        >
          Code • Compete • Conquer
        </motion.p>
      </motion.div>

      {/* Profile Header with Edit */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 mb-8 bg-white p-6 rounded-lg shadow justify-between"
      >
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
            {profile.name[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
            <p className="text-gray-600 mt-1">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded font-semibold hover:bg-indigo-600 transition flex items-center gap-2"
          onClick={() => setShowEditModal(true)}
        >
          <FiEdit2 /> Edit Profile
        </button>
      </motion.div>

      {/* Stats Grid with animation */}
      <motion.div
        className="grid md:grid-cols-3 gap-6 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } }
        }}
      >
        <StatCard 
          title="Problems Solved" 
          value={profile.stats.totalSolved}
          color="bg-green-100"
        />
        <StatCard
          title="Easy Solved"
          value={profile.stats.easy}
          color="bg-green-100"
        />
        <StatCard
          title="Medium Solved"
          value={profile.stats.medium}
          color="bg-yellow-100"
        />
        <StatCard
          title="Hard Solved"
          value={profile.stats.hard}
          color="bg-red-100"
        />
      </motion.div>

      {/* LeetCode-style Activity Heatmap */}
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 rounded-lg shadow mb-8"
      >
        <h3 className="text-lg font-semibold mb-4">Activity Heatmap</h3>
        {profile.activity && Object.keys(profile.activity).length > 0 ? (
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={Object.entries(profile.activity).map(([date, count]) => ({
              date,
              count
            }))}
            showMonthLabels={true}
            showWeekdayLabels={false}
            gutterSize={3}
            classForValue={value => {
              if (!value || !value.count) return 'color-empty';
              if (value.count >= 4) return 'color-github-4';
              if (value.count === 3) return 'color-github-3';
              if (value.count === 2) return 'color-github-2';
              if (value.count === 1) return 'color-github-1';
              return 'color-empty';
            }}
            titleForValue={value =>
              value && value.date
                ? `${value.count} submission${value.count > 1 ? 's' : ''} on ${new Date(value.date).toLocaleDateString()}`
                : undefined
            }
          />
        ) : (
          <p className="text-gray-500 text-center py-4">No activity data yet</p>
        )}
      </motion.div>

      {/* Recent Submissions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {profile.recentSubmissions?.length > 0 ? profile.recentSubmissions.map((sub, i) => (
          <motion.div
            key={i}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className={`text-lg ${getVerdictColor(sub.verdict)}`}>
              {sub.verdict === 'Accepted' ? <FiCheckCircle /> : <FiXCircle />}
            </div>
            <div className="flex-1">
              <p className="font-medium">{sub.problem?.title || 'Unknown Problem'}</p>
              <p className="text-sm text-gray-500">
                {new Date(sub.timestamp).toLocaleString()}
              </p>
            </div>
            <span className="text-sm text-gray-500">{sub.verdict}</span>
          </motion.div>
        )) : (
          <p className="text-gray-500 text-center py-4">No recent submissions</p>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowEditModal(false)}
            >✕</button>
            <h2 className="text-xl font-bold mb-4 text-indigo-700">Edit Profile</h2>
            <form onSubmit={handleEditProfile}>
              <label className="block mb-2 font-semibold text-gray-700">Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mb-4"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-500 text-white rounded font-semibold hover:bg-indigo-600 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color = 'bg-indigo-100' }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.03 }}
    className={`p-6 rounded-lg ${color} shadow`}
  >
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </motion.div>
);

const getVerdictColor = (verdict) => {
  if (verdict === 'Accepted') return 'text-green-600';
  if (verdict === 'Wrong Answer') return 'text-red-600';
  return 'text-yellow-600';
};

export default Profile;
