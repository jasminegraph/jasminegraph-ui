import { Router } from 'express';
import { getGraphList } from '../controllers/graph.controller';

const graphRoute = () => {
  const router = Router();

  router.get('/list', getGraphList);

  return router;
};

export { graphRoute };