const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  
  clients.add(ws);

  // Detailed message logging middleware
  ws.on('message', (rawMessage) => {
    try {
      // Convert raw message to string and parse
      const messageStr = rawMessage.toString();
      console.log('=== INCOMING RAW MESSAGE ===');
      console.log('Raw Message String:', messageStr);

      // Attempt to parse JSON
      const data = JSON.parse(messageStr);
      
      console.log('=== PARSED MESSAGE DETAILS ===');
      console.log('Message Type:', data.type);
      console.log('Full Message Object:', JSON.stringify(data, null, 2));

      // Detailed object inspection
      if (data.type === 'addRectangle') {
        console.log('Rectangle Details:');
        console.log('- X Position:', data.object.x);
        console.log('- Y Position:', data.object.y);
        console.log('- Width:', data.object.width);
        console.log('- Height:', data.object.height);
        console.log('- Fill Color:', data.object.fillColor);
        console.log('- Stroke Color:', data.object.strokeColor);
      }

      if (data.type === 'addLine') {
        console.log('Line Details:');
        console.log('- Points:', data.object.points);
        console.log('- Color:', data.object.color);
        console.log('- Stroke Width:', data.object.strokeWidth);
      }

      if (data.type === 'addImage') {
        console.log('Image Details:');
        console.log('- Image URL (first 50 chars):', 
          (data.object.imageUrl || '').substring(0, 50) + '...');
        console.log('- X Position:', data.object.x);
        console.log('- Y Position:', data.object.y);
      }

      // Broadcast to all clients
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });

    } catch (error) {
      console.error('=== PARSING ERROR ===');
      console.error('Error parsing message:', error);
      console.error('Raw message:', rawMessage);
    }
  });

  // Connection and disconnection logging
  ws.on('close', () => {
    console.log('WebSocket connection closed');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Debugging route to check server status
app.get('/debug', (req, res) => {
  res.json({
    status: 'Server is running',
    connectedClients: clients.size,
    timestamp: new Date().toISOString()
  });
});

app.get('/canvas', (req, res) => {
  res.json({
  status: 'Server is  canvas running',
  connectedClients: clients.size,
  timestamp: new Date().toISOString()
});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`
    ===== WebSocket Debug Server =====
    Port: ${PORT}
    Timestamp: ${new Date().toISOString()}
    Waiting for connections...
  `);
});

module.exports = { app, server, wss };