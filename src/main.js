const { app, BrowserWindow, ipcMain } = require('electron')
const requests = require('superagent')

ipcMain.handle('get', (event, path, options) => {
    return new Promise((resolve, reject) => {
        requests.get('localhost:1337' + path)
            .then((res) => {
                resolve(res.text)
            })
    })
})

app.whenReady().then(() => {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Claimer',
        icon: __dirname + '/public/icon.ico',
        webPreferences: {
            preload: __dirname + '/public/js/preload.js'
        }
    })

    // win.removeMenu()
    win.loadFile(__dirname + '/public/views/main.html')
})