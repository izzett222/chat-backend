import { Router } from 'express';
import AuthController from '../controllers/auth';
import Validate from '../validation/validate';

const router = new Router();

router.post('/signup', Validate.registerValidation, AuthController.signup);
router.post('/login', Validate.loginValidation, AuthController.login);

export default router;
