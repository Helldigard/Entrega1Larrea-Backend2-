import { Router } from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendRecoveryMail } from '../services/mailing.js';

const router = Router();
const SECRET = process.env.JWT_SECRET || 'CoderResetKey';

// Solicita la password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: 'Usuario no encontrado' });

    const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
    await sendRecoveryMail(email, token);
    res.send({ status: 'ok', message: 'Correo de recuperación enviado' });
});

// Muestra formulario
router.get('/reset-password', (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).send("Token no proporcionado.");
    res.render('reset-password', { token });
});

// Guarda nueva password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, SECRET);
        const user = await User.findOne({ email: decoded.email });

        const isSame = bcrypt.compareSync(newPassword, user.password);
        if (isSame) return res.status(400).send({ error: "No puedes usar la misma contraseña anterior" });

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.send({ status: "success", message: "Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(400).send({ error: "Token inválido o expirado" });
    }
});

export default router;




