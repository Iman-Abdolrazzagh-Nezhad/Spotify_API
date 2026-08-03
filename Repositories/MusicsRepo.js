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
  return await Music.findOne(query);
}

async function updateMusic(musicId, updateObject) {
  updateObject.updatedAt = new Date();

  const data = await Music.findByIdAndUpdate(musicId, updateObject, {
    runValidators: true,
    new: true,
  });

  if (!data) {
    throw new AppError("Internal error! try again.", 500);
  }

  return data;
}

async function deleteMusic(id) {
  const data = await Music.findByIdAndDelete(id);

  if (!data) {
    throw new AppError("Internal error! try again.", 500);
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
