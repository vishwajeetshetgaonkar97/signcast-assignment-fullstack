import { contextBridge, ipcRenderer } from 'electron';
const { io } = require('socket.io-client');

// Define the types for the message and callback
type Message = string; // Replace with appropriate type if necessary
type MessageCallback = (event: Electron.IpcRendererEvent, message: string) => void; // Adjust the type based on your message structure

contextBridge.exposeInMainWorld('electron', {
  // Exposing the getCanvases function
  getCanvases: () => ipcRenderer.invoke('get-canvases'),

  connectSocket: () => io('http://localhost:3001'),
});
