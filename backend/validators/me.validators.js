const { param, body } = require('express-validator')

module.exports.hasFieldToUpdate = param('fieldToUpdate')
    .exists({ checkFalsy: true, checkNull: true })
    .custom(async (v, { req }) => {
        var FORBIDDEN_FIELDS = ['points', '_id', '__v', 'discordId']
        if (FORBIDDEN_FIELDS.includes(v)) return Promise.reject('Forbidden field.')

        var userFields = Object.keys(req._user._doc)
        if (!userFields.includes(v)) return Promise.reject('Invalid field.')
    })

module.exports.hasNewValue = body('newValue')
    .exists({ checkFalsy: true, checkNull: true })
    .custom(async (v, { req }) => {
        var fieldToUpdate = req.param.fieldToUpdate
        var needsHash = (fieldToUpdate == 'hashedPassword') ? true : false
        req._needsHash = needsHash
    })