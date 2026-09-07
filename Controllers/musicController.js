const musicsDomain = require("../Domains/MusicsDomain");

async function getAllMusicController() {
  return await musicsDomain.getAllMusic();
}

async function addMusicController(musicObject) {
  const { hours = 0, minutes = 0, seconds = 0 } = musicObject.duration;

  musicObject.duration = hours * 3600000 + minutes * 60000 + seconds * 1000;

  return await musicsDomain.createMusic(musicObject);
}

async function getMusicController(musicId) {
  return await musicsDomain.getMusic(musicId);
}

async function updateMusicController(musicId, updateObject) {
  return await musicsDomain.updateMusic(musicId, updateObject);
}

async function deleteMusicController(musicId) {
  return await musicsDomain.deleteMusic(musicId);
}

module.exports = {
  getAllMusicController,
  addMusicController,
  getMusicController,
  updateMusicController,
  deleteMusicController,
};
