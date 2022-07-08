const { BrowserWindow } = require('electron')
const config = require('./config.json')
var mainWindow

function createMainWindow(winConfig) {
    mainWindow = new BrowserWindow(winConfig)
    // mainWindow.removeMenu()
    return mainWindow
}

function changeMainWindowHTML(path) {
    mainWindow.loadFile(path)

    return mainWindow
}

function createChildWindow(winConfig, path, isUrl = false) {
    var childWindow = new BrowserWindow({ parent: mainWindow, ...winConfig })

    if (isUrl) childWindow.loadURL(path)
    else childWindow.loadFile(path)

    return childWindow
}

module.exports = {
    createMainWindow,
    changeMainWindowHTML,
    createChildWindow
}