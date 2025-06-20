import { Router } from 'express';
import User from '../models/User.js';
import {isValidPassword} from '../utils.js';
import passport from 'passport';
import { generateJWToken } from '../utils.js';

import bcrypt from 'bcrypt';

import UserDTO from "../dto/user.dto.js";


const router = Router();

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json({
        status: "success",
        payload: userDTO
    });
});

/////////////////////
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
    user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        first_name: req.user.first_name,
        last_name: req.user.last_name
    }
    });
});
//////////////
router.post("/register", async (req, res) => {
    try {
    const { first_name, last_name, email, age, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
    }
});
///////////////

router.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email: email});
        console.log("Usuario encontrado para login:");
        console.log(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(204).send({error: "Not found", message: "Usuario no encontrado con username: " + email});
        }
        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({status:"error",error:"El usuario y la contraseña no coinciden!"});
        }
        const tokenUser= {
            name : `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);
        console.log(access_token);
        res.send({message: "Login successful!", access_token: access_token});
    } catch (error) {
        console.error(error);
        return res.status(500).send({status:"error",error:"Error interno de la applicacion."});
    }
    
});

export default router;
