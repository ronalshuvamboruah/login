const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving if it was modified
userSchema.pre('save', async function () {
  try {
    if (!this.isModified('password') || !this.password) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

// Instance method to compare plain text password with hashed
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate JWT
userSchema.methods.generateAuthToken = function () {
  const payload = { id: this._id, email: this.email };
  const secret = process.env.JWT_SECRET || 'change_this_secret';
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

// Remove sensitive fields when converting to JSON / object
function removeSensitive(doc, ret) {
  delete ret.password;
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
}
userSchema.set('toJSON', { transform: removeSensitive });
userSchema.set('toObject', { transform: removeSensitive });

module.exports = mongoose.model('User', userSchema);