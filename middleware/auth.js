const jwt = require('jsonwebtoken');
const { UnAuthorized } = require('../errors/index')

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnAuthorized("Authentication invalid")
    }

    const token = authHeader.split(' ')[1]
    try {
        const payLoad = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payLoad.userId, name: payLoad.name }
        next()
    } catch (error) {
        throw new UnAuthorized("Unauthorized to access this route")
    }
}

module.exports = authMiddleware;

