const database = require('../data/config');

const add = user => {
    return database('users').insert(user);
};

const find = username => {
    if (username === undefined) {
        return database('users');
    } else {
        return database('users').where(username).first();
    };
};

module.exports = {
    add,
    find
};