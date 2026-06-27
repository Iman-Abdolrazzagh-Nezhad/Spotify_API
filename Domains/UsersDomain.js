const userRepo = require("../Repositories/UsersRepo");
const AppError = require("../Utilities/appError");

async function getAllUser() {
  return await userRepo.getAllUser();
}

async function createUser(userObject) {
    return userRepo.createUser(userObject);
}

async function getUser(userObject, options = {}) {
    return userRepo.getUser(userObject, options.returnPassword);
}

async function updateUser(id, userUpdate) {
    return userRepo.updateUser(id, userUpdate);
}

async function deleteUser(id) {
    return userRepo.deleteUser(id);
}

module.exports = { getAllUser, createUser, getUser, updateUser, deleteUser };


