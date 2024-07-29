import express from 'express';
import dotenv from 'dotenv';

import { connectToDatabase } from './databaseConnection';
import { userRoute } from './routes/user.routes';
import { authRoute } from './routes/auth.routes';
import { clusterRoute } from './routes/cluster.routes';
import authMiddleware from './middleware/auth.middleware';

dotenv.config();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '8080');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', authRoute());
app.use('/users', userRoute());
app.use('/clusters', authMiddleware,  clusterRoute());

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World!' });
});

// write a endpoint to check backend is running or not
app.get('/ping', (req, res) => {
  return res.json({ message: 'pong' });
});

app.listen(PORT, async () => {
  await connectToDatabase();

  console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});
