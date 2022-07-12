const { validationResult } = require('express-validator')
const Product = require('mongoose').models.Product

// * GET api/product
async function getProducts(req, res) {
    var errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.clearCookie('jwt')
        return res.status(400).send({
            message: 'Bad Request',
            errors: errors.array()
        })
    }

    var products = await Product.find({})
    res.status(200).send(products)
}

// * GET api/product/:productId
async function getProduct(req, res) {
    var errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.clearCookie('jwt')
        return res.status(400).send({
            message: 'Bad Request',
            errors: errors.array()
        })
    }

    res.status(200).send(req._product)
}

// * GET api/product/:productId/buy
async function buyProduct(req, res) {
    var errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.clearCookie('jwt')
        return res.status(400).send({
            message: 'Bad Request',
            errors: errors.array()
        })
    }

    var product = req._product
    var user = req._user

    if (user.points < product.price) {
        return res.status(403).send({ message: 'Not enough balance.' })
    }

    // TODO: Add to user inventory or purchase history?
    var newBalance = user.points - product.price

    user.points = newBalance
    await user.save()

    // TODO: Send product: keys, accounts, codes, etc.
    res.status(200).send({ message: 'Purchase successful.' })
}

async function wrapController(controller, req, res) {
    try {
        await controller(req, res)
    } catch (error) {
        console.log(`${controller.name} -> ${error.message}`)
        res.status(500).send({ message: 'Internal Server Error' })
    }
}

module.exports = {
    getProducts: (req, res) => wrapController(getProducts, req, res),
    getProduct: (req, res) => wrapController(getProduct, req, res),
    buyProduct: (req, res) => wrapController(buyProduct, req, res)
}