const usersDomain = require("../Domains/UsersDomain");
const AppError = require("../Utilities/appError");


async function getAllUsers(req, res) {
  let data;
  data = await usersDomain.getAllUser();

  if (!data) {
    throw new AppError("Failed to find users.", 404);
  }

  //send response
  res.status(200).json({
    status: "success",
    numOfResults: data.length,
    data,
  });
}

async function getUser(req, res) {
  //query for user
  const data = await usersDomain.getUser(req.params.id);

  if (!data) {
    throw new AppError("User not found.", 404);
  }

  //send response
  res.status(200).json({
    status: "success",
    data,
  });
}

async function addUser(req, res) {
  //creating new user object
  const newUser = {
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    createdAt: Date.now(),
  };

  //creating new user in db
  const data = await usersDomain.createUser(newUser);


  if (!data) {
    throw new AppError("Failed to create the user.", 500);
  }

  //send response
  res.status(201).json({
    status: "success",
    data,
  });
}

async function updateUser(req, res) {
  //monitor update
  const update = req.body;

  //update user
  const data = await usersDomain.updateUser(req.params.id, update);

  if (!data) {
    throw new AppError("User with given id not found.", 404);
  }

  //send response
  res.status(200).json({
    status: "success",
    data,
  });
}

async function deleteUser(req, res) {
  await usersDomain.deleteUser(req.params.id);

  res.status(204).json({
    status: "success",
  });
}

module.exports = { getAllUsers, addUser, getUser, updateUser, deleteUser };
