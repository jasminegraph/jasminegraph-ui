import { Router } from 'express';
import { getAllClusters, getCluster, addNewCluster } from '../controllers/cluster.controller';

const clusterRoute = () => {
  const router = Router();

  router.get('/', getAllClusters);
  router.get('/:id', getCluster);
  router.post('/', addNewCluster);

  return router;
};

export { clusterRoute }