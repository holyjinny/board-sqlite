"use strict"; // ECMAScript 문법을 준수하겠다.

const express = require("express");
const router = express.Router();
const passport = require('passport');

const ctrl = require("./auth.ctrl");

// API
// router.post("/login", ctrl.process.login);
router.post('/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/home',
    failureRedirect: '/login',
    failureMessage: true
}));
router.post("/logout", ctrl.process.logout);
router.post("/register", ctrl.process.register);

// router를 외부 파일에서 사용할 수 있게
module.exports = router;