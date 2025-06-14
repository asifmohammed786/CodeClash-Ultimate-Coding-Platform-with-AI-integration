import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import codeMascot from '../assets/code-mascot.json'

const Home = () => {
  const { userData } = useContext(AppContext)
  const navigate = useNavigate()

  // If not logged in, redirect to login
  if (!userData) {
    navigate('/login')
    return null
  }

  return (
    <div className='flex flex-col items-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <Navbar />
      <Header />

      {/* Animated Mascot and Welcome */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        className="flex flex-col items-center mt-10"
      >
        <div className="w-32 h-32 mb-2">
          <Lottie animationData={codeMascot} loop={true} />
        </div>
        <motion.div
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-3xl font-extrabold text-black drop-shadow-lg mb-2 text-center"
        >
          Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-orange-500">CodeClash!</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg text-gray-700 mb-4 text-center"
        >
          Code • Compete • Conquer
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-orange-400 text-white text-lg font-bold rounded-full shadow-lg hover:from-indigo-600 hover:to-orange-500 transition mb-4"
          onClick={() => navigate('/problems')}
        >
          Get Started
        </motion.button>
      </motion.div>

      {/* Blocks Section with animated entrance */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 px-4 w-full max-w-5xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 }
          }
        }}
      >
        {/* Problems Block */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          className="bg-white bg-opacity-90 shadow-xl rounded-lg p-6 text-center hover:scale-105 hover:bg-indigo-50 transition-transform cursor-pointer border-2 border-indigo-200"
          onClick={() => navigate('/problems')}
        >
          <h3 className="text-xl font-extrabold mb-2 text-indigo-700 flex items-center justify-center gap-2">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="4" fill="#6366F1"/>
              <text x="12" y="17" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="monospace">{'<>'}</text>
            </svg>
            Problems
          </h3>
          <p className="text-gray-700">Browse and solve coding problems from various topics.</p>
        </motion.div>
        {/* Contests Block */}
        <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="bg-white bg-opacity-90 shadow-xl rounded-lg p-6 text-center hover:scale-105 hover:bg-orange-50 transition-transform cursor-pointer border-2 border-orange-200"
                onClick={() => navigate('/contest')}
              >
                <h3 className="text-xl font-extrabold mb-2 text-orange-600 flex items-center justify-center gap-2">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <rect x="4" y="4" width="16" height="16" rx="4" fill="#f59e42"/>
                    <text x="12" y="17" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="monospace">⚡️</text>
                  </svg>
                  Contests
                </h3>
                <p className="text-gray-700">Participate in live and virtual coding contests.</p>
              </motion.div>

        {/* Leaderboard Block - Now Active */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          className="bg-white bg-opacity-90 shadow-xl rounded-lg p-6 text-center hover:scale-105 hover:bg-green-50 transition-transform cursor-pointer border-2 border-green-200"
          onClick={() => navigate('/leaderboard')}
        >
          <h3 className="text-xl font-extrabold mb-2 text-green-700 flex items-center justify-center gap-2">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="4" fill="#22C55E"/>
              <text x="12" y="17" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="monospace">🏆</text>
            </svg>
            Leaderboard
          </h3>
          <p className="text-gray-700">See top performers and your ranking.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Home
