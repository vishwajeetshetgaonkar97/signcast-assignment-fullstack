import { app, BrowserWindow, ipcMain } from 'electron';
import { isDev } from './util.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';
import { createTray } from './tray.js';
import { createMenu } from './menu.js';

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  // Handle request to get canvases from renderer
  ipcMain.handle('get-canvases', async () => {
    try {
      const response = await fetch('http://localhost:3001/canvases');
      const data = await response.json();
      console.log("Data from canvases:", data);
      return data.canvases; 
    } catch (error) {
      console.error(`Error fetching canvases: ${error}`);
      throw new Error('Error fetching canvases');
    }
  });

  // Load the appropriate URL or file based on the environment
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(getUIPath());
  }

  createTray(mainWindow);
  createMenu(mainWindow);
});
