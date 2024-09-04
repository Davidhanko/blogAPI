const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const passport = require('../modules/passport');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

async function register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, email, password } = req.body;
        const hashed_password = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashed_password
            }
        });

        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function login(req, res) {
    passport.authenticate('local', { failureMessage: 'FAIL', successMessage: "SUCCESS" })
}

module.exports = {
    register,
    login
};