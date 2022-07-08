const { ipcMain } = require('electron')

const winManager = require('./winManager')
const configData = require('./configData')
const config = require('./config.json')

ipcMain.handle('createDiscordAuthWindow', (event) => {
    var url = `${config.API}/auth/discord`
    var winConfig = {
        width: 854,
        height: 480,
        resizable: false,
        webPreferences: {
            preload: __dirname + '/public/js/preload.js'
        }
    }

    var discordWindow = winManager.createChildWindow(winConfig, url, true)
    discordWindow.removeMenu()

    ipcMain.handleOnce('closeDiscordAuthWindow', (event, body) => {
        var data = JSON.parse(body)
        var mainWindow = discordWindow.getParentWindow()

        mainWindow.webContents.send('discordAuthFinished')
        configData.updateToken(data.jwt)
        discordWindow.close()
    })
})