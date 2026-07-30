const AppError = require("../../Utilities/appError");
const validator = require("validator");
const restrictTo = require("../../Utilities/restrictTo");
const isProvided = require("../../Utilities/isProvided");
const idValidator = require("../../Utilities/idValidator");

async function addUserValidator(req) {
  if (await restrictTo(req.locals.user.role, "admin")) {
    isProvided(req, ["email", "password", "passwordConfirmation", "name"]);

    if (4 > req.body.password.length) {
      throw new AppError("Password is less than 4 letters.", 400);
    }

    if (!(req.body.password === req.body.passwordConfirmation)) {
      throw new AppError("Password Confirmation is wrong", 400);
    }

    if (!validator.isEmail(req.body.email)) {
      throw new AppError("Email is not valid.", 400);
    }
  } else {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}

async function getUserValidator(req) {
  if (await restrictTo(req.locals.user.role, "admin")) {
    idValidator(req.params.id);
  } else {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}

async function updateUserValidator(req) {
  //return to handler if authorized and verified
  if (await restrictTo(req.locals.user.role, "admin")) {
    idValidator(req.params.id);

    const prohibited = [
      "password",
      "lastLoginAt",
      "createdAt",
      "isActive",
      "updatedAt",
    ];

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

async function deleteUserValidator(req) {
  //return to handler if authorized and verified
  if (await restrictTo(req.locals.user.role, "admin")) {
    idValidator(req.params.id);
  } else {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}

module.exports = {
  addUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
};
