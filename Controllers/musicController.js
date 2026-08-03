const musicsDomain = require("../Domains/MusicsDomain");
const AppError = require("../Utilities/appError");

async function getAllMusicController() {
  return await musicsDomain.getAllMusic();
}

async function addMusicController(body) {
  const { hours = 0, minutes = 0, seconds = 0 } = body.duration;

  body.duration = hours * 3600000 + minutes * 60000 + seconds * 1000;

  return musicsDomain.createMusic(body);
}

async function getMusicController(musicId) {
  return await musicsDomain.getMusic(musicId);
}

async function updateMusicController(musicId, updateObject) {
  const data = await musicsDomain.getMusic(musicId);

  if (!data) {
    throw new AppError("This Music does not exist anymore.", 404);
  }

  return await musicsDomain.updateMusic(musicId, updateObject);
}

async function deleteMusicController(musicId) {
  const data = await musicsDomain.getMusic(musicId);

  if (!data) {
    throw new AppError("This Music does not exist anymore.", 404);
  }

  return await musicsDomain.deleteMusic(musicId);
}

module.exports = {
  getAllMusicController,
  addMusicController,
  getMusicController,
  updateMusicController,
  deleteMusicController,
};
