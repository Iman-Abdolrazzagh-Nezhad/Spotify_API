const AppError = require("../Utilities/appError");

function isProvided(req, requiredFields) {
  const missingField = requiredFields.find((field) => !req.body[field]);

  if (missingField) {
    const error = new AppError(`${missingField} missing!`, 400);
    throw error;
  }
}

module.exports = isProvided