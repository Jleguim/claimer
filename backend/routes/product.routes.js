const controller = require('../controllers/product.controller')
const validator = require('../validators/product.validators')

const { authorized } = require('../validators/common.validators')
const { EXTEND_JWT } = require('../middleware/jwt.middleware')

module.exports = (app) => {
    // * Get all products
    app.get('/api/product', controller.getProducts)

    // * Get a product (by id)
    app.get('/api/product/:productId',
        validator.hasProductId,
        controller.getProduct)

    // * Buy a product
    app.get('/api/product/:productId/buy',
        validator.hasProductId,
        controller.buyProduct)
}