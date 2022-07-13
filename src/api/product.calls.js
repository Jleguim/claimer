const requests = require('superagent')

const config = require('../config.json')
const { updateToken, getToken } = require('../configData')
const { getTokenFromResponse } = require('./utils')

module.exports.getProducts = (e) => {
    return new Promise(async (resolve, reject) => {
        var endpoint = `${config.API}/api/product`
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

module.exports.getProduct = (e, productId) => {
    return new Promise(async (resolve, reject) => {
        var endpoint = `${config.API}/api/product/${productId}`
        var jwtCookie = `jwt=${getToken()}`

        try {
            var response = await requests
                .get(endpoint)
                .set('Cookie', jwtCookie)
                .ok(res => res.status < 500)

            if (response.status == 401) return end('Unauthorized.')

            var jwt = getTokenFromResponse(response)
            updateToken(jwt)

            resolve(null, response.body)
        } catch (err) {
            console.log(err.message)
            resolve('Internal error.')
        }
    })
}

module.exports.buyProduct = (e, productId) => {
    return new Promise(async (resolve, reject) => {
        var endpoint = `${config.API}/api/product/${productId}/buy`
        var jwtCookie = `jwt=${getToken()}`

        try {
            var response = await requests
                .put(endpoint)
                .set('Cookie', jwtCookie)
                .ok(res => res.status < 500)

            if (response.status == 401) return end('Unauthorized.')

            var jwt = getTokenFromResponse(response)
            updateToken(jwt)

            resolve(null)
        } catch (err) {
            console.log(err.message)
            resolve('Internal error.')
        }
    })
}