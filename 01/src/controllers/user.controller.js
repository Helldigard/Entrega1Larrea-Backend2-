import UserRepository from '../repositories/user.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRepository = new UserRepository();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export const registerUser = async (req, res) => {
    try {
    const { first_name, last_name, email, age, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await userRepository.createUser({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
    });

    res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
    } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userRepository.getByEmail(email);
        if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const token = jwt.sign({ user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
        }}, JWT_SECRET, { expiresIn: "1h" });

        res
        .cookie("jwtCookieToken", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000 // 1 hora
        })
        .json({ message: "Login exitoso", user: { email: user.email, role: user.role } });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error al hacer login" });
    }
};

