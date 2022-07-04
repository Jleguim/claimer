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

    jwt.sign({ username })
        .then(token => {
            res.cookie('jwt', token)
            res.status(200).send({ message: 'Authenticated!' })
        })
        .catch((err) => {
            console.log(err.message)
            res.status('500').send({ message: 'Internal server error' })
        })
}

module.exports.getProducts = async (req, res) => {
    try {
        var Product = mongoose.models.Product
        var products = await Product.find({})
        res.status(200).send(products)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal Server Error' })
    }
}