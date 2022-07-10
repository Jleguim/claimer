require('dotenv').config({ path: __dirname + '\\.env' })

const express = require('express')
const mongoose = require('mongoose')
const cookie = require('cookie-parser')
const { json } = require('body-parser')

var app = express()

var PORT = process.env.PORT
var MONGO_URL = process.env.MONGO_URL

mongoose.connect(MONGO_URL, error => {
    if (error) throw error

    console.log(`Mongoose connected to ${MONGO_URL}`)

    require('./models/user.js')
    require('./models/product.js')

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)

        const { AUTHORIZED, GET_USER, EXTEND_JWT } = require('./middleware/jwt.middleware')

        app.use(cookie())
        app.use(json())
        app.use('/api/', AUTHORIZED, GET_USER, EXTEND_JWT)

        // * Auth routes
        require('./routes/auth.routes')(app)

        // * API routes (need jwt authorization)
        require('./routes/me.routes')(app)
        require('./routes/product.routes')(app)
    })
})