const User = require("../Models/UsersModel");
const bcrypt = require("bcryptjs");

async function createUser(userObject) {
  userObject.createdAt = Date.now();

  userObject.password = await bcrypt.hash(userObject.password, 12);
  const user = await User.insertOne(userObject);

  return user;
}

async function getUser(queryObject, returnPassword = false) {
  const query = {};

  if (queryObject.email) query.email = queryObject.email;
  if (queryObject.id) query._id = queryObject.id;

  if (returnPassword) {
    // For login we need the password to be selected
    return await User.findOne(query).select("+password");
  } else {
    return await User.findOne(query);
  }

}

async function getAllUser() {
  return await User.find();
}

async function updateUser(id, userUpdate) {
  userUpdate.updatedAt = Date.now()

  const data = await User.findByIdAndUpdate(id, userUpdate, {
    runValidators: true,
    new: true,
  });

  return data;
}

async function deleteUser(id) {
  await User.findByIdAndDelete(id);
}

module.exports = { createUser, getUser, updateUser, getAllUser, deleteUser };
