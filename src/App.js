import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './components/Login.js';
import Feed from './components/Feed.js';
import PrivateRoute from './components/PrivateRoute.js';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
