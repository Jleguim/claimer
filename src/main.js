const { app, BrowserWindow } = require('electron')

const config = require('./config.json')
const configData = require('./configData')

console.log(app.getPath('userData'))

app.whenReady().then(() => {
    let win = new BrowserWindow({
        ...config.windowOptions.dev,
        icon: __dirname + '/public/icon.ico',
        webPreferences: {
            preload: __dirname + "/public/js/preload.js"
        }
    })
    // win.removeMenu()
    win.loadFile(__dirname + '/public/views/login.html')
    
    require('./APICalls.js')
})

app.addListener('before-quit', (event) => configData.saveConfigData())