"user strict";

// 로그인 인증 테스트를 위한 임시 유저
const users = {
    id: ["admin", "user", "manager"],
    password: ["1111", "2222", "3333"],
};

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

        if (users.id.includes(id)) {
            const idx = users.id.indexOf(id);
            if (users.password[idx] === password) {
                return res.json({
                    success: true,
                });
            }
        }

        // 위에서 성공시 return으로 했기 때문에 굳이 else로 안해도 됨
        return res.json({
            success: false,
            msg: "로그인에 실패하셨습니다.",
        });
    },
};

module.exports = {
    output,
    process,
};