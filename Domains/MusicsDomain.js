const musicRepo = require("../Repositories/MusicsRepo");

async function getAllMusic() {
  return await musicRepo.getAllMusic();
}

async function createMusic(userObject) {
  return musicRepo.createMusic(userObject);
}

async function getMusic(musicId) {
  return musicRepo.getMusic(musicId);
}

async function updateMusic(musicId, updateObject) {
  return musicRepo.updateMusic(musicId, updateObject);
}

async function deleteMusic(id) {
  return musicRepo.deleteMusic(id);
}

module.exports = {
  getAllMusic,
  createMusic,
  getMusic,
  updateMusic,
  deleteMusic,
};
