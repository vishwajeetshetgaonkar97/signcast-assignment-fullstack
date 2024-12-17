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


  // const wss = new WebSocket("wss://signcast-assignment-fullstack-production.up.railway.app/");

  

//   const wss = new WebSocket("ws://localhost:3001");

//   wss.onopen = () => {
//     console.log("WebSocket connected");
//   };
//   wss.onmessage = (event: any ) => {
//     try {
//       const data = JSON.parse(event.data);
//       console.log("Received data:", data);


//       if (data.type === "updateAllCanvas") {
//         console.log("Updating canvas objects for all:", data);
//         ipcMain.emit('get-socket-response', data.canvases);
// console.log("Updating canvas objects for all:", data);
//       } else if (data.type === "notification") {
//         console.log("Notification:", data.message);
//       }
//     } catch (error) {
//       console.error("Error parsing WebSocket message:", error);
//     }
//   };

  // ipcMain.handle('get-socket',()=>{
  //   return wss
  // })

  // wss.onclose = () => {
  //   console.log("WebSocket disconnected");
 
  // };



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
