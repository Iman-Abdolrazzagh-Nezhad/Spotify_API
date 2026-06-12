const User = require("../Models/UsersModel");
const bcrypt = require("bcryptjs");

async function createUser(userObject) {
  userObject.createdAt = Date.now();

  let user;
  try {
    userObject.password = await bcrypt.hash(userObject.password, 12);
    user = await User.insertOne(userObject);
  } catch (err) {
    throw err;
  }

  return user;
}

async function getUser(userObject, returnPassword = false) {
  const query = {};

  if (userObject.email) query.email = userObject.email;
  if (userObject.id) query._id = userObject.id;

  let user;

  try {
    if (returnPassword) {
      // For login we need the password to be selected
      return await User.findOne(query).select("+password");
    } else {
      return await User.findOne(query);
    }
  } catch (err) {
    throw err;
  }
}

async function getAllUser () {
    try {
        return await User.find();
    } catch (err) {
        throw err;
    }
}

async function updateUser(id, userUpdate) {
  try {
    return await User.findByIdAndUpdate(id, userUpdate, {
      runValidators: true,
      new: true,
    });
  } catch (err) {
    throw err;
  }
}

module.exports = { createUser, getUser, updateUser, getAllUser };
