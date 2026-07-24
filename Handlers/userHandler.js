const userValidator = require("../Handlers/Validators/userValidator");
const userController = require("../Controllers/userController");
const authController = require("../Controllers/authController");
const authValidator = require("../Handlers/Validators/authValidator");

async function getAllUserHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  await authValidator.validateAdminAccess(req);

  const data = await userController.getAllUsersController(req);

  res.status(200).json({
    status: "success",
    numOfResults: data.length,
    data,
  });
}

async function getUserHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  const data = await userController.getUserController(req);

  res.status(200).json({
    status: "success",
    data,
  });
}

async function addUserHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  await userValidator.addUserValidator(req);

  const data = await userController.addUserController(req.body);

  res.status(201).json({
    status: "success",
    data,
  });
}

async function updateUserHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  await userValidator.updateUserValidator(req);

  const data = await userController.updateUserController(req);

  res.status(200).json({
    status: "success",
    data,
  });
}

async function deleteUserHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  await userValidator.deleteUserValidator(req);

  await userController.deleteUserController(req);

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
