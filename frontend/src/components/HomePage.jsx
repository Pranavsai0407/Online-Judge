import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="header">
        <nav className="navbar">
          <div className="logo">Online Judge</div>
          <ul className="nav-links">
            <li><a href="/HomePage">Home</a></li>
            <li><a href="/ProblemSet">Problems</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/logout">Logout</a></li>
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