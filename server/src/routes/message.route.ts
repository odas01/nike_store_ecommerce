import { Router } from 'express';

import * as message from '../controllers/message.controller';
import { checkAuth, verifyAdminRoot } from '../middleware/verify.middleware';
import skipLimit from '../middleware/skipLimit.middleware';

const router = Router();

router.route('/').get(checkAuth, message.get).post(checkAuth, message.create);

export default router;
