const mongoose = require('mongoose')

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