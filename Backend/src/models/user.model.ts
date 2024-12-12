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

import mongoose, { Schema, Model, Document } from 'mongoose';

type UserDocument = Document & {
  fullName: string;
  email: string;
  password: string;
  enabled: boolean;
  role: string;
};

type UserInput = {
  fullName: UserDocument['fullName'];
  email: UserDocument['email'];
  password: UserDocument['password'];
  enabled: UserDocument['enabled'];
  role: UserDocument['role'];
};

const usersSchema = new Schema(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    enabled: {
      type: Schema.Types.Boolean,
      default: true,
    },
    role: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  },
);

usersSchema.index({ email: 1 }, { unique: true });

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', usersSchema);

export { User, UserInput, UserDocument };