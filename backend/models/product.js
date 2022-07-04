var mongoose = require('mongoose')

var productSchema = new mongoose.Schema({
    type: String,
    key: String
})

module.exports = mongoose.model('Product', productSchema)