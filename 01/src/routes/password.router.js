import { Router } from 'express';
import User from '../services/db/daos/models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendRecoveryMail } from '../services/mailing.js';

const router = Router();
const SECRET = process.env.JWT_SECRET || 'CoderResetKey';

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: 'Usuario no encontrado' });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });

    const resetLink = `http://localhost:9090/api/password/reset-password?token=${token}`;
    await sendRecoveryMail(email, resetLink);

    res.send({ status: 'ok', message: 'Correo de recuperación enviado' });
});

router.get('/reset-password', (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).send("Token no proporcionado");
    res.render('reset-password', { token });
});

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, SECRET);

        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).send({ error: "Usuario no encontrado" });

        const isSame = bcrypt.compareSync(newPassword, user.password);
        if (isSame) {
            return res.status(400).send({ error: "No puedes usar la misma contraseña anterior" });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.send({ status: "success", message: "Contraseña actualizada correctamente" });

    } catch (error) {
        console.error("Token inválido o expirado:", error);
        res.status(400).send({ error: "Token inválido o expirado" });
    }
});

export default router;





