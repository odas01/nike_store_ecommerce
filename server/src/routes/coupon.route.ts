import { Router } from 'express';

import * as coupon from '../controllers/coupon.controller';
import { checkAuth, verifyAdminRoot } from '../middleware/verify.middleware';

const router = Router();

router
   .route('/')
   .get(coupon.getAll)
   .post(checkAuth, verifyAdminRoot, coupon.create);

router
   .route('/:id')
   .get(coupon.checkOne)
   .put(checkAuth, verifyAdminRoot, coupon.updateOne)
   .delete(checkAuth, verifyAdminRoot, coupon.deleteOne);

export default router;
