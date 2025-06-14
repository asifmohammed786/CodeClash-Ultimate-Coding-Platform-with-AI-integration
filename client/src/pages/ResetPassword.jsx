import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from "../assets/codeclash-logo.png";

export default function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post("/api/auth/send-reset-otp", { email });
      if (res.data.success) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to send OTP.");
    }
    setSubmitting(false);
  };

  // Step 2: Reset password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (res.data.success) {
        toast.success("Password reset successful. Please log in.");
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to reset password.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-pink-200">
      <div className="flex flex-col items-center mb-6 mt-8">
        <img src={logo} alt="CodeClash Logo" className="w-16 mb-2" />
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">CodeClash</h1>
      </div>
      <div className="bg-slate-900 rounded-xl shadow-xl px-8 py-10 flex flex-col items-center w-full max-w-sm z-10">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-extrabold text-white mb-2 text-center">Reset Password</h2>
            <p className="text-indigo-200 mb-6 text-center text-sm">Enter your registered email address</p>
            <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email id"
                className="w-full px-4 py-3 rounded-full bg-[#333A5C] text-white outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-semibold text-lg hover:from-indigo-600 hover:to-indigo-950 transition"
              >
                {submitting ? "Submitting..." : "Send OTP"}
              </button>
            </form>
            <div className="mt-6 text-indigo-300 text-sm text-center">
              Remembered?{" "}
              <span
                onClick={() => navigate("/login")}
                className="underline cursor-pointer hover:text-indigo-100"
              >
                Back to Login
              </span>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-extrabold text-white mb-2 text-center">Enter OTP & New Password</h2>
            <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-4">
              <input
                type="text"
                maxLength={6}
                pattern="\d*"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3 rounded-full bg-[#333A5C] text-white outline-none text-center tracking-widest text-lg"
                placeholder="Enter OTP"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-3 rounded-full bg-[#333A5C] text-white outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-semibold text-lg hover:from-indigo-600 hover:to-indigo-950 transition"
              >
                {submitting ? "Submitting..." : "Reset Password"}
              </button>
            </form>
            <div className="mt-6 text-indigo-300 text-sm text-center">
              <span
                onClick={() => setStep(1)}
                className="underline cursor-pointer hover:text-indigo-100"
              >
                Back to Email
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
