const AuthController = require("../controllers/auth.controller");
const Security = require('../Security/security');
const authRouter = require('express').Router();

authRouter
    .post("/register", AuthController.register)
    .post("/login", AuthController.login)
    .post("/refresh", AuthController.reqRefreshToken)
    .post("/logout", Security.verifyToken, AuthController.logout);

module.exports = authRouter;