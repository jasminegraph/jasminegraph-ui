/**
Copyright 2024 JasminGraph Team
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

const { TelnetSocket } = require('telnet-stream');
const net = require('net');
import { Request, Response } from 'express';
import { 
  GRAPH_REMOVE_COMMAND, 
  GRAPH_UPLOAD_COMMAND, 
  GRAPH_DATA_COMMAND,
  LIST_COMMAND, 
  TRIANGLE_COUNT_COMMAND } from './../constants/frontend.server.constants';
import { ErrorCode, ErrorMsg } from '../constants/error.constants';
import { Cluster } from '../models/cluster.model';
import { HTTP } from '../constants/constants';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import readline from 'readline';
import WebSocket from 'ws';
import { parseGraphFile } from '../utils/graph';

export let socket;
export let tSocket;

export type IConnection = {
  host: string;
  port: number;
}

const DEV_MODE = process.env.DEV_MODE === 'true';

export const getClusterDetails = async (req: Request) => {
  const clusterID = req.header('Cluster-ID');
  const cluster = await Cluster.findOne({ _id: clusterID });
  if (!cluster) {
    return { code: ErrorCode.ClusterNotFound, message: ErrorMsg.ClusterNotFound, errorDetails: '' };
  }else{
    console.log("Cluster Connection Details: ", cluster);
    return {
      port: cluster.port,
      host: cluster.host
    }
  }
}

export const telnetConnection = (connection: IConnection) => (callback: any) => {
  // If the global connection is undefined or closed, create a new connection
  if (!socket || socket.destroyed) {
    socket = net.createConnection(connection.port, connection.host, () => {
      tSocket = new TelnetSocket(socket);

      tSocket.on('do', (option) => {
        tSocket.writeWont(option);
      });

      tSocket.on('will', (option) => {
        tSocket.writeDont(option);
      });

      tSocket.on('error', (err) => {
        console.error(`Telnet connection error: ${err.message}`);
        if (callback) callback(err);  // Call callback with the error
      });

      tSocket.on('close', () => {
        console.log('Telnet connection closed');
        socket = null; // Explicitly set to null to indicate the absence of connection
        tSocket = null;
      });

      tSocket.on('end', () => {
        console.log('Telnet connection ended');
        socket = null; // Explicitly set to null to indicate the absence of connection
        tSocket = null;
      });

      console.log(`Telnet connection established with ${connection.host}:${connection.port}`);
      callback();  // Invoke the callback when connection is ready
    });

    socket.on('error', (err) => {
      console.error(`Socket error: ${err.message}`);
      if (callback) callback(err);  // Call callback with the error
    });
  } else {
    console.log('Using existing Telnet connection');
    callback();  // Use existing connection
  }
};

const getGraphList = async (req: Request, res: Response) => {
  const connection = await getClusterDetails(req);
  if (!(connection.host || connection.port)) {
    return res.status(404).send(connection);
  }
  try {
    telnetConnection({host: connection.host, port: connection.port})(() => {
      let commandOutput = '';

      tSocket.on('data', (buffer) => {
        commandOutput += buffer.toString('utf8');
      });

      // Write the command to the Telnet server
      tSocket.write(LIST_COMMAND + '\n', 'utf8', () => {
        setTimeout(() => {
          if (commandOutput) {
            console.log(new Date().toLocaleString() + ' - ' + LIST_COMMAND + ' - ' + commandOutput);
            res.status(HTTP[200]).send(JSON.parse(commandOutput));
          } else {
            res.status(HTTP[400]).send({ code: ErrorCode.NoResponseFromServer, message: ErrorMsg.NoResponseFromServer, errorDetails: "" });
          }
        }, 500); // Adjust timeout to wait for the server response if needed
      });
    });
  } catch (err) {
    return res.status(HTTP[200]).send({ code: ErrorCode.ServerError, message: ErrorMsg.ServerError, errorDetails: err });
  }
};

const uploadGraph = async (req: Request, res: Response) => {
  const connection = await getClusterDetails(req);
  if (!(connection.host || connection.port)) {
    return res.status(404).send(connection);
  }
  const { graphName } = req.body;
  const fileName = req.file?.filename;
  const filePath = DEV_MODE ? "http://host.docker.internal:8080/public/" + fileName : fileName; // Get the file path

  console.log(GRAPH_UPLOAD_COMMAND + '|' + graphName + '|' + filePath + '\n');

  try {
    telnetConnection({host: connection.host, port: connection.port})(() => {
      let commandOutput = "";

      tSocket.on("data", (buffer) => {
        commandOutput += buffer.toString("utf8");
      });

      // Write the command to the Telnet server
      tSocket.write(GRAPH_UPLOAD_COMMAND + '|' + graphName + '|' + filePath + '\n', "utf8", () => {
        setTimeout(() => {
          if (commandOutput) {
            console.log(new Date().toLocaleString() + " - UPLOAD " + req.body.graphName + " - " + commandOutput);
            res.status(HTTP[200]).send(commandOutput);
          } else {
            res.status(HTTP[400]).send({ code: ErrorCode.NoResponseFromServer, message: ErrorMsg.NoResponseFromServer, errorDetails: ErrorMsg.NoResponseFromServer });
          }
        }, 500); // Adjust timeout to wait for the server response if needed
      });
    });
  } catch (err) {
    return res.status(HTTP[200]).send({ code: ErrorCode.ServerError, message: ErrorMsg.ServerError, errorDetails: err });
  }
};

const removeGraph = async (req: Request, res: Response) => {
  const connection = await getClusterDetails(req);
  if (!(connection.host || connection.port)) {
    return res.status(404).send(connection);
  }
  try {
    telnetConnection({host: connection.host, port: connection.port})(() => {
      let commandOutput = '';

      tSocket.on('data', (buffer) => {
        commandOutput += buffer.toString('utf8');
      });

      // Write the command to the Telnet server
      tSocket.write(GRAPH_REMOVE_COMMAND + '|' + req.params.id + '\n', 'utf8', () => {
        setTimeout(() => {
          if (commandOutput) {
            console.log(new Date().toLocaleString() + ' - REMOVE ' + req.params.id + ' - ' + commandOutput);
            return res.status(HTTP[200]).send(commandOutput);
          } else {
            return res.status(HTTP[400]).send({ code: ErrorCode.NoResponseFromServer, message: ErrorMsg.NoResponseFromServer, errorDetails: "" });
          }
        }, 5000); // Adjust timeout to wait for the server response if needed
      });
    });
  } catch (err) {
    return res.status(HTTP[200]).send({ code: ErrorCode.ServerError, message: ErrorMsg.ServerError, errorDetails: err });
  }
};

const triangleCount = async (req: Request, res: Response) => {
  const connection = await getClusterDetails(req);
  if (!(connection.host || connection.port)) {
    return res.status(HTTP[404]).send(connection);
  }
  const { priority, graph_id } = req.body;
  try {
    telnetConnection({host: connection.host, port: connection.port})(() => {
      let commandOutput = '';

      tSocket.on('data', (buffer) => {
        commandOutput += buffer.toString('utf8');
      });

      console.log(TRIANGLE_COUNT_COMMAND + '|' + graph_id + '|' + priority + '\n');

      // Write the command to the Telnet server
      tSocket.write(TRIANGLE_COUNT_COMMAND + '|' + graph_id + '|' + priority + '\n', 'utf8', () => {
        setTimeout(() => {
          if (commandOutput) {
            console.log(new Date().toLocaleString() + ' - TRIANGLECOUNT - ' + commandOutput);
            res.status(HTTP[200]).send(commandOutput);
          } else {
            res.status(HTTP[400]).send({ code: ErrorCode.NoResponseFromServer, message: ErrorMsg.NoResponseFromServer, errorDetails: "" });
          }
        }, 50000); // Adjust timeout to wait for the server response if needed
      });
    });
  } catch (err) {
    return res.status(HTTP[200]).send({ code: ErrorCode.ServerError, message: ErrorMsg.ServerError, errorDetails: err });
  }
};

const getGraphVisualization = async (req, res) => {
  const filePath = './src/script/sample/sample.dl';
  try{
    const graph = parseGraphFile(filePath);
    return res.status(HTTP[200]).send({data: graph})
  } catch (err){
    return res.status(HTTP[200]).send({ code: ErrorCode.ServerError, message: ErrorMsg.ServerError, errorDetails: err });
  }
}

const getGraphData = async (req, res) => {
  const connection = await getClusterDetails(req);
  if (!(connection.host || connection.port)) {
    return res.status(404).send(connection);
  }
  try {
    telnetConnection({host: connection.host, port: connection.port})(() => {
      let commandOutput = '';

      tSocket.on('data', (buffer) => {
        commandOutput += buffer.toString('utf8');
      });

      // Write the command to the Telnet server
      tSocket.write(GRAPH_DATA_COMMAND + '\n', 'utf8', () => {
        setTimeout(() => {
          if (commandOutput) {
            console.log(new Date().toLocaleString() + ' - ' + GRAPH_DATA_COMMAND + ' - ' + commandOutput);
            res.status(HTTP[200]).send({data: JSON.parse(commandOutput)});
          } else {
            res.status(HTTP[400]).send({ code: ErrorCode.NoResponseFromServer, message: ErrorMsg.NoResponseFromServer, errorDetails: "" });
          }
        }, 500); // Adjust timeout to wait for the server response if needed
      });
    });
  } catch (err) {
    return res.status(HTTP[200]).send({ code: ErrorCode.ServerError, message: ErrorMsg.ServerError, errorDetails: err });
  }
}

export { getGraphList, uploadGraph, removeGraph, triangleCount, getGraphVisualization, getGraphData };
