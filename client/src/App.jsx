import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AppContext } from './context/AppContext'

import Login from './pages/Login'
import Signup from './pages/Signup'
import EmailVerify from './pages/EmailVerify'
import Home from './pages/Home'
import ResetPassword from './pages/ResetPassword'
import Problems from './pages/Problems'
import AddProblem from './pages/AddProblem'
import EditProblem from './pages/EditProblem'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import ProblemDetails from './pages/ProblemDetails'
import CompilerPage from "./pages/CompilerPage"
import Profile from './pages/Profile'
import Leaderboard from './pages/LeaderBoard'
import Contest from './pages/Contest'
import AddContest from './pages/AddContest'
import ContestLive from './pages/ContestLive'
import Landing from './pages/Landing'

const App = () => {
  const { isAuthLoading } = useContext(AppContext)

  if (isAuthLoading) {
    return <div className="text-center p-5 text-xl font-semibold">Loading...</div>
  }

  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/email-verify" element={<PublicRoute><EmailVerify /></PublicRoute>} />

        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/problems" element={<ProtectedRoute><Problems /></ProtectedRoute>} />
        <Route path="/add-problem" element={<ProtectedRoute><AddProblem /></ProtectedRoute>} />
        <Route path="/edit-problem/:id" element={<ProtectedRoute><EditProblem /></ProtectedRoute>} />
        <Route path="/problems/:id" element={<ProtectedRoute><ProblemDetails /></ProtectedRoute>} />
        <Route path="/compiler" element={<ProtectedRoute><CompilerPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/contest" element={<ProtectedRoute><Contest /></ProtectedRoute>} />
        <Route path="/add-contest" element={<ProtectedRoute><AddContest /></ProtectedRoute>} />
        <Route path="/contest/:id" element={<ProtectedRoute><ContestLive /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App
