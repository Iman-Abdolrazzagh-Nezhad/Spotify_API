const validator = require("validator");
const AppError = require("../../Utilities/appError");
const isProvided = require("../Validators/Validation_utils/isProvided");
const restrictTo = require("./Validation_utils/restrictTo");
const validationUtils = require("./Validation_utils/typeCheck");

function fieldsCheck(allowedFields, body) {
  for (const field in body) {
    if (!allowedFields.includes(field)) {
      throw new AppError(`Field ${field} is an invalid input.`);
    }
  }
}

function checkPasswordLength(pwd) {
  if (4 > pwd.length) {
    throw new AppError("User password is less than 4 letters.", 400);
  }
}

function validateLogin(req) {
  isProvided(req, ["email", "password"]);

  fieldsCheck(["email", "password"], req.body);

  checkPasswordLength(req.body.password);
  validationUtils.isEmail(req.body.email, "User");
}

function validateSignup(req) {
  isProvided(req, ["email", "password", "passwordConfirmation", "name"]);

  const prohibited = [
    "role",
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

  fieldsCheck(
    ["email", "password", "passwordConfirmation", "name", "image"],
    req.body
  );

  checkPasswordLength(req.body.password);
  validationUtils.isEmail(req.body.email, "User");
  validationUtils.isValidURLIfExist(req.body.image, "image", "User");

  if (!(req.body.password === req.body.passwordConfirmation)) {
    throw new AppError("Password Confirmation is wrong", 400);
  }
}

function validateUserToken(req) {
  var token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token === "null") {
    throw new AppError("You are not logged in.", 401);
  }

  const realJWT = validator.isJWT(token);
  if (!realJWT) {
    throw new AppError("JWT token is malformed.", 401);
  }

  return token;
}

function validateAdminAccess(role) {
  if (!restrictTo(role, "admin")) {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}

module.exports = {
  validateSignup,
  validateLogin,
  validateUserToken,
  validateAdminAccess,
};
