const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password } = req.body;

  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: 'Username already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, password } = req.body;
    const updates = {};

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) updates.username = username;

    if (password) {
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: 'New password must be different from the current password' });
      }
      const hashed = await bcrypt.hash(password, 10);
      updates.password = hashed;
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, updates, { new: true });
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
