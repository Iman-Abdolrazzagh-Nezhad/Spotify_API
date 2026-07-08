const userRepo = require("../Repositories/UsersRepo");

async function getAllUser() {
  return await userRepo.getAllUser();
}

async function createUser(userObject) {
  return userRepo.createUser(userObject);
}

async function getUser(queryObject, options = {}) {
  return userRepo.getUser(queryObject, options.returnPassword);
}

async function updateUser(id, userUpdate, options = {}) {
  return userRepo.updateUser(id, userUpdate, options.login);
}

async function deleteUser(id) {
  return userRepo.deleteUser(id);
}

module.exports = { getAllUser, createUser, getUser, updateUser, deleteUser };
