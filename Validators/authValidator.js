const authController = require("../Controllers/authController");
const validator = require("validator");
const AppError = require("../Utilities/appError");
const isProvided = require("../Utilities/isProvided");

async function validateSignup(req, res) {
  // Check for missing fields
  try {
    await isProvided(req, ["email", "password", "passwordConfirmation", "name"]);
  } catch (err) {
    throw err;
  }

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

  try {
    await authController.signup(req, res);
  } catch (err) {
    throw err;
  }
}

async function validateLogin(req, res) {
  // Check for missing fields
  try {
    await isProvided(req, ["email", "password"]);
  } catch (err) {
    throw err;
  }

  // Check for password min length
  if (4 > req.body.password.length) {
    throw new AppError("Password is less than 4 letters.", 400);
  }

  try {
    await authController.login(req, res);
  } catch (err) {
    throw err;
  }
}

async function identifyUser(req) {
  var token;


  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token == "null") {
    throw new AppError("You are not logged in.", 401);
  }

  try {
    await authController.identifyUser(req, token);
  } catch (err) {
    throw err;
  }
}

async function validateMe(req, res) {
    try {
        await identifyUser(req);
        await authController.getMe(req, res);
    } catch (err) {
        throw err;
    }
}

async function validateLogout(req, res) {
    try{
        await identifyUser(req);
        await authController.logout(req, res);
    } catch(err) {
        throw err;
    }
}

module.exports = { validateSignup, validateLogin, validateMe, validateLogout, identifyUser};
