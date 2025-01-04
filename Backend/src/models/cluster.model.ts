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

type ClusterDocument = Document & {
  name: string;
  description: string;
  host: string;
  port: number;
  userIDs: string[];
  clusterOwner: string;
};

type ClusterInput = {
  name: ClusterDocument['name'];
  description: ClusterDocument['description'];
  host: ClusterDocument['host'];
  port: ClusterDocument['port'];
  userIDs: ClusterDocument['userIDs'];
  clusterOwner: ClusterDocument['clusterOwner'];
};

const clusterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    host: {
      type: String,
      required: true,
    },
    port: {
      type: Number,
      required: true,
    },
    userIDs: {
      type: [String],
      ref: 'User',
    },
    clusterOwner: {
      type: String,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

clusterSchema.index({ host: 1 }, { unique: true });

const Cluster : Model<ClusterDocument> = mongoose.model<ClusterDocument>('Cluster', clusterSchema);

export { Cluster, ClusterInput, ClusterDocument };
