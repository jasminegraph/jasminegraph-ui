import { Router } from 'express';
import { authentcation } from '../controllers/auth.controller';

const authRoute = () => {
  const router = Router();

  router.post('/login', authentcation);

  return router;
};

export { authRoute }