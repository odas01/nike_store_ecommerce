import { Router } from 'express';

import * as size from '../controllers/size.controller';
import { checkAuth, verifyAdminRoot } from '../middleware/verify.middleware';

const router = Router();

router
   .route('/')
   .get(size.getAll)
   .post(checkAuth, verifyAdminRoot, size.create);

router
   .route('/:id')
   .put(checkAuth, verifyAdminRoot, size.updateOne)
   .delete(checkAuth, verifyAdminRoot, size.deleteOne);

export default router;
