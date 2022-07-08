const mongoose = require('mongoose')

const discord = require('./functions.js')

const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD

module.exports.discordAuthCallback = async (req, res, next) => {
    if (!req.query.code) {
        res.status(400).send({ message: 'Bad Request' })
        return
    }

    try {
        var body = await discord.requestToken(req.query.code)
        var userData = await discord.getUser(body.access_token)

        var User = mongoose.models.User
        var user = await User.findOne({ discordId: userData.id })

        if (!user) {
            user = new User({ username: userData.username, discordId: userData.id })

            user.hashPassword(DEFAULT_USER_PASSWORD)
            await user.save()
        }

        req.fromDiscord = true
        req.body = { username: user.username, password: DEFAULT_USER_PASSWORD }

        next()
    } catch (error) {
        if (!error.response) return console.log(error.message)
        console.log(error.response.body)
    }
}