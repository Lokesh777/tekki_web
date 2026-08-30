const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpire });
};

exports.register = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  
  const token = generateToken(user._id);
  
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  };
};

exports.getMe = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};
