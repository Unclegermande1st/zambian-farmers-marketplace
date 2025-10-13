// backend/middleware/verifyUser.js
const { verifyToken } = require('../controllers/jwtUtils');

/**
 * Middleware to verify user authentication via JWT
 */
const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }

  req.user = decoded; // Attach user info to request
  next();
};

/**
 * Middleware to authorize specific roles
 * @param {Array} allowedRoles - Array of allowed roles ['farmer', 'buyer', 'admin']
 */
const authorizeRole = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ 
      error: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
    });
  }

  next();
};

module.exports = { verifyUser, authorizeRole };