const express = require('express');

const {body} = require('express-validator');


const authRouter = express.Router();
const authController = require('../controllers/authController');

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
        .isLength({ min: 6, max: 20})
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
    body("username")
        .notEmpty()
        .trim()
        .escape()
        .withMessage("Username is required"),
    body("password")
        .notEmpty()
        .trim()
        .escape()
        .withMessage("Password is required"),
    authController.login);

module.exports = authRouter;