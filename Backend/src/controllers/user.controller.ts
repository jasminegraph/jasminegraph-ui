import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { User, UserInput } from '../models/user.model';

const registerAdminUser = async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;
  if (!email || !fullName || !password) {
    return res.status(422).json({ message: 'The fields email, fullNamea and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send('User already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: UserInput = {
      email,
      password: hashedPassword,
      enabled: true,
      fullName,
      role: 'admin',
    };
    const userCreated = await User.create(newUser);
    res.status(201).json({ name: userCreated.fullName, email: userCreated.email, _id: userCreated.id });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().sort('-createdAt').exec();

  return res.status(200).json({ data: users });
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id }).exec();

  if (!user) {
    return res.status(404).json({ message: `User with id "${id}" not found.` });
  }

  return res.status(200).json({ data: user });
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { enabled, fullName, role } = req.body;

  const user = await User.findOne({ _id: id });

  if (!user) {
    return res.status(404).json({ message: `User with id "${id}" not found.` });
  }

  if (!fullName || !role) {
    return res.status(422).json({ message: 'The fields fullName and role are required' });
  }

  await User.updateOne({ _id: id }, { enabled, fullName, role });

  const userUpdated = await User.findById(id);

  return res.status(200).json({ data: userUpdated });
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  return res.status(200).json({ message: 'User deleted successfully.' });
};

export { registerAdminUser, deleteUser, getAllUsers, getUser, updateUser };