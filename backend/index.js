const express = require('express')
const mongoose = require('mongoose')
const cookie = require('cookie-parser')

var app = express()

mongoose.connection.on('connected', () => {
    app.use(cookie())
    
    require('./routes.js')(app)

    require('./models/user.js')
    require('./models/product.js')

    app.listen(1337, () => {
        console.log('Listening on port 1337')
    })
})

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + 'mongodb://localhost/test')
})

mongoose.connect('mongodb://localhost/test')