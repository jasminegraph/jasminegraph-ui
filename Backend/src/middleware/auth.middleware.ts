import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access denied');
    }
    try {
        const decoded = jwt.verify(token, 'access_token_secret');
        req.body = { ...req.body, ...decoded };
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

export default authMiddleware;