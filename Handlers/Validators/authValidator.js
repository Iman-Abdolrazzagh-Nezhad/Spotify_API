const validator = require("validator");
const AppError = require("../../Utilities/appError");
const isProvided = require("../../Utilities/isProvided");
const restrictTo = require("../../Utilities/restrictTo");

function fieldsCheck(allowedFields, body) {
  for (const field in body) {
    if (!allowedFields.includes(field)) {
      throw new AppError(`Field ${field} is an invalid input.`);
    }
  }
}

async function validateLogin(req) {
  await isProvided(req, ["email", "password"]);

  fieldsCheck(["email", "password"], req.body);

  if (4 > req.body.password.length) {
    throw new AppError("Password is less than 4 letters.", 400);
  }
  if (!validator.isEmail(req.body.email)) {
    throw new AppError("Email is not valid.", 400);
  }
}

async function validateSignup(req) {
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

  if (4 > req.body.password.length) {
    throw new AppError("Password is less than 4 letters.", 400);
  }

  if (!(req.body.password === req.body.passwordConfirmation)) {
    throw new AppError("Password Confirmation is wrong", 400);
  }

  if (!validator.isEmail(req.body.email)) {
    throw new AppError("Email is not valid.", 400);
  }

  if (
    req.body.coverImage &&
    !validator.isURL(req.body.coverImage, isURLOptions)
  ) {
    throw new AppError("coverImage is not a valid URL", 400);
  }
}

async function validateUserToken(req) {
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

  const realJWT = await validator.isJWT(token);
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
