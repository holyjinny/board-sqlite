"user strict";

/**
 * home라는 컨트롤러 함수를 만들고, 이를 외부에서 사용
 * 컨트롤러 기능을 갖는 콜백함수를 여기에 작성
*/
const home = (req, res) => {
    res.render("home/index");
};

const login = (req, res) => {
    res.render("home/login");
};

/**
 * {} 오브젝트는 원래 { key : value }
 * key만 작성할 경우 { key : key }
 * 즉, home : home
 */
module.exports = {
    home,
    login,
};