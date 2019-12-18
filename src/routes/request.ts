import { Router } from 'express';
const router: Router = Router();
import { store, getRequests, getRequest } from '../controllers/request.controller';
import { TokenValidation } from '../middlewares/verifyToken';

router.post('/request/store', TokenValidation, store);
router.get('/requests', getRequests);
router.get('/request/:requestId', getRequest);

export default router;