const User = require('../models/user.model');

const UserDAO = {
  async createUser(userData) {
    if (!userData || typeof userData !== 'object') {
      return null;
    }
    
    const newUser = new User(userData);
    return await newUser.save().catch(() => null);
  },

  async getUserById(userId) {
    if (!userId) {
      return null;
    }
    
    return await User.findById(userId).catch(() => null);
  },

  async getUserByEmail(email) {
    if (!email) {
      return null;
    }
    
    return await User.findOne({ email }).catch(() => null);
  },

  async getUserByUsername(username) {
    if (!username) {
      return null;
    }
    
    return await User.findOne({ username }).catch(() => null);
  },

  async updateUser(userId, updateData) {
    if (!userId || !updateData || typeof updateData !== 'object') {
      return null;
    }
    
    return await User.findByIdAndUpdate(userId, updateData, { new: true }).catch(() => null);
  },

  async deleteUser(userId) {
    if (!userId) {
      return null;
    }
    
    return await User.findByIdAndDelete(userId).catch(() => null);
  },

  async getAllUsers() {
    return await User.find().catch(() => []);
  }
};

module.exports = UserDAO;

