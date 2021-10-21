import { Router } from 'express';
import Access from '../middlewares/access';
import User from '../controllers/user';

const router = new Router();
router.get('/me', Access.isloggedIn, (req, res) => res.json({
  message: 'user found',
  data: req.user,
}));
router.get('/', Access.isloggedIn, User.getUser);
export default router;
