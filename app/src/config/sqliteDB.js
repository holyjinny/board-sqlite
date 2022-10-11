const sqlite3 = require('sqlite3');
const mkdirp = require('mkdirp');
const crypto = require('crypto');

mkdirp.sync('./var/db');

const db = new sqlite3.Database('./var/db/users.sqlite');

db.serialize(function () {

  // 유저 테이블
  db.run("CREATE TABLE IF NOT EXISTS users ( \
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB, \
    date TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')) \
  )");

  // 게시판 테이블
  db.run("CREATE TABLE IF NOT EXISTS board ( \
    id INTEGER PRIMARY KEY, \
    owner_id TEXT NOT NULL, \
    title TEXT NOT NULL, \
    content TEXT NOT NULL, \
    date TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')), \
    hits INTEGER NOT NULL DEFAULT 0, \
    comments INTEGER NOT NULL DEFAULT 0, \
    recommendation INTEGER NOT NULL DEFAULT 0 \
  )");

  // 답글 테이블
  db.run("CREATE TABLE IF NOT EXISTS comments ( \
    id INTEGER PRIMARY KEY, \
    board_id INTEGER NOT NULL, \
    sorts INTEGER NOT NULL, \
    depth INTEGER NOT NULL, \
    editor TEXT NOT NULL, \
    comment TEXT NOT NULL, \
    date TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')) \
  )");

  // 초기 테스트 유저 (username: admin, password: admin)
  var salt = crypto.randomBytes(16);
  db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
    'admin',
    crypto.pbkdf2Sync('admin', salt, 310000, 32, 'sha256'),
    salt
  ]);
});

module.exports = db;
