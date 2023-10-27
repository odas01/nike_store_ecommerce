import { Router } from 'express';

import * as overview from '../controllers/overview.controller';
import { verifyAdminRoot, checkAuth } from '../middleware/verify.middleware';

const router = Router();

router.route('/order').get(checkAuth, verifyAdminRoot, overview.order);

export default router;
