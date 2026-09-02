const express = require("express");
const musicHandler = require("../Handlers/musicHandler");

const router = express.Router();

router
  .route("/")
  .get(musicHandler.getAllMusicHandler)
  .post(musicHandler.addMusicHandler);

router
  .route("/:id")
  .get(musicHandler.getMusicHandler)
  .patch(musicHandler.updateMusicHandler)
  .delete(musicHandler.deleteMusicHandler);

module.exports = router;
