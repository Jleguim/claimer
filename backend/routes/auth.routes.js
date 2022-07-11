const controller = require('../controllers/auth.controller')
const validator = require('../validators/auth.validators')

const { authorized } = require('../validators/common.validators')

module.exports = (app) => {
    app.get('/auth/login',
        validator.userExistsWithUsername,
        validator.passwordInBody,
        controller.login)

    app.get('/auth/check',
        authorized,
        controller.check)

    app.get('/auth/callback',
        validator.callback,
        validator.userExistsWithUsername,
        validator.passwordInBody,
        controller.callback)

    app.get('/auth/discord', controller.discord)
}