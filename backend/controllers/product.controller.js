const Product = require('mongoose').models.Product
const jwt = require('../auth/jwt')

// * GET api/product
async function getProducts(req, res) {
    var products = await Product.find({})
    res.status(200).send(products)
}

// * GET api/product/:productId
async function getProduct(req, res) {
    var productId = req.params.productId
    var product = await Product.findById(productId)
    res.status(200).send(product)
}

// * GET api/product/:productId/buy
async function buyProduct(req, res) {
    // TODO: I'm going to use req.body here but I might need to change this later
    // TODO: Maybe use api/product/buy/:productId
    var productId = req.params.productId
    var product = await Product.findById(productId)

    // // * I probably shouldn't trust the user/client sending the correct 'user.points' info,
    // // * so I'm gonna use the 'req.jwtData' provided by auth.isAuthenticated to grab the user info
    // //var discordId = req.jwtData.discordId
    // //var user = await User.findOne({ discordId })

    // * Using 'req.user_doc' from the getUserData middleware
    var user = req.user_doc

    if (user.points < product.price) return res.send(403).send({ message: 'Not enough balance.' })

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