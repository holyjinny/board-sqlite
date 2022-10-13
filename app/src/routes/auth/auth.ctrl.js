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
    login:
        passport.authenticate('local', {
            successReturnToOrRedirect: '/home',
            failureRedirect: '/login',
            failureMessage: true
        }),
    logout: async (req, res, next) => {
        if (req.session.passport.user) {
            await req.session.destroy((err) => {
                if (err) {
                    console.log(err)
                } else {
                    res.redirect('/');

                }
            })
        }
    },
    register: async (req, res, next) => {
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
    },
    boardWrite: (req, res) => {
        db.run('INSERT INTO board (owner_id, title, content) VALUES (?, ?, ?)', [
            req.user.username,
            req.body.title,
            req.body.content,
        ], function (err) {
            if (err) { return console.log(err) }
            return res.redirect('/board?page=1&limit=10');
        });
    },
    boardRecommendation: (req, res) => {
        db.run('UPDATE board SET recommendation = recommendation + 1 WHERE id = ?', [req.params.id], (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result) {
            }
            return res.redirect('/board/' + req.params.id);
        })
    },
    boardComment: (req, res) => {
        if (req.user) {
            db.run('INSERT INTO comments (board_id, sorts, depth, editor, comment) VALUES (?, ?, ?, ?, ?)', [
                req.params.id,
                0,
                0,
                req.user.username,
                req.body.text,
            ], (err, rows) => {
                if (err) {
                    console.log(err);
                }
                if (rows) {
                }
                db.run('UPDATE board SET comments = comments + 1 WHERE id = ?', [req.params.id], (err, row) => {
                    if (err) {
                        console.log(err);
                    }
                    if (row) {
                    }
                })
                return res.redirect('/board/' + req.params.id);
            })
        } else {
            res.send("<script>alert('로그인 후 이용가능합니다.'); location.href=history.back(); </script>");
        }
    },
    boardEdit: (req, res) => {
        // YYYY-MM-DD hh:mm:ss 형식에 맞추기 위해서
        function timestamp() {
            var today = new Date();
            today.setHours(today.getHours() + 9);
            return today.toISOString().replace('T', ' ').substring(0, 19);
        }

        db.run('UPDATE board SET (title, content, date) = (?, ?, ?) WHERE id = ?', [
            req.body.title,
            req.body.content,
            timestamp(),
            req.params.id
        ], (err, row) => {
            if (err) {
                console.log(err);
            }
            if (row) {
            }
            return res.redirect('/board/' + req.params.id);
        })
    },
    commentEdit: (req, res) => {
        // YYYY-MM-DD hh:mm:ss 형식에 맞추기 위해서
        function timestamp() {
            var today = new Date();
            today.setHours(today.getHours() + 9);
            return today.toISOString().replace('T', ' ').substring(0, 19);
        }

        db.run('UPDATE comments SET (comment, date) = (?, ?) WHERE id = ?', [
            req.body.comment,
            timestamp(),
            req.params.id
        ], (err, row) => {
            if (err) {
                console.log(err);
            }
            if (row) {
            }
            return res.redirect('/board/' + req.params.board_id);
        })
    }
};

module.exports = { process };