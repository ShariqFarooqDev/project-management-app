// client/src/App.jsx
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BoardView from './pages/BoardView';
import LandingPage from './pages/LandingPage';
import './App.css';

// The Header component now gets everything it needs from context.
const AppHeader = () => {
  const navigate = useNavigate();
  
  // For now, we check localStorage directly, which is simpler.
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    // We force a page reload to ensure all state is cleared.
    window.location.href = '/';
  };

  return (
    <header className="app-header">
      <Link to="/" style={{ textDecoration: 'none', flexGrow: 1 }}>
        <h1>ProjectFlow</h1>
      </Link>
      
     
      {/* This will now correctly show when a token is present */}
      {token && (
        <button onClick={handleLogout} className="logout-button">Logout</button>
      )}
    </header>
  );
};

function App() {
  return (
    <div className="app-container">
      <AppHeader />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/board/:boardId" element={<BoardView />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
