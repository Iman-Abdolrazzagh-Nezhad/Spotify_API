const musicRepo = require("../Repositories/MusicsRepo");

async function getAllMusic() {
  return await musicRepo.getAllMusic();
}

async function createMusic(userObject) {
  return await musicRepo.createMusic(userObject);
}

async function getMusic(musicId) {
  return await musicRepo.getMusic(musicId);
}

async function updateMusic(musicId, updateObject) {
  return await musicRepo.updateMusic(musicId, updateObject);
}

async function deleteMusic(id) {
  return await musicRepo.deleteMusic(id);
}

module.exports = {
  getAllMusic,
  createMusic,
  getMusic,
  updateMusic,
  deleteMusic,
};
