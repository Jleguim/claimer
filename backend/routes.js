const { json } = require('body-parser')

const { jwt, discord } = require('./auth/')

const apiControllers = require('./controllers.js')
const authControllers = require('./auth/controllers')

const DISCORD_CALLBACK_ROUTE = process.env.DISCORD_CALLBACK_ROUTE

module.exports = (app) => {
    app.use('/auth/', json())

    // jwt
    app.get('/auth/login', authControllers.login)
    app.get('/auth/extend', jwt.middleware.extendJWT, authControllers.extendJWT)
    app.get('/auth/check', jwt.middleware.isAuthorized, authControllers.checkJWT)

    // discord
    app.get('/auth/discord', authControllers.redirectDiscordAuthUrl)
    app.get(DISCORD_CALLBACK_ROUTE, discord.middleware.discordAuthCallback, authControllers.login)

    // secured routes
    app.get('/api/products', jwt.middleware.isAuthorized, jwt.middleware.extendJWT, apiControllers.getProducts)
    app.get('/api/@me', jwt.middleware.isAuthorized, jwt.middleware.extendJWT, apiControllers.me)
}