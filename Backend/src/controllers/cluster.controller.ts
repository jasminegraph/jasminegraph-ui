import { Request, Response } from 'express';
import crypto from 'crypto';

import { Cluster, ClusterInput } from '../models/cluster.model';

const addNewCluster = async (req: Request, res: Response) => {
  const { name, description, host, port } = req.body;
  console.log(req.body);
  try {
    const newCluster: ClusterInput = {
      name,
      description,
      host,
      port
    };

    const clusterCreated = await Cluster.create(newCluster);
    
    return res.status(201).json({ data: clusterCreated });
  } catch (err) {
    return res.status(500).send('Server error');
  }

}

const getAllClusters = async (req: Request, res: Response) => {
  const users = await Cluster.find().sort('-createdAt').exec();

  return res.status(200).json({ data: users });
};

const getCluster = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cluster = await Cluster.findOne({ _id: id });

    if (!cluster) {
      return res.status(404).json({ message: `Cluster with id "${id}" not found.` });
    }

    return res.status(200).json({ data: cluster });
  } catch (err) {
    return res.status(500).send('Server error');
  }
};

export { addNewCluster, getAllClusters, getCluster };
