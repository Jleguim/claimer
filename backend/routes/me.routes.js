const controller = require('../controllers/me.controller')
const validator = require('../validators/me.validators')

module.exports = (app) => {
    // * Get my info
    app.get('/api/@me', controller.getData)

    // * Update my info
    app.put('/api/@me/:fieldToUpdate',
        validator.hasFieldToUpdate,
        validator.hasNewValue,
        controller.updateData)
}