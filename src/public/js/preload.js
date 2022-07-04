const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('requests', {
    login: (username, password) => ipcRenderer.invoke('login', username, password),
    getProducts: (jwt) => ipcRenderer.invoke('getProducts', jwt)
})

contextBridge.exposeInMainWorld('keys', {
    jwt: (token) => ipcRenderer.invoke('jwt', token)
})