const musicsDomain = require("../Domains/MusicsDomain");

function toMilliseconds(duration) {
  const { hours = 0, minutes = 0, seconds = 0 } = duration;

  duration = hours * 3600000 + minutes * 60000 + seconds * 1000;
  return duration;
}

async function getAllMusicController() {
  return await musicsDomain.getAllMusic();
}

async function addMusicController(musicObject) {
  musicObject.duration = toMilliseconds(musicObject.duration);
  return await musicsDomain.createMusic(musicObject);
}

async function getMusicController(musicId) {
  return await musicsDomain.getMusic(musicId);
}

async function updateMusicController(musicId, updateObject) {
  if (musicObject.duration) {
    musicObject.duration = toMilliseconds(musicObject.duration);
  }
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
