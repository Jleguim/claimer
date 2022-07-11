const { cookie } = require('express-validator')
const { User } = require('mongoose').models

const jwt = require('../auth/jwt')

module.exports.authorized = cookie('jwt')
    .exists({ checkFalsy: true, checkNull: true })
    .custom(async (v, { req }) => {
        var data = await jwt.verify(v)

        var query = { discordId: data.discordId }
        var user = await User.findOne(query)

        if (!user) return Promise.reject('Unauthorized')

        req._user = user
    })