import React from 'react';
import { logout } from '../services/authService.js';
import { useNavigate } from 'react-router-dom';

export default function Feed() {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div style={{ padding: 20 }}>
      <h2>Feed</h2>
      <p>Protected content — you are logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}