const userRepo = require("../Repositories/UsersRepo");
const AppError = require("../Utilities/appError");

async function getAllUser() {
  try {
    return await userRepo.getAllUser();
  } catch (err) {
    throw err;
  }
}

async function createUser(userObject) {
  try {
    return userRepo.createUser(userObject);
  } catch (err) {
    throw err;
  }
}

async function getUser(userObject, options = {}) {
  try {
    return userRepo.getUser(userObject, options.returnPassword);
  } catch (err) {
    throw err;
  }
}

async function updateUser(id, userUpdate) {
  try {
    return userRepo.updateUser(id, userUpdate);
  } catch (err) {
    throw err;
  }
}

module.exports = { getAllUser, createUser, getUser, updateUser };
