import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditProblem.css';

axios.defaults.withCredentials = true;


function EditProblem() {

    const navigate = useNavigate();

    useEffect(() => {
      const isLoggedIn = async () => {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/v1/user/userType"
          );
          if (response.data.data.userType !== "admin") {
            alert("You are not allowed to do this!");
            navigate("/ProblemSet");
          }
        } catch (error) {
          console.log(error);
          navigate("/");
        }
      };
      isLoggedIn();
    }, [navigate]);
  


  const { _id } = useParams();
  const [data, setData] = useState({
    name: "",
    statement: "",
    constraints: "",
    testcases: [{ input: [""], output: [""] }],
    tag: [],
    timeLimit: "",
    memoryLimit: ""
  });

  //const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/problems/getProblem/${_id}`);
        setData(response.data.data);
      } catch (error) {
        console.log("Error fetching problem:", error);
        navigate('/ProblemSet');
      }
    };
    fetchProblem();
  }, [_id, navigate]);

  const updateProblem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/v1/problems/update/${_id}`, data);
      navigate("/ProblemSet");
    } catch (error) {
      console.log("Error updating problem:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleTagChange = (value) => {
    setData(prevData => ({ ...prevData, tag: value.split(',') }));
  };

  const handleTestcaseChange = (testcaseIndex, field, index, value) => {
    setData(prevData => {
      const newTestcases = [...prevData.testcases];
      newTestcases[testcaseIndex][field][index] = value;
      return { ...prevData, testcases: newTestcases };
    });
  };

  const handleAddTestcase = () => {
    setData(prevData => {
      const newTestcases = [...prevData.testcases, { input: [""], output: [""] }];
      return { ...prevData, testcases: newTestcases };
    });
  };

  const handleDeleteTestcase = (index) => {
    setData(prevData => {
      const newTestcases = prevData.testcases.filter((_, i) => i !== index);
      return { ...prevData, testcases: newTestcases };
    });
  };

  return (
    <div className="edit-task-container">
      <h1>Edit Problem</h1>
      <form onSubmit={updateProblem} className="edit-task-form">
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
          {data.testcases.map((testcase, testcaseIndex) => (
            <div key={testcaseIndex} className="testcase">
              <label>
                Input:
                <textarea 
                  value={testcase.input.join('\n')} 
                  onChange={(e) => handleTestcaseChange(testcaseIndex, 'input', 0, e.target.value.split('\n'))} 
                  required 
                />
              </label>
              <label>
                Output:
                <textarea 
                  value={testcase.output.join('\n')} 
                  onChange={(e) => handleTestcaseChange(testcaseIndex, 'output', 0, e.target.value.split('\n'))} 
                  required 
                />
              </label>
              <button type="button" onClick={() => handleDeleteTestcase(testcaseIndex)}>Delete Test Case</button>
            </div>
          ))}
          <button type="button" onClick={handleAddTestcase}>Add Test Case</button>
        </div>
        <button type="submit">Update Problem</button>
      </form>
    </div>
  );
}

export default EditProblem;
