// client/src/App.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BoardView from './pages/BoardView';
import { ThemeContext } from './context/ThemeContext';
import './App.css';

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to detect URL changes
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  // State to track if a user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // This effect will run every time the URL changes, keeping the login state accurate
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false); // Update state immediately
    navigate('/login');
  };

  return (
    <header className="app-header">
      <Link to="/" style={{ textDecoration: 'none', flexGrow: 1 }}>
        <h1>ProjectFlow</h1>
      </Link>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      {/* Show button based on the reactive isLoggedIn state */}
      {isLoggedIn && (
        <button onClick={handleLogout} className="logout-button">Logout</button>
      )}
    </header>
  );
};

function App() {
  // Note: We no longer need BrowserRouter here because it's in main.jsx
  return (
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
  );
}

export default App;
