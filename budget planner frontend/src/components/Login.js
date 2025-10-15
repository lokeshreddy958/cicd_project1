import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';


// Local logo
const logo = "/logo.png";

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Login API call
  const handleLogin = (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setError('Please enter email and password');
      return;
    }

    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: credentials.email, password: credentials.password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) setError(data.error);
      else {
        setFadeOut(true);
        setTimeout(() => {
          localStorage.setItem('user', data.user.email);
          onLogin();
          navigate('/');
        }, 500);
      }
    })
    .catch(() => setError('Server error. Try again.'));
  };

  // Sign Up API call
  const handleSignUp = (e) => {
    e.preventDefault();
    if (!credentials.name || !credentials.email || !credentials.password) {
      setError('Please fill all fields');
      return;
    }

    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) setError(data.error);
      else {
        setFadeOut(true);
        setTimeout(() => {
          localStorage.setItem('user', credentials.email);
          onLogin();
          navigate('/');
        }, 500);
      }
    })
    .catch(() => setError('Server error. Try again.'));
  };

  // Google & Facebook login (not implemented yet)
  const handleGoogleLogin = () => {
    alert('Google login not implemented yet. Please use email/password.');
  };

  const handleFacebookLogin = () => {
    alert('Facebook login not implemented yet. Please use email/password.');
  };

  return (
    <div className={`login-split ${fadeOut ? 'fade-out' : ''}`}>
      <div className="login-left">
        <img src={logo} alt="Budget Planner Logo" className="logo-large" />
        <h2 className="logo-quote">Ｓᴍᴀʀᴛ Ｍᴏɴᴇʏ💰, Ｓᴍᴀʀᴛ Ｌɪꜰᴇ !</h2>
      </div>

      <div className="login-right">
        <div className="tabs">
          <button className={isLogin ? 'active' : ''} onClick={() => { setIsLogin(true); setError(''); }}>Login</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => { setIsLogin(false); setError(''); }}>Sign Up</button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <input type="email" name="email" placeholder="Email" value={credentials.email} onChange={handleInputChange} required />
            <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleInputChange} required />
            <button type="submit" className="btn-primary">Login</button>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <input type="text" name="name" placeholder="Name" value={credentials.name} onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email" value={credentials.email} onChange={handleInputChange} required />
            <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleInputChange} required />
            <button type="submit" className="btn-primary">Sign Up</button>
          </form>
        )}

        {error && <p className="error">{error}</p>}

        <div className="social-login">
          <button className="btn-google" onClick={handleGoogleLogin}>Sign in with Google</button>
          <button className="btn-facebook" onClick={handleFacebookLogin}>Sign in with Facebook</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
