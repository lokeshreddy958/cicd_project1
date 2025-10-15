import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Categories from './components/Categories';
import Transactions from './components/Transactions';
import Login from './components/Login';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setUserEmail(user);
    }
  }, []);

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserEmail('');
  };

  return (
    <Router>
      <div className="App">
        {isLoggedIn && <Navbar onLogout={handleLogout} userEmail={userEmail} />}
        <main>
          <Routes>
            <Route 
              path="/login" 
              element={
                <Login onLogin={handleLogin} />
              } 
            />
            {isLoggedIn ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/transactions" element={<Transactions />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
