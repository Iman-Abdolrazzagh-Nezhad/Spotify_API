const AppError = require("../../Utilities/appError");
const authValidator = require("./authValidator");
const validationUtils = require("./Validation_utils/typeCheck");
const isProvided = require("..//Validators/Validation_utils/isProvided");
const roleParamValidator = require("./Validation_utils/roleParamValidator");
const fieldsCheck = require("./Validation_utils/fieldCheck");

const ALL_ROLES = ["admin", "artist", "user"];
const MODEL = "User";

function isValidRoleIfExist(role) {
  if (role && !ALL_ROLES.includes(role)) {
    throw new AppError(`The ${role} is invalid.`, 400);
  }
}

function addUserValidator(userObject, caller) {
  authValidator.validateAdminAccess(caller.role);
  isProvided(userObject, ["email", "password", "passwordConfirmation", "name"]);

  const allowedFields = [
    "name",
    "password",
    "email",
    "image",
    "role",
    "passwordConfirmation",
  ];

  fieldsCheck(userObject, allowedFields);

  validationUtils.isEmail(userObject.email, MODEL);
  isValidRoleIfExist(userObject.role);

  if (4 > userObject.password.length) {
    throw new AppError("Password is less than 4 letters.", 400);
  }

  if (!(userObject.password === userObject.passwordConfirmation)) {
    throw new AppError("Password Confirmation is wrong", 400);
  }
}

function updateUserValidator(userObject, userId, caller) {
  //return to handler if authorized and verified
  roleParamValidator(userId, caller.role, ["admin"]);

  const allowedFields = ["name", "email", "image", "role"];

  fieldsCheck(userObject, allowedFields);

  validationUtils.isEmailIfExist(userObject.email, MODEL);
  isValidRoleIfExist(userObject.role);
}

module.exports = {
  addUserValidator,
  updateUserValidator,
};
