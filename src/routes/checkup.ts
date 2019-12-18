import { Router } from 'express';
const router: Router = Router();
import { TokenValidation } from '../middlewares/verifyToken';
import { store, getCheckups } from '../controllers/checkup.controller';

router.post('/checkup/store', TokenValidation, store);
router.get('/checkups', getCheckups);

export default router;