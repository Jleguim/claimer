const mongoose = require('mongoose')
const jwt = require('./jwt/')

module.exports.login = async (req, res) => {
    var username = req.body.username
    var password = req.body.password

    if (username | password == undefined) {
        return res.status(400).send({ message: 'Bad Request' })
    }

    if (password != '1234') {
        return res.status(403).send({ message: 'Forbidden' })
    }

    try {
        var token = await jwt.sign({ username })
        res.cookie('jwt', token)
        res.status(200).send({ message: 'Authenticated!' })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal server error' })
    }
}

module.exports.extendToken = async (req, res) => {
    var token = req.cookies.jwt
    if (!token) return res.status(403).send({ message: 'Forbidden' })

    try {
        var data = await jwt.verify(token)
        var newToken = await jwt.sign({ username: data.username })

        res.cookie('jwt', newToken)
        res.status(200).send({ message: 'Extended!' })
    } catch (error) {
        console.log(error.message)

        if (error.message != 'jwt expired') {
            return res.status(500).send({ message: 'Internal server error' })
        }

        res.status(403).send({ message: 'Forbidden' })
    }
}

module.exports.getProducts = async (req, res) => {
    try {
        var Product = mongoose.models.Product
        var products = await Product.find({})
        res.status(200).send(products)
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server Error' })
    }
}