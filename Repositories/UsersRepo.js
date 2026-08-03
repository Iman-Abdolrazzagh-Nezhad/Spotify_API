const User = require("../Models/UsersModel");
const bcrypt = require("bcryptjs");
const AppError = require("../Utilities/appError");

async function createUser(userObject) {
  userObject.createdAt = Date.now();

  userObject.password = await bcrypt.hash(userObject.password, 12);

  return await User.create(userObject);
}

async function getUser(queryObject, returnPassword = false) {
  const query = {};

  if (queryObject.email) query.email = queryObject.email;
  if (queryObject.id) query._id = queryObject.id;

  let user;
  if (returnPassword) {
    // For login we need the password to be selected
    user = await User.findOne(query).select("+password");
  } else {
    user = await User.findOne(query);
  }

  if (!user) {
    throw new AppError("Internal error! try again.", 500);
  }

  return user;
}

async function getAllUser() {
  return await User.find();
}

async function updateUser(id, userUpdate, login = false) {
  if (!login) {
    userUpdate.updatedAt = Date.now();
  }

  const user = await User.findByIdAndUpdate(id, userUpdate, {
    runValidators: true,
    new: true,
  });

  if (!user) {
    throw new AppError("Internal error! try again.", 500);
  }

  return user;
}

async function deleteUser(id) {
  const user = User.findByIdAndDelete(id);

  if (!user) {
    throw new AppError("Internal error! try again.", 500);
  }

  return user;
}

module.exports = { createUser, getUser, updateUser, getAllUser, deleteUser };
