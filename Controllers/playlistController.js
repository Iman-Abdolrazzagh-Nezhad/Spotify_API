const playlistDomain = require("../Domains/PlaylistsDomain");

async function getAllPlaylistController() {
  return await playlistDomain.getAllPlaylistDomain();
}

async function getPlaylistController(playlistId, caller) {
  return await playlistDomain.getPlaylistDomain(playlistId, caller);
}

async function addPlaylistController(body, caller) {
  body.ownerId = caller.id;

  return await playlistDomain.addPlaylistDomain(body);
}

async function updatePlaylistController(playlistId, playlistUpdate, caller) {
  return await playlistDomain.updatePlaylistDomain(
    playlistId,
    playlistUpdate,
    caller
  );
}

async function deletePlaylistController(playlistId, caller) {
  return await playlistDomain.deletePlaylistDomain(playlistId, caller);
}

module.exports = {
  getAllPlaylistController,
  getPlaylistController,
  addPlaylistController,
  updatePlaylistController,
  deletePlaylistController,
};
