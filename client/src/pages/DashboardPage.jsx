// client/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardPage = () => {
  // State to store the list of boards
  const [boards, setBoards] = useState([]);
  // State to store the name of the new board being created
  const [newBoardName, setNewBoardName] = useState('');
  const [error, setError] = useState('');

  // This function will fetch the boards from the backend
  const fetchBoards = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        return;
      }

      // Create the authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Make the API call to get the boards
      const response = await axios.get('http://localhost:5000/api/boards', config);
      setBoards(response.data); // Update the state with the fetched boards
    } catch (err) {
      setError('Failed to fetch boards.');
      console.error(err);
    }
  };

  // useEffect hook to run fetchBoards when the component loads
  useEffect(() => {
    fetchBoards();
  }, []); // The empty array [] means this effect runs only once on mount

  // Function to handle the creation of a new board
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName) return;

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const body = { name: newBoardName };
      
      // Make the API call to create the new board
      await axios.post('http://localhost:5000/api/boards', body, config);
      
      // Reset the input field and refetch the boards to update the list
      setNewBoardName('');
      fetchBoards(); 
    } catch (err) {
        setError('Failed to create board.');
        console.error(err);
    }
  };

  return (
    <div>
      <h2>Your Boards</h2>
      
      {/* Form to create a new board */}
      <form onSubmit={handleCreateBoard}>
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="New board name"
          required
        />
        <button type="submit">Create Board</button>
      </form>

      {/* Display any errors */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* List of existing boards */}
      <div>
        {boards.length > 0 ? (
          boards.map((board) => (
            <div key={board._id} style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
              <h3>{board.name}</h3>
            </div>
          ))
        ) : (
          <p>You have no boards. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
