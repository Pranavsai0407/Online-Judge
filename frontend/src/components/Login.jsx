import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import "./Login.css";

axios.defaults.withCredentials = true;

function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting data:", data);
    try {
      const response = await axios.post('http://localhost:5000/login', data);
      console.log("Response:", response);
      alert("User logged in successfully");
      navigate("/HomePage");
    } catch (error) {
      console.log("Login error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message, { autoClose: 2000 });
      } else {
        toast.error("An error occurred during login", { autoClose: 2000 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNavigation = () => {
    navigate("/Register");
  };

  return (
    <>
      <ToastContainer />
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="register-option">
          <p>Not registered?</p>
          <button className="register-link" onClick={handleRegisterNavigation}>
            Register here
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;
