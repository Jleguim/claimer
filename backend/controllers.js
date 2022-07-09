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

module.exports.meUpdate = async (req, res, next) => {
    try {
        var User = mongoose.models.User
        var user = await User.findOne({ discordId: req.jwtData.discordId })

        var keysToUpdate = Object.keys(req.body)
        keysToUpdate.forEach(key => {
            user[key] = req.body[key]
            if (key == 'password') user.hashPassword(user[key])
        })

        await user.save()

        next()
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server Error' })
    }
}

module.exports.me = async (req, res) => {
    try {
        var User = mongoose.models.User
        var user = await User.findOne({ discordId: req.jwtData.discordId }).select(['-password', '-_id', '-__v'])
        res.status(200).send(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Internal Server Error' })
    }
}