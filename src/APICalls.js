const { ipcMain } = require('electron')
const requests = require('superagent')

const config = require('./config.json')
const { getToken, updateToken } = require('./configData.js')

ipcMain.handle('resumeSession', (event) => {
    return new Promise((resolve, reject) => {
        var endpoint = config.API + '/auth/check'
        var jwt = getToken()

        requests.get(endpoint)
            .set('Cookie', `jwt=${jwt}`)
            .ok(res => res.status < 500)
            .then((res) => {
                if (res.body.message != 'Authed!') return reject()
                resolve()
            })
            .catch(reject)
    })
})

ipcMain.handle('@me', (event) => {
    return new Promise((resolve, reject) => {
        var endpoint = config.API + '/api/@me'
        var jwt = getToken()

        requests.get(endpoint)
            .set('Cookie', `jwt=${jwt}`)
            .ok(res => res.status < 500)
            .then((res) => resolve({ text: res.text, body: res.body }))
            .catch(reject)
    })
})

ipcMain.handle('getProducts', (event) => {
    return new Promise((resolve, reject) => {
        var endpoint = config.API + '/api/products'
        var jwt = getToken()

        requests.get(endpoint)
            .set('Cookie', `jwt=${jwt}`)
            .ok(res => res.status < 500)
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
            .ok(res => res.status < 500)
            .then((res) => {
                var data = { text: res.text, body: res.body, status: res.status }

                if (res.status == 200) {
                    var set_cookie = res.header['set-cookie']
                    var jwt_cookie = set_cookie[0]

                    var newJwt = jwt_cookie.split('; ')[0].split('=')[1]
                    updateToken(newJwt)
                }

                resolve(data)
            })
            .catch(reject)
    })
})