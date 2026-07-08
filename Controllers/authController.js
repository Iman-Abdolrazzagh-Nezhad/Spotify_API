const User = require("../Models/UsersModel");
const AppError = require("../Utilities/appError");
const { promisify } = require("util");
const catchAsync = require("../Utilities/catchAsync");
const jwt = require("jsonwebtoken");
const UsersDomain = require("../Domains/UsersDomain");
const bcrypt = require("bcryptjs");

const createJWT = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP_DATE,
  });

  return token;
};

const sendResponse = (jwt, statusCode, res) => {
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXP_DATE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", jwt, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    jwt,
  });
};

async function login(req) {
  // Find and validate user
  const userObject = {
    email: req.body.email,
    password: req.body.password,
  };

  const user = await UsersDomain.getUser(
    { email: userObject.email },
    { returnPassword: true }
  );

  if (!user) {
    throw new AppError("Email or password is wrong.", 403); //Email is wrong
  }

  // Check if password is correct
  const match = await bcrypt.compare(userObject.password, user.password);
  if (!match) {
    throw new AppError("Email or password is wrong.", 403); //Password is wrong
  }
  // Make jwt and send
  const token = createJWT(user.id);

  await UsersDomain.updateUser(
    user.id,
    { lastLoginAt: Date.now() },
    { login: true }
  ); // login : true tells repo to not achange the updatedAt field for this data

  return token;
}

async function signup(req) {
  //validating new user data
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const user = await UsersDomain.createUser(newUser);

  //make jwt and send
  const token = createJWT(user.id);

  return token;
}

async function identifyUser(req, token) {
  const tokenUser = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await UsersDomain.getUser({ id: tokenUser.id });

  if (!user) {
    throw new AppError("User does not exist anymore.", 404);
  }

  req.locals = {};
  req.locals.user = user;
}

async function logout() {
  const cookieOptions = {
    expires: new Date(Date.now() + 1),
    httpOnly: true,
  };

  return cookieOptions;
}

module.exports = { login, signup, logout, identifyUser };
