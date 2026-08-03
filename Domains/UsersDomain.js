const userRepo = require("../Repositories/UsersRepo");

async function getAllUser() {
  return await userRepo.getAllUser();
}

async function createUser(userObject) {
  return await userRepo.createUser(userObject);
}

async function getUser(userObject, options = {}) {
  return await userRepo.getUser(userObject, options.returnPassword);
}

async function updateUser(id, userUpdate, options = {}) {
  return await userRepo.updateUser(id, userUpdate, options.login);
}

async function deleteUser(id) {
  return await userRepo.deleteUser(id);
}

module.exports = { getAllUser, createUser, getUser, updateUser, deleteUser };
