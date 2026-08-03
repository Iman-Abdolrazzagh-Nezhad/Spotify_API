const AppError = require("../../Utilities/appError");
const idValidator = require("../../Utilities/idValidator");
const restrictTo = require("../../Utilities/restrictTo");

function roleParamValidator(paramId, userRole, restrictedRoles) {
  if (restrictTo(userRole, restrictedRoles)) {
    idValidator(paramId);
  } else {
    throw new AppError("You are not authorized to access this section.", 403);
  }
}
module.exports = roleParamValidator;
