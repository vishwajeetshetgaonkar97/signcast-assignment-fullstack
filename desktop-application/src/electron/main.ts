import { app, BrowserWindow, ipcMain, net } from 'electron';
import { isDev } from './util.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';
import { createTray } from './tray.js';
import { createMenu } from './menu.js';


const BaseUrl = 'https://signcast-assignment-fullstack-production-32ab.up.railway.app';

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    frame: true,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  // Handle the fullscreen toggle IPC call
  ipcMain.on('toggle-fullscreen', () => {
    const isFullscreen = mainWindow.isFullScreen();

    if (isFullscreen) {
      mainWindow.setFullScreen(false);
      mainWindow.setBounds({ width: 1024, height: 768 });
      mainWindow.setResizable(true);
    } else {
      // If not fullscreen, enable the frame
      mainWindow.setFullScreen(true);
    }
  });

  ipcMain.handle('get-canvases', async () => {
    try {
      const response = await fetch(`${BaseUrl}/canvases`);
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
      const response = await fetch(`${BaseUrl}/devices/device/6782dc6b78a3d0fd12176d96`);
      console.log("Response", response);
      const data = await response.json();
      console.log("Device Data", data.deviceop);
      return data.deviceop;
    } catch (error) {
      console.error(`Error fetching Devices: ${error}`);
      throw new Error('Error fetching Devices');
    }
  });

  ipcMain.on('check-network-status', (event) => {
    const isOnline = net.isOnline();
    event.sender.send('network-status', isOnline);
  });

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(getUIPath());
    mainWindow.webContents.openDevTools();
  }

  createTray(mainWindow);
  createMenu(mainWindow);
});
