/**
Copyright 2024 JasmineGraph Team
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

import { Router } from 'express';
import { login, register, refreshToken } from '../controllers/auth.controller';

const authRoute = () => {
  const router = Router();

  router.post('/login', login);
  router.post('/register', register);
  router.post('/refresh-token', refreshToken);

  return router;
};

export { authRoute };
