const mongoose = require('mongoose')
const fs = require('fs')

var productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 10 },
    pictureUrl: { type: String, required: true, default: 'https://cdn.discordapp.com/attachments/451359497546498051/993374995638140958/logo.png' },
    // picture: { type: Buffer, required: true, default: fs.readFileSync(__dirname + '\\..\\..\\src\\public\\img\\logo.png') }
})

module.exports = mongoose.model('Product', productSchema)