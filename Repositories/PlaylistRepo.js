const Playlist = require("../Models/PlaylistModlel");
const AppError = require("../Utilities/appError");

function addTimestampForEach(songs) {
  for (const songIndex in songs) {
    songs[songIndex] = {
      musicId: songs[songIndex],
      addedAt: Date.now(),
    };
  }
  return songs;
}

async function updatePlaylist(playlistId, playlistUpdate) {
  const { songs, ...fieldsToSet } = playlistUpdate;

  fieldsToSet.updatedAt = Date.now();

  const updateOps = { $set: fieldsToSet };

  if (songs) {
    updateOps.$push = { songs: { $each: addTimestampForEach(songs) } };
  }

  const playlist = await Playlist.findByIdAndUpdate(playlistId, updateOps, {
    runValidators: true,
    new: true,
  });

  if (!playlist) {
    throw new AppError("Playlist not found to update!", 404);
  }

  return playlist;
}

async function createPlaylist(playlistObject) {
  playlistObject.songs = addTimestampForEach(playlistObject.songs);
  playlistObject.createdAt = Date.now();
  return await Playlist.create(playlistObject);
}

async function getPlaylist(playlistId) {
  const query = {
    _id: playlistId,
  };

  const playlist = await Playlist.findOne(query);
  if (!playlist) {
    throw new AppError("Playlist not found!", 404);
  }

  return playlist;
}

async function getAllPlaylist() {
  return await Playlist.find();
}

async function deletePlaylist(playlistId) {
  const playlist = await Playlist.findByIdAndDelete(playlistId);

  if (!playlist) {
    throw new AppError("Playlist not found to delete!", 404);
  }

  return playlist;
}

module.exports = {
  createPlaylist,
  getPlaylist,
  updatePlaylist,
  getAllPlaylist,
  deletePlaylist,
};
