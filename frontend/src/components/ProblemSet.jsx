import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProblemSet.css";

axios.defaults.withCredentials = true;

function ProblemSet() {
  const [problems, setProblems] = useState([]);
  const [admin, setAdmin] = useState(false); // Create a state variable for admin
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/v1/user/userType");
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
        const response = await axios.get("http://localhost:5000/api/v1/problems/getAllProblems");
        setProblems(response.data.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, []);

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
        await axios.delete(`http://localhost:5000/api/v1/problems/delete/${problemId}`);
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
    <div className="problemset-container">
      <div className="problemset-header">
        <h1>Problem Set</h1>
        <div className="problemset-buttons">
          <button onClick={handleHome} className="problemset-button">
            Home
          </button>
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
  );
}

export default ProblemSet;
