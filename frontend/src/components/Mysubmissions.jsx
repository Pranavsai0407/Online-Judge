import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import './Mysubmissions.css';
import { API_BACKEND_URL } from './config';


axios.defaults.withCredentials = true;

function MySubmissions() {
  const { _id } = useParams();
  const [username, setUsername] = useState('');
  const [mySubmissions, setMySubmissions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMySubmissions = async () => {
      try {
        const userResponse = await axios.get(`${ API_BACKEND_URL }/api/v1/user/current-user`);
        const userId = userResponse.data.data._id;
        const username = userResponse.data.data.username;
        setUsername(username);

        const response = await axios.get(`${API_BACKEND_URL}/api/v1/submissions/user/${userId}/problem/${_id}`);
        setMySubmissions(response.data.data);

      } catch (error) {
        console.error("Error fetching user submissions:", error);
        setError('No submissions recorded yet.');
      }
    };

    fetchMySubmissions();
  }, [_id]);

  const getLanguageExtension = (language) => {
    switch (language) {
      case 'c':
      case 'cpp':
        return cpp();
      case 'java':
        return java();
      case 'python':
        return python();
      default:
        return cpp();
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <header className="header">
        <nav className="navbar">
          <div className="logo">Online Judge</div>
          <ul className="nav-links">
            <li><a href="/Compiler">Custom Test</a></li>
            <li><a href="/HomePage">Home</a></li>
            <li><a href="/ProblemSet">Problems</a></li>
          </ul>
        </nav>
      </header>
      <div className="my-submissions-container">
        <h1>My Submissions</h1>
        {mySubmissions.length === 0 ? (
          <p>No submissions recorded yet.</p>
        ) : (
          mySubmissions.map((submission, index) => (
            <div key={index} className="submission-item">
              <p><strong>Username:</strong> {username}</p>
              <p><strong>Submission Time:</strong> {new Date(submission.submissionTime).toLocaleString()}</p>
              <p><strong>Verdict:</strong> {submission.verdict}</p>
              <p><strong>Time Taken:</strong> {submission.execTime} ms</p>
              <p><strong>Memory Used:</strong> {submission.memory} KB</p>
              <CodeMirror
                value={submission.code}
                height="20vh"
                extensions={[getLanguageExtension(submission.language)]}
                placeholder="Submitted Code"
                theme={oneDark}
                options={{ readOnly: true }} // Making the code read-only
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MySubmissions;
