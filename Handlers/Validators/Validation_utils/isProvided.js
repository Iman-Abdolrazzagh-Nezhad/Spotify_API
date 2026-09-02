const AppError = require("../../../Utilities/appError");

function isProvided(req, requiredFields) {
  const missingField = requiredFields.find((field) => !req.body[field]);

  if (missingField) {
    throw new AppError(`${missingField} missing!`, 400);
  }
}

module.exports = isProvided;
