import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const SubmissionHistory = ({ problemId }) => {
  const { backendUrl } = useContext(AppContext);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (!problemId) return;
    const token = localStorage.getItem('token');
    axios.get(`${backendUrl}/api/compiler/submissions?problemId=${problemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setSubmissions(res.data.submissions || []));
  }, [backendUrl, problemId]);

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Your Submissions</h3>
      {submissions.length === 0 ? (
        <div className="text-gray-500">No submissions yet.</div>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Time</th>
              <th className="p-2">Verdict</th>
              <th className="p-2">Language</th>
              <th className="p-2">Code</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(sub => (
              <tr key={sub._id}>
                <td className="p-2">{new Date(sub.timestamp).toLocaleString()}</td>
                <td className="p-2">{sub.verdict}</td>
                <td className="p-2">{sub.language}</td>
                <td className="p-2">
                  <details>
                    <summary>View</summary>
                    <pre className="bg-gray-50 p-2 rounded">{sub.code}</pre>
                    {sub.error && (
                      <div className="text-red-500 mt-2">{sub.error}</div>
                    )}
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubmissionHistory;
