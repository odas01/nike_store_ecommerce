import { Router } from 'express';

import * as color from '../controllers/color.controller';
import { checkAuth, verifyAdminRoot } from '../middleware/verify.middleware';

const router = Router();

router
   .route('/')
   .get(color.getAll)
   .post(checkAuth, verifyAdminRoot, color.create);

router
   .route('/:id')
   .put(checkAuth, verifyAdminRoot, color.updateOne)
   .delete(checkAuth, verifyAdminRoot, color.deleteOne);

export default router;
