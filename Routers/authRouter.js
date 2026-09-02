const express = require("express");
const authHandler = require("../Handlers/authHandler");

const router = express.Router();

router.route("/login").post(authHandler.loginHandler);
router.route("/signup").post(authHandler.signupHandler);

router.route("/me").get(authHandler.getMeHandler);
router.route("/logout").get(authHandler.logoutHandler);

module.exports = router;
