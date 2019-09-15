const db = require("../../db/sqlite");

const findUserByUsername = async name => {
  const user = await db.findUserByUsername(name);
  return user;
};

const createUser = async user => {
  const createdUser = await db.createUser(user);
  return createdUser;
};

const getAllUsers = async timestamp => {
  const users = await db.getAllUsers(timestamp);
  return users;
};

const updateUser = async user => {
  const res = await db.updateUser(user);
  return res;
};

module.exports = {
  getAllUsers,
  findUserByUsername,
  createUser,
  updateUser
};
