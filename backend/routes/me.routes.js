const controller = require('../controllers/me.controller')

module.exports = (app) => {
    // * Get my info
    app.get('/api/@me', controller.getData)

    // * Update my info
    app.put('/api/@me', controller.updateData)
}