import mongoose from 'mongoose';
import dotenv from 'dotenv';

mongoose.Promise = global.Promise;
dotenv.config();

const { MONGO_URL } = process.env;

const connectToDatabase = async (): Promise<void> => {
  await mongoose.connect(MONGO_URL ? MONGO_URL : 'mongodb://localhost:27017/jasmine')
 };

export { connectToDatabase };