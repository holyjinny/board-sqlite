"use strict"; // ECMAScript 문법을 준수하겠다.

const express = require("express");
const router = express.Router();

const ctrl = require("./auth.ctrl");

// 회원 관련 API
router.post("/login", ctrl.process.login);
router.post("/logout", ctrl.process.logout);
router.post("/register", ctrl.process.register);

// 게시판 관련 API
router.post("/board/write", ctrl.process.boardWrite);
router.post("/board/recommendation/:id", ctrl.process.boardRecommendation);
router.post("/board/comment/:id", ctrl.process.boardComment);

// router를 외부 파일에서 사용할 수 있게
module.exports = router;