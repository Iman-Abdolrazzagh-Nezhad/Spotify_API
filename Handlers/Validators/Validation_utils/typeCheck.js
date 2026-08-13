const AppError = require("../../../Utilities/appError");
const validator = require("validator");

function isString(value, fieldName, model) {
  if (typeof value !== "string") {
    throw new AppError(`${model} ${fieldName} should be string`, 400);
  }
}

function isStringIfExist(value, fieldName, model) {
  if (value && typeof value !== "string") {
    throw new AppError(`${model} ${fieldName} should be string`, 400);
  } else if (value) {
    return true;
  }
}

function isNumberAndPositiveIfExist(value, fieldName, model) {
  if (value && (typeof value !== "number" || value < 0)) {
    throw new AppError(`${model} ${fieldName} must be a positive number.`, 400);
  } else if (value) {
    return true;
  }
}

function isInstanceOfDate(value) {
  return value instanceof Date;
}

function isInstanceOfDateIfExist(value) {
  if ((value && value instanceof Date) || !value) {
    return true;
  }
}

const IS_URL_OPTIONS = {
  require_tld: false, // for testing purposes
  require_protocol: true,
  allow_underscores: true,
};

function isValidURL(value, fieldName, model) {
  try {
    validator.isURL(value, IS_URL_OPTIONS);
  } catch {
    throw new AppError(`${model} ${fieldName} must be a valid URL.`, 400);
  }
}

function isValidURLIfExist(value, fieldName, model) {
  if (value) {
    try {
      validator.isURL(value, IS_URL_OPTIONS);
    } catch {
      throw new AppError(`${model} ${fieldName} must be a valid URL.`, 400);
    }
  } else if (value) {
    return true;
  }
}

function isEmail(value, model) {
  try {
    validator.isEmail(value);
  } catch {
    throw new AppError(`${model} Email is not valid.`, 400);
  }
}

function isEmailIfExist(value, model) {
  if (value) {
    try {
      validator.isEmail(value);
    } catch {
      throw new AppError(`${model} Email is not valid.`, 400);
    }
  } else if (value) {
    return true;
  }
}

module.exports = {
  isString,
  isStringIfExist,
  isNumberAndPositiveIfExist,
  isInstanceOfDate,
  isInstanceOfDateIfExist,
  isValidURL,
  isValidURLIfExist,
  isEmail,
  isEmailIfExist,
};
