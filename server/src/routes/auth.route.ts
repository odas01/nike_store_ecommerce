import { Router } from 'express';

import * as auth from '../controllers/auth.controller';
import { checkAuth, verifyRoot } from '../middleware/verify.middleware';

const router = Router();

router.post('/login', auth.login);
router.post('/signup', auth.signup);

router.post('/admin/login', auth.adminLogin);
router.post('/admin/signup', checkAuth, verifyRoot, auth.adminSignup);

router.post('/googleLogin', auth.googleLogin);

router.get('/authChecker', checkAuth, auth.authChecker);

router.post('/refreshToken', auth.refreshToken);

export default router;
