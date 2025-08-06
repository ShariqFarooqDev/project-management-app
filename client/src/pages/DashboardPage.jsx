// client/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link

const DashboardPage = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [error, setError] = useState('');

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get('http://localhost:5000/api/boards', config);
      setBoards(response.data);
    } catch (err) {
      setError('Failed to fetch boards.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

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
      await axios.post('http://localhost:5000/api/boards', body, config);
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

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {boards.length > 0 ? (
          boards.map((board) => (
            // Wrap the board div in a Link component
            <Link to={`/board/${board._id}`} key={board._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
                <h3>{board.name}</h3>
              </div>
            </Link>
          ))
        ) : (
          <p>You have no boards. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
