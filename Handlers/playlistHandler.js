const authValidator = require("./Validators/authValidator");
const playlistController = require("../Controllers/playlistController");
const playlistValidator = require("./Validators/playlistValidator");
const withAuth = require("./Validators/Validation_utils/withAuth");
const isValidId = require("./Validators/Validation_utils/isValidId");

async function getAllPlaylistHandler(req, res) {
  authValidator.validateAdminAccess(req.locals.user.role);

  const data = await playlistController.getAllPlaylistController();

  if (data.length === 0) {
    res.status(200).json({
      status: "success",
      data: "No playlist exist.",
    });
    return;
  }

  res.status(200).json({
    status: "success",
    numOfResults: data.length,
    data,
  });
}

async function addPlaylistHandler(req, res) {
  playlistValidator.addPlaylistValidator(req.body);

  const data = await playlistController.addPlaylistController(
    req.body,
    req.locals.user
  );

  res.status(201).json({
    status: "success",
    data,
  });
}

async function getPlaylistHandler(req, res) {
  isValidId(req.params.id);

  const data = await playlistController.getPlaylistController(
    req.params.id,
    req.locals.user
  );

  res.status(200).json({
    status: "success",
    data,
  });
}

async function updatePlaylistHandler(req, res) {
  isValidId(req.params.id);

  playlistValidator.updatePlaylistValidator(req.body);

  const data = await playlistController.updatePlaylistController(
    req.params.id,
    req.body,
    req.locals.user
  );

  res.status(200).json({
    status: "success",
    data,
  });
}

async function deletePlaylistHandler(req, res) {
  isValidId(req.params.id);

  const data = await playlistController.deletePlaylistController(
    req.params.id,
    req.locals.user
  );

  res.status(204).json({
    status: "success",
    data,
  });
}

module.exports = {
  getAllPlaylistHandler: withAuth(getAllPlaylistHandler),
  addPlaylistHandler: withAuth(addPlaylistHandler),
  getPlaylistHandler: withAuth(getPlaylistHandler),
  updatePlaylistHandler: withAuth(updatePlaylistHandler),
  deletePlaylistHandler: withAuth(deletePlaylistHandler),
};
