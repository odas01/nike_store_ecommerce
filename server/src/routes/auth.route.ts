import { Router } from 'express';

import * as auth from '../controllers/auth.controller';
import { checkAuth, verifyRoot } from '../middleware/verify.middleware';

const router = Router();

router.post('/login', auth.login);
router.post('/signup', auth.signup);

router.post('/admin/login', auth.adminLogin);
router.post('/admin/signup', checkAuth, verifyRoot, auth.adminSignup);
router.post('/admin/change-password', checkAuth, auth.adminChangePassword);

router.post('/change-password', checkAuth, auth.changePassword);
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password/:id/:token', auth.resetPassword);
router.post('/googleLogin', auth.googleLogin);

router.get('/authChecker', checkAuth, auth.authChecker);

router.post('/refreshToken', auth.refreshToken);

export default router;
