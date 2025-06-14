import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ContestLive = () => {
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [started, setStarted] = useState(false);
  const [loadingProblems, setLoadingProblems] = useState(false);

  // Timer update
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch contest and associated problems
  useEffect(() => {
    axios.get(`${backendUrl}/api/contests/${id}`)
      .then(res => {
        setContest(res.data);
        if (res.data.problems?.length > 0) {
          setLoadingProblems(true);
          axios.get(`${backendUrl}/api/problems?ids=${res.data.problems.join(',')}`)
            .then(pRes => {
              if (pRes.data?.problems) {
                setProblems(pRes.data.problems);
              }
            })
            .catch(err => {
              console.error('Error fetching contest problems:', err);
              setProblems([]);
            })
            .finally(() => setLoadingProblems(false));
        }
      })
      .catch(err => {
        console.error('Error fetching contest:', err);
        navigate('/contest');
      });
  }, [backendUrl, id, navigate]);

  if (!contest) return <div className="p-8">Loading contest...</div>;

  const startTime = new Date(contest.startTime).getTime();
  const endTime = new Date(contest.endTime).getTime();
  const isBefore = now < startTime;
  const isDuring = now >= startTime && now < endTime;
  const isAfter = now >= endTime;

  const getCountdown = (to) => {
    const diff = to - now;
    if (diff <= 0) return "00:00:00";
    return [
      Math.floor(diff / 3600000),        // hours
      Math.floor((diff % 3600000) / 60000),  // minutes
      Math.floor((diff % 60000) / 1000)     // seconds
    ].map(v => String(v).padStart(2, '0')).join(':');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header section */}
        <motion.h1 className="text-3xl font-bold text-indigo-700 mb-2">
          {contest.name}
        </motion.h1>
        <div className="mb-4 text-gray-700">{contest.description}</div>
        
        {/* Time indicators */}
        <div className="flex items-center gap-4 mb-6 text-sm md:text-base">
          <div className="flex items-center gap-1">
            <span className="font-semibold">Start:</span>
            {new Date(contest.startTime).toLocaleString()}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">End:</span>
            {new Date(contest.endTime).toLocaleString()}
          </div>
        </div>

        {/* Contest state management */}
        {isBefore && (
          <div className="mb-6">
            <div className="text-xl font-bold text-orange-600 mb-2">Contest starts in:</div>
            <div className="text-3xl font-mono text-indigo-700">{getCountdown(startTime)}</div>
            <button className="mt-4 px-6 py-2 bg-gray-400 text-white rounded font-bold cursor-not-allowed" disabled>
              Start Contest
            </button>
          </div>
        )}

        {isDuring && (
          <div className="mb-6">
            <div className="text-xl font-bold text-green-600 mb-2">Contest Live!</div>
            <div className="text-3xl font-mono text-indigo-700">Time left: {getCountdown(endTime)}</div>
            <button
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 transition"
              onClick={() => setStarted(true)}
              disabled={started}
            >
              {started ? "Contest In Progress" : "Start Contest"}
            </button>
          </div>
        )}

        {isAfter && (
          <div className="mb-6">
            <div className="text-xl font-bold text-red-600 mb-2">Contest Ended</div>
            <div className="text-3xl font-mono text-gray-500">00:00:00</div>
          </div>
        )}

        {/* Problems list */}
        {started && isDuring && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Problems</h2>
            {loadingProblems ? (
              <div className="text-center p-4">Loading problems...</div>
            ) : problems.length === 0 ? (
              <div className="text-center text-gray-500">No problems available for this contest</div>
            ) : (
              <ul>
                {problems.map((prob, idx) => (
                  <li key={prob._id} className="mb-6 border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-lg text-indigo-700">Problem {idx + 1}:</span>
                      <span className="font-semibold">{prob.title}</span>
                      <span className={`text-xs px-2 py-1 rounded ${{
                        'Easy': 'bg-green-100 text-green-800',
                        'Medium': 'bg-yellow-100 text-yellow-800',
                        'Hard': 'bg-red-100 text-red-800'
                      }[prob.difficulty]}`}>
                        {prob.difficulty}
                      </span>
                    </div>
                    <div className="mb-2 text-gray-800 whitespace-pre-line">{prob.description}</div>
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      onClick={() => navigate(`/problems/${prob._id}`)}
                    >
                      Solve Now
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ContestLive;
