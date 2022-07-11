const User = require('mongoose').models.User

const jwt = require('../auth/jwt')
const discord = require('../auth/discord')

// * GET auth/login
async function login(req, res) {
    if (req.body.username == undefined || req.body.password == undefined) {
        return res.status(400).send({ message: 'Bad Request' })
    }

    var user = await User.findOne({ $or: [{ username: req.body.username }, { discordId: req.body.username }] })
    if (!user) return res.status(401).send({ message: 'Unauthorized' })

    var data = user.jwtPrepare()
    var token = await jwt.sign(data)

    if (!req.fromDiscord) {
        if (user.checkPassword(req.body.password) == false) {
            return res.status(401).send({ message: 'Unauthorized' })
        }
    } else {
        var body = { jwt: token }
        res.send(`<body>${JSON.stringify(body, 0, 0)}</body><script>window.discord.closeDiscordAuthWindow(document.body.innerText)</script>`)
        return
    }

    res.cookie('jwt', token)
    res.status(200).send({ message: 'Authenticated!' })
}

// * GET auth/check
async function check(req, res) {
    res.status(200).send({ message: 'All good' })
}

// * GET auth/discord
async function discordOauth(req, res) {
    res.redirect(discord.authUrl)
}

async function wrapController(controller, req, res) {
    try {
        await controller(req, res)
    } catch (error) {
        console.log(`${controller.name} -> ${error.message}`)
        console.log(error)
        res.status(500).send({ message: 'Internal Server Error' })
    }
}

module.exports = {
    discordOauth: (req, res) => wrapController(discordOauth, req, res),
    check: (req, res) => wrapController(check, req, res),
    login: (req, res) => wrapController(login, req, res)
}