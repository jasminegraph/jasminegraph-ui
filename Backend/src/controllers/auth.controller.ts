import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserInput } from '../models/user.model';
import { Token } from '../models/token.model';

const generateToken = (userId: string, secret: string, expiresIn: string) => {
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

const register = async (req: Request, res: Response) => {
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
    };
    const userCreated = await User.create(newUser);
    res.status(201).json({ name: userCreated.fullName, email: userCreated.email, _id: userCreated.id });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    // delete other tokens that belogs to this user
    await Token.deleteMany({ userId: user._id });

    const accessToken = generateToken(user.id, 'access_token_secret', '15m');
    const refreshToken = generateToken(user.id, 'refresh_token_secret', '7d');

    const tokenDoc = new Token({
      userId: user._id,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await tokenDoc.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).send('Token is required');
  }

  try {
    const tokenDoc = await Token.findOne({ refreshToken: token });
    if (!tokenDoc) {
      return res.status(401).send('Invalid token');
    }

    if (tokenDoc.expiryDate < new Date()) {
      await Token.deleteOne({ token });
      return res.status(401).send('Token expired');
    }

    const user = jwt.verify(token, 'refresh_token_secret');
    const accessToken = generateToken((user as any).id, 'access_token_secret', '15m');
    const newRefreshToken = generateToken((user as any).id, 'refresh_token_secret', '7d');

    tokenDoc.accessToken = accessToken;
    tokenDoc.refreshToken = newRefreshToken;
    tokenDoc.expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await tokenDoc.save();

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export { login, register, refreshToken };
