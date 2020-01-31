const express = require('express');
const config = require('../data/config'); 
const authRouter = require('../auth/authRouter');

const app = express();

app.get('/', (request, response) => {
    response.send({message: 'server working'});
});

app.use(express.json());
app.use('/api/auth', authRouter);

module.exports = app;