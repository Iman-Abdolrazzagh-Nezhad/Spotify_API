const AppError = require("../../../Utilities/appError");
const isValidId = require("./isValidId");
const restrictTo = require("./restrictTo");

function roleParamValidator(paramId, userRole, restrictedRoles) {
  if (restrictTo(userRole, restrictedRoles)) {
    isValidId(paramId);
  } else {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}
module.exports = roleParamValidator;
