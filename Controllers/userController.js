const usersDomain = require("../Domains/UsersDomain");

async function getAllUsersController() {
  return await usersDomain.getAllUser();
}

async function getUserController(userId) {
  const userObject = {
    id: userId,
  };

  return await usersDomain.getUser(userObject);
}

async function addUserController(body) {
  return await usersDomain.createUser(body);
}

async function updateUserController(userId, userObject) {
  return await usersDomain.updateUser(userId, userObject);
}

async function deleteUserController(userId) {
  await usersDomain.deleteUser(userId);
}

module.exports = {
  getAllUsersController,
  addUserController,
  getUserController,
  updateUserController,
  deleteUserController,
};
