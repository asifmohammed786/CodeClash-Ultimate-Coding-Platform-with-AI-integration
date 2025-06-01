import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { AppContext } from '../context/AppContext'

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

      {/* Welcome message */}
      <div className="mt-8 text-2xl font-bold text-black drop-shadow-lg">
        {/* You can personalize this message if you want */}
      </div>

      {/* Blocks Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 px-4 w-full max-w-5xl">
        {/* Problems Block - Now a clickable card */}
        <div
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
        </div>
        {/* Contests Block - Coming Soon */}
        <div
          className="bg-white bg-opacity-60 shadow-xl rounded-lg p-6 text-center border-2 border-orange-200 cursor-not-allowed relative"
          style={{ pointerEvents: 'none', filter: 'grayscale(0.2)' }}
        >
          <h3 className="text-xl font-extrabold mb-2 text-orange-600">Contests</h3>
          <p className="text-gray-700">Participate in live and virtual coding contests.</p>
          <div className="absolute top-2 right-2 bg-yellow-300 text-yellow-900 text-xs font-semibold px-2 py-1 rounded shadow">
            Coming Soon
          </div>
        </div>
        {/* Leaderboard Block - Coming Soon */}
        <div
          className="bg-white bg-opacity-60 shadow-xl rounded-lg p-6 text-center border-2 border-green-200 cursor-not-allowed relative"
          style={{ pointerEvents: 'none', filter: 'grayscale(0.2)' }}
        >
          <h3 className="text-xl font-extrabold mb-2 text-green-700">Leaderboard</h3>
          <p className="text-gray-700">See top performers and your ranking.</p>
          <div className="absolute top-2 right-2 bg-yellow-300 text-yellow-900 text-xs font-semibold px-2 py-1 rounded shadow">
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
