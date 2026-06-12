const sendErrorOnProd = (err, req, res) => {
  res.status(err.statusCode).json({
    status: "fail",
    error: err.message,
  });
};

const sendErrorOnDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.identified = false

  if (process.env.NODE_ENV === "development") {
    if (err.code === 11000) {
      err.statusCode = 400;
    }
    if (err.name === "ValidationError") {
      err.statusCode = 400;
    }
    sendErrorOnDev(err, req, res);
    //error with details
  } else {
    if (err.code === 11000) {
      err.message = "This email already exists.";
      err.statusCode = 400;
      err.identified = true
    }

    if (err.name === "ValidationError") {
      err.statusCode = 400;
      err.identified = true
    }

    if (! err.identified) {
        err.statusCode = 500;
        err.message = "INTERNAL ERROR!"
    }
    sendErrorOnProd(err, req, res);
    //details are cut from error
  }
};
//OPTIMIZATION NEEDED************************************
