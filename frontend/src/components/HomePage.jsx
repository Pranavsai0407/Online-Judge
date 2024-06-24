import React from 'react';
import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you are using React Router for navigation
import './HomePage.css';
import { API_BACKEND_URL } from './config';

const HomePage = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const response = await axios.post(`${API_BACKEND_URL}/api/v1/user/userType`);
        console.log(response);
        setAdmin(response.data.data.userType === 'admin'); // Assuming response contains userType
      } catch (error) {
        console.log('error');
        console.log(error);
        navigate('/');
      }
    };
    isLoggedIn();
  }, [navigate]);

  const logOutHandler = async () => {
    try {
      await axios.post(`${API_BACKEND_URL}/logout`);
      localStorage.clear(); // Optionally clear local storage or session storage
      navigate("/"); // Navigate to the home page or login page after logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleUsers = () => {
    navigate("/Users");
  };

  return (
    <div className="home-page">
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

      <main className="main">
        <section className="hero">
          <h1>Welcome to Online Judge</h1>
          <p>Test your coding skills with our challenging problems.</p>
          <a href="/ProblemSet" className="cta-btn">Get Started</a>
        </section>

        <section className="features">
          <div className="feature">
            <h2>Wide Range of Problems</h2>
            <p>From beginner to advanced, find problems that match your skill level.</p>
          </div>
          <div className="feature">
            <h2>Real-time Evaluation</h2>
            <p>Get instant feedback on your submissions and improve your coding skills.</p>
          </div>
          <div className="feature">
            <h2>Community Support</h2>
            <p>Join our community, discuss problems, and learn together.</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Online Judge. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
