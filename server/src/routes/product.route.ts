import express from 'express';
import * as product from '../controllers/product.controller';
import * as variant from '../controllers/variant.controller';

import { checkAuth, verifyAdminRoot } from '../middleware/verify.middleware';
import filterProduct from '../middleware/filterProduct.mdw';
import sortProduct from '../middleware/sortProduct.middleware';
import { skip } from 'node:test';
import skipLimit from '../middleware/skipLimit.middleware';

const router = express.Router();

router
   .route('/')
   .get(skipLimit, sortProduct, filterProduct, product.getAll)
   .post(checkAuth, verifyAdminRoot, product.create);

// d: detail
router
   .route('/d/:slug')
   .get(product.getOne)
   .put(checkAuth, verifyAdminRoot, product.updateOne)
   .delete(checkAuth, verifyAdminRoot, product.deleteOne);

router
   .route('/d/:slug/similar')
   .get(sortProduct, filterProduct, product.similar, product.getAll);

router
   .route('/deleteImages')
   .post(checkAuth, verifyAdminRoot, variant.deleteImages);

router.route('/count').get(checkAuth, verifyAdminRoot, product.count);

export default router;
