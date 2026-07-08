const userValidator = require("../Handlers/Validators/userValidator");
const userController = require("../Controllers/userController");
const authController = require("../Controllers/authController");
const authValidator = require("../Handlers/Validators/authValidator");
const AppError = require("../Utilities/appError");
const restrictTo = require("../Utilities/restrictTo");
const idValidator = require("../Utilities/idValidator");

async function getAllUserHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  await userValidator.getAllUserValidator(req);

  const data = await userController.getAllUsers(req);

  //send response
  res.status(200).json({
    status: "success",
    numOfResults: data.length,
    data,
  });
}

async function getUserHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  const data = await userController.getUser(req);

  //send response
  res.status(200).json({
    status: "success",
    data,
  });
}

async function addUserHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  await userValidator.addUserValidator(req);

  const data = await userController.addUser(req.body);

  //send response
  res.status(201).json({
    status: "success",
    data,
  });
}

async function updateUserHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  await userValidator.updateUser(req);

  const data = await userController.updateUser(req);

  //send response
  res.status(200).json({
    status: "success",
    data,
  });
}

async function deleteUserHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  await userValidator.deleteUser(req);

  await userController.deleteUser(req);

  res.status(204).json({
    status: "success",
  });
}

module.exports = {
  getAllUserHandler,
  getUserHandler,
  addUserHandler,
  updateUserHandler,
  deleteUserHandler,
};
