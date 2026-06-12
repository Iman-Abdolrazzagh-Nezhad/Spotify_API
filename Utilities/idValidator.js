const mongoose = require("mongoose");
const AppError = require("./appError");

function isValidId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Query id is not valid.", 400));
  }

  next();
}

module.exports = isValidId;
