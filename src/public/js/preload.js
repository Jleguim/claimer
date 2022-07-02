const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('requests', {
    get: (path = '/', options) => ipcRenderer.invoke('get', path, options)
})