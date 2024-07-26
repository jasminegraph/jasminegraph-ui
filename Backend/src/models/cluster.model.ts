import mongoose, { Schema, Model, Document } from 'mongoose';

type ClusterDocument = Document & {
  name: string;
  description: string;
  host: string;
  port: number;
};

type ClusterInput = {
  name: ClusterDocument['name'];
  description: ClusterDocument['description'];
  host: ClusterDocument['host'];
  port: ClusterDocument['port'];
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
  },
  {
    timestamps: true,
  },
);

clusterSchema.index({ host: 1 }, { unique: true });

const Cluster : Model<ClusterDocument> = mongoose.model<ClusterDocument>('Cluster', clusterSchema);

export { Cluster, ClusterInput, ClusterDocument };
