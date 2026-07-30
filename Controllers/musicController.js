const musicsDomain = require("../Domains/MusicsDomain");
const AppError = require("../Utilities/appError");

async function getAllMusicController() {
  const data = await musicsDomain.getAllMusic();

  if (!data) {
    throw new AppError("Intrnal server error.", 500);
  }

  return data;
}

async function addMusicController(body) {
  const { hours = 0, minutes = 0, seconds = 0 } = body.duration;

  body.duration = hours * 3600000 + minutes * 60000 + seconds * 1000;

  const userObject = {
    name: body.name,
    artistId: body.artistId,
    features: body.features,
    duration: body.duration,
    releaseDate: body.releaseDate,
    audioUrl: body.audioUrl,
    coverImage: body.coverImage,
    lyrics: body.lyrics,
    language: body.language,
  };

  const data = musicsDomain.createMusic(userObject);

  if (!data) {
    throw new AppError("Failed to create the music.", 500);
  }

  return data;
}

async function getMusicController(musicId) {
  const data = await musicsDomain.getMusic(musicId);

  if (!data) {
    throw new AppError("Failed to find the music.", 500);
  }

  return data;
}

async function updateMusicController(musicId, body) {
  const allowedFields = [
    "name",
    "artistId",
    "features",
    "likeCount",
    "playCount",
    "duration",
    "releaseDate",
    "audioUrl",
    "coverImage",
    "lyrics",
    "language",
  ];

  const updateObject = {};

  for (const field of allowedFields) {
    if (field in body) {
      updateObject[field] = body[field];
    }
  }

  const data = await musicsDomain.updateMusic(musicId, updateObject);

  if (!data) {
    throw new AppError("Failed to update the music.", 500);
  }

  return data;
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
