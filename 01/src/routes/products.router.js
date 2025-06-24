import { Router } from 'express';
import passport from 'passport';
import { authorizeRoles } from '../middlewares/authorization.js';

const router = Router();

// Crear producto (solo admin)
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    authorizeRoles('admin'),
    (req, res) => {
    const newProduct = req.body;
    console.log('Producto creado:', newProduct);
    res.status(201).json({ message: 'Producto creado', product: newProduct });
    }
);

// Actualizar producto (solo admin)
router.put(
    '/:pid',
    passport.authenticate('jwt', { session: false }),
    authorizeRoles('admin'),
    (req, res) => {
    const { pid } = req.params;
    res.json({ message: `Producto ${pid} actualizado` });
    }
);

// Eliminar producto (solo admin)
router.delete(
    '/:pid',
    passport.authenticate('jwt', { session: false }),
    authorizeRoles('admin'),
    (req, res) => {
    const { pid } = req.params;
    res.json({ message: `Producto ${pid} eliminado` });
    }
);

export default router;

