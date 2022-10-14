"use strict";

const winston = require('winston');
const WinstonDaily = require('winston-daily-rotate-file');

const { combine, timestamp, printf, colorize } = winston.format;

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
}

winston.addColors(colors);

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'http'
}

// 로그 포맷
const logFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    printf((info) => {
        if (info.stack) {
            return `${info.timestamp} ${info.level}: ${info.message} \n Error Stack: ${info.stack}`
        }
        return `${info.timestamp} ${info.level}: ${info.message}`
    })
)

// 콘솔에 찍힐 때 색 구분
const consoleOpts = {
    handleExceptions: true,
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' })
    )
}

const transports = [
    // 콘솔일 때만 색 넣기
    new winston.transports.Console(consoleOpts),

    // error 레벨 로그는 저장
    new WinstonDaily({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: "./logs/error",
        filename: '%DATE%.error.log',
        maxFiles: 30,
        zippedArchive: true
    }),

    // 모든 레벨 로그를 저장할 파일
    new WinstonDaily({
        level: 'debug',
        datePattern: 'YYYY-MM-DD',
        dirname: "./logs/all",
        filename: '%DATE%.all.log',
        maxFiles: 7,
        zippedArchive: true
    })
]

const logger = winston.createLogger({
    level: level(),
    levels,
    format: logFormat,
    transports
})

module.exports = logger;