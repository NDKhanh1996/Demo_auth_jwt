const bcrypt = require('bcrypt');
const userSchema = require('../models/schemas/user');
const Security = require('../Security/security');
const jwt = require('jsonwebtoken');

class AuthController {
    static refreshTokenList = [];

    static async register(req, res) {
        try {
            const {username, email, password} = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await userSchema.create({
                username: username,
                email: email,
                password: hashedPassword
            });
            res.status(200).json(user)
        } catch (e) {
            res.status(500).json(e);
        }
    }

    static async login(req, res) {
        try {
            const {username, password} = req.body; //
            const user = await userSchema.findOne({username});//
            if (!user) {//
                return res.status(404).json("Wrong username");//
            }

            const validPassword = await bcrypt.compare(password, user["password"])//
            if (!validPassword) {//
                return res.status(404).json("Wrong password");//
            }

            const accessToken = Security.accessToken(user);//
            const refreshToken = Security.refreshToken(user);//
            AuthController.refreshTokenList.push(refreshToken);
            res.cookie("refreshToken", refreshToken, { //
                httpOnly: true,
                secure: false, // need set true when deploy
                path: "/",
                sameSite: "strict"
            });
            const {password: userPassword, ...userWithoutPassword} = user["_doc"];
            res.status(200).json({...userWithoutPassword, accessToken});//
        } catch (e) {//
            res.status(500).json(e);//
        }
    }

    static reqRefreshToken(req, res, next) {
        Security.reqRefreshToken(req, res, next, AuthController.refreshTokenList);
    }

    static async logout(req, res) {
        res.clearCookie("refreshToken");
        AuthController.refreshTokenList.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("Logout complete");
    }
}

module.exports = AuthController;