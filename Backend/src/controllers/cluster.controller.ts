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

import { Request, Response } from 'express';

import { Cluster, ClusterInput } from '../models/cluster.model';
import { Token } from '../models/token.model';
import { User } from '../models/user.model';
import { HTTP } from 'src/constants/constants';

const addNewCluster = async (req: Request, res: Response) => {
  const { name, description, host, port, ownerID } = req.body;
  const accessToken = req.headers.authorization?.split(' ')[1];
  try {
    const token = await Token.findOne({ accessToken });
    if (!token) {
      return res.status(HTTP[401]).json({ message: 'Unauthorized' });
    }
    const user = await User.findOne({ _id: token.userId });
    if (!user) {
      return res.status(HTTP[HTTP[404]]).json({ message: 'User not found' });
    }

    const newCluster: ClusterInput = {
      name,
      description,
      host,
      port,
      userIDs: [],
      clusterOwner: token.userId,
    };

    const clusterCreated = await Cluster.create(newCluster);
    
    return res.status(HTTP[201]).json({ data: clusterCreated });
  } catch (err) {
    return res.status(HTTP[200]).send('Server error');
  }

}

const getAllClusters = async (req: Request, res: Response) => {
  const users = await Cluster.find().sort('-createdAt').exec();

  return res.status(HTTP[200]).json({ data: users });
};

const getCluster = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cluster = await Cluster.findOne({ _id: id });

    if (!cluster) {
      return res.status(HTTP[404]).json({ message: `Cluster with id "${id}" not found.` });
    }

    return res.status(HTTP[200]).json({ data: cluster });
  } catch (err) {
    return res.status(HTTP[200]).send('Server error');
  }
};

// get userid and clusterid from request body and add userid into cluster's userIDs array
const addUserToCluster = async (req: Request, res: Response) => {
  const { userID, clusterID } = req.body;

  try {
    const cluster = await Cluster.findOne({ _id: clusterID });

    if (!cluster) {
      return res.status(HTTP[404]).json({ message: `Cluster with id "${clusterID}" not found.` });
    }

    cluster.userIDs.push(userID);
    await cluster.save();

    return res.status(HTTP[200]).json({ data: cluster });
  } catch (err) {
    return res.status(HTTP[200]).send('Server error');
  }
};

// remove userid from cluster's userIDs array
const removeUserFromCluster = async (req: Request, res: Response) => {
  const { userID, clusterID } = req.body;

  try {
    const cluster = await Cluster.findOne({ _id: clusterID });

    if (!cluster) {
      return res.status(HTTP[404]).json({ message: `Cluster with id "${clusterID}" not found.` });
    }

    cluster.userIDs = cluster.userIDs.filter((id) => id !== userID);
    await cluster.save();

    return res.status(HTTP[200]).json({ data: cluster });
  } catch (err) {
    return res.status(HTTP[200]).send('Server error');
  }
};

// getMyClusters - get all clusters where user is owner or user is in userIDs array
const getMyClusters = async (req: Request, res: Response) => {
  const { id: userID } = req.params;

  try {
    const clusters = await Cluster.find({ $or: [{ clusterOwner: userID }, { userIDs: userID }] });

    return res.status(HTTP[200]).json({ data: clusters });
  } catch (err) {
    return res.status(HTTP[200]).send('Server error');
  }
};

export { addNewCluster, getAllClusters, getCluster, addUserToCluster, removeUserFromCluster, getMyClusters };
