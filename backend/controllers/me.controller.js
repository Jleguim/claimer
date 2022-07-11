const User = require('mongoose').models.User
const jwt = require('../auth/jwt')

// * GET api/@me
async function getData(req, res) {
    var data = req.user_doc.toJSON()
    handler(res, 200, data)
}

// * PUT api/@me/:fieldToUpdate
async function updateData(req, res) {
    var fieldToUpdate = req.params.fieldToUpdate
    var newValue = req.body.newValue

    var FORBIDDEN_FIELDS = ['points', '_id', '__v', 'discordId']
    var user = req.user_doc

    // TODO: regex for invalid usernames or passwords
    if (newValue == '') return handler(res, 400, 'Invalid value')
    if (Object.keys(req.body).length == 0) return handler(res, 400, 'Body can not be empty')
    if (FORBIDDEN_FIELDS.includes(fieldToUpdate)) return handler(res, 401)
    if (!Object.keys(user._doc).includes(fieldToUpdate)) return handler(res, 401)

    user[fieldToUpdate] = (fieldToUpdate == 'hashedPassword') ? User.hash(newValue) : newValue
    await user.save()

    var data = user.jwtPrepare()
    var newToken = await jwt.sign(data)
    res.cookie('jwt', newToken)

    handler(res, 200, 'Updated user')
}

async function handler(res, STATUS_CODE = 500, message = 'Unknown error') {
    if (STATUS_CODE > 200) res.clearCookie('jwt')
    if (STATUS_CODE == 401) message = 'Unauthorized'

    if ((typeof message) == 'object') return res.status(STATUS_CODE).send(message)
    res.status(STATUS_CODE).send({ message })
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