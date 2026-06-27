const express = require("express");
const authValidator = require("../Validators/authValidator");

const router = express.Router();

router.route("/login").post(authValidator.validateLogin);
router.route("/signup").post(authValidator.validateSignup);

router.route("/me").get(authValidator.validateMe);
router.route("/logout").get(authValidator.validateLogout);

module.exports = router;
