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

function addMusicValidator(req) {
  if (restrictTo(req.locals.user.role, ["admin", "artist"])) {
    isProvided(req.body, [
      "name",
      "artistId",
      "duration",
      "audioUrl",
      "coverImage",
      "lyrics",
      "language",
      "releaseDate",
    ]);

    fieldsCheck(req.body, ["playCount", "likeCount"]);

    validationUtils.isString(req.body.name, "name", MODEL);
    validationUtils.isString(req.body.lyrics, "lyrics", MODEL);
    validationUtils.isString(req.body.language, "language", MODEL);

    validationUtils.isValidURL(req.body.audioUrl, "audioUrl", MODEL);
    validationUtils.isValidURL(req.body.coverImage, "coverImage", MODEL);

    if (!validationUtils.isInstanceOfDate(req.body.releaseDate)) {
      req.body.releaseDate = reformReleaseDate(req.body.releaseDate);
    }

    validateDuration(req.body.duration);
    validateArtistId(req.body.artistId);
    validateFeaturesList(req.body.features);
  } else {
    throw new AppError("You are not authorized to access this section", 403);
  }
}

function updateMusicValidator(req) {
  roleParamValidator(req.params.id, req.locals.user.role, ["admin", "artist"]);
  fieldsCheck(req.body);

  validationUtils.isStringIfExist(req.body.name, MODEL);
  validationUtils.isStringIfExist(req.body.lyrics, MODEL);
  validationUtils.isStringIfExist(req.body.language, MODEL);
  validationUtils.isNumberAndPositiveIfExist(req.body.likeCount, MODEL);
  validationUtils.isNumberAndPositiveIfExist(req.body.playCount, MODEL);
  validationUtils.isValidURLIfExist(req.body.audioUrl, "audioUrl", MODEL);
  validationUtils.isValidURLIfExist(req.body.coverImage, "coverImage", MODEL);

  if (!validationUtils.isInstanceOfDateIfExist(req.body.releaseDate)) {
    req.body.releaseDate = reformReleaseDate(req.body.releaseDate);
  }

  if (req.body.duration) {
    validateDuration(req.body.duration);
  }

  if (req.body.artistId) {
    validateArtistId(req.body.artistId);
  }

  if (req.body.features) {
    validateFeaturesList(req.body.features);
  }
}

module.exports = {
  addMusicValidator,
  updateMusicValidator,
};
