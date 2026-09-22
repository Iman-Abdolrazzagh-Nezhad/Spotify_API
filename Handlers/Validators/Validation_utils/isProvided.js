const AppError = require("../../../Utilities/appError");

function isProvided(body, requiredFields) {
  const missingField = requiredFields.find((field) => !body[field]);

  if (missingField) {
    throw new AppError(`${missingField} missing!`, 400);
  }
}

module.exports = isProvided;
