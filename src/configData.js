const { app } = require('electron')
const fs = require('fs')

var jwt = undefined

var usrDataPath = app.getPath('userData')
var configPath = usrDataPath + '\\config.json'

if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, JSON.stringify({}, 0, 3))

var configData = JSON.parse(fs.readFileSync(configPath))

function saveConfigData() {
    fs.writeFileSync(configPath, JSON.stringify(configData, 0, 3))
}

function getToken() {
    if (jwt != undefined) return jwt
    return configData.jwt
}

function updateToken(token) {
    jwt = token
    configData.jwt = jwt
    saveConfigData()
}

module.exports = {
    getToken,
    updateToken,
    saveConfigData
}