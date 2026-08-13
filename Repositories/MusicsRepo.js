const Music = require("../Models/MusicModel");
const AppError = require("../Utilities/appError");

async function getAllMusic() {
  const data = await Music.find();

  return data;
}

async function createMusic(userObject) {
  userObject.createdAt = new Date();
  return await Music.create(userObject);
}

async function getMusic(queryParam) {
  let query = {};
  query._id = queryParam;
  const data = await Music.findOne(query);

  if (!data) {
    throw new AppError("Music not found!", 404);
  }

  return data;
}

async function updateMusic(musicId, updateObject) {
  updateObject.updatedAt = new Date();

  const data = await Music.findByIdAndUpdate(musicId, updateObject, {
    runValidators: true,
    new: true,
  });

  if (!data) {
    throw new AppError("Music not found to update!", 404);
  }

  return data;
}

async function deleteMusic(id) {
  const data = await Music.findByIdAndDelete(id);

  if (!data) {
    throw new AppError("Music not found to delete!", 404);
  }

  return data;
}

module.exports = {
  getAllMusic,
  createMusic,
  getMusic,
  updateMusic,
  deleteMusic,
};
