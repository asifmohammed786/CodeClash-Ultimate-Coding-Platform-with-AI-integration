import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import logo from "../assets/codeclash-logo.png";
import heroImg from "../assets/codeclash-logo.png"; // Replace with your hero image if different
import ownerPhoto from "../assets/owner_photo.jpg"; // Replace with your real photo
import mascot from "../assets/code-mascot.json";
import Lottie from "lottie-react";

export default function Landing() {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  // Redirect logged-in users to /home
  useEffect(() => {
    if (userData) {
      navigate('/home', { replace: true });
    }
  }, [userData, navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 to-orange-100 flex flex-col">
      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-10 py-12 px-4 md:px-20">
        <div className="flex-1 flex flex-col items-center md:items-start">
          <img src={logo} alt="CodeClash Logo" className="w-20 mb-4" />
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold mb-2 text-center md:text-left"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            style={{
              background: "linear-gradient(90deg,#6366f1,#f59e42)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome to CodeClash!
          </motion.h1>
          <p className="text-lg text-gray-700 mb-6 text-center md:text-left max-w-xl">
            <span className="font-bold text-orange-600">CodeClash</span> is your modern platform to code, compete, and conquer.<br />
            Solve coding problems, join live contests, and climb the leaderboard.
          </p>
          <div className="flex gap-4 mb-6 justify-center md:justify-start">
            <motion.button
              className="px-8 py-3 bg-indigo-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-indigo-700 transition"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </motion.button>
            <motion.button
              className="px-8 py-3 bg-orange-500 text-white text-lg font-bold rounded-full shadow-lg hover:bg-orange-600 transition"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate('/login')}
            >
              Log In
            </motion.button>
          </div>
        </div>
        {/* Hero Image or Animation */}
        <div className="flex-1 flex flex-col items-center">
          <img src={heroImg} alt="CodeClash Platform" className="w-96 rounded-2xl shadow-xl mb-4" />
          <Lottie animationData={mascot} loop={true} className="w-36 h-36" />
        </div>
      </section>

      {/* WHY CODECLASH SECTION */}
      <section className="flex flex-col items-center py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-700 mb-8 text-center">Why CodeClash?</h2>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-center">
          <FeatureCard icon="🏆" title="Live Contests" desc="Compete in weekly and monthly contests with real-time leaderboards and prizes." />
          <FeatureCard icon="💡" title="Practice Problems" desc="Sharpen your skills with 1000+ curated problems, from beginner to expert." />
          <FeatureCard icon="👥" title="Community" desc="Discuss strategies, share solutions, and grow with a vibrant coding community." />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="flex flex-col items-center py-12 px-4 bg-gradient-to-r from-indigo-50 to-orange-50">
        <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-700 mb-8 text-center">How CodeClash Works</h2>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl justify-center items-center">
          <StepCard num={1} title="Sign Up" desc="Create your free account in seconds." />
          <StepCard num={2} title="Practice & Compete" desc="Solve problems, join contests, and submit your code." />
          <StepCard num={3} title="Track & Improve" desc="View your stats, earn badges, and climb the leaderboard!" />
        </div>
      </section>

      {/* ABOUT OWNER */}
      <section className="flex flex-col items-center py-12 px-4 bg-white">
        <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-700 mb-6 text-center">About the Creator</h2>
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-3xl mx-auto">
          <img
            src={ownerPhoto}
            alt="Owner"
            className="w-40 h-40 rounded-full shadow-lg object-cover border-4 border-indigo-300"
          />
          <div className="flex flex-col items-center md:items-start">
            <div className="text-xl font-bold text-indigo-800 mb-1">Mohammed Asif Hasan</div>
            <div className="text-gray-700 text-center md:text-left mb-2">
              Passionate coder, educator, and the creator of CodeClash.<br />
              My mission: to empower every learner to code, compete, and grow.<br />
              <span className="italic text-indigo-500">"Building a global community, one line of code at a time."</span>
            </div>
            {/* Contact Details START */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 font-bold">Email:</span>
                <a
                  href="mailto:asifmohammed85113@gmail.com"
                  className="text-blue-700 underline hover:text-blue-900 transition"
                >
                  asifmohammed85113@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 font-bold">Phone:</span>
                <a
                  href="tel:9493427335"
                  className="text-green-700 underline hover:text-green-900 transition"
                >
                  +91 9493427335
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 font-bold">GitHub:</span>
                <a
                  href="https://github.com/asifmohammed786"
                  className="text-indigo-600 underline hover:text-indigo-800 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/asifmohammed786
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 font-bold">LinkedIn:</span>
                <a
                  href="https://www.linkedin.com/in/mohammed-asif-hasan-2a4b8a29a/"
                  className="text-indigo-600 underline hover:text-indigo-800 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  linkedin.com/in/mohammed-asif-hasan-2a4b8a29a
                </a>
              </div>
            </div>
            {/* Contact Details END */}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-8 py-6 text-center text-gray-500 text-sm border-t bg-gradient-to-r from-white to-orange-50">
        &copy; {new Date().getFullYear()} CodeClash. All rights reserved. | 
        <a href="mailto:hello@codeclash.com" className="ml-2 text-indigo-700 underline">Contact</a>
      </footer>
    </div>
  );
}

// Feature card component
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-indigo-100 to-orange-50 rounded-xl shadow-md w-64">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="font-bold text-lg mb-1">{title}</div>
      <div className="text-gray-600 text-center">{desc}</div>
    </div>
  );
}

// How it works step
function StepCard({ num, title, desc }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-bold bg-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-2">{num}</div>
      <div className="font-bold text-lg mb-1">{title}</div>
      <div className="text-gray-600 text-center">{desc}</div>
    </div>
  );
}
