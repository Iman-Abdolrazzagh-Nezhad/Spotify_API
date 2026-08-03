const authValidator = require("../Handlers/Validators/authValidator");
const authController = require("../Controllers/authController");
const withAuth = require("../Utilities/withAuth");

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

  const token = await authController.loginController(req);

  sendResponse(token, 200, res);
}

async function signupHandler(req, res) {
  await authValidator.validateSignup(req);

  const token = await authController.signupController(req);

  sendResponse(token, 201, res);
}

async function getMeHandler(req, res) {
  const data = req.locals.user;

  res.status(200).json({
    status: "success",
    data,
  });
}

async function logoutHandler(req, res) {
  const cookieOptions = await authController.logoutController();

  res.clearCookie("jwt", cookieOptions);

  res.status(200).json({
    status: "success",
  });
}

module.exports = {
  loginHandler: loginHandler,
  signupHandler: signupHandler,
  getMeHandler: withAuth(getMeHandler),
  logoutHandler: withAuth(logoutHandler),
};
