const mongoose = require("mongoose");
const AppError = require("../../../Utilities/appError");

function isValidId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("ID param is not valid", 400);
  }
}

module.exports = isValidId;
