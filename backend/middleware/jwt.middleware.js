const User = require('mongoose').models.User
const jwt = require('../auth/jwt')

async function AUTHORIZED(req, res, next) {
    var token = req.cookies.jwt
    if (!token) return res.status(403).send({ message: 'Forbidden' })

    var data = await jwt.verify(token)
    req.jwt_data = data

    next()
}

async function GET_USER(req, res, next) {
    var discordId = req.jwt_data.discordId
    var user = await User.findOne({ discordId })
    req.user_doc = user

    next()
}

async function EXTEND_JWT(req, res, next) {
    var ignoredFields = ['-password', '-_id', '-__v']
    var user = await User.findById(req.user_doc.id).select(ignoredFields)
    var data = user.toJSON()

    var token = await jwt.sign(data)
    req.jwt_data = data
    res.cookie('jwt', token)

    next()
}

async function wrapMiddleware(controller, req, res, next) {
    try {
        await controller(req, res, next)
    } catch (error) {
        console.log(`${controller.name} -> ${error.message}`)

        if (error.message == 'jwt expired') {
            return res.status(403).send({ message: 'Forbidden' })
        }

        res.status(500).send({ message: 'Internal Server Error' })
    }
}

module.exports = {
    AUTHORIZED: (req, res, next) => wrapMiddleware(AUTHORIZED, req, res, next),
    GET_USER: (req, res, next) => wrapMiddleware(GET_USER, req, res, next),
    EXTEND_JWT: (req, res, next) => wrapMiddleware(EXTEND_JWT, req, res, next)
}