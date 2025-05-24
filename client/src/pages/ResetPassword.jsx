import React, { useContext, useState, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {
    const { backendUrl } = useContext(AppContext)
    axios.defaults.withCredentials = true

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isEmailSent, setIsEmailSent] = useState(false)
    const [isOtpSubmited, setIsOtpSubmited] = useState(false)

    const inputRefs = useRef([])
    const [otp, setOtp] = useState(Array(6).fill(''))

    const handleInput = (e, index) => {
        const val = e.target.value
        if (!/^[0-9]?$/.test(val)) return
        const newOtp = [...otp]
        newOtp[index] = val
        setOtp(newOtp)

        if (val && index < 5) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text').slice(0, 6).split('')
        const newOtp = [...otp]
        paste.forEach((char, i) => {
            if (i < 6) {
                newOtp[i] = char
                inputRefs.current[i].value = char
            }
        })
        setOtp(newOtp)
    }

    const onSubmitEmail = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email })
            if (data.success) {
                toast.success(data.message)
                setIsEmailSent(true)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const onSubmitOtp = (e) => {
        e.preventDefault()
        const fullOtp = otp.join('')
        if (fullOtp.length !== 6) {
            toast.error('Enter a valid 6-digit OTP')
            return
        }
        setIsOtpSubmited(true)
    }

    const onSubmitNewPassword = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
                email,
                otp: otp.join(''),
                newPassword
            })
            if (data.success) {
                toast.success(data.message)
                navigate('/login')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-red-400'>
            <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

            {!isEmailSent && (
                <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
                    <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} alt="" className='w-3 h-3' />
                        <input type="email" placeholder='Email id'
                            className='bg-transparent outline-none text-white w-full'
                            value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
                        Submit
                    </button>
                </form>
            )}

            {isEmailSent && !isOtpSubmited && (
                <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>Enter OTP</h1>
                    <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email.</p>
                    <div className='flex justify-between mb-8' onPaste={handlePaste}>
                        {otp.map((val, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                                ref={el => inputRefs.current[index] = el}
                                value={val}
                                onChange={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>
                    <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
                        Submit
                    </button>
                </form>
            )}

            {isEmailSent && isOtpSubmited && (
                <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
                    <p className='text-center mb-6 text-indigo-300'>Enter the new password below</p>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} alt="" className='w-3 h-3' />
                        <input type="password" placeholder='New Password'
                            className='bg-transparent outline-none text-white w-full'
                            value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    </div>
                    <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>
                        Reset Password
                    </button>
                </form>
            )}
        </div>
    )
}

export default ResetPassword
