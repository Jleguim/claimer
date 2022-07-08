const functions = require('./functions.js')
const middleware = require('./middleware.js')

module.exports = {
    verify: functions.verify,
    sign: functions.sign,

    isAuthorized: middleware.isAuthorized
}