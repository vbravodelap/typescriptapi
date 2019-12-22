import { Router } from 'express';
const router: Router = Router();
import { TokenValidation } from '../middlewares/verifyToken';
import { store, getCheckups, destroy } from '../controllers/checkup.controller';

router.post('/checkup/store/:requestId', TokenValidation, store);
router.get('/checkups', getCheckups);
router.delete('/checkup/:checkupId', TokenValidation, destroy);

export default router;