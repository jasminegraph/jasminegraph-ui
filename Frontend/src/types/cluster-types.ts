export interface IClusterDetails {
  name: string;
  version: string;
  creationDate: string;
  clusterId: string;
  nodes: INodeDetails[];
}

export interface INodeDetails {
  nodeID: string;
  IPaddress: string;
  status: boolean;
  role: string;
  upTime: number;
}