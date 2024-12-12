/**
Copyright 2024 JasminGraph Team
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { User, UserInput } from '../models/user.model';
import { Token } from '../models/token.model';
import { HTTP } from '../constants/constants';

const registerAdminUser = async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;
  if (!email || !fullName || !password) {
    return res.status(HTTP[422]).json({ message: 'The fields email, full name and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(HTTP[400]).send('User already exists');
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
    res.status(HTTP[201]).json({ name: userCreated.fullName, email: userCreated.email, _id: userCreated.id });
  } catch (err) {
    res.status(HTTP[500]).send('Server error');
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().sort('-createdAt').exec();

  return res.status(HTTP[200]).json({ data: users });
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id }).exec();

  if (!user) {
    return res.status(HTTP[404]).json({ message: `User with id "${id}" not found.` });
  }

  return res.status(HTTP[200]).json({ data: user });
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { enabled, fullName, role } = req.body;

  const user = await User.findOne({ _id: id });

  if (!user) {
    return res.status(HTTP[404]).json({ message: `User with id "${id}" not found.` });
  }

  if (!fullName || !role) {
    return res.status(HTTP[422]).json({ message: 'The fields full name and role are required' });
  }

  await User.updateOne({ _id: id }, { enabled, fullName, role });

  const userUpdated = await User.findById(id);

  return res.status(HTTP[200]).json({ data: userUpdated });
};

// getUserByToken will return user by accessToken in the authorization header
const getUserByToken = async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  const token = await Token.findOne({ accessToken });
  if (!token) {
    return res.status(HTTP[401]).json({ message: 'Unauthorized' });
  }
  const user = await User.findOne({ _id: token.userId });
  if (!user) {
    return res.status(HTTP[404]).json({ message: 'User not found' });
  }

  return res.status(HTTP[200]).json({ data: {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    enabled: user.enabled,
  }});  
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  return res.status(HTTP[200]).json({ message: `User deleted successfully. ID: ${id}` });
};

// get ids from array and return users array
const getUsersFromIDs = async (req: Request, res: Response) => {
  const { ids } = req.body;

  const users = await User.find({ _id: { $in: ids } }).exec();

  return res.status(HTTP[200]).json({ data: users });
}

export { registerAdminUser, deleteUser, getAllUsers, getUser, updateUser, getUserByToken, getUsersFromIDs };
