const passport = require('passport');
const LocalStrategy = require('passport-local');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try {
        const user = await prisma.user.findUnique({
            where: { username: username }
        });

        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.hashed_password);
        if (!isMatch) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }

        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

module.exports = passport;