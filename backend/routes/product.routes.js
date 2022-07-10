const controller = require('../controllers/product.controller')

module.exports = (app) => {
    // * Get all products
    app.get('/api/product', controller.getProducts)

    // * Get a product (by id)
    app.get('/api/product/:productId', controller.getProduct)

    // * Buy a product
    app.get('/api/product/:productId/buy', controller.buyProduct)
}