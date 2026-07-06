const userValidator = require("../Handlers/Validators/userValidator");
const userController = require("../Controllers/userController")
const AppError = require("../Utilities/appError");
const restrictTo = require("../Utilities/restrictTo");


async function getAllUserHandler (req, res) {
    let data;
    await userValidator.getAllUserValidator(req)

    if (await restrictTo(req.locals.user.role, "admin")) {
        data = await userController.getAllUsers(req, res);
    } else {
        throw new AppError("You are not authorized to access this section.", 403);
    }

    //send response
    res.status(200).json({
        status: "success",
        numOfResults: data.length,
        data,
    });
}

async function getUserHandler (req, res) {
    await userValidator.getUserValidator(req);

    const data = await userController.getUser(req);

    //send response
    res.status(200).json({
        status: "success",
        data,
    });
}

async function addUserHandler (req, res) {
    await userValidator.addUserValidator(req);

    const data = await userController.addUser(req.body);

    //send response
    res.status(201).json({
        status: "success",
        data,
    });
}

async function updateUserHandler (req, res) {
    await userValidator.updateUser(req);
    const data = await userController.updateUser(req);

    //send response
    res.status(200).json({
        status: "success",
        data,
    });
}

async function deleteUserHandler (req, res) {
    await userValidator.deleteUser(req);

    await userController.deleteUser(req);

    res.status(204).json({
        status: "success",
    });
}

module.exports = { getAllUserHandler, getUserHandler, addUserHandler, updateUserHandler, deleteUserHandler }