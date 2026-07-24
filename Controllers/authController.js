const AppError = require("../Utilities/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const UsersDomain = require("../Domains/UsersDomain");
const bcrypt = require("bcryptjs");

const createJWT = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP_DATE,
  });

  return token;
};

async function loginController(req) {
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

  const match = await bcrypt.compare(userObject.password, user.password);
  if (!match) {
    throw new AppError("Email or password is wrong.", 403); //Password is wrong
  }

  const token = createJWT(user.id);

  await UsersDomain.updateUser(
    user.id,
    { lastLoginAt: Date.now() },
    { login: true }
  ); // login : true tells repo to not change the updatedAt field for this data

  return token;
}

async function signupController(req) {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const user = await UsersDomain.createUser(newUser);

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

async function logoutController() {
  const cookieOptions = {
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
  };

  return cookieOptions;
}

module.exports = {
  loginController,
  signupController,
  logoutController,
  identifyUser,
};
