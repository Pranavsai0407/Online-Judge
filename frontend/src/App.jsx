import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import ProblemSet from './components/ProblemSet';
//import Profile from './components/Profile';
//import Logout from './components/Logout';
import Register from './components/Register';
import Users from './components/Users';
import AddProblem from './components/AddProblem';
import Login from './components/Login';
import EditProblem from './components/EditProblem';
import Solve from './components/Solve';
import Compiler from './components/Compiler';
import Mysubmissions from './components/Mysubmissions';
import Profile from './components/Profile';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/Profile" element={<Profile/>} />
          <Route path="/Users" element={<Users/>} />
          <Route path="/ProblemSet" element={<ProblemSet/>} />
          <Route path="/AddProblem" element={<AddProblem/>} />
          <Route path="/EditProblem/:_id" element={<EditProblem/>}/>
          <Route path="/Solve/:_id" element={<Solve/>}/>
          <Route path="/Mysubmissions/:_id" element={<Mysubmissions/>}/>
          <Route path="/Compiler" element={<Compiler/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
