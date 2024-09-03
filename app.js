require('dotenv').config()

const authRouter = require('./routers/authRouter');

const passport = require('./modules/passport'); // Import passport from passport.js
const express = require('express');
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const app = express();

app.use(
    expressSession({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // ms
        },
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            new PrismaClient(),
            {
                checkPeriod: 2 * 60 * 1000,  //ms
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
    })
);

app.use(passport.initialize());
app.use(passport.session())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);

app.listen(process.env.port, () => {
    console.log('Server is running on port ' + process.env.port);
})

