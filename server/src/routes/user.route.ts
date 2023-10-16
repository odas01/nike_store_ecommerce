import express from 'express';

import * as user from '../controllers/user.controller';
import {
   verifyAdminRoot,
   checkAuth,
   verifyRoot,
} from '../middleware/verify.middleware';

const router = express.Router();

router.route('/').get(checkAuth, verifyAdminRoot, user.getAll);

// CRUD USER
router.route('/:id/block').put(checkAuth, verifyAdminRoot, user.blockOne);

router
   .route('/:id')
   .get(checkAuth, user.getOne)
   .put(checkAuth, user.updateOne)
   .delete(checkAuth, verifyAdminRoot, user.deleteOne);

// CRUD ADMIN
router.route('/:id/admin/block').put(checkAuth, verifyRoot, user.blockOne);

router
   .route('/:id/admin')
   .get(checkAuth, verifyRoot, user.getOne)
   .put(checkAuth, verifyRoot, user.updateOne)
   .delete(checkAuth, verifyRoot, user.deleteOne);

export default router;
