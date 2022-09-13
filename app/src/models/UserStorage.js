"use strict";

class UserStorage {
    static #users = {
        id: ["admin", "user", "manager"],
        password: ["1111", "2222", "3333"],
        name: ["어드민", "유저", "매니저"],
    };

    // 받아올 수 있게 처리
    static getUsers(...fields) {
        const users = this.#users;
        const newUsers = fields.reduce((newUsers, field) => {
            if (users.hasOwnProperty(field)) {
                newUsers[field] = users[field];
            }
            return newUsers;
        }, {});
        return newUsers;
    }
}

module.exports = UserStorage;