// services/userService.js
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');

async function getUserById(id) {
  return await User.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
}

async function updateUserProfile(id, updates) {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');

  if (updates.name) user.name = updates.name;
  if (updates.email) user.email = updates.email;
  if (updates.password) {
    const hashed = await bcrypt.hash(updates.password, 10);
    user.password = hashed;
  }
  if (updates.role) user.role = updates.role;

  await user.save();
  return user;
}

module.exports = {
  getUserById,
  updateUserProfile
};
