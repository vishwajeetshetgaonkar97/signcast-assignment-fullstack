import { app, BrowserWindow, ipcMain } from 'electron';
import { isDev } from './util.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';
import { createTray } from './tray.js';
import { createMenu } from './menu.js';
import {WebSocket} from "ws";

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: { 
      preload: getPreloadPath(),
    
    },
  });

  ipcMain.handle('get-canvases', async () => {
    try {
      const response = await fetch('https://signcast-assignment-fullstack-production.up.railway.app/canvases');
      const data = await response.json();
      console.log("Data from canvases:", data);
      return data.canvases; 
    } catch (error) {
      console.error(`Error fetching canvases: ${error}`);
      throw new Error('Error fetching canvases');
    }
  });

  ipcMain.handle('get-devices', async () => {
    try {
      const response = await fetch('https://signcast-assignment-fullstack-production.up.railway.app/devices/device/675f2e50e23a9c8e760a8839');
      console.log("Response", response);
      const data = await response.json();
      console.log("Device Data", data.deviceop);
      return data.deviceop; 
    } catch (error) {
      console.error(`Error fetching Devices: ${error}`);
      throw new Error('Error fetching Devices');
    }
  });

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(getUIPath());
  }

  createTray(mainWindow);
  createMenu(mainWindow);
});
