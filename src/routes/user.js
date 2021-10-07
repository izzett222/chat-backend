import { Router } from 'express';
import Access from '../middlewares/access';

const router = new Router();
router.get('/', Access.isloggedIn, (req, res) => res.json({
  message: 'user found',
  data: req.user,
}));
export default router;
