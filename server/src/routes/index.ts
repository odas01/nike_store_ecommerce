import { Router } from 'express';

import userRoute from './user.route';
import productRoute from './product.route';
import colorRoute from './color.route';
import categoryRoute from './category.route';
import authRoute from './auth.route';
import sizeRoute from './size.route';
import cartRoute from './cart.route';
import variantRoute from './variant.route';
import couponRoute from './coupon.route';
import orderRoute from './order.route';
import ratingRoute from './rating.route';
import messageRoute from './message.route';
import chatRoute from './chat.route';
import overviewRoute from './overview.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/products', productRoute);
router.use('/category', categoryRoute);
router.use('/users', userRoute);
router.use('/colors', colorRoute);
router.use('/sizes', sizeRoute);
router.use('/cart', cartRoute);
router.use('/coupons', couponRoute);
router.use('/variant', variantRoute);
router.use('/orders', orderRoute);
router.use('/ratings', ratingRoute);
router.use('/message', messageRoute);
router.use('/chat', chatRoute);
router.use('/overview', overviewRoute);

export default router;
