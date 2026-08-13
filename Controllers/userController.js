const usersDomain = require("../Domains/UsersDomain");

async function getAllUsersController() {
  return await usersDomain.getAllUser();
}

async function getUserController(req) {
  const userObject = {
    id: req.params.id,
  };

  return await usersDomain.getUser(userObject);
}

async function addUserController(body) {
  return await usersDomain.createUser(body);
}

async function updateUserController(req, userId = undefined) {
  const id = userId || req.params.id;

  return await usersDomain.updateUser(id, req.body);
}

async function deleteUserController(req) {
  await usersDomain.deleteUser(req.params.id);
}

module.exports = {
  getAllUsersController,
  addUserController,
  getUserController,
  updateUserController,
  deleteUserController,
};
