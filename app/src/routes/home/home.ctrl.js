"user strict";

const logger = require("../../config/logger");
const db = require('../../config/sqliteDB');

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
    board: async (req, res) => {
        logger.info(`GET /board 304 "게시판 화면으로 이동"`);
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const count = db.get('SELECT COUNT(*) FROM board', (err, rows) => {

            var totalCount = Object.values(rows)[0];

            const viewList = Math.ceil(totalCount / limit);

            const results = {};

            db.all('SELECT * FROM board', (err, rows) => {
                if (err) {
                    console.log(err);
                }
                rows.forEach((row) => { })


                if (endIndex < rows.length) {
                    results.next = {
                        page: page + 1,
                        limit: limit
                    }
                }

                if (startIndex > 0) {
                    results.previous = {
                        page: page - 1,
                        limit: limit
                    }
                }

                results.results = rows.slice(startIndex, endIndex);
                // res.json(results.results);

                res.render("board/board", { board: results.results, user: req.user, page: page, limit: limit, maxPage: endIndex, pagination: viewList });
            });
        });

    },
    boardWrite: (req, res) => {
        logger.info(`GET /board 304 "게시판 글 작성 화면으로 이동"`);
        // 회원
        if (req.user) {
            res.render("board/boardWrite", { user: req.user });
            // 비회원
        } else {
            res.send("<script>alert('로그인 후 이용가능합니다.'); location.href=history.back(); </script>");
        }
    },
    boardDetail: (req, res) => {
        logger.info(`GET /board 304 "게시판 글 세부 화면으로 이동"`);

        // 하단에 게시글 목록
        db.all('SELECT * FROM board', (err, rows) => {
            rows.forEach((list_row) => { })

            const bottom_list = {};

            bottom_list.results = rows;

            // 조회 수
            db.run('UPDATE board SET hits = hits + 1 WHERE id =?', [req.params.id], (err, result) => {
                if (err) {
                    console.log(err);
                }
                if (result) {
                }
                // 게시글 상세 보기
                db.get('SELECT * FROM board WHERE id = ?', [req.params.id], (err, row) => {
                    if (err) {
                        console.log(err);
                    }
                    if (row) {
                        // 댓글 보기
                        db.all('SELECT * FROM comments WHERE board_id = ?', [req.params.id], (err, rows) => {
                            if (err) {
                                console.log(err);
                            }
                            if (rows) {
                                return res.render("board/boardDetail", { board: row, comment: rows, user: req.user, list: bottom_list.results });
                            }
                            return res.render("board/boardDetail", { board: row, user: req.user, list: bottom_list.results });
                        })
                    }
                })

            });
        })
    },
    products: (req, res) => {
        logger.info(`GET /products 304 "상품 화면으로 이동"`);
        res.render("products/products", { user: req.user });
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