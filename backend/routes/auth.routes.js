const controller = require('../controllers/auth.controller')

const { AUTHORIZED } = require('../middleware/jwt.middleware')
const { CALLBACK } = require('../middleware/discord.middleware')

module.exports = (app) => {
    app.get('/auth/login', controller.login)
    app.get('/auth/check', AUTHORIZED, controller.check)

    app.get('/auth/discord', controller.discordOauth)
    app.get('/auth/callback', CALLBACK, controller.login)
}