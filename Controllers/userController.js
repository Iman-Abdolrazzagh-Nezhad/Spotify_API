const usersDomain = require("../Domains/UsersDomain");
const AppError = require("../Utilities/appError");

async function getAllUsersController() {
  const data = await usersDomain.getAllUser();

  if (!data) {
    throw new AppError("Intrnal server error.", 500);
  }

  return data;
}

async function getUserController(req) {
  const userObject = {
    id: req.params.id,
  };

  const data = await usersDomain.getUser(userObject);

  if (!data) {
    throw new AppError("User not found.", 404);
  }

  return data;
}

async function addUserController(body) {
  const newUser = {
    name: body.name,
    password: body.password,
    email: body.email,
    image: body.image,
  };

  const data = await usersDomain.createUser(newUser);

  if (!data) {
    throw new AppError("Failed to create the user.", 500);
  }

  return data;
}

async function updateUserController(req, userId = undefined) {
  const update = req.body;
  const id = userId || req.params.id;

  const data = await usersDomain.updateUser(id, update);

  if (!data) {
    throw new AppError("User with given id not found.", 404);
  }

  return data;
}

async function deleteUserController(req) {
  const data = await usersDomain.getUser({ id: req.params.id });

  if (!data) {
    throw new AppError("User does not exist anymore.", 404);
  }

  await usersDomain.deleteUser(req.params.id);
}

module.exports = {
  getAllUsersController,
  addUserController,
  getUserController,
  updateUserController,
  deleteUserController,
};
