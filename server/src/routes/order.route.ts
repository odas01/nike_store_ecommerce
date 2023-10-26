import { Router } from 'express';

import * as order from '../controllers/order.controller';
import { verifyAdminRoot, checkAuth } from '../middleware/verify.middleware';
import skipLimit from '../middleware/skipLimit.middleware';

const router = Router();

router
   .route('/')
   .get(skipLimit, checkAuth, order.getAll)
   .post(checkAuth, order.create);

router.route('/:id').put(checkAuth, verifyAdminRoot, order.updateOne);

export default router;
