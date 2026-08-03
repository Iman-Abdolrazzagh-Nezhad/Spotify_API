const AppError = require("../../Utilities/appError");
const validator = require("validator");
const restrictTo = require("../../Utilities/restrictTo");
const isProvided = require("../../Utilities/isProvided");
const idValidator = require("../../Utilities/idValidator");
const roleParamValidator = require("./param-roleValidator");

function fieldsCheck(body) {
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

  const prohibited = ["updatedAt", "createdAt", "isActive"];

  for (const field of prohibited) {
    if (field in body) {
      throw new AppError(
        `${field} is not changeable through this route or at all.`,
        400
      );
    }
  }
}

async function addMusicValidator(req) {
  if (restrictTo(req.locals.user.role, ["admin", "artist"])) {
    isProvided(req, [
      "name",
      "artistId",
      "duration",
      "audioUrl",
      "coverImage",
      "lyrics",
      "language",
      "releaseDate",
    ]);

    fieldsCheck(req.body);

    try {
      await idValidator(req.body.artistId);

      if (Array.isArray(req.body.features)) {
        for (const id of req.body.features) {
          if (id === undefined) {
            continue;
          }

          await idValidator(id);
        }
      } else if (req.body.features !== undefined) {
        throw new AppError("Features must be an array of valid ids", 400);
      }
    } catch (err) {
      err.message = "There a typo in id provided for artists";
      throw err;
    }

    const isURLOptions = {
      require_tld: false, // for testing purposes
      require_protocol: true,
      allow_underscores: true,
    };

    if (!validator.isURL(req.body.audioUrl, isURLOptions)) {
      throw new AppError("audioUrl is not a valid URL", 400);
    }

    if (!validator.isURL(req.body.coverImage, isURLOptions)) {
      throw new AppError("coverImage is not a valid URL", 400);
    }

    const { hours = 0, minutes = 0, seconds = 0 } = req.body.duration;

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

    if (!(req.body.releaseDate instanceof Date)) {
      const { year = NaN, month = NaN, day = NaN } = req.body.releaseDate;

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

      req.body.releaseDate = new Date(`${yy}-${mm}-${dd}`);
    }

    if (typeof req.body.lyrics !== "string") {
      throw new AppError("Music lyrics should be string", 400);
    }

    if (typeof req.body.language !== "string") {
      throw new AppError("Music language should be string", 400);
    }
  } else {
    throw new AppError("You are not authorized to access this section", 403);
  }
}

async function updateMusicValidator(req) {
  idValidator(req.params.id);

  fieldsCheck(req.body);

  if (req.body.name && typeof req.body.name !== "string") {
    throw new AppError("Music name must be a string", 400);
  }

  if (req.body.artistId) {
    try {
      await idValidator(req.body.artistId);
    } catch (err) {
      err.message = "There a typo in id provided for artists";
      throw err;
    }
  }

  if (req.body.features) {
    try {
      if (Array.isArray(req.body.features)) {
        for (const id of req.body.features) {
          if (id === undefined) {
            continue;
          }

          await idValidator(id);
        }
      } else if (req.body.features !== undefined) {
        throw new AppError("Features must be an array of valid ids", 400);
      }
    } catch (err) {
      err.message = "There a typo in id provided for artists";
      throw err;
    }
  }

  if (
    req.body.likeCount &&
    (typeof req.body.likeCount !== "number" || req.body.likeCount < 0)
  ) {
    throw new AppError("Music like count must be a positive number.", 400);
  }

  if (
    req.body.playCount &&
    (typeof req.body.playCount !== "number" || req.body.likeCount < 0)
  ) {
    throw new AppError("Music play count must be a positive number.", 400);
  }

  const isURLOptions = {
    require_tld: false, // for testing purposes
    require_protocol: true,
    allow_underscores: true,
  };

  if (req.body.audioUrl && !validator.isURL(req.body.audioUrl, isURLOptions)) {
    throw new AppError("audioUrl is not a valid URL", 400);
  }

  if (
    req.body.coverImage &&
    !validator.isURL(req.body.coverImage, isURLOptions)
  ) {
    throw new AppError("coverImage is not a valid URL", 400);
  }

  if (req.body.duration) {
    const { hours = 0, minutes = 0, seconds = 0 } = req.body.duration;

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

  if (req.body.releaseDate && !(req.body.releaseDate instanceof Date)) {
    const { year = NaN, month = NaN, day = NaN } = req.body.releaseDate;

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

    req.body.releaseDate = new Date(`${yy}-${mm}-${dd}`);
  }

  if (req.body.lyrics && typeof req.body.lyrics !== "string") {
    throw new AppError("Music lyrics should be string", 400);
  }

  if (req.body.language && typeof req.body.language !== "string") {
    throw new AppError("Music language should be string", 400);
  }
}

function deleteMusicValidator(req) {
  roleParamValidator(req.params.id, req.locals.user.role, ["admin", "artist"]);
}

module.exports = {
  addMusicValidator,
  updateMusicValidator,
  deleteMusicValidator,
};
