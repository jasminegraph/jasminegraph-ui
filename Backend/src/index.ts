/**
Copyright 2024 JasmineGraph Team
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

import express from 'express';
import dotenv from 'dotenv';
import http from 'http';

import { connectToDatabase } from './databaseConnection';
import { userRoute } from './routes/user.routes';
import { authRoute } from './routes/auth.routes';
import { queryRoute } from './routes/query.routes';
import { clusterRoute } from './routes/cluster.routes';
import { graphRoute } from './routes/graph.routes';
import authMiddleware from './middleware/auth.middleware';
import clusterMiddleware from './middleware/cluster.middleware';
import { setupWebSocket } from './controllers/socket.controller';

dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '8080');

console.log('MONGO:', process.env.MONGO_URL);

const app = express();

// Create an HTTP server
const server = http.createServer(app);

setupWebSocket(server);

app.use('/public', express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', authRoute());
app.use('/users', userRoute());
app.use('/clusters', authMiddleware,  clusterRoute());
app.use('/graph', clusterMiddleware, graphRoute());
app.use('/query', clusterMiddleware, queryRoute());

// write an endpoint to check backend is running or not
app.get('/ping', (req, res) => {
  return res.json({ message: 'pong' });
});

server.listen(PORT, async () => {
  await connectToDatabase();

  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
  console.log(`WebSocket server is also available at ws://localhost:${PORT}`);
});
