const Music = require("../Models/MusicModel");

async function getAllMusic() {
  return await Music.find();
}

async function createMusic(userObject) {
  userObject.createdAt = new Date();
  return await Music.insertOne(userObject);
}

async function getMusic(queryParam) {
  let query = {};
  query._id = queryParam;
  return await Music.findOne(query);
}

async function updateMusic(musicId, updateObject) {
  updateObject.updatedAt = new Date();

  return await Music.findByIdAndUpdate(musicId, updateObject, {
    runValidators: true,
    new: true,
  });
}

async function deleteMusic(id) {
  return await Music.findByIdAndDelete(id);
}

module.exports = {
  getAllMusic,
  createMusic,
  getMusic,
  updateMusic,
  deleteMusic,
};
