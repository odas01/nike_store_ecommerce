import express from 'express';
import * as product from '../controllers/product.controller';
import * as productColor from '../controllers/variant.controller';

import { checkAuth, verifyAdminRoot } from '../middleware/verify.middleware';
import filterProduct from '../middleware/filterProduct.mdw';
import sortProduct from '../middleware/sortProduct.middleware';

const router = express.Router();

router
   .route('/')
   .get(sortProduct, filterProduct, product.getAll)
   .post(checkAuth, verifyAdminRoot, product.create);

// d: detail
router
   .route('/d/:slug')
   .get(product.getOne)
   .put(checkAuth, verifyAdminRoot, product.updateOne)
   .delete(checkAuth, verifyAdminRoot, product.deleteOne);

router.route('/color').post(checkAuth, verifyAdminRoot, productColor.create);

router
   .route('/color/:id')
   .put(checkAuth, verifyAdminRoot, productColor.updateOne)
   .delete(checkAuth, verifyAdminRoot, productColor.deleteOne);

router
   .route('/color/:id')
   .put(checkAuth, verifyAdminRoot, productColor.updateOne)
   .delete(checkAuth, verifyAdminRoot, productColor.deleteOne);

router
   .route('/color/deleteImages')
   .post(checkAuth, verifyAdminRoot, productColor.deleteImages);

router
   .route('/d/:slug/images')
   .get(product.getOne)
   .put(checkAuth, verifyAdminRoot, product.updateOne)
   .delete(checkAuth, verifyAdminRoot, product.deleteOne);
router.route('/related').get(product.related);

export default router;
