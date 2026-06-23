const { verifyToken } = require('../services/auth.service');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const session = verifyToken(token);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  req.admin = session; 
  next();
}

module.exports = authMiddleware;