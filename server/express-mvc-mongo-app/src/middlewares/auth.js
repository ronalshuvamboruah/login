const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = async function auth(req, res, next) {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) return res.status(401).json({ message: 'Authorization token missing' });

    const secret = process.env.JWT_SECRET || 'change_this_secret';
    const payload = jwt.verify(token, secret);

    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};