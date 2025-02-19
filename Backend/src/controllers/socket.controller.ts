/**
Copyright 2025 JasminGraph Team
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import readline from 'readline';
import WebSocket from 'ws';
import { HTTP, TIMEOUT } from '../constants/constants';
import { ErrorCode, ErrorMsg } from '../constants/error.constants';
import { CYPHER_AST_COMMAND, CYPHER_COMMAND, INDEGREE_COMMAND, OUTDEGREE_COMMAND } from '../constants/frontend.server.constants';
import { getClusterDetails, IConnection, socket, telnetConnection } from "./graph.controller";
import { Cluster } from '../models/cluster.model';

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
        streamQueryResult(data.clientId, data.clusterId, data.graphId, data.query);
      }

      if (data.type === "GRAPH_DEGREE") {
        getDegreeData(data.clientId, data.clusterId, data.graphId, data.degree_type)
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
    }
  } catch (err) {
    console.error(`Error streaming graph data to client ${clientId}:`, err);
  }
};

const streamQueryResult = async (clientId: string, clusterId:string, graphId:string, query: string) => {
  const cluster = await Cluster.findOne({ _id: clusterId });
  if (!(cluster?.host || cluster?.port)) {
    sendToClient(clientId, { Error: "cluster not found"})
    return
  }

  const connection: IConnection = {
    host: cluster.host,
    port: cluster.port
  }

  let sharedBuffer: string[] = [];

  const producer = async () => {
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

      await new Promise((resolve) => setTimeout(resolve, TIMEOUT.hundred));
    }
  }

  try {
    telnetConnection({host: connection.host, port: connection.port})((tSocket: any) => {
      producer();

      tSocket.on('data', (buffer) => {
        sharedBuffer.push(buffer.toString('utf8'))
      });

      tSocket.on('end', () => {
        console.log('Telnet connection ended');
      });

      // Write the command to the Telnet server
      tSocket.write(CYPHER_COMMAND + '|' + graphId + '|' + query + '\n', 'utf8');
    });
  } catch (err) {
    return console.log({ code: ErrorCode.ServerError, message: ErrorMsg.ServerError, errorDetails: err });
  }
}

const getDegreeData = async (clientId: string, clusterId:string, graphId:string, type: string) => {
  const COMMAND = type == "in_degree" ? INDEGREE_COMMAND : type == "out_degree" ? OUTDEGREE_COMMAND : INDEGREE_COMMAND;   
  
  const cluster = await Cluster.findOne({ _id: clusterId });
  if (!(cluster?.host || cluster?.port)) {
    sendToClient(clientId, { Error: "cluster not found"})
    return
  }

  const connection: IConnection = {
    host: cluster.host,
    port: cluster.port
  }

  let sharedBuffer: string[] = [];

  const producer = async () => {
    var remaining: string = '';

    while(true){
      if(sharedBuffer.length > 0){
        remaining += sharedBuffer.shift()!
        
        let splitIndex;

        if(remaining.trim() == '-1'){
          sendToClient(clientId, { graphId, degree_type: type, type: "FINISHED" })
          console.log("Termination signal received. Closing Telnet connection.");
          return
        }
        
        // Extract complete JSON objects from the buffer
        while ((splitIndex = remaining.indexOf('\n')) !== -1) {
          const jsonString = remaining.slice(0, splitIndex).trim(); // Extract a complete object
          remaining = remaining.slice(splitIndex + 1); // Remove processed part
          
          if (jsonString) {
            if (jsonString == "-1") {
              sendToClient(clientId, { graphId, degree_type: type, type: "FINISHED" })
              console.log("Termination signal received. Closing Telnet connection.");
              return; // Exit the producer loop
            }
            
            try {
              const parsed = JSON.parse(jsonString); // Parse the JSON
              sendToClient(clientId, {...parsed, type})
            } catch (error) {
              console.error('Error parsing JSON:', error, 'Data:', jsonString);
            }
          }


          if(remaining.trim() == '-1' || jsonString == '-1'){
            sendToClient(clientId, { graphId, degree_type: type, type: "FINISHED" })
            console.log("Termination signal received. Closing Telnet connection.");
            return
          }
        }
      }

      await new Promise((resolve) => setTimeout(resolve, TIMEOUT.hundred));
    }
  }

  try {
    telnetConnection({host: connection.host, port: connection.port})((tSocket: any) => {
      producer();

      tSocket.on('data', (buffer) => {
        sharedBuffer.push(buffer.toString('utf8'))
      });

      tSocket.on('end', () => {
        console.log('Telnet connection ended');
      });

      // Write the command to the Telnet server
      tSocket.write(COMMAND + '|' + graphId + '\n', 'utf8');
    });
  } catch (err) {
    return console.log({ code: ErrorCode.ServerError, message: ErrorMsg.ServerError, errorDetails: err });
  }
}
