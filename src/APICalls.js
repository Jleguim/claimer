const { ipcMain } = require('electron')
const requests = require('superagent')

const config = require('./config.json')
const { getToken, updateToken } = require('./jwt.js')

ipcMain.handle('getProducts', (event) => {
    return new Promise((resolve, reject) => {
        var endpoint = config.API + '/api/products'
        var jwt = getToken()

        requests.get(endpoint)
            .set('Cookie', `jwt=${jwt}`)
            .then((res) => resolve({ text: res.text, body: res.body }))
            .catch(reject)
    })
})

ipcMain.handle('login', (event, username, password) => {
    return new Promise((resolve, reject) => {
        var endpoint = config.API + '/auth/login'
        var body = JSON.stringify({ username, password })

        requests.get(endpoint)
            .set('Content-Type', 'application/json')
            .send(body)
            .then((res) => {
                var set_cookie = res.header['set-cookie']
                var jwt_cookie = set_cookie[0]

                var newJwt = jwt_cookie.split('; ')[0].split('=')[1]
                updateToken(newJwt)

                resolve({ text: res.text, body: res.body })
            })
            .catch(reject)
    })
})