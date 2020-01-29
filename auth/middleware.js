module.exports = (request, response, next) => {
    if (request.session && request.session.loggedIn) {
        next();
    } else {
        response.status(401).json({message: 'unauthorized'})
    };
};