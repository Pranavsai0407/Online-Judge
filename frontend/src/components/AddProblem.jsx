import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddProblem.css';
axios.defaults.withCredentials = true;

function AddProblem() {

  const [data, setData] = useState({
    name: "",
    statement: "",
    constraints: "",
    testcases: [],
    tag: [],
    timeLimit: "",
    memoryLimit: ""
  });
  

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/v1/user/userType");
        if (response.data.data.userType !== "admin") {
          alert("You are not allowed to do this!");
          navigate('/ProblemSet');
        }
      } catch (error) {
        console.log(error);
        navigate('/');
      }
    };
    isLoggedIn();
  }, [navigate]);

  const createProblem = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/v1/problems/create", data);
      navigate("/HomePage");
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (field, value) => {
    setData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleTagChange = (value) => {
    setData(prevData => ({ ...prevData, tag: value.split(',') }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      try {
        const parsedTestcases = JSON.parse(content);
        setData(prevData => ({ ...prevData, testcases: parsedTestcases }));
      } catch (error) {
        console.error("Error parsing file:", error);
        alert("Failed to parse test cases file. Ensure it is in correct JSON format.");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="create-task-container">
      <h1>Create New Problem</h1>
      <form onSubmit={createProblem} className="create-task-form">
        <label>
          Name:
          <input 
            type="text" 
            value={data.name} 
            onChange={(e) => handleInputChange('name', e.target.value)} 
            required 
          />
        </label>
        <label>
          Statement:
          <textarea 
            value={data.statement} 
            onChange={(e) => handleInputChange('statement', e.target.value)} 
            required 
          />
        </label>
        <label>
          Constraints:
          <textarea 
            value={data.constraints} 
            onChange={(e) => handleInputChange('constraints', e.target.value)} 
            required 
          />
        </label>
        <label>
          Tags (comma separated):
          <input 
            type="text" 
            value={data.tag.join(',')} 
            onChange={(e) => handleTagChange(e.target.value)} 
          />
        </label>
        <label>
          Time Limit (seconds):
          <input 
            type="number" 
            value={data.timeLimit} 
            onChange={(e) => handleInputChange('timeLimit', e.target.value)} 
            required 
          />
        </label>
        <label>
          Memory Limit (MB):
          <input 
            type="number" 
            value={data.memoryLimit} 
            onChange={(e) => handleInputChange('memoryLimit', e.target.value)} 
            required 
          />
        </label>
        <div className="testcases-section">
          <h2>Test Cases</h2>
          <input type="file" accept=".json" onChange={handleFileUpload} />
          {data.testcases.length > 0 && (
            <div>
              <h3>Uploaded Test Cases</h3>
              <pre>{JSON.stringify(data.testcases, null, 2)}</pre>
            </div>
          )}
        </div>
        <button type="submit">Create Problem</button>
      </form>
    </div>
  );
}

export default AddProblem;
