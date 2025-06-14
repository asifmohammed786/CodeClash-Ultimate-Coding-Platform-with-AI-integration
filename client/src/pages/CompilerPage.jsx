import React from "react";
import { useNavigate } from "react-router-dom";
import SimpleCompiler from "../components/SimpleCompiler";

const CompilerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      {/* Back Button */}
      <button
        className="mt-6 mb-4 px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded hover:bg-indigo-200 transition self-start ml-8"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>
      <SimpleCompiler />
    </div>
  );
};

export default CompilerPage;
