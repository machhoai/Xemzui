const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { isTokenBlacklisted } = require('./Blacklist.js');
const dotenv = require('dotenv');

dotenv.config();

//tao access token
const createAccessToken = (email, isAdmin) => {
    return jwt.sign({ email: email, isAdmin: isAdmin }, process.env.SECRET_ACCESS, { expiresIn: process.env.EXPIRES_IN_ACCESS });
}

//tao refresh token
const createRefreshToken = (email, isAdmin) => {
    return jwt.sign({ email: email, isAdmin: isAdmin }, process.env.SECRET_REFRESH, { expiresIn: process.env.EXPIRES_IN_REFRESH });
}

//xin cấp lại access token mới
const refreshAccessToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken || !isTokenBlacklisted(refreshToken)) {
        return res.status(403).json({ message: "Refresh token không hợp lệ" });
    }
    console.log("refreshAccessToken - refreshToken: ", refreshToken);
    try {
        const payload = jwt.verify(refreshToken, process.env.SECRET_REFRESH);
        const newAccessToken = jwt.sign({ email: payload.email, isAdmin: payload.isAdmin }, process.env.SECRET_ACCESS, {
            expiresIn: process.env.EXPIRES_IN_ACCESS,
        });
        console.log("refreshAccessToken - accessToken: ", newAccessToken);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000,
        })
            .json({ message: 'Access token refreshed' });
    } catch (err) {
        res.status(403).json({ message: "Refresh token hết hạn" });
    }
}

// middleware xác thực token
function authenticate(req, res, next) {
    const token = req.cookies.accessToken;
    console.log("authenticate - token: ", token);
    if (!token) {
        req.user = null;
        console.log("No token provided, user is not authenticated.");
        return next();
    }

    jwt.verify(token, process.env.SECRET_ACCESS, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Access token không hợp lệ hoặc đã hết hạn" });
        }
        req.user = user;
        next();
    });
}

function authenticateAdmin(req, res, next) {
    const token = req.cookies.accessToken;
    console.log("authenticateAdmin - token: ", token);
    if (!token) {
        req.user = null;
        console.log("No token provided, user is not authenticated.");
        return next();
    }

    jwt.verify(token, process.env.SECRET_ACCESS, (err, user) => {
        if (err) {
            return res.status(403);
        }
        req.user = user;
        if (!user.isAdmin) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    });
}

module.exports = { createAccessToken, createRefreshToken, refreshAccessToken, authenticate, authenticateAdmin }