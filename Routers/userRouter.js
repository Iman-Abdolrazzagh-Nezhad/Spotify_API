const express = require("express");
const userHandler = require("../Handlers/userHandler");

const router = express.Router();

router
  .route("/")
  .get(userHandler.getAllUserHandler)
  .post(userHandler.addUserHandler);

router
  .route("/:id")
  .get(userHandler.getUserHandler)
  .patch(userHandler.updateUserHandler)
  .delete(userHandler.deleteUserHandler);

module.exports = router;
