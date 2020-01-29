const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    const token = request.headers.authorization;
    
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if (err) {
                response.status(500).json({message: 'invalid token'});
            } else {
                next();
            };
        });
    } else {
        response.status(401).json({message: 'unauthorized'})
    };
};