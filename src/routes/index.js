import { Router } from 'express';
import authRoute from './auth';
import userRoute from './user';

const router = new Router();
router.use('/auth', authRoute);
router.use('/me', userRoute);

export default router;
