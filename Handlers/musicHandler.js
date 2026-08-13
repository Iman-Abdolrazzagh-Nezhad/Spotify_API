const musicController = require("../Controllers/musicController");
const musicValidator = require("./Validators/musicValidator");
const isValidId = require("./Validators/Validation_utils/isValidId");
const withAuth = require("./Validators/Validation_utils/withAuth");
const roleParamValidator = require("./Validators/Validation_utils/roleParamValidator");

//getAll, get, update -> not restricted
//add, delete -> restricted to admin and artits

async function getAllMusicHandler(req, res) {
  const data = await musicController.getAllMusicController();
  if (data.length === 0) {
    res.status(200).json({
      status: "success",
      data: "No music exist.",
    });
    return;
  }

  res.status(200).json({
    status: "success",
    numberOfResults: data.length,
    data,
  });
}

async function addMusicHandler(req, res) {
  musicValidator.addMusicValidator(req);

  const data = await musicController.addMusicController(req.body);

  res.status(201).json({
    status: "success",
    data,
  });
}

async function getMusicHandler(req, res) {
  isValidId(req.params.id);

  const data = await musicController.getMusicController(req.params.id);

  res.status(200).json({
    status: "success",
    data,
  });
}

async function updateMusicHandler(req, res) {
  musicValidator.updateMusicValidator(req);

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
  roleParamValidator(req.params.id, req.locals.user.role, ["admin", "artist"]);

  await musicController.deleteMusicController(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
}

module.exports = {
  getAllMusicHandler: withAuth(getAllMusicHandler),
  addMusicHandler: withAuth(addMusicHandler),
  getMusicHandler: withAuth(getMusicHandler),
  updateMusicHandler: withAuth(updateMusicHandler),
  deleteMusicHandler: withAuth(deleteMusicHandler),
};
