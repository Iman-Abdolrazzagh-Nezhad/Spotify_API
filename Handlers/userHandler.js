const userValidator = require("../Handlers/Validators/userValidator");
const userController = require("../Controllers/userController");
const authValidator = require("../Handlers/Validators/authValidator");
const withAuth = require("../Utilities/withAuth");

async function getAllUserHandler(req, res) {
  authValidator.validateAdminAccess(req.locals.user.role);

  const data = await userController.getAllUsersController(req);

  if (data.length === 0) {
    res.status(200).json({
      status: "success",
      data: "No user exist.",
    });
    return;
  }
  res.status(200).json({
    status: "success",
    numOfResults: data.length,
    data,
  });
}

async function getUserHandler(req, res) {
  await userValidator.getUserValidator(req);

  const data = await userController.getUserController(req);

  res.status(200).json({
    status: "success",
    data,
  });
}

async function addUserHandler(req, res) {
  await userValidator.addUserValidator(req);

  const data = await userController.addUserController(req.body);

  res.status(201).json({
    status: "success",
    data,
  });
}

async function updateUserHandler(req, res) {
  await userValidator.updateUserValidator(req);

  const data = await userController.updateUserController(req);

  res.status(200).json({
    status: "success",
    data,
  });
}

async function deleteUserHandler(req, res) {
  await userValidator.deleteUserValidator(req);

  await userController.deleteUserController(req);

  res.status(204).json({
    status: "success",
  });
}

module.exports = {
  getAllUserHandler: withAuth(getAllUserHandler),
  getUserHandler: withAuth(getUserHandler),
  addUserHandler: withAuth(addUserHandler),
  updateUserHandler: withAuth(updateUserHandler),
  deleteUserHandler: withAuth(deleteUserHandler),
};
