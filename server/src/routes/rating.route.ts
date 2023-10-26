import { Router } from 'express';

import * as rating from '../controllers/rating.controller';
import { checkAuth, verifyAdminRoot } from '../middleware/verify.middleware';
import skipLimit from '../middleware/skipLimit.middleware';

const router = Router();

router.route('/').get(skipLimit, rating.getAll).post(checkAuth, rating.create);

router
   .route('/:id')
   .put(checkAuth, rating.updateOne)
   .delete(checkAuth, rating.deleteOne);

export default router;
