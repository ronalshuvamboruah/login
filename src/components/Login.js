import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService.js';
import './Login.css';

export default function Login() {
  const [name, setName] = useState(''); // added
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await login(name, email, password); // pass name
      if (res && res.token) {
        navigate('/feed');
      } else {
        setErr('Login failed');
      }
    } catch (error) {
      setErr(error.response?.data?.message || error.message || 'Login error');
    }
  };

  return (
    <div className="fb-login-page">
      <header className="fb-header">facebook</header>
      <div className="fb-login-card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)} // added
          />
          <input
            type="email"
            placeholder="Email or phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="fb-login-btn">Log In</button>
          {err && <div className="fb-error">{err}</div>}
        </form>
      </div>
    </div>
  );
}