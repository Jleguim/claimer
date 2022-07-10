const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

module.exports.verify = (token) => {
    return new Promise((resolve, reject) => {
        if (token == undefined) return reject('Argument token not defined')

        jwt.verify(token, JWT_SECRET, (err, data) => {
            if (err) return reject(err)
            if (data == undefined) return reject('Unknown error')

            resolve(data)
        })
    })
}

module.exports.sign = (data) => {
    return new Promise((resolve, reject) => {
        if (data == undefined) reject('Argument data not defined')

        jwt.sign(data, JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) return reject(err)
            if (token == undefined) return reject('Unkown error')

            resolve(token)
        })
    })
}