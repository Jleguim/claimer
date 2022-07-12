const { validationResult } = require('express-validator')

const jwt = require('../auth/jwt')

// * GET api/@me
async function getData(req, res) {
    var errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.clearCookie('jwt')
        return res.status(400).send({
            message: 'Bad Request',
            errors: errors.array()
        })
    }
    
    var data = req._user.toJSON()
    handler(res, 200, data)
}

// * PUT api/@me/:fieldToUpdate
async function updateData(req, res) {
    var errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.clearCookie('jwt')
        return res.status(400).send({
            message: 'Bad Request',
            errors: errors.array()
        })
    }

    var fieldToUpdate = req.params.fieldToUpdate
    var newValue = req.body.newValue
    var user = req._user

    var needsHash = req._needsHash

    user[fieldToUpdate] = (needsHash) ? user.hash(newValue) : newValue
    user.save()

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