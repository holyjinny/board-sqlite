"user strict";

const logger = require("../../config/logger");
const User = require("../../models/User");

// output or view or show 등
const output = {
    intro: (req, res) => {
        logger.info(`GET / 304 "인트로 화면으로 이동"`);
        res.render("home/intro", { user: req.user });
    },
    home: (req, res) => {
        logger.info(`GET / 304 "홈 화면으로 이동"`);
        res.render("home/index", { user: req.user });
    },
    login: (req, res) => {
        logger.info(`GET /login 304 "로그인 화면으로 이동"`);
        res.render("home/login");
    },
    register: (req, res) => {
        logger.info(`GET /register 304 "회원가입 화면으로 이동"`);
        res.render("home/register");
    }
};

module.exports = { output };

const log = (response, url) => {
    if (response.err) {
        logger.error(
            `${url.method} ${url.path} ${url.status} Response: ${response.success} ${response.err}`
        );
    }
    else {
        logger.info(
            `${url.method} ${url.path} ${url.status} Response: ${response.success} ${response.msg || ""}`
        );
    }
}