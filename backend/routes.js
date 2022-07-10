const { json } = require('body-parser')
const { AUTHORIZED, GET_USER, EXTEND_JWT } = require('./middleware/jwt.middleware')

module.exports = (app) => {
    // * Parse JSON on requests
    app.use('/', json())

    // * Auth routes
    require('./routes/auth.routes')(app)

    // * API routes (need jwt authorization)
    app.use('/api/', AUTHORIZED, GET_USER, EXTEND_JWT)
    require('./routes/me.routes')(app)
    require('./routes/product.routes')(app)
}