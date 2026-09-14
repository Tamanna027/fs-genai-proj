const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        });
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already exists with this username or email"
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash
    });

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    res.cookie("token", token);

    res.status(201).json({
        message: "user registered",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

/**
 * @name loginUserController
 * @description Login a user, expects email & password in req.body
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please provide email and password"
        });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "invalid email or password"
        });
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    res.cookie("token", token);

    res.status(200).json({
        message: "user logged in",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

async function logoutUserController(req, res) {
    const token = req.cookies?.token;

    if (token) {
        await tokenBlacklistModel.create({
            token
        });
    }

    res.clearCookie("token");

    res.status(200).json({
        message: "user logged out"
    });
}

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "user details fetched",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};