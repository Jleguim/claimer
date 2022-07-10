const User = require('mongoose').models.User
const discord = require('../auth/discord')

const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD

async function CALLBACK(req, res, next) {
    var code = req.query.code
    if (!code) return res.status(400).send({ message: 'Bad Request' })

    var access_token = (await discord.requestToken(code)).access_token
    var userData = await discord.getUser(access_token)
    var user = await User.findOne({ discordId: userData.id })

    if (!user) {
        user = new User ({ username: userData.username, discordId: userData.id })
        user.hashPassword(DEFAULT_USER_PASSWORD)
        await user.save()
    }

    req.fromDiscord = true
    req.body = { username: user.discordId, password: user.password }

    next()
}

async function wrapMiddleware(controller, req, res, next) {
    try {
        await controller(req, res, next)
    } catch (error) {
        console.log(`${controller.name} -> ${error.message}`)

        res.status(500).send({ message: 'Internal Server Error' })
    }
}

module.exports = {
    CALLBACK: (req, res, next) => wrapMiddleware(CALLBACK, req, res, next)
}