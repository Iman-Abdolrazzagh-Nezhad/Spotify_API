const authController = require("../../../Controllers/authController");
const authValidator = require("../authValidator");

function withAuth(handler) {
  return async function (req, res) {
    const token = authValidator.validateUserToken(req);
    await authController.identifyUser(req, token);

    await handler(req, res);
  };
}

module.exports = withAuth;
