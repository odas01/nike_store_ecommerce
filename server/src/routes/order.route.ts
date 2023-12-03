import { Router } from 'express';

import * as order from '../controllers/order.controller';
import { verifyAdminRoot, checkAuth } from '../middleware/verify.middleware';
import skipLimit from '../middleware/skipLimit.middleware';

const router = Router();

router
   .route('/')
   .get(skipLimit, checkAuth, order.getAll)
   .post(checkAuth, order.create);

router.route('/create-payment').post(checkAuth, order.vnPay, order.create);

router.route('/dashboard-count').get(checkAuth, order.dashboardCount);
router.route('/dashboard-amount').get(order.dashboardAmount);
router.route('/dashboard-chart').get(checkAuth, order.dashboardChart);

router
   .route('/:id')
   .put(checkAuth, verifyAdminRoot, order.updateOne)
   .delete(checkAuth, verifyAdminRoot, order.deleteOne);

export default router;
