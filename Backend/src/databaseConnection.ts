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

import mongoose from 'mongoose';
import dotenv from 'dotenv';

mongoose.Promise = global.Promise;
dotenv.config();

const { MONGO_URL } = process.env;

const connectToDatabase = async () => {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await mongoose.connect(MONGO_URL ? MONGO_URL : 'mongodb://mongoCont:27017/jasmine');
      console.log('MongoDB connected');
      return;
    } catch (error) {
      console.log(`MongoDB connection failed (attempt ${retries + 1}). Retrying...`);
      await new Promise(res => setTimeout(res, 3000)); // wait 3 sec
      retries++;
    }
  }

  throw new Error("MongoDB connection failed after several retries");
};

export { connectToDatabase };
