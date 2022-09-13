"use strict";

const fs = require("fs").promises;

class UserStorage {
    static #getUsetInfo(data, id) {
        const users = JSON.parse(data);
        const idx = users.id.indexOf(id);
        const usersKeys = Object.keys(users);
        const userInfo = usersKeys.reduce((newUser, info) => {
            newUser[info] = users[info][idx];
            return newUser;
        }, {});
        return userInfo;
    }

    // 받아올 수 있게 처리
    static getUsers(...fields) {
        // const users = this.#users;
        const newUsers = fields.reduce((newUsers, field) => {
            if (users.hasOwnProperty(field)) {
                newUsers[field] = users[field];
            }
            return newUsers;
        }, {});
        return newUsers;
    }

    static getUserInfo(id) {
        return fs.readFile("./src/databases/users.json")
            .then((data) => {
                return this.#getUsetInfo(data, id);
            })
            .catch(console.error);
    }

    static save(userInfo) {
        // const users = this.#users;
        users.id.push(userInfo.id);
        users.name.push(userInfo.name);
        users.password.push(userInfo.password);
        return { success: true };
    }
}

module.exports = UserStorage;