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

async function login(req, res) {
  // Find and validate user
  const userObject = {
    email: req.body.email,
    password: req.body.password,
  };

  let user;
  try {
    user = await UsersDomain.getUser(
      { email: userObject.email },
      { returnPassword: true }
    );
  } catch (err) {
    throw err;
  }

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

  sendResponse(token, 200, res);

  //update last login when all process went smoothly

  try {
    await UsersDomain.updateUser(user.id, { lastLoginAt: Date.now() });
  } catch (err) {
    throw err;
  }
}

async function signup(req, res) {
  //validating new user data
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  let user;
  //creating new user
  try {
    user = await UsersDomain.createUser(newUser);
  } catch (err) {
    throw err;
  }

  //make jwt and send
  const token = createJWT(user.id);

  sendResponse(token, 201, res);
}

async function identifyUser(req, token) {

  let user;
  try {
    const tokenUser = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    user = await UsersDomain.getUser({ id: tokenUser.id });
  } catch (err) {
    throw err;
  }

  if (!user) {
    throw new AppError("User does not exist anymore.", 404);
  }

  req.locals = {};
  req.locals.user = user;

  return;
}

function getMe (req, res) {
  const data = req.locals.user;

  res.status(200).json({
    status: "success",
    data,
  });
};

function logout (req, res) {
  const cookieOptions = {
    expires: new Date(Date.now() + 1),
    httpOnly: true,
  };

  res.cookie("jwt", "GoBackToYourOwnLamPesht", cookieOptions);

  res.status(200).json({
    status: "success",
  });
};

module.exports = { login, signup, getMe, logout, identifyUser };
