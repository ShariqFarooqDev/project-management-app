// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; // Import the shared auth styles

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p className="auth-link">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
