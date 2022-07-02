const { ipcMain } = require('electron')
const requests = require('superagent')

const config = require('./config.json')

ipcMain.handle('getProducts', (event, jwt) => {
    return new Promise((resolve, reject) => {
        var endpoint = config.API + '/api/products'
        
        requests.get(endpoint)
            .set('Cookie', `jwt=${jwt}`)
            .then((res) => {
                var set_cookie = res.header['set-cookie']

                console.log(res.header)


                var jwt_cookie = set_cookie[0]
                var newJwt = jwt_cookie.split('; ')[0].split('=')[1]

                resolve({ jwt: newJwt, text: res.text, body: res.body })
            })
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

                resolve({ jwt: newJwt, text: res.text, body: res.body })

                // var cookies = {}
                // set_cookie.map(cookie => {
                //     var params = cookie.split('; ')
                //     params.map(param => {
                //         var data = param.split('=')
                //         cookies[data[0]] = data[1]
                //     })
                // })
                // console.log(cookies)
            })
            .catch(reject)
    })
})