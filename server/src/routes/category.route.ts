import { Router } from 'express';

import * as category from '../controllers/category.controller';
import { checkAuth, verifyAdminRoot } from '../middleware/verify.middleware';

const router = Router();

router
   .route('/')
   .get(category.getAll)
   .post(checkAuth, verifyAdminRoot, category.create);

router
   .route('/:id')
   .put(checkAuth, verifyAdminRoot, category.updateOne)
   .delete(checkAuth, verifyAdminRoot, category.deleteOne);

export default router;
