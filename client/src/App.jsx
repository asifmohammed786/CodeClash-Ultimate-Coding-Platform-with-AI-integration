import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import Home from './pages/home'
import ResetPassword from './pages/resetPassword'
import Problems from './pages/Problems'
import AddProblem from './pages/AddProblem'
import EditProblem from './pages/EditProblem'
import { ToastContainer } from 'react-toastify'
import ProtectedRoute from './components/ProtectedRoute' //prot route
import PublicRoute from './components/PublicRoute'
import Compiler from './pages/Compiler';
import ProblemDetails from './pages/ProblemDetails';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <Problems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-problem"
          element={
            <ProtectedRoute>
              <AddProblem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-problem/:id"
          element={
            <ProtectedRoute>
              <EditProblem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/compiler" element={<Compiler />} />
        <Route
          path="/problems/:id"
          element={
            <ProtectedRoute>
              <ProblemDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
