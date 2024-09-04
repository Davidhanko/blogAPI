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

authRouter.post('/login', function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(user.id, process.env.KEY, { expiresIn: '1h'});
            return res.json({user, token});
        });
    })(req, res);
});

authRouter.post('/refresh', function (req, res) {
        const user = req.body
        const newToken = jwt.sign({ id: user.id }, process.env.KEY, { expiresIn: '1h' });
        return res.json({ token: newToken });
});


module.exports = authRouter;