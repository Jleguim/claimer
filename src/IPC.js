const { ipcMain } = require('electron')

const config = require('./config.json')
const jwt = undefined

ipcMain.handle('jwt', (event, token) => {
    if (token) return jwt = token
    if (jwt == undefined) return new Error('JWT is still not set.')

    return jwt
})