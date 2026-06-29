const express = require("express");
const userValidator = require("../Handlers/Validators/userValidator");

const router = express.Router();

router
  .route("/")
  .get(userValidator.getAllValidator)
  .post(userValidator.addUser);

router
  .route("/:id")
  .get(userValidator.getUser)
  .patch(userValidator.updateUser)
  .delete(userValidator.deleteUser);

module.exports = router;
