import { Router } from 'express';
import passport from 'passport';
import { authorizeRoles } from '../middlewares/authorization.js';

const router = Router();

// Agrega producto al carrito 
router.post(
    '/:cid/products/:pid',
    passport.authenticate('jwt', { session: false }),
    authorizeRoles('user', 'user_premium'),
    (req, res) => {
    const { cid, pid } = req.params;
    res.json({ message: `Producto ${pid} agregado al carrito ${cid}` });
    }
);
// Aca lo veo
router.get(
    '/:cid',
    passport.authenticate('jwt', { session: false }),
    authorizeRoles('user', 'user_premium'),
    (req, res) => {
    const { cid } = req.params;
    res.json({ message: `Carrito ${cid} consultado correctamente.` });
    }
);

export default router;
