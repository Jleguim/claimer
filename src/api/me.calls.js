const requests = require('superagent')

const config = require('../config.json')
const { updateToken, getToken } = require('../configData')
const { getTokenFromResponse } = require('./utils')

module.exports.me = (e) => {
    return new Promise(async (resolve, reject) => {
        var endpoint = `${config.API}/api/@me`
        var jwtCookie = `jwt=${getToken()}`

        var end = (err, data) => resolve({ err, data })

        try {
            var response = await requests
                .get(endpoint)
                .set('Cookie', jwtCookie)
                .ok(res => res.status < 500)

            if (response.status == 401) return end('Unauthorized.')

            var jwt = getTokenFromResponse(response)
            updateToken(jwt)

            end(null, response.body)
        } catch (err) {
            console.log(err.message)
            end('Internal error.')
        }
    })
}

module.exports.updateUsername = (e, newValue) => {
    var field = 'username'
    return this.updateMe(field, newValue)
}

module.exports.updatePassword = (e, newValue) => {
    var field = 'hashedPassword'
    return this.updateMe(field, newValue)
}

module.exports.updateMe = (field, newValue) => {
    return new Promise(async (resolve, reject) => {
        var endpoint = `${config.API}/api/@me/${field}`
        var jwtCookie = `jwt=${getToken()}`
        var body = { newValue }

        try {
            var response = await requests
                .put(endpoint)
                .set('Cookie', jwtCookie)
                .send(body)
                .ok(res => res.status < 500)

            if (response.status == 401) return resolve('Unauthorized.')

            var jwt = getTokenFromResponse(response)
            updateToken(jwt)

            resolve(null)
        } catch (err) {
            console.log(err.message)
            resolve('Internal error.')
        }
    })
}