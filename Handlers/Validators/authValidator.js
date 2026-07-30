const validator = require("validator");
const AppError = require("../../Utilities/appError");
const isProvided = require("../../Utilities/isProvided");
const restrictTo = require("../../Utilities/restrictTo");

async function validateLogin(req) {
  await isProvided(req, ["email", "password"]);

  if (4 > req.body.password.length) {
    throw new AppError("Password is less than 4 letters.", 400);
  }
}

async function validateSignup(req) {
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
}

async function validateUserToken(req) {
  var token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  const realJWT = await validator.isJWT(token);

  if (!realJWT || !token || token == "null") {
    throw new AppError("You are not logged in.", 401);
  }

  return token;
}

async function validateAdminAccess(req) {
  if (!(await restrictTo(req.locals.user.role, "admin"))) {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}

module.exports = {
  validateSignup,
  validateLogin,
  validateUserToken,
  validateAdminAccess,
};
