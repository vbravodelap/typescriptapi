import { Router } from 'express';
const router: Router = Router();
import { store, signin, profile, getUsers, getUser, whoiam } from '../controllers/user.controller';
import { TokenValidation } from '../middlewares/verifyToken';
import { check, validationResult } from 'express-validator';

router.post('/user/store', [
    check('email').not().isEmpty().isEmail().withMessage('El correo electronico es requerido'),
    check('password').not().isEmpty().withMessage('La contraseña es requerida')
], store);

router.post('/signin', [
    check('email').not().isEmpty().isEmail().withMessage('El correo electronico es requerido'),
    check('password').not().isEmpty().withMessage('La contraseña es requerida')
], signin);

router.get('/profile', TokenValidation ,profile);
router.get('/users', getUsers);
router.get('/user/:userId', getUser);
router.get('/whoiam', TokenValidation, whoiam);

export default router;