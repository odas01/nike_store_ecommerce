import express from 'express';

import * as cart from '../controllers/cart.controller';
import { checkAuth } from '../middleware/verify.middleware';

const router = express.Router();

router
   .route('/')
   .get(checkAuth, cart.getOne)
   .post(checkAuth, cart.create)
   .delete(checkAuth, cart.deleteItems);

router.route('/:itemId').put(checkAuth, cart.updateItem);

export default router;
