const User = require('mongoose').models.User
const jwt = require('../auth/jwt')

// * GET api/@me
async function getData(req, res) {
    var ignoredFields = ['-password', '-_id', '-__v']
    var user = await User.findById(req.user_doc.id).select(ignoredFields)
    res.status(200).send(user)
}

// * PUT api/@me
async function updateData(req, res) {
    var user = req.user_doc

    var keysToUpdate = Object.keys(req.body)
    keysToUpdate.forEach(key => {
        user[key] = req.body[key]
        if (key == 'password') user.hashPassword(user[key])
    })

    var data = { username: user.username, discordId: user.discordId }
    var newToken = await jwt.sign(data)

    res.cookie('jwt', newToken)
    await user.save()

    res.status(200).send({ message: 'Updated user' })
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
    getData: (req, res) => wrapController(getData, req, res),
    updateData: (req, res) => wrapController(updateData, req, res)
}