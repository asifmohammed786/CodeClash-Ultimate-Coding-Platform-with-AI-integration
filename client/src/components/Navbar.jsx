import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate, Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
    const navigate = useNavigate()
    const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext)

    const logout = async () => {
        try {
            localStorage.removeItem("token");
            setIsLoggedin(false);
            setUserData(null);
            navigate('/')
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='w-full flex items-center justify-between px-8 py-4 fixed top-0 left-0 bg-white bg-opacity-80 z-50 shadow'>
            {/* Logo and Compiler button on the left */}
            <div className="flex items-center gap-4">
                <img src={assets.person_icon} alt="" className='w-14 h-14' />
                <button
                    className="ml-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 font-semibold shadow transition"
                    onClick={() => navigate('/compiler')}
                >
                    Editor
                </button>
            </div>

            {/* Navigation links on the right */}
            <div className="flex items-center gap-6">
                {userData?.isAdmin && (
                    <Link to="/add-problem" className="text-indigo-700 font-semibold hover:underline">
                        Add Problem
                    </Link>
                )}
                 {userData?.isAdmin && (
                    <Link to="/add-contest" className="text-pink-700 font-semibold hover:underline">
                        Add Contest
                    </Link>
                    )}
                {/* User menu */}
                {userData?.name ? (
                    <div className='relative group'>
                        {/* Avatar */}
                        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-gray-200 text-black cursor-pointer'>
                            {userData.name[0].toUpperCase()}
                        </div>
                        {/* Dropdown */}
                        <div className='absolute right-0 mt-0 min-w-[140px] hidden group-hover:block bg-white shadow-lg rounded z-10'>
                            <ul className='list-none m-0 p-2 text-sm'>
                                {/* Verify email option removed */}
                                </ul>
                                                                    {/* Inside the dropdown menu */}
                                        <ul className='list-none m-0 p-2 text-sm'>
                                        <li
                                            onClick={() => navigate('/profile')}
                                            className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded'
                                        >
                                            Profile
                                        </li>
                                        <li
                                            onClick={() => navigate('/leaderboard')}
                                            className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded'
                                        >
                                            Leaderboard
                                        </li>
                                        <li
                                            onClick={logout}
                                            className='py-1 px-2 hover:bg-gray-200 cursor-pointer rounded'
                                        >
                                            Logout
                                        </li>
                                        </ul>

                        </div>
                        {/* Inside the dropdown menu */}

                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'
                    >
                        Login <img src={assets.arrow_icon} alt="" />
                    </button>
                )}

            </div>
        </div>
    )
}

export default Navbar
