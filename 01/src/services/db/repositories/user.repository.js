import express from "express";
import UserRepository from "../services/db/repositories/user.repository.js";

const router = express.Router();
const userRepo = new UserRepository();

router.post("/register", async (req, res) => {
    try {
    const result = await userRepo.register(req.body);
    res.status(201).send({ message: "Usuario creado", user: result });
    } catch (err) {
    res.status(400).send({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userRepo.login(email, password);
    if (!user) return res.status(401).send({ error: "Credenciales inválidas" });
    res.send({ message: "Login OK", user });
});
