"use strict"; // ECMAScript 문법을 준수하겠다.

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.intro);
router.get("/home", ctrl.output.home);
router.get("/login", ctrl.output.login);

// 게시판
router.get("/board", ctrl.output.board);
router.get("/board/write", ctrl.output.boardWrite);
router.get("/board/:id", ctrl.output.boardDetail);

// 상품
router.get("/products", ctrl.output.products);

// router를 외부 파일에서 사용할 수 있게
module.exports = router;