import { Router } from 'express';
import { getAllClusters, getCluster, addNewCluster, addUserToCluster, removeUserFromCluster, getMyClusters } from '../controllers/cluster.controller';

const clusterRoute = () => {
  const router = Router();

  router.get('/', getAllClusters);
  router.get('/:id', getCluster);
  router.post('/', addNewCluster);
  router.post('/addUser', addUserToCluster);
  router.post('/removeUser', removeUserFromCluster);
  router.get('/myClusters/:id', getMyClusters);

  return router;
};

export { clusterRoute };