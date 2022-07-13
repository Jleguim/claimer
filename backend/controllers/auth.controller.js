const { validationResult } = require('express-validator')

const jwt = require('../auth/jwt')
const authUrl = require('../auth/discord').authUrl

// * GET test/login
async function login(req, res) {
    var errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.clearCookie('jwt')
        return res.status(400).send({
            message: 'Bad Request',
            errors: errors.array()
        })
    }

    var user = req._user
    var token = await jwt.sign(user.jwtPrepare())

    var password = req.body.password
    var passwordsMatch = user.checkPassword(password)
    if (!passwordsMatch) return res.status(401).send({ message: 'Unauthorized' })

    res.cookie('jwt', token)
    res.status(200).send({ message: 'Ok' })
}

// * GET test/check
async function check(req, res) {
    var errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.clearCookie('jwt')
        return res.status(400).send({
            message: 'Bad Request',
            errors: errors.array()
        })
    }

    res.status(200).send({ message: 'Ok' })
}

async function discord(req, res) {
    res.redirect(authUrl)
}

async function callback(req, res) {
    var errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).send({
            message: 'Bad Request',
            errors: errors.array()
        })
    }

    var user = req._user
    var token = await jwt.sign(user.jwtPrepare())

    var body = { jwt: token }
    var html = `<body>${JSON.stringify(body, 0, 0)}</body><script>window.discord.closeDiscordAuthWindow(document.body.innerText)</script>`
    res.send(html)
}

async function wrapController(controller, req, res) {
    try {
        await controller(req, res)
    } catch (error) {
        console.log(`${controller.name} -> ${error.message}`)
        res.status(500).send({ message: 'Internal Server Error' })
    }
}

module.exports = {
    login: (req, res) => wrapController(login, req, res),
    check: (req, res) => wrapController(check, req, res),
    discord: (req, res) => wrapController(discord, req, res),
    callback: (req, res) => wrapController(callback, req, res)
}