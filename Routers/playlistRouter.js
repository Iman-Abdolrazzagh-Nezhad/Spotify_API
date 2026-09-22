const playlistHandler = require("../Handlers/playlistHandler");

const express = require("express");

const router = express.Router();

router
  .route("/")
  .get(playlistHandler.getAllPlaylistHandler)
  .post(playlistHandler.addPlaylistHandler);

router
  .route("/:id")
  .get(playlistHandler.getPlaylistHandler)
  .patch(playlistHandler.updatePlaylistHandler)
  .delete(playlistHandler.deletePlaylistHandler);

module.exports = router;
