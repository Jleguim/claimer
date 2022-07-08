const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('requests', {
    login: (username, password) => ipcRenderer.invoke('login', username, password),
    getProducts: () => ipcRenderer.invoke('getProducts'),
    resumeSession: () => ipcRenderer.invoke('resumeSession')
})

contextBridge.exposeInMainWorld('discord', {
    createDiscordAuthWindow: () => ipcRenderer.invoke('createDiscordAuthWindow'),
    closeDiscordAuthWindow: (body) => ipcRenderer.invoke('closeDiscordAuthWindow', body),
    handleDiscordAuthFinished: (callback) => ipcRenderer.on('discordAuthFinished', callback)
})