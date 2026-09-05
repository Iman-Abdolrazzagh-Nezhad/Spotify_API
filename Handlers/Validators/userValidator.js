const AppError = require("../../Utilities/appError");
const authValidator = require("./authValidator");
const validationUtils = require("./Validation_utils/typeCheck");
const isProvided = require("..//Validators/Validation_utils/isProvided");
const roleParamValidator = require("./Validation_utils/roleParamValidator");

const ALL_ROLES = ["admin", "artist", "user"];
const MODEL = "User";

function fieldsCheck(body, isAddUser = false) {
  // For all usages shall not contain passwordConfirmation except addUser
  if (!isAddUser && body.passwordConfirmation !== undefined) {
    throw new AppError("Field passwordConfirmation is an invalid input.");
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

function isValidRoleIfExist(role) {
  if (role && !ALL_ROLES.includes(role)) {
    throw new AppError(`The ${role} is invalid.`, 400);
  }
}

function addUserValidator(req) {
  authValidator.validateAdminAccess(req.locals.user.role);
  isProvided(req.body, ["email", "password", "passwordConfirmation", "name"]);

  fieldsCheck(req.body, true);

  validationUtils.isEmail(req.body.email, MODEL);
  isValidRoleIfExist(req.body.role);

  if (4 > req.body.password.length) {
    throw new AppError("Password is less than 4 letters.", 400);
  }

  if (!(req.body.password === req.body.passwordConfirmation)) {
    throw new AppError("Password Confirmation is wrong", 400);
  }
}

function updateUserValidator(req) {
  //return to handler if authorized and verified
  roleParamValidator(req.params.id, req.locals.user.role, ["admin"]);
  fieldsCheck(req.body);

  validationUtils.isEmailIfExist(req.body.email, MODEL);
  isValidRoleIfExist(req.body.role);

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
}

module.exports = {
  addUserValidator,
  updateUserValidator,
};
