import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import readline from 'readline';
import WebSocket from 'ws';
import { HTTP } from '../constants/constants';
import { ErrorCode, ErrorMsg } from '../constants/error.constants';
import { CYPHER_AST_COMMAND } from '../constants/frontend.server.constants';
import { getClusterDetails, socket, telnetConnection } from "./graph.controller";

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

      if (data.type === 'QUERY') {
        streamQueryResult(data.clientId);
      }
    });
  });
};

export const sendToClient = (clientId, data) => {
  const client = clients.get(clientId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
    console.log(`Sent data to client ${clientId}:`, data);
  } else {
    console.error(`Client ${clientId} not connected or WebSocket not open.`);
  }
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

const streamQueryResult = async (clientId: string) => {
  // const connection = await getClusterDetails(req);
  // if (!(connection.host || connection.port)) {
  //   return res.status(404).send(connection);
  // }

  const connection = {
    host: "10.8.100.245",
    port: 7776
  }

  let sharedBuffer: string[] = [];

  const producer = async () => {
    console.log("PRODUCER START WORK")
    var remaining: string = '';

    while(true){
      if(sharedBuffer.length > 0){
        remaining += sharedBuffer.shift()!
        
        let splitIndex;

        if(remaining.trim() == '-1'){
          console.log("Termination signal received. Closing Telnet connection.");
          return
        }
        
        // Extract complete JSON objects from the buffer
        while ((splitIndex = remaining.indexOf('\n')) !== -1) {
          const jsonString = remaining.slice(0, splitIndex).trim(); // Extract a complete object
          remaining = remaining.slice(splitIndex + 1); // Remove processed part
          
          if (jsonString) {
            if (jsonString == "-1") {
              console.log("Termination signal received. Closing Telnet connection.");
              return; // Exit the producer loop
            }
            
            try {
              const parsed = JSON.parse(jsonString); // Parse the JSON
              console.log("===>>>", parsed)
              sendToClient(clientId, parsed)
            } catch (error) {
              console.error('Error parsing JSON:', error, 'Data:', jsonString);
            }
          }


          if(remaining.trim() == '-1' || jsonString == '-1'){
            console.log("Termination signal received. Closing Telnet connection.");
            return
          }
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  try {
    telnetConnection({host: connection.host, port: connection.port})((tSocket: any) => {
      producer();

      console.log("function continuing");
      tSocket.on('data', (buffer) => {
        sharedBuffer.push(buffer.toString('utf8'))
      });

      tSocket.on('end', () => {
        console.log('Telnet connection ended');
      });

      // Write the command to the Telnet server
      tSocket.write(CYPHER_AST_COMMAND + '|1|match (n) return n' + '\n', 'utf8', ()=>{
        setTimeout(()=>{}, 5000)
      });
    });
  } catch (err) {
    return console.log({ code: ErrorCode.ServerError, message: ErrorMsg.ServerError, errorDetails: err });
  }
}
