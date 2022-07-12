const { param } = require('express-validator')
const { Product, User } = require('mongoose').models

module.exports.hasProductId = param('productId')
    .exists({ checkFalsy: true, checkNull: true })
    .custom(async (v, { req }) => {
        var product = await Product.findById(v)
        if (!product) return Promise.reject('This product doesn\'t exist.')
        req._product = product
    })