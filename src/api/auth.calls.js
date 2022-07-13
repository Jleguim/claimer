const requests = require('superagent')

const config = require('../config.json')
const { updateToken, getToken } = require('../configData')
const { getTokenFromResponse } = require('./utils')

module.exports.check = (e) => {
    return new Promise(async (resolve, reject) => {
        var endpoint = `${config.API}/auth/check`
        var jwtCookie = `jwt=${getToken()}`

        try {
            var response = await requests
                .get(endpoint)
                .set('Cookie', jwtCookie)
                .ok(res => res.status < 500)

            if (response.status == 400) return resolve('Invalid JWT.')

            // TODO: Refresh jwt
            resolve()
        } catch (err) {
            console.log(err.message)
            resolve('Internal error.')
        }
    })
}

module.exports.login = (e, username, password) => {
    return new Promise(async (resolve, reject) => {
        var endpoint = `${config.API}/auth/login`
        var credentials = { username, password }

        try {
            var response = await requests
                .get(endpoint)
                .send(credentials)
                .ok(res => res.status < 500)

            if (response.status == 400 || response.status == 401) return resolve('Invalid credentials.')

            var jwt = getTokenFromResponse(response)
            updateToken(jwt)

            resolve(null)
        } catch (err) {
            console.log(err)
            resolve('Internal error.')
        }
    })
}