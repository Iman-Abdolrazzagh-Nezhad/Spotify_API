const authValidator = require("../Handlers/Validators/authValidator");
const authController = require("../Controllers/authController");

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

async function loginHandler(req, res) {
  await authValidator.validateLogin(req);

  const token = await authController.login(req);

  sendResponse(token, 200, res);
}

async function signupHandler(req, res) {
  await authValidator.validateSignup(req);

  const token = await authController.signup(req);

  sendResponse(token, 201, res);
}

async function getMeHandler(req, res) {
  const token = await authValidator.validateUserToken(req);

  await authController.identifyUser(req, token);

  const data = req.locals.user;

  res.status(200).json({
    status: "success",
    data,
  });
}

async function logoutHandler(req, res) {
  const token = await authValidator.validateUserToken(req);

  await authController.identifyUser(req, token);

  const cookieOptions = await authController.logout();

  res.cookie("jwt", "GoBackToYourOwnLamPesht", cookieOptions);

  res.status(200).json({
    status: "success",
  });
}

module.exports = { loginHandler, signupHandler, getMeHandler, logoutHandler };
