const { app, BrowserWindow } = require('electron')

const config = require('./config.json')
const configData = require('./configData')
const winManager = require('./winManager')

console.log(app.getPath('userData'))

app.whenReady().then(() => {
    var win = winManager.createMainWindow({
        ...config.windowOptions.dev,
        icon: __dirname + '/public/icon.ico',
        webPreferences: {
            preload: __dirname + '/public/js/preload.js'
        } 
    })

    // win.removeMenu()
    win.loadURL(__dirname + '/public/views/login.html')

    require('./APICalls.js')
})

app.addListener('before-quit', (event) => configData.saveConfigData())