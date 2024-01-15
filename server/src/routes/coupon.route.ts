import { Router } from 'express';

import * as coupon from '../controllers/coupon.controller';
import { checkAuth, verifyAdminRoot } from '../middleware/verify.middleware';
import skipLimit from '../middleware/skipLimit.middleware';

const router = Router();

router
   .route('/')
   .get(skipLimit, coupon.getAll)
   .post(checkAuth, verifyAdminRoot, coupon.create);

router
   .route('/:id')
   .get(checkAuth, coupon.checkOne)
   .put(checkAuth, verifyAdminRoot, coupon.updateOne)
   .delete(checkAuth, verifyAdminRoot, coupon.deleteOne);

router.route('/:id/send').post(checkAuth, coupon.send);

export default router;
