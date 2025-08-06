// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Get token from the Authorization header
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // The header format is "Bearer TOKEN"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token format is invalid, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add the user's ID from the token payload to the request object
    req.user = { id: decoded.id };
    // Call the next function in the chain
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
}

module.exports = authMiddleware;
