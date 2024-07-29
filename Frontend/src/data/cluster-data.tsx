import { IClusterDetails } from "@/types/cluster-types";

const sampleNodeData = [
  {
    nodeID: "master-123",
    IPaddress: "192.168.2.34",
    status: true,
    role: "Master",
    upTime: 10,
  },
  {
    nodeID: 'worker-001',
    status: true,
    IPaddress: "192.168.1.2",
    role: "Worker",
    upTime: 45,
  },
  {
    nodeID: 'worker-002',
    status: false,
    IPaddress: "192.168.1.3",
    role: "Worker",
    upTime: 43,
  },
  {
    nodeID: 'worker-003',
    status: true,
    IPaddress: "192.168.1.4",
    role: "Worker",
    upTime: 38,
  }
];

export const ClusterData = [
  {
    name: "Default Cluster",
    version: "2.3.52",
    creationDate: "04/12/2023",
    clusterId: "6dc2ea20-9ea3-47cd-a5a9-25ac4b24c79e",
    nodes: sampleNodeData,
  },
  {
    name: "Cluster 1",
    version: "2.3.52",
    creationDate: "04/12/2023",
    clusterId: "6dc2ea20-9ea3-47cd-a5a9-25ac4b24c79e",
    nodes: sampleNodeData,
  },
];
