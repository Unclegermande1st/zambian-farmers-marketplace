const jwt = require('jsonwebtoken');
const db = require('../database');

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const userId = decoded.id;

    try {
      const [rows] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Unauthorized: User not found' });
      }

      // Attach user info to request object for downstream use
      req.user = rows[0];
      next();
    } catch (dbErr) {
      console.error('Database error in verifyUser middleware:', dbErr);
      return res.status(500).json({ error: 'Server error during user verification' });
    }
  });
};

module.exports = verifyUser;
