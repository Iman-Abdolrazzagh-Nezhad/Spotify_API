const mongoose = require("mongoose");
const AppError = require("./appError");

function isValidId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("ID param is not valid", 400);
  }
  return;
}

module.exports = isValidId;
