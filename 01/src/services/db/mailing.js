import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    },
});

export const sendRecoveryMail = async (email, token) => {
    const link = `http://localhost:9090/reset-password?token=${token}`;
    return transporter.sendMail({
    from: 'Ecommerce Backend <no-reply@example.com>',
    to: email,
    subject: 'Restablecer contraseña',
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${link}">Restablecer contraseña</a>
            <p>Este enlace expirará en 1 hora.</p>`
    });
};
