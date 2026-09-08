const playlistRepo = require("../Repositories/PlaylistRepo");
const musicRepo = require("../Repositories/MusicsRepo");
const AppError = require("../Utilities/appError");

function isAllowedAccess(playlist, caller) {
  if (String(playlist.ownerId) === caller.id || caller.role === "admin") {
    return true;
  } else {
    return false;
  }
}

async function areSongsPresent(songs) {
  if (songs) {
    for (const songId of songs) {
      try {
        await musicRepo.getMusic(songId);
      } catch (err) {
        throw new AppError(`Song ${songId} does not exist.`, 400);
      }
    }
  }
}

async function getAllPlaylistDomain() {
  return await playlistRepo.getAllPlaylist();
}

async function getPlaylistDomain(playlistId, caller) {
  const playlist = await playlistRepo.getPlaylist(playlistId);

  if (isAllowedAccess(playlist, caller)) {
    return playlist;
  } else {
    throw new AppError("You are not authorized to access this playlist.", 403);
  }
}

async function addPlaylistDomain(playlistObject) {
  await areSongsPresent(playlistObject.songs);

  return await playlistRepo.createPlaylist(playlistObject);
}

async function updatePlaylistDomain(playlistId, playlistUpdate, caller) {
  const playlist = await playlistRepo.getPlaylist(playlistId);

  if (isAllowedAccess(playlist, caller)) {
    await areSongsPresent(playlistUpdate.songs);
    return await playlistRepo.updatePlaylist(playlistId, playlistUpdate);
  } else {
    throw new AppError("You are not authorized to access this playlist.", 403);
  }
}

async function deletePlaylistDomain(playlistId, caller) {
  const playlist = await playlistRepo.getPlaylist(playlistId);

  if (isAllowedAccess(playlist, caller)) {
    return await playlistRepo.deletePlaylist(playlistId);
  } else {
    throw new AppError("You are not authorized to access this playlist.", 403);
  }
}

module.exports = {
  getAllPlaylistDomain,
  getPlaylistDomain,
  addPlaylistDomain,
  updatePlaylistDomain,
  deletePlaylistDomain,
};
