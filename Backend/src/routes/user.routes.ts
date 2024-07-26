import { Router } from 'express';
import { registerAdminUser, deleteUser, getAllUsers, getUser, updateUser } from '../controllers/user.controller';

const userRoute = () => {
  const router = Router();

  router.get('/', getAllUsers);
  
  router.post('/admin', registerAdminUser);

  router.get('/:id', getUser);

  router.patch('/:id', updateUser);

  router.delete('/:id', deleteUser);

  return router;
};

export { userRoute };