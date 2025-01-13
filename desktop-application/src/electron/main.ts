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

// ipcMain.handle('get-canvases', async () => {
//   return new Promise((resolve, reject) => {
//     const request = net.request(`${BaseUrl}/canvases`);
    
//     request.on('response', (response) => {
//       let data = '';
//       response.on('data', (chunk) => {
//         data += chunk;
//       });

//       response.on('end', () => {
//         try {
//           const parsedData = JSON.parse(data);
//           console.log("Data from canvases:", parsedData);
//           resolve(parsedData.canvases);
//         } catch (error) {
//           console.error('Error parsing response:', error);
//           reject(new Error('Error parsing response'));
//         }
//       });
//     });

//     request.on('error', (error) => {
//       console.error(`Error fetching canvases: ${error}`);
//       reject(new Error('Error fetching canvases'));
//     });

//     request.end();
//   });
// });


ipcMain.handle('get-canvases', async () => {
  return new Promise((resolve, reject) => {
    const request = net.request(`${BaseUrl}/canvases`);
    
    request.on('response', (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          console.log("Data from canvases:", parsedData);
          resolve(parsedData.canvases);
        } catch (error) {
          console.error('Error parsing response:', error);
          reject(new Error('Error parsing response'));
        }
      });
    });

    request.on('error', (error) => {
      console.error(`Error fetching canvases: ${error}`);
      reject(new Error('Error fetching canvases'));
    });

    request.end();
  });
});

ipcMain.handle('get-devices', async () => {
  return new Promise((resolve, reject) => {
    const request = net.request(`${BaseUrl}/devices/device/6782dc6b78a3d0fd12176d96`);

    request.on('response', (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          console.log("Device Data:", parsedData.deviceop);
          resolve(parsedData.deviceop);
        } catch (error) {
          console.error('Error parsing response:', error);
          reject(new Error('Error parsing response'));
        }
      });
    });

    request.on('error', (error) => {
      console.error(`Error fetching devices: ${error}`);
      reject(new Error('Error fetching devices'));
    });

    request.end();
  });
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
