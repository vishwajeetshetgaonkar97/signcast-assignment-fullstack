import { app, BrowserWindow, ipcMain } from 'electron';
import { isDev } from './util.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';
import { createTray } from './tray.js';
import { createMenu } from './menu.js';
import WebSocket, { WebSocketServer } from 'ws'; 

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  const wss = new WebSocketServer({ port: 3001 }); 

  // When a client connects
  wss.on('connection', (ws: WebSocket) => {
    console.log('A new client connected');

    // Send a message to the client when they connect
    ws.send('Hello Client!');

    // Listen for messages from the client
    ws.on('message', (message: string) => {
      console.log('Received:', message);
      // You can broadcast the message to all connected clients if needed
      wss.clients.forEach((client: WebSocket) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    // Handle client disconnection
    ws.on('close', () => {
      console.log('A client disconnected');
    });
  });

  // Handle request to get canvases from renderer
  ipcMain.handle('get-canvases', async () => {
    try {
      const response = await fetch('http://localhost:3001/canvases');
      const data = await response.json();
      return data.canvases; // Return canvases data to renderer
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
