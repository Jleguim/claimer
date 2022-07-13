const { ipcMain } = require('electron')

const winManager = require('./winManager')
const configData = require('./configData')
const config = require('./config.json')

const product = require('./api/product.calls')
const auth = require('./api/auth.calls')
const me = require('./api/me.calls')

ipcMain.handle('resumeSession', auth.check)
ipcMain.handle('login', auth.login)

ipcMain.handle('@me', me.me)
ipcMain.handle('updateUsername', me.updateUsername)
ipcMain.handle('updatePassword', me.updatePassword)

ipcMain.handle('getProducts', product.getProducts)
ipcMain.handle('getProduct', product.getProduct)
ipcMain.handle('buyProduct', product.buyProduct)

ipcMain.handle('logout', (event) => {
    configData.updateToken('')
    configData.saveConfigData()
})

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

    discordWindow.on('close', () => ipcMain.removeHandler('closeDiscordAuthWindow'))

    ipcMain.handle('closeDiscordAuthWindow', (event, body) => {
        var data = JSON.parse(body)
        var mainWindow = discordWindow.getParentWindow()

        configData.updateToken(data.jwt)
        discordWindow.close()

        mainWindow.webContents.send('discordAuthFinished')
    })
})