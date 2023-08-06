const security = require('jsonwebtoken');
const jwt = require("jsonwebtoken");

class Security {
    static accessToken(user) {
        return jwt.sign({
                id: user._id,
                admin: user.admin
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn: "20s"}
        );
    }

    static refreshToken(user) {
        return jwt.sign({
                id: user._id,
                admin: user.admin
            },
            process.env.JWT_REFRESH_KEY,
            {expiresIn: "5m"}
        );
    }

    static verifyToken(req, res, next) {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1] // variable token include "Bearer + token" so i need delete Bearer
            security.verify(accessToken, process.env.JWT_SECRET_KEY, (err, user) => {
                if (err) {
                    res.status(403).json("Editing token is useless");
                } else {
                    req.user = user;
                    next();
                }
            })
        } else {
            res.status(401).json("You are not authenticated");
        }
    }

    static reqRefreshToken(req, res, next, refreshTokenList) { // use Redis and DB instead of refreshTokenList
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json("You are not authenticated");
        }

        if (!refreshTokenList.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid");
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }
            refreshTokenList = refreshTokenList.filter(token => token !== refreshToken);
            const newAccessToken = Security.accessToken(user);
            const newRefreshToken = Security.refreshToken(user);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false, // need set true when deploy
                path: "/",
                sameSite: "strict"
            });
            res.status(200).json({accessToken: newAccessToken});
        })
    }

    static checkAdmin(req, res, next) {
        req.user.admin ? next() : res.status(403).json("Only admin can do that");
    }
}

module.exports = Security;