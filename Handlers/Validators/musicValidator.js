const AppError = require("../../Utilities/appError");
const restrictTo = require("./Validation_utils/restrictTo");
const isProvided = require("../Validators/Validation_utils/isProvided");
const isValidId = require("./Validation_utils/isValidId");
const roleParamValidator = require("./Validation_utils/roleParamValidator");
const validationUtils = require("./Validation_utils/typeCheck");

const MODEL = "Music";

function fieldsCheck(body, untouchables = []) {
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

  for (const field in body) {
    if (!allowedFields.includes(field)) {
      throw new AppError(`Field ${field} is an invalid input.`);
    }
  }

  const prohibited = untouchables + ["updatedAt", "createdAt", "isActive"];

  for (const field of prohibited) {
    if (field in body) {
      throw new AppError(
        `${field} is not changeable through this route or at all.`,
        400
      );
    }
  }
}

function reformReleaseDate(date) {
  const { year = NaN, month = NaN, day = NaN } = date;
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month <= 0 ||
    month > 12 ||
    !Number.isInteger(day) ||
    day <= 0 ||
    day > 31
  ) {
    throw new AppError("Invalid release date format", 400);
  }

  const yy = String(year);
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");

  return new Date(`${yy}-${mm}-${dd}`);
}

function validateDuration(duration) {
  const { hours = 0, minutes = 0, seconds = 0 } = duration;

  if (
    !Number.isInteger(hours) ||
    hours < 0 ||
    !Number.isInteger(minutes) ||
    minutes < 0 ||
    minutes >= 60 ||
    !Number.isInteger(seconds) ||
    seconds < 0 ||
    seconds >= 60
  ) {
    throw new AppError("Invalid duration format", 400);
  }
}

function validateFeaturesList(list) {
  try {
    if (Array.isArray(list)) {
      for (const id of list) {
        if (id === undefined) {
          continue;
        }

        isValidId(id);
      }
    } else if (list !== undefined) {
      throw new AppError("Features must be an array of valid ids", 400);
    }
  } catch (err) {
    err.message = "There a typo in id provided for artists";
    throw err;
  }
}

function validateArtistId(id) {
  try {
    isValidId(id);
  } catch (err) {
    err.message = "There a typo in id provided for artists";
    throw err;
  }
}

function addMusicValidator(musicObject, caller) {
  if (restrictTo(caller.role, ["admin", "artist"])) {
    isProvided(musicObject, [
      "name",
      "artistId",
      "duration",
      "audioUrl",
      "coverImage",
      "lyrics",
      "language",
      "releaseDate",
    ]);

    fieldsCheck(musicObject, ["playCount", "likeCount"]);

    validationUtils.isString(musicObject.name, "name", MODEL);
    validationUtils.isString(musicObject.lyrics, "lyrics", MODEL);
    validationUtils.isString(musicObject.language, "language", MODEL);

    validationUtils.isValidURL(musicObject.audioUrl, "audioUrl", MODEL);
    validationUtils.isValidURL(musicObject.coverImage, "coverImage", MODEL);

    if (!validationUtils.isInstanceOfDate(musicObject.releaseDate)) {
      musicObject.releaseDate = reformReleaseDate(musicObject.releaseDate);
    }

    validateDuration(musicObject.duration);
    validateArtistId(musicObject.artistId);
    validateFeaturesList(musicObject.features);
  } else {
    throw new AppError("You are not authorized to access this section", 403);
  }
}

function updateMusicValidator(musicObject, musicId, caller) {
  roleParamValidator(musicId, caller.role, ["admin", "artist"]);
  fieldsCheck(musicObject);

  validationUtils.isStringIfExist(musicObject.name, MODEL);
  validationUtils.isStringIfExist(musicObject.lyrics, MODEL);
  validationUtils.isStringIfExist(musicObject.language, MODEL);
  validationUtils.isNumberAndPositiveIfExist(musicObject.likeCount, MODEL);
  validationUtils.isNumberAndPositiveIfExist(musicObject.playCount, MODEL);
  validationUtils.isValidURLIfExist(musicObject.audioUrl, "audioUrl", MODEL);
  validationUtils.isValidURLIfExist(
    musicObject.coverImage,
    "coverImage",
    MODEL
  );

  if (!validationUtils.isInstanceOfDateIfExist(musicObject.releaseDate)) {
    musicObject.releaseDate = reformReleaseDate(musicObject.releaseDate);
  }

  if (musicObject.duration) {
    validateDuration(musicObject.duration);
  }

  if (musicObject.artistId) {
    validateArtistId(musicObject.artistId);
  }

  if (musicObject.features) {
    validateFeaturesList(musicObject.features);
  }
}

module.exports = {
  addMusicValidator,
  updateMusicValidator,
};
