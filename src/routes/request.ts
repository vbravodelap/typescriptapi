import { Router } from 'express';
const router: Router = Router();
import { store, getRequests } from '../controllers/request.controller';
import { TokenValidation } from '../middlewares/verifyToken';

router.post('/request/store', TokenValidation, store);
router.get('/requests', getRequests);

export default router;