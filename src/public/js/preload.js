const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('requests', {
    resumeSession: () => ipcRenderer.invoke('resumeSession'),
    login: (username, password) => ipcRenderer.invoke('login', username, password),
    
    updatePassword: (newValue) => ipcRenderer.invoke('updatePassword', newValue),
    updateUsername: (newValue) => ipcRenderer.invoke('updateUsername', newValue),
    me: () => ipcRenderer.invoke('@me'),

    getProducts: () => ipcRenderer.invoke('getProducts'),
    buyProduct: (productId) => ipcRenderer.invoke('buyProduct', productId)
})

contextBridge.exposeInMainWorld('other', {
    logout: () => ipcRenderer.invoke('logout')
})

contextBridge.exposeInMainWorld('discord', {
    createDiscordAuthWindow: () => ipcRenderer.invoke('createDiscordAuthWindow'),
    closeDiscordAuthWindow: (body) => ipcRenderer.invoke('closeDiscordAuthWindow', body),
    handleDiscordAuthFinished: (callback) => ipcRenderer.on('discordAuthFinished', callback)
})