import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { GoogleLogin } from '@react-oauth/google'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import codeMascot from '../assets/code-mascot.json'

const Login = () => {
    const navigate = useNavigate()
    const {
        backendUrl,
        setIsLoggedin,
        getUserData
    } = useContext(AppContext); // ✅ CORRECT way to use it
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
            if (data.success && data.token) {
                localStorage.setItem("token", data.token); // Store JWT
                setIsLoggedin(true)
                await getUserData()
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    // Google login handler
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            const { data } = await axios.post(backendUrl + '/api/auth/google', { credential });
            if (data.success && data.token) {
                localStorage.setItem("token", data.token);
                setIsLoggedin(true);
                await getUserData();
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const handleGoogleError = () => {
        toast.error("Google Sign-In failed. Please try again.");
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-red-400 relative'>
            {/* Animated Mascot and Title */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 12 }}
                className="flex flex-col items-center mb-6 mt-8"
            >
                <div className="w-28 h-28 mb-2">
                    <Lottie animationData={codeMascot} loop={true} />
                </div>
                <motion.h1
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-2xl font-extrabold text-gray-900 mb-1 text-center"
                >
                    CodeClash 
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-md text-gray-700 font-medium mb-1 tracking-wide text-center"
                >
                    Code • Compete • Conquer
                </motion.p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
                className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm z-10'
            >
                <h2 className='text-3xl font-semibold text-white text-center mb-3 '>
                    Login to your Account!
                </h2>
                <p className='text-center text-sm mb-6'>
                    Welcome back!
                </p>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} alt="" />
                        <input onChange={e => setEmail(e.target.value)}
                            value={email}
                            className='bg-transparent outline-none' type="email" placeholder='Email id' required />
                    </div>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} alt="" />
                        <input onChange={e => setPassword(e.target.value)}
                            value={password}
                            className='bg-transparent outline-none' type="password" placeholder='Password' required />
                    </div>
                    <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>
                    <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>Login</button>
                </form>
                {/* Google Sign-In Button */}
                <div className="flex justify-center mt-4">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        width="100%"
                        theme="filled_black"
                        shape="pill"
                    />
                </div>
                <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
                    <span onClick={() => navigate('/signup')} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
                </p>
            </motion.div>
        </div>
        
    )
}



export default Login
