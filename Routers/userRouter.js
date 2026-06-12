const express = require("express");
const userController = require("../Controllers/userController");
const authController = require("../Controllers/authController");
const userValidator = require("../Validators/userValidator");
const idValidator = require("../Utilities/idValidator");

const router = express.Router();

//router.use(authController.verifyUserAuth, authController.restrictTo("admin"));

router.route("/").get(userValidator.getAllValidator).post(userValidator.addUser);

.route("/:id").get()

//router.route("/").get(userController.getAllUsers).post(userController.addUser);
//
//router
//  .route("/:id")
//  .get(idValidator, userController.getUser)
//  .patch(idValidator, userController.updateUser)
//  .delete(idValidator, userController.deleteUser);

module.exports = router;
