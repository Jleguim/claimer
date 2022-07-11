const { body, query } = require('express-validator')
const { User } = require('mongoose').models

const discord = require('../auth/discord')

const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD

module.exports.passwordInBody = body('password')
    .exists({ checkFalsy: true, checkNull: true })

module.exports.userExistsWithUsername = body('username')
    .exists({ checkFalsy: true, checkNull: true })
    .custom(async (v, { req }) => {
        var query = { $or: [{ username: v }, { discordId: v }] }
        var user = await User.findOne(query)

        if (!user) return Promise.reject('This user doesn\'t exist.')

        req._user = user
    })

module.exports.callback = query('code')
    .exists({ checkFalsy: true, checkNull: true })
    .custom(async (v, { req }) => {
        var access_token = (await discord.requestToken(v)).access_token
        var userData = await discord.getUser(access_token)
        var user = await User.findOne({ discordId: userData.id })

        if (!user) {
            user = new User({ username: userData.username, discordId: userData.id })
            user.hashedPassword = User.hash(DEFAULT_USER_PASSWORD)
            await user.save()
        }

        req.body = { username: user.discordId, password: DEFAULT_USER_PASSWORD }
    })