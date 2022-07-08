require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cookie = require('cookie-parser')

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

        app.use(cookie())
        require('./routes.js')(app)
    })
})