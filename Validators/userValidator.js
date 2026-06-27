const userController = require("../Controllers/userController");
const authValidator = require("../Validators/authValidator");

const AppError = require("../Utilities/appError");
const validator = require("validator");
const restrictTo = require("../Utilities/restrictTo");
const isProvided = require("../Utilities/isProvided");
const idValidator = require("../Utilities/idValidator");

async function getAllValidator(req, res) {
  await authValidator.identifyUser(req);

  //Send for controller if authorized and verified
  if (await restrictTo(req.locals.user.role, "admin")) {
    await userController.getAllUsers(req, res);
  } else {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}

async function addUser(req, res) {
  await authValidator.identifyUser(req);

  //Send for controller if authorized and verified
  if (await restrictTo(req.locals.user.role, "admin")) {
    // Check for missing fields
    await isProvided(req, [
      "email",
      "password",
      "passwordConfirmation",
      "name",
    ]);
    // Check for min length of the password
    if (4 > req.body.password.length) {
      throw new AppError("Password is less than 4 letters.", 400);
    }

    // Check for password and passwordConfirmation similarity
    if (!(req.body.password === req.body.passwordConfirmation)) {
      throw new AppError("Password Confirmation is wrong", 400);
    }

    // Check for valid email
    if (!validator.isEmail(req.body.email)) {
      throw new AppError("Email is not valid.", 400);
    }

    await userController.addUser(req, res);
  } else {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}

async function getUser(req, res) {
  await authValidator.identifyUser(req);

  //Send for controller if authorized and verified
  if (await restrictTo(req.locals.user.role, "admin")) {
    await idValidator(req.params.id);

    await userController.getUser(req, res);
  } else {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}

async function updateUser(req, res) {
  await authValidator.identifyUser(req);

  //Send for controller if authorized and verified
  if (await restrictTo(req.locals.user.role, "admin")) {
    await idValidator(req.params.id);

    //remove not permmited data
    delete req.body.password;
    delete req.body.isActive;
    delete req.body.createdAt;
    delete req.body.lastLoginAt;

    await userController.updateUser(req, res);
  } else {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}

async function deleteUser(req, res) {
    await authValidator.identifyUser(req);

    //Send for controller if authorized and verified
    if (await restrictTo(req.locals.user.role, "admin")) {
      await idValidator(req.params.id);

      await userController.deleteUser(req, res);
    } else {
      throw new AppError("You are not authorized to access this section.", 403);
    }
}

module.exports = { getAllValidator, addUser, getUser, updateUser, deleteUser };
