// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BoardView from './pages/BoardView';
import './App.css'; // Import the new App CSS

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1>ProjectFlow</h1>
          </Link>
        </header>
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
