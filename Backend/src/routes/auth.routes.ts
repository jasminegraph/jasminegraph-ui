import { Router } from 'express';
import { login, register, refreshToken } from '../controllers/auth.controller';

const authRoute = () => {
  const router = Router();

  router.post('/login', login);
  router.post('/register', register);
  router.post('/refresh-token', refreshToken);

  return router;
};

export { authRoute }