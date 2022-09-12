"use strict";

// 모듈
const express = require("express");
const app = express();

// 라우팅
const home = require("./src/routes/home");

// 앱 세팅
app.set("views", "./src/views");
// views 폴더안에 생성될 html 코드들을 어떤 엔진으로 해석할지 정의
// 많이 사용하는 엔진 = ejs
app.set("view engine", "ejs");

/**
 * app과 router를 연결
 * use -> 미들웨어를 등록해주는 메서드.
 */
app.use("/", home);

module.exports = app;