const { app } = require('electron')
const fs = require('fs')

var jwt = undefined

function saveJWT() {
    if (jwt == undefined) return

    var usrDataPath = app.getPath('userData')
    var configPath = usrDataPath + '\\config.json'

    if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, JSON.stringify({}, 0, 3))

    var configData = JSON.parse(fs.readFileSync(configPath))
    configData.jwt = jwt

    fs.writeFileSync(configPath, JSON.stringify(configData, 0, 3))
}

module.exports = {
    getToken: () => jwt,
    updateToken: newToken => jwt = newToken,
    saveJWT
}