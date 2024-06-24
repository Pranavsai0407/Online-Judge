import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import "./Register.css";
import axios from 'axios';
import { API_BACKEND_URL } from './config';

axios.defaults.withCredentials = true;

function Register(){
  const [data, setData] = useState({
    fullname: "",
    username: "",
    email: "",
    country: "",
    password: "",
  });

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response= await axios.post(`${API_BACKEND_URL}/register`,data);
      alert("User registered successfully");
      navigate("/HomePage");
    } catch (error) {
      console.log(error);
      const htmlResponse = error.response.data.message;
      console.log('Extracted message:', htmlResponse);
      toast.error(htmlResponse, { autoClose: 2000 });
    }
  };
  return (
    <>
    <ToastContainer />
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullname">Fullname</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            onChange={(e) => setData({ ...data, fullname: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={(e) => setData({ ...data, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            onChange={(e) => setData({ ...data, country: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="register-btn">
          Register
        </button>
      </form>
    </div>

    </>
  );
};

export default Register;
