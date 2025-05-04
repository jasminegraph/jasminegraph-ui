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

import mongoose, { Schema, Model, Document } from 'mongoose';

type TokenDocument = Document & {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiryDate: Date;
};

type TokenInput = {
  userId: TokenDocument['userId'];
  accessToken: TokenDocument['accessToken'];
  refreshToken: TokenDocument['refreshToken'];
  expiryDate: TokenDocument['expiryDate'];
};

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

tokenSchema.index({createdAt: 1}, {expireAfterSeconds: 7*24*60*60});

const Token: Model<TokenDocument> = mongoose.model<TokenDocument>('Token', tokenSchema);

export { Token, TokenInput, TokenDocument };
