const userController = require("../Controllers/userController");
const authValidator = require("../Validators/authValidator");

const AppError = require("../Utilities/appError");
const validator = require("validator");
const restrictTo = require("../Utilities/restrictTo");
const isProvided = require("../Utilities/isProvided");

async function getAllValidator (req, res) {
    try{
        await authValidator.identifyUser(req);
        if (await restrictTo (req.locals.user.role, "admin",)) {
            await userController.getAllUsers(req, res);
        } else {
            throw new AppError("You are not authorized to access this section.", 403)
        };
    } catch (err) {
        throw err;
    }
}

async function addUser (req, res) {
// Check for missing fields
  try {
    await isProvided(req, ["email", "password", "passwordConfirmation", "name"]);
  } catch (err) {
    throw err;
  }

  // Check for min length of the password
  if (4 > req.body.password.length) {
    throw new AppError("Password is less than 4 letters.", 400);
  }

  // Check for password and passwordConfirmation similarity
  if (!(req.body.password === req.body.passwordConfirmation)) {
    throw new AppError("Password Confirmation is wrong", 400);
  }

  // Check for valid email
  if (!validator.isEmail(req.body.email)) {
    throw new AppError("Email is not valid.", 400);
  }

  try {
    await userController.addUser(req, res);
  } catch (err) {
    throw err;
  }
}

async function getUser (req, res) {}

module.exports = { getAllValidator, addUser, getUser}