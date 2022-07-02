const express = require('express')
const { json, urlencoded } = require('body-parser')

var app = express()

app.use(json())
app.use(urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello from backend!')  
    console.log('Ping!')
})

app.listen(1337, () => {
    console.log('Listening on port 1337')
})