const { app, BrowserWindow, ipcMain } = require('electron')
const requests = require('superagent')

const config = require('./config.json')

ipcMain.handle('login', (event, username, password) => {
    return new Promise((resolve, reject) => {
        var endpoint = config.API + '/auth/login'
        var body = JSON.stringify({ username, password })

        requests.get(endpoint)
            .set('Content-Type', 'application/json')
            .send(body)
            .then((res) => {
                resolve(res.text)
            })
            .catch(reject)
    })
})

app.whenReady().then(() => {
    let win = new BrowserWindow({
        ...config.windowOptions.default,
        webPreferences: {
            preload: __dirname + "/public/js/preload.js"
        }
    })
    // win.removeMenu()
    win.loadFile(__dirname + '/public/views/main.html')
})