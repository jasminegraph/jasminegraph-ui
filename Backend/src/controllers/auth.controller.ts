import { Request, Response } from 'express';
import { Auth } from '../models/auth.model';

const authentcation = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(422).json({ message: 'The fields username and password are required' });
  }

  const credentials = await Auth.findOne({ username: username, password: password }).exec();

  if (credentials) {
    return res.status(200).json({ data: username });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
};

export { authentcation };