// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BoardView from './pages/BoardView';
import './App.css';

// We need to create a component for the header to use the useNavigate hook
const AppHeader = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    // Remove the token from storage
    localStorage.removeItem('token');
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <header className="app-header">
      <Link to="/" style={{ textDecoration: 'none', flexGrow: 1 }}>
        <h1>ProjectFlow</h1>
      </Link>
      {/* Only show the logout button if the user is logged in */}
      {token && (
        <button onClick={handleLogout} className="logout-button">Logout</button>
      )}
    </header>
  );
};


function App() {
  return (
    <Router>
      <div className="app-container">
        <AppHeader />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/board/:boardId" element={<BoardView />} />
            <Route path="/" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
