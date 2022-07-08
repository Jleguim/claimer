const mongoose = require('mongoose')

const jwt = require('./jwt/')
const discord = require('./discord')

const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD

// JWT stuff
module.exports.login = async (req, res) => {
    if (req.body.username | req.body.password == undefined) {
        return res.status(400).send({ message: 'Bad Request' })
    }

    try {
        var User = mongoose.models.User
        var queriedUser = await User.findOne({ username: req.body.username })

        if (!queriedUser) {
            res.status(403).send({ message: 'Forbidden', code: 1 })
            return
        }

        if (queriedUser.checkPassword(req.body.password) == false) {
            res.status(403).send({ message: 'Forbidden', code: 2 })
            return
        }

        var token = await jwt.sign({ username: req.body.username })
        res.cookie('jwt', token)
        res.status(200).send({ message: 'Authenticated!' })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal server error' })
    }
}

module.exports.extendJWT = async (req, res) => {
    if (!req.cookies.jwt) {
        res.status(403).send({ message: 'Forbidden' })
        return
    }

    try {
        var data = await jwt.verify(req.cookies.jwt)
        var newToken = await jwt.sign({ username: data.username })

        res.cookie('jwt', newToken)
        res.status(200).send({ message: 'Extended!' })
    } catch (error) {
        console.log(error.message)

        if (error.message != 'jwt expired') {
            return res.status(500).send({ message: 'Internal server error' })
        }

        res.status(403).send({ message: 'Forbidden' })
    }
}

module.exports.checkJWT = (req, res) => res.status(200).send({ message: 'Authed!' })
// --------

// Discord stuff
module.exports.discordAuthCallback = async (req, res, next) => {
    if (!req.query.code) {
        res.status(400).send({ message: 'Bad Request' })
        return
    }

    try {
        var body = await discord.requestToken(req.query.code)
        var userData = await discord.getUser(body.access_token)

        var User = mongoose.models.User
        var user = new User({ username: userData.username })

        user.hashPassword(DEFAULT_USER_PASSWORD)
        await user.save()

        req.body = { username: userData.username, password: DEFAULT_USER_PASSWORD }

        next()
    } catch (error) {
        if (!error.response) return console.log(error.message)
        console.log(error.response.body)
    }
}

module.exports.redirectDiscordAuthUrl = (req, res) => res.redirect(discord.authUrl)
// -------------