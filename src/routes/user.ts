import { Router } from 'express';
const router: Router = Router();
import { store, signin, profile, getUsers, getUser } from '../controllers/user.controller';
import { TokenValidation } from '../middlewares/verifyToken';

router.post('/user/store', store);
router.post('/signin', signin);
router.get('/profile', TokenValidation ,profile);
router.get('/users', getUsers);
router.get('/user/:userId', getUser);

export default router;