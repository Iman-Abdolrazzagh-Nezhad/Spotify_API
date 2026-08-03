const AppError = require("../../Utilities/appError");
const validator = require("validator");
const authValidator = require("./authValidator");
const isProvided = require("../../Utilities/isProvided");
const roleParamValidator = require("./param-roleValidator");

const ALL_ROLES = ["admin", "artist", "user"];

function fieldsCheck(body, isAddUser = false) {
  // For all usages shall not contain passwordConfirmation except addUser
  if (!isAddUser && body.passwordConfirmation !== undefined) {
    throw new AppError(`Field ${field} is an invalid input.`);
  }

  const allowedFields = [
    "name",
    "password",
    "email",
    "image",
    "role",
    "passwordConfirmation",
  ];

  for (const field in body) {
    if (!allowedFields.includes(field)) {
      throw new AppError(`Field ${field} is an invalid input.`);
    }
  }
}

async function addUserValidator(req) {
  authValidator.validateAdminAccess(req.locals.user.role);
  isProvided(req, ["email", "password", "passwordConfirmation", "name"]);

  fieldsCheck(req.body, true);

  if (4 > req.body.password.length) {
    throw new AppError("Password is less than 4 letters.", 400);
  }

  if (!(req.body.password === req.body.passwordConfirmation)) {
    throw new AppError("Password Confirmation is wrong", 400);
  }

  if (!validator.isEmail(req.body.email)) {
    throw new AppError("Email is not valid.", 400);
  }

  if (req.body.role && !ALL_ROLES.includes(req.body.role)) {
    throw new AppError(`The ${req.body.role} is invalid.`, 400);
  }
}

async function getUserValidator(req) {
  roleParamValidator(req.params.id, req.locals.user.role, ["admin"]);
}

async function updateUserValidator(req) {
  //return to handler if authorized and verified
  roleParamValidator(req.params.id, req.locals.user.role, ["admin"]);
  fieldsCheck(req.body);

  const prohibited = [
    "password",
    "lastLoginAt",
    "createdAt",
    "isActive",
    "updatedAt",
  ];

  for (const field of prohibited) {
    if (field in req.body) {
      throw new AppError(`${field} is not changeable through this route.`, 400);
    }
  }

  if (req.body.email && !validator.isEmail(req.body.email)) {
    throw new AppError("Email is not valid.", 400);
  }

  if (req.body.role && !ALL_ROLES.includes(req.body.role)) {
    throw new AppError(`The ${req.body.role} is invalid.`, 400);
  }
}

async function deleteUserValidator(req) {
  roleParamValidator(req.params.id, req.locals.user.role, ["admin"]);
}

module.exports = {
  addUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
};
