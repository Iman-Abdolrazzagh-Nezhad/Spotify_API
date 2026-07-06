const usersDomain = require("../Domains/UsersDomain");
const AppError = require("../Utilities/appError");


async function getAllUsers() {
  const data = await usersDomain.getAllUser();

  if (!data) {
    throw new AppError("Failed to find users.", 404);
  }

  return data;
}

async function getUser(req) {
  const queryObject = {
    id : req.params.id
  }
  //query for user
  const data = await usersDomain.getUser(queryObject);

  if (!data) {
    throw new AppError("User not found.", 404);
  }

  return data;
}

async function addUser(body) {
  //creating new user object
  const newUser = {
    name: body.name,
    password: body.password,
    email: body.email,
  };

  //creating new user in db
  const data = await usersDomain.createUser(newUser);

  if (!data) {
    throw new AppError("Failed to create the user.", 500);
  }

  return data;
}

async function updateUser(req) {
  //monitor update
  const update = req.body;

  //update user
  const data = await usersDomain.updateUser(req.params.id, update);

  if (!data) {
    throw new AppError("User with given id not found.", 404);
  }

  return data;
}

async function deleteUser(req) {
  await usersDomain.deleteUser(req.params.id);
}

module.exports = { getAllUsers, addUser, getUser, updateUser, deleteUser };
