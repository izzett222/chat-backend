import { Router } from 'express';
import authRoute from './auth';
import userRoute from './user';
import friendRoute from './friend';

const router = new Router();
router.use('/auth', authRoute);
router.use('/', userRoute);
router.use('/friend', friendRoute);

export default router;
