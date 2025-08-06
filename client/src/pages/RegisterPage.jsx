// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  // State to hold the form data (username and password)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(''); // State to hold any error messages
  const navigate = useNavigate(); // Hook to redirect the user after registration

  // Function to update state when user types in an input field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission (which reloads the page)
    try {
      // Send a POST request to the backend's register endpoint
      await axios.post('http://localhost:5000/api/auth/register', formData);
      // If registration is successful, redirect to the login page
      navigate('/login');
    } catch (err) {
      // If there's an error, update the error state to display a message
      setError('Registration failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {/* Display the error message if it exists */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RegisterPage;
