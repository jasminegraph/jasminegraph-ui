export interface IClusterDetails {
  _id: string;
  name: string;
  description: string;
  host: string;
  port: number;
  userIDs: string[];
  clusterOwner: string;
  createdAt: string;
  updatedAt: string;
}
