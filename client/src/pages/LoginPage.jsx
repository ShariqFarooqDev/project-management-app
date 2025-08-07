// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; // Import the shared auth styles

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back!</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p className="auth-link">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
