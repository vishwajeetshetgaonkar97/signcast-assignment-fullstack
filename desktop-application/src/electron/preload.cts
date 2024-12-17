import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('electron', {
  // Exposing the getCanvases function
  getCanvases: async () => ipcRenderer.invoke('get-canvases'),

  getDevices: async () => ipcRenderer.invoke('get-devices'),


});
