const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const passport = require("../modules/passport");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post('/register',
    body("username")
        .isLength({ min: 3, max: 20 })
        .escape()
        .trim()
        .withMessage("Username must be between 3 and 20 characters long")
        .isAlphanumeric()
        .withMessage("Username must be alphanumeric"),
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid email address"),
    body("password")
        .isLength({ min: 6, max: 20 })
        .escape()
        .trim()
        .withMessage("Password must be between 6 and 20 characters long"),
    body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }), authController.register);

authRouter.post('/login', passport.authenticate('local', {
        failureRedirect: '/login', session: false, failureFlash: true }),
    function (req, res) {
        const user = req.user;
        const token = jwt.sign({ id: user.id }, process.env.KEY, { expiresIn: '7d' });
        res.json({ user: user, token: token });
    }
);

authRouter.post('/refresh', async function (req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.KEY);
        res.status(200).json({message: "Token is valid"});
    } catch (e) {
        res.status(401).json({message: "Invalid token"});
    }
});

module.exports = authRouter;