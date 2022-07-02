const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Claimer',
        icon: './public/icon.ico'
    })

    win.removeMenu()
    win.loadFile('./public/views/main.html')
})