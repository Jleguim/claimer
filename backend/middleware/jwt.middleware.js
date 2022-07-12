const User = require('mongoose').models.User
const jwt = require('../auth/jwt')

async function EXTEND_JWT(req, res, next) {
    if (!req._user) throw new Error('No user')

    var data = req._user.jwtPrepare()
    var extendedToken = await jwt.sign(data)

    res.cookie('jwt', extendedToken)
    next()
}

async function wrapMiddleware(controller, req, res, next) {
    try {
        await controller(req, res, next)
    } catch (error) {
        console.log(`${controller.name} -> ${error.message}`)
        res.clearCookie('jwt')

        if (error.message == 'jwt expired' || error.message == 'jwt malformed' || error.message == 'invalid signature' || error.message == 'No user') {
            return res.status(401).send({ message: 'Unauthorized' })
        }

        res.status(500).send({ message: 'Internal Server Error' })
    }
}

module.exports = {
    EXTEND_JWT: (req, res, next) => wrapMiddleware(EXTEND_JWT, req, res, next)
}