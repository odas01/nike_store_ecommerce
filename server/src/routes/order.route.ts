import { Router } from 'express';

import * as order from '../controllers/order.controller';
import { verifyAdminRoot, checkAuth } from '../middleware/verify.middleware';

const router = Router();

router
   .route('/')
   .get(checkAuth, verifyAdminRoot, order.getAll)
   .post(checkAuth, order.create);

router
   .route('/:id')
   .get(checkAuth, order.getOne)
   .put(checkAuth, verifyAdminRoot, order.updateOne);
// .delete(checkAuth, verifyAdminRoot, order.deleteOne);

export default router;
