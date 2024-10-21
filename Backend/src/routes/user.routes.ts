import { Router } from 'express';
import { registerAdminUser, deleteUser, getAllUsers, getUser, updateUser, getUserByToken, getUsersFromIDs } from '../controllers/user.controller';

const userRoute = () => {
  const router = Router();

  router.get('/', getAllUsers);
  router.get('/token', getUserByToken)
  router.post('/admin', registerAdminUser);
  router.post('/ids', getUsersFromIDs);
  router.get('/:id', getUser);
  router.patch('/:id', updateUser);
  router.delete('/:id', deleteUser);

  return router;
};

export { userRoute };