const userManagerRouter = require('express').Router();
const UserController = require('../controllers/userManager.controller');
const Security = require("../Security/security");

userManagerRouter
    .use(Security.verifyToken, Security.checkAdmin)

    .get("/users", UserController.getAllUsers)
    .delete("/users/:id", UserController.deleteUser);

module.exports = userManagerRouter;