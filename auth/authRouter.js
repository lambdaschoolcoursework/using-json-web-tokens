const express = require('express');
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
                request.session.userId = res.id;
                request.session.loggedIn = true;
                
                response.status(200).json({message: 'logged in successfully', session: request.session});
            } else {
                response.status(500).json({message: 'invalid credentials'});
            };
        })
        .catch(err => {
            response.status(500).json({message: 'error logging in user'});
            console.log(err);
        });
});

// logout
app.get('/logout', (request, response) => {
    if (request.session) {
        request.session.destroy(err => {
            if (err) {
                response.status(500).json({message: '?'});
            } else {
                response.status(200).json({message: 'successfully logged out'});
            };
        });
    } else {
        response.status(204).json({message: 'session expired'})
    };
    // when would each of these happen?
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

module.exports = app;