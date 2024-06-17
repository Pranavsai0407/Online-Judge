import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import './Solve.css';

axios.defaults.withCredentials = true;

function SolveProblem() {
  const { _id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/problems/getProblem/${_id}`);
        setProblem(response.data.data);
      } catch (error) {
        console.error("Error fetching problem:", error);
        navigate('/ProblemSet');
      }
    };
    fetchProblem();
  }, [_id, navigate]);

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

  const handleMySubmissions = () => {
    navigate(`/MySubmissions/${_id}`);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/problems/getProblemtestcases/${_id}`);
      //console.log(typeof _id);
      const payload = {
        language,
        code,
        problem_id: problem._id,
        timeLimit: problem.timeLimit,
        memoryLimit: problem.memoryLimit,
        testcases: response.data.data,
      };

      const submissionResponse = await axios.post(`http://localhost:8000/submit`, payload);
      const userResponse = await axios.get(`http://localhost:5000/api/v1/user/current-user`);

      const { verdict, timeTaken, memoryUsed } = submissionResponse.data;
      const userId = userResponse.data.data._id;

      const submissionData = {
        userId,
        language,
        code,
        verdict,
        problemId: _id,
        timeTaken: timeTaken,
        memoryUsed: memoryUsed,
      };

      const dbResponse = await axios.post(`http://localhost:5000/api/v1/submissions/create`, submissionData);
      setSubmissionResult(submissionData);
      setError(''); // Clear previous errors
    } catch (error) {
      console.log(error);
      let compilationError = error.response?.data || {};
      const errorMessage = (compilationError.message && compilationError.message.length <= 60) ? compilationError.message : 'Submission error';
      const stderr = compilationError.error || '';
      setError(stderr);
      setSubmissionResult(null); // Clear previous submission result
      console.error('Submission error:', errorMessage, stderr);
    }
  };

  if (!problem) {
    return <div>Loading...</div>;
  }

  let statusClass = '';
  if (submissionResult) {
    switch (submissionResult.verdict) {
      case 'Accepted':
        statusClass = 'status-accepted';
        break;
      case 'Wrong Answer':
        statusClass = 'status-wrong';
        break;
      case 'Time Limit Exceeded':
        statusClass = 'status-timeout';
        break;
      case 'Memory Limit Exceeded':
        statusClass = 'status-memory';
        break;
      default:
        statusClass = '';
        break;
    }
  }
  //****After changes*************************** */

  return (
    <div>
      <header className="header">
        <nav className="navbar">
          <div className="logo">Online Judge</div>
          <ul className="nav-links">
            <li><button className="my-submissions-button" onClick={handleMySubmissions}>My Submissions</button></li>
            <li><a href="/Compiler">Custom Test</a></li>
            <li><a href="/HomePage">Home</a></li>
            <li><a href="/ProblemSet">Problems</a></li>
          </ul>
        </nav>
      </header>
      <div className="problem-details-container">
        <div className="problem-header">
          <h1 className="problem-title">{problem.name}</h1>
        </div>
        <div className="problem-description">
          <h2>Description</h2>
          <p>{problem.statement}</p>
        </div>
        <div className="problem-constraints">
          <h2>Constraints</h2>
          <ul>
            {problem.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </div>
        <div className="problem-limits">
          <p><strong>Time Limit:</strong> {problem.timeLimit} seconds</p>
          <p><strong>Memory Limit:</strong> {problem.memoryLimit} MB</p>
        </div>
        <div className="example-testcases">
          <h2>Example Testcases</h2>
          {problem.testcases.slice(0, 3).map((testcase, index) => (
            <div key={index} className="testcase">
              <p><strong>Input:</strong> {testcase.input.join(' ')}</p>
              <p><strong>Output:</strong> {testcase.output.join(' ')}</p>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="mr-2">Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border border-gray-300 rounded-md p-2">
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>
        <div className="mb-4">
          <CodeMirror
            value={code}
            height="50vh"
            extensions={[getLanguageExtension(language)]}
            placeholder="Type your Code Here"
            theme={oneDark}
            onChange={(value) => setCode(value)}
          />
        </div>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>

        {/* Display submission result */}
        {submissionResult && (
          <div className={`submission-result ${statusClass}`}>
            <h2>Submission Result</h2>
            <p>Status: {submissionResult.verdict}</p>
            <p>Time Taken: {submissionResult.timeTaken} ms</p>
            <p>Memory Used: {submissionResult.memoryUsed} KB</p>
          </div>
        )}
        {/* Display error */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SolveProblem;
