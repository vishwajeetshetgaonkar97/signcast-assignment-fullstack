const electron = require('electron');
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getCanvases: () => ipcRenderer.invoke('get-canvases'),  // Safe method to invoke the handler
  });