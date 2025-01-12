import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import readline from 'readline';
import WebSocket from 'ws';

let clients: Map<string, WebSocket> = new Map(); // Map of client IDs to WebSocket connections

export const setupWebSocket = (server: any) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    // Assign a unique ID to each client
    const clientId = uuidv4();
    console.log(`Client connected: ${clientId}`);
    clients.set(clientId, ws);

    ws.send(JSON.stringify({ type: 'CONNECTED', clientId })); // Send client ID to the client

    ws.on('close', () => {
      console.log(`Client disconnected: ${clientId}`);
      clients.delete(clientId);
    });

    ws.on('message', (message) => {
      const data = JSON.parse(message.toString());

      // Handle messages from clients
      if (data.type === 'REQUEST_GRAPH') {
        streamGraphVisualization(data.clientId, data.graphFilePath);
      }
    });
  });
};


const streamGraphVisualization = async (clientId: string, filePath: string) => {
  const client = clients.get(clientId);

  if (!client || client.readyState !== WebSocket.OPEN) {
    console.error(`Client ${clientId} not connected or unavailable`);
    return;
  }

  try {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const [from, to] = line.split(' ').map(Number); // Parse line

      const nodeData = {
        action: 'add',
        nodes: [
          { id: from, label: `Node ${from}` },
          { id: to, label: `Node ${to}` },
        ],
        edges: [{ from, to }],
      };

      // Send data only to the specific client
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(nodeData));
      }

      // Delay between sending each line
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  } catch (err) {
    console.error(`Error streaming graph data to client ${clientId}:`, err);
  }
};
