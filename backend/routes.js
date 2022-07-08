const { json } = require('body-parser')

const jwt = require('./auth/').jwt

const controllers = require('./controllers.js')
const auth = require('./auth/controllers')

const DISCORD_CALLBACK_ROUTE = process.env.DISCORD_CALLBACK_ROUTE

module.exports = (app) => {
    app.use('/auth/', json())

    // jwt
    app.get('/auth/login', auth.login)
    app.get('/auth/extend', auth.extendJWT)
    app.get('/auth/check', jwt.isAuthorized, auth.checkJWT)

    // discord
    app.get('/auth/discord', auth.redirectDiscordAuthUrl)
    app.get(DISCORD_CALLBACK_ROUTE, auth.discordAuthCallback, auth.login)

    // secured routes
    app.get('/api/products', jwt.isAuthorized, controllers.getProducts)
}