"use strict";

// 모듈
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// 라우팅
const home = require("./src/routes/home");

// 앱 세팅
app.set("views", "./src/views");
// views 폴더안에 생성될 html 코드들을 어떤 엔진으로 해석할지 정의
// 많이 사용하는 엔진 = ejs
app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json());
// URL을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * app과 router를 연결
 * use -> 미들웨어를 등록해주는 메서드.
 */
app.use("/", home);

module.exports = app;