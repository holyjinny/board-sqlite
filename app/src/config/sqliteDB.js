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

  // 암호화 관련 작업 더 깊이 해보기
  // db.run("CREATE TABLE IF NOT EXISTS users ( \
  //   id INTEGER PRIMARY KEY, \
  //   username TEXT UNIQUE, \
  //   password TEXT NOT NULL, \
  //   algorithm TEXT, \
  //   key TEXT, \
  //   iv TEXT, \
  //   date TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')) \
  // )");

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

  // 초기 테스트 유저 (username: admin, password: admin), 단방향
  var salt = crypto.randomBytes(16);
  db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
    'admin',
    crypto.pbkdf2Sync('admin', salt, 310000, 32, 'sha256'),
    salt
  ]);

  // 양방향 (대칭형 암호화)
  // const algorithm = 'aes-256-cbc';
  // const key = crypto.randomBytes(32);
  // const iv = crypto.randomBytes(16);


  // function encrypt(text) {
  //   var cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  //   var encrypted = cipher.update(text);
  //   encrypted = Buffer.concat([encrypted, cipher.final()]);
  //   encryptedData = encrypted.toString('hex');
  //   // return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  //   console.log(encryptedData);
  // }

  // db.run('INSERT OR IGNORE INTO users (username, password, algorithm, key, iv) VALUES (?, ?, ?, ?, ?)', [
  //   'admin',
  //   encrypt('admin'),
  //   algorithm,
  //   key,
  //   iv
  // ]);

});

module.exports = db;
