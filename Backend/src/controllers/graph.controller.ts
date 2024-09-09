const { TelnetSocket } = require("telnet-stream");
const net = require("net");
import { Request, Response } from 'express';
import { LIST_COMMAND } from './../constants/frontend.server.constants';

let socket;
let tSocket;

const connectToTelnet = (callback) => {
  // If the global connection is undefined or closed, create a new connection
  if (!socket || socket.destroyed) {
    socket = net.createConnection(7776, "127.0.0.1", () => {
      tSocket = new TelnetSocket(socket);

      tSocket.on("do", (option) => {
        tSocket.writeWont(option);
      });

      tSocket.on("will", (option) => {
        tSocket.writeDont(option);
      });

      console.log("Telnet connection established");
      callback();
    });

    socket.on("error", (err) => {
      console.error("Connection error: " + err.message);
    });

    socket.on("close", () => {
      console.log("Telnet connection closed");
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
      let commandOutput = "";
  
      tSocket.on("data", (buffer) => {
        commandOutput += buffer.toString("utf8");
      });
  
      // Write the command to the Telnet server
      tSocket.write(LIST_COMMAND + "\n", "utf8", () => {
        setTimeout(() => {
          if (commandOutput) {
            console.log(new Date().toLocaleString() + " - " + LIST_COMMAND + " - " + commandOutput);
            res.status(200).send(commandOutput);
          } else {
            res.status(500).send("No response from server");
          }
        }, 500); // Adjust timeout to wait for the server response if needed
      });
    });
  } catch (err) {
    return res.status(500).send('Server error');
  }
}

export { getGraphList };
