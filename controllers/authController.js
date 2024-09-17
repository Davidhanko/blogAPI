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

        const token = jwt.sign({id: user.id}, process.env.KEY, {expiresIn: "7d"})
        res.status(201).json({ message: 'User created successfully.', token: token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getData(req, res){
    const token = req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.status(401).json({message: "Token not provided"})
    }
    try{
        const decoded = jwt.decode(token, process.env.KEY)
        const user = await prisma.user.findUnique({
            where: {id: decoded.id},
            select: {id: true, username: true, email: true, posts: true, comments: true, author: true, createdAt: true, updatedAt: true}
        })
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json({userData: user})
    }
    catch (e) {
        res.status(401).json({message: "Invalid token"})
    }
}


module.exports = {
    register,
    getData
};