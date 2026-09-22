const AppError = require("../../../Utilities/appError");

function fieldsCheck(userObject, allowedFields) {
  for (const field in userObject) {
    if (!allowedFields.includes(field)) {
      throw new AppError(`Field ${field} is an invalid input.`);
    }
  }
}

module.exports = fieldsCheck;
