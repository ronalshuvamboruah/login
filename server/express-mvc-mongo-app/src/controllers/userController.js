const User = require('../models/userModel');
module.exports = class UserController {
  async createUser(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ ok: false, message: 'Missing required fields' });
      }

      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ message: 'Email already in use' });

      const user = await User.create({ name, email, password });

      // generate JWT (model method) and return sanitized user (toJSON removes password)
      const token = user.generateAuthToken();
      return res.status(201).json({ user: user.toJSON ? user.toJSON() : user, token });

    } catch (err) {
      // handle unique index race (duplicate key) gracefully
      if (err && err.code === 11000) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      next(err);
    }
  }

  // new: list all users
  async listUsers(req, res, next) {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      return res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ message: 'User deleted' });
    } catch (err) {
      next(err);
    }
  }
};