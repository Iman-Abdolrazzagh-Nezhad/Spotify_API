const authController = require("../Controllers/authController");
const authValidator = require("../Handlers/Validators/authValidator");

function withAuth(handler) {
  return async function (req, res) {
    const token = await authValidator.validateUserToken(req);
    await authController.identifyUser(req, token);

    await handler(req, res);
  };
}

module.exports = withAuth;
