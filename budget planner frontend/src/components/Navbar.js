import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

// Local logo for navbar
const logo = "/logo.png";

function Navbar({ onLogout, userEmail }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Budget Planner Logo" className="navbar-logo" />
        <h1>Budget Planner</h1>
        <p style={{ margin: '0', fontSize: '0.9rem', opacity: 0.8 }}>It's all about money</p>
      </div>

      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/users">Users</Link>
        <Link to="/categories">Categories</Link>
      </div>

      <div className="profile-section">
        <span>Welcome, {userEmail}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
