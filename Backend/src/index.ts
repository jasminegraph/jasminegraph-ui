import express from 'express';
import dotenv from 'dotenv';

import { connectToDatabase } from './databaseConnection';
import { userRoute } from './routes/user.routes';
import { authRoute } from './routes/auth.routes';
import { clusterRoute } from './routes/cluster.routes';
import { graphRoute } from './routes/graph.routes';
import authMiddleware from './middleware/auth.middleware';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '8080');

console.log('MONGO:', process.env.MONGO_URL);

const app = express();

app.use('/public', express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', authRoute());
app.use('/users', userRoute());
app.use('/clusters', authMiddleware,  clusterRoute());
app.use('/graph', graphRoute());

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World!' });
});

// write a endpoint to check backend is running or not
app.get('/ping', (req, res) => {
  return res.json({ message: 'pong' });
});

app.get('/graph', (req, res) => {
  // Run the Python script to generate the graph
  exec('python ./src/script/generate-graph-v1.py', (error, stdout, stderr) => {
      if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).send('Error generating graph');
      }

      // Read the generated HTML file
      fs.readFile(path.join(__dirname, 'graph.html'), 'utf8', (err, data) => {
          if (err) {
              console.error(`readFile error: ${err}`);
              return res.status(500).send('Error reading graph file');
          }

          res.send(data);
      });
  });
});

app.listen(PORT, async () => {
  await connectToDatabase();

  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
