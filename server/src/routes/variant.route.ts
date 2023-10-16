import { Router } from 'express';

import * as variant from '../controllers/variant.controller';
import { verifyAdminRoot, checkAuth } from '../middleware/verify.middleware';

const router = Router();

router.route('/').post(checkAuth, variant.create);

router
   .route('/:id')
   .put(checkAuth, verifyAdminRoot, variant.updateOne)
   .delete(checkAuth, verifyAdminRoot, variant.deleteOne);

export default router;
