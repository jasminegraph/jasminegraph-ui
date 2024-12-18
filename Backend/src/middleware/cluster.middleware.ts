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

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const clusterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const cluster = req.header('Cluster-ID');
    if (!cluster) {
        return res.status(401).send('Missing Cluster-ID');
    }
};

export default clusterMiddleware;
