const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('./model');
const middleware = require('./middleware');

const app = express.Router();

// register
app.post('/register', (request, response) => {
    let user = request.body;
    const hash = bcrypt.hashSync(request.body.password, 10);
    user.password = hash;

    Users.add(user)
        .then(res => response.status(200).json({message: 'user created successfully'}))
        .catch(err => {
            response.status(500).json({message: 'error registering user'});
            console.log(err);
        });
});

// login
app.post('/login', (request, response) => {
    const {username, password} = request.body;

    Users.find({username})
        .then(res => {
            if (res && bcrypt.compareSync(password, res.password)) {
                const token = generateToken(res);
                response.status(200).json({message: 'logged in successfully', session: request.session, token: token});
            } else {
                response.status(500).json({message: 'invalid credentials'});
            };
        })
        .catch(err => {
            response.status(500).json({message: 'error logging in user'});
            console.log(err);
        });
});

// fetch all users
app.get('/users', middleware, (request, response) => {
    Users.find()
        .then(res => {
            response.status(200).json(res);
        })
        .catch(err => {
            response.status(500).json({message: 'error fetching users'});
            console.log(err);
        });
});

// generate token
function generateToken(user) {
    const payload = {
        userId: user.id,
        username: user.username
    };

    const options = {
        expiresIn: '1d'
    };

    return jwt.sign(payload, process.env.SECRET, options);
    // can place secret in seperate file and import
};

module.exports = app;