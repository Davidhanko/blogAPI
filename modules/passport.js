const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local');

const prisma = new PrismaClient();

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try {
        const user = await prisma.user.findUnique({
            where: { username: username }
        });

        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
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

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.KEY
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: jwt_payload.id } });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

module.exports = passport;