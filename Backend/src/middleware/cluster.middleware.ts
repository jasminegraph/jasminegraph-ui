import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const clusterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const cluster = req.header('Cluster-ID');
    if (!cluster) {
        return res.status(401).send('Missing Cluster-ID');
    }
};

export default clusterMiddleware;