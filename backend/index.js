const express = require('express')
const cookie = require('cookie-parser')

var app = express()
app.use(cookie())

require('./routes.js')(app)

app.listen(1337, () => {
    console.log('Listening on port 1337')
})