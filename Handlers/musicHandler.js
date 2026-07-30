const authValidator = require("./Validators/authValidator");
const authController = require("../Controllers/authController");
const musicController = require("../Controllers/musicController");
const musicValidator = require("./Validators/musicValidator");
const idValidator = require("../Utilities/idValidator");

//getAll, get, update -> not restricted
//add, delete -> restricted to admin and artits

async function getAllMusicHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  const data = await musicController.getAllMusicController();

  res.status(200).json({
    status: "success",
    numberOfResults: data,
  });
}

async function addMusicHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  await musicValidator.addMusicValidator(req);

  const data = await musicController.addMusicController(req.body);

  res.status(201).json({
    status: "success",
    data,
  });
}

async function getMusicHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  idValidator(req.params.id);

  const data = await musicController.getMusicController(req.params.id);

  res.status(200).json({
    status: "success",
    data,
  });
}

async function updateMusicHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  await musicValidator.updateMusicValidator(req);

  const data = await musicController.updateMusicController(
    req.params.id,
    req.body
  );

  res.status(200).json({
    status: "success",
    data,
  });
}

async function deleteMusicHandler(req, res) {
  const token = await authValidator.validateUserToken(req);
  await authController.identifyUser(req, token);

  await musicValidator.deleteMusicValidator(req);

  await musicController.deleteMusicController(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
}

module.exports = {
  getAllMusicHandler,
  addMusicHandler,
  getMusicHandler,
  updateMusicHandler,
  deleteMusicHandler,
};
