const mongoose = require('mongoose')

const jwt = require('./jwt/')
const discord = require('./discord')

// JWT stuff
module.exports.login = async (req, res) => {
    if (req.body.username == undefined || req.body.password == undefined) {
        return res.status(400).send({ message: 'Bad Request' })
    }

    try {
        var User = mongoose.models.User
        var queriedUser = await User.findOne({ $or: [{ username: req.body.username }, { discordId: req.body.username }] })

        if (!queriedUser) {
            res.status(403).send({ message: 'Forbidden', code: 1 })
            return
        }

        if (queriedUser.checkPassword(req.body.password) == false) {
            res.status(403).send({ message: 'Forbidden', code: 2 })
            return
        }

        var token = await jwt.functions.sign({ username: queriedUser.username, discordId: queriedUser.discordId })

        if (req.fromDiscord == true) {
            var body = { jwt: token }
            res.send(`<body>${JSON.stringify(body, 0, 0)}</body><script>window.discord.closeDiscordAuthWindow(document.body.innerText)</script>`)
            return
        }

        res.cookie('jwt', token)
        res.status(200).send({ message: 'Authenticated!' })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal server error' })
    }
}

module.exports.extendJWT = async (req, res) => res.status(200).send({ message: 'Extended!' })
module.exports.checkJWT = (req, res) => res.status(200).send({ message: 'Authed!' })
// --------

// Discord stuff
module.exports.redirectDiscordAuthUrl = (req, res) => res.redirect(discord.functions.authUrl)
// -------------