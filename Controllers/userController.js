const User = require("../Models/UsersModel");
const usersDomain = require("../Domains/UsersDomain");
const AppError = require("../Utilities/appError");
const catchAsync = require("../Utilities/catchAsync");

async function getAllUsers (req, res) {
  let data;
  try {
    data = await usersDomain.getAllUser();
  } catch (err) {
    throw err;
  }

  if (!data) {
    throw new AppError("Failed to find users.", 404);
  }

  //send response
  res.status(200).json({
    status: "success",
    numOfResults: data.length,
    data,
  });
};

async function getUser (req, res) {
  //query for user
  const data = await User.findById(req.params.id);

  if (!data) {
    return next(new AppError("User with given id not found.", 404));
  }

  //send response
  res.status(200).json({
    status: "success",
    data,
  });
};

async function addUser (req, res) {
  //creating new user object
  const newUser = {
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    createdAt: Date.now(),
  };

  //creating new user in db
  let data;
  try {
    data = await usersDomain.createUser(newUser);
  } catch (err) {
    throw err;
  }

  if (!data) {
    return next(new AppError("Failed to create the user.", 500));
  }

  //send response
  res.status(201).json({
    status: "success",
    data,
  });
};

async function updateUser (req, res) {
  //monitor update
  const update = req.body;

  delete update.password;
  update.updatedAt = Date.now();

  //update user
  const data = await User.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });

  if (!data) {
    return next(new AppError("User with given id not found.", 404));
  }

  //send response
  res.status(200).json({
    status: "success",
    data,
  });
};

async function deleteUser (req, res) {
  const done = await User.findByIdAndDelete(req.params.id);

  if (!done) {
    return next(new AppError("User with given id not found.", 404));
  }

  res.status(204).json({
    status: "success",
  });
};

module.exports = { getAllUsers, addUser, getUser, updateUser, deleteUser }