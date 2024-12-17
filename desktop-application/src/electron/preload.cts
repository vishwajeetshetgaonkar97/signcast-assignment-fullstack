import { contextBridge, ipcRenderer } from 'electron';


contextBridge.exposeInMainWorld('electron', {
  // Exposing the getCanvases function
  getCanvases: () => ipcRenderer.invoke('get-canvases'),

});
