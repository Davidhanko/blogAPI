const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const passport = require("../modules/passport");

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

authRouter.post('/login',
    passport.authenticate('local',
        { failureRedirect: '/login', successRedirect: '/home'}),
    (req, res) => {
    res.status(500).json({message: "If you see this, you messed up really bad"})
    }
);

module.exports = authRouter;