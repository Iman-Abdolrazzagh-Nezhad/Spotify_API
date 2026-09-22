const isProvided = require("../Validators/Validation_utils/isProvided");
const isValidId = require("./Validation_utils/isValidId");
const fieldsCheck = require("./Validation_utils/fieldCheck");

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

function addPlaylistValidator(playlistObject) {
  isProvided(playlistObject, ["name"]);
  const allowedFields = ["name", "songs"];

  fieldsCheck(playlistObject, allowedFields);

  if (playlistObject.songs) {
    isSongIdValid(playlistObject.songs);
  }
}

function updatePlaylistValidator(playlistObject) {
  const allowedFields = ["name", "songs"];

  fieldsCheck(playlistObject, allowedFields);
  if (playlistObject.songs) {
    isSongIdValid(playlistObject.songs);
  }
}

module.exports = { addPlaylistValidator, updatePlaylistValidator };
