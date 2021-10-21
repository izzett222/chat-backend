import { Router } from 'express';
import Friend from '../controllers/friend';
import Access from '../middlewares/access';

const router = Router();

router.post('/', Access.isloggedIn, Friend.add);
router.patch('/respond', Access.isloggedIn, Friend.respond);
router.get('/', Access.isloggedIn, Friend.getPendingRequests);

export default router;
