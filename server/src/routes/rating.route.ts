import { Router } from 'express';

import * as rating from '../controllers/rating.controller';
import { checkAuth, verifyAdminRoot } from '../middleware/verify.middleware';

const router = Router();

router.route('/').get(rating.getAll).post(checkAuth, rating.create);

router
   .route('/:id')
   .put(checkAuth, rating.updateOne)
   .delete(checkAuth, rating.deleteOne);

export default router;
