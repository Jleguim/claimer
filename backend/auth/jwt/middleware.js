const mongoose = require('mongoose')

const jwt = require('./functions.js')

module.exports.isAuthorized = (req, res, next) => {
    var token = req.cookies.jwt
    if (!token) return res.status(403).send({ message: 'Forbidden' })

    jwt.verify(token)
        .then(data => {
            req.jwtData = data

            next()
        })
        .catch((err) => {
            if (err.message == 'jwt expired') {
                return res.status(403).send({ message: 'Forbidden' })
            }

            res.status(500).send({ message: 'Internal server error' })
        })
}

module.exports.extendJWT = async (req, res, next) => {
    if (!req.cookies.jwt) {
        res.status(403).send({ message: 'Forbidden' })
        return
    }

    try {
        var User = mongoose.models.User
        var user = await User.findOne({ discordId: req.jwtData.discordId }).select(['-password', '-_id', '-__v'])
        var data = { username: user.username, discordId: user.discordId }

        var newToken = await jwt.sign(data)
        
        req.jwtData = data
        res.cookie('jwt', newToken)

        next()
    } catch (error) {
        console.log(error.message)

        if (error.message != 'jwt expired') {
            return res.status(500).send({ message: 'Internal server error' })
        }

        res.status(403).send({ message: 'Forbidden' })
    }
}