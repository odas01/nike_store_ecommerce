import { Router } from 'express';

import * as chat from '../controllers/chat.controller';
import { checkAuth } from '../middleware/verify.middleware';

const router = Router();

router.route('/').get(checkAuth, chat.get).post(checkAuth, chat.create);

export default router;
