"user strict";

const UserStorage = require("../../models/UserStorage");

// output or view or show 등
const output = {
    home: (req, res) => {
        res.render("home/index");
    },
    login: (req, res) => {
        res.render("home/login");
    },
};

const process = {
    login: (req, res) => {
        const id = req.body.id,
            password = req.body.password;

        const users = UserStorage.getUsers("id", "password");

        const response = {};
        if (users.id.includes(id)) {
            const idx = users.id.indexOf(id);
            if (users.password[idx] === password) {
                response.success = true;
                return res.json(response);
            }
        }

        // 위에서 성공시 return으로 했기 때문에 굳이 else로 안해도 됨
        response.success = false;
        response.msg = "로그인에 실패하셨습니다.";
        return res.json(response);
    },
};

module.exports = {
    output,
    process,
};