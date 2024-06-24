import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProblemSet.css";
import { API_BACKEND_URL } from './config';
axios.defaults.withCredentials = true;

function ProblemSet() {
  const [problems, setProblems] = useState([]);
  const [admin, setAdmin] = useState(false); // Create a state variable for admin
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const response = await axios.post(`${API_BACKEND_URL}/api/v1/user/userType`);
        //console.log(response);
        setAdmin(response.data.data.userType === 'admin'); // Assuming response contains userType
      } catch (error) {
        console.log(error);
        navigate('/');
      }
    };
    isLoggedIn();
  }, [navigate]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${API_BACKEND_URL}/api/v1/problems/getAllProblems`);
        setProblems(response.data.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, []);

  const logOutHandler = async () => {
    try {
      await axios.post(`${API_BACKEND_URL}/logout`);
      localStorage.clear(); // Optionally clear local storage or session storage
      navigate("/"); // Navigate to the home page or login page after logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleAddProblem = () => {
    navigate("/AddProblem");
  };

  const handleHome = () => {
    navigate("/HomePage");
  };

  const handleEditProblem = (problemId) => {
    navigate(`/EditProblem/${problemId}`);
  };

  const handleDeleteProblem = async (problemId) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        await axios.delete(`${API_BACKEND_URL}/api/v1/problems/delete/${problemId}`);
        // Optionally, update the problems state after deletion to reflect changes
        setProblems(problems.filter(problem => problem._id !== problemId));
      } catch (error) {
        console.error("Error deleting problem:", error);
      }
    }
  };

  const handleSolveProblem = (problemId) => {
    navigate(`/Solve/${problemId}`);
  };

  return (
    <div className="problem-page">
    <header className="header">
        <nav className="navbar">
          <div className="logo">Online Judge</div>
          <ul className="nav-links">
            <li><a href="/HomePage">Home</a></li>
            <li><a href="/ProblemSet">Problems</a></li>
            <li><a href="/Profile">Profile</a></li>
            <li>{admin && (
            <a href="/Users">Users</a>
          )}</li>
            <li><button onClick={logOutHandler}>Logout</button></li>
          </ul>
        </nav>
      </header>
     
    <div className="problemset-container">
      <div className="problemset-header">
        <h1>Problem Set</h1>
        <div className="problemset-buttons">
          {admin && (
            <button onClick={handleAddProblem} className="problemset-button">
              Add Problem
            </button>
          )}
        </div>
      </div>
      <div className="problemset-list">
        {problems.length === 0 ? (
          <p>No problems found.</p>
        ) : (
          problems.map((problem) => (
            <div key={problem._id} className="problemset-item">
              <div className="problemset-item-content">
                <div className="problem-details">
                  <h2>{problem.name}</h2>
                  <p>Tag: {problem.tag}</p>
                </div>
                <div className="problemset-item-buttons">
                  {admin && (
                    <>
                      <button onClick={() => handleEditProblem(problem._id)} className="button edit-button">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProblem(problem._id)} className="button delete-button">
                        Delete
                      </button>
                    </>
                  )}
                  <button onClick={() => handleSolveProblem(problem._id)} className="button solve-button">
                    Solve
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
}

export default ProblemSet;
