import { app, BrowserWindow, ipcMain } from 'electron';
import { isDev } from './util.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';
import { createTray } from './tray.js';
import { createMenu } from './menu.js';

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    frame: true, 
    webPreferences: { 
      preload: getPreloadPath(),
      contextIsolation: true,
    },
  });

  // Handle the fullscreen toggle IPC call
  ipcMain.on('toggle-fullscreen', () => {
    const isFullscreen = mainWindow.isFullScreen();

    if (isFullscreen) {
      // If already fullscreen, remove the frame
      mainWindow.setFullScreen(false);
      mainWindow.setBounds({ width: 800, height: 600 }); // Reset the size if needed
      mainWindow.setResizable(true); // Allow resizing after exiting fullscreen
    } else {
      // If not fullscreen, enable the frame
      mainWindow.setFullScreen(true);
    }
  });

  ipcMain.handle('get-canvases', async () => {
    try {
      const response = await getAllCanvases();
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
