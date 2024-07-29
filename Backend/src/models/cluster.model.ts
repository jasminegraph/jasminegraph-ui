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
