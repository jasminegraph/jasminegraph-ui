import mongoose from 'mongoose';
import dotenv from 'dotenv';

mongoose.Promise = global.Promise;
dotenv.config();

const { MONGO_HOST, MONGO_PORT, DB_NAME } = process.env;

const connectToDatabase = async (): Promise<void> => {
  await mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${DB_NAME}`);
};

export { connectToDatabase };