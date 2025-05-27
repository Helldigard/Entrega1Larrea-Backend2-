import { Router } from "express";
import userModel from '../services/db/models/user.model.js';
import {authToken} from '../utils.js';
import User from '../../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();


const JWT_SECRET = "tu_secreto_super_seguro";

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
    first_name,
    last_name,
    email,
    age,
    password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: "Usuario registrado con éxito" });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { email: user.email, role: user.role } });
});

////////////
/*
router.get("/:userId", authToken,
async (req, res) =>{
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(202).json({message: "User not found with ID: " + userId});
        }
        res.json(user);
    } catch (error) {
        console.error("Error consultando el usuario con ID: " + userId);
    }
});
/*/

export default router;


