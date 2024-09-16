const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const passport = require('../modules/passport');

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

        const token = jwt.sign({id: user.id}, process.env.KEY, {expiresIn: "1h"})
        res.status(201).json({ message: 'User created successfully.', token: token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    register
};