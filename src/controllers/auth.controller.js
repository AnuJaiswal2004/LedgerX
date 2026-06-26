const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../config/models/user.model');
const { sendRegistrationEmail } = require('../services/email.services');

async function register(req, res) {
  try {
    const isUserExists = await User.findOne({ email: req.body.email });
    if (isUserExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username
    });
    await sendRegistrationEmail(user.email, user.username);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token);
    res.json({
        user: {
            id: user._id,
            username: user.username,
        }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { register, login };
