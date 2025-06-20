import passport from 'passport';
import User from '../models/User.js';
import jwtStrategy from 'passport-jwt';
import { PRIVATE_KEY } from '../utils.js';
import { Router } from 'express';

const router = Router();

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwtCookieToken'];
    }
    return token;
};

const initializePassport = () => {
    // Estrategia JWT
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        },
        async (jwt_payload, done) => {
            try {
                // Si guardaste { user } en el token:
                return done(null, jwt_payload.user);

                // Si guardaste { id: user._id } en el token, usá esto en cambio:
                // const user = await userModel.findById(jwt_payload.id);
                // return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Serialización y deserialización
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

// Ruta protegida que devuelve al usuario del token
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        status: 'success',
        user: req.user
    });
});


// Estrategia 1 por cookies
/*
const initializePassport = () => {
    //Estrategia de obtener Token JWT por Cookie:
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), 
            secretOrKey: PRIVATE_KEY
        }, async (jwt_payload, done) => {
            console.log("Entrando a passport Strategy con JWT.");
            try {
                console.log("JWT obtenido del payload");
                console.log(jwt_payload);
                return done(null, jwt_payload.user);
            } catch (error) {
                console.error(error);
                return done(error);
            }
        }
    ));
    //Funciones de Serializacion y Desserializacion
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });
};

const cookieExtractor = req => {
    let token = null;
    console.log("Entrando a Cookie Extractor");
    if (req && req.cookies) { //Validamos que exista el request y las cookies.
        console.log("Cookies presentes: ");
        console.log(req.cookies);
        token = req.cookies['jwtCookieToken'];
        console.log("Token obtenido desde Cookie:");
        console.log(token);
    }
    return token;
};

// remplazo los login con localstrategy
passport.use('jwt', new JwtStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: PRIVATE_KEY
    },

    async (jwt_payload, done) => {
        console.log("Entrando a passport Strategy conJWT.");
        try {
            console.log("JWT obtenido del Payload");
            console.log(jwt_payload);

            return done(null, jwt_payload.user)
        }catch(error) {
            return done(error)
        }
    }
))
*/
export default initializePassport;