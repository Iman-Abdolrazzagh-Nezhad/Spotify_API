const musicController = require("../Controllers/musicController");
const musicValidator = require("./Validators/musicValidator");
const idValidator = require("../Utilities/idValidator");
const withAuth = require("../Utilities/withAuth");

//getAll, get, update -> not restricted
//add, delete -> restricted to admin and artits

async function getAllMusicHandler(req, res) {
  const data = await musicController.getAllMusicController();
  if (data.length === 0) {
    res.status(200).json({
      status: "success",
      data: "No music exist.",
    });
  }

  res.status(200).json({
    status: "success",
    numberOfResults: data,
  });
}

async function addMusicHandler(req, res) {
  await musicValidator.addMusicValidator(req);

  const data = await musicController.addMusicController(req.body);

  res.status(201).json({
    status: "success",
    data,
  });
}

async function getMusicHandler(req, res) {
  idValidator(req.params.id);

  const data = await musicController.getMusicController(req.params.id);

  if (!data) {
    res.status(404).json({
      status: "fail",
      data: "No music exists with provided ID.",
    });
    return;
  }

  res.status(200).json({
    status: "success",
    data,
  });
}

async function updateMusicHandler(req, res) {
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
  await musicValidator.deleteMusicValidator(req);

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
