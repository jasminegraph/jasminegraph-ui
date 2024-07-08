import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from '../controllers/user.controller';

const userRoute = () => {
  const router = Router();

  router.post('/', createUser);

  router.get('/', getAllUsers);

  router.get('/:id', getUser);

  router.patch('/:id', updateUser);

  router.delete('/:id', deleteUser);

  return router;
};

export { userRoute };