const AppError = require("../../Utilities/appError");
const isProvided = require("../Validators/Validation_utils/isProvided");
const isValidId = require("./Validation_utils/isValidId");

function fieldsCheck(body, allowedFields) {
  for (const field in body) {
    if (!allowedFields.includes(field)) {
      throw new AppError(`Field ${field} is an invalid input.`, 400);
    }
  }
}

function isSongIdValid(songs) {
  if (songs) {
    for (const musicId of songs) {
      try {
        isValidId(musicId);
      } catch (err) {
        err.message = "There is a typo in provided musicId";
        throw err;
      }
    }
  }
}

function addPlaylistValidator(body) {
  isProvided(body, ["name"]);
  const allowedFields = ["name", "songs"];

  fieldsCheck(body, allowedFields);

  if (body.songs) {
    isSongIdValid(body.songs);
  }
}

function updatePlaylistValidator(body) {
  const allowedFields = ["name", "songs"];

  fieldsCheck(body, allowedFields);
  if (body.songs) {
    isSongIdValid(body.songs);
  }
}

module.exports = { addPlaylistValidator, updatePlaylistValidator };
