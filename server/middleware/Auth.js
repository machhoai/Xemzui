const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { isTokenBlacklisted } = require('./Blacklist.js');
const dotenv = require('dotenv');

dotenv.config();

//tao access token
const createAccessToken = (email, isAdmin) => {
    return jwt.sign({ email:email , isAdmin: isAdmin }, process.env.SECRET_ACCESS, { expiresIn: process.env.EXPIRES_IN_ACCESS });
}

//tao refresh token
const createRefreshToken = (email, isAdmin) => {
    return jwt.sign({ email:email , isAdmin: isAdmin }, process.env.SECRET_REFRESH, { expiresIn: process.env.EXPIRES_IN_REFRESH });
}

//xin cấp lại access token mới
const refreshAccessToken = (refreshToken, res) => {
    if (!refreshToken || !isTokenBlacklisted(refreshToken)) {
        return res.status(403).json({ message: "Refresh token không hợp lệ" });
    }
    console.log("refreshAccessToken - refreshToken: ", refreshToken);
    try {
        const payload = jwt.verify(refreshToken, process.env.SECRET_REFRESH);
        const accessToken = jwt.sign({ phone: payload.phoneNumber, password: payload.password }, process.env.SECRET_ACCESS, {
            expiresIn: process.env.EXPIRES_IN_ACCESS,
        });
        console.log("refreshAccessToken - accessToken: ", accessToken);
        res.json({ accessToken });
    } catch (err) {
        res.status(403).json({ message: "Refresh token hết hạn" });
    }
}

// middleware xác thực token
function authenticate(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    console.log("authenticate - token: ", token);
    if (!token) {
        req.user = null;
        console.log("No token provided, user is not authenticated.");
        return next();
    }

    jwt.verify(token, process.env.SECRET_ACCESS, (err, user) => {
        if (err) {
            // if (err.name === "TokenExpiredError") {
            //     // Token hết hạn
            //     return res.status(403).json({ message: "Access token expired" });
            // }

            // // Token sai
            // req.user = null;
            // return next();
            return res.status(403);
        } 
        req.user = user;
        next();
    });
}

module.exports = { createAccessToken, createRefreshToken, refreshAccessToken, authenticate }