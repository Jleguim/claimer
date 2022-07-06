const { json } = require('body-parser')

const jwt = require('./jwt/index.js')
const controllers = require('./controllers.js')

module.exports = (app) => {
    app.use('/auth/', json())

    app.get('/auth/login', controllers.login)
    app.get('/auth/extend', controllers.extendToken)

    app.get('/api/products', jwt.isAuthorized, controllers.getProducts)
}