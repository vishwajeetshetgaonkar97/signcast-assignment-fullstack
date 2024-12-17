import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('electron', {
  getCanvases: async () => ipcRenderer.invoke('get-canvases'),

  getDevices: async () => ipcRenderer.invoke('get-devices'),

  getSocketResponse: async () => ipcRenderer.invoke('get-socket-response'),

  getSocket: async () => ipcRenderer.invoke('get-socket'),

});
