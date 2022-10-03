"use strict";

const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const db = require('../../config/sqliteDB');

passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.get('SELECT * FROM users WHERE username = ?', [username], function (err, row) {
        if (err) { return cb(err); }
        if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

        crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return cb(err); }
            if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, row);
        });
    });
}));

passport.serializeUser(function (user, cb) {
    cb(null, { id: user.id, username: user.username });
});

passport.deserializeUser(function (user, cb) {
    return cb(null, user);
});

const process = {
    // login: function () {
    //     passport.authenticate('local', {
    //         successReturnToOrRedirect: '/',
    //         failureRedirect: '/login',
    //         failureMessage: true
    //     })
    // },
    logout: (req, res, next) => {
        const url = {
            method: "POST",
            path: "/logout"
        };
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    },
    register: async (req, res, next) => {
        const url = {
            method: "POST",
            path: "/register"
        };
        var salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return next(err); }
            db.run('INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
                req.body.username,
                hashedPassword,
                salt
            ], function (err) {
                if (err) { return next(err); }
                var user = {
                    id: this.lastID,
                    username: req.body.username
                };
                req.login(user, function (err) {
                    if (err) { return next(err); }
                    res.redirect('/');
                });
            });
        });
    }
};

module.exports = { process };
