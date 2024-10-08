const { TelnetSocket } = require('telnet-stream');
const net = require('net');
import { Request, Response } from 'express';
import { GRAPH_REMOVE_COMMAND, GRAPH_UPLOAD_COMMAND, LIST_COMMAND } from './../constants/frontend.server.constants';
import { ErrorCode, ErrorMsg } from '../constants/error.constants';

let socket;
let tSocket;

const HOST = process.env.SERVER_HOST || '127.0.0.1';
const PORT = parseInt(process.env.SERVER_PORT || '7776');
const DEV_MODE = process.env.DEV_MODE === 'true';

const connectToTelnet = (callback) => {
  // If the global connection is undefined or closed, create a new connection
  if (!socket || socket.destroyed) {
    socket = net.createConnection(PORT, HOST, () => {
      tSocket = new TelnetSocket(socket);

      tSocket.on('do', (option) => {
        tSocket.writeWont(option);
      });

      tSocket.on('will', (option) => {
        tSocket.writeDont(option);
      });

      console.log('Telnet connection established');
      callback();
    });

    socket.on('error', (err) => {
      console.error('Connection error: ' + err.message);
    });

    socket.on('close', () => {
      console.log('Telnet connection closed');
      socket = undefined; // Reset socket when closed
      tSocket = undefined;
    });
  } else {
    callback(); // Use existing connection
  }
};

const getGraphList = async (req: Request, res: Response) => {
  try {
    connectToTelnet(() => {
      let commandOutput = '';

      tSocket.on('data', (buffer) => {
        commandOutput += buffer.toString('utf8');
      });

      // Write the command to the Telnet server
      tSocket.write(LIST_COMMAND + '\n', 'utf8', () => {
        setTimeout(() => {
          if (commandOutput) {
            console.log(new Date().toLocaleString() + ' - ' + LIST_COMMAND + ' - ' + commandOutput);
            res.status(200).send(commandOutput);
          } else {
            res.status(400).send({ code: ErrorCode.NoResponseFromServer, message: ErrorMsg.NoResponseFromServer, errorDetails: "" });
          }
        }, 500); // Adjust timeout to wait for the server response if needed
      });
    });
  } catch (err) {
    return res.status(200).send({ code: ErrorCode.ServerError, message: ErrorMsg.ServerError, errorDetails: err });
  }
};

const uploadGraph = async (req: Request, res: Response) => {
  const { graphName } = req.body;
  const fileName = req.file?.filename;
  const filePath = DEV_MODE ? "http://host.docker.internal:8080/public/" + fileName : fileName; // Get the file path

  console.log(GRAPH_UPLOAD_COMMAND + '|' + graphName + '|' + filePath + '\n');

  try {
    connectToTelnet(() => {
      let commandOutput = "";

      tSocket.on("data", (buffer) => {
        commandOutput += buffer.toString("utf8");
      });

      // Write the command to the Telnet server
      tSocket.write(GRAPH_UPLOAD_COMMAND + '|' + graphName + '|' + filePath + '\n', "utf8", () => {
        setTimeout(() => {
          if (commandOutput) {
            console.log(new Date().toLocaleString() + " - UPLOAD " + req.body.graphName + " - " + commandOutput);
            res.status(200).send(commandOutput);
          } else {
            res.status(400).send({ code: ErrorCode.NoResponseFromServer, message: ErrorMsg.NoResponseFromServer, errorDetails: "" });
          }
        }, 500); // Adjust timeout to wait for the server response if needed
      });
    });
  } catch (err) {
    return res.status(200).send({ code: ErrorCode.ServerError, message: ErrorMsg.ServerError, errorDetails: err });
  }
};

const removeGraph = async (req: Request, res: Response) => {
  try {
    connectToTelnet(() => {
      let commandOutput = '';

      tSocket.on('data', (buffer) => {
        commandOutput += buffer.toString('utf8');
      });

      // Write the command to the Telnet server
      tSocket.write(GRAPH_REMOVE_COMMAND + req.params.id + '\n', 'utf8', () => {
        setTimeout(() => {
          if (commandOutput) {
            console.log(new Date().toLocaleString() + ' - REMOVE ' + req.params.id + ' - ' + commandOutput);
            return res.status(200).send(commandOutput);
          } else {
            return res.status(400).send({ code: ErrorCode.NoResponseFromServer, message: ErrorMsg.NoResponseFromServer, errorDetails: "" });
          }
        }, 5000); // Adjust timeout to wait for the server response if needed
      });
    });
  } catch (err) {
    return res.status(200).send({ code: ErrorCode.ServerError, message: ErrorMsg.ServerError, errorDetails: err });
  }
};

export { getGraphList, uploadGraph, removeGraph };
