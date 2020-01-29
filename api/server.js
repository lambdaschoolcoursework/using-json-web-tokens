const express = require('express');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);
const config = require('../data/config'); 
const authRouter = require('../auth/authRouter');

const app = express();

const sessionConfig = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1800000,
        // doesn't have to be multiplied right?
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true,
    store: new knexSessionStore({
        knex: config,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 60000,
        // what is this timeout for?
    })
};

app.get('/', (request, response) => {
    response.send({message: 'server working'});
});

app.use(session(sessionConfig));
app.use(express.json());
app.use('/api/auth', authRouter);

module.exports = app;