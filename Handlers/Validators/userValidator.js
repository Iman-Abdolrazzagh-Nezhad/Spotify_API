const AppError = require("../../Utilities/appError");
const validator = require("validator");
const restrictTo = require("../../Utilities/restrictTo");
const isProvided = require("../../Utilities/isProvided");
const idValidator = require("../../Utilities/idValidator");

async function addUserValidator(req) {
  //Send for controller if authorized and verified
  if (await restrictTo(req.locals.user.role, "admin")) {
    // Check for missing fields
    isProvided(req, ["email", "password", "passwordConfirmation", "name"]);
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
  } else {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}

async function getUserValidator(req) {
  //Send for handler if authorized and verified
  if (await restrictTo(req.locals.user.role, "admin")) {
    idValidator(req.params.id);
  } else {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}

async function updateUser(req) {
  //Send for controller if authorized and verified
  if (await restrictTo(req.locals.user.role, "admin")) {
    idValidator(req.params.id);

    const prohibited = ["password", "lastLoginAt", "createdAt", "isActive"];

    for (const field of prohibited) {
      if (field in req.body) {
        throw new AppError(
          `${field} is not changeable through this route.`,
          400
        );
      }
    }
  } else {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}

async function deleteUser(req) {
  //Send for controller if authorized and verified
  if (await restrictTo(req.locals.user.role, "admin")) {
    idValidator(req.params.id);
  } else {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}

module.exports = {
  addUserValidator,
  getUserValidator,
  updateUser,
  deleteUser,
};
