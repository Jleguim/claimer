const jwt = require('jsonwebtoken')
const { json } = require('body-parser')

// auth someone
function login(req, res, next) {
    if (Object.keys(req.body).length == 0) {
        return res.status('400').send({ message: 'Bad Request' })
    }

    const { username, password } = req.body

    if (username | password == undefined) {
        return res.status('400').send({ message: 'Bad Request' })
    }

    if (password != '1234') {
        return res.status('403').send({ message: 'Forbidden' })
    }

    sign({ username })
        .then(token => {
            res.cookie('jwt', token)
            res.status('200').send({ message: 'Authenticated!' })
        })
        .catch(err => { // Error logging into a db?
            // console.log(err)
            res.status('500').send({ message: 'Internal Server Error' })
        })
}

function sign(data) {
    return new Promise((resolve, reject) => {
        if (data == undefined) reject('Argument data not defined')

        jwt.sign(data, 'secret', { expiresIn: '30s' }, (err, token) => {
            if (err) return reject(err)
            if (token == undefined) return reject('Unkown error')

            resolve(token)
        })
    })
}

function verify(token) {
    return new Promise((resolve, reject) => {
        if (token == undefined) return reject('Argument token not defined')

        jwt.verify(token, 'secret', (err, data) => {
            if (err) return reject(err)
            if (data == undefined) return reject('Unknown error')

            resolve(data)
        })
    })
}

// middleware to check if auth'd
function authed(req, res, next) {
    var token = req.cookies['jwt']
    if (token == undefined) {
        return res.status('403').send({ message: 'Forbidden' })
    }

    verify(token)
        .then((data) => {
            req.jwtData = data
            next()
        })
        .catch((err) => {
            // console.log(err)
            res.status('500').send({ message: 'Internal server error' })
        })
}

module.exports = (app) => {
    app.use('/auth/', json())

    app.get('/auth/login', login)

    app.get('/api/products', authed, (req, res) => {
        res.send('test')
    })
}